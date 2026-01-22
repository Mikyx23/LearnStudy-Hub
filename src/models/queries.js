// ----- QUERIES DASHBOARD -----
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
            -- Subconsulta para sumar notas por materia
            SELECT id_curso, SUM(calificacion) as nota_final 
            FROM tbl_calificaciones 
            GROUP BY id_curso
        ) cal ON ca3.id_curso = cal.id_curso
        WHERE ca3.id_usuario = u.id_usuario 
        AND cal.nota_final >= 10 -- Ajustar según nota mínima aprobatoria
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
    mn.asignatura_nombre,
    ae.descripcion,
    ae.fecha_entrega,
    ae.ponderacion,
    ae.corte
FROM tbl_cursos_academicos ca
INNER JOIN MallaNombres mn ON ca.id_asignatura_carrera = mn.id_asignatura_carrera
INNER JOIN tbl_agenda_evaluaciones ae ON ca.id_curso = ae.id_curso
WHERE ca.id_usuario = ?  -- Parámetro: ID Usuario
    AND ca.id_lapso = ?    -- Parámetro: ID Lapso Actual
ORDER BY ae.fecha_entrega ASC;
`;

// ----- QUERIES USERS -----


// ----- QUERIES MALLA -----
export const GET_MALLA_CURRICULAR = `
    SELECT 
        t.codigo,
        -- Si la materia aparece más de una vez O no es la excepción, aplicamos números
        CASE 
            WHEN t.nombre_base = 'PROYECTO DE SERVICIO COMUNITARIO' THEN t.nombre_base
            WHEN t.total_repeticiones > 1 THEN CONCAT(t.nombre_base, ' ', 
                CASE t.secuencia
                    WHEN 1 THEN 'I'
                    WHEN 2 THEN 'II'
                    WHEN 3 THEN 'III'
                    WHEN 4 THEN 'IV'
                    WHEN 5 THEN 'V'
                    WHEN 6 THEN 'VI'
                    WHEN 7 THEN 'VII'
                    WHEN 8 THEN 'VIII'
                    WHEN 9 THEN 'IX'
                    WHEN 10 THEN 'X'
                    ELSE '' 
                END)
            ELSE t.nombre_base -- Si solo aparece una vez en toda la carrera, queda original
        END AS nombre,
        t.semestre,
        t.UC,
        t.TH,
        GROUP_CONCAT(DISTINCT CASE WHEN pm.tipo_prelacion = 'REQUISITO' THEN ac_pre.codigo_asignatura END) AS requisitos,
        GROUP_CONCAT(DISTINCT CASE WHEN pm.tipo_prelacion = 'CORREQUISITO' THEN ac_pre.codigo_asignatura END) AS correquisitos,
        MAX(CASE WHEN pa.tipo_prelacion = 'UC_APROBADAS' THEN pa.valor_requerido END) AS UCA,
        MAX(CASE WHEN pa.tipo_prelacion = 'SEMESTRE_APROBADO' THEN pa.valor_requerido END) AS SMA
    FROM (
        -- Subconsulta para contar repeticiones y posición
        SELECT 
            ac.id_asignatura_carrera,
            ac.codigo_asignatura AS codigo,
            a.nombre_asignatura AS nombre_base,
            ac.semestre,
            ac.uc_asignatura AS UC,
            ac.total_horas AS TH,
            -- Da el número actual (1, 2, 3...)
            ROW_NUMBER() OVER (PARTITION BY a.nombre_asignatura ORDER BY ac.semestre) AS secuencia,
            -- Cuenta cuántas veces existe esa materia en toda la carrera 47
            COUNT(*) OVER (PARTITION BY a.nombre_asignatura) AS total_repeticiones
        FROM tbl_asignaturas_carreras ac
        INNER JOIN tbl_asignaturas a ON ac.id_asignatura = a.id_asignatura
        WHERE ac.id_carrera = ?
    ) t
    LEFT JOIN tbl_prelaciones_materias pm ON t.id_asignatura_carrera = pm.id_asignatura_carrera
    LEFT JOIN tbl_asignaturas_carreras ac_pre ON pm.id_asignatura_prelacion = ac_pre.id_asignatura_carrera
    LEFT JOIN tbl_prelaciones_academicas pa ON t.id_asignatura_carrera = pa.id_asignatura_carrera
    GROUP BY t.codigo, t.nombre_base, t.semestre, t.UC, t.TH, t.secuencia, t.total_repeticiones
    ORDER BY t.semestre;
