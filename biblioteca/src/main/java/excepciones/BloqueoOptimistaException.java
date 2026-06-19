package excepciones;

public class BloqueoOptimistaException extends Exception{

	
	private static final long serialVersionUID = 1L;
	public BloqueoOptimistaException() {
		
	}
	public BloqueoOptimistaException(String message) {
		super(message);
	}
}
