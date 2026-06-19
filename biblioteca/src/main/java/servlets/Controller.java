/*package servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;

import dao.DaoSocio;
import entidades.Socio;

@WebServlet({"/Controller", "/controller"})
public class Controller extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private DaoSocio daoSocio;

    @Override
    public void init() throws ServletException {
        daoSocio = new DaoSocio();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        dispatch(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        dispatch(request, response);
    }

    private void dispatch(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String op = request.getParameter("operacion");
        if (op == null) op = "home";

        try {
            switch (op) {
                // === BÚSQUEDA + LISTADO PARA EDICIÓN ===
                // URL: /controller?operacion=listadoSocio[&nombre=...]
                case "listadoSocio":
                    listadoSocio(request, response);
                    break;
                case "editarSocio":
                    editarSocio(request, response);
                    break;

                case "modificarSocio":
                    modificarSocio(request, response);
                    break;


                default:
                    request.getRequestDispatcher("admin/listarSocio.jsp").forward(request, response);
            }
        } catch (Exception e) {
            request.setAttribute("error", e.getClass().getSimpleName() + ": " + e.getMessage());
            request.getRequestDispatcher("admin/error.jsp").forward(request, response);
        }
    }

    // ---------------------------------------------------------------------
    //  /controller?operacion=listadoSocio
    //  Muestra el formulario y, si hay 'nombre', lista coincidencias
    // ---------------------------------------------------------------------
    private void listadoSocio(HttpServletRequest request, HttpServletResponse response) throws Exception {
        String nombre = request.getParameter("nombre");   // puede venir null al cargar por primera vez
        request.setAttribute("nombre", nombre);           // eco en el input

        if (nombre != null && !nombre.trim().isEmpty()) {
            try {
                ArrayList<Socio> resultados = daoSocio.buscarPorNombre(nombre.trim());
                request.setAttribute("listado", resultados);
            } catch (SQLException sqle) {
                request.setAttribute("error", "SQL: " + sqle.getMessage());
            } catch (Exception ex) {
                request.setAttribute("error", ex.getMessage());
            }
        }
        request.getRequestDispatcher("admin/listarSocio.jsp").forward(request, response);
    }
 // Cargar el socio y mostrar el formulario de edición
    private void editarSocio(HttpServletRequest request, HttpServletResponse response) throws Exception {
        String paramId = request.getParameter("idsocio");
        if (paramId == null || paramId.isEmpty()) {
            request.setAttribute("error", "Falta el parámetro idsocio.");
            request.getRequestDispatcher("admin/error.jsp").forward(request, response);
            return;
        }

        int idsocio = Integer.parseInt(paramId);
        Socio s = daoSocio.findSocioById(idsocio);
        if (s == null) {
            request.setAttribute("error", "Socio no encontrado.");
            request.getRequestDispatcher("admin/error.jsp").forward(request, response);
            return;
        }

        request.setAttribute("socio", s);
        request.getRequestDispatcher("admin/editarSocio.jsp").forward(request, response);
    }

    // Guardar cambios (solo nombre y dirección) con control de versión
 // Controller.java
    private void modificarSocio(HttpServletRequest request, HttpServletResponse response) throws Exception {
        try {
            int idsocio   = Integer.parseInt(request.getParameter("idsocio"));
            String nombre = request.getParameter("nombre");
            String direccion = request.getParameter("direccion");
            int version  = Integer.parseInt(request.getParameter("version"));

            // Cargamos el socio actual para no perder email/otros campos
            Socio s = daoSocio.findSocioById(idsocio);
            if (s == null) {
                request.setAttribute("error", "Socio no encontrado.");
                request.getRequestDispatcher("admin/error.jsp").forward(request, response);
                return;
            }

            // Solo cambiamos lo permitido
            s.setNombre(nombre);
            s.setDireccion(direccion);
            s.setVersion(version);

            int filas = daoSocio.updateSocio(s); // <-- TU MÉTODO EXISTENTE

            if (filas == 1) {
                // recargar el socio ya actualizado
                s = daoSocio.findSocioById(idsocio);
                request.setAttribute("socio", s);
                request.setAttribute("confirmaroperacion", "Socio modificado correctamente.");
            } else {
                // versión no coincide: otro usuario lo cambió
                s = daoSocio.findSocioById(idsocio);
                request.setAttribute("socio", s);
                request.setAttribute("error", "El registro fue modificado por otro usuario. Vuelva a intentarlo.");
            }

            request.getRequestDispatcher("admin/editarSocio.jsp").forward(request, response);

        } catch (NumberFormatException nfe) {
            request.setAttribute("error", "Parámetros numéricos inválidos: " + nfe.getMessage());
            request.getRequestDispatcher("admin/error.jsp").forward(request, response);
        }
    }


}*/
package servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;

