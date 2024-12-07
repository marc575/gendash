import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface MessageCardProps {
  message: {
    id: string;
    content: string;
    sender: {
      id: string;
      name: string;
      avatar?: string;
    };
    timestamp: Date;
    isRead: boolean;
  };
  isSent?: boolean;
}

export function MessageCard({ message, isSent = false }: MessageCardProps) {
  return (
    <div
      className={cn(
        "flex gap-3 w-full",
        isSent ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex gap-3 max-w-[80%]",
          isSent ? "flex-row-reverse" : ""
        )}
      >
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
          <AvatarFallback>{message.sender.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className={cn(
          "flex flex-col gap-1 min-w-0",
          isSent ? "items-end" : ""
        )}>
          <div className={cn(
            "rounded-lg p-3 break-words",
            isSent ? "bg-primary text-primary-foreground" : "bg-muted"
          )}>
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>
          <span className="text-xs text-muted-foreground px-1">
            {format(message.timestamp, "HH:mm", { locale: fr })}
          </span>
        </div>
      </div>
    </div>
  );
}
