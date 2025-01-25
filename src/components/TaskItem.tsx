import React, { useState } from 'react';
import { Task } from '../types';
import { Check, Edit2, Trash2, X, Save, Type, AlignLeft, Calendar, Clock, AlertTriangle } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string, description: string, dueDate: string) => void;
}

export function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [editedDueDate, setEditedDueDate] = useState(task.due_date.split('T')[0]);

  const handleSave = () => {
    if (!editedTitle.trim()) return;
    onEdit(task.id, editedTitle, editedDescription, editedDueDate);
    setIsEditing(false);
  };

  const isOverdue = new Date(task.due_date) < new Date() && !task.completed;
  const dueDate = new Date(task.due_date);
  const timeUntilDue = new Date(task.due_date).getTime() - new Date().getTime();
  const daysUntilDue = Math.ceil(timeUntilDue / (1000 * 60 * 60 * 24));

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-300 transform hover:shadow-xl ${
      task.completed ? 'opacity-75' : ''
    }`}>
      {isEditing ? (
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
              <Type className="w-4 h-4" />
              Title
            </label>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              placeholder="Task title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
              <AlignLeft className="w-4 h-4" />
              Description
            </label>
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              rows={2}
              placeholder="Task description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Due Date
            </label>
            <input
              type="date"
              value={editedDueDate}
              onChange={(e) => setEditedDueDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleSave}
              disabled={!editedTitle.trim()}
              className="px-4 py-2 rounded-lg bg-green-600 dark:bg-green-500 text-white hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6">
          <div className="flex items-start gap-4">
            <button
              onClick={() => onToggle(task.id)}
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                task.completed
                  ? 'bg-green-600 dark:bg-green-500 border-green-600 dark:border-green-500 text-white'
                  : 'border-gray-300 dark:border-gray-600 hover:border-green-600 dark:hover:border-green-500'
              }`}
            >
              <Check className="w-4 h-4" />
            </button>
            <div className="flex-grow min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className={`font-medium text-lg mb-2 ${
                    task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'
                  }`}>
                    {task.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3 break-words">{task.description}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`text-sm px-3 py-1 rounded-full flex items-center gap-1.5 ${
                      isOverdue
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    }`}>
                      <Calendar className="w-4 h-4" />
                      {dueDate.toLocaleDateString()}
                    </span>
                    {!task.completed && (
                      <span className={`text-sm px-3 py-1 rounded-full flex items-center gap-1.5 ${
                        isOverdue
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          : daysUntilDue <= 2
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      }`}>
                        {isOverdue ? (
                          <>
                            <AlertTriangle className="w-4 h-4" />
                            Overdue
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4" />
                            {daysUntilDue === 0
                              ? 'Due today'
                              : daysUntilDue === 1
                              ? 'Due tomorrow'
                              : `${daysUntilDue} days left`}
                          </>
                        )}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}