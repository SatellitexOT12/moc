// src/components/Navbar.tsx
import { useNavigate } from 'react-router-dom';



// Interfaz para las props del componente
interface Props {
    user: { name: string; email: string } | null;
}

export default function Navbar({ user }: Props) {
    const navigate = useNavigate();

    const handleLogout = () => {
        fetch('http://localhost:8000/api/logout/', {
            method: 'POST',
            credentials: 'include'
        })
            .then(() => {
                localStorage.removeItem('user');
                navigate('/login');
            });
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">Plataforma MOOC</h1>

                <div>
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">Hola, {user.name}</span>
                            <button
                                onClick={handleLogout}
                                className="text-sm bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => navigate('/login')}
                            className="text-sm bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                        >
                            Iniciar Sesión
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}