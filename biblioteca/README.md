# Sistema de Biblioteca

Aplicación web desarrollada en Java para la gestión integral de una biblioteca. Permite la administración de libros, ejemplares, socios, préstamos y devoluciones, así como la gestión de penalizaciones para socios morosos.

---

## Funcionalidades Principales

- **Gestión de Usuarios**: Soporte para roles de Administrador y Socio.
- **Catálogo de Libros**: ABM (Alta, Baja, Modificación) de libros, autores y ejemplares.
- **Sistema de Préstamos**: Registro de préstamos y devoluciones de ejemplares a los socios.
- **Control de Morosidad**: Identificación automática y penalización de socios con devoluciones atrasadas.
- **Seguridad**: Autenticación y autorización mediante sesiones de usuario (Login).

---

## Tecnologías Utilizadas

- **Java EE**: Servlets y JSPs para la lógica y vistas de la aplicación web.
- **JSP / HTML / CSS**: Interfaces de usuario dinámicas para los paneles de administración y socios.
- **DAO Pattern**: Arquitectura orientada a objetos para el acceso a datos.

---

## Instrucciones de Ejecución

Para iniciar la aplicación localmente:

1. Importa el proyecto en tu entorno de desarrollo (Eclipse / IntelliJ) configurado con soporte para proyectos Web dinámicos (WTP).
2. Configura tu servidor de aplicaciones (por ejemplo, Apache Tomcat, Payara o GlassFish).
3. Configura la conexión a la base de datos en el archivo de configuración correspondiente.
4. Despliega la aplicación en el servidor y accede a través de tu navegador local (por lo general `http://localhost:8080/biblioteca`).
