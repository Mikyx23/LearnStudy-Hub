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
        ac.id_asignatura_carrera,
        ac.uc_asignatura,
        ac.semestre
    FROM tbl_cursos_academicos ca
    JOIN tbl_asignaturas_carreras ac ON ca.id_asignatura_carrera = ac.id_asignatura_carrera
    JOIN tbl_calificaciones cal ON ca.id_curso = cal.id_curso
    WHERE ca.id_usuario = ? 
    GROUP BY ca.id_curso
    HAVING SUM(cal.calificacion * (cal.ponderacion / 100)) >= 9.5
),
ResumenInscripcionActual AS (
    -- 2. Corregido: Especificamos ac.id_asignatura_carrera para evitar la ambigüedad
    SELECT 
        ac.id_asignatura_carrera, 
        SUM(ac.uc_asignatura) OVER() as total_uc_inscritas
    FROM tbl_cursos_academicos ca
    JOIN tbl_asignaturas_carreras ac ON ca.id_asignatura_carrera = ac.id_asignatura_carrera
    WHERE ca.id_usuario = ? AND ca.id_lapso = ?
),
ResumenEstudiante AS (
    -- 3. Totales históricos para verificar prelaciones académicas
    SELECT 
        COALESCE(SUM(uc_asignatura), 0) AS total_uca,
        COALESCE(MAX(semestre), 0) AS max_semestre_aprobado
    FROM MateriasAprobadas
),
MallaBaseFormateada AS (
    -- 4. Malla con la lógica de nombres y números romanos
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

    -- REGLA DE LAS 21 UC: Lo ya inscrito + esta materia no debe superar 21
    AND (COALESCE(curr.total_uc_inscritas, 0) + m.uc_asignatura) <= 21

    -- REGLA 3: Cumplir prelaciones de materias (REQUISITOS)
    AND NOT EXISTS (
        SELECT 1 FROM tbl_prelaciones_materias pm
        WHERE pm.id_asignatura_carrera = m.id_asignatura_carrera
        AND pm.tipo_prelacion = 'REQUISITO'
        AND pm.id_asignatura_prelacion NOT IN (SELECT id_asignatura_carrera FROM MateriasAprobadas)
    )

    -- REGLA 4: Cumplir prelaciones académicas (UCA o Semestre)
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