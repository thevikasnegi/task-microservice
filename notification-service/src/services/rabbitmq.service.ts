import amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const QUEUE_NAME = process.env.QUEUE_NAME || 'task-queue';

export const connectToRabbitMQ = async () => {
    try {
        const conn = await amqp.connect(RABBITMQ_URL);
        const channel = await conn.createChannel();
        await channel.assertQueue(QUEUE_NAME);

        console.log(`Listening to queue: ${QUEUE_NAME}`);

        channel.consume(QUEUE_NAME, (msg) => {
            if (msg) {
                const content = msg.content.toString();
                const data = JSON.parse(content);

                switch (data.event) {
                    case "task_created":
                        console.log(`Task Created: ${data.task}`);
                        break;
                    case "task_updated":
                        console.log(`Task Updated: ${data.task} → ${data.task.status}`);
                    default:
                        break;

                }
                channel.ack(msg);
            }
        });
    } catch (err) {
        console.error('RabbitMQ connection failed:', err);
        process.exit(1);
    }
};
