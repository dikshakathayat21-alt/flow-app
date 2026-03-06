import React, { useState } from 'react';
import { Plus, Search, ExternalLink, Maximize2, X, Trash2, Edit3, FolderPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Note } from '../types';

interface NotesProps {
  notes: Note[];
  onAdd: (note: Partial<Note>) => void;
  onUpdate: (id: string, note: Partial<Note>) => void;
  onDelete: (id: string) => void;
}

export default function Notes({ notes, onAdd, onUpdate, onDelete }: NotesProps) {
  const [search, setSearch] = useState('');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [expandedNote, setExpandedNote] = useState<Note | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newSection, setNewSection] = useState('');
  const [customSections, setCustomSections] = useState<string[]>(['general', 'work', 'personal']);

  const filteredNotes = notes.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || 
                         n.content.toLowerCase().includes(search.toLowerCase());
    const matchesSection = selectedSection ? n.section === selectedSection : true;
    return matchesSearch && matchesSection;
  });

  const sections = [...new Set([...customSections, ...notes.map(n => n.section)])];

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const noteData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      section: formData.get('section') as string,
      links: (formData.get('links') as string).split(',').map(l => l.trim()).filter(l => l),
    };

    if (editingNote) {
      onUpdate(editingNote.id, noteData);
      setEditingNote(null);
    } else {
      onAdd(noteData);
      setIsAdding(false);
    }
  };

  const NoteModal = ({ note, onClose, isEditing }: { note: Partial<Note>, onClose: () => void, isEditing: boolean }) => (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-white border border-black p-6 md:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold tracking-tighter">{isEditing ? (editingNote ? 'edit note' : 'new note') : note.title}</h3>
          <button onClick={onClose} className="hover:rotate-90 transition-transform"><X size={24} /></button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <input 
              name="title" 
              defaultValue={note.title} 
              placeholder="title" 
              className="minimal-input text-lg font-bold" 
              required 
            />
            <textarea 
              name="content" 
              defaultValue={note.content} 
              placeholder="content" 
              className="minimal-input h-48 resize-none" 
              required 
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select name="section" defaultValue={note.section || 'general'} className="minimal-input">
                {sections.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <input 
                name="links" 
                defaultValue={note.links?.join(', ')} 
                placeholder="links (comma separated)" 
                className="minimal-input" 
              />
            </div>
            <button type="submit" className="w-full minimal-button bg-black text-white">save note</button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="text-xs opacity-50 flex gap-4">
              <span>section: {note.section}</span>
              <span>created: {new Date(note.createdAt!).toLocaleDateString()}</span>
            </div>
            <p className="whitespace-pre-wrap leading-relaxed">{note.content}</p>
            {note.links && note.links.length > 0 && (
              <div className="space-y-2 pt-4 border-t border-black/10">
                <p className="text-xs font-bold uppercase">links</p>
                <div className="flex flex-wrap gap-2">
                  {note.links.map((link, i) => (
                    <a 
                      key={i} 
                      href={link.startsWith('http') ? link : `https://${link}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs border border-black px-2 py-1 flex items-center gap-1 hover:bg-black hover:text-white transition-colors"
                    >
                      {link} <ExternalLink size={10} />
                    </a>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-end gap-4 pt-4">
              <button 
                onClick={() => { setEditingNote(note as Note); setExpandedNote(null); }}
                className="text-xs underline flex items-center gap-1"
              >
                <Edit3 size={12} /> edit
              </button>
              <button 
                onClick={() => { onDelete(note.id!); setExpandedNote(null); }}
                className="text-xs underline text-red-500 flex items-center gap-1"
              >
                <Trash2 size={12} /> delete
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tighter">notes</h2>
        <div className="flex items-center gap-2 w-full md:w-64">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="search notes..." 
              className="minimal-input py-1 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button 
          onClick={() => setSelectedSection(null)}
          className={`text-xs px-3 py-1 border border-black whitespace-nowrap ${selectedSection === null ? 'bg-black text-white' : 'opacity-50'}`}
        >
          all
        </button>
        {sections.map(s => (
          <button 
            key={s}
            onClick={() => setSelectedSection(s)}
            className={`text-xs px-3 py-1 border border-black whitespace-nowrap ${selectedSection === s ? 'bg-black text-white' : 'opacity-50'}`}
          >
            {s}
          </button>
        ))}
        <div className="flex items-center gap-1 ml-2">
          <input 
            type="text" 
            placeholder="new section" 
            className="text-xs border-b border-black outline-none w-24 bg-transparent"
            value={newSection}
            onChange={(e) => setNewSection(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newSection) {
                setCustomSections([...customSections, newSection]);
                setNewSection('');
              }
            }}
          />
          <FolderPlus size={14} className="opacity-30" />
        </div>
      </div>

      <div className="flex justify-center py-4">
        <button 
          onClick={() => setIsAdding(true)}
          className="w-10 h-10 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm"
          title="add note"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotes.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20">
            <p className="text-sm opacity-30 italic">no notes found</p>
          </div>
        )}
        {filteredNotes.map(note => (
          <motion.div 
            layoutId={note.id}
            key={note.id}
            className="minimal-border p-4 space-y-4 flex flex-col group hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] uppercase tracking-widest opacity-40">{note.section}</span>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setExpandedNote(note)} title="expand"><Maximize2 size={14} /></button>
                <button onClick={() => setEditingNote(note)} title="edit"><Edit3 size={14} /></button>
                <button onClick={() => onDelete(note.id)} title="delete" className="text-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="font-bold text-lg leading-tight">{note.title}</h3>
              <p className="text-sm opacity-60 line-clamp-3">{note.content}</p>
            </div>
            {note.links.length > 0 && (
              <div className="flex gap-2">
                {note.links.slice(0, 2).map((l, i) => (
                  <span key={i} className="text-[10px] border border-black/20 px-1 opacity-40 truncate max-w-[80px]">{l}</span>
                ))}
                {note.links.length > 2 && <span className="text-[10px] opacity-40">+{note.links.length - 2}</span>}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isAdding && <NoteModal note={{ section: selectedSection || 'general' }} onClose={() => setIsAdding(false)} isEditing={true} />}
        {editingNote && <NoteModal note={editingNote} onClose={() => setEditingNote(null)} isEditing={true} />}
        {expandedNote && <NoteModal note={expandedNote} onClose={() => setExpandedNote(null)} isEditing={false} />}
      </AnimatePresence>
    </div>
  );
}
