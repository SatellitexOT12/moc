import { useState, useEffect } from 'react';

export interface FormData {
    name: string;
    email: string;
    password: string;
    age: string;
    city: string;
    country: string;
    purpose: string;
}

interface EnrollModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: FormData) => void;
    courseName: string;
}

export default function EnrollModal({ isOpen, onClose, onSubmit, courseName }: EnrollModalProps) {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        password: '',
        age: '',
        city: '',
        country: 'CU',
        purpose: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const { name, email, password, city, purpose } = formData;

        // Validaciones
        if (!name || !email || !password || !city || !purpose) {
            setError('Por favor completa todos los campos obligatorios');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Por favor introduce un correo electrónico válido');
            return;
        }

        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres');
            return;
        }

        setError('');
        onSubmit(formData);
        setSuccess('Matrícula enviada. Revisa tu correo para confirmar.');

        setTimeout(() => {
            setSuccess('');
            onClose();
        }, 3000);
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'; // Evita que la página principal se desplace
            const input = document.querySelector('#name-input') as HTMLInputElement;
            if (input) {
                input.focus(); // Pone el foco en el primer campo
            }
        } else {
            document.body.style.overflow = ''; // Restaura el scroll normal
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-10 backdrop-blur-sm p-4">
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-6 animate-fade-in-down overflow-y-auto max-h-screen"
            >
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    Matrícula en {courseName}
                </h2>

                {/* Mensaje de éxito */}
                {success ? (
                    <div className="text-green-600 text-center my-6">
                        <p className="font-bold">¡Matrícula exitosa!</p>
                        <p>Revisa tu correo para confirmar tu cuenta</p>
                    </div>
                ) : (
                    <>
                        {/* Mensaje de error */}
                        {error && <div className="text-red-600 mb-4">{error}</div>}

                        {/* Formulario */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Nombre */}
                            <div>
                                <label className="block text-gray-700 mb-1 text-sm font-medium">Nombre y Apellidos *</label>
                                <input
                                    id="name-input" // Para poder enfocarlo
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Ej: Juan Pérez"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    * Mínimo 8 caracteres
                                </p>
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
                                ></textarea>
                            </div>

                            {/* Botones */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
                                >
                                    Enviar
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors duration-200"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>

            
        </div>
    );
}