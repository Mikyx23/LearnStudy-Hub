"""
Querido programador:
Cuando escribi este codigo, solo Dios
y yo sabiamos como funcionaba.
Ahora, solo Dios lo sabe!

Por lo tanto, si estas intentando optimizar 
este script y falla (seguramente).
Por favor incrementa este contador como una
advertencia para la siguiente persona.

total_horas_desperdiciadas_aqui = 17

"""
import sys
import json

class Nodo: 
    def __init__(self, dato):
        self.dato = dato
        self.siguiente = None

class Pila:
    def __init__(self):
        self.cima = None

    def insertar(self, dato):
        nuevo_nodo = Nodo(dato)
        nuevo_nodo.siguiente = self.cima
        self.cima = nuevo_nodo

    def to_list(self):
        """Convierte la estructura de la pila a una lista de Python para serializarla"""
        elementos = []
        actual = self.cima
        while actual is not None:
            elementos.append(actual.dato)
            actual = actual.siguiente
        return elementos

def main():
    try:
        input_data = sys.stdin.read().strip()
        if not input_data:
            print(json.dumps([]))
            return

        sesiones_raw = json.loads(input_data)
        pila_sesiones = Pila()

        for sesion in sesiones_raw:
            pila_sesiones.insertar(sesion)

        print(json.dumps(pila_sesiones.to_list()))
    except Exception as e:
        sys.stderr.write(str(e))
        print(json.dumps([]))

# ¡ESTA LÍNEA ES VITAL!
if __name__ == "__main__":
    main()