`;

// ----- QUERIES PROFILE -----
export const GET_USER_PROFILE = `
SELECT 
    t.codigo,
    t.nombre_formateado AS subject_name,
    u.nombre AS name,
    u.apellido AS lastname,
    u.cedula,
    u.correo AS email,
    c.nombre_carrera AS career,
    t.uc,
    estudiante.nota,
    t.semestre AS subject_semester,
    (
        SELECT ac2.semestre
        FROM tbl_cursos_academicos ca2
        INNER JOIN tbl_asignaturas_carreras ac2 ON ca2.id_asignatura_carrera = ac2.id_asignatura_carrera
        WHERE ca2.id_usuario = u.id_usuario 
        AND ca2.id_lapso = ?
        GROUP BY ac2.semestre
        ORDER BY COUNT(*) DESC, ac2.semestre DESC
        LIMIT 1
    ) AS current_semester
FROM tbl_usuarios u
INNER JOIN tbl_inscripciones_carreras ic ON u.id_usuario = ic.id_usuario
INNER JOIN tbl_carreras c ON ic.id_carrera = c.id_carrera
-- Traemos todas las asignaturas de la carrera del usuario
CROSS JOIN (
    SELECT 
        ac.codigo_asignatura AS codigo,
        ac.semestre,
        ac.uc_asignatura AS uc,
        ac.id_asignatura_carrera,
        CASE 
            WHEN a.nombre_asignatura = 'PROYECTO DE SERVICIO COMUNITARIO' THEN a.nombre_asignatura
            WHEN COUNT(*) OVER (PARTITION BY a.nombre_asignatura) > 1 THEN 
                CONCAT(a.nombre_asignatura, ' ', 
                    CASE ROW_NUMBER() OVER (PARTITION BY a.nombre_asignatura ORDER BY ac.semestre)
                        WHEN 1 THEN 'I' WHEN 2 THEN 'II' WHEN 3 THEN 'III' 
                        WHEN 4 THEN 'IV' WHEN 5 THEN 'V' WHEN 6 THEN 'VI' 
                        WHEN 7 THEN 'VII' WHEN 8 THEN 'VIII' WHEN 9 THEN 'IX' 
                        WHEN 10 THEN 'X' ELSE '' 
                    END)
            ELSE a.nombre_asignatura 
        END AS nombre_formateado
    FROM tbl_asignaturas_carreras ac
    INNER JOIN tbl_asignaturas a ON ac.id_asignatura = a.id_asignatura
    WHERE ac.id_carrera = ?
) t
-- Intentamos unir las calificaciones si existen
LEFT JOIN (
    SELECT 
        ca.id_asignatura_carrera,
        SUM(cal.calificacion) AS nota
    FROM tbl_cursos_academicos ca
    INNER JOIN tbl_calificaciones cal ON ca.id_curso = cal.id_curso
    WHERE ca.id_usuario = ? AND ca.id_lapso = ?
    GROUP BY ca.id_asignatura_carrera
) estudiante ON t.id_asignatura_carrera = estudiante.id_asignatura_carrera
WHERE u.id_usuario = ? AND c.id_carrera = ?
ORDER BY t.semestre, subject_name;
`;

// ----- QUERIES CURSOS -----
export const ADD_COURSE = `INSERT INTO tbl_cursos_academicos (id_usuario, id_asignatura_carrera, id_lapso) VALUES (?, ?, ?);`;

export const GET_COURSES = `
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
    u.nombre,
    u.apellido,
    ap.codigo_asignatura AS codigo,
    ap.nombre_romano AS nombre_asignatura,
    ap.uc_asignatura AS creditos
