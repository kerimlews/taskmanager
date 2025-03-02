import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import User from '../models/user.model';
import config from '../config';
import { CreateUserDto } from '../dtos/createUser.dto';
import { LoginUserDto } from '../dtos/loginUser.dto';

export const signUp = async (req: Request, res: Response): Promise<void> => {
  // Validate incoming data using class-validator
  const userDto = plainToInstance(CreateUserDto, req.body);
  const errors = await validate(userDto);
  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  const existing = await User.findOne({ email: userDto.email });
  if (existing) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  const hashedPassword = await bcrypt.hash(userDto.password, 10);
  const user = new User({ email: userDto.email, password: hashedPassword });
  await user.save();
  res.status(201).json({ message: 'User created', userId: user._id });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const loginDto = plainToInstance(LoginUserDto, req.body);
  const errors = await validate(loginDto);
  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  const { email, password } = loginDto;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const token = jwt.sign({ userId: user._id, role: user.role }, config.jwtSecret, {
    expiresIn: '1d',
  });
  res.json({ token });
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  // For JWT, logout is typically handled on the client-side or via token blacklisting
  res.json({ message: 'Logout successful' });
};
