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
  const [notes, setNotes] = useState<Note[]>([]);
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [userEmail, setUserEmail] = useState<string | undefined>();

  const navigate = useNavigate();
  const location = useLocation();

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setNotes(data.map(n => ({
        id: n.id,
        title: n.title,
        content: n.content,
        links: n.links || [],
        section: n.section,
        createdAt: new Date(n.created_at).getTime()
      })));
    }
  };

  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTodos(data.map(t => ({
        id: t.id,
        task: t.task,
        completed: t.completed,
        links: t.links || [],
        createdAt: new Date(t.created_at).getTime()
      })));
    }
  };

  useEffect(() => {
    // Check active sessions and subscribe to auth changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      if (session) {
        setUserEmail(session.user.email);
        fetchNotes();
        fetchTodos();
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (session) {
        setUserEmail(session.user.email);
        fetchNotes();
        fetchTodos();
      } else {
        setUserEmail(undefined);
        setNotes([]);
        setTodos([]);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    navigate('/login');
  };

  const addNote = async (noteData: Partial<Note>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('notes')
      .insert([{
        user_id: user.id,
        title: noteData.title || 'untitled',
        content: noteData.content || '',
        links: noteData.links || [],
        section: noteData.section || 'general'
      }])
      .select()
      .single();

    if (!error && data) {
      const newNote = {
        id: data.id,
        title: data.title,
        content: data.content,
        links: data.links,
        section: data.section,
        createdAt: new Date(data.created_at).getTime()
      };
      setNotes([newNote, ...notes]);
    }
  };

  const updateNote = async (id: string, noteData: Partial<Note>) => {
    const { error } = await supabase
      .from('notes')
      .update({
        title: noteData.title,
        content: noteData.content,
        links: noteData.links,
        section: noteData.section
      })
      .eq('id', id);

    if (!error) {
      setNotes(notes.map(n => n.id === id ? { ...n, ...noteData } : n));
    }
  };

  const deleteNote = async (id: string) => {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (!error) {
      setNotes(notes.filter(n => n.id !== id));
    }
  };

  const addTodo = async (todoData: Partial<TodoType>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('todos')
      .insert([{
        user_id: user.id,
        task: todoData.task || '',
        completed: false,
        links: todoData.links || [],
      }])
      .select()
      .single();

    if (!error && data) {
      const newTodo = {
        id: data.id,
        task: data.task,
        completed: data.completed,
        links: data.links,
        createdAt: new Date(data.created_at).getTime()
      };
      setTodos([newTodo, ...todos]);
    }
  };

  const updateTodo = async (id: string, todoData: Partial<TodoType>) => {
    const { error } = await supabase
      .from('todos')
      .update({
        task: todoData.task,
        completed: todoData.completed,
        links: todoData.links
      })
      .eq('id', id);

    if (!error) {
      setTodos(todos.map(t => t.id === id ? { ...t, ...todoData } : t));
    }
  };

  const deleteTodo = async (id: string) => {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (!error) {
      setTodos(todos.filter(t => t.id !== id));
    }
  };

  const clearData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('notes').delete().eq('user_id', user.id);
    await supabase.from('todos').delete().eq('user_id', user.id);
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
                  email={userEmail}
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
