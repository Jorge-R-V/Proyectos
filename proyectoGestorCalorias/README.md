# NutriTrack - Nutrición Inteligente

** Despliegue en vivo:** [https://jorge-r-v.github.io/DIW/](https://jorge-r-v.github.io/DIW/)

**NutriTrack** es una aplicación web diseñada para ayudarte a llevar un control preciso de tu ingesta calórica y actividad física. NutriTrack facilita el seguimiento de tus macronutrientes diarios y te motiva a alcanzar tus objetivos de salud.

## Características Principales

- **Calculadora de Calorías Avanzada**:  
  Obtienes un desglose detallado de macronutrientes: calorías, grasas, carbohidratos, proteínas, fibra, azúcar y sodio.
- **Registro de Actividades**:  
  Añade fácilmente comidas y ejercicios. El sistema calcula automáticamente el balance energético (calorías consumidas vs. quemadas).
- **Persistencia de Datos**:  
  Tus datos se guardan localmente en tu navegador (`LocalStorage`), por lo que no perderás tu progreso al cerrar la pestaña.

## Tecnologías Utilizadas

Este proyecto ha sido construido utilizando las últimas tecnologías del desarrollo web:

- **[React 19](https://react.dev/)**: Biblioteca para interfaces de usuario.
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [ESLint](https://eslint.org/)

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

```text
src/
├── components/       # Componentes reutilizables (Formularios, Listados, Iconos)
├── data/             # Datos estáticos (Categorías, Base de datos de alimentos/ejercicios)
├── hooks/            # Custom Hooks (Lógica de negocio: useActivity)
├── types/            # Definiciones de tipos TypeScript
├── App.tsx           # Componente principal
└── ...               # Entradas de la aplicación
```

### Páginas Disponibles

- **Inicio**: `index.html` (Landing Page)
- **Calculadora**: `calculadora.html` (App principal)
- **Cámara**: `camara.html` (Concepto de escaneo por IA)
- **Cómo Funciona**: `como-funciona.html` (Guía de usuario)

## Instalación y Uso

Sigue estos pasos para ejecutar el proyecto en tu máquina local:

1.  **Clonar el repositorio** (o descargar el código):

    ```bash
    git clone <url-del-repositorio>
    cd proyecto-final-diseño
    ```

2.  **Instalar dependencias**:
    Asegúrate de tener [Node.js](https://nodejs.org/) instalado.

    ```bash
    npm install
    ```

3.  **Iniciar el servidor de desarrollo**:
    ```bash
    npm run dev
    ```
    Abre tu navegador en la URL que aparece en la terminal (usualmente `http://localhost:5173`).

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo.
- `npm run build`: Compila la aplicación para producción.
- `npm run preview`: Vista previa local de la compilación de producción.
- `npm run lint`: Ejecuta ESLint para buscar problemas en el código.

---

## Prototipo Figma

El prototipo Figma se encuentra disponible en el siguiente enlace: [Prototipo Figma](https://www.figma.com/proto/1N7MairYsj1wsDsnddxnY6/Sin-t%C3%ADtulo?node-id=0-1&t=idT6HlvZF9cTtJpQ-1).

**Desarrollado por [Jorge-R-V](https://github.com/Jorge-R-V)**
