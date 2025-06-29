import { useEffect, useState } from 'react';
import axios from 'axios';

interface Course {
  id: number;
  fullname: string;
  summary: string;
  courseimage?: string;
  startdate?: number;
  enddate?: number;
  category?: number;
}

const FALLBACK_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-red-500',
  'bg-yellow-500',
];

function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get<Course[]>('http://localhost:8000/api/enrolled-courses/');
        setCourses(response.data);
      } catch (err) {
        console.error('Error al cargar cursos:', err);
        setError('No se pudieron cargar los cursos. Inténtalo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const isGeneratedImage = (url: string): boolean => {
    return url.includes('course.svg') || url.includes('generated');
  };

  const formatDate = (timestamp: number | undefined): string => {
    if (!timestamp) return 'No disponible';
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const moocCourses = courses.filter(course => course.category === 3);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Cursos MOOC
        </h1>

        {/* Spinner de carga */}
        {loading && (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Lista de cursos */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {moocCourses.length > 0 ? (
              moocCourses.map((course, index) => {
                const hasImage = course.courseimage && !isGeneratedImage(course.courseimage);
                const bgColor = FALLBACK_COLORS[index % FALLBACK_COLORS.length];

                return (
                  <div
                    key={course.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out overflow-hidden flex flex-col h-full"
                  >
                    {/* Imagen o fondo con letra inicial */}
                    <div className="h-40 relative flex items-center justify-center overflow-hidden">
                      {/* Fondo con letra inicial si no hay imagen */}
                      {!hasImage && (
                        <div
                          className={`absolute inset-0 ${bgColor} flex items-center justify-center`}
                        >
                          <span className="text-white text-6xl font-extrabold opacity-30 select-none">
                            {course.fullname.charAt(0)}
                          </span>
                        </div>
                      )}

                      {/* Imagen del curso */}
                      {hasImage && (
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

                      {/* Botón Matricularme - Siempre arriba del footer */}
                      <button
                        className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
                      >
                        Matricularme
                      </button>
                    </div>

                    {/* Footer con ID del curso */}
                    <div className="bg-gray-100 px-6 py-3 border-t border-gray-200">
                      <span className="text-gray-700 text-sm font-medium">
                        ID del curso: <span className="font-semibold">{course.id}</span>
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full bg-yellow-50 border border-yellow-200 text-yellow-800 p-6 rounded-lg text-center">
                <p className="text-lg font-medium">No estás inscrito en ningún curso MOOC.</p>
                <p className="mt-2 text-sm">
                  Contacta con el administrador para obtener más información.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;