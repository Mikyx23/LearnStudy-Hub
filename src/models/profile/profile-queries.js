export const UPDATE_PROFILE_PHOTO = `UPDATE tbl_usuarios SET foto = ? WHERE id_usuario = ?;`;    

export const GET_USER_PROFILE = `
WITH AsignaturasNombres AS (
    SELECT 
        ac.id_asignatura_carrera,
        ac.codigo_asignatura,
        ac.uc_asignatura,
        ac.id_carrera,
        ac.semestre,
        a.id_asignatura,
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
        END AS nombre_formateado
    FROM tbl_asignaturas_carreras ac
    INNER JOIN tbl_asignaturas a ON ac.id_asignatura = a.id_asignatura
)
SELECT 
    u.nombre AS name,
    u.apellido AS lastname,
    u.cedula,
    u.correo AS email,
    u.foto AS foto_perfil,
    c.nombre_carrera AS career,
    -- Unidades de Crédito Cursadas (UCC)
    SUM(CASE WHEN nota_estudiante.nota_final IS NOT NULL THEN an.uc_asignatura ELSE 0 END) AS ucc,
    -- Unidades de Crédito Aprobadas (UCA)
    SUM(CASE WHEN nota_estudiante.nota_final >= 10 THEN an.uc_asignatura ELSE 0 END) AS uca,
    -- Semestre actual calculado por mayoría de inscripciones en el lapso
    (
        SELECT ac2.semestre
        FROM tbl_cursos_academicos ca2
        INNER JOIN tbl_asignaturas_carreras ac2 ON ca2.id_asignatura_carrera = ac2.id_asignatura_carrera
        WHERE ca2.id_usuario = u.id_usuario 
        AND ca2.id_lapso = ?
        GROUP BY ac2.semestre
        ORDER BY COUNT(*) DESC, ac2.semestre DESC
        LIMIT 1
    ) AS current_semester,
    -- JSON con el detalle de las asignaturas usando el nombre formateado
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'codigo', an.codigo_asignatura,
            'subject_name', an.nombre_formateado,
            'uc', an.uc_asignatura,
            'nota', ROUND(COALESCE(nota_estudiante.nota_final, 0), 2),
            'subject_semester', an.semestre
        )
    ) AS subjects
FROM tbl_usuarios u
INNER JOIN tbl_inscripciones_carreras ic ON u.id_usuario = ic.id_usuario
INNER JOIN tbl_carreras c ON ic.id_carrera = c.id_carrera
INNER JOIN AsignaturasNombres an ON c.id_carrera = an.id_carrera
-- Unión con las notas calculadas ponderadamente
LEFT JOIN (
    SELECT 
        ca.id_asignatura_carrera,
        SUM(ae.calificacion * (ae.ponderacion / 100)) AS nota_final
    FROM tbl_cursos_academicos ca
    INNER JOIN tbl_agenda_evaluaciones ae ON ca.id_curso = ae.id_curso
    WHERE ca.id_usuario = ? AND ca.id_lapso = ?
    GROUP BY ca.id_asignatura_carrera
) AS nota_estudiante ON an.id_asignatura_carrera = nota_estudiante.id_asignatura_carrera
WHERE u.id_usuario = ? AND c.id_carrera = ?
GROUP BY u.id_usuario, c.id_carrera, u.foto;
`;