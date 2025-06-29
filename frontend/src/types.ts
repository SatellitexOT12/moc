interface Course {
  id: number;
  fullname: string;
  summary: string;
  courseimage?: string; // Opcional
  startdate?: number;   // Timestamp Unix
  enddate?: number;     // Timestamp Unix
  categoryid?: number;  // ID de la categoría
}