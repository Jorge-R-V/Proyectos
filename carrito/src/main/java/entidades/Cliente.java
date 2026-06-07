package entidades;

import java.math.BigDecimal;

public class Cliente {
	private int id;
    private String nombre;
    private String tipo;
    private BigDecimal limiteCredito;
    
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getNombre() {
		return nombre;
	}
	public void setNombre(String nombre) {
		this.nombre = nombre;
	}
	public String getTipo() {
		return tipo;
	}
	public void setTipo(String tipo) {
		this.tipo = tipo;
	}
	public BigDecimal getLimiteCredito() {
		return limiteCredito;
	}
	public void setLimiteCredito(BigDecimal limiteCredito) {
		this.limiteCredito = limiteCredito;
	}
	@Override
	public String toString() {
		return "Cliente [id=" + id + ", nombre=" + nombre + ", tipo=" + tipo + ", limiteCredito=" + limiteCredito + "]";
	}
	public Cliente(int id, String nombre, String tipo, BigDecimal limiteCredito) {
		super();
		this.id = id;
		this.nombre = nombre;
		this.tipo = tipo;
		this.limiteCredito = limiteCredito;
	}
	public Cliente() {
		super();
		// TODO Auto-generated constructor stub
	}
    
}
