export const INSERT_POMODORO_SESSION = `INSERT INTO tbl_pomodoro (id_evaluacion, descripcion_sesion, hora_inicio, hora_final, ciclos) VALUES  (?, ?, ?, ?, ?)`;

export const DELETE_POMODORO_SESSION = `DELETE FROM tbl_pomodoro WHERE id_sesion = ?`;

export const DELETE_POMODORO_HISTORY = `
DELETE p
FROM tbl_pomodoro p
INNER JOIN tbl_agenda_evaluaciones ae ON p.id_evaluacion = ae.id_evaluacion
INNER JOIN tbl_cursos_academicos ca ON ae.id_curso = ca.id_curso
WHERE ca.id_usuario = ? 
AND ca.id_lapso = ?;`;

export const GET_POMODORO_DATA = `
WITH AsignaturasProcesadas AS (
    SELECT 
        ac.id_asignatura_carrera,
        ac.id_carrera,
        a.nombre_asignatura,
        ROW_NUMBER() OVER (PARTITION BY ac.id_carrera, a.nombre_asignatura ORDER BY ac.semestre) AS secuencia,
        COUNT(*) OVER (PARTITION BY ac.id_carrera, a.nombre_asignatura) AS total_repeticiones
    FROM tbl_asignaturas_carreras ac
    INNER JOIN tbl_asignaturas a ON ac.id_asignatura = a.id_asignatura
    WHERE ac.id_carrera = ?
),
MallaConNombres AS (
    SELECT 
        id_asignatura_carrera,
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
        END AS nombre_formateado
    FROM AsignaturasProcesadas
)
SELECT
    ca.id_curso AS id,
    mn.nombre_formateado AS name,
    COALESCE(
        JSON_ARRAYAGG(
            IF(ae.id_evaluacion IS NOT NULL, 
                JSON_OBJECT(
                    'id', ae.id_evaluacion,
                    'name', ae.descripcion,
                    'status', ae.estado
                ), 
                NULL)
        ), 
        JSON_ARRAY()
    ) AS exams
FROM tbl_cursos_academicos ca
INNER JOIN MallaConNombres mn 
    ON ca.id_asignatura_carrera = mn.id_asignatura_carrera
LEFT JOIN tbl_agenda_evaluaciones ae 
    ON ca.id_curso = ae.id_curso 
    AND ae.estado = 'PENDIENTE' 
WHERE ca.id_usuario = ? 
    AND ca.id_lapso = ?
GROUP BY ca.id_curso, mn.nombre_formateado
ORDER BY mn.nombre_formateado;
`;

export const GET_SESSIONS_DATA = `
WITH AsignaturasProcesadas AS (
    SELECT 
        ac.id_asignatura_carrera,
        ac.id_carrera,
        a.nombre_asignatura,
        ROW_NUMBER() OVER (PARTITION BY ac.id_carrera, a.nombre_asignatura ORDER BY ac.semestre) AS secuencia,
        COUNT(*) OVER (PARTITION BY ac.id_carrera, a.nombre_asignatura) AS total_repeticiones
    FROM tbl_asignaturas_carreras ac
    INNER JOIN tbl_asignaturas a ON ac.id_asignatura = a.id_asignatura
    WHERE ac.id_carrera = ?
),
MallaConNombres AS (
    SELECT 
        id_asignatura_carrera,
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
        END AS nombre_formateado
    FROM AsignaturasProcesadas
)
SELECT
    ae.id_evaluacion,
    ae.descripcion AS nombre_evaluacion,
    mn.nombre_formateado AS asignatura,
    p.id_sesion,
    p.descripcion_sesion,
    p.fecha_sesion,
    p.hora_inicio,
    p.hora_final,
    p.ciclos,
    TIMESTAMPDIFF(MINUTE, p.hora_inicio, p.hora_final) AS minutos_totales
FROM tbl_pomodoro p
INNER JOIN tbl_agenda_evaluaciones ae ON p.id_evaluacion = ae.id_evaluacion
INNER JOIN tbl_cursos_academicos ca ON ae.id_curso = ca.id_curso
INNER JOIN MallaConNombres mn ON ca.id_asignatura_carrera = mn.id_asignatura_carrera
WHERE ca.id_usuario = ? 
    AND ca.id_lapso = ?
ORDER BY p.fecha_sesion DESC, p.hora_inicio DESC;
`;