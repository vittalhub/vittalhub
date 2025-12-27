import { Button } from "@/components/ui/button";
import { MessageSquare, X, Paperclip, Send } from "lucide-react";

interface ChatWindowProps {
  onClose: () => void;
  patientName?: string;
}

export const ChatWindow = ({ onClose, patientName = "Cliente" }: ChatWindowProps) => {
  return (
    <div className="flex flex-col h-full bg-white border-l border-border/50 shadow-xl w-full md:w-[400px]">
      {/* Header */}
      <div className="p-4 border-b border-border/50 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
            {patientName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{patientName}</h3>
            <span className="text-xs text-green-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Online (WhatsApp)
            </span>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5 text-gray-500" />
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 bg-slate-50/30 overflow-y-auto space-y-4">
        {/* Mock Received Message */}
        <div className="flex justify-start">
          <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-border/50 max-w-[80%]">
            <p className="text-sm text-gray-700">Olá, gostaria de saber mais sobre o tratamento.</p>
            <span className="text-[10px] text-gray-400 mt-1 block">10:30</span>
          </div>
        </div>

        {/* Mock Sent Message */}
        <div className="flex justify-end">
           <div className="bg-blue-600 p-3 rounded-2xl rounded-tr-none shadow-sm max-w-[80%]">
            <p className="text-sm text-white">Olá! Claro, como posso ajudar você hoje?</p>
            <span className="text-[10px] text-blue-100 mt-1 block text-right">10:31</span>
          </div>
        </div>
        
        <div className="flex justify-start">
          <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-border/50 max-w-[80%]">
            <p className="text-sm text-gray-700">Qual o valor da consulta inicial?</p>
            <span className="text-[10px] text-gray-400 mt-1 block">10:32</span>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border/50 bg-white">
        <div className="flex gap-2 items-center">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
            <Paperclip className="h-5 w-5" />
          </Button>
          <input 
            type="text" 
            placeholder="Digite sua mensagem (Enter para enviar)..." 
            className="flex-1 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
          />
          <Button size="icon" className="rounded-full bg-blue-600 hover:bg-blue-700 h-10 w-10">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
