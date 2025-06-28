// src/components/MocForm.tsx
import { useState } from 'react';
import type { Moc } from '../types';

interface Props {
    onCreate: (moc: Omit<Moc, 'id'>) => void;
}

export default function MocForm({ onCreate }: Props) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreate({ title, description, completed: false });
        setTitle('');
        setDescription('');
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                    <input
                        type="text"
                        placeholder="Ej: Estudiar React"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (opcional)</label>
                    <input
                        type="text"
                        placeholder="Ej: Revisar documentación"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                >
                    Agregar Tarea
                </button>
            </div>
        </form>
    );
}