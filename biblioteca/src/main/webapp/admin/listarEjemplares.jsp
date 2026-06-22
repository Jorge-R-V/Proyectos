<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta charset="UTF-8">
  <title>Admin · Ejemplares</title>
  <style>
    body{font-family:Arial;margin:24px}
    table{border-collapse:collapse}
    th,td{border:1px solid #ddd;padding:6px 10px}
    .ok{color:green}.err{color:#b00020}
    form.inline{display:inline}
  </style>
</head>
<body>
  <h2>Ejemplares</h2>

  <c:if test="${not empty msg}"><p class="ok">${msg}</p></c:if>
  <c:if test="${not empty error}"><p class="err">${error}</p></c:if>

  <!-- Filtro por ISBN -->
  <form method="get" action="${pageContext.request.contextPath}/ControllerAdmin">
    <input type="hidden" name="op" value="listarEjemplaresPorIsbn"/>
    <label>ISBN: </label>
    <input type="text" name="isbn" value="${isbn}">
    <button type="submit">Buscar</button>
    <a href="${pageContext.request.contextPath}/ControllerAdmin?op=listarEjemplares">Ver todos</a>
  </form>

  <table>
    <thead><tr><th>ID</th><th>ISBN</th><th>Baja</th><th>Acciones</th></tr></thead>
    <tbody>
      <c:forEach var="e" items="${ejemplares}">
        <tr>
          <td>${e.idejemplar}</td>
          <td>${e.isbn}</td>
          <td>${e.baja}</td>
          <td>
            <form class="inline" method="post" action="${pageContext.request.contextPath}/ControllerAdmin?op=bajaEjemplar">
              <input type="hidden" name="idejemplar" value="${e.idejemplar}"/>
              <button type="submit">Baja</button>
            </form>
            <form class="inline" method="post" action="${pageContext.request.contextPath}/ControllerAdmin?op=altaEjemplar">
              <input type="hidden" name="idejemplar" value="${e.idejemplar}"/>
              <button type="submit">Alta</button>
            </form>
          </td>
        </tr>
      </c:forEach>
      <c:if test="${empty ejemplares}">
        <tr><td colspan="4">No hay ejemplares.</td></tr>
      </c:if>
    </tbody>
  </table>

  <h3>Nuevo ejemplar</h3>
  <form method="post" action="${pageContext.request.contextPath}/ControllerAdmin?op=guardarEjemplar">
    <p>ISBN existente: <input type="text" name="isbn" required></p>
    <button type="submit">Guardar</button>
  </form>

  <p><a href="${pageContext.request.contextPath}/ControllerAdmin?op=listarAutores">Ir a Autores</a></p>
</body>
</html>
