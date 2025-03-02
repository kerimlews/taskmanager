import { Schema, model, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: number;
  updatedAt: number;
}

const userSchema = new Schema<IUser>(
  {
    _id: { type: String, default: uuidv4 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: Date.now },
  },
  { versionKey: false }
);

userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default model<IUser>('User', userSchema);
