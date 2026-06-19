/*package tools;

import java.util.Properties;

import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

public class Tools {

	private static String generaAleatorio(int ancho) {
        String CHAR_LOWER = "abcdefghijklmnopqrstuvwxyz";
        String CHAR_UPPER = CHAR_LOWER.toUpperCase();
        String NUMBER = "0123456789";
        String especiales = "$();,.";
        String DATA_FOR_RANDOM_STRING = CHAR_LOWER + CHAR_UPPER + NUMBER;
        StringBuilder sb = new StringBuilder(ancho);
        for (int i = 0; i < ancho; i++) {
            int rndCharAt = (int) (Math.random() * DATA_FOR_RANDOM_STRING.length());
            char rndChar = DATA_FOR_RANDOM_STRING.charAt(rndCharAt);
            sb.append(rndChar);
        }
		return DATA_FOR_RANDOM_STRING;

		
	}
			
	
 public static String generaToken() {
        return generaAleatorio(50);
 }
 public static String generaPassword() {
        return generaAleatorio(6);


}
	public static void enviarConGMail(String destinatario, String asunto, String cuerpo) {
		String remitente = "karlosegh@gmail.com";  
		String clave="fmtljuzbyoyadont";
		Properties props = System.getProperties();
		props.put("mail.smtp.auth", "true"); // Usar autenticación mediante usuario y clave
		props.put("mail.smtp.starttls.enable", "true"); // Para conectar de manera segura al servidor SMTP
		props.put("mail.smtp.port", "587"); // El puerto SMTP seguro de Google
	
	    Session session = Session.getInstance(props, new jakarta.mail.Authenticator() {
	        @Override
	        protected PasswordAuthentication getPasswordAuthentication() {
	            return new PasswordAuthentication(remitente, clave);
	        }
	    });

		try {
			MimeMessage message = new MimeMessage(session);
			message.setFrom(new InternetAddress(remitente));
			message.addRecipients(Message.RecipientType.TO, destinatario);// Se podrían añadir varios de la misma manera
			message.setSubject(asunto);
			// Para poner texto plano
			//message.setText(cuerpo);
			// Si no pones este encabezado no interpreta el html
			message.setContent(cuerpo,"text/html");
			Transport transport = session.getTransport("smtp");
			transport.connect("smtp.gmail.com", remitente, clave);
			transport.sendMessage(message, message.getAllRecipients());
			transport.close();
		} catch (MessagingException me) {
			System.out.println("Entra en la excepción MessagingExepcion");
			me.printStackTrace(); // Si se produce un error
		}
	}
	
	public static String creaCuerpoCorreo(String email,String token) {
		String ref="http://localhost:8080/Biblioteca/controller?operacion=validacion&email="+email+"&token="+token;
		StringBuilder st=new StringBuilder();
		st.append("<!DOCTYPE html>");
		st.append("<html lang='es'>");
		st.append("  <head>");
		st.append("    <meta http-equiv='Content-Type' content='text/html; charset=UTF-8'>");
		st.append("   <title>Correo de IES Azarquiel</title>");
		st.append(" </head>");
		st.append(" <body>");
		st.append(" Recibes este correo porque te has registrado en la  aplicación <strong>Biblioteca</strong> <br/>");
		st.append(" Para  empezar a usar la aplicación,debes validar antes el correo");
		st.append(" con el que te registraste.<br/><br/>");
		st.append(" Pulsa en el siguiente enlace para activar tu usuario <br/><br/>");
		st.append(" <a href=\""+ref+"\" style=\"font-size:36px;text-decoration:none;background-color:lightgreen; \"> Pulse para validar el usuario </a>");
		st.append(" </body>");
		st.append("</html>");
		return st.toString();
	}




 
}*/
package tools;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Properties;

import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

public class Tools {

    // ======== GENERADORES ========
    private static String generaAleatorio(int ancho) {
        String lower = "abcdefghijklmnopqrstuvwxyz";
        String upper = lower.toUpperCase();
        String number = "0123456789";
        String especial = "$()[],.;:_-!@#";
        String pool = lower + upper + number + especial;

        StringBuilder sb = new StringBuilder(ancho);
        for (int i = 0; i < ancho; i++) {
            int idx = (int) (Math.random() * pool.length());
            sb.append(pool.charAt(idx));
        }
        return sb.toString(); // <-- CORREGIDO
    }

    public static String generaToken()   { return generaAleatorio(50); }
    public static String generaPassword(){ return generaAleatorio(8);  }

    // ======== EMAIL ========
    public static void enviarConGMail(String destinatario, String asunto, String cuerpoHtml) {
        Properties config = new Properties();
        try (java.io.InputStream is = Thread.currentThread().getContextClassLoader().getResourceAsStream("config.properties")) {
            if (is != null) {
                config.load(is);
            } else {
                System.err.println("Advertencia: No se encontró config.properties");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        final String remitente = config.getProperty("email.sender");
        final String clave = config.getProperty("email.password");

        Properties props = System.getProperties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.port", "587");
        props.put("mail.smtp.host", "smtp.gmail.com");

        Session session = Session.getInstance(props, new jakarta.mail.Authenticator() {
            @Override protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(remitente, clave);
            }
        });

        try {
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(remitente));
            message.addRecipients(Message.RecipientType.TO, destinatario);
            message.setSubject(asunto, "UTF-8");
            message.setContent(cuerpoHtml, "text/html; charset=UTF-8");

            Transport transport = session.getTransport("smtp");
            transport.connect("smtp.gmail.com", remitente, clave);
            transport.sendMessage(message, message.getAllRecipients());
            transport.close();
        } catch (MessagingException me) {
            me.printStackTrace();
        }
    }

    // Construye el cuerpo con URL codificada
    public static String creaCuerpoCorreo(String email, String token) {
        String emailEnc = URLEncoder.encode(email, StandardCharsets.UTF_8);
        String tokenEnc = URLEncoder.encode(token, StandardCharsets.UTF_8);

        // ¡OJO mayúscula! /Biblioteca
        String ref = "http://localhost:8080/Biblioteca/controller?operacion=validacion"
                   + "&email=" + emailEnc + "&token=" + tokenEnc;

        StringBuilder st = new StringBuilder();
        st.append("<!DOCTYPE html><html lang='es'><head>")
          .append("<meta charset='UTF-8'><title>Validación</title>")
          .append("</head><body>")
          .append("Recibes este correo porque te has registrado en la aplicación <strong>Biblioteca</strong>.<br/>")
          .append("Para empezar a usarla, valida antes tu correo.<br/><br/>")
          .append("<a href=\"").append(ref)
          .append("\" style=\"font-size:20px;text-decoration:none;background-color:lightgreen;padding:10px 14px;\">")
          .append("Validar mi usuario</a>")
          .append("</body></html>");
        return st.toString();
    }
}
