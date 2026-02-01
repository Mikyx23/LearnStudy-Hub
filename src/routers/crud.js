import express from 'express';
export const routerCrud = express.Router();
import {
    ObtenerEstudiantesController,
    ObtenerCarrerasController,
    ObtenerAsignaturasController,
    ObtenerLapsosController,
    ObtenerFrasesController, 
    ObtenerMallasController,
    ObtenerPrelacionesMateriasController,
    ObtenerPrelacionesAcademicasController,
    InsertarCarreraController,
    InsertarAsignaturaController,
    InsertarLapsosController,
    InsertarFrasesController,
    InsertarMallaController,
    InsertarPrelacionMateriaController,
    InsertarPrelacionAcademicaController,
    EliminarCarreraController,
    EliminarAsignaturaController,
    EliminarLapsosController,
    EliminarFrasesController,
    EliminarMallaController,
    EliminarPrelacionMateriaController,
    EliminarPrelacionAcademicaController
}from '../controllers/crud-controller.js'

routerCrud.get('/', async (req, res) => {
    try{
        const estudiantes = await ObtenerEstudiantesController();
        const carreras = await ObtenerCarrerasController();
        const asignaturas = await ObtenerAsignaturasController();
        const lapsos = await ObtenerLapsosController();
        const frases = await ObtenerFrasesController();
        const mallas = await ObtenerMallasController();
        const prelacionesMaterias = await ObtenerPrelacionesMateriasController();
        const prelacionesAcademicas = await ObtenerPrelacionesAcademicasController();

        res.render('crud', {
            students: estudiantes || [],
            carrers: carreras.data || [],
            subjects: asignaturas.data || [],
            lapsosAcademicos: lapsos.data || [],
            frasesDelDia: frases.data || [],
            mallas: mallas.data || [],
            prelacionesMaterias: prelacionesMaterias.data || [],
            prelacionesAcademicas: prelacionesAcademicas.data || []
        })
    }
    catch(error){
        console.log(error);
    }
});

routerCrud.post('/:tabla', async (req, res) => {
    try{
        const tabla = req.params.tabla;
        
        switch(tabla){
            case 'carreras':
                const { nombre_carrera, estado_carrera } = req.body;
                const result2 = await InsertarCarreraController(nombre_carrera, estado_carrera);
                if(result2.success){
                    res.json({
                        success: true,
                        redirectUrl: '/api/crud'
                    })
                }
                else{
                    res.json({
                        success: false,
                        message: result2.message
                    })
                }
            break;

            case 'asignaturas': 
                const { nombre_asignatura, estado_asignatura } = req.body;
                const result3 = await InsertarAsignaturaController(nombre_asignatura, estado_asignatura);
                if(result3.success){
                    res.json({
                        success: true,
                        redirectUrl: '/api/crud'
                    })
                }
                else{
                    res.json({
                        success: false,
                        message: result3.message
                    })
                }
            break;

            case 'lapsos': 
                const { periodo, año } = req.body;
                const result4 = await InsertarLapsosController(periodo, año);
                if(result4.success){
                    res.json({
                        success: true,
                        redirectUrl: '/api/crud'
                    })
                }
                else{
                    res.json({
                        success: false,
                        message: result4.message
                    })
                }
            break;

            case 'frases':
                const { frase } = req.body;
                const result5 = await InsertarFrasesController(frase);

                if(result5.success){
                    res.json({
                        success: true,
                        redirectUrl: '/api/crud'
                    })
                }
                else{
                    res.json({
                        success: false,
                        message: result5.message
                    })
                }
            break;

            case 'malla': 
                const {id_carrera,id_asignatura,codigo_asignatura,semestre,uc_asignatura,total_horas,estado_asignatura_carrera} = req.body;
                const result6 = await InsertarMallaController(id_carrera,id_asignatura,codigo_asignatura,semestre,uc_asignatura,total_horas,estado_asignatura_carrera);
                if(result6.success){
                    res.json({
                        success: true,
                        redirectUrl: '/api/crud'
                    })
                }
                else{
                    res.json({
                        success: false,
                        message: result6.message
                    })
                }
            break;
            default: break;
        }
    }
    catch(error){
        res.status(500).json({ 
            success: false, 
            message: 'Error al crear el registro' 
        });
    }
});

