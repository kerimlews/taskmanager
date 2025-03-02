import { useState, memo } from 'react';
import type { Task } from '../types/Task';

const AddTaskSection = ({ addTask }: { addTask: (params: Partial<Task>) => void }) => {
    const [title, setTitle] = useState<Task['title']>('');
    const [priority, setPriority] = useState<Task['priority']>('medium');
  
    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Add New Task</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="border rounded p-2"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button onClick={() => addTask({ title, priority })} className="bg-blue-500 text-white p-2 rounded">
            Add Task
          </button>
        </div>
      </div>
    )
  };

  export default memo(AddTaskSection);
