<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta charset="UTF-8">
    <title>Pedido Confirmado</title>
    <link rel="stylesheet" type="text/css" href="recursos/css/estilos.css">
</head>
<body>

<%
    // 1. Recuperar el ID del pedido generado, pasado como atributo por el Servlet
    Integer idPedido = (Integer) request.getAttribute("idPedido");
%>

<header>
    <h1>PEDIDO FORMALIZADO CON ÉXITO</h1>
</header>

<main>
    <h2>¡Gracias por tu compra!</h2>
    
    <p>Tu pedido ha sido procesado y registrado en nuestra base de datos.</p>
    
    <% if (idPedido != null) { %>
        <p style="font-size: 1.2em; font-weight: bold; color: green;">
            Número de Pedido: **<%= idPedido %>**
        </p>
    <% } else { %>
        <p>El pedido se ha procesado correctamente. Por favor, revisa tu correo electrónico para el ID de confirmación.</p>
    <% } %>

    <hr>
    
    <p>
        <a href="index.jsp">Volver a la página de inicio</a>
    </p>

</main>

</body>
</html>