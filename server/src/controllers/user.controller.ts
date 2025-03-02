import { Request, Response } from 'express';
import User from '../models/user.model';

export const getUsers = async (req: Request, res: Response) => {
  const users = await User.find();
  res.json(users);
};

export const createUser = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  // You might want to add DTO validation here too.
  const user = new User({ email, password, role });
  await user.save();
  res.status(201).json(user);
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({ message: 'User deleted' });
};