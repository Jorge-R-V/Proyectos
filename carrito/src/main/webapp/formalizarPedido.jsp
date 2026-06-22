<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.util.List" %>
<%@ page import="entidades.DetallePedido" %>
<%@ page import="java.math.BigDecimal" %>

<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta charset="UTF-8">
    <title>Formalizar Pedido</title>
    <link rel="stylesheet" type="text/css" href="recursos/css/estilos.css">
</head>
<body>

<%
    // 1. Recuperar el carrito (List<DetallePedido>) de la sesión
    @SuppressWarnings("unchecked")
    List<DetallePedido> carrito = (List<DetallePedido>) session.getAttribute("carro");
    
    // 2. Inicializar el total final del pedido
    BigDecimal totalFinal = BigDecimal.ZERO;

    // 3. Recuperar y mostrar errores del Controlador (si los hay)
    String error = (String) request.getAttribute("error");
%>

<header>
    <h1>FORMALIZACIÓN DEL PEDIDO</h1>
</header>

<main>

    <% if (error != null && !error.isEmpty()) { %>
        <p style="color: red; font-weight: bold;"><%= error %></p>
    <% } %>

    <h2>Resumen del Carrito</h2>
    
    <% if (carrito != null && !carrito.isEmpty()) { %>
        <table border="1">
            <thead>
                <tr>
                    <th>ID Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Total Línea</th>
                </tr>
            </thead>
            <tbody>
                <% 
                    for (DetallePedido dp : carrito) {
                        // Calcular el total
                        totalFinal = totalFinal.add(dp.getTotal_LineaDetalle());
                %>
                    <tr>
                        <td><%= dp.getIdProducto() %></td>
                        <td><%= dp.getCantidad() %></td>
                        <td><%= dp.getPrecio_Unitario() %></td>
                        <td><%= dp.getTotal_LineaDetalle() %></td>
                    </tr>
                <% } %>
            </tbody>
        </table>
        
        <h3>TOTAL DEL PEDIDO: <%= totalFinal %></h3>
    
    <% } else { %>
        <p>El carrito está vacío. Por favor, <a href="controlador?operacion=comprar">vuelva al listado de productos</a>.</p>
    <% } %>

    <hr>
    
    <% if (carrito != null && !carrito.isEmpty()) { %>
        <h2>Datos del Cliente y Envío</h2>
        
        <form action="controlador" method="post">
            <label for="idCliente">ID Cliente (requerido para validar):</label>
            <input type="number" id="idCliente" name="idCliente" required min="1"><br><br>
            
            <label for="direccionEnvio">Dirección de Envío:</label>
            <input type="text" id="direccionEnvio" name="direccionEnvio" required size="50"><br><br>
            
            <input type="submit" value="CONFIRMAR Y FINALIZAR PEDIDO">
        </form>
    <% } %>
    
    <p>
        <a href="controlador?operacion=comprar">Volver al listado de productos</a>
    </p>

</main>
</body>
</html>