FROM tbl_cursos_academicos ca
INNER JOIN tbl_usuarios u ON u.id_usuario = ca.id_usuario
-- Traemos la carrera del usuario para asegurar que el cruce sea correcto
INNER JOIN tbl_inscripciones_carreras ic ON u.id_usuario = ic.id_usuario
INNER JOIN AsignaturasProcesadas ap ON (
    ap.id_asignatura_carrera = ca.id_asignatura_carrera 
    AND ap.id_carrera = ic.id_carrera
)
WHERE ca.id_usuario = ? AND ca.id_lapso = ?
`;

export const GET_COURSES_AVAILABLE = `
WITH MateriasAprobadas AS (
    -- 1. Materias que el usuario ya aprobó
    SELECT 
        ca.id_asignatura_carrera,
        ac.uc_asignatura,
        ac.semestre
    FROM tbl_cursos_academicos ca
    JOIN tbl_asignaturas_carreras ac ON ca.id_asignatura_carrera = ac.id_asignatura_carrera
    -- Unimos con la agenda para obtener el peso de cada evaluación
    JOIN tbl_agenda_evaluaciones age ON ca.id_curso = age.id_curso
    -- Unimos con calificaciones para obtener la nota del alumno
    JOIN tbl_calificaciones cal ON age.id_evaluacion = cal.id_evaluacion
    WHERE ca.id_usuario = ? 
    GROUP BY ca.id_curso, ac.id_asignatura_carrera, ac.uc_asignatura, ac.semestre
    -- El cálculo ahora usa la ponderación desde 'age' (tbl_agenda_evaluaciones)
    HAVING SUM(cal.calificacion * (age.ponderacion / 100)) >= 9.5
),
ResumenInscripcionActual AS (
    -- 2. UC inscritas en el lapso vigente
    SELECT 
        ac.id_asignatura_carrera, 
        SUM(ac.uc_asignatura) OVER() as total_uc_inscritas
    FROM tbl_cursos_academicos ca
    JOIN tbl_asignaturas_carreras ac ON ca.id_asignatura_carrera = ac.id_asignatura_carrera
    WHERE ca.id_usuario = ? AND ca.id_lapso = ?
),
ResumenEstudiante AS (
    -- 3. Totales históricos
    SELECT 
        COALESCE(SUM(uc_asignatura), 0) AS total_uca,
        COALESCE(MAX(semestre), 0) AS max_semestre_aprobado
    FROM MateriasAprobadas
),
MallaBaseFormateada AS (
    -- 4. Malla curricular con formato de nombres
    SELECT 
        t.id_asignatura_carrera,
        t.codigo,
        CASE 
            WHEN t.nombre_base = 'PROYECTO DE SERVICIO COMUNITARIO' THEN t.nombre_base
            WHEN t.total_repeticiones > 1 THEN CONCAT(t.nombre_base, ' ', 
                CASE t.secuencia
                    WHEN 1 THEN 'I' WHEN 2 THEN 'II' WHEN 3 THEN 'III'
                    WHEN 4 THEN 'IV' WHEN 5 THEN 'V' WHEN 6 THEN 'VI'
                    WHEN 7 THEN 'VII' WHEN 8 THEN 'VIII' WHEN 9 THEN 'IX'
                    WHEN 10 THEN 'X' ELSE '' 
                END)
            ELSE t.nombre_base 
        END AS nombre_completo,
        t.semestre,
        t.uc_asignatura
    FROM (
        SELECT 
            ac.id_asignatura_carrera,
            ac.codigo_asignatura AS codigo,
            a.nombre_asignatura AS nombre_base,
            ac.semestre,
            ac.uc_asignatura,
            ROW_NUMBER() OVER (PARTITION BY a.nombre_asignatura ORDER BY ac.semestre) AS secuencia,
            COUNT(*) OVER (PARTITION BY a.nombre_asignatura) AS total_repeticiones
        FROM tbl_asignaturas_carreras ac
        INNER JOIN tbl_asignaturas a ON ac.id_asignatura = a.id_asignatura
        WHERE ac.id_carrera = ? AND ac.estado_asignatura_carrera = TRUE
    ) t
)
SELECT 
    m.id_asignatura_carrera AS id,
    m.codigo,
    m.nombre_completo AS nombre_asignatura,
    m.semestre,
    m.uc_asignatura AS creditos
