package entidades;

import java.math.BigDecimal;

public class DetallePedido {
	private int idPedido;
	private int lineaDetalle;
	private int idProducto;
	private int cantidad;
	private BigDecimal precio_Unitario;
	private BigDecimal total_LineaDetalle;
	
	public int getIdPedido() {
		return idPedido;
	}
	public void setIdPedido(int idPedido) {
		this.idPedido = idPedido;
	}
	public int getLineaDetalle() {
		return lineaDetalle;
	}
	public void setLineaDetalle(int lineaDetalle) {
		this.lineaDetalle = lineaDetalle;
	}
	public int getIdProducto() {
		return idProducto;
	}
	public void setIdProducto(int idProducto) {
		this.idProducto = idProducto;
	}
	public int getCantidad() {
		return cantidad;
	}
	public void setCantidad(int cantidad) {
		this.cantidad = cantidad;
	}
	public BigDecimal getPrecio_Unitario() {
		return precio_Unitario;
	}
	public void setPrecio_Unitario(BigDecimal precio_Unitario) {
		this.precio_Unitario = precio_Unitario;
	}
	public BigDecimal getTotal_LineaDetalle() {
		return total_LineaDetalle;
	}
	public void setTotal_LineaDetalle(BigDecimal total_LineaDetalle) {
		this.total_LineaDetalle = total_LineaDetalle;
	}
	@Override
	public String toString() {
		return "DetallePedido [idPedido=" + idPedido + ", lineaDetalle=" + lineaDetalle + ", idProducto=" + idProducto
				+ ", cantidad=" + cantidad + ", precio_Unitario=" + precio_Unitario + ", total_LineaDetalle="
				+ total_LineaDetalle + "]";
	}
	public DetallePedido(int idPedido, int lineaDetalle, int idProducto, int cantidad, BigDecimal precio_Unitario,
			BigDecimal total_LineaDetalle) {
		super();
		this.idPedido = idPedido;
		this.lineaDetalle = lineaDetalle;
		this.idProducto = idProducto;
		this.cantidad = cantidad;
		this.precio_Unitario = precio_Unitario;
		this.total_LineaDetalle = total_LineaDetalle;
	}
	public DetallePedido() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	
}
