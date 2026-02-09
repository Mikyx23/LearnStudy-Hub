// =========================================
//          QUERIES DE LOS CURSOS
// =========================================

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
-- Filtramos la inscripción para que coincida con la carrera que estamos consultando
INNER JOIN tbl_inscripciones_carreras ic ON u.id_usuario = ic.id_usuario 
    AND ic.id_carrera = ? -- <--- NUEVO FILTRO: Evita la duplicidad por múltiples carreras
INNER JOIN AsignaturasProcesadas ap ON (
    ap.id_asignatura_carrera = ca.id_asignatura_carrera 
    AND ap.id_carrera = ic.id_carrera
)
WHERE ca.id_usuario = ? AND ca.id_lapso = ?
`;

export const GET_COURSES_AVAILABLE = `
WITH MateriasAprobadas AS (
    -- 1. Filtramos aprobadas SOLO de la carrera actual
    SELECT 
        ca.id_asignatura_carrera,
        ac.uc_asignatura,
        ac.semestre
    FROM tbl_cursos_academicos ca
    JOIN tbl_asignaturas_carreras ac ON ca.id_asignatura_carrera = ac.id_asignatura_carrera
    JOIN tbl_agenda_evaluaciones age ON ca.id_curso = age.id_curso
    WHERE ca.id_usuario = ? 
    AND ac.id_carrera = ?
    GROUP BY ca.id_curso, ac.id_asignatura_carrera, ac.uc_asignatura, ac.semestre
    HAVING SUM(age.calificacion * (age.ponderacion / 100)) >= 9.5
),
ResumenInscripcionActual AS (
    -- 2. UC inscritas en el lapso vigente para esta carrera
    SELECT 
        ac.id_asignatura_carrera, 
        SUM(ac.uc_asignatura) OVER() as total_uc_inscritas
    FROM tbl_cursos_academicos ca
    JOIN tbl_asignaturas_carreras ac ON ca.id_asignatura_carrera = ac.id_asignatura_carrera
    WHERE ca.id_usuario = ? 
    AND ca.id_lapso = ?
    AND ac.id_carrera = ?
),
ResumenEstudiante AS (
    -- 3. Totales históricos basados en el filtro anterior
    SELECT 
        COALESCE(SUM(uc_asignatura), 0) AS total_uca,
        COALESCE(MAX(semestre), 0) AS max_semestre_aprobado
    FROM MateriasAprobadas
),
MallaBaseFormateada AS (
    -- 4. Malla curricular (Ya tenía el filtro de carrera)
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
        WHERE ac.id_carrera = ?
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
    m.id_asignatura_carrera NOT IN (SELECT id_asignatura_carrera FROM MateriasAprobadas)
    AND m.id_asignatura_carrera NOT IN (SELECT id_asignatura_carrera FROM ResumenInscripcionActual)
    AND (COALESCE(curr.total_uc_inscritas, 0) + m.uc_asignatura) <= 21
    AND NOT EXISTS (
        SELECT 1 FROM tbl_prelaciones_materias pm
        WHERE pm.id_asignatura_carrera = m.id_asignatura_carrera
        AND pm.tipo_prelacion = 'REQUISITO'
        AND pm.id_asignatura_prelacion NOT IN (SELECT id_asignatura_carrera FROM MateriasAprobadas)
    )
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