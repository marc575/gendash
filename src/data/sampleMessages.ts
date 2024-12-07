import { addMinutes, subDays } from "date-fns";

export interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  receiver: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  lastMessage: Message;
  unreadCount: number;
}

const currentUser = {
  id: "1",
  name: "Marc Dubois",
  avatar: "/avatars/marc.jpg",
};

export const sampleMessages: Message[] = [
  {
    id: "1",
    content: "Salut Marc, peux-tu regarder la dernière PR sur le projet d'authentification ?",
    sender: {
      id: "2",
      name: "Sophie Martin",
      avatar: "/avatars/sophie.jpg",
    },
    receiver: currentUser,
    timestamp: subDays(new Date(), 1),
    isRead: true,
  },
  {
    id: "2",
    content: "Bien sûr, je regarde ça tout de suite !",
    sender: currentUser,
    receiver: {
      id: "2",
      name: "Sophie Martin",
      avatar: "/avatars/sophie.jpg",
    },
    timestamp: addMinutes(subDays(new Date(), 1), 5),
    isRead: true,
  },
  {
    id: "3",
    content: "J'ai terminé la maquette du nouveau dashboard, on peut faire un point ?",
    sender: {
      id: "3",
      name: "Lucas Bernard",
      avatar: "/avatars/lucas.jpg",
    },
    receiver: currentUser,
    timestamp: new Date(),
    isRead: false,
  },
  {
    id: "4",
    content: "La réunion de sprint est avancée à 14h aujourd'hui",
    sender: {
      id: "4",
      name: "Emma Petit",
      avatar: "/avatars/emma.jpg",
    },
    receiver: currentUser,
    timestamp: addMinutes(new Date(), -30),
    isRead: false,
  },
];

export const sampleConversations: Conversation[] = [
  {
    id: "1",
    participants: [
      currentUser,
      {
        id: "2",
        name: "Sophie Martin",
        avatar: "/avatars/sophie.jpg",
      },
    ],
    lastMessage: sampleMessages[1],
    unreadCount: 0,
  },
  {
    id: "2",
    participants: [
      currentUser,
      {
        id: "3",
        name: "Lucas Bernard",
        avatar: "/avatars/lucas.jpg",
      },
    ],
    lastMessage: sampleMessages[2],
    unreadCount: 1,
  },
  {
    id: "3",
    participants: [
      currentUser,
      {
        id: "4",
        name: "Emma Petit",
        avatar: "/avatars/emma.jpg",
      },
    ],
    lastMessage: sampleMessages[3],
    unreadCount: 1,
  },
];
