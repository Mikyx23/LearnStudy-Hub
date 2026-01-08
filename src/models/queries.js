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
    estudiante.name,
    estudiante.lastname,
    estudiante.cedula,
    estudiante.email,
    estudiante.career,
    estudiante.uc,
    estudiante.nota,
    estudiante.subject_semester,
    estudiante.current_semester
FROM (
    /* Subconsulta 1: Lógica de nombres romanos */
    SELECT 
        ac.codigo_asignatura AS codigo,
        ac.semestre,
        CASE 
            WHEN a.nombre_asignatura = 'PROYECTO DE SERVICIO COMUNITARIO' THEN a.nombre_asignatura
            WHEN COUNT(*) OVER (PARTITION BY a.nombre_asignatura) > 1 THEN 
                CONCAT(a.nombre_asignatura, ' ', 
                    CASE ROW_NUMBER() OVER (PARTITION BY a.nombre_asignatura ORDER BY ac.semestre)
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
            ELSE a.nombre_asignatura 
        END AS nombre_formateado
    FROM tbl_asignaturas_carreras ac
    INNER JOIN tbl_asignaturas a ON ac.id_asignatura = a.id_asignatura
    WHERE ac.id_carrera = ?
) t
INNER JOIN (
    /* Subconsulta 2: Calificaciones y datos (Cambiado a INNER JOIN para evitar NULLs) */
    SELECT 
        u.nombre AS name,
        u.apellido AS lastname,
        u.cedula,
        u.correo AS email,
        c.nombre_carrera AS career,
        ac.codigo_asignatura AS codigo_ref,
        ac.uc_asignatura AS uc,
        SUM(cal.calificacion) AS nota,
        ac.semestre AS subject_semester,
        (
            SELECT ac2.semestre
            FROM tbl_cursos_academicos ca2
            INNER JOIN tbl_asignaturas_carreras ac2 ON ca2.id_asignatura_carrera = ac2.id_asignatura_carrera
            WHERE ca2.id_usuario = u.id_usuario 
            AND ca2.id_lapso = ca.id_lapso
            GROUP BY ac2.semestre
            ORDER BY COUNT(*) DESC, ac2.semestre DESC
            LIMIT 1
        ) AS current_semester
    FROM tbl_usuarios u
    INNER JOIN tbl_inscripciones_carreras ic ON u.id_usuario = ic.id_usuario
    INNER JOIN tbl_carreras c ON ic.id_carrera = c.id_carrera
    INNER JOIN tbl_cursos_academicos ca ON ca.id_usuario = u.id_usuario
    INNER JOIN tbl_calificaciones cal ON ca.id_curso = cal.id_curso
    INNER JOIN tbl_asignaturas_carreras ac ON ca.id_asignatura_carrera = ac.id_asignatura_carrera
    WHERE u.id_usuario = ? AND c.id_carrera = ? AND ca.id_lapso = ?
    GROUP BY 
        u.id_usuario, u.nombre, u.apellido, u.cedula, u.correo, 
        c.nombre_carrera, ac.codigo_asignatura, ac.uc_asignatura, ac.semestre, ca.id_lapso
) estudiante ON t.codigo = estudiante.codigo_ref
ORDER BY t.semestre, subject_name;
`;