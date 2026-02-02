from pila import Nodo
import sys
import json

class Cola:
    def __init__(self):
        self.raiz = None
        self.ultimo = None

    def insertar(self, dato):
        nuevo_nodo = Nodo(dato)
        if self.raiz is None:
            self.raiz = nuevo_nodo
            self.ultimo = nuevo_nodo
        else:
            self.ultimo.siguiente = nuevo_nodo
            self.ultimo = nuevo_nodo
    
    def to_list(self):
        elementos = []
        actual = self.raiz
        while actual is not None:
            elementos.append(actual.dato)
            actual = actual.siguiente
        return elementos

def main():
    try:
        # 1. Leer datos de Node.js
        input_data = sys.stdin.read().strip()
        if not input_data:
            print(json.dumps([]))
            return

        materias_raw = json.loads(input_data)

        # 2. Ordenar materias por semestre (Ascendente)
        # Usamos una función lambda para extraer 'subject_semester'
        materias_ordenadas = sorted(
            materias_raw, 
            key=lambda x: int(x.get('subject_semester', 0))
        )

        # 3. Cargar en nuestra estructura de Cola
        cola_materias = Cola()
        for materia in materias_ordenadas:
            cola_materias.insertar(materia)

        # 4. Devolver JSON a la salida estándar
        print(json.dumps(cola_materias.to_list()))

    except Exception as e:
        sys.stderr.write(f"Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()