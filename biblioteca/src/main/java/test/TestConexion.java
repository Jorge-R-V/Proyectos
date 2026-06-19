package test;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.SQLException;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

import conexiones.Conexion;
import oracle.jdbc.OracleConnection;
import oracle.jdbc.pool.OracleDataSource;

 public class TestConexion {

	public static void main(String[] args) {
		
		Conexion conexion = new Conexion();
		Connection con = null;
		
		try {
			con = conexion.getConexion();
			con.close();
		} catch (SQLException e) {
			System.out.println("Tratamiento del error");
			System.out.println(e.toString());
		}

	}

}