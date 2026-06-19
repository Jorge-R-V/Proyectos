package servlets;

import dao.DaoCliente;
import dao.DaoPedido;
import dao.DaoProducto;
import entidades.Cliente;
import entidades.DetallePedido;
import entidades.Producto;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

// Mapeo del Servlet
@WebServlet(name = "Controlador", urlPatterns = {"/controlador"})
public class Controlador extends HttpServlet {

    // Inicialización de DAOs
    private final DaoProducto daoProducto = new DaoProducto();
    private final DaoCliente daoCliente = new DaoCliente();
    private final DaoPedido daoPedido = new DaoPedido();

    // Clave para el atributo de sesión que guarda el carrito (List<DetallePedido>)
    private static final String CART_SESSION_KEY = "carro";
    
    // --------------------------------------------------------------------------------------
    // Lógica Auxiliar
    // --------------------------------------------------------------------------------------

    /**
     * Busca un DetallePedido (línea del carrito) por ID de Producto en la lista.
     */
    private Optional<DetallePedido> buscarDetallePorId(List<DetallePedido> carrito, int idProducto) {
        return carrito.stream()
                      .filter(dp -> dp.getIdProducto() == idProducto)
                      .findFirst();
    }
    
    // --------------------------------------------------------------------------------------
    // doGet: Maneja la navegación y la manipulación del carrito
    // --------------------------------------------------------------------------------------

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {

        // 1. Obtener/Crear sesión e inicializar el carrito (List<DetallePedido>)
        HttpSession session = request.getSession(true);
        @SuppressWarnings("unchecked")
        List<DetallePedido> carrito = (List<DetallePedido>) session.getAttribute(CART_SESSION_KEY);

        if (carrito == null) {
            carrito = new ArrayList<>();
            session.setAttribute(CART_SESSION_KEY, carrito);
        }
        
        String operacion = request.getParameter("operacion");
        if (operacion == null) {
            operacion = "comprar";
        }
        
        try {
            switch (operacion) {
                case "comprar":
                    // Muestra lista de productos (Llama a DaoProducto.listaProductos())
                    List<Producto> productos = daoProducto.listaProductos();
                    request.setAttribute("productos", productos);
                    request.getRequestDispatcher("listadoProductos.jsp").forward(request, response);
                    break;
                    
                case "add":
                    // 2. Añadir/Incrementar un producto
                    long idProdAdd = Long.parseLong(request.getParameter("idProducto"));
                    Producto productoBase = daoProducto.buscaproductoporid(idProdAdd);
                    
                    Optional<DetallePedido> detalleOpt = buscarDetallePorId(carrito, (int)idProdAdd);
                    
                    if (detalleOpt.isPresent()) {
                        // Incrementar cantidad
                        DetallePedido dp = detalleOpt.get();
                        dp.setCantidad(dp.getCantidad() + 1);
                    } else {
                        // Añadir nuevo DetallePedido
                        DetallePedido nuevoDp = new DetallePedido();
                        nuevoDp.setIdProducto(productoBase.getId());
                        nuevoDp.setCantidad(1);
                        nuevoDp.setPrecio_Unitario(productoBase.getPrecio_normal());
                        carrito.add(nuevoDp);
                    }
                    // Recalcular el total de la línea
                    DetallePedido dpFinal = buscarDetallePorId(carrito, (int)idProdAdd).get();
                    dpFinal.setTotal_LineaDetalle(dpFinal.getPrecio_Unitario().multiply(new BigDecimal(dpFinal.getCantidad())));

                    response.sendRedirect("controlador?operacion=comprar");
                    break;

                case "incrementar":
                case "decrementar":
                    // 3. Modificar cantidad existente
                    int idProdMod = Integer.parseInt(request.getParameter("idProducto"));
                    Optional<DetallePedido> detalleModOpt = buscarDetallePorId(carrito, idProdMod);

                    if (detalleModOpt.isPresent()) {
                        DetallePedido dp = detalleModOpt.get();
                        if (operacion.equals("incrementar")) {
                            dp.setCantidad(dp.getCantidad() + 1);
                        } else { // decrementar
                            dp.setCantidad(dp.getCantidad() - 1);
                            if (dp.getCantidad() <= 0) {
                                carrito.remove(dp);
                            }
                        }
                        // Recalcular el total si la línea aún existe
                        if (dp.getCantidad() > 0) {
                             dp.setTotal_LineaDetalle(dp.getPrecio_Unitario().multiply(new BigDecimal(dp.getCantidad())));
                        }
                    }
                    response.sendRedirect("controlador?operacion=comprar");
                    break;
                    
                case "eliminar":
                    // 4. Eliminar producto completo
                    int idProdDel = Integer.parseInt(request.getParameter("idProducto"));
                    carrito.removeIf(dp -> dp.getIdProducto() == idProdDel);
                    response.sendRedirect("controlador?operacion=comprar");
                    break;
                    
                case "form_pedido":
                    // 5. Redireccionar al formulario de formalización
                    if (carrito.isEmpty()) {
                        request.setAttribute("error", "El carrito está vacío. Añada productos para continuar.");
                        request.getRequestDispatcher("listadoProductos.jsp").forward(request, response);
                        return;
                    }
                    request.getRequestDispatcher("formalizarPedido.jsp").forward(request, response);
                    break;

                default:
                    response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Operación no válida.");
                    break;
            }
        } catch (NumberFormatException e) {
             request.setAttribute("error", "Error: ID de producto no válido.");
             request.getRequestDispatcher("listadoProductos.jsp").forward(request, response);
        } catch (SQLException e) {
            request.setAttribute("error", "Error de base de datos: " + e.getMessage());
            request.getRequestDispatcher("listadoProductos.jsp").forward(request, response);
        } catch (Exception e) {
            // Captura el error de "Producto no encontrado" de DaoProducto
            request.setAttribute("error", e.getMessage());
            request.getRequestDispatcher("listadoProductos.jsp").forward(request, response);
        }
    }

