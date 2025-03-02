export interface Task {
    _id: string;
    title: string;
    description?: string;
    status: 'pending' | 'in progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate?: number;
    createdBy: string;
    category?: string;
    comments?: {
      text: string;
      createdAt: number;
      userId: {
        email: string;
      };
    }[];
    createdAt: number;
    updatedAt: number;
  }
  