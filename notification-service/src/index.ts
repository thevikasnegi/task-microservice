import { connectToRabbitMQ } from './services/rabbitmq.service';
import dotenv from 'dotenv';
dotenv.config();

async function sub() {
    console.log('Starting Notification Service...');
    await connectToRabbitMQ();
}

sub()
