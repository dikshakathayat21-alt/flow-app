import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Auth from './components/Auth';
import Layout from './components/Layout';
import Home from './components/Home';
import Notes from './components/Notes';
import Todo from './components/Todo';
import Settings from './components/Settings';
import { supabase } from './supabaseClient';
import { Note, Todo as TodoType, View } from './types';

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('flow_notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [todos, setTodos] = useState<TodoType[]>(() => {
    const saved = localStorage.getItem('flow_todos');
    return saved ? JSON.parse(saved) : [];
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check active sessions and subscribe to auth changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('flow_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('flow_todos', JSON.stringify(todos));
  }, [todos]);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    navigate('/login');
  };

  const addNote = (noteData: Partial<Note>) => {
    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      title: noteData.title || 'untitled',
      content: noteData.content || '',
      links: noteData.links || [],
      section: noteData.section || 'general',
      createdAt: Date.now(),
    };
    setNotes([newNote, ...notes]);
  };

  const updateNote = (id: string, noteData: Partial<Note>) => {
    setNotes(notes.map(n => n.id === id ? { ...n, ...noteData } : n));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const addTodo = (todoData: Partial<TodoType>) => {
    const newTodo: TodoType = {
      id: Math.random().toString(36).substr(2, 9),
      task: todoData.task || '',
      completed: false,
      links: todoData.links || [],
      createdAt: Date.now(),
    };
    setTodos([newTodo, ...todos]);
  };

  const updateTodo = (id: string, todoData: Partial<TodoType>) => {
    setTodos(todos.map(t => t.id === id ? { ...t, ...todoData } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const clearData = () => {
    setNotes([]);
    setTodos([]);
  };

  const getCurrentView = (): View => {
    const path = location.pathname.substring(1) || 'home';
    return path as View;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm opacity-50 animate-pulse">loading...</p>
      </div>
    );
  }

  if (!isLoggedIn && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  if (isLoggedIn && location.pathname === '/login') {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Auth onLogin={handleLogin} />} />
      <Route 
        path="*" 
        element={
          <Layout 
            currentView={getCurrentView()} 
            onViewChange={(view) => navigate(view === 'home' ? '/' : `/${view}`)}
            onLogout={handleLogout}
          >
            <Routes>
              <Route path="/" element={
                <Home 
                  notes={notes} 
                  todos={todos} 
                  onAddNote={() => navigate('/notes')} 
                  onAddTodo={() => navigate('/todo')}
                  onViewNotes={() => navigate('/notes')}
                  onViewTodo={() => navigate('/todo')}
                />
              } />
              <Route path="/notes" element={
                <Notes 
                  notes={notes} 
                  onAdd={addNote} 
                  onUpdate={updateNote} 
                  onDelete={deleteNote} 
                />
              } />
              <Route path="/todo" element={
                <Todo 
                  todos={todos} 
                  onAdd={addTodo} 
                  onUpdate={updateTodo} 
                  onDelete={deleteTodo} 
                />
              } />
              <Route path="/settings" element={
                <Settings 
                  notes={notes} 
                  todos={todos} 
                  onClearData={clearData} 
                />
              } />
            </Routes>
          </Layout>
        } 
      />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
