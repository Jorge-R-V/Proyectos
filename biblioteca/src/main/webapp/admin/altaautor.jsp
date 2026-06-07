<%@taglib uri="jakarta.tags.core" prefix="c"%>
<%@taglib uri="jakarta.tags.fmt" prefix="fmt"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Nuevo autor</title>
<jsp:directive.include file="../includes/includefile.jspf" />
</head>
<body>
	<div class="container">
		<div class="header"></div>
		<div class="menu">
			<jsp:directive.include file="../WEB-INF/menu.jspf" />
			<br><br>
			<c:if test="${not empty mensajeconfirmacion}">
			<div class="divconfirmacion">
				<p><strong>Mensaje:</strong> ${mensajeconfirmacion}.</p>
			</div>
			</c:if>
			<c:if test="${not empty mensajeerror}">
			<div class="diverror">
				<p><strong>Mensaje:</strong> ${mensajeerror}.</p>
			</div>
			</c:if>
			
	<form action="${pageContext.request.contextPath}/controlleradmin" method="post">
    	<input type="hidden" name="operacion" value="altaAutor">

        <fieldset align="center">
            <legend align="left">Nuevo Autor</legend>
            <p><label>Nombre: <input type="text" name="nombre" required></label></p>
            <p><label>Fecha de nacimiento: <input type="date" name="fechaNacimiento" required></label></p>
            
            
           
            <div class="guardar">
            	<button type="submit">Guardar</button>
        	</div>
        </fieldset>
        
    </form>
		</div>
	</div>
</body>
</html>