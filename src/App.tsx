import React, { useState, useEffect } from 'react';
import { TaskForm } from './components/TaskForm';
import { TaskItem } from './components/TaskItem';
import { Task, TaskFilter } from './types';
import { ListChecks, ClipboardList, CheckCircle2, Circle, Calendar } from 'lucide-react';
import { AuthForm } from './components/AuthForm';
import { Header } from './components/Header';
import { useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { supabase } from './lib/supabase';

function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (title: string, description: string, dueDate: string) => {
    try {
      const newTask = {
        user_id: user!.id,
        title,
        description,
        completed: false,
        due_date: new Date(dueDate).toISOString(),
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert([newTask])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setTasks(prev => [...prev, data]);
      }
    } catch (err) {
      console.error('Error adding task:', err);
      setError(err instanceof Error ? err.message : 'Failed to add task');
    }
  };

  const toggleTask = async (id: string) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      const { error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', id);

      if (error) throw error;
      setTasks(prev => prev.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
    } catch (err) {
      console.error('Error toggling task:', err);
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  const editTask = async (id: string, title: string, description: string, dueDate: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          title,
          description,
          due_date: new Date(dueDate).toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      setTasks(prev => prev.map(t =>
        t.id === id ? { ...t, title, description, due_date: new Date(dueDate).toISOString() } : t
      ));
    } catch (err) {
      console.error('Error editing task:', err);
      setError(err instanceof Error ? err.message : 'Failed to edit task');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      
      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-lg">
              <ListChecks className="w-14 h-14 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Task Manager</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Stay organized and boost your productivity with our intuitive task management system
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[350px,1fr] items-start">
          <div className="lg:sticky lg:top-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
              <div className="p-6 bg-blue-600 dark:bg-blue-500">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <ClipboardList className="w-5 h-5" />
                  Add New Task
                </h2>
              </div>
              <TaskForm onSubmit={addTask} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
              <div className="flex flex-wrap justify-center gap-3">
                {(['all', 'active', 'completed'] as const).map((filterType) => (
                  <button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      filter === filterType
                        ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    {filterType === 'all' && <ListChecks className="w-4 h-4" />}
                    {filterType === 'active' && <Circle className="w-4 h-4" />}
                    {filterType === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                    {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                  <div className="mb-4">
                    <Calendar className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No tasks found</p>
                  <p className="text-gray-400 dark:text-gray-500 mt-2 text-sm">
                    {filter === 'all'
                      ? 'Start by adding a new task'
                      : `No ${filter} tasks available`}
                  </p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                    onEdit={editTask}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const { user } = useAuth();
  return user ? <TaskManager /> : <AuthForm />;
}

export default App;