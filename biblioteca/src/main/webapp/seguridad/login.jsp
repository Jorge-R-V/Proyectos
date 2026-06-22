<%@taglib uri="jakarta.tags.core" prefix="c"%>
<%@taglib uri="jakarta.tags.fmt" prefix="fmt"%>
<%@ page language="java" 
         contentType="text/html;charset=UTF-8"
         pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta charset="UTF-8">
<title>Login</title>

<script src="https://www.google.com/recaptcha/api.js?render=**CLAVE PUBLICA **"></script>
<script>
grecaptcha.ready(function() {
grecaptcha.execute('**CLAVE PUBLICA **', {action: 'login'})
.then(function(token) {
var recaptchaResponse = document.getElementById('g-recaptcha-response');
recaptchaResponse.value = token;
});
});
</script> 
<jsp:directive.include file="../includes/includefile.jspf" />
</head>
<body>
	<div class="container">
	<div class="header"></div>
     <div id="formLogin" class="formulariogeneral">		
		<form action="j_security_check" method="post">
			<fieldset id="datosAutor">
                   <legend><img src="../resources/img/azarquiel.gif">&nbsp;Introduzca sus datos de usuario</legend>
                   	<div class="etiquetas">
						<label for="j_username">Usuario:</label>
					</div>
					<div class="campos">
						<input type="text" 
						       id="j_username" 
						       name="j_username"/>
					</div>	
					<div class="etiquetas">
						<label for="j_password">Clave:</label>
					</div>	
				    <div class="campos">
						<input type="password" 
						       id="j_password" 
						       name="j_password"/>
					</div>
					<div class="cb"></div>
					<div class="botones">	
							<input type="submit" name="Submit" value="Acceder">
							<a href="/Biblioteca/admin/altaSocio.jsp">Registrese</a>
					</div>	
				</fieldset>		
				<input type="hidden" id="g-recaptcha-response" name="g-recaptcha-response">	
		</form>
		</div>
	</div>
</body>
</html>