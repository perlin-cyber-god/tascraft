import * as React from 'react';
import { useEffect, useState, useMemo, useRef } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Auth } from './components/Auth';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { TaskItem } from './components/TaskItem';
import { TaskSlot } from './components/TaskSlot';
import { EnchantingModal } from './components/EnchantingModal';
import { taskService } from './services/taskService';
import { Task } from './types';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, ArrowDownAZ, ArrowUpAZ, CalendarDays, SlidersHorizontal, Grid3X3, List } from 'lucide-react';
import { Typewriter } from './components/ui/Typewriter';
import { ItemDrop } from './components/ItemDrop';
import { v4 as uuidv4 } from 'uuid';

const AppContent: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [sortOption, setSortOption] = useState<'date-asc' | 'date-desc' | 'title-asc'>('date-asc');
  const [weather, setWeather] = useState<'snow' | 'rain' | 'none'>('snow');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  // Animation state
  const completedRef = useRef<HTMLDivElement>(null);
  const [activeDrops, setActiveDrops] = useState<Array<{ id: string; startX: number; dropY: number }>>([]);

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await taskService.fetchTasks(user.id);
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'user_id' | 'is_complete'>) => {
    if (!user) return;
    try {
      const newTask = await taskService.addTask({
        ...taskData,
        user_id: user.id,
        is_complete: false,
      });
      setTasks(prev => [...prev, newTask]);
    } catch (error) {
      console.error('Failed to add task', error);
    }
  };

  const handleUpdateTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'user_id' | 'is_complete'>) => {
    if (!editingTask) return;
    try {
      const updated = await taskService.updateTask(editingTask.id, taskData);
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    } catch (error) {
        console.error('Failed to update task', error);
    }
  };

  const handleToggleTask = async (id: string, currentStatus: boolean, rect?: DOMRect) => {
    // If completing the task, trigger animation
    if (!currentStatus && rect) {
        const dropId = uuidv4();
        setActiveDrops(prev => [...prev, { 
            id: dropId, 
            startX: rect.left + rect.width / 2,
            dropY: rect.top + rect.height / 2
        }]);
    }

    setTasks(prev => prev.map(t => t.id === id ? { ...t, is_complete: !currentStatus } : t));
    try {
      await taskService.updateTask(id, { is_complete: !currentStatus });
    } catch (error) {
      console.error('Failed to toggle task', error);
      loadTasks();
    }
  };

  const removeDrop = (id: string) => {
      setActiveDrops(prev => prev.filter(d => d.id !== id));
  };

  const handleDeleteTask = async (id: string) => {
    if (!window.confirm("Destroy this block?")) return;
    setTasks(prev => prev.filter(t => t.id !== id));
    try {
      await taskService.deleteTask(id);
    } catch (error) {
      console.error('Failed to delete task', error);
      loadTasks();
    }
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (data: any) => {
      if (editingTask) {
          handleUpdateTask(data);
      } else {
          handleAddTask(data);
      }
  };

  const handleCloseModal = () => {
      setIsModalOpen(false);
      setEditingTask(undefined);
  };

  // XP Calculations
  const { level, progress } = useMemo(() => {
    const completed = tasks.filter(t => t.is_complete).length;
    // Simple logic: 5 tasks per level
    const lvl = Math.floor(completed / 5) + 1;
    const prog = ((completed % 5) / 5) * 100;
    return { level: lvl, progress: prog };
  }, [tasks]);

  // Filter Logic
  const filteredTasks = tasks.filter(t => {
      if (filter === 'pending') return !t.is_complete;
      if (filter === 'completed') return t.is_complete;
      return true;
  });

  // Sort Logic
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortOption) {
      case 'date-asc':
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      case 'date-desc':
        return new Date(b.due_date).getTime() - new Date(a.due_date).getTime();
      case 'title-asc':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 bg-mc-stone border-4 border-mc-stoneLight animate-spin"></div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {!user ? (
        <motion.div
          key="auth"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <Auth />
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Layout weather={weather} level={level} progress={progress}>
            {/* Render Active Drops */}
            {activeDrops.map(drop => (
                <ItemDrop 
                    key={drop.id}
                    startX={drop.startX}
                    dropY={drop.dropY}
                    targetRef={completedRef}
                    onComplete={() => removeDrop(drop.id)}
                />
            ))}

            <div className="space-y-6 font-pixel">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <Typewriter text="Dashboard" className="text-4xl text-white uppercase tracking-wider text-shadow" />
                  <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-mc-stoneLight text-xl"
                  >
                    Current Objective: Survive and Study
                  </motion.p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95, y: 0 }}
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 bg-mc-grass border-t-4 border-l-4 border-[#83d656] border-b-4 border-r-4 border-[#2d4415] text-white px-6 py-3 text-xl shadow-pixel active:shadow-none active:translate-y-1 transition-none"
                >
                  <Plus className="w-6 h-6" />
                  New Quest
                </motion.button>
              </div>

              <Dashboard 
                tasks={tasks} 
                onWeatherChange={setWeather}
                currentWeather={weather}
                completedRef={completedRef}
              />

              <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-4 border-mc-stoneDark pb-4 gap-4">
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl text-white uppercase">Quest Log</h2>
                        <span className="text-mc-stoneLight text-lg">({sortedTasks.length})</span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                         {/* View Mode Toggle */}
                         <div className="flex bg-[#111] p-1 border-2 border-white/20 items-center mr-2">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-mc-stoneLight text-white' : 'text-gray-400 hover:text-white'}`}
                                title="List View"
                            >
                                <List className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-mc-stoneLight text-white' : 'text-gray-400 hover:text-white'}`}
                                title="Inventory View"
                            >
                                <Grid3X3 className="w-5 h-5" />
                            </button>
                         </div>

                        {/* Sort Controls */}
                        <div className="flex bg-[#111] p-1 border-2 border-white/20 items-center">
                            <span className="text-mc-stoneLight px-2 hidden sm:block"><SlidersHorizontal className="w-4 h-4"/></span>
                            <button 
                                onClick={() => setSortOption('date-asc')}
                                title="Sort by Date (Earliest)"
                                className={`p-2 transition-colors ${sortOption === 'date-asc' ? 'bg-mc-gold text-black' : 'text-gray-400 hover:text-white'}`}
                            >
                                <CalendarDays className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => setSortOption('date-desc')}
                                title="Sort by Date (Latest)"
                                className={`p-2 transition-colors ${sortOption === 'date-desc' ? 'bg-mc-gold text-black' : 'text-gray-400 hover:text-white'}`}
                            >
                                <CalendarDays className="w-5 h-5" />
                            </button>
                            <div className="w-px h-5 bg-white/20 mx-1"></div>
                            <button 
                                onClick={() => setSortOption('title-asc')}
                                title="Sort Alphabetically"
                                className={`p-2 transition-colors ${sortOption === 'title-asc' ? 'bg-mc-gold text-black' : 'text-gray-400 hover:text-white'}`}
                            >
                                <ArrowDownAZ className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Filter Controls */}
                        <div className="flex bg-[#111] p-1 border-2 border-white/20">
                            {(['all', 'pending', 'completed'] as const).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-1.5 text-lg uppercase transition-all duration-200 ${
                                        filter === f 
                                        ? 'bg-mc-stoneLight text-white border-2 border-white shadow-[0_0_10px_rgba(255,255,255,0.2)]' 
                                        : 'text-gray-500 hover:text-white'
                                    }`}
                                >
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>
                      </div>
                  </div>

                  {loading ? (
                      <div className="flex justify-center py-12">
                          <div className="w-16 h-16 border-8 border-mc-stoneLight border-t-mc-green border-r-mc-green animate-spin"></div>
                      </div>
                  ) : sortedTasks.length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-12 bg-[#222] border-4 border-dashed border-[#444]"
                      >
                          <p className="text-gray-500 text-2xl">Inventory Empty</p>
                      </motion.div>
                  ) : (
                      <>
                        {viewMode === 'list' ? (
                            <motion.ul layout className="grid grid-cols-1 gap-4">
                                <AnimatePresence mode='popLayout'>
                                    {sortedTasks.map(task => (
                                        <TaskItem 
                                            key={task.id} 
                                            task={task} 
                                            onToggle={handleToggleTask}
                                            onDelete={handleDeleteTask}
                                            onEdit={openEditModal}
                                        />
                                    ))}
                                </AnimatePresence>
                            </motion.ul>
                        ) : (
                            <motion.div layout className="bg-[#c6c6c6] p-4 border-4 border-[#373737] rounded-sm shadow-2xl max-w-4xl mx-auto">
                                <h3 className="text-[#3f3f3f] mb-2 text-xl ml-1">Inventory</h3>
                                <div className="flex flex-wrap gap-1 content-start min-h-[300px]">
                                    <AnimatePresence mode="popLayout">
                                        {sortedTasks.map(task => (
                                            <TaskSlot 
                                                key={task.id} 
                                                task={task} 
                                                onToggle={handleToggleTask} 
                                                onClick={openEditModal} 
                                            />
                                        ))}
                                        {/* Fill empty slots to look like inventory */}
                                        {Array.from({ length: Math.max(0, 27 - sortedTasks.length) }).map((_, i) => (
                                            <div key={`empty-${i}`} className="w-20 h-20 bg-[#8b8b8b] border-t-4 border-l-4 border-[#373737] border-b-4 border-r-4 border-[#ffffff] m-1 opacity-50"></div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        )}
                      </>
                  )}
              </div>
            </div>

            <EnchantingModal 
              isOpen={isModalOpen} 
              onClose={handleCloseModal} 
              onSubmit={handleModalSubmit}
              initialData={editingTask}
            />
          </Layout>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
