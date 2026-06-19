package dao;

// Importaciones
import entidades.DetallePedido; 
import conexiones.Conexion;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;

public class DaoPedido {

    /**
     * Formaliza la compra volcando el contenido del carrito (List<DetallePedido>) a las tablas
     * PEDIDO y DETALLEPEDIDO, asegurando la integridad transaccional (COMMIT/ROLLBACK).
     *
     * @param lineasPedido Lista de objetos DetallePedido que representan los artículos del carrito.
     * @param idCliente El ID del cliente que realiza el pedido.
     * @param direccionEnvio La dirección de envío.
     * @return El ID del pedido insertado.
     * @throws SQLException Si ocurre un error de base de datos o durante la transacción.
     */
    public int formalizarPedido(List<DetallePedido> lineasPedido, int idCliente, String direccionEnvio) throws SQLException {
        
        Connection con = null;
        int idPedidoGenerado = 0;
        
        if (lineasPedido == null || lineasPedido.isEmpty()) {
            throw new IllegalArgumentException("El listado de líneas de pedido no puede estar vacío.");
        }

        try {
            // 1. Obtener conexión y deshabilitar auto-commit para iniciar la transacción
            con = Conexion.getConexion();
            con.setAutoCommit(false); 

            // 2. Obtener el siguiente ID de Pedido de la secuencia S_PEDIDO.
            idPedidoGenerado = obtenerSiguienteIdPedido(con);
            
            // 3. Insertar la cabecera del pedido en la tabla PEDIDO
            insertarPedido(con, idPedidoGenerado, idCliente, direccionEnvio);

            // 4. Insertar los detalles del pedido en la tabla DETALLEPEDIDO (Usa batch para eficiencia)
            insertarDetallesPedido(con, idPedidoGenerado, lineasPedido);

            // 5. Confirmar la transacción
            con.commit();
            
        } catch (SQLException e) {
            // 6. Revertir la transacción si hay algún fallo
            if (con != null) {
                try {
                    System.err.println("Transacción fallida en DaoPedido. Realizando rollback.");
                    con.rollback();
                } catch (SQLException ex) {
                    // Manejo del error de rollback (registro o notificación)
                }
            }
            throw e; // Re-lanza la excepción para manejo en el Servlet
            
        } finally {
            // 7. Cerrar la conexión
            if (con != null) {
                try {
                    con.setAutoCommit(true);
                    con.close();
                } catch (SQLException e) {
                    // Manejo del error al cerrar la conexión
                }
            }
        }
        
        return idPedidoGenerado;
    }

    // ------------------- Métodos Auxiliares -------------------

    /**
     * Obtiene el siguiente valor de la secuencia S_PEDIDO (Oracle).
     */
    private int obtenerSiguienteIdPedido(Connection con) throws SQLException {
        String sql = "SELECT S_PEDIDO.NEXTVAL FROM DUAL";
        try (Statement st = con.createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            
            if (rs.next()) {
                return rs.getInt(1);
            }
            throw new SQLException("Error al obtener el siguiente ID de la secuencia S_PEDIDO.");
        }
    }

    /**
     * Inserta la cabecera del pedido en la tabla PEDIDO.
     */
    private void insertarPedido(Connection con, int idPedido, int idCliente, String direccionEnvio) throws SQLException {
        // Estado: 'PENDIENTE' por defecto. Fecha: SYSDATE. Cobrado: 'NO'.
        String sql = "INSERT INTO PEDIDO (IDPEDIDO, IDCLIENTE, ESTADO, COBRADO, FECHA, DIRECCIONDEENVIO) VALUES (?, ?, 'PENDIENTE', 'NO', SYSDATE, ?)";
        
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, idPedido);
            ps.setInt(2, idCliente);
            ps.setString(3, direccionEnvio);
            
            ps.executeUpdate();
        }
    }

    /**
     * Inserta los registros en la tabla DETALLEPEDIDO para cada artículo usando ejecución por lote (batch).
     */
    private void insertarDetallesPedido(Connection con, int idPedido, List<DetallePedido> lineasPedido) throws SQLException {
        
        String sql = "INSERT INTO DETALLEPEDIDO (IDPEDIDO, LINEADETALLE, IDPRODUCTO, CANTIDAD, PRECIO_UNITARIO, TOTAL_LINEADETALLE) VALUES (?, ?, ?, ?, ?, ?)";

        try (PreparedStatement ps = con.prepareStatement(sql)) {
            for (DetallePedido dp : lineasPedido) {
                
                // Mapeo de campos
                ps.setInt(1, idPedido); // IDPEDIDO (del autogenerado)
                ps.setInt(2, dp.getLineaDetalle()); 
                ps.setInt(3, dp.getIdProducto());
                ps.setInt(4, dp.getCantidad());
                ps.setBigDecimal(5, dp.getPrecio_Unitario());
                ps.setBigDecimal(6, dp.getTotal_LineaDetalle());

                ps.addBatch(); // Agrega al lote
            }
            
            ps.executeBatch(); // Ejecuta todas las inserciones del lote
        }
    }
}