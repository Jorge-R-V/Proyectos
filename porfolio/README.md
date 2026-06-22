# Porfolio de Enlaces (porfolio)

Página web minimalista y responsiva diseñada como porfolio de enlaces personales (estilo Linktree) para presentar redes sociales, proyectos y métodos de contacto en una sola tarjeta central interactiva con animaciones modernas.

---

## ✨ Características

👉 **[Ver Aplicación en Vivo](https://Jorge-R-V.github.io/Proyectos/porfolio/)**

- **Diseño Ultra-Moderno**: Estética de tarjeta de presentación con esquinas redondeadas y sombras suaves.
- **Micro-Animaciones**: Implementación de efectos y animaciones dinámicas al pasar el cursor (hover) para mejorar el engagement del visitante.
- **Responsivo**: Adaptado perfectamente a pantallas móviles y de escritorio.
- **Optimización CSS**: Generado utilizando el compilador oficial de Tailwind CSS v4 para garantizar la velocidad de carga.

---

## Tecnologías

- **HTML5**: Estructura limpia y semántica.
- **Tailwind CSS v4.0 (CLI)**: Utilización de clases utilitarias de última generación y variables nativas CSS.
- **@midudev/tailwind-animations**: Plugin de animación para agregar efectos fluidos a las transiciones de carga y botones.

---

## Desarrollo y Compilación

Este proyecto utiliza `pnpm` como gestor de paquetes principal (o también puede configurarse con `npm`). 

### 1. Instalación de Dependencias
Asegúrate de tener instalado Node.js y ejecuta en la raíz de la carpeta:
```bash
pnpm install
# O con npm:
npm install
```

### 2. Compilar Estilos en Desarrollo
Para realizar cambios en `input.css` y compilar automáticamente a `assets/output.css` cada vez que edites código:
```bash
pnpm run build:styles
# O con npm:
npx @tailwindcss/cli -i ./input.css -o ./assets/output.css --watch
```

### 3. Ejecución Local
Simplemente abre el archivo `index.html` en tu navegador para visualizar los cambios compilados, o utiliza un servidor de desarrollo como **Live Server** para recarga instantánea.