routerCrud.post('/prelaciones/materias', async (req, res) =>{
    try{
        const {
            id_asignatura_carrera,     // ID de la asignatura principal
            id_asignatura_prelacion,   // ID de la asignatura prelación
            tipo_prelacion             // 'REQUISITO' o 'CORREQUISITO'
        } = req.body;

        const result = await InsertarPrelacionMateriaController(id_asignatura_carrera, id_asignatura_prelacion, tipo_prelacion);

        if(result.success){
            res.json({
                success: true,
                redirectUrl: '/api/crud'
            })
        }
        else{
            res.json({
                success: false,
                message: result.message
            })
        }
    }
    catch(error){
        res.status(500).json({ 
            success: false, 
            message: 'Error al crear la prelacion materia' 
        });
    }
});

routerCrud.post('/prelaciones/academicas', async (req, res) =>{
    try{
        const {
            id_asignatura_carrera,  // ID de la asignatura
            tipo_prelacion,          // 'UC_APROBADAS' o 'SEMESTRE_APROBADO'
            valor_requerido          // Valor numérico requerido
        } = req.body;

        const result = await InsertarPrelacionAcademicaController(id_asignatura_carrera, tipo_prelacion, valor_requerido);
        
        if(result.success){
            res.json({
                success: true,
                redirectUrl: '/api/crud'
            })
        }
        else{
            res.json({
                success: false,
                message: result.message
            })
        }
    }
    catch(error){
        res.status(500).json({ 
            success: false, 
            message: 'Error al crear la prelacion academica' 
        });
    }
});

routerCrud.delete('/:tabla/:id', async (req, res) => {
    try{
        const { tabla, id } = req.params;

        switch(tabla){
            case 'usuario':
                const result = await EliminarCarreraController(id);
                if(result.success){
                    res.json({
                        success: true,
                        redirectUrl: '/api/crud'
                    })
                }
            break;
            
            case 'carreras':
                const result2 = await EliminarCarreraController(id);
                if(result2.success){
                    res.json({
                        success: true,
                        redirectUrl: '/api/crud'
                    })
                }
            break;

            case 'asignaturas':
                const result3 = await EliminarAsignaturaController(id);
                if(result3.success){
                    res.json({
                        success: true,
                        redirectUrl: '/api/crud'
                    })
                }
            break;

            case 'lapsos':
                const result4 = await EliminarLapsosController(id);
                if(result4.success){
                    res.json({
                        success: true,
                        redirectUrl: '/api/crud'
                    })
                }
            break;

            case 'frases':
                const result5 = await EliminarFrasesController(id);
                if(result5.success){
                    res.json({
                        success: true,
                        redirectUrl: '/api/crud'
                    })
                }
            break;
            
            case 'malla':
                const result6 = await EliminarMallaController(id);
                if(result6.success){
                    res.json({
                        success: true,
                        redirectUrl: '/api/crud'
                    })
                }
            break;

            default: break;
        }
    }
    catch(error){
        res.status(500).json({ 
            success: false, 
            message: 'Error al eliminar el registro'
        });
    }
});

routerCrud.delete('/prelaciones/materias/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const result = await EliminarPrelacionMateriaController(id);
        if(result.success){
            res.json({
                success: true,
                redirectUrl: '/api/crud'
            })
        }
    }
    catch(error){
        res.status(500).json({ 
            success: false, 
            message: 'Error al eliminar la prelacion materia' 
        });
    }
});

routerCrud.delete('/prelaciones/academicas/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const result = await EliminarPrelacionAcademicaController(id);
        if(result.success){
            res.json({
                success: true,
                redirectUrl: '/api/crud'
            })
        }
    }
    catch(error){
        res.status(500).json({ 
            success: false, 
            message: 'Error al eliminar la prelacion academica' 
        });
    }
});