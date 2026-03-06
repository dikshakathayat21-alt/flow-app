import React from 'react';
import { Download, Trash2, Shield, User, Mail } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Note, Todo } from '../types';

interface SettingsProps {
  notes: Note[];
  todos: Todo[];
  onClearData: () => void;
}

export default function Settings({ notes, todos, onClearData }: SettingsProps) {
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    
    // Notes Sheet
    const notesData = notes.map(n => ({
      title: n.title,
      content: n.content,
      section: n.section,
      links: n.links.join(', '),
      date: new Date(n.createdAt).toLocaleString()
    }));
    const wsNotes = XLSX.utils.json_to_sheet(notesData);
    XLSX.utils.book_append_sheet(wb, wsNotes, "Notes");

    // Todos Sheet
    const todosData = todos.map(t => ({
      task: t.task,
      completed: t.completed ? 'yes' : 'no',
      links: t.links.join(', '),
      date: new Date(t.createdAt).toLocaleString()
    }));
    const wsTodos = XLSX.utils.json_to_sheet(todosData);
    XLSX.utils.book_append_sheet(wb, wsTodos, "To-dos");

    XLSX.writeFile(wb, "flow_data_export.xlsx");
  };

  return (
    <div className="space-y-12 py-8">
      <h2 className="text-3xl font-bold tracking-tighter">settings</h2>

      <section className="space-y-6">
        <div className="flex items-center gap-4 border-b border-black pb-2">
          <User size={18} />
          <h3 className="text-lg font-bold">account</h3>
        </div>
        <div className="space-y-4 pl-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-bold">email address</p>
              <p className="text-xs opacity-50">user@example.com</p>
            </div>
            <button className="text-xs underline">change</button>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-bold">password</p>
              <p className="text-xs opacity-50">••••••••••••</p>
            </div>
            <button className="text-xs underline">update</button>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-4 border-b border-black pb-2">
          <Shield size={18} />
          <h3 className="text-lg font-bold">data & privacy</h3>
        </div>
        <div className="space-y-6 pl-8">
          <div className="space-y-2">
            <p className="text-sm font-bold">export your data</p>
            <p className="text-xs opacity-50 mb-4">download all your notes and tasks in an excel format for backup or external use.</p>
            <button 
              onClick={exportToExcel}
              className="minimal-button flex items-center gap-2 text-sm"
            >
              <Download size={16} /> export to excel (.xlsx)
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-bold text-red-500">danger zone</p>
            <p className="text-xs opacity-50 mb-4">permanently delete all your data from flow. this action cannot be undone.</p>
            <button 
              onClick={() => {
                if (confirm('are you sure you want to delete all your data? this cannot be undone.')) {
                  onClearData();
                }
              }}
              className="minimal-button border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex items-center gap-2 text-sm"
            >
              <Trash2 size={16} /> clear all data
            </button>
          </div>
        </div>
      </section>

      <section className="pt-12 text-center opacity-20">
        <p className="text-[10px] uppercase tracking-[0.2em]">flow v1.0.0</p>
        <p className="text-[10px]">crafted with minimalism</p>
      </section>
    </div>
  );
}
