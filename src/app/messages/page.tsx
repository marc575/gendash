"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MessageCard } from "@/components/message/MessageCard";
import { sampleMessages, sampleConversations } from "@/data/sampleMessages";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Send, Search } from "lucide-react";

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(sampleConversations[0]);
  const [newMessage, setNewMessage] = useState("");

  const getOtherParticipant = (conversation: typeof sampleConversations[0]) => {
    return conversation.participants.find(p => p.id !== "1") || conversation.participants[0];
  };

  const truncateMessage = (message: string, maxLength: number = 20) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + "...";
  };

  const conversationMessages = sampleMessages.filter(
    msg => 
      (msg.sender.id === selectedConversation.participants[0].id && msg.receiver.id === selectedConversation.participants[1].id) ||
      (msg.sender.id === selectedConversation.participants[1].id && msg.receiver.id === selectedConversation.participants[0].id)
  );

  return (
    <div className="container py-6 flex gap-6 h-[calc(100vh-65px)] max-h-[calc(100vh-65px)]">
      {/* Liste des conversations */}
      <Card className="w-80 flex flex-col overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une conversation..."
              className="pl-8"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {sampleConversations.map((conversation) => {
            const otherParticipant = getOtherParticipant(conversation);
            return (
              <button
                key={conversation.id}
                className="w-full p-3 flex items-center gap-3 hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedConversation(conversation)}
              >
                <Avatar>
                  <AvatarImage src={otherParticipant.avatar} alt={otherParticipant.name} />
                  <AvatarFallback>{otherParticipant.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{otherParticipant.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(conversation.lastMessage.timestamp, "HH:mm", { locale: fr })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {truncateMessage(conversation.lastMessage.content)}
                  </p>
                </div>
                {conversation.unreadCount > 0 && (
                  <Badge variant="default" className="ml-auto">
                    {conversation.unreadCount}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Zone de conversation */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b flex items-center gap-3">
              <Avatar>
                <AvatarImage 
                  src={getOtherParticipant(selectedConversation).avatar} 
                  alt={getOtherParticipant(selectedConversation).name} 
                />
                <AvatarFallback>
                  {getOtherParticipant(selectedConversation).name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-medium">{getOtherParticipant(selectedConversation).name}</h2>
                <p className="text-sm text-muted-foreground">En ligne</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversationMessages.map((message) => (
                <MessageCard
                  key={message.id}
                  message={message}
                  isSent={message.sender.id === "1"}
                />
              ))}
            </div>

            <div className="p-4 border-t flex-shrink-0">
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newMessage.trim()) {
                    // Ici, vous pouvez ajouter la logique pour envoyer le message
                    setNewMessage("");
                  }
                }}
              >
                <Input
                  placeholder="Écrivez votre message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button type="submit" size="sm" className="w-24">
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Sélectionnez une conversation pour commencer
          </div>
        )}
      </Card>
    </div>
  );
}