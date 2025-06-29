import { useEffect, useState } from 'react';
import axios from 'axios';
import CourseCard from './components/CourseCard';
import EnrollModal from './components/EnrollModal';
import type { FormData } from './components/EnrollModal';
import type { Course } from './types/course';

function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  // Cargar cursos desde Django
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get<Course[]>('http://localhost:8000/api/enrolled-courses/');
        setCourses(response.data);
      } catch (err) {
        setError('Error al cargar cursos');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filtrar solo cursos MOOC (category: 3)
  const moocCourses = courses.filter(course => course.category === 3);

  // Manejar matrícula
  const handleEnroll = async (formData: FormData) => {
    try {
      const response = await axios.post('http://localhost:8000/api/enroll/', {
        ...formData,
        courseid: selectedCourseId
      });

      console.log('Matrícula exitosa:', response.data);
    } catch (err: any) {
      console.error('Error en matrícula:', err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Cursos MOOC
        </h1>

        {/* Spinner */}
        {loading && (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center">
            {error}
          </div>
        )}

        {/* Lista de cursos */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {moocCourses.length > 0 ? (
              moocCourses.map((course, index) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  index={index}
                  onEnroll={setSelectedCourseId}
                />
              ))
            ) : (
              <div className="col-span-full bg-yellow-50 border border-yellow-400 text-yellow-800 p-6 rounded-lg text-center">
                <p className="text-lg font-medium">No estás inscrito en ningún curso MOOC</p>
                <p className="mt-2 text-sm">Contacta con el administrador</p>
              </div>
            )}
          </div>
        )}

        {/* Modal de matrícula */}
        {selectedCourseId && (
          <EnrollModal
            isOpen={!!selectedCourseId}
            onClose={() => setSelectedCourseId(null)}
            onSubmit={handleEnroll}
            courseName={courses.find(c => c.id === selectedCourseId)?.fullname || ''}
          />
        )}
      </div>
    </div>
  );
}

export default App;