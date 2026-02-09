export const INSERT_CARRER_CRUD = `INSERT INTO tbl_carreras (nombre_carrera) VALUES (?)`;

export const INSERT_SUBJECT_CRUD = `INSERT INTO tbl_asignaturas (nombre_asignatura) VALUES (?)`;

export const INSERT_MALLA_CRUD = `
INSERT INTO tbl_asignaturas_carreras (id_carrera, id_asignatura, codigo_asignatura, semestre, uc_asignatura, total_horas)
VALUES (?, ?, ?, ?, ?, ?)`;

export const INSERT_LAPSO_CRUD = `INSERT INTO tbl_lapsos_academicos (periodo, año) VALUES (?, ?)`;

export const INSERT_PHRASE_CRUD = `INSERT INTO tbl_frases (frase) VALUES (?)`;

export const INSERT_PRELACION_ACADEMICA_CRUD = `INSERT INTO tbl_prelaciones_academicas (id_asignatura_carrera, tipo_prelacion, valor_requerido) VALUES (?, ?, ?)`;

export const INSERT_PRELACION_MATERIA_CRUD = `INSERT INTO tbl_prelaciones_materias (id_asignatura_carrera, id_asignatura_prelacion, tipo_prelacion) VALUES (?, ?, ?)`;

export const DELETE_USER_CRUD = `DELETE FROM usuarios WHERE id_usuario = ?`;

export const DELETE_CARRER_CRUD = `DELETE FROM tbl_carreras WHERE id_carrera = ?`;

export const DELETE_SUBJECT_CRUD = `DELETE FROM tbl_asignaturas WHERE id_asignatura = ?`;

export const DELETE_LAPSO_CRUD = `DELETE FROM tbl_lapsos_academicos WHERE id_lapso = ?`;

export const DELETE_PHRASE_CRUD = `DELETE FROM tbl_frases WHERE id_frase = ?`;

export const DELETE_MALLA_CRUD = `DELETE FROM tbl_asignaturas_carreras WHERE id_asignatura_carrera = ?`;

export const DELETE_PRELACION_ACADEMICA_CRUD = `DELETE FROM tbl_prelaciones_academicas WHERE id_prelacion_academica = ?`;

export const DELETE_PRELACION_MATERIA_CRUD = `DELETE FROM tbl_prelaciones_materias WHERE id_prelacion_materia = ?`;

export const GET_USERS_CRUD = `
SELECT 
    u.cedula, 
    u.nombre, 
    u.apellido, 
    u.correo, 
    GROUP_CONCAT(ic.id_carrera), -- Esto devuelve "47,45"
    -- Promedios y UC aprobadas (Asumiendo lógica de notas si existen)
    0 AS unidades_credito_aprobadas, 
    0.0 AS promedio_actual, 
    0.0 AS promedio_historico
FROM tbl_usuarios u
LEFT JOIN tbl_inscripciones_carreras ic ON u.id_usuario = ic.id_usuario
WHERE u.rol = 'ESTUDIANTE'
GROUP BY u.id_usuario;
`;

export const GET_CARRERS_CRUD = `
SELECT 
    id_carrera, 
    nombre_carrera
FROM tbl_carreras c
ORDER BY id_carrera;
`;

export const GET_SUBJECTS_CRUD = `
SELECT 
    id_asignatura, 
    nombre_asignatura
FROM tbl_asignaturas;
`;

export const GET_SEMESTERS_CRUD = `
SELECT 
    id_lapso, 
    periodo, 
    año
FROM tbl_lapsos_academicos;
`;

export const GET_PHRASES_CRUD = `
SELECT 
    id_frase, 
    frase
FROM tbl_frases
ORDER BY id_frase;
`;

export const GET_MALLA_CRUD = `
SELECT 
    t.id_asignatura_carrera,
    t.id_carrera,
    t.id_asignatura,
    t.codigo_asignatura,
    -- Lógica de nombres con números romanos por carrera
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
    END AS nombre_asignatura,
    t.semestre,
    t.uc_asignatura,
    t.total_horas,
    -- Concatenamos los IDs de las materias que son prelación (para tu JS)
    GROUP_CONCAT(DISTINCT pm.id_asignatura_prelacion) AS prelaciones,
    -- Extras por si los necesitas en el UI
    GROUP_CONCAT(DISTINCT CASE WHEN pm.tipo_prelacion = 'REQUISITO' THEN ac_pre.codigo_asignatura END) AS requisitos_codigos,
    MAX(CASE WHEN pa.tipo_prelacion = 'UC_APROBADAS' THEN pa.valor_requerido END) AS UCA,
    MAX(CASE WHEN pa.tipo_prelacion = 'SEMESTRE_APROBADO' THEN pa.valor_requerido END) AS SMA
FROM (
    SELECT 
        ac.id_asignatura_carrera,
        ac.id_carrera,
        ac.id_asignatura,
        ac.codigo_asignatura,
        a.nombre_asignatura AS nombre_base,
        ac.semestre,
        ac.uc_asignatura,
        ac.total_horas,
        -- IMPORTANTE: Particionamos por id_carrera para que el conteo sea independiente
        ROW_NUMBER() OVER (PARTITION BY ac.id_carrera, a.nombre_asignatura ORDER BY ac.semestre) AS secuencia,
        COUNT(*) OVER (PARTITION BY ac.id_carrera, a.nombre_asignatura) AS total_repeticiones
    FROM tbl_asignaturas_carreras ac
    INNER JOIN tbl_asignaturas a ON ac.id_asignatura = a.id_asignatura
) t
LEFT JOIN tbl_prelaciones_materias pm ON t.id_asignatura_carrera = pm.id_asignatura_carrera
LEFT JOIN tbl_asignaturas_carreras ac_pre ON pm.id_asignatura_prelacion = ac_pre.id_asignatura_carrera
LEFT JOIN tbl_prelaciones_academicas pa ON t.id_asignatura_carrera = pa.id_asignatura_carrera
GROUP BY 
    t.id_asignatura_carrera, 
    t.id_carrera, 
    t.id_asignatura, 
    t.codigo_asignatura, 
    t.nombre_base, 
    t.semestre, 
    t.uc_asignatura, 
    t.total_horas, 
    t.secuencia, 
    t.total_repeticiones
ORDER BY t.id_carrera, t.semestre;
`;

