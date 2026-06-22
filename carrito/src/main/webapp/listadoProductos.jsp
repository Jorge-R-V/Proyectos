<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.util.List" %>
<%@ page import="entidades.Producto" %>
<%@ page import="entidades.DetallePedido" %>
<%@ page import="java.math.BigDecimal" %>

<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta charset="UTF-8">
    <title>Listado de Productos y Carrito</title>
    <link rel="stylesheet" type="text/css" href="recursos/css/estilos.css">
    <style>
        /* Estilos básicos para la tabla */
        .listado-productos { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .listado-productos th, .listado-productos td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .listado-productos th { background-color: #f2f2f2; }
    </style>
</head>
<body>

<%
    // 1. Obtener listado de productos y carrito de la sesión/request
    @SuppressWarnings("unchecked")
    List<Producto> productos = (List<Producto>) request.getAttribute("productos");
    
    @SuppressWarnings("unchecked")
    List<DetallePedido> carrito = (List<DetallePedido>) session.getAttribute("carro");
    
    String error = (String) request.getAttribute("error");
%>

<header>
    <h1>BIENVENIDO A LA PÁGINA DE COMPRA</h1>
</header>

<main>

    <% if (error != null && !error.isEmpty()) { %>
        <p style="color: red; font-weight: bold;">Error: <%= error %></p>
    <% } %>

    <h2>Productos Disponibles</h2>
    
    <% if (productos != null && !productos.isEmpty()) { %>
        <table class="listado-productos">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody>
                <% 
                    for (Producto p : productos) {
                %>
                    <tr>
                        <td><%= p.getId() %></td>
                        <td><%= p.getNombre() %></td>
                        <td><%= p.getPrecio_normal() %></td>
                        <td>
                            <a href="controlador?operacion=add&idProducto=<%= p.getId() %>">Añadir al Carrito</a>
                        </td>
                    </tr>
                <% } %>
            </tbody>
        </table>
    <% } else { %>
        <p>No hay productos disponibles en este momento.</p>
    <% } %>

    <hr>

    <h2>Contenido del Carrito</h2>
    
    <% if (carrito != null && !carrito.isEmpty()) { 
        BigDecimal totalCompra = BigDecimal.ZERO;
    %>
        <table class="listado-productos">
            <thead>
                <tr>
                    <th>ID Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Total Línea</th>
                    <th>Modificar</th>
                </tr>
            </thead>
            <tbody>
                <% 
                    for (DetallePedido dp : carrito) {
                        totalCompra = totalCompra.add(dp.getTotal_LineaDetalle());
                %>
                    <tr>
                        <td><%= dp.getIdProducto() %></td>
                        <td><%= dp.getCantidad() %></td>
                        <td><%= dp.getPrecio_Unitario() %></td>
                        <td><%= dp.getTotal_LineaDetalle() %></td>
                        <td>
                            <a href="controlador?operacion=incrementar&idProducto=<%= dp.getIdProducto() %>">
                                [ + ]
                            </a>
                            <a href="controlador?operacion=decrementar&idProducto=<%= dp.getIdProducto() %>">
                                [ - ]
                            </a>
                            <a href="controlador?operacion=eliminar&idProducto=<%= dp.getIdProducto() %>">
                                [ Eliminar ]
                            </a>
                        </td>
                    </tr>
                <% } %>
            </tbody>
        </table>
        
        <h3>TOTAL DE LA COMPRA: <%= totalCompra %></h3>
        
        <p>
            <a href="controlador?operacion=form_pedido">
                <button type="button" style="padding: 10px; background-color: #4CAF50; color: white; border: none; cursor: pointer;">
                    FORMALIZAR PEDIDO
                </button>
            </a>
        </p>

    <% } else { %>
        <p>El carrito está vacío.</p>
    <% } %>

</main>

<footer>
    <p><a href="index.jsp">Volver al inicio</a> </p>
</footer>

</body>
</html>