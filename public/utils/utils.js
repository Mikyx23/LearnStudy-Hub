export const toRomano = (num) => ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][num - 1];

export const CalculateAverage = async (notas) => {
    // 1. Validaciones iniciales
    if (!notas || !Array.isArray(notas) || notas.length === 0) {
        return 0;
    }

    // 2. Filtrar solo materias que tengan una nota mayor a 0
    // (Asumiendo que 0 significa "no cursada" o "sin nota cargada")
    const materiasCursadas = notas.filter(materia => parseFloat(materia.nota) > 0);

    // 3. Si no hay materias con nota, evitar división por cero
    if (materiasCursadas.length === 0) {
        return 0;
    }

    // 4. Sumar las notas de las materias filtradas
    const suma = materiasCursadas.reduce((acumulado, materia) => {
        return acumulado + parseFloat(materia.nota);
    }, 0);

    // 5. Calcular promedio real
    const promedio = suma / materiasCursadas.length;

    // Retornar con 2 decimales para precisión académica
    return parseFloat(promedio.toFixed(2));
};

export const CalculateCredits = async (materia) => {
    let suma = 0;

    if(!materia || !Array.isArray(materia)){
        return 0;
    }

    materia.forEach(row => {
        suma += parseFloat(row.creditos);
    });

    return suma;
}