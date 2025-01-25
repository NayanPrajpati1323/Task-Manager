import React, { useState } from 'react';
import { PlusCircle, Type, AlignLeft, Calendar, Clock } from 'lucide-react';

interface TaskFormProps {
  onSubmit: (title: string, description: string, dueDate: string) => void;
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onSubmit(title, description, dueDate);
    setTitle('');
    setDescription('');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-5">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
          <Type className="w-4 h-4" />
          Task Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
          placeholder="What needs to be done?"
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
          <AlignLeft className="w-4 h-4" />
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
          rows={3}
          placeholder="Add more details about this task..."
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            disabled={!title.trim()}
          >
            <PlusCircle className="w-5 h-5" />
            Add Task
          </button>
        </div>
      </div>
    </form>
  );
}