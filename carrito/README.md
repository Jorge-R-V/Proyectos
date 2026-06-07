# Carrito de Compras

Aplicación web desarrollada en Java para simular un sistema de comercio electrónico básico, permitiendo a los usuarios agregar productos a un carrito y formalizar pedidos.

---

## Funcionalidades Principales

- **Catálogo de Productos**: Visualización de los productos disponibles en la tienda.
- **Gestión de Carrito**: Capacidad para agregar productos al carrito de compras de manera dinámica.
- **Procesamiento de Pedidos**: Registro de pedidos confirmados junto con los detalles de los productos y clientes.
- **Acceso a Datos**: Uso de objetos de acceso a datos (DAO) para manejar clientes, productos, pedidos y detalles del pedido.

---

## Tecnologías Utilizadas

- **Java EE**: Servlets y JSPs para el control del flujo y renderizado dinámico.
- **JSP / HTML**: Interfaces para el listado de productos y la confirmación de pedidos.
- **Patrón MVC Básico**: Separación entre vistas (JSP), controladores (Servlets) y modelos (Entidades y DAO).

---

## Instrucciones de Ejecución

Para iniciar la aplicación localmente:

1. Abre el proyecto en tu IDE preferido (Eclipse, IntelliJ IDEA) con soporte para aplicaciones web Java.
2. Asegúrate de tener un servidor de aplicaciones configurado (Tomcat, Payara, etc.).
3. Configura las credenciales de base de datos si aplica.
4. Ejecuta el proyecto en el servidor y abre el navegador en la URL local asignada (por ejemplo `http://localhost:8080/carrito`).