FROM MallaBaseFormateada m
CROSS JOIN ResumenEstudiante re
LEFT JOIN (SELECT DISTINCT total_uc_inscritas FROM ResumenInscripcionActual) curr ON 1=1
WHERE 
    -- REGLA 1: No haberla aprobado ya
    m.id_asignatura_carrera NOT IN (SELECT id_asignatura_carrera FROM MateriasAprobadas)
    
    -- REGLA 2: No tenerla inscrita en el lapso actual
    AND m.id_asignatura_carrera NOT IN (SELECT id_asignatura_carrera FROM ResumenInscripcionActual)

    -- REGLA DE LAS 21 UC
    AND (COALESCE(curr.total_uc_inscritas, 0) + m.uc_asignatura) <= 21

    -- REGLA 3: Prelaciones de materias
    AND NOT EXISTS (
        SELECT 1 FROM tbl_prelaciones_materias pm
        WHERE pm.id_asignatura_carrera = m.id_asignatura_carrera
        AND pm.tipo_prelacion = 'REQUISITO'
        AND pm.id_asignatura_prelacion NOT IN (SELECT id_asignatura_carrera FROM MateriasAprobadas)
    )

    -- REGLA 4: Prelaciones académicas
    AND NOT EXISTS (
        SELECT 1 FROM tbl_prelaciones_academicas pa
        WHERE pa.id_asignatura_carrera = m.id_asignatura_carrera
        AND (
            (pa.tipo_prelacion = 'UC_APROBADAS' AND re.total_uca < pa.valor_requerido) OR
            (pa.tipo_prelacion = 'SEMESTRE_APROBADO' AND re.max_semestre_aprobado < pa.valor_requerido)
        )
    )
ORDER BY m.semestre, m.nombre_completo;
`;

// ----- QUERIES AGENDA -----
export const INSERT_EXAM = `INSERT INTO tbl_agenda_evaluaciones (id_curso, descripcion, corte, ponderacion, fecha_entrega) VALUES (?, ?, ?, ?, ?)`;

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
-- Unimos con el CTE usando el id_asignatura_carrera
INNER JOIN AsignaturasProcesadas ap 
    ON ap.id_asignatura_carrera = ca.id_asignatura_carrera
-- Es importante filtrar por la carrera del usuario para que el ROW_NUMBER funcione bien
INNER JOIN tbl_inscripciones_carreras ic 
    ON ic.id_usuario = ca.id_usuario AND ic.id_carrera = ap.id_carrera
WHERE ca.id_usuario = ? AND ca.id_lapso = ?;
`;

export const GET_EXAMS = `
WITH AsignaturasProcesadas AS (
    SELECT 
        ac.id_asignatura_carrera,
        ac.codigo_asignatura,
        ac.uc_asignatura,
        ac.id_carrera,
        a.nombre_asignatura,
        -- Calculamos la secuencia y el total antes para evitar conflictos en el CASE
        ROW_NUMBER() OVER (PARTITION BY a.nombre_asignatura, ac.id_carrera ORDER BY ac.semestre) AS secuencia,
        COUNT(*) OVER (PARTITION BY a.nombre_asignatura, ac.id_carrera) AS total_repeticiones
    FROM tbl_asignaturas_carreras ac
    INNER JOIN tbl_asignaturas a ON ac.id_asignatura = a.id_asignatura
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
        END AS nombre_romano
    FROM AsignaturasProcesadas
)
SELECT
    ca.id_curso AS id,
    ap.nombre_romano AS asignatura_nombre,
    ae.descripcion AS nombre,
    ae.corte AS corte,
    ae.ponderacion AS porcentaje,
    ae.fecha_entrega AS fecha
FROM tbl_cursos_academicos ca
INNER JOIN MallaConNombres ap 
    ON ca.id_asignatura_carrera = ap.id_asignatura_carrera
-- Cambia a LEFT JOIN si quieres ver cursos aunque no tengan evaluaciones cargadas
INNER JOIN tbl_agenda_evaluaciones ae 
    ON ca.id_curso = ae.id_curso
WHERE ca.id_usuario = ? 
    AND ca.id_lapso = ?
ORDER BY ap.nombre_romano, ae.fecha_entrega;
`;

