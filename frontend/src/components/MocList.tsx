// src/components/MocList.tsx
import type { Moc } from '../types';

interface Props {
  mocs: Moc[];
  onUpdate: (id: number, moc: Partial<Moc>) => void;
  onDelete: (id: number) => void;
}

export default function MocList({ mocs, onUpdate, onDelete }: Props) {
  return (
    <ul className="space-y-4">
      {mocs.map(moc => (
        <li key={moc.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
          <div>
            <h3 className={`text-lg font-medium ${moc.completed ? 'line-through text-gray-400' : ''}`}>
              {moc.title}
            </h3>
            <p className="text-gray-600">{moc.description || "Sin descripción"}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onUpdate(moc.id!, { completed: !moc.completed })}
              className={`px-3 py-1 rounded ${
                moc.completed
                  ? 'bg-yellow-500 hover:bg-yellow-600'
                  : 'bg-green-500 hover:bg-green-600'
              } text-white font-semibold transition`}
            >
              {moc.completed ? 'Desmarcar' : 'Completar'}
            </button>
            <button
              onClick={() => onDelete(moc.id!)}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1 rounded transition"
            >
              Eliminar
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}