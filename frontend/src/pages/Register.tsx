// src/pages/Register.tsx
import { useState } from 'react';
import axios from 'axios';

export default function Register({ onRegister }: { onRegister: () => void }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        age: '',
        city: '',
        country: 'CU',
        purpose: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/api/register/', {
                ...formData
            }, {
                withCredentials: true
            });

            if (response.status === 200) {
                alert('Registro exitoso. Ahora puedes iniciar sesión.');
                onRegister();
            }

        } catch (err: any) {
            setError(err.response?.data?.error || 'Error al registrarte');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Regístrate</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nombre completo */}
                    <div>
                        <label className="block text-gray-700 mb-1 text-sm font-medium">Nombre y Apellidos *</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Ej: Juan Pérez"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    {/* Correo */}
                    <div>
                        <label className="block text-gray-700 mb-1 text-sm font-medium">Correo electrónico *</label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="ejemplo@dominio.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    {/* Contraseña */}
                    <div>
                        <label className="block text-gray-700 mb-1 text-sm font-medium">Contraseña *</label>
                        <input
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    {/* Edad */}
                    <div>
                        <label className="block text-gray-700 mb-1 text-sm font-medium">Edad</label>
                        <input
                            name="age"
                            type="number"
                            value={formData.age}
                            onChange={handleChange}
                            placeholder="Ej: 25"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Ciudad */}
                    <div>
                        <label className="block text-gray-700 mb-1 text-sm font-medium">Ciudad *</label>
                        <input
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Ej: La Habana"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    {/* País */}
                    <div>
                        <label className="block text-gray-700 mb-1 text-sm font-medium">País *</label>
                        <select
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="CU">Cuba</option>
                            <option value="ES">España</option>
                            <option value="MX">México</option>
                            <option value="CO">Colombia</option>
                            <option value="AR">Argentina</option>
                        </select>
                    </div>

                    {/* Propósito */}
                    <div>
                        <label className="block text-gray-700 mb-1 text-sm font-medium">Propósito *</label>
                        <textarea
                            name="purpose"
                            value={formData.purpose}
                            onChange={handleChange}
                            rows={3}
                            placeholder="¿Para qué quieres tomar este curso?"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        ></textarea>
                    </div>

                    {/* Botón */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors"
                        >
                            Registrarme
                        </button>
                    </div>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        ¿Ya tienes cuenta?{' '}
                        <a href="/login" className="text-blue-600 hover:underline">
                            Inicia sesión
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}