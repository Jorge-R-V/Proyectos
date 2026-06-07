import { useEffect, useRef } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { X, Camera } from 'lucide-react'

type LectorCodigoBarrasProps = {
    onScanSuccess: (barcode: string) => void;
    onClose: () => void;
    isEmbedded?: boolean;
}

export default function LectorCodigoBarras({ onScanSuccess, onClose, isEmbedded = false }: LectorCodigoBarrasProps) {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        // Inicializar el escáner
        const scanner = new Html5QrcodeScanner(
            "reader", 
            { 
                fps: 10, 
                qrbox: { width: 250, height: 150 },
                aspectRatio: 1.0,
                showTorchButtonIfSupported: true
            },
            /* verbose= */ false
        );

        scanner.render(
            (decodedText) => {
                scanner.clear().then(() => {
                    onScanSuccess(decodedText);
                });
            },
            () => {
                // Errores de escaneo comunes (ignorarlos para no saturar consola)
            }
        );

        scannerRef.current = scanner;

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(err => console.error("Error clearing scanner", err));
            }
        }
    }, [onScanSuccess]);

    const containerClasses = isEmbedded 
        ? "w-full h-full relative" 
        : "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4";

    const cardClasses = isEmbedded
        ? "w-full h-full bg-transparent flex flex-col"
        : "bg-white dark:bg-slate-800 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-white/20 dark:border-slate-700";

    return (
        <div className={containerClasses}>
            <div className={cardClasses}>
                {!isEmbedded && (
                    <button 
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all z-10"
                    >
                        <X size={20} />
                    </button>
                )}

                {!isEmbedded && (
                    <div className="p-8 text-center border-b border-slate-50 dark:border-slate-700">
                        <div className="w-12 h-12 bg-lime-100 dark:bg-lime-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-lime-600 dark:text-lime-400">
                            <Camera size={24} />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Escáner NutriTrack</h3>
                        <p className="text-slate-400 text-sm mt-1">Coloca el código de barras frente a la cámara</p>
                    </div>
                )}

                <div className={`${isEmbedded ? 'flex-1' : 'p-4 md:p-8'}`}>
                    <div id="reader" className={`overflow-hidden ${isEmbedded ? 'w-full h-full border-none' : 'rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700'}`}>
                        {/* html5-qrcode inyectará aquí el video */}
                    </div>
                </div>

                <div className="p-8 bg-slate-50 dark:bg-slate-900/50 text-center text-[10px] uppercase font-bold tracking-widest text-slate-400">
                    Soporta EAN-13, UPC y más
                </div>
            </div>
        </div>
    )
}