export const GET_PRELACIONES_MATERIAS_CRUD = `
SELECT 
    pm.*,
    -- Asignatura principal con formato
    CASE 
        WHEN t1.nombre_base = 'PROYECTO DE SERVICIO COMUNITARIO' THEN t1.nombre_base
        WHEN t1.total_repeticiones > 1 THEN CONCAT(t1.nombre_base, ' ', 
            CASE t1.secuencia
                WHEN 1 THEN 'I' WHEN 2 THEN 'II' WHEN 3 THEN 'III'
                WHEN 4 THEN 'IV' WHEN 5 THEN 'V' WHEN 6 THEN 'VI'
                WHEN 7 THEN 'VII' WHEN 8 THEN 'VIII' WHEN 9 THEN 'IX'
                WHEN 10 THEN 'X' ELSE '' 
            END)
        ELSE t1.nombre_base 
    END AS asignatura_principal,
    -- Asignatura prelación con formato
    CASE 
        WHEN t2.nombre_base = 'PROYECTO DE SERVICIO COMUNITARIO' THEN t2.nombre_base
        WHEN t2.total_repeticiones > 1 THEN CONCAT(t2.nombre_base, ' ', 
            CASE t2.secuencia
                WHEN 1 THEN 'I' WHEN 2 THEN 'II' WHEN 3 THEN 'III'
                WHEN 4 THEN 'IV' WHEN 5 THEN 'V' WHEN 6 THEN 'VI'
                WHEN 7 THEN 'VII' WHEN 8 THEN 'VIII' WHEN 9 THEN 'IX'
                WHEN 10 THEN 'X' ELSE '' 
            END)
        ELSE t2.nombre_base 
    END AS asignatura_prelacion,
    c.nombre_carrera,
    ac1.codigo_asignatura AS codigo_principal,
    ac2.codigo_asignatura AS codigo_prelacion
FROM tbl_prelaciones_materias pm
INNER JOIN tbl_asignaturas_carreras ac1 ON pm.id_asignatura_carrera = ac1.id_asignatura_carrera
INNER JOIN tbl_asignaturas_carreras ac2 ON pm.id_asignatura_prelacion = ac2.id_asignatura_carrera
INNER JOIN tbl_carreras c ON ac1.id_carrera = c.id_carrera
INNER JOIN (
    SELECT 
        ac.id_asignatura_carrera,
        ac.id_carrera,
        ac.id_asignatura,
        a.nombre_asignatura AS nombre_base,
        ROW_NUMBER() OVER (PARTITION BY ac.id_carrera, a.nombre_asignatura ORDER BY ac.semestre) AS secuencia,
        COUNT(*) OVER (PARTITION BY ac.id_carrera, a.nombre_asignatura) AS total_repeticiones
    FROM tbl_asignaturas_carreras ac
    INNER JOIN tbl_asignaturas a ON ac.id_asignatura = a.id_asignatura
) t1 ON pm.id_asignatura_carrera = t1.id_asignatura_carrera
INNER JOIN (
    SELECT 
        ac.id_asignatura_carrera,
        ac.id_carrera,
        ac.id_asignatura,
        a.nombre_asignatura AS nombre_base,
        ROW_NUMBER() OVER (PARTITION BY ac.id_carrera, a.nombre_asignatura ORDER BY ac.semestre) AS secuencia,
        COUNT(*) OVER (PARTITION BY ac.id_carrera, a.nombre_asignatura) AS total_repeticiones
    FROM tbl_asignaturas_carreras ac
    INNER JOIN tbl_asignaturas a ON ac.id_asignatura = a.id_asignatura
) t2 ON pm.id_asignatura_prelacion = t2.id_asignatura_carrera;
`;

export const GET_PRELACIONES_ACADEMICAS_CRUD = `
SELECT 
    pa.*,
    -- Asignatura con formato
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
    END AS nombre_asignatura,
    c.nombre_carrera,
    ac.codigo_asignatura,
    ac.semestre
FROM tbl_prelaciones_academicas pa
INNER JOIN tbl_asignaturas_carreras ac ON pa.id_asignatura_carrera = ac.id_asignatura_carrera
INNER JOIN tbl_carreras c ON ac.id_carrera = c.id_carrera
INNER JOIN (
    SELECT 
        ac.id_asignatura_carrera,
        ac.id_carrera,
        ac.id_asignatura,
        a.nombre_asignatura AS nombre_base,
        ROW_NUMBER() OVER (PARTITION BY ac.id_carrera, a.nombre_asignatura ORDER BY ac.semestre) AS secuencia,
        COUNT(*) OVER (PARTITION BY ac.id_carrera, a.nombre_asignatura) AS total_repeticiones
    FROM tbl_asignaturas_carreras ac
    INNER JOIN tbl_asignaturas a ON ac.id_asignatura = a.id_asignatura
) t ON pa.id_asignatura_carrera = t.id_asignatura_carrera;
`;