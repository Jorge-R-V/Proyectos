package test;

import java.sql.Connection;
import java.sql.SQLException;

import conexiones.Conexion;
//import conexiones.ConexionCloud;

public class TestCloud{
	
	public static void main(String[] args) {
		Conexion conexion= new Conexion();
		Connection con = null;
		try {
			con=conexion.getConexion();
			con.close();
		} catch (SQLException e) {
			System.out.println("Tratamiento del error");
			System.out.println(e.toString());
		}
		
	}
}