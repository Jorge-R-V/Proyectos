  package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;


import conexiones.Conexion;
import entidades.Ejemplar;
/*Nota sobre el ID

En tu script solo se crean las secuencias S_SOCIO y S_AUTOR; no aparece S_EJEMPLAR.
Te doy dos opciones para el INSERT:

Preferida (robusta): crear S_EJEMPLAR en Oracle y usar S_EJEMPLAR.NEXTVAL.

-------------CREATE SEQUENCE S_EJEMPLAR START WITH 1;-------------SQL


Alternativa: usar SELECT NVL(MAX(IDEJEMPLAR),0)+1 (menos segura en concurrencia).*/
public class DaoEjemplar {
	public ArrayList<Ejemplar>listadoEjemplares() throws SQLException,Exception{
	       
	       ArrayList<Ejemplar>listadoEjemplares=new ArrayList<>();
	       Conexion conexion=new Conexion(); // Creamos un objeto Conexion.
	       Connection con=null; // Objeto para conectar a la bbdd.
	       ResultSet rs = null; // Donde recojo los resultados de la consulta
	       Statement st = null; // Para crear la consulta.
	       try {
	           con=conexion.getConexion(); //Obtenemos el objeto java.sql.Connection
	           st = con.createStatement();// Creamos un objeto Statement
	           String ordenSQL = "SELECT * FROM EJEMPLAR ORDER By IDEJEMPLAR"; // sentencia a ejecutar
	           rs = st.executeQuery(ordenSQL);    
	           while (rs.next()) {
	               Ejemplar miEjemplar = new Ejemplar();
	               miEjemplar.setIdejemplar(rs.getInt("IDEJEMPLAR"));
	               miEjemplar.setIsbn(rs.getString("ISBN"));
	               miEjemplar.setBaja(rs.getString("BAJA"));
	               listadoEjemplares.add(miEjemplar);
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
	       return listadoEjemplares; // retornamos el resultado en forma de array
	   }

		public Ejemplar findEjemplarById (int idejemplar)throws SQLException {
				Ejemplar miEjemplar =null;
				Connection con=null;
				PreparedStatement st=null;
				ResultSet rs = null;
				try {
					Conexion miconex = new Conexion();
					con = miconex.getConexion();
					String ordenSQL = "SELECT * FROM EJEMPLAR"+
									" WHERE IDEJEMPLAR=?";
					st = con.prepareStatement(ordenSQL);
							st.setInt(1,  idejemplar);; // Damos el valor al parámetro posicional. Los parámetros
													// se enumeran secuencialmente comenzando por 1.
							rs = st.executeQuery();	// no se pasa la orden como parámetro porque ya
							if (rs.next()) {		// lo hemos hecho aquí con.preparateStatement(ordenSQL);
								miEjemplar =new Ejemplar();
								miEjemplar.setIdejemplar(rs.getInt("IDEJEMPLAR"));
					            miEjemplar.setIsbn(rs.getString("ISBN"));
					            miEjemplar.setBaja(rs.getString("BAJA"));
					            
								
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
			    return miEjemplar;
			}

/*
package dao;

import conexiones.Conexion;
import entidades.Ejemplar;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class DaoEjemplar {

    // ===== LISTADOS =====

    /** Lista TODOS los ejemplares (orden por IDEJEMPLAR) */
  /*  public List<Ejemplar> listado() throws SQLException {
        String sql = "SELECT IDEJEMPLAR, ISBN, BAJA FROM EJEMPLAR ORDER BY IDEJEMPLAR";
        List<Ejemplar> l = new ArrayList<>();

        try (Connection con = new Conexion().getConexion();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Ejemplar e = new Ejemplar();
                e.setIdejemplar(rs.getInt("IDEJEMPLAR"));
                e.setIsbn(rs.getString("ISBN"));
                e.setBaja(rs.getString("BAJA"));
                l.add(e);
            }
        }
        return l;
    }

    /** Lista ejemplares por ISBN (útil para ver existencias de un libro) */
    public List<Ejemplar> listadoPorIsbn(String isbn) throws SQLException {
        String sql = "SELECT IDEJEMPLAR, ISBN, BAJA FROM EJEMPLAR WHERE ISBN=? ORDER BY IDEJEMPLAR";
        List<Ejemplar> l = new ArrayList<>();

        try (Connection con = new Conexion().getConexion();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, isbn);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Ejemplar e = new Ejemplar();
                    e.setIdejemplar(rs.getInt("IDEJEMPLAR"));
                    e.setIsbn(rs.getString("ISBN"));
                    e.setBaja(rs.getString("BAJA"));
                    l.add(e);
                }
            }
        }
        return l;
    }

    // ===== FINDS =====

    /** Busca un ejemplar por su ID */
    public Ejemplar findById(int idejemplar) throws SQLException {
        String sql = "SELECT IDEJEMPLAR, ISBN, BAJA FROM EJEMPLAR WHERE IDEJEMPLAR=?";
        Ejemplar e = null;

        try (Connection con = new Conexion().getConexion();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, idejemplar);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    e = new Ejemplar();
                    e.setIdejemplar(rs.getInt("IDEJEMPLAR"));
                    e.setIsbn(rs.getString("ISBN"));
                    e.setBaja(rs.getString("BAJA"));
                }
            }
        }
        return e;
    }

    // ===== INSERT =====

    /**
     * Inserta un ejemplar para un ISBN.
     * Requiere secuencia S_EJEMPLAR (recomendado).
     * Deja el ID generado dentro del POJO (setIdejemplar).
     */
    public int insertEjemplar(Ejemplar ej) throws SQLException {
        // Opción recomendada: SECUENCIA
        String sqlInsert = "INSERT INTO EJEMPLAR (IDEJEMPLAR, ISBN, BAJA) VALUES (S_EJEMPLAR.NEXTVAL, ?, 'N')";
        String sqlGetId  = "SELECT S_EJEMPLAR.CURRVAL AS ID FROM DUAL";

        // // Opción alternativa (SIN secuencia) — MENOS segura en concurrencia:
        // String sqlInsert = "INSERT INTO EJEMPLAR (IDEJEMPLAR, ISBN, BAJA) " +
        //                    "SELECT NVL(MAX(IDEJEMPLAR),0)+1, ?, 'N' FROM EJEMPLAR";
        // String sqlGetId  = "SELECT MAX(IDEJEMPLAR) AS ID FROM EJEMPLAR WHERE ISBN = ?";

        try (Connection con = new Conexion().getConexion();
             PreparedStatement ps = con.prepareStatement(sqlInsert);
             Statement st = con.createStatement()) {

            ps.setString(1, ej.getIsbn());
            int filas = ps.executeUpdate();

            // Recuperar ID (con secuencia)
            try (ResultSet rs = st.executeQuery(sqlGetId)) {
                if (rs.next()) ej.setIdejemplar(rs.getInt("ID"));
            }

            return filas;
        }
    }

    // ===== UPDATE =====

    /** Cambia el ISBN de un ejemplar (caso poco habitual) */
    public int updateIsbn(int idejemplar, String nuevoIsbn) throws SQLException {
        String sql = "UPDATE EJEMPLAR SET ISBN=? WHERE IDEJEMPLAR=?";
        try (Connection con = new Conexion().getConexion();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, nuevoIsbn);
            ps.setInt(2, idejemplar);
            return ps.executeUpdate();
        }
    }

    /** Marca BAJA='S' (baja lógica) */
    public int marcarBaja(int idejemplar) throws SQLException {
        String sql = "UPDATE EJEMPLAR SET BAJA='S' WHERE IDEJEMPLAR=?";
        try (Connection con = new Conexion().getConexion();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, idejemplar);
            return ps.executeUpdate();
        }
    }

    /** Marca BAJA='N' (reactivar) */
    public int quitarBaja(int idejemplar) throws SQLException {
        String sql = "UPDATE EJEMPLAR SET BAJA='N' WHERE IDEJEMPLAR=?";
        try (Connection con = new Conexion().getConexion();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, idejemplar);
            return ps.executeUpdate();
        }
    }

    // ===== DELETE =====

    /** Borra físicamente (solo si no hay préstamos asociados) */
    public int deleteEjemplar(int idejemplar) throws SQLException {
        String sql = "DELETE FROM EJEMPLAR WHERE IDEJEMPLAR=?";
        try (Connection con = new Conexion().getConexion();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, idejemplar);
            return ps.executeUpdate();
        }
    }
}
