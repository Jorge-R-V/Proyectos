<%@taglib uri="jakarta.tags.core" prefix="c"%>
<%@taglib uri="jakarta.tags.fmt" prefix="fmt"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Listado Autores</title>
<jsp:directive.include file="../includes/includefile.jspf" />
</head>
<body>
<div class="container">
    <div class="header"></div>
    <div class="menu">
        <jsp:directive.include file="../WEB-INF/menu.jspf" />
    </div>
        <div class="w-75 ma py-2">
            <table class="table tablaconborde tablacebra tabla-hover">
                <caption>Listado Autores</caption>
                <thead>
                    <tr>
                    	<th scope="col">Id Autor</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Fecha Nacimiento</th>
					</tr>
                </thead>
                <tbody>
                  	<c:forEach var="autor" items="${listadoautores}">
						<tr>
							<td><p>${autor.idautor}</p></td>
							<td><p>${autor.nombre}</p></td>
							<td><p>${autor.fechanacimiento}</p></td>
						</tr>
					</c:forEach>
                </tbody>
            </table>
        </div>
	</div>

</body>
</html>