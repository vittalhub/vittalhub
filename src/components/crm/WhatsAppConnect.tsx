import { Button } from "@/components/ui/button";
import { QrCode, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";

export const WhatsAppConnect = () => {
  const [status, setStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [qrCode, setQrCode] = useState<string | null>(null);

  const handleConnect = () => {
    setStatus("connecting");
    // Simulate fetching QR Code
    setTimeout(() => {
      setQrCode("https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"); // Mock QR
    }, 1500);
    
    // Simulate Connection Success after scan
    setTimeout(() => {
        setQrCode(null);
        setStatus("connected");
    }, 8000);
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-border shadow-sm max-w-md mx-auto mt-10">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Conectar WhatsApp</h2>
        <p className="text-sm text-gray-500">
          Escaneie o QR Code para conectar sua clínica à Evolution API.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-gray-200 rounded-xl bg-slate-50/50 p-6 relative">
        {status === "disconnected" && (
          <div className="text-center">
            <QrCode className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <Button onClick={handleConnect} className="bg-green-600 hover:bg-green-700">
              Gerar QR Code
            </Button>
          </div>
        )}

        {status === "connecting" && qrCode && (
          <div className="text-center animate-in fade-in zoom-in duration-300">
            <div className="bg-white p-2 rounded-lg shadow-sm mb-4 inline-block">
               {/* Mock QR Image */}
               <img src={qrCode} alt="QR Code" className="w-48 h-48 opacity-80" />
            </div>
            <p className="text-xs text-gray-500 animate-pulse">Aguardando leitura...</p>
          </div>
        )}
        
        {status === "connecting" && !qrCode && (
             <div className="flex flex-col items-center gap-3">
                <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
                <p className="text-sm text-gray-500">Gerando sessão...</p>
             </div>
        )}

        {status === "connected" && (
          <div className="text-center animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-green-700 text-lg">Conectado!</h3>
            <p className="text-sm text-gray-500 mt-1">Sessão ativa: Clinic_Main_01</p>
            <Button 
                variant="outline" 
                className="mt-6 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                onClick={() => setStatus("disconnected")}
            >
                Desconectar
            </Button>
          </div>
        )}
      </div>

      <div className="mt-6 p-3 bg-blue-50 rounded-lg flex gap-3 items-start">
        <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-700">
          <p className="font-semibold mb-1">Nota sobre a Evolution API:</p>
          <p>Esta integração utiliza instâncias isoladas. Seus dados permanecem seguros e a conexão é mantida no servidor.</p>
        </div>
      </div>
    </div>
  );
};
