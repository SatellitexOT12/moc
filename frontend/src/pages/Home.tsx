// src/pages/Home.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import CourseCard from '../components/CourseCard';
import type { Course } from '../types/course';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ name: string; email: string } | null>(null); // Simula usuario logueado

    const navigate = useNavigate();

    // Cargar usuario desde localStorage o desde Django
    useEffect(() => {
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);

                // Asegúrate de que tenga 'name' y 'email'
                if (parsedUser.email && parsedUser.name) {
                    setUser(parsedUser);
                } else {
                    console.error("El usuario en localStorage no tiene formato válido", parsedUser);
                }
            } catch (e) {
                console.error("Error al parsear el usuario de localStorage", e);
            }
        }

        axios.get<Course[]>('http://localhost:8000/api/enrolled-courses/')
            .then(res => {
                setCourses(res.data);
            })
            .catch(err => {
                console.error('Error al cargar cursos:', err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleEnrollClick = (courseId: number) => {
        if (!user) {
            alert('Debes iniciar sesión para matricularte');
            return navigate('/login');
        }
        // Aquí va tu lógica de matrícula
        alert(`Matricularme en curso ${courseId}`);
    };

    const moocCourses = courses.filter(c => c.category === 3);

    return (
        <>
            <Navbar user={user} />

            <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
                        Cursos MOOC
                    </h1>

                    {/* Spinner de carga */}
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {moocCourses.length > 0 ? (
                                moocCourses.map((course, index) => (
                                    <CourseCard
                                        key={course.id}
                                        course={course}
                                        index={index}
                                        onEnroll={handleEnrollClick}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full bg-yellow-50 border border-yellow-400 text-yellow-800 p-6 rounded-lg text-center">
                                    <p className="text-lg font-medium">No hay cursos MOOC disponibles.</p>
                                    <p className="mt-2 text-sm">Contacta con el administrador si necesitas ayuda.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}