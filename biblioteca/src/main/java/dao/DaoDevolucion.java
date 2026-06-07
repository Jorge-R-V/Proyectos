package dao;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

import conexiones.Conexion;
import entidades.Devolucion;
import entidades.Prestamo;

public class DaoDevolucion {
	public ArrayList<Devolucion>listadoDevoluciones() throws SQLException,Exception{
	       
	       ArrayList<Devolucion>listadoDevoluciones=new ArrayList<>();
	       Conexion conexion=new Conexion(); // Creamos un objeto Conexion.
	       Connection con=null; // Objeto para conectar a la bbdd.
	       ResultSet rs = null; // Donde recojo los resultados de la consulta
	       Statement st = null; // Para crear la consulta.
	       try {
	           con=conexion.getConexion(); //Obtenemos el objeto java.sql.Connection
	           st = con.createStatement();// Creamos un objeto Statement
	           String ordenSQL = "SELECT * FROM DEVOLUCION ORDER By FECHAPRESTAMO"; // sentencia a ejecutar
	           rs = st.executeQuery(ordenSQL);    
	           while (rs.next()) {
	               Devolucion miDevolucion = new Devolucion();
	               miDevolucion.setIdejemplar(rs.getInt("IDEJEMPLAR"));
	               miDevolucion.setIdsocio(rs.getInt("IDSOCIO"));
	               miDevolucion.setFechaprestamo(rs.getDate("FECHAPRESTAMO"));
	               miDevolucion.setFechadevolucion(rs.getDate("FECHADEVOLUCION"));
	               listadoDevoluciones.add(miDevolucion);
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
	       return listadoDevoluciones; // retornamos el resultado en forma de arraLibro
	}
	
	public Devolucion findDevolucionById (int idejemplar)throws SQLException {
		Devolucion miDevolucion =null;
		Connection con=null;
		PreparedStatement st=null;
		ResultSet rs = null;
		try {
			Conexion miconex = new Conexion();
			con = miconex.getConexion();
			String ordenSQL = "SELECT * FROM DEVOLUCION"+
							" WHERE IDEJEMPLAR=?";
			st = con.prepareStatement(ordenSQL);
					st.setInt(1,  idejemplar);; // Damos el valor al parámetro posicional. Los parámetros
											// se enumeran secuencialmente comenzando por 1.
					rs = st.executeQuery();	// no se pasa la orden como parámetro porque ya
					if (rs.next()) {		// lo hemos hecho aquí con.preparateStatement(ordenSQL);
						miDevolucion =new Devolucion();
						miDevolucion.setIdejemplar(rs.getInt("IDEJEMPLAR"));
			            miDevolucion.setIdsocio(rs.getInt("IDSOCIO"));
			            miDevolucion.setFechaprestamo(rs.getDate("FECHAPRESTAMO"));
			            miDevolucion.setFechadevolucion(rs.getDate("FECHADEVOLUCION"));

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
	    return miDevolucion;
	}
	public Prestamo insertarDevolucion(int idejemplar, int idsociopres, Date fechaPrestamo, Date fechaDevolucion) throws SQLException {
		Prestamo prestamo =null;
		Connection con=null;
        PreparedStatement pst = null;
        try {
        	Conexion miconex = new Conexion();
            con = miconex.getConexion();
            String ordenSQL = "INSERT INTO PRESTAMO (IDEJEMPLAR, IDSOCIO, FECHAPRESTAMO, FECHADEVOLUCION) VALUES (?, ?, ?, ?)";
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
