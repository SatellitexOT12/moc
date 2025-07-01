import type { Course } from '../types/course';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DOMPurify from 'dompurify';

interface CourseCardProps {
    course: Course;
    index: number;
}

export default function CourseCard({ course, index }: CourseCardProps) {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Validación de fechas
    const formatDate = (timestamp: Date): string => {
        return timestamp.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatRawDate = (timestamp: number | undefined): string => {
        if (!timestamp) return 'No disponible';
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getEnrollmentStatus = () => {
        if (!course.startdate) {
            return { status: 'closed' as const, message: 'Fecha de inicio no disponible' };
        }

        const startDate = new Date(course.startdate * 1000);
        const now = new Date();

        const enrollmentStart = new Date(startDate);
        enrollmentStart.setDate(startDate.getDate() - 7);

        let status: 'open' | 'closed' | 'started' = 'closed';
        let message = '';

        if (now >= enrollmentStart && now <= startDate) {
            status = 'open';
            message = `Período de matrícula: ${formatDate(enrollmentStart)} – ${formatDate(startDate)}`;
        } else if (now < enrollmentStart) {
            status = 'closed';
            message = `Matrícula disponible desde ${formatDate(enrollmentStart)}`;
        } else if (now > startDate) {
            status = 'started';
            message = `Curso iniciado el ${formatDate(startDate)}`;
        }

        return { status, message };
    };

    const { status: enrollmentStatus, message: enrollmentMessage } = getEnrollmentStatus();

    const handleEnrollClick = () => {
        if (!user) {
            alert('Debes iniciar sesión primero');
            navigate('/login');
            return;
        }

        if (enrollmentStatus !== 'open') {
            alert('La matrícula no está disponible ahora');
            return;
        }

        axios.post(
            'http://localhost:8000/api/enroll/',
            { courseid: course.id },
            { withCredentials: true }
        )
            .then(res => {
                alert(res.data.message || '¡Te has matriculado correctamente!');
            })
            .catch(err => {
                alert('Error al matricularte');
                console.error(err);
            });
    };

    const handleExportClick = () => {
        window.open(`http://localhost:8000/api/export/${course.id}/`);
    };

    const FALLBACK_COLORS = [
        'bg-blue-500',
        'bg-green-500',
        'bg-purple-500',
        'bg-red-500',
        'bg-yellow-500'
    ];

    const isGeneratedImage = (url: string): boolean =>
        url.includes('course.svg') || url.includes('generated');

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden flex flex-col h-full">
            {/* Imagen o fondo */}
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

            {/* Contenido principal */}
            <div className="flex flex-col flex-grow p-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                        {course.fullname}
                    </h2>

                    {/* Fechas de inicio y fin */}
                    <div className="text-sm text-gray-600 mb-4">
                        <p><strong>Inicio:</strong> {formatRawDate(course.startdate)}</p>
                        <p><strong>Fin:</strong> {formatRawDate(course.enddate)}</p>
                    </div>

                    {/* Descripción del curso */}
                    <div
                        className="text-gray-600 text-sm mb-4 prose max-w-none"
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(course.summary)
                        }}
                    />
                </div>
            </div>

            {/* Botones: Matricularse / Estado / Exportar */}
            <div className="mt-auto border-t border-gray-200 bg-gray-50 px-6 py-4 flex flex-col gap-2">
                {/* Botón o mensaje de matrícula */}
                {enrollmentStatus === 'open' ? (
                    <>
                        <button
                            onClick={handleEnrollClick}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
                        >
                            Matricularme
                        </button>
                        <p className="text-center text-xs text-gray-500">
                            {enrollmentMessage}
                        </p>
                    </>
                ) : enrollmentStatus === 'started' ? (
                    <p className="text-center text-xs text-gray-500">
                        Curso iniciado el {formatRawDate(course.startdate)}
                    </p>
                ) : (
                    <p className="text-center text-xs text-gray-500">
                        {enrollmentMessage}
                    </p>
                )}

                {/* Botón Exportar CSV */}
                {user?.is_superuser && (
                    <button
                        onClick={handleExportClick}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded text-sm"
                    >
                        Exportar usuarios
                    </button>
                )}
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