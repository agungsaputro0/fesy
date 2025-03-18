import { createContext, useContext, useState } from "react";

interface User {
  id: number;
  nama: string;
  fotoProfil: string;
}

interface ChatContextType {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  users: User[];
  addUserToChat: (user: User) => void;
  selectedUser: User | null;
  selectUser: (user: User) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]); // List user yang ada di chat
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);

  const addUserToChat = (user: User) => {
    setUsers((prevUsers) => {
      const alreadyExists = prevUsers.some((u) => u.id === user.id);
      if (!alreadyExists) {
        return [...prevUsers, user];
      }
      return prevUsers;
    });
    setSelectedUser(user); // Langsung buka chat dengan user
    openChat();
  };

  return (
    <ChatContext.Provider value={{ isOpen, openChat, closeChat, users, addUserToChat, selectedUser, selectUser: setSelectedUser }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
