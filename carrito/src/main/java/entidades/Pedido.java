package entidades;

import java.sql.Date;

public class Pedido {
	private int idPedido;
	private int idCliente;
	private String estado;
	private char cobrado;
	private Date fecha;
	private String dirrecionDeEnvio;
	
	public int getIdPedido() {
		return idPedido;
	}
	public void setIdPedido(int idPedido) {
		this.idPedido = idPedido;
	}
	public int getIdCliente() {
		return idCliente;
	}
	public void setIdCliente(int idCliente) {
		this.idCliente = idCliente;
	}
	public String getEstado() {
		return estado;
	}
	public void setEstado(String estado) {
		this.estado = estado;
	}
	public char getCobrado() {
		return cobrado;
	}
	public void setCobrado(char cobrado) {
		this.cobrado = cobrado;
	}
	public Date getFecha() {
		return fecha;
	}
	public void setFecha(Date fecha) {
		this.fecha = fecha;
	}
	public String getDirrecionDeEnvio() {
		return dirrecionDeEnvio;
	}
	public void setDirrecionDeEnvio(String dirrecionDeEnvio) {
		this.dirrecionDeEnvio = dirrecionDeEnvio;
	}
	@Override
	public String toString() {
		return "Pedido [idPedido=" + idPedido + ", idCliente=" + idCliente + ", estado=" + estado + ", cobrado="
				+ cobrado + ", fecha=" + fecha + ", dirrecionDeEnvio=" + dirrecionDeEnvio + "]";
	}
	public Pedido(int idPedido, int idCliente, String estado, char cobrado, Date fecha, String dirrecionDeEnvio) {
		super();
		this.idPedido = idPedido;
		this.idCliente = idCliente;
		this.estado = estado;
		this.cobrado = cobrado;
		this.fecha = fecha;
		this.dirrecionDeEnvio = dirrecionDeEnvio;
	}
	public Pedido() {
		super();
		// TODO Auto-generated constructor stub
	}
}
