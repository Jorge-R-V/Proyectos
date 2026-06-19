package dao;


import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.util.ArrayList;
import static java.time.temporal.ChronoUnit.DAYS;

import conexiones.Conexion;
import entidades.Ejemplar;
import entidades.Prestamo;
import excepciones.PrestamoException;


public class DaoPrestamo {
	
	public DaoPrestamo() {
		
	}
	
	/**
    *
    * @return Devuelve un ArrayList de objetos prestamo con los prestamos realizados
    * hay actualmente en la tabla PRESTAMO de nuestra base de datos.
    * @throws SQLException: Cualquier error en el acceso o en la ejecución
    */
	 

	public ArrayList<Prestamo>listadoPrestamos() throws SQLException{
	       
	       ArrayList<Prestamo>listadoPrestamos=new ArrayList<>();
	       Conexion conexion=new Conexion(); // Creamos un objeto Conexion.
	       Connection con=null; // Objeto para conectar a la bbdd.
	       ResultSet rs = null; // Donde recojo los resultados de la consulta
	       Statement st = null; // Para crear la consulta.
	       try {
	           con=conexion.getConexion(); //Obtenemos el objeto java.sql.Connection
	           st = con.createStatement();// Creamos un objeto Statement
	           String ordenSQL = "SELECT * FROM PRESTAMO ORDER By IDSOCIO"; // sentencia a ejecutar
	           rs = st.executeQuery(ordenSQL);    
	           while (rs.next()) {
	               // Por cada fila obtenida, creamos un objeto autor
	               // que añadimos al ArrayList listadoAutores.
	               Prestamo miPrestamo = new Prestamo();
	               miPrestamo.setIdejemplar(rs.getInt("IDEJEMPLAR"));
	               miPrestamo.setIdsocio(rs.getInt("IDSOCIO"));
	               miPrestamo.setFechaprestamo(rs.getDate("FECHAPRESTAMO"));
	               miPrestamo.setFechalimitedevolucion(rs.getDate("FECHALIMITEDEVOLUCION"));
	               listadoPrestamos.add(miPrestamo);
	           }            
	       } catch (SQLException e) {
	           //e.printStackTrace();
	           throw e;
	       } catch (Exception ex) {
	           //ex.printStackTrace();
	           throw ex;
	       }
	       finally {
	           // liberamos los recursos en un finally para asegurarnos que se cierra
	           // todo lo abierto
	           if(rs!=null)
	               rs.close();
	           if(st!=null)
	               st.close();
	           if(con!=null)
	               con.close();
	       }
	       return listadoPrestamos; // retornamos el resultado en forma de array
	   }

