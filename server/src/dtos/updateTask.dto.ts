import { IsOptional, IsString, IsIn, IsNumber } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

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
  dueDate?: number; // milliseconds since epoch

  @IsOptional()
  @IsString()
  category?: string;
}
