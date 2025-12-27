import { Search, MoreVertical, MessageCircle, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Mock data for conversations
const conversations = [
  {
    id: "1",
    name: "Ana Silva",
    lastMessage: "Olá, gostaria de confirmar o horário de amanhã.",
    time: "14:30",
    unread: 2,
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    status: "online"
  },
  {
    id: "2",
    name: "Carlos Oliveira",
    lastMessage: "Obrigado pelo atendimento!",
    time: "Ontem",
    unread: 0,
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    status: "offline"
  },
  {
    id: "3",
    name: "Mariana Santos",
    lastMessage: "Qual o valor do clareamento?",
    time: "Ontem",
    unread: 5,
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
    status: "online"
  },
    {
    id: "4",
    name: "João Pedro",
    lastMessage: "Vou precisar remarcar.",
    time: "Terça",
    unread: 0,
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f",
    status: "offline"
  },
  {
      id: "5",
      name: "Fernanda Lima",
      lastMessage: "Ok, combinado.",
      time: "Segunda",
      unread: 1,
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026705f",
      status: "online"
  }
];

interface ConversationListProps {
  onSelectPatient: (patientName: string) => void;
  selectedPatientId?: string;
}

export function ConversationList({ onSelectPatient, selectedPatientId }: ConversationListProps) {
  return (
    <div className="flex flex-col h-full border-r bg-white">
      {/* Header */}
      <div className="p-3 bg-muted/30 border-b flex items-center justify-between">
         <div className="flex items-center gap-2">
            <Avatar className="h-9 w-9 border border-border">
                <AvatarFallback>EU</AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold text-gray-700">Meus Chats</span>
         </div>
         <div className="flex gap-1">
             <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                 <MessageCircle className="h-5 w-5" />
             </Button>
             <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                 <MoreVertical className="h-5 w-5" />
             </Button>
         </div>
      </div>

      {/* Search */}
      <div className="p-3 border-b bg-muted/10">
        <div className="relative">
             <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
             <Input 
                placeholder="Pesquisar ou começar uma nova conversa" 
                className="pl-9 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/20 h-9"
             />
        </div>
      </div>

      {/* Filters (Optional styling touch) */}
      <div className="flex gap-2 p-2 px-3 border-b text-xs overflow-x-auto scrollbar-thin">
          <BadgeButton active>Tudo</BadgeButton>
          <BadgeButton>Não lidas</BadgeButton>
          <BadgeButton>Grupos</BadgeButton>
      </div>

      {/* List */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          {conversations.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectPatient(chat.name)}
              className={cn(
                "flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors border-b border-border/40 last:border-0",
                selectedPatientId === chat.name && "bg-muted/50" // Using name as ID for mock simplicity
              )}
            >
              <Avatar className="h-12 w-12 border border-border/50">
                <AvatarImage src={chat.avatar} />
                <AvatarFallback>{chat.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-medium text-sm text-gray-900 truncate">
                    {chat.name}
                  </span>
                  <span className={cn("text-[10px]", chat.unread > 0 ? "text-green-600 font-medium" : "text-muted-foreground")}>
                    {chat.time}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                   <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                     {chat.unread > 0 ? (
                        <span className="font-medium text-gray-800">{chat.lastMessage}</span>
                     ) : (
                        chat.lastMessage
                     )}
                   </p>
                   {chat.unread > 0 && (
                       <span className="flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-green-500 text-white text-[10px] font-bold">
                           {chat.unread}
                       </span>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

const BadgeButton = ({ active, children }: { active?: boolean, children: React.ReactNode }) => (
    <button className={cn(
        "px-3 py-1 rounded-full whitespace-nowrap transition-colors",
        active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50"
    )}>
        {children}
    </button>
)
