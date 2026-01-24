export const toRomano = (num) => ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][num - 1];

export const CalculateAverage = async (notas) => {
    // 1. Validaciones iniciales
    if (!notas || !Array.isArray(notas) || notas.length === 0) {
        return 0;
    }

    // 2. Sumar las notas usando reduce
    const suma = notas.reduce((acumulado, materia) => {
        return acumulado + parseFloat(materia.nota || 0);
    }, 0);

    // 3. Calcular y retornar el promedio
    return suma / notas.length;
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