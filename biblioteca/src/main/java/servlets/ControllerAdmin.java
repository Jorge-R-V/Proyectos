   package servlets;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashMap;

import dao.DaoAutor;
import dao.DaoEjemplar;
import dao.DaoPrestamo;
import dao.DaoSocio;
import entidades.Autor;
import entidades.Ejemplar;
import entidades.Prestamo;
import entidades.Socio;

/**
 * Servlet implementation class ControllerAdmin
 */
@WebServlet({ "/ControllerAdmin", "/controlleradmin" })
public class ControllerAdmin extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ControllerAdmin() {
        super(); 
        // TODO Auto-generated constructor stub
    }
    
    protected void procesarError(HttpServletRequest request,
            HttpServletResponse response,
            Exception e, String url)
           throws ServletException, IOException {
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

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		//response.getWriter().append("Served at: ").append(request.getContextPath());
		
		String operacion= request.getParameter("operacion");
		//
		 
	
		switch(operacion) {
		case "altaAutor":
		    String nombre = request.getParameter("nombre");
		    String fechaNacimiento = request.getParameter("fechaNacimiento");

		    Autor autor = new Autor();
		    autor.setNombre(nombre);

		    try {
		        // ✅ Si el input HTML es <input type="date">, el formato ya es ISO (yyyy-MM-dd)
		        LocalDate fechanacimiento = LocalDate.parse(fechaNacimiento);
		        // Convertimos a SQL para guardar en BD
		        
		        java.sql.Date sqlDatefechanacimiento = java.sql.Date.valueOf(fechanacimiento);
		        autor.setFechanacimiento(sqlDatefechanacimiento);
		        
		        // ✅ Formateamos para mostrar en pantalla (dd-MM-yyyy)
		        DateTimeFormatter formatoMostrar = DateTimeFormatter.ofPattern("dd-MM-yyyy");
		        String fechaFormateada = fechanacimiento.format(formatoMostrar);
		        
		        // Guardamos los datos en la request
		        request.setAttribute("nombre", nombre);
		        request.setAttribute("fechanacimiento", sqlDatefechanacimiento);

		        // Insertamos el autor
		        DaoAutor dao = new DaoAutor();
		        dao.insertaAutor(autor);

		        request.setAttribute("mensajeconfirmacion", "Operación realizada con éxito");
		        request.getRequestDispatcher("admin/altaAutor.jsp").forward(request, response);

		    } catch (DateTimeParseException pe) {
		        // ❌ Si el formato de fecha no es válido
		        request.setAttribute("mensajeerror", "Formato de fecha incorrecto (debe ser yyyy-MM-dd)");
		        request.setAttribute("nuevoautor", autor);
		        request.setAttribute("fechaErronea", fechaNacimiento); // <-- guardamos la cadena original
		        procesarError(request, response, pe, "mensajeerror");
		        request.getRequestDispatcher("admin/altaAutor.jsp").forward(request, response);

		    } catch (SQLException e) {
		        // ❌ Si ocurre un error de base de datos
		        e.printStackTrace();
		        request.setAttribute("mensajeerror", "Operación fallida. Error: " + e.getMessage());
		        request.getRequestDispatcher("admin/altaAutor.jsp").forward(request, response);
		    }

		    break;

	
             
		case "socioslibrosfueraplazo":
			DaoSocio dao=new DaoSocio();
			try {
				ArrayList<Socio> listadomorosos= dao.listadoMorosos();
				request.setAttribute("listadoMorosos", listadomorosos);
				request.getRequestDispatcher("admin/listadoMorosos.jsp").forward(request,response);
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				request.setAttribute("mensaje", "Operación fallida. Error: " + e.getMessage());
				request.getRequestDispatcher("admin/listadoMorosos.jsp").forward(request,response);
			}
		    
			break;
			//-------------------------------------------------
		case "listarLibrosMorosos":
			String stridsocio=request.getParameter("idsocio");
            int idsocio=Integer.parseInt(stridsocio);
            try {
                dao = new DaoSocio();
                ArrayList<Socio> listadoMorosos = dao.listadoMorosos();
                request.setAttribute("listadoMorosos", listadoMorosos);
                
                DaoPrestamo daop = new DaoPrestamo();
                ArrayList<Prestamo> listadoLibrosMorosos = daop.listadoLibrosMoroso(idsocio);
                request.setAttribute("listadoLibrosMorosos", listadoLibrosMorosos);
                Socio socioSeleccionado = dao.findSocioById(idsocio);
                request.setAttribute("socioSeleccionado", socioSeleccionado);
                request.getRequestDispatcher("admin/listadoMorosos.jsp").forward(request,response);
                
            } catch(Exception e){
                System.out.println("Error");
                request.setAttribute("mensaje", "Operación fallida. Error: " + e.getMessage());
				request.getRequestDispatcher("admin/listadoMorosos.jsp").forward(request,response);
            }
            break;
            //--------------------------------------------------------
            
		case "altaSocio":
			String nombresocio = request.getParameter("nombre");
            String email = request.getParameter("email");
            String direccion = request.getParameter("direccion");
            
            Socio socio=new Socio();
            socio.setNombre(nombresocio);
            socio.setEmail(email);
            socio.setDireccion(direccion);
            request.setAttribute("nombre", nombresocio);
            request.setAttribute("email", email);
            request.setAttribute("direccion", direccion);
            
           try {
           	DaoSocio dao1=new DaoSocio();
				dao1.insertSocio(socio);
				request.setAttribute("mensajeconfirmacion", "Operación realizada con éxito");
				request.getRequestDispatcher("admin/altaSocio.jsp").forward(request,response);
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				request.setAttribute("mensajeerror", "Operación fallida. Error: " + e.getMessage());
				request.getRequestDispatcher("admin/altaSocio.jsp").forward(request,response);
			} catch (DateTimeParseException pe) {
				// TODO Auto-generated catch block
				request.setAttribute("mensajeerror", "Formato de fecha incorrecto: yyyy-MM-dd");
				procesarError(request, response, pe, "mensajeerror");
				request.getRequestDispatcher("admin/altaSocio.jsp").forward(request,response);
			}
            
            break;
            //-----------------------fu
            /*
		case "prestamo": {
		    String idejemplarprestamo = request.getParameter("idejemplarprestamo");
		    String idsocioprestamo    = request.getParameter("idsocioprestamo");

		    try {
		        int idejemplar = Integer.parseInt(idejemplarprestamo);
		        int idsociopres = Integer.parseInt(idsocioprestamo);

		        // Deja las fechas a NULL => el trigger ANOTARDATOSPRESTAMOS las rellena y calcula la
		        // FECHALIMITEDEVOLUCION con GETFECHADEVOLUCION(). 
		        DaoPrestamo dao1 = new DaoPrestamo();
		        dao1.insertarPrestamo(idejemplar, idsociopres, null, null);

		        request.setAttribute("mensajeconfirmacion", "prestamo realizad con éxito");
		    } catch (NumberFormatException nfe) {
		        request.setAttribute("mensajeerror", "Datos inválidos para id ejemplar o id socio.");
		    } catch (java.sql.SQLException e) {
		       // e.printStackTrace();
		       // request.setAttribute("mensajeerror", "Operación palida. Error: " + e.getMessage());
		        e.printStackTrace();
		        int code = e.getErrorCode();
		        String text = (e.getMessage() == null) ? "" : e.getMessage();

		        String msg;
		        if (code == 2291) { // ORA-02291: FK violada (dato padre no existe)
		            if (text.contains("FK_PRESTAMO_EJEMPLAR")) {
		                msg = "Código de ejemplar no válido.";                    // (1)
		            } else if (text.contains("FK_PRESTAMO_SOCIO")) {
		                msg = "Código de socio no válido.";                       // (2)
		            } else {
		                msg = "Datos relacionados no válidos.";
		            }
		        } else if (code == 1) { // ORA-00001: UNIQUE/PK violada
		            msg = "Préstamo duplicado.";                                  // (3)
		        } else if (code == 20002) { // tu RAISE_APPLICATION_ERROR(-20002,...)
		            msg = "Socio tiene libros fuera de plazo"; 
		        } else if (code == 20004) { // tu RAISE_APPLICATION_ERROR(-20004,...)
		            msg = "Socio con préstamos pendientes de devolver cuya fecha límite de devolución ha sido superada."; // (4)
		        } else if (code == 20005) {
		            msg = "Socio penalizado cuya fecha de penalización no ha sido superada.";                              // (5)
		        } else if (code == 20006) {
		            msg = "El socio ya tiene prestado un ejemplar del mismo libro.";                                      // (6)
		        } else {
		            msg = "Operación fallida. Error: " + e.getMessage();
		        }

		        request.setAttribute("mensajeerror", msg);
		        request.getRequestDispatcher("admin/prestamo.jsp").forward(request, response);
		        return;
		    }
		     catch (Exception e) {
		        e.printStackTrace();
		        request.setAttribute("mensajeerror", "Error al crear préstamo: " + e.getMessage());
		    }

		    request.getRequestDispatcher("admin/prestamo.jsp").forward(request, response);
		    break;
		}*/

		case "prestamo": {
		    String idejemplarprestamo = request.getParameter("idejemplarprestamo");
		    String idsocioprestamo    = request.getParameter("idsocioprestamo");
		    try {
		        int idejemplar = Integer.parseInt(idejemplarprestamo);
		        int idsociopres = Integer.parseInt(idsocioprestamo);

		        // Fecha de préstamo: hoy
		        java.time.LocalDate hoy = java.time.LocalDate.now();
		        java.sql.Date sqlFechaPrestamo = java.sql.Date.valueOf(hoy);

		        // Fecha límite: 5 días después (ajuste a lunes si fin de semana)
		        java.time.LocalDate fechaDev = hoy.plusDays(5);
		        java.time.DayOfWeek dow = fechaDev.getDayOfWeek();
		        if (dow == java.time.DayOfWeek.SATURDAY) {
		            fechaDev = fechaDev.plusDays(2);
		        } else if (dow == java.time.DayOfWeek.SUNDAY) {
		            fechaDev = fechaDev.plusDays(1);
		        }
		        java.sql.Date sqlFechaDevolucion = java.sql.Date.valueOf(fechaDev);

		        try {
		            DaoPrestamo dao1 = new DaoPrestamo();
		            dao1.insertarPrestamo(idejemplar, idsociopres, sqlFechaPrestamo, sqlFechaDevolucion);
		            request.setAttribute("mensajeconfirmacion", "Operación realizada con éxito");
		        } catch (java.sql.SQLException e) {
		            String text = (e.getMessage() == null) ? "" : e.getMessage();
		            int code = e.getErrorCode();
		            String msg;

		            if (code == 2291) {
		                if (text.contains("FK_PRESTAMO_EJEMPLAR")) {
		                    msg = "Código de ejemplar no válido.";          // Regla 1
		                } else if (text.contains("FK_PRESTAMO_SOCIO")) {
		                    msg = "Código de socio no válido.";             // Regla 2
		                } else {
		                    msg = "Datos relacionados no válidos.";
		                }
		            } else if (code == 1) { // ORA-00001
		                msg = "Préstamo duplicado (el ejemplar ya está prestado)."; // Regla 3
		            } else if (code == 20002) {
		                msg = "Socio con préstamos vencidos pendientes de devolver."; // Regla 4
		            } else if (code == 20001) {
		                msg = "Socio penalizado: no puede realizar préstamos.";       // Regla 5
		            } else if (code == 20000) {
		                msg = "El socio ya tiene en préstamo otro ejemplar de este libro."; // Regla 6
		            } else {
		                msg = "Operación fallida. Error: " + e.getMessage();
		            }

		            request.setAttribute("mensajeerror", msg);
		        }
		    } catch (NumberFormatException nfe) {
		        request.setAttribute("mensajeerror", "Datos inválidos para id ejemplar o id socio.");
		    } catch (Exception ex) {
		        request.setAttribute("mensajeerror", "Error al crear préstamo: " + ex.getMessage());
		    }

		    request.getRequestDispatcher("admin/prestamo.jsp").forward(request, response);
		    break;
		} // ← esta es la ÚNICA llave que cierra el case

			
		
	
		   
	
		case "devolucion": {
		    // Tu JSP envía: <input name="idejemplardevolucion">
		    String idejemplarStr = request.getParameter("idejemplardevolucion");

		    if (idejemplarStr == null || idejemplarStr.isEmpty()) {
		        request.setAttribute("mensajeerror", "Debe indicar el código de ejemplar para registrar la devolución.");
		        request.getRequestDispatcher("admin/devolucion.jsp").forward(request, response);
		        break;
		    }

		    java.sql.Connection conn = null;
		    try {
		        int idejemplar = Integer.parseInt(idejemplarStr.trim());

		        conn = new conexiones.Conexion().getConexion();
		        conn.setAutoCommit(false);

		        // 1) Comprobar que el ejemplar está prestado actualmente
		        boolean prestado;
		        try (java.sql.PreparedStatement ps = conn.prepareStatement(
		            "SELECT 1 FROM PRESTAMO WHERE IDEJEMPLAR=?"
		        )) {
		            ps.setInt(1, idejemplar);
		            try (java.sql.ResultSet rs = ps.executeQuery()) {
		                prestado = rs.next();
		            }
		        }
		        if (!prestado) {
		            request.setAttribute("mensajeerror", "El ejemplar no está actualmente en préstamo.");
		            request.getRequestDispatcher("admin/devolucion.jsp").forward(request, response);
		            break;
		        }

		        // 2) BORRAR de PRESTAMO -> el trigger ANOTARDEVOLUCION insertará en DEVOLUCION
		        //    y aplicará penalización si procede (tabla SOCIOPENALIZADO). :contentReference[oaicite:5]{index=5}
		        int del;
		        try (java.sql.PreparedStatement ps = conn.prepareStatement(
		            "DELETE FROM PRESTAMO WHERE IDEJEMPLAR=?"
		        )) {
		            ps.setInt(1, idejemplar);
		            del = ps.executeUpdate();
		        }

		        if (del == 0) {
		            conn.rollback();
		            request.setAttribute("mensajeerror", "No se pudo dar de baja el préstamo.");
		            request.getRequestDispatcher("admin/devolucion.jsp").forward(request, response);
		            break;
		        }

		        conn.commit();

		        request.setAttribute("mensajeconfirmacion", "Devolución registrada correctamente.");
		        request.getRequestDispatcher("admin/devolucion.jsp").forward(request, response);

		    } catch (NumberFormatException nfe) {
		        if (conn != null) try { conn.rollback(); } catch (Exception ignore) {}
		        request.setAttribute("mensajeerror", "ID de ejemplar inválido. Revise el campo.");
		        request.getRequestDispatcher("admin/devolucion.jsp").forward(request, response);

		    } catch (Exception e) {
		        e.printStackTrace();
		        if (conn != null) try { conn.rollback(); } catch (Exception ignore) {}
		        request.setAttribute("mensajeerror", "Error al registrar la devolución: " + e.getMessage());
		        request.getRequestDispatcher("admin/devolucion.jsp").forward(request, response);

		    } finally {
		        if (conn != null) try { conn.setAutoCommit(true); conn.close(); } catch (Exception ignore) {}
		    }
		    break;
		}


		  /*  
		case "devolucion": 
		    String idejemplarStr = request.getParameter("idejemplar");
		    String idsocioStr    = request.getParameter("idsocio");

		    if (idejemplarStr == null || idsocioStr == null || idejemplarStr.isEmpty() || idsocioStr.isEmpty()) {
		        request.setAttribute("mensaje", "Debe indicar el ID del socio y del ejemplar para registrar la devolución.");
		        request.getRequestDispatcher("admin/devolucion.jsp").forward(request, response);
		        break;
		    }

		    java.sql.Connection conn = null;
		    try {
		        int idejemplar = Integer.parseInt(idejemplarStr.trim());
		        int idsocio1    = Integer.parseInt(idsocioStr.trim());

		        conn = new conexiones.Conexion().getConexion();
		        conn.setAutoCommit(false);

		        // 1) Verificar préstamo ACTIVO para ese socio y ejemplar
		        boolean existeActivo = false;
		        try (java.sql.PreparedStatement ps = conn.prepareStatement(
		            "SELECT COUNT(*) " +
		            "FROM PRESTAMO " +
		            "WHERE IDEJEMPLAR=? AND IDSOCIO=? " +
		            "AND (ESTADO IS NULL OR UPPER(ESTADO) <> 'DEVUELTO')"
		        )) {
		            ps.setInt(1, idejemplar);
		            ps.setInt(2, idsocio1);
		            try (java.sql.ResultSet rs = ps.executeQuery()) {
		                existeActivo = (rs.next() && rs.getInt(1) > 0);
		            }
		        }

		        if (!existeActivo) {
		            request.setAttribute("mensaje", "No existe un préstamo activo con esos datos.");
		            request.getRequestDispatcher("admin/devolucion.jsp").forward(request, response);
		            break;
		        }

		        java.time.LocalDate hoy = java.time.LocalDate.now();

		        // 2) Marcar como devuelto SOLO el préstamo activo
		        int filasPrestamo;
		        try (java.sql.PreparedStatement ps = conn.prepareStatement(
		            "DELETE PRESTAMO " +
		            "SET FECHADEVOLUCIONREAL=?, ESTADO='Devuelto' " +
		            "WHERE IDEJEMPLAR=? AND IDSOCIO=? " +
		            "AND (ESTADO IS NULL OR UPPER(ESTADO) <> 'DEVUELTO')"
		        )) {
		            ps.setDate(1, java.sql.Date.valueOf(hoy));
		            ps.setInt(2, idejemplar);
		            ps.setInt(3, idsocio1);
		            filasPrestamo = ps.executeUpdate();
		        }
		        if (filasPrestamo == 0) {
		            conn.rollback();
		            request.setAttribute("mensaje", "No se pudo actualizar el préstamo (ya estaba devuelto).");
		            request.getRequestDispatcher("admin/devolucion.jsp").forward(request, response);
		            break;
		        }

		        // 3) Poner el ejemplar como disponible
		        int filasEjemplar;
		        try (java.sql.PreparedStatement ps = conn.prepareStatement(
		            "UPDATE EJEMPLAR SET ESTADO='Disponible' WHERE IDEJEMPLAR=?"
		        )) {
		            ps.setInt(1, idejemplar);
		            filasEjemplar = ps.executeUpdate();
		        }
		        if (filasEjemplar == 0) {
		            conn.rollback();
		            request.setAttribute("mensaje", "No se pudo actualizar el estado del ejemplar.");
		            request.getRequestDispatcher("admin/devolucion.jsp").forward(request, response);
		            break;
		        }

		        conn.commit();

		        // Fecha en ISO (yyyy-MM-dd), como al principio
		        request.setAttribute("mensaje", "Devolución registrada correctamente el " + hoy.toString());
		        request.getRequestDispatcher("admin/devolucion.jsp").forward(request, response);

		    } catch (NumberFormatException nfe) {
		        if (conn != null) try { conn.rollback(); } catch (Exception ignore) {}
		        request.setAttribute("mensaje", "IDs inválidos. Revise los campos.");
		        request.getRequestDispatcher("admin/devolucion.jsp").forward(request, response);

		    } catch (Exception e) {
		        e.printStackTrace();
		        if (conn != null) try { conn.rollback(); } catch (Exception ignore) {}
		        request.setAttribute("mensaje", "Error al registrar la devolución: " + e.getMessage());
		        request.getRequestDispatcher("admin/devolucion.jsp").forward(request, response);

		    } finally {
		        if (conn != null) try { conn.setAutoCommit(true); conn.close(); } catch (Exception ignore) {}
		    }
		    break;*/

		    /*
		     * 
		case "devolucion": 
			String idejemplarStr = request.getParameter("idejemplar");
			String idsocioStr = request.getParameter("idsocio");
			
			if (idejemplarStr == null || idsocioStr == null || idejemplarStr.isEmpty() || idsocioStr.isEmpty()) {
			    request.setAttribute("mensaje", "Debe indicar el ID del socio y del ejemplar para registrar la devolución.");
			    request.getRequestDispatcher("admin/devolucion.jsp").forward(request, response);
			    break;
			}
			
			try (java.sql.Connection conn = new conexiones.Conexion().getConexion()) {
			    conn.setAutoCommit(false);
			
			    int idejemplar = Integer.parseInt(idejemplarStr);
			    int idsociodevolucion = Integer.parseInt(idsocioStr);
			
			    // Verificar existencia del préstamo activo
			boolean existe = false;
			try (java.sql.PreparedStatement ps = conn.prepareStatement(
			    "SELECT COUNT(*) FROM PRESTAMO WHERE IDEJEMPLAR=? AND IDSOCIO=? AND (ESTADO IS NULL OR ESTADO <> 'Devuelto')")) {
			    ps.setInt(1, idejemplar);
			    ps.setInt(2, idsociodevolucion);
			    try (java.sql.ResultSet rs = ps.executeQuery()) {
			        if (rs.next() && rs.getInt(1) > 0) existe = true;
			    }
			}
			
			if (!existe) {
			    request.setAttribute("mensaje", "No existe un préstamo activo con esos datos.");
			    request.getRequestDispatcher("admin/devolucion.jsp").forward(request, response);
			    break;
			}
			
			java.time.LocalDate hoy = java.time.LocalDate.now();
			
			// Actualizar préstamo como devuelto
			try (java.sql.PreparedStatement ps = conn.prepareStatement(
			    "UPDATE PRESTAMO SET FECHADEVOLUCIONREAL=?, ESTADO='Devuelto' WHERE IDEJEMPLAR=? AND IDSOCIO=?")) {
			    ps.setDate(1, java.sql.Date.valueOf(hoy));
			    ps.setInt(2, idejemplar);
			    ps.setInt(3, idsociodevolucion);
			    ps.executeUpdate();
			}
			
			// Actualizar estado del ejemplar
			try (java.sql.PreparedStatement ps = conn.prepareStatement(
			    "UPDATE EJEMPLAR SET ESTADO='Disponible' WHERE IDEJEMPLAR=?")) {
			    ps.setInt(1, idejemplar);
			    ps.executeUpdate();
			}
			
			conn.commit();
			
			java.time.format.DateTimeFormatter fmt = java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy");
			request.setAttribute("mensaje", "Devolución registrada correctamente el " + hoy.format(fmt));
			request.getRequestDispatcher("admin/devolucion.jsp").forward(request, response);
			} catch (Exception e) {
			    e.printStackTrace();
			    request.setAttribute("mensaje", "Error al registrar la devolución: " + e.getMessage());
			request.getRequestDispatcher("admin/devolucion.jsp").forward(request, response);
			}
			break;*/
			
         default:
        	 break;
        	/*
			  * case "listarEjemplares": {                  // lista general
			    DaoEjemplar dao = new DaoEjemplar();
			    request.setAttribute("ejemplares", dao.listado());
			    request.getRequestDispatcher("/admin_ejemplares.jsp").forward(request, response);
			    break;
			}
			
			case "listarEjemplaresPorIsbn": {           // lista filtrada por ISBN
			    String isbn = request.getParameter("isbn");
			    DaoEjemplar dao = new DaoEjemplar();
			    request.setAttribute("isbn", isbn);
			    request.setAttribute("ejemplares", dao.listadoPorIsbn(isbn));
			    request.getRequestDispatcher("/admin_ejemplares.jsp").forward(request, response);
			    break;
			}
			
			case "nuevoEjemplar": {                     // muestra la vista con el form de alta
			    request.getRequestDispatcher("/admin_ejemplares.jsp").forward(request, response);
			    break;
			}
			
			        	 */
					}
				}
			
				/**
				 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	//--------------------------------------Ramas nuevas -------------------------------

		/*String operacion= request.getParameter("operacion");
		
		
	
		switch(operacion) {
		case "guardarEjemplar": {
		    try {
		        String isbn = request.getParameter("isbn");
		        Ejemplar e = new Ejemplar();
		        e.setIsbn(isbn);
		        e.setBaja("N");

		        DaoEjemplar dao = new DaoEjemplar();
		        dao.insertEjemplar(e);  // usa S_EJEMPLAR.NEXTVAL (alineada)

		        request.setAttribute("msg", "Ejemplar insertado. ID: " + e.getIdejemplar());
		        // refrescamos lista (si venías con filtro ISBN, lo respetamos)
		        request.setAttribute("isbn", isbn);
		        request.setAttribute("ejemplares", dao.listadoPorIsbn(isbn));
		        request.getRequestDispatcher("/admin_ejemplares.jsp").forward(request, response);

		    } catch (Exception ex) {
		        request.setAttribute("error", "No se pudo insertar: " + ex.getMessage());
		        request.getRequestDispatcher("/admin_ejemplares.jsp").forward(request, response);
		    }
		    break;
		}

		case "bajaEjemplar": {
		    try {
		        int id = Integer.parseInt(request.getParameter("idejemplar"));
		        DaoEjemplar dao = new DaoEjemplar();
		        int filas = dao.marcarBaja(id);
		        request.setAttribute("msg", filas == 1 ? "Ejemplar dado de baja." : "No se pudo dar de baja.");
		        request.setAttribute("ejemplares", dao.listadoEjemplares());
		        request.getRequestDispatcher("/admin_ejemplares.jsp").forward(request, response);
		    } catch (Exception ex) {
		        request.setAttribute("error", ex.getMessage());
		        request.getRequestDispatcher("/admin_ejemplares.jsp").forward(request, response);
		    }
		    break;
		}

		case "altaEjemplar": {
		    try {
		        int id = Integer.parseInt(request.getParameter("idejemplar"));
		        DaoEjemplar dao = new DaoEjemplar();
		        int filas = dao.quitarBaja(id);
		        request.setAttribute("msg", filas == 1 ? "Ejemplar reactivado." : "No se pudo reactivar.");
		        request.setAttribute("ejemplares", dao.listadoEjemplares());
		        request.getRequestDispatcher("/admin_ejemplares.jsp").forward(request, response);
		    } catch (Exception ex) {
		        request.setAttribute("error", ex.getMessage());
		        request.getRequestDispatcher("/admin_ejemplares.jsp").forward(request, response);
		    }
		    break;
		}

		
		}*/
	}

}