    // --------------------------------------------------------------------------------------
    // doPost: Maneja la formalización del pedido (transacción)
    // --------------------------------------------------------------------------------------

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // 1. Obtener sesión y carrito
        HttpSession session = request.getSession(false);
        
        @SuppressWarnings("unchecked")
        List<DetallePedido> lineasPedido = (session != null) ? (List<DetallePedido>) session.getAttribute(CART_SESSION_KEY) : null;
        
        if (lineasPedido == null || lineasPedido.isEmpty()) {
            response.sendRedirect("index.jsp");
            return;
        }

        String idClienteStr = request.getParameter("idCliente");
        String direccionEnvio = request.getParameter("direccionEnvio");
        
        try {
            // 2. Validación y obtención del ID de Cliente
            int idCliente;
            try {
                idCliente = Integer.parseInt(idClienteStr);
            } catch (NumberFormatException e) {
                request.setAttribute("error", "El ID de cliente debe ser un valor numérico.");
                request.getRequestDispatcher("formalizarPedido.jsp").forward(request, response);
                return;
            }
            
            // 3. Validación de la existencia del Cliente en DB (Uso de DaoCliente)
            if (daoCliente.buscaClienteporId(idCliente) == null) {
                 request.setAttribute("error", "El ID de cliente " + idCliente + " no existe.");
                 request.getRequestDispatcher("formalizarPedido.jsp").forward(request, response);
                 return;
            }

            // 4. Asignar el campo LINEADETALLE consecutivo antes de la inserción
            int lineaDetalle = 1;
            for (DetallePedido dp : lineasPedido) {
                dp.setLineaDetalle(lineaDetalle++);
            }

            // 5. Llamar al DAO para la transacción (Uso de DaoPedido)
            int idPedidoGenerado = daoPedido.formalizarPedido(lineasPedido, idCliente, direccionEnvio);
            
            // 6. Éxito: Limpiar sesión y redirigir a la confirmación
            session.removeAttribute(CART_SESSION_KEY);
            request.setAttribute("idPedido", idPedidoGenerado);
            request.getRequestDispatcher("pedidoConfirmado.jsp").forward(request, response);
            
        } catch (SQLException e) {
            // 7. Error de Transacción: Captura errores SQL (incluido el ROLLBACK)
            request.setAttribute("error", "Error crítico de base de datos al procesar el pedido. No se ha guardado: " + e.getMessage());
            request.getRequestDispatcher("formalizarPedido.jsp").forward(request, response);
        }
    }
}