// =========================================
//          QUERIES DE LA AGENDA
// =========================================

// GUARDA LAS EVALUACIONES INGRESADAS EN LA AGENDA
export const INSERT_EXAM = `INSERT INTO tbl_agenda_evaluaciones (id_curso, descripcion, corte, ponderacion, fecha_entrega) VALUES (?, ?, ?, ?, ?)`;

// ACTUALIZA EL ESTADO DE LA EVALUACIÓN
export const SET_STATE_EXAM = `UPDATE tbl_agenda_evaluaciones SET estado = ? WHERE id_evaluacion = ?`;

// ELIMINA LA EVALUACIÓN
export const DELETE_EXAM = `DELETE FROM tbl_agenda_evaluaciones WHERE id_evaluacion = ?`;

// OBTIENE LOS CURSOS INSCRITOS PARA MOSTRARLOS EN LA SELECCION DE LA AGENDA
export const GET_COURSES_AGENDA = `
WITH AsignaturasProcesadas AS (
    SELECT 
        ac.id_asignatura_carrera,
        ac.id_carrera,
        CASE 
            WHEN a.nombre_asignatura = 'PROYECTO DE SERVICIO COMUNITARIO' THEN a.nombre_asignatura
            WHEN COUNT(*) OVER (PARTITION BY a.nombre_asignatura, ac.id_carrera) > 1 THEN 
                CONCAT(a.nombre_asignatura, ' ', 
                    CASE ROW_NUMBER() OVER (PARTITION BY a.nombre_asignatura, ac.id_carrera ORDER BY ac.semestre)
                        WHEN 1 THEN 'I' WHEN 2 THEN 'II' WHEN 3 THEN 'III' WHEN 4 THEN 'IV'
                        WHEN 5 THEN 'V' WHEN 6 THEN 'VI' WHEN 7 THEN 'VII' WHEN 8 THEN 'VIII'
                        WHEN 9 THEN 'IX' WHEN 10 THEN 'X' ELSE '' 
                    END)
            ELSE a.nombre_asignatura 
        END AS nombre_asignatura_romano
    FROM tbl_asignaturas_carreras ac
    INNER JOIN tbl_asignaturas a ON ac.id_asignatura = a.id_asignatura
)
SELECT
    ca.id_curso AS id,
    ap.nombre_asignatura_romano AS nombre
FROM tbl_cursos_academicos ca
INNER JOIN AsignaturasProcesadas ap 
    ON ap.id_asignatura_carrera = ca.id_asignatura_carrera
INNER JOIN tbl_inscripciones_carreras ic 
    ON ic.id_usuario = ca.id_usuario 
    AND ic.id_carrera = ap.id_carrera
    AND ic.id_carrera = ? -- <--- FILTRO AGREGADO: Garantiza el contexto de la carrera activa
WHERE ca.id_usuario = ? AND ca.id_lapso = ?;
`;

// OBTIENE LAS EVALUACIONES REGISTRADAS PARA MOSTRARLAS EN LA AGENDA
export const GET_EXAMS = `
WITH AsignaturasProcesadas AS (
    SELECT 
        ac.id_asignatura_carrera,
        ac.id_carrera,
        a.nombre_asignatura,
        ROW_NUMBER() OVER (PARTITION BY a.nombre_asignatura, ac.id_carrera ORDER BY ac.semestre) AS secuencia,
        COUNT(*) OVER (PARTITION BY a.nombre_asignatura, ac.id_carrera) AS total_repeticiones
    FROM tbl_asignaturas_carreras ac
    INNER JOIN tbl_asignaturas a ON ac.id_asignatura = a.id_asignatura
    WHERE ac.id_carrera = ?
),
MallaConNombres AS (
    SELECT 
        id_asignatura_carrera,
        nombre_romano -- (Aquí mantenemos tu lógica de CASE que está perfecta)
    FROM (
        SELECT id_asignatura_carrera,
            CASE 
                WHEN nombre_asignatura = 'PROYECTO DE SERVICIO COMUNITARIO' THEN nombre_asignatura
                WHEN total_repeticiones > 1 THEN 
                    CONCAT(nombre_asignatura, ' ', 
                        CASE secuencia
                            WHEN 1 THEN 'I' WHEN 2 THEN 'II' WHEN 3 THEN 'III' WHEN 4 THEN 'IV'
                            WHEN 5 THEN 'V' WHEN 6 THEN 'VI' WHEN 7 THEN 'VII' WHEN 8 THEN 'VIII'
                            WHEN 9 THEN 'IX' WHEN 10 THEN 'X' ELSE '' 
                        END)
                ELSE nombre_asignatura 
            END AS nombre_romano
        FROM AsignaturasProcesadas
    ) sub
)
SELECT
    ae.id_evaluacion AS id,
    ca.id_curso AS curso_id,
    ap.nombre_romano AS asignatura_nombre,
    ae.descripcion AS nombre,
    ae.corte AS corte,
    ae.ponderacion AS porcentaje,
    ae.fecha_entrega AS fecha,
    ae.estado AS estado
FROM tbl_cursos_academicos ca
INNER JOIN MallaConNombres ap 
    ON ca.id_asignatura_carrera = ap.id_asignatura_carrera
INNER JOIN tbl_agenda_evaluaciones ae 
    ON ca.id_curso = ae.id_curso
WHERE ca.id_usuario = ? 
    AND ca.id_lapso = ?
ORDER BY ae.fecha_entrega ASC;
`;