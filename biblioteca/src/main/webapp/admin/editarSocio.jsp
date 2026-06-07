<%@taglib uri="jakarta.tags.core" prefix="c"%>
<%@taglib uri="jakarta.tags.fmt" prefix="fmt"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Modificar Socio</title>
    <jsp:directive.include file="../includes/includefile.jspf" />
</head>
<body>
 <div class="container">
          <div class="header"></div>
          <div class="menu">
            <jsp:directive.include file="../WEB-INF/menu.jspf" />
         
          <br><br>

  <c:if test="${not empty confirmaroperacion}">
   <div class="divconfirmacion">
      <strong>Mensaje</strong><br/>
      <c:out value="${confirmaroperacion}" />
    </div>
  </c:if>

  <c:if test="${not empty error}">
   <div class="diverror">
      <strong>Error</strong><br/>
      <c:out value="${error}" />
    </div>
  </c:if>



    <form action="${pageContext.request.contextPath}/controller" method="post">
      	 <input type="hidden" name="operacion" value="modificarSocio"/>
         <input type="hidden" name="idsocio" value="${socio.idsocio}"/>
     	 <input type="hidden" name="version" value="${socio.version}"/>
      
      
      	<fieldset align="center">
      		<legend align="left">Modifique los datos</legend>
     
      	<div class="row">
        <label>Nombre:</label>
        <input type="text" name="nombre" value="${socio.nombre}" />
      	</div>

     	 <div class="row">
        <label>Dirección:</label>
        <input type="text" name="direccion" value="${socio.direccion}" />
     	 </div>

      	<div class="row">
        <label>Versión:</label>
        <input type="text" value="${socio.version}" readonly/>
      </div>

      <div class="row">
      
        <button type="submit">Modificar</button>
      </div>
        </fieldset>
    </form>
   </div>
 </div>

</body>
</html>
