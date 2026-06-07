package entidades;

import java.sql.Date;

public class SocioPenalizado {
	private int Idsocio;
	private Date Limitepenalizacion;
	
	
	public SocioPenalizado() {
		super();
		// TODO Auto-generated constructor stub
	}
	public SocioPenalizado(int idsocio, Date limitepenalizacion) {
		super();
		this.Idsocio = idsocio;
		this.Limitepenalizacion = limitepenalizacion;
	}
	
	
	public int getIdsocio() {
		return Idsocio;
	}
	public void setIdsocio(int idsocio) {
		Idsocio = idsocio;
	}
	public Date getLimitepenalizacion() {
		return Limitepenalizacion;
	}
	public void setLimitepenalizacion(Date limitepenalizacion) {
		Limitepenalizacion = limitepenalizacion;
	}
	
	
	@Override
	public String toString() {
		return "SocioPenalizado [Idsocio=" + Idsocio + ", Limitepenalizacion=" + Limitepenalizacion + "]";
	}
	
}