// ----- QUERIES CALIFICACIONES -----
export const INSERT_QUALIFICATIONS = 'INSERT INTO tbl_calificaciones (id_curso, id_evaluacion, calificacion) VALUES (?, ?, ?)';

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
    -- Cálculo: Sumatoria de (Nota * (Ponderacion / 100))
    SUM(COALESCE(cal.calificacion, 0) * (ev.ponderacion / 100.0)) AS promedio
FROM tbl_cursos_academicos ca
INNER JOIN tbl_inscripciones_carreras ic ON ca.id_usuario = ic.id_usuario
INNER JOIN AsignaturasProcesadas ap ON (
    ap.id_asignatura_carrera = ca.id_asignatura_carrera 
    AND ap.id_carrera = ic.id_carrera
)
INNER JOIN tbl_agenda_evaluaciones ev ON ca.id_curso = ev.id_curso
LEFT JOIN tbl_calificaciones cal ON (
    ev.id_evaluacion = cal.id_evaluacion 
    AND ca.id_curso = cal.id_curso
)
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
    cal.calificacion AS nota
FROM tbl_cursos_academicos ca
INNER JOIN tbl_usuarios u ON u.id_usuario = ca.id_usuario
INNER JOIN tbl_inscripciones_carreras ic ON u.id_usuario = ic.id_usuario
INNER JOIN AsignaturasProcesadas ap ON (
    ap.id_asignatura_carrera = ca.id_asignatura_carrera 
    AND ap.id_carrera = ic.id_carrera
)
-- 1. Unimos con la agenda para saber qué evaluaciones existen en el curso
INNER JOIN tbl_agenda_evaluaciones ev ON ca.id_curso = ev.id_curso
-- 2. Unimos con calificaciones para ver la nota de esa evaluación específica
LEFT JOIN tbl_calificaciones cal ON (
    ev.id_evaluacion = cal.id_evaluacion 
    AND ca.id_curso = cal.id_curso
)
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
        END AS nombre_romano
    FROM AsignaturasProcesadas
)
SELECT
    ca.id_curso,
    ae.id_evaluacion,
    ae.descripcion,
    ae.ponderacion AS porcentaje,
    ae.corte,
    cal.calificacion
FROM tbl_cursos_academicos ca
INNER JOIN MallaConNombres ap 
    ON ca.id_asignatura_carrera = ap.id_asignatura_carrera
INNER JOIN tbl_agenda_evaluaciones ae 
    ON ca.id_curso = ae.id_curso
LEFT JOIN tbl_calificaciones cal 
    ON (ae.id_evaluacion = cal.id_evaluacion AND ca.id_curso = cal.id_curso)
WHERE ca.id_usuario = ? 
    AND ca.id_lapso = ?
ORDER BY ca.id_curso, ae.corte, ae.fecha_entrega;
`;

// ----- QUERIES HORARIO -----
export const INSERT_SCHEDULE = `INSERT INTO tbl_horarios (id_curso, dia_semana, hora_inicio, hora_final, aula) VALUES ?`;

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
)
SELECT
    ca.id_curso AS id,
    ap.nombre_asignatura_romano AS nombre
FROM tbl_cursos_academicos ca
INNER JOIN AsignaturasProcesadas ap 
    ON ap.id_asignatura_carrera = ca.id_asignatura_carrera
INNER JOIN tbl_inscripciones_carreras ic 
    ON ic.id_usuario = ca.id_usuario AND ic.id_carrera = ap.id_carrera
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
    ON ic.id_usuario = ca.id_usuario AND ic.id_carrera = ap.id_carrera
WHERE ca.id_usuario = ?
AND ca.id_lapso = ?
ORDER BY h.dia_semana, h.hora_inicio;
`;