<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Crear Usuario</title>
  <jsp:directive.include file="../includes/includefile.jspf" />
</head>
<body>
<div class="container">
  <div class="header"></div>
  <div class="menu">
    <jsp:directive.include file="../WEB-INF/menu.jspf" />
  </div>

  <h2>Alta de usuario manual</h2>

  <c:if test="${not empty mensajeconfirmacion}">
    <div class="divconfirmacion">${mensajeconfirmacion}</div>
  </c:if>
  <c:if test="${not empty mensajeerror}">
    <div class="diverror">${mensajeerror}</div>
  </c:if>

  <form method="post" action="${pageContext.request.contextPath}/controller">
    <input type="hidden" name="operacion" value="crearUsuarioPrueba"/>
    <p><label>Usuario (email): <input type="text" name="usuario" required/></label></p>
    <p><label>Contraseña: <input type="password" name="clave" required/></label></p>
    <button type="submit">Crear usuario</button>
  </form>
</div>
</body>
</html>
