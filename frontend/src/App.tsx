import { useEffect, useState } from 'react';
import axios from 'axios';

interface Course {
  id: number;
  fullname: string;
  summary: string;
}

interface MoodleUser {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
}

function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [userFound, setUserFound] = useState<MoodleUser | null>(null);
  const [error, setError] = useState('');

  // Cargar cursos al iniciar
  useEffect(() => {
    axios.get('http://localhost:8000/api/courses/')
      .then(res => setCourses(res.data))
      .catch(err => console.error('Error al cargar cursos:', err));
  }, []);

  // Buscar usuario por nombre de usuario
  const handleSearchUser = () => {
    if (!username.trim()) {
      setError('Por favor ingresa un nombre de usuario');
      return;
    }

    setError('');
    axios.get(`http://localhost:8000/api/user/?username=${username}`)
      .then(res => {
        if (res.data.id) {
          setUserId(res.data.id);
          setUserFound(res.data);
          setError('');
        } else {
          setError('Usuario no encontrado');
          setUserId(null);
          setUserFound(null);
        }
      })
      .catch(err => {
        console.error('Error al buscar usuario:', err);
        setError('No se pudo encontrar el usuario');
        setUserId(null);
        setUserFound(null);
      });
  };

  // Inscribir usuario al curso seleccionado
  const handleEnroll = () => {
    if (!userId || !selectedCourseId) {
      alert('Asegúrate de haber seleccionado un curso y buscado un usuario válido.');
      return;
    }

    setLoading(true);
    axios.post('http://localhost:8000/api/enroll/', {
      courseid: selectedCourseId,
      userid: userId
    })
    .then(res => {
      alert('✅ ¡Inscripción exitosa!');
    })
    .catch(err => {
      const errorMessage = err.response?.data?.error || err.message;
      alert(`❌ Error: ${errorMessage}`);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Cursos MOOC</h1>

      {/* Campo de búsqueda de usuario */}
      <div className="mb-6 flex flex-col items-center">
        <div className="flex gap-2 w-full max-w-md">
          <input
            type="text"
            placeholder="Nombre de usuario en Moodle"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 rounded flex-grow"
          />
          <button
            onClick={handleSearchUser}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
          >
            Buscar
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {userFound && (
          <div className="mt-4 bg-white p-4 rounded shadow w-full">
            <p><strong>Usuario encontrado:</strong> {userFound.firstname} {userFound.lastname}</p>
            <p><strong>Email:</strong> {userFound.email}</p>
          </div>
        )}
      </div>

      {/* Lista de cursos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map(course => (
          <div key={course.id} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{course.fullname}</h2>
            <p className="text-gray-600">{course.summary}</p>
            <button
              onClick={() => setSelectedCourseId(course.id)}
              className={`mt-2 px-4 py-2 rounded ${
                selectedCourseId === course.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {selectedCourseId === course.id ? 'Seleccionado' : 'Seleccionar'}
            </button>
          </div>
        ))}
      </div>

      {/* Botón de inscripción */}
      {selectedCourseId && userFound && (
        <div className="mt-6 text-center">
          <button
            onClick={handleEnroll}
            disabled={loading}
            className={`bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded transition-opacity ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Inscribiendo...' : '✅ Inscribirse en este curso'}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;