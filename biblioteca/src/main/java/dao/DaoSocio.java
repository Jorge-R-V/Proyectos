 package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.logging.Level;

import com.sun.istack.logging.Logger;

import conexiones.Conexion;
import entidades.Autor;
import entidades.Socio;
import excepciones.BloqueoOptimistaException;

public class DaoSocio {
	
	/*Por qué está así

try-with-resources: cierra automáticamente Connection / PreparedStatement / ResultSet.

S_SOCIO.NEXTVAL: generas el nuevo ID sin carreras (mejor que MAX+1).

VERSION en UPDATE: hace bloqueo optimista (si otra persona cambió el socio, tu UPDATE devolverá 0 y lo sabrás).*/
	
	 // ========== LISTADO DE SOCIO==========
	   public ArrayList<Socio>listadoSocios() throws SQLException,Exception{
	       
	       ArrayList<Socio>listadoSocios=new ArrayList<>();
	       Conexion conexion=new Conexion(); // Creamos un objeto Conexion.
	       Connection con=null; // Objeto para conectar a la bbdd.
	       ResultSet rs = null; // Donde recojo los resultados de la consulta
	       Statement st = null; // Para crear la consulta.
	       try {
	           con=conexion.getConexion(); //Obtenemos el objeto java.sql.Connection
	           st = con.createStatement();// Creamos un objeto Statement 
	           // Un objeto Statement permite ejecutar una sentencia SQL estática
	           // y retornar los resultados que produce
	           String ordenSQL = "SELECT * FROM SOCIO ORDER By NOMBRE"; // sentencia a ejecutar
	           rs = st.executeQuery(ordenSQL);    
	           // el método executeQuery ejecuta la sentencia y devuelve los resultados
	           // en un objeto ResultSet
	           // El objeto ResulSet representa el conjunto de resultados de la consulta
	           // Mantiene un cursor a la fila actual de datos
	           // Inicialmente apunta a la primera fila.
	           // El método next mueve el cursor a la siguiente fila
	           // next() devuelve false cuando ha llegado a la última fila.
	           while (rs.next()) {
	               // Por cada fila obtenida, creamos un objeto autor
	               // que añadimos al ArrayList listadoAutores.
	               Socio miSocio = new Socio();
	               miSocio.setIdsocio(rs.getInt("IDSOCIO"));
	               miSocio.setNombre(rs.getString("NOMBRE"));
	               miSocio.setEmail(rs.getString("EMAIL"));
	               miSocio.setDireccion(rs.getString("DIRECCION"));
	               miSocio.setVersion(rs.getInt("VERSION"));
	               listadoSocios.add(miSocio);
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
	       return listadoSocios; // retornamos el resultado en forma de array
	   }
	   // ========== BUSCAR SOCIO POR EMAIL==========
		public Socio findSocioByEmail (String email)throws SQLException {
				Socio a =null;
				Connection con=null;
				PreparedStatement st=null;
				ResultSet rs = null;
				try {
					Conexion miconex = new Conexion();
					con = miconex.getConexion();
					String ordenSQL = "SELECT IDSOCIO, EMAIL, NOMBRE, DIRECCION, VERSION FROM SOCIO"+
									" WHERE EMAIL=?";
					st = con.prepareStatement(ordenSQL);
							st.setString(1,  email);; // Damos el valor al parámetro posicional. Los parámetros
													// se enumeran secuencialmente comenzando por 1.
							rs = st.executeQuery();	// no se pasa la orden como parámetro porque ya
							if (rs.next()) {		// lo hemos hecho aquí con.preparateStatement(ordenSQL);
								a=new Socio();
								a.setIdsocio(rs.getInt("IDSOCIO"));
								a.setNombre(rs.getString("NOMBRE"));
								a.setEmail(rs.getString("EMAIL"));
								a.setDireccion(rs.getString("DIRECCION"));
								a.setVersion(rs.getInt("VERSION"));
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
			    return a;
			}
		 // ========== BUSCAR SOCIO POR ID ==========
		public Socio findSocioById (int idsocio)throws SQLException {
			Socio a =null;
			Connection con=null;
			PreparedStatement st=null;
			ResultSet rs = null;
			try {
				Conexion miconex = new Conexion();
				con = miconex.getConexion();
				String ordenSQL = "SELECT IDSOCIO, EMAIL, NOMBRE, DIRECCION, VERSION FROM SOCIO"+
								" WHERE IDSOCIO=?";
				st = con.prepareStatement(ordenSQL);
						st.setInt(1,  idsocio);; // Damos el valor al parámetro posicional. Los parámetros
												// se enumeran secuencialmente comenzando por 1.
						rs = st.executeQuery();	// no se pasa la orden como parámetro porque ya
						if (rs.next()) {		// lo hemos hecho aquí con.preparateStatement(ordenSQL);
							a=new Socio();
							a.setIdsocio(rs.getInt("IDSOCIO"));
							a.setNombre(rs.getString("NOMBRE"));
							a.setEmail(rs.getString("EMAIL"));
							a.setDireccion(rs.getString("DIRECCION"));
							a.setVersion(rs.getInt("VERSION"));
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
		    return a;
		}
		// ========== EDITAR SOCIO ==========
		public Socio editarSocio(int idsocio) throws SQLException {
		    // Reutilizamos findSocioById, pero lo aislamos para mantener estructura similar a ControllerAdmin
		    return findSocioById(idsocio);
		}



		
	/*	public void insertaSocio(Socio socio) throws SQLException {
	        Connection con = null;
	        PreparedStatement st = null;

	        try {
	            Conexion miconex = new Conexion();
	            con = miconex.getConexion();

	            String ordenSQL = "INSERT INTO SOCIO (IDSOCIO, NOMBRE, EMAIL, DIRECCION) SELECT MAX (IDSOCIO) +1, ?, ? FROM SOCIO";
	            st = con.prepareStatement(ordenSQL);

	            st.setString(1, socio.getNombre());
	            st.setString(2, socio.getEmail());
	            st.setString(3, socio.getDireccion());

	            st.executeUpdate();
	            

	        } catch (SQLException se) {
	            throw se;
	        } finally {
	            if (st != null)
	                st.close();
	            if (con != null)
	                con.close();
	        }
	    }*/
		
		 // ==========INSERTAR ==========
	    public int insertSocio(Socio s) throws SQLException {
	        String sql = "INSERT INTO SOCIO (IDSOCIO, EMAIL, NOMBRE, DIRECCION, VERSION) " +
	                     "VALUES (S_SOCIO.NEXTVAL, ?, ?, ?, 0)";

	        try (Connection con = new Conexion().getConexion();
	             PreparedStatement ps = con.prepareStatement(sql)) {

	            ps.setString(1, s.getEmail());
	            ps.setString(2, s.getNombre());
	            ps.setString(3, s.getDireccion());

	            return ps.executeUpdate();
	        }
	    }
	    // ========== DELETE ==========
	    public int deleteSocio(int idSocio) throws SQLException {
	        String sql = "DELETE FROM SOCIO WHERE IDSOCIO=?";

	        try (Connection con = new Conexion().getConexion();
	             PreparedStatement ps = con.prepareStatement(sql)) {

	            ps.setInt(1, idSocio);
	            return ps.executeUpdate();
	        }
	    }
		
		/**
		 * 
		 * @param s : Socio a modificar. Ya viene con los datos actualizados
		 * @return El número de socios modificados. Uno si ha tenido éxito, 0 si no se cambia
		 * @throws SQLException
		 * @throws Exception
		 * 
		 * Los ? son parámetros posicionales
		 */
	   
	    // ========== ACTUALIZA  ==========
		public int updateSocio(Socio s) throws SQLException, Exception {
		int socioactualizado = 0;
		Connection con = null;
		PreparedStatement pst = null;  
		ResultSet rs = null;
		Socio socioconfirmado=null;
		try {
			Conexion miconex = new Conexion();
			con = miconex.getConexion();
			con.setAutoCommit(false);  // no hay commit automático. Hay que usar el método java.sql.Connection.commit();
			// Primero bloquear la fila antes del UPDATE
			
			// Antes de modificar el socio que me mandan por parámetro, lo busco y lo bloqueo para que nadie lo pueda cambiar
			
			PreparedStatement stbuscarsocioybloquear = 
					con.prepareStatement("SELECT * " + "FROM SOCIO WHERE IDSOCIO = ? "+
														"FOR UPDATE WAIT 3");
				stbuscarsocioybloquear.setLong(1,  s.getIdsocio());
				ResultSet rsbuscarsocioybloquear = stbuscarsocioybloquear.executeQuery();
				//Fin de control de fila bloqueada, si llego aquí, el registro a cambiar no está bloqueado y yo lo bloqueo -> select for update
				
				//		String ordensqladeshacer =
				//		"INSERT INTO AUTOR(IDAUTOR, NOMBRE, FECHANACIMIENTO) " +
				//			"VALUES(S_AUTOR.NEXTVAL,'Autor de Prueba', SYSDATE)";
				// rbs=con.prepareStatement( ordensqladeshacer);
				// rbs.executeUpdate();
				
				// Thread.sleep(10000); Para probar wait 3
				if(rsbuscarsocioybloquear.next()) {
					socioconfirmado=new Socio();
					socioconfirmado.setVersion(rsbuscarsocioybloquear.getInt("VERSION"));
					stbuscarsocioybloquear.close();
				}
				if(s.getVersion() != socioconfirmado.getVersion())
					throw new BloqueoOptimistaException("Los datos del socio cambiaron mientras estaba conectado");
				con.commit();
				
					
			String ordenSQL = "UPDATE SOCIO SET NOMBRE=?, DIRECCION=?, VERSION=VERSION+1 "+"WHERE IDSOCIO=? AND VERSION=?";
				
			// String ordenSQL = "UPDATE SOCIO SET NOMBRE=?,DIRECCION=?,VERSION=VERSION+1 WHERE IDSOCIO=?";
			
			pst = con.prepareStatement(ordenSQL);
			pst.setString(1,  s.getNombre());; 
			pst.setString(2, s.getDireccion());	
			pst.setLong(3, s.getIdsocio());
			pst.setInt(4,  s.getVersion());
			socioactualizado = pst.executeUpdate();
			if(socioactualizado !=1)
				throw new BloqueoOptimistaException("Los datos del socio cambiaron desde su luctura, para prevenir pérdida de información, inicie el proceso");
			con.commit();
			//Error frecuente socioactualizado=sentencia.executeUpdate(ordenSQL);
			
		} catch (BloqueoOptimistaException be) {
			con.rollback();
			throw be;
		} catch (SQLException se) {
			con.rollback();
			Logger logger=Logger.getLogger(DaoSocio.class.getName(), null);
			logger.log(Level.INFO, "Código de error: " + se.getErrorCode());
			throw se;
		} finally {
	        if(rs!=null)
	            rs.close();
	        if(pst!=null)
	            pst.close();
	        if(con!=null)
	            con.close();
	    }
		return socioactualizado;
	}
		 // ========== UPDATE (bloqueo optimista) ==========
		 /* public int updateSocio(Socio s) throws SQLException {
		        String sql =
		            "UPDATE SOCIO " +
		            "   SET NOMBRE = ?, " +
		            "       DIRECCION = ?, " +
		            "       VERSION = VERSION + 1 " +
		            " WHERE IDSOCIO = ? " +
		            "   AND VERSION = ?";

		        try (Connection con = new Conexion().getConexion();
		             PreparedStatement ps = con.prepareStatement(sql)) {

		            ps.setString(1, s.getNombre());
		            ps.setString(2, s.getDireccion());
		            ps.setInt(3, s.getIdSocio());
		            ps.setInt(4, s.getVersion());

		            return ps.executeUpdate(); // 1 = OK, 0 = conflicto de versión
		        }
		    }*/
		 // ==========LISTADO DE MOROSOS==========
			public ArrayList<Socio>listadoMorosos() throws SQLException{
			       
			       ArrayList<Socio>listadoMorosos=new ArrayList<>();
			       Conexion conexion=new Conexion();
			       Connection con=null;
			       ResultSet rs = null;
			       Statement st = null;
			       try {
			           con=conexion.getConexion();
			           st = con.createStatement();
			           String ordenSQL = "SELECT DISTINCT S.NOMBRE, S.IDSOCIO "
			           		+ "FROM PRESTAMO P, SOCIO S "
			           		+ "WHERE P.IDSOCIO=S.IDSOCIO "
			           		+ "AND FECHALIMITEDEVOLUCION - SYSDATE < 0";
			           rs = st.executeQuery(ordenSQL);    
			   
			           while (rs.next()) {
			               Socio miMoroso = new Socio();
			               miMoroso.setIdsocio(rs.getInt("IDSOCIO"));
			               miMoroso.setNombre(rs.getString("NOMBRE"));
			               listadoMorosos.add(miMoroso);
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
			       return listadoMorosos;
			       
			   }
		

			    // --------------------------------------------------
			    // 1) TOTAL DE SOCIOS (para paginación)
			    // --------------------------------------------------
			    public int countSocios() throws SQLException {
			        int total = 0;
			        String sql = "SELECT COUNT(*) FROM SOCIO";

			        try (Connection cn = new Conexion().getConexion();
			             PreparedStatement ps = cn.prepareStatement(sql);
			             ResultSet rs = ps.executeQuery()) {

			            if (rs.next()) {
			                total = rs.getInt(1);
			            }
			        }
			        return total;
			    }
			    // ====== BUSCAR POR NOMBRE (ADAPTADO) ======
			    public ArrayList<Socio> buscarPorNombre(String nombreParcial) throws SQLException {
			        ArrayList<Socio> lista = new ArrayList<>();
			        
			        String sql =
			            "SELECT IDSOCIO, NOMBRE, DIRECCION, EMAIL " +
			            "FROM SOCIO " +
			            "WHERE UPPER(NOMBRE) LIKE UPPER(?) " +
			            "ORDER BY NOMBRE";

			        try (Connection cn = new Conexion().getConexion();
			             PreparedStatement ps = cn.prepareStatement(sql)) {

			            // búsqueda "contiene": %patron%
			            ps.setString(1, "%" + nombreParcial + "%");

			            try (ResultSet rs = ps.executeQuery()) {
			                while (rs.next()) {
			                    Socio s = new Socio();
			                    s.setIdsocio(rs.getInt("IDSOCIO"));
			                    s.setNombre(rs.getString("NOMBRE"));
			                    s.setDireccion(rs.getString("DIRECCION"));
			                    s.setEmail(rs.getString("EMAIL"));
			                    lista.add(s);
			                }
			            }
			        }
			        return lista; // nunca null
			        
			    }
			    // ====== BUSCAR POR NOMBRE (ADAPTADO2) ======muestra todos los socios
			    /*public ArrayList<Socio> buscarPorNombre(String nombreParcial) throws SQLException {
			        ArrayList<Socio> lista = new ArrayList<>();

			        String base =
			            "SELECT IDSOCIO, NOMBRE, DIRECCION, EMAIL " +
			            "FROM SOCIO ";

			        boolean hayFiltro = (nombreParcial != null && !nombreParcial.trim().isEmpty());

			        String sql = hayFiltro
			            ? base + "WHERE UPPER(NOMBRE) LIKE UPPER(?) ORDER BY NOMBRE"
			            : base + "ORDER BY NOMBRE";

			        try (Connection cn = new Conexion().getConexion();
			             PreparedStatement ps = cn.prepareStatement(sql)) {

			            if (hayFiltro) {
			                ps.setString(1, "%" + nombreParcial.trim() + "%");
			            }

			            try (ResultSet rs = ps.executeQuery()) {
			                while (rs.next()) {
			                    Socio s = new Socio();
			                    s.setIdsocio(rs.getInt("IDSOCIO"));
			                    s.setNombre(rs.getString("NOMBRE"));
			                    s.setDireccion(rs.getString("DIRECCION"));
			                    s.setEmail(rs.getString("EMAIL"));
			                    lista.add(s);
			                }
			            }
			        }

			        return lista;
			    }*/


			    // --------------------------------------------------
			    // 2) LISTADO PAGINADO DE SOCIOS
			    // --------------------------------------------------
			   public ArrayList<Socio> listadoSocios(int pagina, int numregpag) throws SQLException {
			        ArrayList<Socio> lista = new ArrayList<>();

			        int limiteInferior = (pagina * numregpag) + 1;
			        int limiteSuperior = (pagina * numregpag) + numregpag;

			        String sql = """
			            SELECT FILA, IDSOCIO, EMAIL, NOMBRE, DIRECCION
			            FROM (
			              SELECT ROWNUM FILA, IDSOCIO, EMAIL, NOMBRE, DIRECCION
			              FROM (
			                SELECT IDSOCIO, EMAIL, NOMBRE, DIRECCION
			                FROM SOCIO
			                ORDER BY NOMBRE
			              )
			            )
			            WHERE FILA >= ? AND FILA <= ?
			            """;

			        try (Connection cn = new Conexion().getConexion();
			             PreparedStatement ps = cn.prepareStatement(sql)) {

			            ps.setInt(1, limiteInferior);
			            ps.setInt(2, limiteSuperior);

			            try (ResultSet rs = ps.executeQuery()) {
			                while (rs.next()) {
			                    Socio s = new Socio();
			                    s.setIdsocio(rs.getInt("IDSOCIO"));
			                    s.setEmail(rs.getString("EMAIL"));
			                    s.setNombre(rs.getString("NOMBRE"));
			                    s.setDireccion(rs.getString("DIRECCION"));
			                    lista.add(s);
			                }
			            }
			        }

			        return lista;
			    }
			}



 /* package dao;

import conexiones.Conexion;
import entidades.Socio;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * DAO de acceso a la tabla SOCIO.
 * Reglas:
 *  - Cierra SIEMPRE recursos (try-with-resources).
 *  - Lanza SQLException para que el Servlet/Tests decidan cómo tratar el error.
 */ 
/*
public class DaoSocio {

    // ========== LISTADO ==========
    public List<Socio> listadoSocios() throws SQLException {
        String sql = "SELECT IDSOCIO, EMAIL, NOMBRE, DIRECCION, VERSION " +
                     "FROM SOCIO ORDER BY NOMBRE";
        List<Socio> lista = new ArrayList<>();

        try (Connection con = new Conexion().getConexion();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Socio s = new Socio();
                s.setIdSocio(rs.getInt("IDSOCIO"));
                s.setEmail(rs.getString("EMAIL"));
                s.setNombre(rs.getString("NOMBRE"));
                s.setDireccion(rs.getString("DIRECCION"));
                s.setVersion(rs.getInt("VERSION"));
                lista.add(s);
            }
        }
        return lista;
    }

    // ========== FIND BY ID ==========
    public Socio findSocioById(int idSocio) throws SQLException {
        String sql = "SELECT IDSOCIO, EMAIL, NOMBRE, DIRECCION, VERSION " +
                     "FROM SOCIO WHERE IDSOCIO=?";
        Socio s = null;

        try (Connection con = new Conexion().getConexion();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, idSocio);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    s = new Socio();
                    s.setIdSocio(rs.getInt("IDSOCIO"));
                    s.setEmail(rs.getString("EMAIL"));
                    s.setNombre(rs.getString("NOMBRE"));
                    s.setDireccion(rs.getString("DIRECCION"));
                    s.setVersion(rs.getInt("VERSION"));
                }
            }
        }
        return s;
    }

    // ========== FIND BY EMAIL ==========
    public Socio findSocioByEmail(String email) throws SQLException {
        String sql = "SELECT IDSOCIO, EMAIL, NOMBRE, DIRECCION, VERSION " +
                     "FROM SOCIO WHERE EMAIL=?";
        Socio s = null;

        try (Connection con = new Conexion().getConexion();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, email);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    s = new Socio();
                    s.setIdSocio(rs.getInt("IDSOCIO"));
                    s.setEmail(rs.getString("EMAIL"));
                    s.setNombre(rs.getString("NOMBRE"));
                    s.setDireccion(rs.getString("DIRECCION"));
                    s.setVersion(rs.getInt("VERSION"));
                }
            }
        }
        return s;
    }

    // ========== INSERT ==========
    /**
     * Inserta un socio. Usa S_SOCIO.NEXTVAL para el IDSOCIO.
     * @return filas afectadas (1 si ok)
     */
/*
    public int insertSocio(Socio s) throws SQLException {
        String sql = "INSERT INTO SOCIO (IDSOCIO, EMAIL, NOMBRE, DIRECCION, VERSION) " +
                     "VALUES (S_SOCIO.NEXTVAL, ?, ?, ?, 0)";

        try (Connection con = new Conexion().getConexion();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, s.getEmail());
            ps.setString(2, s.getNombre());
            ps.setString(3, s.getDireccion());

            return ps.executeUpdate();
        }
    }

  
    /**
     * Actualiza nombre/dirección usando la columna VERSION para evitar pisar cambios.
     * Devuelve 1 si actualiza; 0 si la VERSION ya cambió (otro usuario tocó el registro).
     */
/*
  

    // ========== DELETE ==========
    public int deleteSocio(int idSocio) throws SQLException {
        String sql = "DELETE FROM SOCIO WHERE IDSOCIO=?";

        try (Connection con = new Conexion().getConexion();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, idSocio);
            return ps.executeUpdate();
        }
    }
}*/

