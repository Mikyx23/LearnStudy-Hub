export const toRomano = (num) => ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][num - 1];

export const CalculateAverage = async (notas) => {
    let suma = 0;
    let n = 0;
    
    if (!notas || !Array.isArray(notas)) {
        return 0;
    }

    notas.forEach(row => {
        suma += parseFloat(row.nota);
        n++;
    });

    const promedio = suma / n;
    return promedio || 0;
}

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