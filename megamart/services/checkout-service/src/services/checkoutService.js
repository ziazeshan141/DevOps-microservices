const {requestJson,authHeaders,internalHeaders}=require('../lib/http');
const u=(key,fallback)=>process.env[key]||fallback;
async function checkout(req){
 const auth=authHeaders(req), userId=req.user.sub;
 if(!req.body.addressId){const e=new Error('addressId is required');e.status=400;throw e}
 await requestJson(`${u('ADDRESS_SERVICE_URL','http://localhost:3018')}/api/v1/addresses/${req.body.addressId}`,{headers:auth});
 const cart=await requestJson(`${u('CART_SERVICE_URL','http://localhost:3006')}/api/v1/cart`,{headers:auth});
 if(!cart.items?.length){const e=new Error('Cart is empty');e.status=400;throw e}
 const items=[]; let subtotal=0;
 for(const item of cart.items){const [product,price]=await Promise.all([requestJson(`${u('PRODUCT_SERVICE_URL','http://localhost:3003')}/api/v1/products/${item.product_id}`),requestJson(`${u('PRICING_SERVICE_URL','http://localhost:3015')}/api/v1/pricing/${item.product_id}`)]);const unit=Number(price.effective_price);items.push({productId:item.product_id,sku:product.sku,name:product.name,quantity:item.quantity,unitPrice:unit,lineTotal:Number((unit*item.quantity).toFixed(2))});subtotal+=unit*item.quantity}
 subtotal=Number(subtotal.toFixed(2)); let promotion={discount:0};
 if(req.body.promotionCode){promotion=await requestJson(`${u('PROMOTION_SERVICE_URL','http://localhost:3016')}/api/v1/promotions/validate`,{method:'POST',headers:auth,body:JSON.stringify({code:req.body.promotionCode,subtotal})})}
 const discount=Number(promotion.discount||0),total=Number((subtotal-discount).toFixed(2));
 const fraud=await requestJson(`${u('FRAUD_SERVICE_URL','http://localhost:3024')}/internal/fraud/check`,{method:'POST',headers:internalHeaders(),body:JSON.stringify({userId,amount:total,paymentMethod:req.body.paymentMethod})});
 if(fraud.decision==='reject'){const e=new Error('Checkout rejected by fraud screening');e.status=409;e.code='FRAUD_REJECTED';throw e}
 const reserved=[];
 try{
  for(const item of items){await requestJson(`${u('INVENTORY_SERVICE_URL','http://localhost:3005')}/api/v1/inventory/${item.productId}/reserve`,{method:'POST',headers:internalHeaders(),body:JSON.stringify({quantity:item.quantity})});reserved.push(item)}
  const payment=await requestJson(`${u('PAYMENT_SERVICE_URL','http://localhost:3008')}/internal/payments/charge`,{method:'POST',headers:internalHeaders(),body:JSON.stringify({userId,amount:total,currency:req.body.currency||'USD',paymentMethod:req.body.paymentMethod})});
  const order=await requestJson(`${u('ORDER_SERVICE_URL','http://localhost:3007')}/internal/orders`,{method:'POST',headers:internalHeaders(),body:JSON.stringify({userId,currency:req.body.currency||'USD',subtotal,discount,total,addressId:req.body.addressId,paymentId:payment.id,items})});
  const shipping=await requestJson(`${u('SHIPPING_SERVICE_URL','http://localhost:3009')}/internal/shipments`,{method:'POST',headers:internalHeaders(),body:JSON.stringify({orderId:order.id,userId,addressId:req.body.addressId})});
  await requestJson(`${u('NOTIFICATION_SERVICE_URL','http://localhost:3010')}/internal/notifications`,{method:'POST',headers:internalHeaders(),body:JSON.stringify({userId,template:'order-confirmed',data:{orderId:order.id,total,trackingNumber:shipping.tracking_number}})}).catch(()=>null);
  await requestJson(`${u('ANALYTICS_SERVICE_URL','http://localhost:3023')}/internal/analytics/events`,{method:'POST',headers:internalHeaders(),body:JSON.stringify({userId,eventType:'checkout.completed',source:'checkout-service',payload:{orderId:order.id,total}})}).catch(()=>null);
  await requestJson(`${u('CART_SERVICE_URL','http://localhost:3006')}/api/v1/cart`,{method:'DELETE',headers:auth});
  return{order,payment,shipping,fraud,totals:{subtotal,discount,total}};
 }catch(error){for(const item of reserved){await requestJson(`${u('INVENTORY_SERVICE_URL','http://localhost:3005')}/api/v1/inventory/${item.productId}/release`,{method:'POST',headers:internalHeaders(),body:JSON.stringify({quantity:item.quantity})}).catch(()=>null)}throw error}
}
module.exports={checkout};