import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Task } from '../types/Task';
import { useAuthStore } from '../store/useAuthStore';
import { get, post, put, remove } from '../utils/ajax';
import ProgressIndicator from '../components/ProgressIndicator';
import AddTaskSection from '../components/AddTaskSection';
import PageWrapper from '../components/PageWrapper';

const ItemTypes = {
  TASK: 'task',
};

interface TaskItemProps {
  task: Task;
  onUpdateTask: (id: string, updatedTask: Partial<Task>) => void;
  navigate: ReturnType<typeof useNavigate>;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdateTask, navigate }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: { id: task._id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [task]);

  return (
    <div
      // @ts-ignore
      ref={drag}
      className={`bg-white p-2 mb-2 rounded shadow cursor-move relative ${isDragging ? 'opacity-50' : ''}`}
      onClick={() => navigate(`/tasks/${task._id}`)}
    >
      <div>{task.title}</div>
      <div className="text-sm text-gray-500 capitalize">{task.priority}</div>
      {/* Icon in the top-right corner */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          window.open(`/tasks/${task._id}`, '_blank');
        }}
        className="absolute right-2 top-2"
        aria-label="Open in new tab"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-blue-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M12.293 2.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414L9.414 17.586a2 2 0 01-2.828 0l-4-4a1 1 0 010-1.414l7.293-7.293z" />
          <path d="M13 7h3.586L12 15.586 8.414 12H12V7z" />
        </svg>
      </button>
    </div>
  );
};

interface ColumnProps {
  status: string;
  name: string;
  tasks: Task[];
  onDropTask: (taskId: string, newStatus: string) => void;
  onUpdateTask: (id: string, updatedTask: Partial<Task>) => void;
  navigate: ReturnType<typeof useNavigate>;
}

const Column: React.FC<ColumnProps> = ({ status, name, tasks, onDropTask, onUpdateTask, navigate }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.TASK,
    drop: (item: { id: string; status: string }) => {
      if (item.status !== status) {
        onDropTask(item.id, status);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [status, onDropTask]);

  return (
    <div
      // @ts-ignore
      ref={drop}
      className={`bg-gray-100 p-4 rounded w-full ${isOver && canDrop ? 'bg-green-100' : ''}`}
    >
      <h2 className="text-xl font-semibold mb-2">{name}</h2>
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} onUpdateTask={onUpdateTask} navigate={navigate} />
      ))}
    </div>
  );
};

const TaskDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<{ status?: string; priority?: string }>({});
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await get<Task[]>('/api/tasks', token);
      setTasks(data);
    } catch (err: any) {
      setError(err.message || 'Error fetching tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (data: Partial<Task>) => {
    try {
      const newTask = await post<Task>('/api/tasks', data, token);
      setTasks(prev => [...prev, newTask])
    } catch (err: any) {
      alert(err.message);
    }
  };
  
  const deleteTask = async (id: string) => {
    try {
      await remove(`/api/tasks/${id}`, token);
      setTasks(tasks.filter(t => t._id !== id))
    } catch (err: any) {
      alert(err.message);
    }
  };

  const updateTask = async (id: string, updatedTask: Partial<Task>) => {
    try {
      await put(`/api/tasks/${id}`, updatedTask, token);
      setTasks(prev => prev.map(task => task._id === id ? ({ ...task, ...updatedTask }) : task))
    } catch (err: any) {
      alert(err.message);
    }
  };

  const onDropTask = async (taskId: string, newStatus: string) => {
    try {
      await updateTask(taskId, { status: newStatus as Task['status'] });
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Filter tasks based on UI options
  const filteredTasks = tasks.filter(task => {
    if (filter.status && task.status !== filter.status) return false;
    if (filter.priority && task.priority !== filter.priority) return false;
    return true;
  });

  // Calculate progress stats from the current tasks
  const completedCount = tasks.filter(task => task.status === 'completed').length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const columns = {
    'pending': {
      name: 'To Do',
      tasks: filteredTasks.filter(task => task.status === 'pending'),
    },
    'in progress': {
      name: 'In Progress',
      tasks: filteredTasks.filter(task => task.status === 'in progress'),
    },
    'completed': {
      name: 'Completed',
      tasks: filteredTasks.filter(task => task.status === 'completed'),
    },
  };

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <PageWrapper>
      <DndProvider backend={HTML5Backend}>
        <div className="p-4">
          <h1 className="text-3xl font-bold mb-4">Task Dashboard</h1>
          {/* Pass computed stats to the ProgressIndicator */}
          <ProgressIndicator total={totalCount} completed={completedCount} progress={progress} />

          {/* Filter Options */}
          <div className="mb-4 flex space-x-4">
            <div>
              <label>Status: </label>
              <select
                value={filter.status || ''}
                onChange={(e) => setFilter({ ...filter, status: e.target.value || undefined })}
                className="border rounded p-1"
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label>Priority: </label>
              <select
                value={filter.priority || ''}
                onChange={(e) => setFilter({ ...filter, priority: e.target.value || undefined })}
                className="border rounded p-1"
              >
                <option value="">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <AddTaskSection addTask={addTask} />

          {/* Board Columns */}
          <div className="flex space-x-4">
            {Object.entries(columns).map(([status, column]) => (
              <Column
                key={status}
                status={status}
                name={column.name}
                tasks={column.tasks}
                onDropTask={onDropTask}
                onUpdateTask={updateTask}
                navigate={navigate}
              />
            ))}
          </div>
        </div>
      </DndProvider>
    </PageWrapper>
  );
};

export default TaskDashboard;
