"""
Estas estructuras de datos las hice con un video de 5 horas en Youtube sobre POO en Python.
Al momento de realizar este codigo solo Dios y yo sabiamos como funciona, Ahora solo Dios sabe

"""
import os 

# CLASE PARA LOS NODOS
class Nodo: 
    def __init__(self, dato): #Constructor de la Clase
        self.dato = dato
        self.siguiente = None   #Referencia al siguiente Nodo

# CLASE PARA LA LISTA
class Lista:
    def __init__(self): #Constructor de la Clase
        self.raiz = None    #Primer nodo de la lista

    def insertar(self, dato):
        nuevo_nodo = Nodo(dato)
        
        if self.raiz is None:
            self.raiz = nuevo_nodo
        else:
            actual = self.raiz
            while actual.siguiente is not None:
                actual = actual.siguiente
            actual.siguiente = nuevo_nodo

    def mostrar(self):
        actual = self.raiz
        if actual is None:
            print("La lista está vacía")
        else:
            print("Elementos de la Lista enlazada:")
            while actual is not None:
                print(actual.dato)
                actual = actual.siguiente

# CLASE PARA LA PILA
class Pila:
    def __init__(self):
        self.cima = None

    def insertar(self, dato):
        nuevo_nodo = Nodo(dato)
        nuevo_nodo.siguiente = self.cima
        self.cima = nuevo_nodo

    def eliminar(self):
        if self.cima is None:
            print("La pila está vacía")
        else:
            self.cima = self.cima.siguiente

    def mostrar(self):
        actual = self.cima
        if actual is None:
            print("La pila está vacía")
        else:
            print("Elementos de la Pila:")
            while actual is not None:
                print(actual.dato)
                actual = actual.siguiente

# CLASE PARA LA COLA
class Cola:
    def __init__(self):
        self.raiz = None
        self.ultimo = None

    def insertar(self,dato):
        nuevo_nodo = Nodo(dato)
        if self.raiz is None:
            self.raiz = nuevo_nodo
            self.ultimo = nuevo_nodo
        else:
            self.ultimo.siguiente = nuevo_nodo
            self.ultimo = nuevo_nodo
    
    def mostrar(self):
        actual = self.raiz
        if actual is None:
            print("La cola está vacía")
        else:
            print("Elementos de la Cola:")
            while actual is not None:
                print(actual.dato)
                actual = actual.siguiente

# INSTANCIAS (PRUEBAS DE QUE FUNCIONA)
lista = Lista()
pila = Pila()
cola = Cola()

# FUNCIONES PARA LAS PRUEBAS
def MostrarMenu():
    os.system("cls")    #Limpia la consola
    print("---- ESTRUCTURAS DE DATOS ----")
    print("1. Insertar en la Lista")
    print("2. Insertar en la Pila")
    print("3. Insertar en la Cola")
    print("4. Mostrar Lista")
    print("5. Mostrar Pila")
    print("6. Mostrar Cola")
    print("7. Salir")

def pedir_dato():
    try:
        dato = int(input("Ingrese el dato:"))
        return dato
    except:
        print("Dato invalido. Ingrese un numero.")

def pausar():
    os.system("pause")

def main():
    op = 0
    while op != 7:
        MostrarMenu()
        op = int(input("Ingrese una opcion:"))
        match op:
            case 1:
                dato = pedir_dato()
                lista.insertar(dato)
                print("Dato insertado correctamente.")
                pausar()
            case 2:
                dato = pedir_dato()
                pila.insertar(dato)
                print("Dato insertado correctamente.")
                pausar()
            case 3:
                dato = pedir_dato()
                cola.insertar(dato)
                print("Dato insertado correctamente.")
                pausar()
            case 4:
                lista.mostrar()
                pausar()
            case 5:
                pila.mostrar()
                pausar()
            case 6:
                cola.mostrar()
                pausar()
            case 7:
                print("Saliendo del programa...")
                pausar()
            case _: 
                print("Ingrese una opcion valida.")
                pausar()

main()