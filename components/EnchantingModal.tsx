import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, TaskCategory } from '../types';
import { X, BookOpen, Clock, Calendar, Sparkles } from 'lucide-react';

interface EnchantingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id' | 'created_at' | 'user_id' | 'is_complete'>) => void;
  initialData?: Task;
}

export const EnchantingModal: React.FC<EnchantingModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState<TaskCategory>(TaskCategory.HOMEWORK);

  // Reset or populate form
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      const d = new Date(initialData.due_date);
      setDate(d.toISOString().split('T')[0]);
      setTime(d.toTimeString().slice(0, 5));
      setCategory(initialData.category);
    } else {
      setTitle('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      setTime('23:59');
      setCategory(TaskCategory.HOMEWORK);
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dateTime = new Date(`${date}T${time}`).toISOString();
    onSubmit({
      title,
      description,
      due_date: dateTime,
      category,
    });
    onClose();
  };

  // Reusable Minecraft Button Class (as requested)
  const mcButtonStyle = `
    relative px-6 py-3 bg-[#c6c6c6] 
    border-t-4 border-l-4 border-b-4 border-r-4 
    border-t-[#ffffff] border-l-[#ffffff] border-b-[#555555] border-r-[#555555] 
    text-[#3f3f3f] font-pixel text-xl uppercase tracking-wider
    hover:border-[#ffff55] hover:bg-[#d0d0d0]
    active:border-t-[#555555] active:border-l-[#555555] active:border-b-[#ffffff] active:border-r-[#ffffff] 
    active:translate-y-1 shadow-pixel-sm active:shadow-none transition-none
    flex items-center justify-center gap-2
  `;

  // Input Field Class
  const inputClass = `
    w-full bg-[#1a1a1a] text-[#a020f0] font-pixel text-lg p-3
    border-2 border-b-[#ffffff] border-r-[#ffffff] border-t-[#000000] border-l-[#000000]
    focus:outline-none focus:bg-[#2a2a2a] placeholder-[#555]
    shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.5)]
  `;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[51] pointer-events-none p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              className="w-full max-w-lg bg-[#342a2a] border-4 border-[#1a1a1a] shadow-2xl pointer-events-auto relative"
            >
              {/* Outer Border Decoration (Stone Slab look) */}
              <div className="absolute inset-0 border-t-4 border-l-4 border-[#5e4b4b] border-b-4 border-r-4 border-[#1a1a1a] pointer-events-none" />

              {/* Header with Floating Book */}
              <div className="relative pt-12 pb-6 px-6 text-center border-b-4 border-[#1a1a1a] bg-[#2b2b2b]">
                <motion.div
                  animate={{ y: [0, -10, 0], rotateY: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-[#5e4b4b] border-4 border-[#1a1a1a] flex items-center justify-center shadow-pixel"
                >
                  <BookOpen className="w-10 h-10 text-[#a020f0]" />
                </motion.div>
                
                <h2 className="text-3xl text-[#c6c6c6] font-pixel text-shadow mt-4">
                  {initialData ? 'Reforge Enchantment' : 'Enchant Task'}
                </h2>
                <div className="text-[#a020f0] font-pixel text-sm animate-pulse">
                  Standard Galactic Alphabet...
                </div>

                <button 
                  onClick={onClose}
                  className="absolute top-2 right-2 text-[#555] hover:text-[#ff5555] transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4 font-pixel relative z-10">
                
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[#c6c6c6] uppercase text-sm tracking-wide ml-1">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className={inputClass}
                    placeholder="I... II... III..."
                    required
                  />
                </div>

                {/* Date & Time Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[#c6c6c6] uppercase text-sm tracking-wide ml-1 flex items-center gap-2">
                       <Calendar className="w-3 h-3" /> Due Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className={`${inputClass} [color-scheme:dark]`}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[#c6c6c6] uppercase text-sm tracking-wide ml-1 flex items-center gap-2">
                       <Clock className="w-3 h-3" /> Due Time
                    </label>
                    <input
                      type="time"
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      className={`${inputClass} [color-scheme:dark]`}
                      required
                    />
                  </div>
                </div>

                {/* Category Selection */}
                <div className="space-y-1">
                  <label className="text-[#c6c6c6] uppercase text-sm tracking-wide ml-1">Category (Enchantment)</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as TaskCategory)}
                    className={inputClass}
                  >
                    {Object.values(TaskCategory).map(cat => (
                      <option key={cat} value={cat} className="bg-[#1a1a1a] text-[#c6c6c6]">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-[#c6c6c6] uppercase text-sm tracking-wide ml-1">Lore (Description)</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={3}
                    className={`${inputClass} resize-none`}
                    placeholder="Ancient wisdom goes here..."
                  />
                </div>

                {/* Actions */}
                <div className="pt-4 flex items-center justify-between gap-4">
                  <div className="text-xs text-[#555] flex-grow">
                     Cost: 1 Lapis Lazuli
                  </div>
                  <button
                    type="submit"
                    className={mcButtonStyle}
                  >
                    <Sparkles className={`w-5 h-5 ${initialData ? 'text-blue-500' : 'text-[#a020f0]'}`} />
                    {initialData ? 'Reforge Task' : 'Enchant Task'}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
