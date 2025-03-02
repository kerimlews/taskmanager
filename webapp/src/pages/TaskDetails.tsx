import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get, post, put, remove } from '../utils/ajax';
import { Task } from '../types/Task';
import { useAuthStore } from '../store/useAuthStore';
import PageWrapper from '../components/PageWrapper';

const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});
  const [newComment, setNewComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [editMode, setEditMode] = useState<boolean>(false);
  const token = useAuthStore((state) => state.token);

  const fetchTask = async () => {
    setLoading(true);
    try {
      const data = await get<Task>(`/api/tasks/${id}`, token);
      setTask(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch task');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTask();
    }
  }, [id, token]);

  const handleEdit = () => {
    setEditMode(true);
    setEditedTask(task || {});
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditedTask({});
  };

  const handleSave = async () => {
    if (!id) return;
    try {
      await put(`/api/tasks/${id}`, editedTask, token);
      setEditMode(false);
      await fetchTask();
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await remove(`/api/tasks/${id}`, token);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
    }
  };

  const handleAddComment = async () => {
    if (!id || !newComment.trim()) return;
    try {
      await post(`/api/tasks/${id}/comments`, { text: newComment }, token);
      setNewComment('');
      await fetchTask(); // refresh task details to include the new comment
    } catch (err: any) {
      setError(err.message || 'Failed to add comment');
    }
  };

  if (loading) return <div>Loading task details...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!task) return <div>No task found</div>;

  return (
    <PageWrapper>
      <div className="relative p-4 max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow rounded">
        {/* Buttons in the top right corner */}
        <div className="absolute top-4 right-4 flex space-x-2">
          {editMode ? (
            <>
              <button onClick={handleSave} className="bg-green-500 text-white px-3 py-1 rounded">
                Save
              </button>
              <button onClick={handleCancel} className="bg-gray-500 text-white px-3 py-1 rounded">
                Cancel
              </button>
            </>
          ) : (
            <button onClick={handleEdit} className="bg-blue-500 text-white px-3 py-1 rounded">
              Edit
            </button>
          )}
          <button onClick={handleDelete} className="bg-red-500 text-white px-3 py-1 rounded">
            Delete
          </button>
        </div>

        {editMode ? (
          <>
            <h1 className="text-3xl font-bold mb-4">
              <input
                type="text"
                value={editedTask.title || ''}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                className="border rounded p-2 w-full"
              />
            </h1>
            <div className="mb-2">
              <span className="font-semibold">Description:</span>
              <textarea
                value={editedTask.description || ''}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                className="border rounded p-2 w-full"
              />
            </div>
            <div className="mb-2">
              <span className="font-semibold">Status:</span>
              <select
                value={editedTask.status || ''}
                onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value as Task['status'] })}
                className="border rounded p-2 w-full"
              >
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Priority:</span>
              <select
                value={editedTask.priority || ''}
                onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value as Task['priority'] })}
                className="border rounded p-2 w-full"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Due Date:</span>
              <input
                type="datetime-local"
                value={
                  editedTask.dueDate
                    ? new Date(editedTask.dueDate).toISOString().slice(0, 16)
                    : ''
                }
                onChange={(e) =>
                  setEditedTask({ ...editedTask, dueDate: +new Date(e.target.value) })
                }
                className="border rounded p-2 w-full"
              />
            </div>
            <div className="mb-2">
              <span className="font-semibold">Category:</span>
              <input
                type="text"
                value={editedTask.category || ''}
                onChange={(e) => setEditedTask({ ...editedTask, category: e.target.value })}
                className="border rounded p-2 w-full"
              />
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-4">{task.title}</h1>
            <p className="mb-2">
              <span className="font-semibold">Description:</span> {task.description || 'No description provided'}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Status:</span>{' '}
              <span className="capitalize">{task.status}</span>
            </p>
            <p className="mb-2">
              <span className="font-semibold">Priority:</span>{' '}
              <span className="capitalize">{task.priority}</span>
            </p>
            {task.dueDate !== undefined && (
              <p className="mb-2">
                <span className="font-semibold">Due Date:</span> {new Date(task.dueDate).toLocaleString()}
              </p>
            )}
            <p className="mb-2">
              <span className="font-semibold">Category:</span> {task.category || 'None'}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Created At:</span> {new Date(task.createdAt).toLocaleString()}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Updated At:</span> {new Date(task.updatedAt).toLocaleString()}
            </p>
            <div className="mt-4">
              {/* Comment Form */}
              <div className="mb-4">
              <textarea
                  placeholder="Add your comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="border rounded p-2 w-full"
              />
              <button onClick={handleAddComment} className="bg-blue-500 text-white px-3 py-1 rounded mt-2">
                  Add Comment
              </button>
              </div>
              <h2 className="text-2xl font-semibold mb-2">Comments</h2>
              {task.comments && task.comments.length > 0 ? (
                <ul className="list-disc pl-5">
                  {task.comments.map((comment, index) => (
                    <li key={index} className="mb-1">
                      <p>{comment.text}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()} by {comment.userId.email}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No comments yet.</p>
              )}
            </div>
          </>
        )}
      </div>
    </PageWrapper>
  );
};

export default TaskDetails;
