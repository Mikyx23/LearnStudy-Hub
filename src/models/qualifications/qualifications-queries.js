export const INSERT_QUALIFICATIONS = `
UPDATE tbl_agenda_evaluaciones 
SET calificacion = ?, 
    estado = 'CALIFICADA' 
WHERE id_evaluacion = ? AND id_curso = ?;
`;

export const INSERT_ACADEMIC_HISTORY = `INSERT INTO tbl_historial_academico (id_usuario, id_asignatura_carrera, nota_definitiva, estado_aprobacion) VALUES (?, ?, ?, ?);`;

export const GET_ACADEMIC_LAPSOS = `SELECT * FROM tbl_lapsos_academicos ORDER BY año DESC, periodo DESC;`;

export const GET_COURSES_QUALIFICATIONS = `
WITH AsignaturasProcesadas AS (
    SELECT 
        ac.id_asignatura_carrera,
        ac.codigo_asignatura,
        ac.uc_asignatura,
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
        END AS nombre_romano
    FROM tbl_asignaturas_carreras ac
    INNER JOIN tbl_asignaturas a ON ac.id_asignatura = a.id_asignatura
)
SELECT 
    ca.id_curso,
    ap.nombre_romano,
    ap.codigo_asignatura,
    ap.uc_asignatura,
    -- Agregamos COALESCE para manejar evaluaciones sin nota aún
    SUM(COALESCE(ev.calificacion, 0) * (ev.ponderacion / 100.0)) AS promedio
FROM tbl_cursos_academicos ca
INNER JOIN tbl_inscripciones_carreras ic ON ca.id_usuario = ic.id_usuario 
    AND ic.id_carrera = ?
INNER JOIN AsignaturasProcesadas ap ON (
    ap.id_asignatura_carrera = ca.id_asignatura_carrera 
    AND ap.id_carrera = ic.id_carrera
)
INNER JOIN tbl_agenda_evaluaciones ev ON ca.id_curso = ev.id_curso
WHERE ca.id_usuario = ? AND ca.id_lapso = ?
GROUP BY 
    ca.id_curso, 
    ap.nombre_romano, 
    ap.codigo_asignatura, 
    ap.uc_asignatura
ORDER BY ap.nombre_romano;
`;

export const GET_QUALIFICATIONS = `
WITH AsignaturasProcesadas AS (
    SELECT 
        ac.id_asignatura_carrera,
        ac.codigo_asignatura,
        ac.uc_asignatura,
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
        END AS nombre_romano
    FROM tbl_asignaturas_carreras ac
    INNER JOIN tbl_asignaturas a ON ac.id_asignatura = a.id_asignatura
)
SELECT 
    ap.nombre_romano AS asignatura,
    ev.descripcion AS evaluacion,
    ev.ponderacion AS porcentaje,
    ev.corte,
    -- La nota ahora viene directamente de la tabla de agenda
    ev.calificacion AS nota
FROM tbl_cursos_academicos ca
INNER JOIN tbl_usuarios u ON u.id_usuario = ca.id_usuario
INNER JOIN tbl_inscripciones_carreras ic ON u.id_usuario = ic.id_usuario
INNER JOIN AsignaturasProcesadas ap ON (
    ap.id_asignatura_carrera = ca.id_asignatura_carrera 
    AND ap.id_carrera = ic.id_carrera
)
-- Ahora solo necesitamos esta tabla para obtener descripción, ponderación y nota
INNER JOIN tbl_agenda_evaluaciones ev ON ca.id_curso = ev.id_curso
WHERE ca.id_usuario = ? AND ca.id_lapso = ?
ORDER BY ap.nombre_romano, ev.corte, ev.fecha_entrega;
`;

