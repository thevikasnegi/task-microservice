import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import taskRoutes from './routes/task.router';
import { connectRabbitMQ } from './services/rabbitmq.service';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/tasks', taskRoutes);

const startServer = async () => {
  try {
    const mongoUri = process.env["MONGO_URI"] as string;
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    await connectRabbitMQ();
    console.log('Connected to RabbitMQ');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
