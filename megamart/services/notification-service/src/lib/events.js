let amqp;
let connection;
let channel;

async function getChannel() {
  if (!process.env.RABBITMQ_URL) return null;
  if (!amqp) amqp = require('amqplib');
  if (channel) return channel;
  connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertExchange(process.env.EVENT_EXCHANGE || 'megamart.events', 'topic', { durable: true });
  connection.on('close', () => { connection = null; channel = null; });
  return channel;
}

async function publishEvent(routingKey, payload) {
  try {
    const ch = await getChannel();
    if (!ch) return false;
    ch.publish(process.env.EVENT_EXCHANGE || 'megamart.events', routingKey,
      Buffer.from(JSON.stringify({ ...payload, emittedAt: new Date().toISOString() })),
      { contentType: 'application/json', persistent: true });
    return true;
  } catch (error) {
    console.warn('RabbitMQ publish skipped:', error.message);
    return false;
  }
}

module.exports = { publishEvent, getChannel };
