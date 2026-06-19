
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Test envío de correo</title>
  <jsp:directive.include file="../includes/includefile.jspf" />
</head>
<body>
<div class="container">
  <div class="header"></div>
  <div class="menu">
    <jsp:directive.include file="../WEB-INF/menu.jspf" />
  </div>

  <h2>Test envío de correo</h2>

  <c:if test="${not empty mensajeconfirmacion}">
    <div class="divconfirmacion">${mensajeconfirmacion}</div>
  </c:if>
  <c:if test="${not empty mensajeerror}">
    <div class="diverror">${mensajeerror}</div>
  </c:if>

  <form method="post" action="${pageContext.request.contextPath}/controller">
    <input type="hidden" name="operacion" value="enviarTestMail"/>
    <p><label>Destinatario: <input type="email" name="email" required/></label></p>
    <p><label>Asunto: <input type="text" name="asunto" value="Prueba Biblioteca" required/></label></p>
    <p><label>Cuerpo (HTML):<br/>
      <textarea name="cuerpo" rows="6" cols="60"><strong>Hola</strong>, este es un test.</textarea>
    </label></p>
    <button type="submit">Enviar</button>
  </form>
</div>
</body>
</html>
    