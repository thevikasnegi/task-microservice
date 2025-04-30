import { Request, Response } from 'express';
import Task from '../models/task.model';
import { sendToQueue } from '../services/rabbitmq.service';

export const createTask = async (req: Request, res: Response) => {
    try {
        const { title, description } = req.body;
        const newTask = new Task({ title, description });
        await newTask.save();

        await sendToQueue('task-queue', {
            event: 'task_created',
            task: newTask,
        });

        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
    }
};

export const updateTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const task = await Task.findByIdAndUpdate(id, { status }, { new: true });

        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return
        }

        await sendToQueue('task-queue', {
            event: 'task_updated',
            task,
        });

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const task = await Task.findByIdAndDelete(id);

        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return
        }

        res.status(200).json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
};

export const getAllTasks = async (_req: Request, res: Response) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve tasks' });
    }
};

export const getTaskById = async (req: Request, res: Response) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve task' });
    }
};