	public ArrayList<Prestamo>listadoLibrosMoroso(int idsocio) throws SQLException{
	       
	       ArrayList<Prestamo>listadoLibrosMorosos=new ArrayList<>();
	       Conexion conexion=new Conexion();
	       Connection con=null;
	       ResultSet rs = null;
	       Statement st = null;
	       try {
	           con=conexion.getConexion();
	           
	           String ordenSQL = "SELECT IDSOCIO,FECHAPRESTAMO,TITULO,DIAS_DEMORA "
	           		+ "FROM "
	           		+ "(SELECT P.IDEJEMPLAR,P.IDSOCIO,S.NOMBRE,L.TITULO,FECHAPRESTAMO, "
	           		+ "(TRUNC(SYSDATE)-TRUNC(FECHALIMITEDEVOLUCION))DIAS_DEMORA "
	           		+ "FROM SOCIO S, PRESTAMO P, EJEMPLAR E, LIBRO L "
	           		+ "WHERE S.IDSOCIO=P.IDSOCIO "
	           		+ "AND P.IDEJEMPLAR=E.IDEJEMPLAR "
	           		+ "AND E.ISBN=L.ISBN "
	           		+ "AND TRUNC(FECHALIMITEDEVOLUCION)<TRUNC(SYSDATE)) "
	           		+ "WHERE IDSOCIO=?";
	        
	           PreparedStatement ps = con.prepareStatement(ordenSQL);
	           
	           ps.setInt(1,  idsocio);
	           
	           rs=ps.executeQuery();
	   
	           while (rs.next()) {
	               Prestamo miPrestamo = new Prestamo();
	               miPrestamo.setIdsocio(rs.getInt("IDSOCIO"));
	               miPrestamo.setTitulo(rs.getString("TITULO"));
	               miPrestamo.setDiasdemora(rs.getInt("DIAS_DEMORA"));
	               miPrestamo.setFechaprestamo(rs.getDate("FECHAPRESTAMO"));
	               listadoLibrosMorosos.add(miPrestamo);
	           }            
	       } catch (SQLException e) {
	           throw e;
	       } catch (Exception ex) {
	           throw ex;
	       }
	       finally {
	           if(rs!=null)
	               rs.close();
	           if(st!=null)
	               st.close();
	           if(con!=null)
	               con.close();
	       }
	       return listadoLibrosMorosos;
	   }/*
	public void devolucionPrestamo(int idejemplar) throws PrestamoException,SQLException {
		String ordenSQL;
		Connection con=null;
		PreparedStatement pst=null;
		ResultSet rs = null;
		Conexion conexion = new Conexion();
		Prestamo prestamo=null;
		DaoEjemplar daoejemplar = new DaoEjemplar();
		
		try { 
			Ejemplar ejemplar=daoejemplar.findEjemplarById(idejemplar);
			if (ejemplar==null)
				throw new PrestamoException("Ejemplar no existente o dado de baja");
			prestamo=findPrestamoById(idejemplar);
			if(prestamo==null)
				throw new PrestamoException("Ejemplar indicado no esta en prestamo");
	
	//si el prestamo se devuelve fuera de plazo penalizar al socio 15 dias.
	//Me queda:
	//para ello se incrementa en 15 dias si ya esta penalizado.
	//Si devuelve mas de 1 libro a la vez, solo que te sume 15(si hay penalizado hoy, no se penaliza mas)
			con=conexion.getConexion();
			con.setAutoCommit(false);
			LocalDateTime ldfechalimitedevolucion = prestamo.getLdfechalimitedevolucion();
			if(ldfechalimitedevolucion.isBefore(LocalDateTime.now())) {
				
				int idsocio = prestamo.getIdsocio();
				//penalizar socio
				ordenSQL= "SELECT LIMITEPENALIZACION FROM SOCIOPENALIZADO WHERE IDSOCIO=?";
				pst =con.prepareStatement(ordenSQL);
				pst.setInt(1, idsocio);
				rs = pst.executeQuery();
				
				if(rs.next()) {
					ordenSQL= "UPDATE SOCIOPENALIZADO SET LIMITEPENALIZACION = LIMITEPENALIZACION - 15 " +
							"WHERE IDSOCIO =?";
					pst = con.prepareStatement(ordenSQL);
					pst.setInt(1, idsocio);
					pst.executeUpdate();
					System.out.println("Se aplican cargos por devolucion tardia.");
				} else {
					ordenSQL= "INSERT INTO SOCIOPENALIZADO (IDSOCIO,LIMITEPENALIZACION) " +
							"VALUES (?,SYSDATE+15)";
					pst = con.prepareStatement(ordenSQL);
					pst.setInt(1, idsocio);
					pst.executeUpdate();
				}
				
				
				
				
			}
			
		} catch (SQLException e) {
	           //e.printStackTrace();
	           throw e;
	       } catch (Exception ex) {
	           //ex.printStackTrace();
	           throw ex;
	       }
	       finally {
	           // liberamos los recursos en un finally para asegurarnos que se cierra
	           // todo lo abierto
	           if(rs!=null)
	               rs.close();
	           if(pst!=null)
	               pst.close();
	           if(con!=null)
	               con.close();
	       }
	       return;

	}*/
	public void devolucionPrestamo(int idejemplar) throws PrestamoException, SQLException {
	    Conexion conexion = new Conexion();
	    DaoEjemplar daoEjemplar = new DaoEjemplar();

	    // 1) Validaciones previas fuera de la transacción pesada
	    Ejemplar ejemplar = daoEjemplar.findEjemplarById(idejemplar);
	    if (ejemplar == null) {
	        throw new PrestamoException("Ejemplar no existente o dado de baja");
	    }

	    try (Connection con = conexion.getConexion()) {
	        con.setAutoCommit(false);

	        // 2) Buscar préstamo ACTIVO del ejemplar
	        Integer idPrestamo = null;
	        Integer idSocio = null;
	        java.sql.Timestamp fechaLimite = null;

	        final String sqlPrestamoActivo = """
	            SELECT IDPRESTAMO, IDSOCIO, FECHALIMITEDEVOLUCION
	            FROM PRESTAMO
	            WHERE IDEJEMPLAR = ? 
	              AND (ESTADO IS NULL OR UPPER(ESTADO) <> 'DEVUELTO')
	            FOR UPDATE
	        """;
	        try (PreparedStatement ps = con.prepareStatement(sqlPrestamoActivo)) {
	            ps.setInt(1, idejemplar);
	            try (ResultSet rs = ps.executeQuery()) {
	                if (rs.next()) {
	                    idPrestamo = rs.getInt("IDPRESTAMO");
	                    idSocio = rs.getInt("IDSOCIO");
	                    fechaLimite = rs.getTimestamp("FECHALIMITEDEVOLUCION");
	                }
	            }
	        }

	        if (idPrestamo == null) {
	            con.rollback();
	            throw new PrestamoException("Ejemplar indicado no está en préstamo");
	        }

	        // 3) Marcar préstamo devuelto hoy y liberar ejemplar
	        final java.sql.Date hoySql = java.sql.Date.valueOf(java.time.LocalDate.now());

	        final String sqlUpdatePrestamo = """
	            UPDATE PRESTAMO
	               SET FECHADEVOLUCIONREAL = ?, ESTADO = 'Devuelto'
	             WHERE IDPRESTAMO = ?
	        """;
	        try (PreparedStatement ps = con.prepareStatement(sqlUpdatePrestamo)) {
	            ps.setDate(1, hoySql);
	            ps.setInt(2, idPrestamo);
	            ps.executeUpdate();
	        }

	        final String sqlEjemplarDisponible = "UPDATE EJEMPLAR SET ESTADO = 'Disponible' WHERE IDEJEMPLAR = ?";
	        try (PreparedStatement ps = con.prepareStatement(sqlEjemplarDisponible)) {
	            ps.setInt(1, idejemplar);
	            ps.executeUpdate();
	        }

	        // 4) Penalización si devuelve fuera de plazo
	        boolean fueraDePlazo = false;
	        if (fechaLimite != null) {
	            java.time.LocalDateTime limite = fechaLimite.toLocalDateTime();
	            fueraDePlazo = limite.isBefore(java.time.LocalDateTime.now());
	        }

	        if (fueraDePlazo) {
	            // Si ya penalizado, extender desde el mayor entre hoy y el límite actual.
	            // Así evitamos sumar 15 días varias veces si devuelve varios libros el mismo día.
	            // Estructura: tabla SOCIOPENALIZADO(IDSOCIO, LIMITEPENALIZACION DATE)
	            final String sqlSelectPen = "SELECT LIMITEPENALIZACION FROM SOCIOPENALIZADO WHERE IDSOCIO = ? FOR UPDATE";
	            java.sql.Date limiteActual = null;

	            try (PreparedStatement ps = con.prepareStatement(sqlSelectPen)) {
	                ps.setInt(1, idSocio);
	                try (ResultSet rs = ps.executeQuery()) {
	                    if (rs.next()) {
	                        limiteActual = rs.getDate(1);
	                    }
	                }
	            }

	            // Calcular nuevo límite: GREATEST(TRUNC(hoy), TRUNC(limiteActual)) + 15
	            if (limiteActual == null) {
	                final String sqlInsertPen = "INSERT INTO SOCIOPENALIZADO (IDSOCIO, LIMITEPENALIZACION) VALUES (?, TRUNC(SYSDATE) + 15)";
	                try (PreparedStatement ps = con.prepareStatement(sqlInsertPen)) {
	                    ps.setInt(1, idSocio);
	                    ps.executeUpdate();
	                }
	            } else {
	                final String sqlUpdatePen = """
	                    UPDATE SOCIOPENALIZADO
	                       SET LIMITEPENALIZACION = GREATEST(TRUNC(SYSDATE), TRUNC(LIMITEPENALIZACION)) + 15
	                     WHERE IDSOCIO = ?
	                """;
	                try (PreparedStatement ps = con.prepareStatement(sqlUpdatePen)) {
	                    ps.setInt(1, idSocio);
	                    ps.executeUpdate();
	                }
	            }
	        }

	        con.commit();
	    } catch (SQLException e) {
	        throw e;
	    } catch (Exception ex) {
	        // Reempaqueta según tu jerarquía si quieres
	        throw ex;
	    }
	}


