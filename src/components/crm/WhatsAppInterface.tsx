import { useState, useEffect } from "react";
import { X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConversationList } from "./ConversationList";
import { ChatWindow } from "./ChatWindow";

interface WhatsAppInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  initialPatient?: string;
}

export function WhatsAppInterface({ isOpen, onClose, initialPatient }: WhatsAppInterfaceProps) {
  const [selectedPatient, setSelectedPatient] = useState<string | undefined>(initialPatient);
  
  // Sync prop with internal state when it changes (e.g. opening from Kanban)
  useEffect(() => {
    if (initialPatient) {
        setSelectedPatient(initialPatient);
    }
  }, [initialPatient]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 md:p-8 animate-in fade-in duration-200">
      <div className="bg-background w-full max-w-[1400px] h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative animate-scale-up">
        
        {/* Close Button (Global) */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all md:hidden"
        >
            <X className="h-5 w-5 text-gray-600" />
        </button>

        {/* Left Sidebar: Conversations */}
        <div className="w-full md:w-[320px] lg:w-[380px] h-full border-r border-border bg-white z-10">
          <ConversationList 
            onSelectPatient={setSelectedPatient} 
            selectedPatientId={selectedPatient}
          />
        </div>

        {/* Right Area: Chat or Empty State */}
        <div className="flex-1 h-full bg-[#efeae2] relative"> 
            {/* WhatsApp Web default background color approx */}
            <div 
                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{
                    backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')" // Standard WhatsApp doodle pattern
                }}
            />

            {selectedPatient ? (
                // We need to slightly adjust ChatWindow to fit this container perfectly 
                // and potentially hide its internal close button since we have the modal structure
                <div className="h-full w-full flex flex-col">
                   <ChatWindow 
                      onClose={() => setSelectedPatient(undefined)} // Back to empty state on close
                      patientName={selectedPatient} 
                   /> 
                   {/* 
                       Note: The current ChatWindow has a fixed width of 400px on md screens. 
                       We might need to override that class via specific styles or prop if it persists.
                       Ideally, ChatWindow should just be `w-full`.
                   */}
                </div>
            ) : (
                <div className="h-full w-full flex flex-col items-center justify-center text-center p-8 z-20 relative">
                    <div className="bg-white/80 p-6 rounded-full mb-6 shadow-sm ring-1 ring-black/5">
                        <MessageSquare className="h-12 w-12 text-muted-foreground/60" />
                    </div>
                    <h2 className="text-2xl font-light text-gray-700 mb-2">ClinicFlow Chat</h2>
                    <p className="text-muted-foreground max-w-sm">
                        Selecione uma conversa ao lado para começar a atender seus pacientes de forma rápida e integrada.
                    </p>
                    <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Sistema Conectado via Evolution API
                    </div>
                    
                     <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={onClose}
                        className="absolute top-4 right-4 hidden md:flex"
                    >
                        <X className="h-6 w-6 text-gray-500" />
                    </Button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
