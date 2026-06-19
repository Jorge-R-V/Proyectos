package dao;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

import conexiones.Conexion;
import entidades.SocioPenalizado;

public class DaoSocioPenalizado {
	public ArrayList<SocioPenalizado>listadoSocioPenalizados() throws SQLException,Exception{
	       
	       ArrayList<SocioPenalizado>listadoSocioPenalizados=new ArrayList<>();
	       Conexion conexion=new Conexion(); // Creamos un objeto Conexion.
	       Connection con=null; // Objeto para conectar a la bbdd.
	       ResultSet rs = null; // Donde recojo los resultados de la consulta
	       Statement st = null; // Para crear la consulta.
	       try {
	           con=conexion.getConexion(); //Obtenemos el objeto java.sql.Connection
	           st = con.createStatement();// Creamos un objeto Statement
	           String ordenSQL = "SELECT * FROM SOCIOPENALIZADO ORDER By IDSOCIO"; // sentencia a ejecutar
	           rs = st.executeQuery(ordenSQL);    
	           while (rs.next()) {
	               SocioPenalizado miSocioPenalizado = new SocioPenalizado();
	               miSocioPenalizado.setIdsocio(rs.getInt("IDSOCIO"));
	               miSocioPenalizado.setLimitepenalizacion(rs.getDate("LIMITEPENALIZACION"));
	               listadoSocioPenalizados.add(miSocioPenalizado);
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
	       return listadoSocioPenalizados; // retornamos el resultado en forma de arraLibro
	}
}
