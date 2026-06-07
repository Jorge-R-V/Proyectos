package dao;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

import conexiones.Conexion;
import entidades.Libro;

public class DaoLibro {
	
	public ArrayList<Libro>listadoLibros() throws SQLException,Exception{
	       
	       ArrayList<Libro>listadoLibros=new ArrayList<>();
	       Conexion conexion=new Conexion(); // Creamos un objeto Conexion.
	       Connection con=null; // Objeto para conectar a la bbdd.
	       ResultSet rs = null; // Donde recojo los resultados de la consulta
	       Statement st = null; // Para crear la consulta.
	       try {
	           con=conexion.getConexion(); //Obtenemos el objeto java.sql.Connection
	           st = con.createStatement();// Creamos un objeto Statement
	           String ordenSQL = "SELECT * FROM Libro ORDER By ISBN"; // sentencia a ejecutar
	           rs = st.executeQuery(ordenSQL);    
	           while (rs.next()) {
	               Libro miLibro = new Libro();
	               miLibro.setIdautor(rs.getInt("IDAUTOR"));
	               miLibro.setIsbn(rs.getInt("ISBN"));
	               miLibro.setTitulo(rs.getString("TITULO"));
	               listadoLibros.add(miLibro);
	           }            
	       } catch (SQLException e) {
	           //e.printStackTrace();
	           throw e;
	       } catch (Exception ex) {
	           //ex.printStackTrace();
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
	       return listadoLibros; // retornamos el resultado en forma de arraLibro
	}
	
//	public ArrayList<Libro>listadoLibrosMorosos() throws SQLException{
//	       
//	       ArrayList<Libro>listadoLibros=new ArrayList<>();
//	       Conexion conexion=new Conexion();
//	       Connection con=null;
//	       ResultSet rs = null;
//	       Statement st = null;
//	       try {
//	           con=conexion.getConexion();
//	           st = con.createStatement();
//	           String ordenSQL = "SELECT S.NOMBRE, L.ISBN, L.TITULO, L.IDAUTOR "
//	           		+ "FROM PRESTAMO P, SOCIO S, LIBRO L "
//	           		+ "WHERE P.IDSOCIO= S.IDSOCIO "
//	           		+ "AND P.IDEJEMPLAR=L.ISBN "
//	           		+ "AND (P.FECHALIMITEDEVOLUCION - SYSDATE) <0 "
//	           		+ "ORDER BY S.NOMBRE";
//	           rs = st.executeQuery(ordenSQL);    
//	   
//	           while (rs.next()) {
//	               Libro miLibro = new Libro();
//	               miLibro.setIsbn(rs.getInt("ISBN"));
//	               miLibro.setTitulo(rs.getString("TITULO"));
//	               miLibro.setIdautor(rs.getInt("IDAUTOR"));
//	               listadoLibros.add(miLibro);
//	           }            
//	       } catch (SQLException e) {
//	           throw e;
//	       } catch (Exception ex) {
//	           throw ex;
//	       }
//	       finally {
//	           if(rs!=null)
//	               rs.close();
//	           if(st!=null)
//	               st.close();
//	           if(con!=null)
//	               con.close();
//	       }
//	       return listadoLibros;
//	   }
}
