package entidades;

public class Socio {
	   private int idsocio;
	   private String nombre;
	   private String email;
	   private String direccion;
	   private int version;
	   
   public Socio() {
		super();
		// TODO Auto-generated constructor stub
	}
	   
	public Socio(int idsocio, String nombre, String email, String direccion, int version) {
		super();
		this.idsocio = idsocio;
		this.nombre = nombre;
		this.email = email;
		this.direccion = direccion;
		this.version = version;
	}
		
	public int getIdsocio() {
		return idsocio;
	}

	public void setIdsocio(int idsocio) {
		this.idsocio = idsocio;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getDireccion() {
		return direccion;
	}

	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}

	public int getVersion() {
		return version;
	}

	public void setVersion(int version) {
		this.version = version;
	}


	@Override
	public String toString() {
		return "Socio [idsocio=" + idsocio + ", nombre=" + nombre + ", email=" + email + ", direccion=" + direccion
				+ ", version=" + version + "]";
	}
	   
} /*
package entidades;

import java.io.Serializable;
import java.sql.Date;

/**
 * Entidad de dominio que mapea la tabla SOCIO.
 * Columnas: IDSOCIO (PK), EMAIL (UNIQUE), NOMBRE, DIRECCION, VERSION (para bloqueo optimista).
 
public class Socio implements Serializable {

    private static final long serialVersionUID = 1L;

    private int idSocio;
    private String email;
    private String nombre;
    private String direccion;
    private int version;      // muy útil para update con bloqueo optimista

    // --- Constructores ---
    
    public Socio() { }

    public Socio(int idsocio, String email, String nombre, String direccion, int version) {
        this.idSocio = idsocio;
        this.email = email;
        this.nombre = nombre;
        this.direccion = direccion;
        this.version = version;
    }

    // --- Getters/Setters ---
    public int getIdSocio() { return idSocio; }
    public void setIdSocio(int idSocio) { this.idSocio = idSocio; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public int getVersion() { return version; }
    public void setVersion(int version) { this.version = version; }

    // --- Utilidad ---
    @Override
    public String toString() {
        return "Socio{" +
                "idSocio=" + idSocio +
                ", email='" + email + '\'' +
                ", nombre='" + nombre + '\'' +
                ", direccion='" + direccion + '\'' +
                ", version=" + version +
                '}';
    }
}*/

