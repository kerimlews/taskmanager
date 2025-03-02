import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';

import Task from '../models/task.model';
import { CreateTaskDto } from '../dtos/createTask.dto';
import { UpdateTaskDto } from '../dtos/updateTask.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateCommentDto } from '../dtos/createComment.dto';
import logger from '../logger';

export const createTask = async (req: Request, res: Response): Promise<void> => {
    const taskDto = plainToInstance(CreateTaskDto, req.body);
    const errors = await validate(taskDto);
    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }
  
    const createdBy = (req as any).user.userId;
    const task = new Task({ ...taskDto, createdBy, _id: uuid() });
    await task.save();

    logger.info(`Task created: ${task._id}`, { createdBy });

    res.status(201).json(task);
};

export const getTaskStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const total = await Task.countDocuments();
      const completed = await Task.countDocuments({ status: 'completed' });
      const progress = total > 0 ? (completed / total) * 100 : 0;
      res.json({ total, completed, progress });
    } catch (err: any) {
      res.status(500).json({ message: err.message || 'Error fetching task stats' });
    }
};

export const getTask = async (req: Request, res: Response): Promise<void> => {
    const task = await Task.findById(req.params.id)
      .populate('createdBy', 'email role')
      .populate('comments.userId', 'email role');

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.json(task);
};
  
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  
  const filter: any = { createdBy: (req?.user as any).userId };
    // Apply filters if provided (status, priority, etc.)
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.priority) {
      filter.priority = req.query.priority;
    }
    if (req.query.dueDate) {
      filter.dueDate = { $gte: new Date(req.query.dueDate as string) };
    }
  
    let sort: any = {};
    if (req.query.sortBy) {
      const sortBy = req.query.sortBy as string;
      sort[sortBy.startsWith('-') ? sortBy.substring(1) : sortBy] = sortBy.startsWith('-') ? -1 : 1;
    } else {
      sort = { createdAt: -1 };
    }
  
    const tasks = await Task.find(filter)
      .populate('createdBy', 'email role')
      .sort(sort);
    res.json(tasks);
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
    const updateDto = plainToInstance(UpdateTaskDto, req.body);
    const errors = await validate(updateDto);
    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }
    const task = await Task.findByIdAndUpdate(req.params.id, updateDto, { new: true });
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    logger.info(`Task updated: ${task._id}`);

    res.json(task);
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    logger.info(`Task deleted: ${task._id}`);

    res.json({ message: 'Task deleted' });
};

export const addCommentToTask = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
  
    const commentDto = plainToInstance(CreateCommentDto, req.body);
    const errors = await validate(commentDto);
    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    const userId = (req as any).user?.userId;
    if (!userId) {
        res.status(401).json({ message: 'Unauthorized: no user id found' });
        return;
    }
  
    const comment = {
      userId,
      text: commentDto.text,
      createdAt: +new Date()
    };
    
    // Push the new comment into the task's comments array
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $push: { comments: comment } },
      { new: true }
    );
  
    if (!updatedTask) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    
    res.status(200).json(updatedTask);
};