// ProgressIndicator.tsx
import React from 'react';

interface ProgressIndicatorProps {
  total: number;
  completed: number;
  progress: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ total, completed, progress }) => {
  return (
    <div className="p-4 border rounded mb-4">
      <h2 className="text-xl font-semibold mb-2">Task Completion Progress</h2>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-green-500 h-4 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2">
        {completed} of {total} tasks completed ({progress.toFixed(0)}%)
      </p>
    </div>
  );
};

export default React.memo(ProgressIndicator);
