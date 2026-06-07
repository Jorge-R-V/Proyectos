package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

import conexiones.Conexion;
import entidades.Autor;

public class DaoAutor {
	/**
    *
    * @return Devuelve un ArrayList de objetos autor con los autores
    * hay actualmente en la tabla AUTOR de nuestra base de datos.
    * @throws SQLException: Cualquier error en el acceso o en la ejecución
    */
   public ArrayList<Autor>listadoAutores() throws SQLException,Exception{
       
       ArrayList<Autor>listadoAutores=new ArrayList<>();
       Conexion conexion=new Conexion(); // Creamos un objeto Conexion y obtiene una conexxion
       Connection con=null; // Objeto para conectar a la bbdd.
       ResultSet rs = null; // Donde recojo los resultados de la consulta, ResultSet es como un cursor que avanza fila por fila.
       Statement st = null; // Para crear la consulta. define la sentencia sql, Statement se usa cuando no hay parámetros variables (la consulta es fija).
       try {
           con=conexion.getConexion(); //Obtenemos el objeto java.sql.Connection
           st = con.createStatement();// Creamos un objeto Statement
           // Un objeto Statement permite ejecutar una sentencia SQL estática
           // y retornar los resultados que produce
           String ordenSQL = "SELECT * FROM AUTOR ORDER By NOMBRE"; // sentencia a ejecutar
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
               Autor miAutor = new Autor();
               miAutor.setIdautor(rs.getInt("IDAUTOR"));
               miAutor.setNombre(rs.getString("NOMBRE"));
               miAutor.setFechanacimiento(rs.getDate("FECHANACIMIENTO"));
               listadoAutores.add(miAutor);
            
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
           // todo lo abierto, finally: garantiza liberar recursos aunque haya error.
           if(rs!=null)
               rs.close();
           if(st!=null)
               st.close();
           if(con!=null)
               con.close();
       }
    
       return listadoAutores; // retornamos el resultado en forma de array
   }

	public Autor findAutorById (int idautor)throws SQLException {
			Autor a =null;
			Connection con=null;
			PreparedStatement st=null;
			ResultSet rs = null;
			try {
				Conexion miconex = new Conexion();
				con = miconex.getConexion();
				String ordenSQL = "SELECT IDAUTOR, NOMBRE, FECHANACIMIENTO FROM AUTOR"+
								" WHERE IDAUTOR=?";
				st = con.prepareStatement(ordenSQL);
						st.setInt(1,  idautor);; // Damos el valor al parámetro posicional. Los parámetros
												// se enumeran secuencialmente comenzando por 1.
						rs = st.executeQuery();	// no se pasa la orden como parámetro porque ya
						if (rs.next()) {		// lo hemos hecho aquí con.preparateStatement(ordenSQL);
							a=new Autor();
							a.setIdautor(rs.getInt("IDAUTOR"));
							a.setNombre(rs.getString("NOMBRE"));
							a.setFechanacimiento(rs.getDate("FECHANACIMIENTO"));
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
	public void insertaAutor(Autor autor) throws SQLException {
        Connection con = null;
        PreparedStatement st = null;

        try {
            Conexion miconex = new Conexion();
            con = miconex.getConexion();

            String ordenSQL = "INSERT INTO AUTOR (IDAUTOR, NOMBRE, FECHANACIMIENTO) SELECT MAX (IDAUTOR) +1, ?, ? FROM AUTOR";
            st = con.prepareStatement(ordenSQL);

            st.setString(1, autor.getNombre());
            st.setDate(2, new java.sql.Date(autor.getFechanacimiento().getTime()));

            st.executeUpdate();
            

        } catch (SQLException se) {
            throw se;
        } finally {
            if (st != null)
                st.close();
            if (con != null)
                con.close();
        }
	}
     // ========== UPDATE ==========
        /**
         * Actualiza nombre y fecha de nacimiento del autor indicado por id.
         * @param autor Objeto Autor con id, nombre y fecha rellenos.
         * @return filas afectadas (1 si se actualizó, 0 si no existía ese ID)
         */
        public int updateAutor(Autor autor) throws SQLException {
            Connection con = null;
            PreparedStatement st = null;
            try {
                Conexion miconex = new Conexion();
                con = miconex.getConexion();

                String ordenSQL = "UPDATE AUTOR " +
                                  "   SET NOMBRE = ?, FECHANACIMIENTO = ? " +
                                  " WHERE IDAUTOR = ?";
                st = con.prepareStatement(ordenSQL);
                st.setString(1, autor.getNombre());
                st.setDate(2, new java.sql.Date(autor.getFechanacimiento().getTime()));
                st.setInt(3, autor.getIdautor());

                return st.executeUpdate();  // 1 si ok, 0 si no encontró el id
            } catch (SQLException se) {
                throw se;
            } finally {
                if (st != null) st.close();
                if (con != null) con.close();
            }
        }

        // ========== DELETE ==========
        /**
         * Elimina el autor por ID.
         * @param idautor ID del autor a borrar.
         * @return filas afectadas (1 si se borró, 0 si no existía)
         */
        public int deleteAutor(int idautor) throws SQLException {
            Connection con = null;
            PreparedStatement st = null;
            try {
                Conexion miconex = new Conexion();
                con = miconex.getConexion();

                String ordenSQL = "DELETE FROM AUTOR WHERE IDAUTOR = ?";
                st = con.prepareStatement(ordenSQL);
                st.setInt(1, idautor);

                return st.executeUpdate();  // 1 si ok, 0 si no existía
            } catch (SQLException se) {
                throw se;
            } finally {
                if (st != null) st.close();
                if (con != null) con.close();
            }
        

    }
	
}
