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











































# import sys
# import json

# # CLASE PARA LOS NODOS
# class Nodo: 
#     def __init__(self, dato): #Constructor de la Clase
#         self.dato = dato
#         self.siguiente = None   #Referencia al siguiente Nodo

# # CLASE PARA LA LISTA
# class Lista:
#     def __init__(self): #Constructor de la Clase
#         self.raiz = None    #Primer nodo de la lista

#     def insertar(self, dato):
#         nuevo_nodo = Nodo(dato)
        
#         if self.raiz is None:
#             self.raiz = nuevo_nodo
#         else:
#             actual = self.raiz
#             while actual.siguiente is not None:
#                 actual = actual.siguiente
#             actual.siguiente = nuevo_nodo

#     def mostrar(self):
#         actual = self.raiz
#         if actual is None:
#             print("La lista está vacía")
#         else:
#             print("Elementos de la Lista enlazada:")
#             while actual is not None:
#                 print(actual.dato)
#                 actual = actual.siguiente

# # CLASE PARA LA PILA
# class Pila:
#     def __init__(self):
#         self.cima = None

#     def insertar(self, dato):
#         nuevo_nodo = Nodo(dato)
#         nuevo_nodo.siguiente = self.cima
#         self.cima = nuevo_nodo

#     def eliminar(self):
#         if self.cima is None:
#             print("La pila está vacía")
#         else:
#             self.cima = self.cima.siguiente

#     def mostrar(self):
#         actual = self.cima
#         if actual is None:
#             print("La pila está vacía")
#         else:
#             print("Elementos de la Pila:")
#             while actual is not None:
#                 print(actual.dato)
#                 actual = actual.siguiente

# # CLASE PARA LA COLA
# class Cola:
#     def __init__(self):
#         self.raiz = None
#         self.ultimo = None

#     def insertar(self,dato):
#         nuevo_nodo = Nodo(dato)
#         if self.raiz is None:
#             self.raiz = nuevo_nodo
#             self.ultimo = nuevo_nodo
#         else:
#             self.ultimo.siguiente = nuevo_nodo
#             self.ultimo = nuevo_nodo
    
#     def mostrar(self):
#         actual = self.raiz
#         if actual is None:
#             print("La cola está vacía")
#         else:
#             print("Elementos de la Cola:")
#             while actual is not None:
#                 print(actual.dato)
#                 actual = actual.siguiente