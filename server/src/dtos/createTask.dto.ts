import { IsNotEmpty, IsOptional, IsIn, IsString, IsNumber } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['pending', 'in progress', 'completed'])
  status?: 'pending' | 'in progress' | 'completed';

  @IsOptional()
  @IsIn(['low', 'medium', 'high'])
  priority?: 'low' | 'medium' | 'high';

  @IsOptional()
  @IsNumber()
  dueDate?: number; // stored as milliseconds since epoch

  @IsOptional()
  @IsString()
  category?: string;
}
