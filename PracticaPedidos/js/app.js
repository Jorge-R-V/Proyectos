let cliente = {
    mesa: '',
    hora: '',
    pedido: []
};

const categorias = {
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres'
}

document.addEventListener('DOMContentLoaded', () => {
    iniciarApp();
});

function iniciarApp() {
    const botonGuardarCliente = document.querySelector('#guardar-cliente');
    botonGuardarCliente.addEventListener('click', guardarCliente);
}

function guardarCliente() {
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    // Revisar si hay campos vacíos
    const camposVacios = [mesa, hora].some(campo => campo === '');

    if (camposVacios) {
        // Mostrar alerta si hay campos vacíos
        mostrarAlerta('Todos los campos son obligatorios');
        return;
    }

    // Asignar datos del formulario al cliente
    cliente = { ...cliente, mesa, hora };
    const modalFormulario = document.querySelector('#formulario');
    const instanciaModal = bootstrap.Modal.getInstance(modalFormulario);
    instanciaModal.hide();

    mostrarSecciones();
    obtenerPlatillos();
}

function mostrarAlerta(mensaje) {
    const existeAlerta = document.querySelector('.invalid-feedback');
    if (!existeAlerta) {
        const elementoAlerta = document.createElement('div');
        elementoAlerta.classList.add('invalid-feedback', 'd-block', 'text-center');
        elementoAlerta.textContent = mensaje;
        document.querySelector('.modal-body form').appendChild(elementoAlerta);

        setTimeout(() => {
            elementoAlerta.remove();
        }, 3000);
    }
}

function mostrarSecciones() {
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach(seccion => seccion.classList.remove('d-none'));
}

function obtenerPlatillos() {
    const url = 'http://localhost:4000/platillos';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            console.log('Platillos obtenidos:', resultado);
            mostrarMenu(resultado);
        })
        .catch(error => console.error('Error al obtener los platillos. Asegúrate de que JSON-Server esté corriendo en el puerto 4000.', error));
}

