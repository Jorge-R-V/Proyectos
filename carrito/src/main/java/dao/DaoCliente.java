package dao;

import entidades.Cliente; // Importa la entidad Cliente desde el paquete entidades
import conexiones.Conexion; // Importa la clase de conexión desde su ubicación correcta
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.math.BigDecimal;

public class DaoCliente {

    /**
     * Busca un cliente por su identificador en la tabla CLIENTE.
     * Es crucial para verificar la validez del cliente al formalizar un pedido.
     * * @param idCliente El identificador del cliente a buscar, tomado del formulario.
     * @return El objeto Cliente encontrado, o null si no existe ningún cliente con ese ID.
     * @throws SQLException Si ocurre un error al intentar acceder a la base de datos.
     */
    public Cliente buscaClienteporId(int idCliente) throws SQLException {
        
        // La consulta SQL selecciona los campos necesarios para construir el objeto Cliente.
        String sql = "SELECT ID, NOMBRE, TIPO, LIMITECREDITO FROM CLIENTE WHERE ID = ?";
        Cliente cliente = null;
        
        // Uso de try-with-resources para asegurar el cierre automático de los recursos (Connection y PreparedStatement).
        try (Connection con = Conexion.getConexion();
             PreparedStatement ps = con.prepareStatement(sql)) {

            // Establecer el parámetro del ID del cliente en la consulta
            ps.setInt(1, idCliente);
            
            // Ejecutar la consulta y manejar el ResultSet
            try (ResultSet rs = ps.executeQuery()) {
                
                // Si rs.next() es true, significa que se encontró el cliente
                if (rs.next()) {
                    // Mapeo de los resultados a la entidad Cliente
                    int id = rs.getInt("ID");
                    String nombre = rs.getString("NOMBRE");
                    String tipo = rs.getString("TIPO");
                    BigDecimal limiteCredito = rs.getBigDecimal("LIMITECREDITO");
                    
                    // Se asume un constructor adecuado en Cliente.java
                    cliente = new Cliente(id, nombre, tipo, limiteCredito);
                }
                // Si no hay resultados, 'cliente' se mantiene en null.
            }
            
        } catch (SQLException e) {
            // Registrar el error o manejarlo según la política de la aplicación
            e.printStackTrace(); 
            throw e; // Re-lanzar la excepción para que el controlador la gestione
        }
        
        return cliente;
    }
}