export const GET_EXAMS_QUALIFICATIONS = `
WITH AsignaturasProcesadas AS (
    SELECT 
        ac.id_asignatura_carrera,
        ac.id_carrera,
        a.nombre_asignatura,
        ROW_NUMBER() OVER (PARTITION BY a.nombre_asignatura, ac.id_carrera ORDER BY ac.semestre) AS secuencia,
        COUNT(*) OVER (PARTITION BY a.nombre_asignatura, ac.id_carrera) AS total_repeticiones
    FROM tbl_asignaturas_carreras ac
    INNER JOIN tbl_asignaturas a ON ac.id_asignatura = a.id_asignatura
    WHERE ac.id_carrera = ? -- <--- FILTRO 1: Contexto de carrera
),
MallaConNombres AS (
    SELECT 
        id_asignatura_carrera,
        -- Mantenemos tu lógica de CASE para nombres romanos
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
)
SELECT
    ca.id_curso,
    ae.id_evaluacion,
    ae.descripcion,
    ae.ponderacion AS porcentaje,
    ae.corte,
    ae.calificacion
FROM tbl_cursos_academicos ca
INNER JOIN MallaConNombres ap 
    ON ca.id_asignatura_carrera = ap.id_asignatura_carrera
INNER JOIN tbl_agenda_evaluaciones ae 
    ON ca.id_curso = ae.id_curso
WHERE ca.id_usuario = ? 
    AND ca.id_lapso = ?
ORDER BY ca.id_curso, ae.corte, ae.fecha_entrega;
`;

export const GET_ACADEMIC_HISTORY = `
WITH AsignaturasProcesadas AS (
    SELECT 
        ac.id_asignatura_carrera,
        ac.codigo_asignatura,
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
        END AS nombre_romano
    FROM tbl_asignaturas_carreras ac
    INNER JOIN tbl_asignaturas a ON ac.id_asignatura = a.id_asignatura
)
SELECT 
    CONCAT(la.año, '-', LPAD(la.periodo, 2, '0')) AS periodo,
    ap.codigo_asignatura AS codigo,
    ap.nombre_romano AS materia,
    h.nota_definitiva AS nota,
    h.estado_aprobacion AS estado
FROM tbl_historial_academico h
INNER JOIN tbl_lapsos_academicos la ON h.id_lapso = la.id_lapso
INNER JOIN AsignaturasProcesadas ap ON h.id_asignatura_carrera = ap.id_asignatura_carrera
-- Join con inscripciones para asegurar que filtramos por la carrera correcta del usuario
INNER JOIN tbl_inscripciones_carreras ic ON h.id_usuario = ic.id_usuario AND ap.id_carrera = ic.id_carrera
WHERE h.id_usuario = ?
ORDER BY la.año DESC, la.periodo DESC, ap.nombre_romano ASC;
`;

export const GET_MALLA_QUALIFICATIONS = `
SELECT 
    t.id_asignatura_carrera AS id_materia,
    CASE 
        WHEN t.nombre_base = 'PROYECTO DE SERVICIO COMUNITARIO' THEN t.nombre_base
        WHEN t.total_repeticiones > 1 THEN 
            CONCAT(t.nombre_base, ' ', 
                CASE t.secuencia
                    WHEN 1 THEN 'I' WHEN 2 THEN 'II' WHEN 3 THEN 'III' 
                    WHEN 4 THEN 'IV' WHEN 5 THEN 'V' WHEN 6 THEN 'VI' 
                    WHEN 7 THEN 'VII' WHEN 8 THEN 'VIII' WHEN 9 THEN 'IX' 
                    WHEN 10 THEN 'X' ELSE '' 
                END)
        ELSE t.nombre_base 
    END AS nombre,
    t.semestre,
    t.codigo
FROM (
    SELECT 
        ac.id_asignatura_carrera,
        ac.codigo_asignatura AS codigo,
        a.nombre_asignatura AS nombre_base,
        ac.semestre,
        ROW_NUMBER() OVER (PARTITION BY a.nombre_asignatura, ac.id_carrera ORDER BY ac.semestre) AS secuencia,
        COUNT(*) OVER (PARTITION BY a.nombre_asignatura, ac.id_carrera) AS total_repeticiones
    FROM tbl_asignaturas_carreras ac
    INNER JOIN tbl_asignaturas a ON ac.id_asignatura = a.id_asignatura
    WHERE ac.id_carrera = ?
) t
ORDER BY t.semestre, nombre;
`;