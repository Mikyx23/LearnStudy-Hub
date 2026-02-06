export const INSERT_SCHEDULE = `INSERT INTO tbl_horarios (id_curso, dia_semana, hora_inicio, hora_final, aula) VALUES ?`;

export const DELETE_SCHEDULE = `
DELETE h 
FROM tbl_horarios h
INNER JOIN tbl_cursos_academicos c ON h.id_curso = c.id_curso
WHERE c.id_usuario = ? AND c.id_lapso = ?;
`;

export const GET_COURSES_SCHEDULE = `
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
    WHERE ac.id_carrera = ?
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
    AND ic.id_carrera = ?
WHERE ca.id_usuario = ?
AND ca.id_lapso = ?
`;

export const GET_SCHEDULE = `
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
    WHERE ac.id_carrera = ?
)
SELECT
    ca.id_curso,
    ap.nombre_asignatura_romano AS subject,
    CASE h.dia_semana
        WHEN 1 THEN 'Lunes'
        WHEN 2 THEN 'Martes'
        WHEN 3 THEN 'Miércoles'
        WHEN 4 THEN 'Jueves'
        WHEN 5 THEN 'Viernes'
        WHEN 6 THEN 'Sábado'
        WHEN 7 THEN 'Domingo'
        ELSE 'No definido'
    END AS day,
    h.hora_inicio AS startTime, 
    h.hora_final AS endTime,
    h.aula AS classroom
FROM tbl_cursos_academicos ca
INNER JOIN AsignaturasProcesadas ap 
    ON ap.id_asignatura_carrera = ca.id_asignatura_carrera
INNER JOIN tbl_horarios h 
    ON h.id_curso = ca.id_curso
INNER JOIN tbl_inscripciones_carreras ic 
    ON ic.id_usuario = ca.id_usuario 
    AND ic.id_carrera = ap.id_carrera
    AND ic.id_carrera = ?
WHERE ca.id_usuario = ?
AND ca.id_lapso = ?
ORDER BY h.dia_semana, h.hora_inicio;
`;