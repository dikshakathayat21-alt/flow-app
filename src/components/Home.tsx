import React, { useState } from 'react';
import { Plus, FileText, CheckSquare, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Note, Todo } from '../types';

interface HomeProps {
  notes: Note[];
  todos: Todo[];
  onAddNote: () => void;
  onAddTodo: () => void;
  onViewNotes: () => void;
  onViewTodo: () => void;
}

export default function Home({ notes, todos, onAddNote, onAddTodo, onViewNotes, onViewTodo }: HomeProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="space-y-12 py-8">
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-black pb-2">
          <h2 className="text-2xl font-bold tracking-tighter">my store</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={onViewNotes}
            className="minimal-border p-6 text-left hover:bg-black hover:text-white transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <FileText size={24} />
              <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="text-lg font-bold mb-1">notes</h3>
            <p className="text-sm opacity-60">{notes.length} saved notes</p>
          </button>

          <button 
            onClick={onViewTodo}
            className="minimal-border p-6 text-left hover:bg-black hover:text-white transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <CheckSquare size={24} />
              <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="text-lg font-bold mb-1">to-do</h3>
            <p className="text-sm opacity-60">{todos.filter(t => !t.completed).length} active tasks</p>
          </button>
        </div>
      </section>

      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40">
        <div className="relative">
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-white border border-black p-2 w-40 space-y-1 shadow-2xl"
              >
                <button 
                  onClick={() => { onAddNote(); setIsMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 hover:bg-black hover:text-white flex items-center gap-2 text-sm"
                >
                  <FileText size={14} /> add note
                </button>
                <button 
                  onClick={() => { onAddTodo(); setIsMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 hover:bg-black hover:text-white flex items-center gap-2 text-sm"
                >
                  <CheckSquare size={14} /> add to-do
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`w-14 h-14 rounded-full border border-black flex items-center justify-center transition-all shadow-lg ${
              isMenuOpen ? 'bg-black text-white rotate-45' : 'bg-white text-black hover:bg-black hover:text-white'
            }`}
          >
            <Plus size={28} />
          </button>
        </div>
      </div>

    </div>
  );
}