import dao.DaoSocio;
import entidades.Socio;

/**
 * Servlet implementation class Controller
 */
@WebServlet({ "/Controller", "/controller" })
public class Controller extends HttpServlet {
	private static final long serialVersionUID = 1L;
	  /**
     * @see HttpServlet#HttpServlet()
     */
	public Controller() {
		super();
	    // TODO Auto-generated constructor stub
	    
	}
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */

	protected void procesarError(HttpServletRequest request, 
			HttpServletResponse response,
			Exception e, String url)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		//response.getWriter().append("Served at: ").append(request.getContextPath());
		String mensajeError = e.getMessage();
		request.setAttribute("error", mensajeError);
		if (url == null) {
			url = "admin/error.jsp";
		}
		request.getRequestDispatcher(url).forward(request, response);
	}

	protected void procesarErrorSQL(HttpServletRequest request,HttpServletResponse response, SQLException e)
			throws ServletException, IOException {
			int codigoError = e.getErrorCode();
			String mensajeError;
			switch (codigoError) {
			case 30006:
			mensajeError = "Registro en proceso de modificación. Inténtelo más tarde";
			break;
			default:
			mensajeError = e.getMessage();
			}
			request.setAttribute("error", mensajeError);
			request.getRequestDispatcher("admin/error.jsp").forward(request,response);
			}
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String operacion = request.getParameter("operacion");
	

		switch (operacion) {

		// -----------------------------------------------------------
		// Mostrar listado de busqueda de socios para editar
		// -----------------------------------------------------------
		case "listadoSocio":
		    try {
		        DaoSocio dao = new DaoSocio();
		        String nombre = request.getParameter("nombre"); // puede ser null o vacio
		        // tu método del DAO ya detecta si está vacío => devuelve todos
		        ArrayList<Socio> listado = dao.buscarPorNombre(nombre);
		        // mantenemos el valor escrito para el input
		        request.setAttribute("nombre", nombre);   // eco del input
		        // enviamos la lista al JSP
		        request.setAttribute("listado", listado); // tu JSP usa ${listado}

		        request.getRequestDispatcher("admin/getsocio.jsp").forward(request, response);
		        
		    } catch (Exception e) {
		        e.printStackTrace();
		        request.setAttribute("mensajeerror", "Error: " + e.getMessage());
		        request.getRequestDispatcher("admin/error.jsp").forward(request, response);
		    }

		   /* } catch (SQLException e) {
		        e.printStackTrace();
		        request.setAttribute("error", "Error SQL: " + e.getMessage());
		        request.getRequestDispatcher("admin/error.jsp").forward(request, response);
			    break;*/

	
		 // listado de socios paginado
		case "listarSocios": {
		    try {
		        DaoSocio dao = new DaoSocio();

		        // lee de request o tira de sesión; si nada, arranca en 0 y 5
		        HttpSession ses = request.getSession();
		        Integer sesPag = (Integer) ses.getAttribute("paginaactual");
		        Integer sesNrp = (Integer) ses.getAttribute("registrosporpagina");

		        int pag = 0;
		        int nrp = 5;

		        if (sesPag != null) pag = sesPag;
		        if (sesNrp != null) nrp = sesNrp;

		        String pPag = request.getParameter("pag");
		        String pNrp = request.getParameter("nrp");
		        if (pPag != null) pag = Integer.parseInt(pPag);
		        if (pNrp != null) nrp = Integer.parseInt(pNrp);

		        if (pag < 0) pag = 0;
		        if (nrp <= 0) nrp = 5;

		        int total = dao.countSocios();

		        // página más alta (0-based)
		        int pagMax = (total == 0) ? 0 : (int) Math.max(0, Math.ceil(total / (double) nrp) - 1);
		        if (pag > pagMax) pag = pagMax;

		        int limiteInferior = (total == 0) ? 0 : (nrp * pag) + 1;
		        int limiteSuperior = (total == 0) ? 0 : Math.min((nrp * pag) + nrp, total);

		        ArrayList<Socio> listado = dao.listadoSocios(pag, nrp);

		        // guarda en sesión para que la JSP pueda consultarlas
		        ses.setAttribute("paginaactual", pag);
		        ses.setAttribute("registrosporpagina", nrp);
		        ses.setAttribute("paginamasalta", pagMax);

		        // datos para la vista
		        request.setAttribute("listado", listado);
		        request.setAttribute("totalregistros", total);
		        request.setAttribute("limiteinferior", limiteInferior);
		        request.setAttribute("limitesuperior", limiteSuperior);

		        request.getRequestDispatcher("admin/listarSocio.jsp").forward(request, response);

		    } catch (Exception e) {
		        e.printStackTrace();
		        request.setAttribute("mensajeerror", "Error: " + e.getMessage());
		        request.getRequestDispatcher("admin/error.jsp").forward(request, response);
		    }
		    break;
		}


		// -----------------------------------------------------------
		// Cargar un socio para edición
		// -----------------------------------------------------------
		case "editarSocio":
			try {
				int idsocio = Integer.parseInt(request.getParameter("idsocio"));
				DaoSocio dao = new DaoSocio();
				Socio socio = dao.editarSocio(idsocio);
				if (socio == null) {
					request.setAttribute("mensajeerror", "Socio no encontrado.");
				} else {
					request.setAttribute("socio", socio);
				}
				request.getRequestDispatcher("admin/editarSocio.jsp").forward(request, response);
			} catch (SQLException e) {
				e.printStackTrace();
				request.setAttribute("mensajeerror", "Error SQL: " + e.getMessage());
				request.getRequestDispatcher("admin/error.jsp").forward(request, response);
			} catch (Exception e) {
				e.printStackTrace();
				request.setAttribute("mensajeerror", "Error: " + e.getMessage());
				request.getRequestDispatcher("admin/error.jsp").forward(request, response);
			}
			break;

		// -----------------------------------------------------------
		// Modificar un socio existente (solo nombre y dirección)
		// -----------------------------------------------------------
		/*case "modificarSocio":
		    try {
		        int idsocio   = Integer.parseInt(request.getParameter("idsocio"));
		        String nombre = request.getParameter("nombre");
		        String direccion = request.getParameter("direccion");
		        int version  = Integer.parseInt(request.getParameter("version"));

		        // Montamos el socio con los datos del formulario (solo nombre y dirección se cambian)
		        Socio s = new Socio();
		        s.setIdsocio(idsocio);
		        s.setNombre(nombre);
		        s.setDireccion(direccion);
		        s.setVersion(version);

		        DaoSocio dao = new DaoSocio();
		        int filas = dao.updateSocio(s); // usa tu método con SELECT FOR UPDATE + VERSION

		        // Recargamos siempre para mostrar datos actuales en la vista
		        Socio socioRecargado = dao.findSocioById(idsocio);
		        request.setAttribute("socio", socioRecargado);

		        if (filas == 1) {
		            request.setAttribute("mensajeconfirmacion", "Operación realizada con éxito");
		        } else {
		            // Si devuelve 0, lo tratamos como situación de versión no coincidente
		            request.setAttribute("mensajeerror", "El socio fue modificado por otro usuario. Intente nuevamente.");
		        }

		        request.getRequestDispatcher("admin/editarSocio.jsp").forward(request, response);

		    } catch (excepciones.BloqueoOptimistaException be) {
		        // Caso específico de tu excepción: mostramos su mensaje y recargamos el socio
		        try {
		            int idsocio = Integer.parseInt(request.getParameter("idsocio"));
		            Socio socioRecargado = new DaoSocio().findSocioById(idsocio);
		            request.setAttribute("socio", socioRecargado); 
		        } catch (Exception ignored) {}
		        request.setAttribute("mensajeerror", be.getMessage());
		        request.getRequestDispatcher("admin/editarSocio.jsp").forward(request, response);

		    } catch (NumberFormatException nfe) {
		        request.setAttribute("mensajeerror", "Parámetros numéricos inválidos.");
		        request.getRequestDispatcher("admin/error.jsp").forward(request, response);

		    } catch (SQLException e) {
		        e.printStackTrace();
		        request.setAttribute("mensajeerror", "Error SQL: " + e.getMessage());
		        request.getRequestDispatcher("admin/error.jsp").forward(request, response);

		    } catch (Exception e) {
		        e.printStackTrace();
		        request.setAttribute("mensajeerror", "Error: " + e.getMessage());
		        request.getRequestDispatcher("admin/error.jsp").forward(request, response);
		    }
		    break;*/
		case "enviarValidacion": {
		    try {
		        String email = request.getParameter("email");
		        String telefono = request.getParameter("telefono");

		        if (email == null || email.isBlank() || telefono == null || telefono.isBlank()) {
		            request.setAttribute("mensajeerror", "Email y teléfono son obligatorios.");
		            request.getRequestDispatcher("admin/altaSocio.jsp").forward(request, response);
		            break;
		        }

		        // Genera token y (opcional) genera ya una password a guardar en TOKEN.CLAVE
		        String token = tools.Tools.generaToken();
		        String passwordPlano = tools.Tools.generaPassword();
		        String hash = encriptacion.Sha256.getSha256(passwordPlano);

		        // Guarda/actualiza token
		        entidades.Token t = new entidades.Token();
		        t.setEmail(email.trim());
		        t.setTelefono(telefono.trim());
		        t.setValue(token);
		        t.setClave(hash); // puedes dejarla null y generarla en validación
		        new dao.DaoToken().upsert(t);

		        // Envía correo con enlace
		        String cuerpo = tools.Tools.creaCuerpoCorreo(email.trim(), token);
		        tools.Tools.enviarConGMail(email.trim(), "Valida tu cuenta - Biblioteca", cuerpo);

		        request.setAttribute("mensajeconfirmacion",
		            "Te hemos enviado un correo para validar tu cuenta. Tras validarla, podrás acceder.");
		        request.getRequestDispatcher("admin/altaSocio.jsp").forward(request, response);

		    } catch (Exception e) {
		        e.printStackTrace();
		        request.setAttribute("mensajeerror", "No se pudo enviar el correo de validación: " + e.getMessage());
		        request.getRequestDispatcher("admin/altaSocio.jsp").forward(request, response);
		    }
		    break;
		}

		case "validacion": {
		    try {
		        String email = request.getParameter("email");
		        String token = request.getParameter("token");

		        if (email == null || email.isBlank() || token == null || token.isBlank()) {
		            request.setAttribute("mensajeerror", "URL de validación incompleta.");
		            request.getRequestDispatcher("public/validacion.jsp").forward(request, response);
		            break;
		        }

		        var opt = new dao.DaoToken().findByEmail(email.trim());
		        if (opt.isEmpty()) {
		            request.setAttribute("mensajeerror", "Token inexistente o ya utilizado.");
		            request.getRequestDispatcher("public/validacion.jsp").forward(request, response);
		            break;
		        }

		        entidades.Token tk = opt.get();

		        // Caducidad (7 días)
		        if (tk.getFechainicio() != null) {
		            java.time.LocalDate fi = tk.getFechainicio().toLocalDate();
		            if (fi.plusDays(7).isBefore(java.time.LocalDate.now())) {
		                request.setAttribute("mensajeerror", "Token caducado. Vuelve a registrarte.");
		                request.getRequestDispatcher("public/validacion.jsp").forward(request, response);
		                break;
		            }
		        }

		        // Comparar token
		        if (!token.equals(tk.getValue())) {
		            request.setAttribute("mensajeerror", "Token inválido.");
		            request.getRequestDispatcher("public/validacion.jsp").forward(request, response);
		            break;
		        }

		        // === Alta usuario web + grupo (ajusta a tu esquema de seguridad) ===
		        crearUsuarioWeb(email.trim(), tk.getClave()); // tk.getClave() ya es SHA-256

		        // Limpia el token
		        new dao.DaoToken().borrarPorEmail(email.trim());

		        request.setAttribute("mensajeconfirmacion", "Validación correcta. Ya puedes iniciar sesión.");
		        request.getRequestDispatcher("public/validacion_ok.jsp").forward(request, response);

		    } catch (Exception e) {
		        e.printStackTrace();
		        request.setAttribute("mensajeerror", "Error en la validación: " + e.getMessage());
		        request.getRequestDispatcher("public/validacion.jsp").forward(request, response);
		    }
		    break;
		}
		case "testMailForm": {
		    request.getRequestDispatcher("admin/testMail.jsp").forward(request, response);
		    break;
		}

		case "enviarTestMail": {
		    try {
		        String email  = request.getParameter("email");
		        String asunto = request.getParameter("asunto");
		        String cuerpo = request.getParameter("cuerpo");
		        if (email == null || email.isBlank()) {
		            request.setAttribute("mensajeerror", "Debes indicar un destinatario.");
		            request.getRequestDispatcher("admin/testMail.jsp").forward(request, response);
		            break;
		        }
		        tools.Tools.enviarConGMail(email.trim(), 
		                                   (asunto == null || asunto.isBlank()) ? "Prueba" : asunto.trim(),
		                                   (cuerpo == null || cuerpo.isBlank()) ? "<b>Test OK</b>" : cuerpo);
		        request.setAttribute("mensajeconfirmacion", "Correo enviado a " + email.trim());
		    } catch (Exception e) {
		        e.printStackTrace();
		        request.setAttribute("mensajeerror", "Fallo al enviar: " + e.getMessage());
		    }
		    request.getRequestDispatcher("admin/testMail.jsp").forward(request, response);
		    break;
		}


		case "modificarSocio":
		    try {
		        String pId = request.getParameter("idsocio");
		        String pNom = request.getParameter("nombre");
		        String pDir = request.getParameter("direccion");
		        String pVer = request.getParameter("version");

		        if (pId == null || pVer == null || pNom == null || pDir == null) {
		            request.setAttribute("error", "Parámetros incompletos.");
		            request.getRequestDispatcher("admin/editarSocio.jsp").forward(request, response);
		            break;
		        }

		        int idsocio  = Integer.parseInt(pId);
		        int version  = Integer.parseInt(pVer);
		        String nombre = pNom.trim();
		        String direccion = pDir.trim();

		        Socio s = new Socio();
		        s.setIdsocio(idsocio);
		        s.setNombre(nombre);
		        s.setDireccion(direccion);
		        s.setVersion(version);

		        DaoSocio dao = new DaoSocio();
		        int filas = dao.updateSocio(s); // tu método con SELECT FOR UPDATE + VERSION

		        // recarga para mostrar datos actuales
		        Socio socioRecargado = dao.findSocioById(idsocio);
		        request.setAttribute("socio", socioRecargado);

		        if (filas == 1) {
		            request.setAttribute("confirmaroperacion", "Operación realizada con éxito");
		        } else {
		            request.setAttribute("error", "El socio fue modificado por otro usuario. Intente nuevamente.");
		        }
		        request.getRequestDispatcher("admin/getsocio.jsp").forward(request, response);

		    } catch (excepciones.BloqueoOptimistaException be) {
		        try {
		            int idsocio = Integer.parseInt(request.getParameter("idsocio"));
		            Socio socioRecargado = new DaoSocio().findSocioById(idsocio);
		            request.setAttribute("socio", socioRecargado);
		        } catch (Exception ignored) {}
		        request.setAttribute("error", be.getMessage());
		        request.getRequestDispatcher("admin/getsocio.jsp").forward(request, response);

		    } catch (NumberFormatException nfe) {
		        request.setAttribute("error", "Parámetros numéricos inválidos.");
		        request.getRequestDispatcher("admin/getsocio.jsp").forward(request, response);

		    } catch (SQLException e) {
		        e.printStackTrace();
		        request.setAttribute("error", "Error SQL: " + e.getMessage());
		        request.getRequestDispatcher("admin/editarSocio.jsp").forward(request, response);

		    } catch (Exception e) {
		        e.printStackTrace();
		        request.setAttribute("error", "Error: " + e.getMessage());
		        request.getRequestDispatcher("admin/getsocio.jsp").forward(request, response);
		    }
		    break;



		default:
			
			request.getRequestDispatcher("admin/listarSocio.jsp").forward(request, response);
		}
	}
	

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doGet(request, response);
	}
	private void crearUsuarioWeb(String email, String passwordHashSHA256) throws Exception {
	    // Inserta en tablas de seguridad JAAS (ajusta nombres/columnas)
	    try (java.sql.Connection cn = new conexiones.Conexion().getConexion()) {
	        cn.setAutoCommit(false);

	        try (java.sql.PreparedStatement psU = cn.prepareStatement(
	            "INSERT INTO USUARIOS (EMAIL, PASSWORD) VALUES (?, ?)")) {
	            psU.setString(1, email);
	            psU.setString(2, passwordHashSHA256);
	            psU.executeUpdate();
	        }

	        try (java.sql.PreparedStatement psG = cn.prepareStatement(
	            "INSERT INTO GRUPOS (EMAIL, ROL) VALUES (?, 'USUARIO')")) {
	            psG.setString(1, email);
	            psG.executeUpdate();
	        }

	        cn.commit();
	    }
	}

}
//generar token para activar 




