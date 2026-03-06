import React, { useState } from 'react';
import { Plus, Check, Square, Trash2, Edit3, ExternalLink, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Todo as TodoType } from '../types';

interface TodoProps {
  todos: TodoType[];
  onAdd: (todo: Partial<TodoType>) => void;
  onUpdate: (id: string, todo: Partial<TodoType>) => void;
  onDelete: (id: string) => void;
}

export default function Todo({ todos, onAdd, onUpdate, onDelete }: TodoProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoType | null>(null);

  const [newTodoTask, setNewTodoTask] = useState('');

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoTask.trim()) {
      onAdd({ task: newTodoTask.trim(), links: [] });
      setNewTodoTask('');
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const todoData = {
      task: formData.get('task') as string,
      links: [],
    };

    if (editingTodo) {
      onUpdate(editingTodo.id, todoData);
      setEditingTodo(null);
    } else {
      onAdd(todoData);
      setIsAdding(false);
    }
  };

  const TodoModal = ({ todo, onClose }: { todo: Partial<TodoType>, onClose: () => void }) => (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white border border-black p-6 md:p-8 space-y-6 shadow-2xl"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold tracking-tighter">{editingTodo ? 'edit to-do' : 'new to-do'}</h3>
          <button onClick={onClose} className="hover:rotate-90 transition-transform"><X size={24} /></button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <input 
            name="task" 
            defaultValue={todo.task} 
            placeholder="what needs to be done?" 
            className="minimal-input text-lg" 
            required 
            autoFocus
          />
          <button type="submit" className="w-full minimal-button bg-black text-white">save task</button>
        </form>
      </motion.div>
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tighter">to-do</h2>
      </div>

      <form onSubmit={handleQuickAdd} className="relative">
        <input 
          type="text" 
          placeholder="add a new task..." 
          className="minimal-input py-3 text-lg pr-12"
          value={newTodoTask}
          onChange={(e) => setNewTodoTask(e.target.value)}
        />
        <button 
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 transition-opacity"
        >
          <Plus size={20} />
        </button>
      </form>

      <div className="space-y-2">
        {todos.length === 0 && (
          <div className="text-center py-20 opacity-30 italic text-sm">
            no tasks yet. add something to get started.
          </div>
        )}
        
        {todos.sort((a, b) => (a.completed === b.completed ? b.createdAt - a.createdAt : a.completed ? 1 : -1)).map(todo => (
          <motion.div 
            layout
            key={todo.id}
            className={`minimal-border p-4 flex items-start gap-4 group transition-all ${todo.completed ? 'opacity-40' : 'hover:shadow-md'}`}
          >
            <button 
              onClick={() => onUpdate(todo.id, { completed: !todo.completed })}
              className="mt-1 flex-shrink-0"
            >
              {todo.completed ? <Check size={20} /> : <Square size={20} />}
            </button>
            
            <div className="flex-1 space-y-2">
              <p className={`text-lg leading-tight ${todo.completed ? 'line-through' : ''}`}>{todo.task}</p>
            </div>

            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => setEditingTodo(todo)} title="edit"><Edit3 size={16} /></button>
              <button onClick={() => onDelete(todo.id)} title="delete" className="text-red-500"><Trash2 size={16} /></button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isAdding && <TodoModal todo={{}} onClose={() => setIsAdding(false)} />}
        {editingTodo && <TodoModal todo={editingTodo} onClose={() => setEditingTodo(null)} />}
      </AnimatePresence>
    </div>
  );
}