function mostrarMenu(platillos) {
    limpiarMenuHTML(); // Limpiamos por si se llama más de una vez
    const contenido = document.querySelector('#platillos .contenido');

    platillos.forEach(platillo => {
        const row = document.createElement('div');
        row.classList.add('row', 'py-3', 'border-top');

        const nombre = document.createElement('div');
        nombre.classList.add('col-md-4');
        nombre.textContent = platillo.nombre;

        const precio = document.createElement('div');
        precio.classList.add('col-md-3', 'fw-bold');
        precio.textContent = `${platillo.precio}€`;

        const categoria = document.createElement('div');
        categoria.classList.add('col-md-3');
        categoria.textContent = categorias[platillo.categoria];

        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${platillo.id}`;
        inputCantidad.classList.add('form-control');
        
        // Función que detecta la cantidad y el platillo que se está agregando
        inputCantidad.onchange = function() {
            const cantidad = parseInt(inputCantidad.value);
            actualizarPedido({...platillo, cantidad});
        };

        const agregar = document.createElement('div');
        agregar.classList.add('col-md-2');
        agregar.appendChild(inputCantidad);

        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(agregar);

        contenido.appendChild(row);
    });
}

function actualizarPedido(producto) {
    let { pedido } = cliente;

    // Revisar que la cantidad sea mayor a 0
    if (producto.cantidad > 0) {
        // Comprueba si el elemento ya existe en el array de pedido
        if (pedido.some(articulo => articulo.id === producto.id)) {
            // El articulo ya existe, se actualiza la cantidad
            const pedidoActualizado = pedido.map(articulo => {
                if (articulo.id === producto.id) {
                    articulo.cantidad = producto.cantidad;
                }
                return articulo;
            });
            // Se asigna el nuevo array a cliente.pedido
            cliente.pedido = [...pedidoActualizado];
        } else {
            // El Articulo no existe, lo agregamos al array de pedido
            cliente.pedido = [...pedido, producto];
        }
    } else {
        // Eliminar elementos cuando la cantidad es 0
        const resultado = pedido.filter(articulo => articulo.id !== producto.id);
        cliente.pedido = [...resultado];
    }

    // Limpiar el HTML
    limpiarResumenHTML();

    if(cliente.pedido.length) {
        // Mostrar el resumen si hay algo en el pedido
        actualizarResumen();
    } else {
        // Mostrar mensaje de pedido vacío
        mensajePedidoVacio();
    }
}

function limpiarMenuHTML() {
    const contenido = document.querySelector('#platillos .contenido');
    while(contenido.firstChild) {
        contenido.removeChild(contenido.firstChild);
    }
}

function actualizarResumen() {
    limpiarResumenHTML();
    const contenido = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('div');
    resumen.classList.add('col-md-6', 'card', 'py-2', 'px-3', 'shadow');

    // Información de la mesa
    const mesa = document.createElement('p');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold', 'mb-1');
    const mesaSpan = document.createElement('span');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-normal');
    mesa.appendChild(mesaSpan);

    // Información de la hora
    const parrafoHora = document.createElement('p');
    parrafoHora.textContent = 'Hora: ';
    parrafoHora.classList.add('fw-bold');
    const spanHora = document.createElement('span');
    spanHora.textContent = cliente.hora;
    spanHora.classList.add('fw-normal');
    parrafoHora.appendChild(spanHora);
    
    const heading = document.createElement('h3');
    heading.textContent = 'Platillos Consumidos';
    heading.classList.add('my-4', 'text-center');

    // Iterar sobre el array de pedidos y generar el HTML
    const grupo = document.createElement('ul');
    grupo.classList.add('list-group');

    const { pedido } = cliente;
    pedido.forEach(articulo => {
        const { nombre, cantidad, precio, id } = articulo;

        const lista = document.createElement('li');
        lista.classList.add('list-group-item');

        const nombreElemento = document.createElement('h4');
        nombreElemento.classList.add('my-4');
        nombreElemento.textContent = nombre;

        const cantidadElemento = document.createElement('p');
        cantidadElemento.classList.add('fw-bold');
        cantidadElemento.textContent = 'Cantidad: ';
        const spanCantidad = document.createElement('span');
        spanCantidad.classList.add('fw-normal');
        spanCantidad.textContent = cantidad;
        cantidadElemento.appendChild(spanCantidad);

        const precioElemento = document.createElement('p');
        precioElemento.classList.add('fw-bold');
        precioElemento.textContent = 'Precio Unitario: ';
        const spanPrecio = document.createElement('span');
        spanPrecio.classList.add('fw-normal');
        spanPrecio.textContent = `${precio}€`;
        precioElemento.appendChild(spanPrecio);

        const subtotalElemento = document.createElement('p');
        subtotalElemento.classList.add('fw-bold');
        subtotalElemento.textContent = 'Subtotal: ';
        const spanSubtotal = document.createElement('span');
        spanSubtotal.classList.add('fw-normal');
        spanSubtotal.textContent = `${precio * cantidad}€`;
        subtotalElemento.appendChild(spanSubtotal);

        const botonEliminar = document.createElement('button');
        botonEliminar.classList.add('btn', 'btn-danger');
        botonEliminar.textContent = 'Eliminar del Pedido';
        botonEliminar.onclick = function() {
            eliminarPlatillo(id);
        }

        lista.appendChild(nombreElemento);
        lista.appendChild(cantidadElemento);
        lista.appendChild(precioElemento);
        lista.appendChild(subtotalElemento);
        lista.appendChild(botonEliminar);

        grupo.appendChild(lista);
    });

    resumen.appendChild(heading);
    resumen.appendChild(mesa);
    resumen.appendChild(parrafoHora);
    resumen.appendChild(grupo);

    contenido.appendChild(resumen);

    // Mostrar Formulario de Propinas
    formularioPropinas();
}

function limpiarResumenHTML() {
    const contenido = document.querySelector('#resumen .contenido');
    while(contenido.firstChild) {
        contenido.removeChild(contenido.firstChild);
    }
}

function eliminarPlatillo(id) {
    const { pedido } = cliente;
    const nuevoPedido = pedido.filter(articulo => articulo.id !== id);
    cliente.pedido = [...nuevoPedido];

    limpiarResumenHTML();

    if(cliente.pedido.length) {
        actualizarResumen();
    } else {
        mensajePedidoVacio();
    }

    // Regresar la cantidad a 0 en el input correspondiente
    const idInputProducto = `#producto-${id}`;
    const inputProducto = document.querySelector(idInputProducto);
    inputProducto.value = 0;
}

function mensajePedidoVacio() {
    const contenido = document.querySelector('#resumen .contenido');

    const texto = document.createElement('p');
    texto.classList.add('text-center');
    texto.textContent = 'Añade los elementos del pedido';

    contenido.appendChild(texto);
}

function formularioPropinas() {
    const contenido = document.querySelector('#resumen .contenido');

    const formulario = document.createElement('div');
    formulario.classList.add('col-md-6', 'formulario');

    const divFormulario = document.createElement('div');
    divFormulario.classList.add('card', 'py-2', 'px-3', 'shadow');

    const heading = document.createElement('h3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = 'Propina';

    // Crear los radio buttons para la propina
    const propinas = ['10', '25', '50'];
    propinas.forEach(valor => {
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'propina';
        radio.value = valor;
        radio.classList.add('form-check-input');
        radio.onclick = calcularPropina;

        const label = document.createElement('label');
        label.textContent = `${valor}%`;
        label.classList.add('form-check-label');

        const div = document.createElement('div');
        div.classList.add('form-check');
        div.appendChild(radio);
        div.appendChild(label);

        divFormulario.appendChild(div);
    });

    divFormulario.appendChild(heading);
    formulario.appendChild(divFormulario);
    contenido.appendChild(formulario);
}

function calcularPropina() {
    const { pedido } = cliente;
    let subtotal = 0;

    // Calcular el subtotal a pagar
    pedido.forEach(articulo => {
        subtotal += articulo.cantidad * articulo.precio;
    });

    // Seleccionar el Radio Button con la propina del cliente
    const propinaSeleccionada = document.querySelector('[name="propina"]:checked').value;

    // Calcular la propina
    const propina = ((subtotal * parseInt(propinaSeleccionada)) / 100);

    // Calcular el total a pagar
    const total = subtotal + propina;

    mostrarTotalHTML(subtotal, total, propina);
}

function mostrarTotalHTML(subtotal, total, propina) {
    // Prevenir duplicados eliminando el div de totales previo
    const totalPagarDiv = document.querySelector('.total-pagar');
    if(totalPagarDiv) {
        totalPagarDiv.remove();
    }

    const divTotales = document.createElement('div');
    divTotales.classList.add('total-pagar', 'my-5');

    // Subtotal
    const subtotalParrafo = document.createElement('p');
    subtotalParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
    subtotalParrafo.textContent = 'Subtotal Consumo: ';
    const subtotalSpan = document.createElement('span');
    subtotalSpan.classList.add('fw-normal');
    subtotalSpan.textContent = `${subtotal}€`;
    subtotalParrafo.appendChild(subtotalSpan);

    // Propina
    const propinaParrafo = document.createElement('p');
    propinaParrafo.classList.add('fs-4', 'fw-bold');
    propinaParrafo.textContent = 'Propina: ';
    const propinaSpan = document.createElement('span');
    propinaSpan.classList.add('fw-normal');
    propinaSpan.textContent = `${propina}€`;
    propinaParrafo.appendChild(propinaSpan);

    // Total a Pagar
    const totalParrafo = document.createElement('p');
    totalParrafo.classList.add('fs-4', 'fw-bold');
    totalParrafo.textContent = 'Total a Pagar: ';
    const totalSpan = document.createElement('span');
    totalSpan.classList.add('fw-normal');
    totalSpan.textContent = `${total}€`;
    totalParrafo.appendChild(totalSpan);

    divTotales.appendChild(subtotalParrafo);
    divTotales.appendChild(propinaParrafo);
    divTotales.appendChild(totalParrafo);

    const formulario = document.querySelector('.formulario > div');
    if (formulario) {
        formulario.appendChild(divTotales);
    }
}
