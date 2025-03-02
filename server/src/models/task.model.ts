import { Schema, model, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface ITask extends Document {
  _id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: number;
  createdBy: string;
  category?: string;
  comments?: Array<{
    text: string;
    createdAt: number;
    userId: string;
  }>;
  createdAt: number;
  updatedAt: number;
}

const taskSchema = new Schema<ITask>(
  {
    _id: { type: String, default: uuidv4() },
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['pending', 'in progress', 'completed'], default: 'pending' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    dueDate: { type: Number },
    createdBy: { type: String, ref: 'User', required: true },
    category: { type: String },
    comments: [
      {
        text: { type: String },
        createdAt: { type: Number, default: Date.now },
        userId: { type: String, ref: 'User' }
      }
    ],
    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: Date.now },
  },
  { versionKey: false }
);

taskSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default model<ITask>('Task', taskSchema);
