// src/App.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import MocForm from './components/MocForm';
import MocList from './components/MocList';
import type { Moc } from './types';

const API_URL = 'http://localhost:8000/api/gest_moc/';

function App() {
  const [mocs, setMocs] = useState<Moc[]>([]);

  // Cargar tareas al iniciar
  useEffect(() => {
    fetchMocs();
  }, []);

  const fetchMocs = async () => {
    try {
      const res = await axios.get<Moc[]>(API_URL);
      setMocs(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  // Crear tarea
  const createMoc = async (moc: Moc) => {
    try {
      const res = await axios.post<Moc>(API_URL, moc);
      setMocs([res.data, ...mocs]);
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  // Actualizar tarea
  const updateMoc = async (id: number, updatedMoc: Partial<Moc>) => {
    try {
      const res = await axios.patch<Moc>(`${API_URL}${id}/`, updatedMoc);
      setMocs(mocs.map(t => (t.id === id ? res.data : t)));
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  // Eliminar tarea
  const deleteMoc = async (id: number) => {
    try {
      await axios.delete(`${API_URL}${id}/`);
      setMocs(mocs.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">📋 Gestor de Tareas</h1>
      <MocForm onCreate={createMoc} />
      <MocList mocs={mocs} onUpdate={updateMoc} onDelete={deleteMoc} />
    </div>
  );
}

export default App;