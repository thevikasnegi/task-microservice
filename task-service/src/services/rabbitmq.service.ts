import amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const QUEUE_NAME = process.env.QUEUE_NAME || 'task-queue';

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
  const connection = await amqp.connect(RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: true });
};

export const sendToQueue = async (queueName: string, message: any) => {
  if (!channel) throw new Error('RabbitMQ channel not established');
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
};
