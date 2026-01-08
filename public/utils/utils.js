export const toRomano = (num) => ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][num - 1];

export const CalculateAverage = async (notas) => {
    let suma = 0;
    let n = 0;
    
    notas.forEach(row => {
        suma += parseFloat(row.nota);
        n++;
    });

    const promedio = suma / n;
    return promedio;
}