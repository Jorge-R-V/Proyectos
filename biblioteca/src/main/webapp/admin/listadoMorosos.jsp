<%@taglib uri="jakarta.tags.core" prefix="c"%>
<%@taglib uri="jakarta.tags.fmt" prefix="fmt"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Socios Morosos</title>
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
                    <caption>Socios Morosos</caption>
                    <thead>
                        <tr>
                            <th scope="col">CÓDIGO</th>
                            <th scope="col">NOMBRE</th>
                            <th scope="col">LIBROS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <c:forEach items="${listadoMorosos}" var="socio">
                            <tr>
                                <td class="txtderecha">${socio.idsocio}</td>
                                <td>${socio.nombre}</td>
                                <td class="txtcentrado">
                                    <a href="${pageContext.request.contextPath}/controlleradmin?operacion=listarLibrosMorosos&idsocio=${socio.idsocio}">Ver Libros</a>
                                </td>
                            </tr>
                        </c:forEach>
                    </tbody>
                </table>
                <c:if test="${listadoLibrosMorosos !=null}">
                <table class="table tablaconborde tablacebra tabla-hover">
                    <caption>Libros sin devolver</caption>
                    <thead>
                        <tr>
                            <th scope="col">TITULO</th>
                            <th scope="col">DIAS DEMORA</th>
                            <th scope="col">FECHA PRESTAMO</th>
                        </tr>
                    </thead>
                    <tbody>
                        <c:forEach items="${listadoLibrosMorosos}" var="socio">
                            <tr>
                                <td class="txtcentrado">${socio.titulo}</td>
                                <td class="txtcentrado">${socio.diasdemora}</td>
                                <td class="txtcentrado">${socio.fechaprestamo}</td>
                            </tr>
                        </c:forEach>
                    </tbody>
                </table>
                </c:if>
            </div>
    </div>
</body>
</html>