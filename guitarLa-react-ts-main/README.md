# GuitarLA

👉 **[Ver Aplicación en Vivo](https://Jorge-R-V.github.io/Proyectos/guitarLa-react-ts-main/)**

**GuitarLA** es una aplicación web diseñada para exhibir una colección de guitarras y gestionar un carrito de compras. La aplicación ofrece una experiencia interactiva y funcional para explorar productos, gestionar cantidades, y calcular el costo total en tiempo real.

---

## Tabla de Contenidos
- [Características](#características)
- [Vista Previa](#vista-previa)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Cómo Usar](#cómo-usar)
- [Componentes Principales](#componentes-principales)
  - [Guitar](#guitar)
  - [Header](#header)
- [Custom Hook](#custom-hook)
  - [useCart](#usecart)
- [Tipos](#tipos)
- [Base de Datos](#base-de-datos)
- [Futuras Mejoras](#futuras-mejoras)
- [Licencia](#licencia)

---

## Características

- **Catálogo de Guitarras**: Navega por una colección de guitarras con imágenes, descripciones, y precios.
- **Carrito de Compras**:
  - Agrega guitarras al carrito.
  - Ajusta las cantidades de los productos.
  - Elimina productos o vacía el carrito por completo.
  - Calcula automáticamente el costo total.
- **Persistencia**: La información del carrito se guarda en el almacenamiento local para mantener el estado entre sesiones.
- **Diseño Responsivo**: Optimizado para dispositivos móviles y pantallas de escritorio.

---

## Tecnologías Utilizadas

- **React**: Biblioteca para construir interfaces de usuario.
- **TypeScript**: Superset de JavaScript para añadir tipado estático.
- **Bootstrap**: Framework CSS para diseño responsivo y estilizado.
- **LocalStorage**: Para persistir datos del carrito.

---

## Estructura del Proyecto

src/
|-- components/
|   |-- Guitar.tsx
|   |-- Header.tsx
|-- hooks/
|   |-- useCart.ts
|-- types/
|   |-- index.ts
|-- data/
|   |-- db.ts
|-- App.tsx

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/anabartos/GuitarLa-ts.git

Navega al directorio del proyecto:
    cd GuitarLa-ts
Instala las dependencias:
    npm install
Inicia la aplicación:   
    npm start

# Cómo Usar

1. **Navega por el Catálogo**: Observa las guitarras disponibles.
2. **Agrega Productos al Carrito**: Haz clic en el botón "Agregar al Carrito".
3. **Administra el Carrito**:
   - Ajusta cantidades usando los botones de `+` y `-`.
   - Elimina un producto con el botón `X`.
   - Vacía todo el carrito si es necesario.
4. **Revisa el Total**: Observa el total calculado automáticamente en el carrito.

---

## Componentes Principales

### 1. `Guitar`
Componente para mostrar la información de una guitarra, incluyendo nombre, imagen, descripción, precio, y un botón para agregarla al carrito.

**Props:**
- `guitar`: Objeto que representa una guitarra.
- `addToCart`: Función para agregar una guitarra al carrito.

### 2. `Header`
Componente del encabezado que incluye el logo y el carrito de compras interactivo.

**Props:**
- `cart`: Lista de elementos en el carrito.
- `removeFromCart`: Función para eliminar un producto del carrito.
- `decreaseQuantity`: Reduce la cantidad de un producto.
- `increaseQuantity`: Incrementa la cantidad de un producto.
- `clearCart`: Vacía el carrito por completo.
- `isEmpty`: Indica si el carrito está vacío.
- `cartTotal`: Total calculado de los productos en el carrito.

---

## Custom Hook

### `useCart`
Maneja toda la lógica del carrito de compras, incluyendo:

**Estados:**
- `cart`: Lista de productos en el carrito.
- `data`: Lista de guitarras desde la base de datos simulada.

**Funciones:**
- `addToCart`: Agrega un producto al carrito.
- `removeFromCart`: Elimina un producto del carrito.
- `decreaseQuantity`: Disminuye la cantidad de un producto.
- `increaseQuantity`: Aumenta la cantidad de un producto.
- `clearCart`: Vacía el carrito.

**Estados Derivados:**
- `isEmpty`: Booleano que indica si el carrito está vacío.
- `cartTotal`: Calcula el precio total.

---

## Tipos

### `Guitar`
```typescript

export type Guitar = {
    id: number;
    name: string;
    image: string;
    description: string;
    price: number;
};
```
### `CarItem`
```typescript

export type CartItem = Guitar & {
    quantity: number;
};
```

---

# Base de Datos
El archivo db.ts contiene una base de datos simulada (mock) con una lista de guitarras, cada una con las siguientes propiedades:

id
name
image
description
price
  
---

# Futuras Mejoras
API Backend: Integrar una API real para gestionar productos y carritos.
Autenticación: Permitir a los usuarios iniciar sesión y guardar carritos personalizados.
Flujo de Pago: Implementar procesamiento de pagos y confirmación de pedidos.
Diseño Avanzado: Añadir animaciones y estilos personalizados.