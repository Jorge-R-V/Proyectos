<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta charset="UTF-8" />
  <title>Listado de Socios Paginado</title>
  <jsp:directive.include file="../includes/includefile.jspf" />
</head>
<body>
<div class="container">
  <div class="header"></div>
  <div class="menu">
    <jsp:directive.include file="../WEB-INF/menu.jspf" />
  </div>

  <h2 class="tacenter">Listado de Socios Paginado</h2>

  <c:if test="${not empty mensajeError}">
    <div class="diverror"><c:out value="${mensajeError}"/></div>
  </c:if>

  <c:if test="${empty listado}">
    <p class="muted">No hay registros para mostrar.</p>
  </c:if>

  <c:if test="${not empty listado}">
    <table class="table tablaconborde tablacebra tabla-hover">
      <thead>
        <tr>
          <th>IDSOCIO</th>
            <th>NOMBRE</th>
          <th>EMAIL</th>
        
          <th>DIRECCION</th>
        </tr>
      </thead>
      <tbody>
        <c:forEach var="s" items="${listado}">
          <tr>
            <td><c:out value="${s.idsocio}"/></td>
              <td><c:out value="${s.nombre}"/></td>
            <td><c:out value="${s.email}"/></td>
          
            <td><c:out value="${s.direccion}"/></td>
          </tr>
        </c:forEach>
      </tbody>
    </table>

    <div class="py-2">
      <strong>Total Registros:</strong> <c:out value="${totalregistros}"/>
      &nbsp;&nbsp;
      Mostrando desde <c:out value="${limiteinferior}"/> a <c:out value="${limitesuperior}"/>
      &nbsp;&nbsp;

      <c:set var="ctx" value="${pageContext.request.contextPath}"/>
      <c:set var="pag" value="${sessionScope.paginaactual}"/>
      <c:set var="nrp" value="${sessionScope.registrosporpagina}"/>
      <c:set var="tope" value="${sessionScope.paginamasalta}"/>

      <a href="${ctx}/controller?operacion=listarSocios&pag=${pag-1 < 0 ? 0 : pag-1}&nrp=${nrp}">Ant</a>
      &nbsp;|&nbsp;
      <a href="${ctx}/controller?operacion=listarSocios&pag=${pag+1 > tope ? 0 : pag+1}&nrp=${nrp}">Sig</a>
    </div>
  </c:if>
</div>
</body>
</html>
