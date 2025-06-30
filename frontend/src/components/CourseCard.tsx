// src/components/CourseCard.tsx
import type { Course } from '../types/course';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface CourseCardProps {
    course: Course;
    index: number;
    onEnroll: (courseId: number) => void;
}

const FALLBACK_COLORS = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-red-500',
    'bg-yellow-500'
];

export default function CourseCard({ course, index }: CourseCardProps) {
    const navigate = useNavigate();
    const { user } = useAuth();

    const isGeneratedImage = (url: string): boolean => {
        return url.includes('course.svg') || url.includes('generated');
    };

    const formatDate = (timestamp: number | undefined): string => {
        if (!timestamp) return 'No disponible';
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const handleEnrollClick = () => {
        if (!user) {
            alert('Debes iniciar sesión primero');
            navigate('/login');
            return;
        }


        axios.post('http://localhost:8000/api/enroll/', {
            courseid: course.id

        }, { withCredentials: true })
            .then(res => {
                alert(res.data.message || '¡Matrícula exitosa!');
            })
            .catch(err => {
                alert('Error al matricularte');
                console.error(err);
            });


    };

    const handleExportClick = () => {
    window.open(`http://localhost:8000/api/export/${course.id}/`);
};

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden flex flex-col h-full">
            {/* Imagen o fondo con letra inicial */}
            <div className="h-40 relative flex items-center justify-center overflow-hidden">
                {!course.courseimage || isGeneratedImage(course.courseimage) ? (
                    <div className={`absolute inset-0 ${FALLBACK_COLORS[index % FALLBACK_COLORS.length]} flex items-center justify-center`}>
                        <span className="text-white text-6xl font-extrabold opacity-30 select-none">
                            {course.fullname.charAt(0)}
                        </span>
                    </div>
                ) : (
                    <img
                        src={course.courseimage}
                        alt={`Imagen de ${course.fullname}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Sin+Imagen';
                        }}
                    />
                )}
            </div>

            {/* Contenido del curso */}
            <div className="flex flex-col flex-grow p-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                        {course.fullname}
                    </h2>

                    {/* Fechas de inicio y fin */}
                    <div className="text-sm text-gray-600 mb-4">
                        <p><strong>Inicio:</strong> {formatDate(course.startdate)}</p>
                        <p><strong>Fin:</strong> {formatDate(course.enddate)}</p>
                    </div>
                        {/* Descripción con HTML limpiado */}
                    <div
                        className="text-gray-600 text-sm line-clamp-4 mb-4"
                        dangerouslySetInnerHTML={{
                            __html: course.summary.replace(/\s(lang|xml:lang)="[^"]+"/g, ''),
                        }}
                    />
                </div>

                {/* Botón Matricularme */}
                <button
                    type="button"
                    onClick={handleEnrollClick}
                    className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
                >
                    Matricularme
                </button>

                {/* Botón Exportar CSV */}
                {user?.is_superuser && (
                <button
                    type="button"
                    onClick={handleExportClick}
                    className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                >
                    Exportar usuarios
                </button>)}
            </div>

            {/* Footer con ID del curso */}
            <div className="bg-gray-100 px-6 py-3 border-t border-gray-200">
                <span className="text-gray-700 text-sm font-medium">
                    ID del curso: <span className="font-semibold">{course.id}</span>
                </span>
            </div>
        </div>
    );
}