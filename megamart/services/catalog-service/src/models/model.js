const {query}=require('../config/database');
const writable=["name", "slug", "parent_id", "description", "status"];
function values(data){ return writable.map(k=>data[k] ?? data[k.replace(/_([a-z])/g,(_,c)=>c.toUpperCase())] ?? null); }
async function create(data){return (await query('INSERT INTO categories(name,slug,parent_id,description,status) VALUES($1,$2,$3,$4,$5) RETURNING *',values(data))).rows[0]}
async function list(limit=50,offset=0){return (await query('SELECT * FROM categories ORDER BY created_at DESC LIMIT $1 OFFSET $2',[Math.min(Number(limit)||50,200),Number(offset)||0])).rows}
async function get(id){return (await query('SELECT * FROM categories WHERE id=$1',[id])).rows[0]}
async function update(id,data){const entries=writable.filter(k=>data[k]!==undefined||data[k.replace(/_([a-z])/g,(_,c)=>c.toUpperCase())]!==undefined); if(!entries.length)return get(id); const sets=entries.map((k,i)=>`${k}=$${i+2}`).join(','); const vals=entries.map(k=>data[k]??data[k.replace(/_([a-z])/g,(_,c)=>c.toUpperCase())]); return (await query(`UPDATE categories SET ${sets}, updated_at=now() WHERE id=$1 RETURNING *`,[id,...vals])).rows[0]}
async function remove(id){return (await query('DELETE FROM categories WHERE id=$1 RETURNING id',[id])).rows[0]}
module.exports={create,list,get,update,remove};
