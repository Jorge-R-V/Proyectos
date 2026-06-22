# 🍔 Calculadora de Consumos y Propinas

👉 **[Ver Aplicación en Vivo](https://Jorge-R-V.github.io/Proyectos/PracticaPedidos/)** (PracticaPedidos)

Aplicación web interactiva del lado del cliente diseñada para gestionar comandas en mesas de restaurantes, calcular consumos individuales y agregar propinas dinámicamente con desglose totalizado.

---

## Funcionalidades Principales

- **Registro de Comandas**: Apertura de nueva orden especificando el número de mesa y la hora de consumo a través de un modal de Bootstrap.
- **Catálogo de Platillos**: Visualización interactiva de platillos disponibles y bebidas para añadir a la comanda.
- **Resumen en Tiempo Real**: Cálculo dinámico del total de consumo conforme se agregan y eliminan elementos de la orden.
- **Calculadora de Propinas**: Selección del porcentaje de propina (10%, 25%, 50%) con cálculo inmediato del desglose:
  - Subtotal de consumo
  - Monto exacto de la propina seleccionada
  - Total a pagar (Subtotal + Propina)

---

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica de la página.
- **JavaScript (ES6+)**: Lógica interactiva para la gestión del estado de la orden, actualización del DOM y cálculos matemáticos.
- **CSS3 / Bootstrap 5**: Diseño visual responsivo y componentes de interfaz preconstruidos (como ventanas modales y grillas).

---

## Instrucciones de Ejecución

Para iniciar la aplicación localmente:

1. Clona o abre la carpeta del proyecto.
2. Abre el archivo `index.html` directamente en tu navegador web (doble clic) o utiliza una extensión de desarrollo como **Live Server** en VS Code.
3. Si utilizas un servidor de desarrollo local para `db.json` (como `json-server`), asegúrate de iniciarlo en el puerto configurado en el archivo `js/app.js` (si corresponde).
