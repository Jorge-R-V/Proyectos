<%@taglib uri="jakarta.tags.core" prefix="c"%>
<%@taglib uri="jakarta.tags.fmt" prefix="fmt"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta charset="UTF-8">º
<title>Devolución</title>
<jsp:directive.include file="../includes/includefile.jspf" />
</head>
<body>
	<div class="container">
		<div class="header"></div>
		<div class="menu">
			<jsp:directive.include file="../WEB-INF/menu.jspf" />
			<br><br>

			<!-- Mensajes -->
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

			<!-- Formulario Devolución por Código de Ejemplar -->
			<form action="${pageContext.request.contextPath}/controlleradmin" method="post" autocomplete="off">
				<input type="hidden" name="operacion" value="devolucion" />

				<fieldset align="center" style="max-width:640px; margin:0 auto;">
					<legend align="left">Datos Devolución</legend>

					<p>
						<label>Código de Ejemplar:
							<input type="number" name="idejemplardevolucion" required
								   value="${empty idejemplardevolucion ? param.idejemplardevolucion : idejemplardevolucion}" />
						</label>
					</p>

					<div class="guardar">
						<button type="submit">Devolver</button>
					</div>
				</fieldset>
			</form>
		</div>
	</div>
</body>
</html>