	public Prestamo findPrestamoById (int idejemplar)throws SQLException {
		Prestamo prestamo =null;
		Connection con=null;
		PreparedStatement st=null;
		ResultSet rs = null;
		try {
			Conexion miconex = new Conexion();
			con = miconex.getConexion();
			String ordenSQL = "SELECT IDEJEMPLAR, IDSOCIO, FECHAPRESTAMO, FECHALIMITEDEVOLUCION FROM PRESTAMO"+
							" WHERE IDEJEMPLAR=?";
			st = con.prepareStatement(ordenSQL);
					st.setInt(1,  idejemplar);;
					rs = st.executeQuery();
					if (rs.next()) {
						prestamo=new Prestamo();
						prestamo.setIdejemplar(rs.getInt("IDEJEMPLAR"));
						prestamo.setIdsocio(rs.getInt("IDSOCIO"));
						prestamo.setFechaprestamo(rs.getDate("FECHAPRESTAMO"));
						prestamo.setFechalimitedevolucion(rs.getDate("FECHALIMITEDEVOLUCION"));
						
						prestamo.setLdfechaprestamo(rs.getObject("FECHAPRESTAMO", LocalDateTime.class));
						prestamo.setLdfechalimitedevolucion(rs.getObject("FECHALIMITEDEVOLUCION", LocalDateTime.class));
						
						if(LocalDateTime.now().isAfter(prestamo.getLdfechalimitedevolucion()))
								prestamo.setDiasdemora(
										(int) DAYS.between(prestamo.getLdfechalimitedevolucion(), LocalDateTime.now()));
					}
		} catch (SQLException se) {
		throw se;
		} finally {
	        if(rs!=null)
	            rs.close();
	        if(st!=null)
	            st.close();
	        if(con!=null)
	            con.close();
	    }
	    return prestamo;
	}
	public Prestamo insertarPrestamo(int idejemplar, int idsociopres, Date fechaPrestamo, Date fechaDevolucion) throws SQLException {
		Prestamo prestamo =null;
		Connection con=null;
        PreparedStatement pst = null;
        try {
        	Conexion miconex = new Conexion();
            con = miconex.getConexion();
            String ordenSQL = "INSERT INTO PRESTAMO (IDEJEMPLAR, IDSOCIO, FECHAPRESTAMO, FECHALIMITEDEVOLUCION) VALUES (?, ?, ?, ?)";
            pst = con.prepareStatement(ordenSQL);
            pst.setInt(1, idejemplar);
            pst.setInt(2, idsociopres);
            pst.setDate(3, fechaPrestamo);
            pst.setDate(4, fechaDevolucion);
            
            pst.executeUpdate();
            try {
				pst.setInt(1, idejemplar);
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
            
            
        } finally {
            if (pst != null)
                pst.close();
            if (con != null)
                con.close();
        }
		return prestamo;
	}
}
