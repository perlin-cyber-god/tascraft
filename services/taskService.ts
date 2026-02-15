import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Task, TaskCategory } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Mock data for demo mode
const STORAGE_KEY = 'nebula_tasks_demo';

const getLocalTasks = (): Task[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const setLocalTasks = (tasks: Task[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const taskService = {
  async fetchTasks(userId: string): Promise<Task[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } else {
      // Demo mode
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate latency
      return getLocalTasks();
    }
  },

  async addTask(task: Omit<Task, 'id' | 'created_at'>): Promise<Task> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('tasks')
        .insert([task])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      await new Promise(resolve => setTimeout(resolve, 300));
      const newTask: Task = {
        ...task,
        id: uuidv4(),
        created_at: new Date().toISOString(),
      };
      const tasks = getLocalTasks();
      setLocalTasks([...tasks, newTask]);
      return newTask;
    }
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      await new Promise(resolve => setTimeout(resolve, 200));
      const tasks = getLocalTasks();
      const index = tasks.findIndex(t => t.id === id);
      if (index === -1) throw new Error('Task not found');
      
      const updatedTask = { ...tasks[index], ...updates };
      tasks[index] = updatedTask;
      setLocalTasks(tasks);
      return updatedTask;
    }
  },

  async deleteTask(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } else {
      await new Promise(resolve => setTimeout(resolve, 200));
      const tasks = getLocalTasks();
      setLocalTasks(tasks.filter(t => t.id !== id));
    }
  }
};
