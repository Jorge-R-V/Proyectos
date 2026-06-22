<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
  <%@ taglib prefix="c" uri="jakarta.tags.core" %>
    <%@taglib uri="jakarta.tags.fmt" prefix="fmt" %>
      <!DOCTYPE html>
      <html lang="es">

      <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta charset="UTF-8" />
        <title>Listado de Socios</title>
        <jsp:directive.include file="../includes/includefile.jspf" />
      </head>

      <body>
        <div class="container">
          <div class="header"></div>
          <div class="menu">
            <jsp:directive.include file="../WEB-INF/menu.jspf" />
          </div>
           <c:if test="${not empty confirmaroperacion}">
   <div class="divconfirmacion">
      <strong>Mensaje</strong><br/>
      <c:out value="${confirmaroperacion}" />
    </div>
  </c:if>
          <!-- Error general (si lo envía el controller) -->
          <c:if test="${not empty error}">
            <div class="diverror"><strong>Error:</strong>
              <c:out value="${error}" />
            </div>
          </c:if>

          <!-- Formulario de búsqueda -->
          <div class="w-50 ma py-2">
            <form action="${pageContext.request.contextPath}/controller" method="get">
              <input type="hidden" name="operacion" value="listadoSocio" />
              <fieldset align="center">
                <legend align="left">Introduzca parte del Socio a modificar</legend>
                <p><label>Nombre:<input type="text" name="nombre" value="${nombre != null ? nombre : ''}"></label></p>

                <div class="buscar">
                  <button type="submit">Buscar</button>
                </div>
              </fieldset>
            </form>
          </div>



          <c:choose>
            <%-- primera carga sin escribir nada --%>

              <c:when test="${empty nombre}">
                <p class="muted">Escriba parte del nombre y pulse <em>Buscar</em>.</p>
              </c:when>

              <%-- hay resultados --%>

                <c:when test="${not empty listado}">
                  <div class="w-75 ma py-2">
                    <table class="table tablaconborde tablacebra tabla-hover">
                      <caption>Listado Socios</caption>
                      <thead>
                        <tr>
                          <th>IDSOCIO</th>
                          <th>NOMBRE</th>
                          <th>DIRECCION</th>
                          <th>Editar</th>
                        </tr>
                      </thead>
                      <tbody>
                        <c:forEach var="s" items="${listado}">
                          <tr>
                            <td>
                              <c:out value="${s.idsocio}" />
                            </td>
                            <td>
                              <c:out value="${s.nombre}" />
                            </td>
                            <td>
                              <c:out value="${s.direccion}" />
                            </td>
                            <td>
                              <a
                                href="${pageContext.request.contextPath}/controller?operacion=editarSocio&idsocio=${s.idsocio}">
                                Editar
                              </a>
                            </td>
                          </tr>
                        </c:forEach>
                      </tbody>
                    </table>
                  </div>
                </c:when>


                <%-- búsqueda sin coincidencias --%>
                  <c:otherwise>
                    <p class="alert-warn" align="center" style="color:red;">
                      Ningún registro coincide con el patrón:
                      <c:out value="${nombre}" />
                    </p>
                  </c:otherwise>
          </c:choose>


      </body>

      </html>