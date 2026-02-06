export const GET_USER_DATA = `
SELECT 
    u.nombre,
    u.apellido,
    (
        SELECT ac2.semestre
        FROM tbl_cursos_academicos ca2
        INNER JOIN tbl_asignaturas_carreras ac2 ON ca2.id_asignatura_carrera = ac2.id_asignatura_carrera
        WHERE ca2.id_usuario = u.id_usuario 
        AND ca2.id_lapso = ? -- Parámetro: ID Lapso Actual
        GROUP BY ac2.semestre
        ORDER BY COUNT(*) DESC, ac2.semestre DESC
        LIMIT 1
    ) AS current_semester,
    IFNULL((
        SELECT SUM(ac3.uc_asignatura)
        FROM tbl_cursos_academicos ca3
        INNER JOIN tbl_asignaturas_carreras ac3 ON ca3.id_asignatura_carrera = ac3.id_asignatura_carrera
        INNER JOIN (
            -- Ahora sumamos las notas directamente desde la tabla de agenda
            SELECT id_curso, SUM(calificacion) as nota_final 
            FROM tbl_agenda_evaluaciones 
            GROUP BY id_curso
        ) cal ON ca3.id_curso = cal.id_curso
        WHERE ca3.id_usuario = u.id_usuario 
        AND cal.nota_final >= 10 -- Nota mínima aprobatoria
    ), 0) AS uca
FROM tbl_usuarios u
WHERE u.id_usuario = ?; -- Parámetro: ID Usuario
`;

export const GET_ACADEMIC_DATA =`
WITH AsignaturasProcesadas AS (
    SELECT 
        ac.id_asignatura_carrera,
        ac.id_carrera,
        a.nombre_asignatura,
        ROW_NUMBER() OVER (PARTITION BY a.nombre_asignatura, ac.id_carrera ORDER BY ac.semestre) AS secuencia,
        COUNT(*) OVER (PARTITION BY a.nombre_asignatura, ac.id_carrera) AS total_repeticiones
    FROM tbl_asignaturas_carreras ac
    INNER JOIN tbl_asignaturas a ON ac.id_asignatura = a.id_asignatura
    WHERE ac.id_carrera = ? -- Parámetro: ID Carrera
),
MallaNombres AS (
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
        END AS asignatura_nombre
    FROM AsignaturasProcesadas
)
SELECT
    ae.id_evaluacion AS id, -- Importante para identificar la evaluación
    mn.asignatura_nombre,
    ae.descripcion,
    ae.fecha_entrega,
    ae.ponderacion,
    ae.corte,
    ae.estado
FROM tbl_cursos_academicos ca
INNER JOIN MallaNombres mn ON ca.id_asignatura_carrera = mn.id_asignatura_carrera
INNER JOIN tbl_agenda_evaluaciones ae ON ca.id_curso = ae.id_curso
WHERE ca.id_usuario = ?       -- Parámetro: ID Usuario
    AND ca.id_lapso = ?       -- Parámetro: ID Lapso Actual
    AND ae.estado = 'PENDIENTE' -- Filtro de estado
ORDER BY ae.fecha_entrega ASC;
`;

export const GET_TODAY_CLASSES = `
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
    WHERE ac.id_carrera = ? -- <--- FILTRO 1: Contexto de carrera para la nomenclatura
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
    AND ic.id_carrera = ? -- <--- FILTRO 2: Validación de carrera activa
WHERE ca.id_usuario = ?
AND ca.id_lapso = ?
AND h.dia_semana = ?
ORDER BY h.hora_inicio;
`;

export const GET_PHRASE = `SELECT frase FROM tbl_frases ORDER BY RAND() LIMIT 1;`;