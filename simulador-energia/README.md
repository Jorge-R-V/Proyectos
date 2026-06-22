# ⚡ Simulador de Consumo Eléctrico (simulador-energia)

Aplicación web interactiva desarrollada con **HTML, CSS y JavaScript** diseñada para estimar y modelar el consumo energético horario de una oficina o local comercial a lo largo de un mes específico.

👉 **[Ver Aplicación en Vivo](https://Jorge-R-V.github.io/Proyectos/simulador-energia/)**

---

## 🚀 Funcionalidades Principales

- **Modelado Inteligente de Equipos**: Base de datos de equipos típicos de oficina con cantidad, potencia nominal y factor de uso (Iluminación LED, Climatización, Servidores, Ordenadores, Impresoras industriales y de oficina, Sistemas de videovigilancia, Consumos fantasma, etc.).
- **Curva de Carga Realista**:
  - Distinción automática entre días laborables (horario de oficina, picos de producción, valles de comida y standby) y fines de semana (solo consumos críticos/24h).
  - **Ajuste Estacional**: Modificación automática de consumo base por aire acondicionado (split) en meses de clima extremo (Verano: Jun-Sep / Invierno: Dic-Feb).
  - **Distribución Estocástica**: Algoritmo que ajusta de forma iterativa y matemática la potencia hasta igualar exactamente el consumo objetivo en kWh del mes ingresado por el usuario.
- **Gráficos Interactivos**: Visualización de la curva de carga horaria promedio utilizando la librería **Chart.js**.
- **Tabla de Desglose Horario Completa**: Matriz de todos los días del mes y las 24 horas del día con código de colores según nivel de consumo (bajo, medio, alto).
- **Detalle de Celda (Modal)**: Haz clic en cualquier hora de la tabla para abrir un modal con:
  - Gráfico circular (Doughnut chart) con el porcentaje que representa cada aparato.
  - Tabla con el desglose exacto: cantidad activa, potencia (kW), tiempo de encendido efectivo en minutos y kWh totales consumidos en esa hora por aparato.
- **Exportación de Datos**: Botón para descargar la simulación completa en formato CSV estructurado.

---

## 🛠️ Tecnologías y Librerías

- **HTML5 & CSS3**: Diseño responsivo y oscuro adaptado para paneles de control (dashboard).
- **JavaScript (Vanilla - ES6+)**: Lógica matemática de simulación, parseador de CSV y manipulación interactiva del DOM.
- **Chart.js (CDN)**: Gráficos de líneas y circulares integrados para la visualización del consumo.

---

## ⚙️ Cómo Ejecutar

1. Abre la carpeta del proyecto.
2. Abre el archivo `index.html` en tu navegador web.
3. Introduce el consumo objetivo mensual (ej. `1200` kWh), selecciona el mes/año y haz clic en **Simular**.
4. Explora las gráficas resultantes y descarga la información en CSV si la necesitas para análisis externo.
