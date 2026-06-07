
package dao;

import conexiones.Conexion;
import entidades.Token;

import java.sql.*;
import java.util.Optional;

public class DaoToken {
//insertar token
    public void upsert(Token t) throws SQLException {
        String sql =
          "MERGE INTO TOKEN dst " +
          "USING (SELECT ? EMAIL, ? CLAVE, ? VALOR, ? TELEFONO FROM dual) src " +
          "ON (dst.EMAIL = src.EMAIL) " +
          "WHEN MATCHED THEN UPDATE SET dst.CLAVE=src.CLAVE, dst.VALOR=src.VALOR, dst.TELEFONO=src.TELEFONO, dst.FECHAINICIO=SYSDATE " +
          "WHEN NOT MATCHED THEN INSERT (EMAIL, CLAVE, VALOR, TELEFONO, FECHAINICIO) " +
          "VALUES (src.EMAIL, src.CLAVE, src.VALOR, src.TELEFONO, SYSDATE)";

        try (Connection cn = new Conexion().getConexion();
             PreparedStatement ps = cn.prepareStatement(sql)) {
            ps.setString(1, t.getEmail());
            ps.setString(2, t.getClave());   // puede ser null
            ps.setString(3, t.getValue());
            ps.setString(4, t.getTelefono());
            ps.executeUpdate();
        }
    }

    public Optional<Token> findByEmail(String email) throws SQLException {
        String sql = "SELECT EMAIL, CLAVE, VALOR, TELEFONO, FECHAINICIO FROM TOKEN WHERE EMAIL=?";
        try (Connection cn = new Conexion().getConexion();
             PreparedStatement ps = cn.prepareStatement(sql)) {
            ps.setString(1, email);
            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) return Optional.empty();
                Token t = new Token();
                t.setEmail(rs.getString("EMAIL"));
                t.setClave(rs.getString("CLAVE"));
                t.setValue(rs.getString("VALOR"));
                t.setTelefono(rs.getString("TELEFONO"));
                t.setFechainicio(rs.getDate("FECHAINICIO"));
                return Optional.of(t);
            }
        }
    }

    /*public Optional<Token> findByValor(String valor) throws SQLException {
        String sql = "SELECT EMAIL, CLAVE, VALOR, TELEFONO, FECHAINICIO FROM TOKEN WHERE VALOR=?";
        try (Connection cn = new Conexion().getConexion();
             PreparedStatement ps = cn.prepareStatement(sql)) {
            ps.setString(1, valor);
            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) return Optional.empty();
                Token t = new Token();
                t.setEmail(rs.getString("EMAIL"));
                t.setClave(rs.getString("CLAVE"));
                t.setValor(rs.getString("VALOR"));
                t.setTelefono(rs.getString("TELEFONO"));
                t.setFechainicio(rs.getDate("FECHAINICIO"));
                return Optional.of(t);
            }
        }
    }*/

    public int borrarPorEmail(String email) throws SQLException {
        try (Connection cn = new Conexion().getConexion();
             PreparedStatement ps = cn.prepareStatement("DELETE FROM TOKEN WHERE EMAIL=?")) {
            ps.setString(1, email);
            return ps.executeUpdate();
        }
    }
}

