import { useEffect, useRef, useState } from "react";
import { ArrowLeftOutlined, MessageOutlined } from "@ant-design/icons";
import { useChat } from "../hooks/ChatContext";
import useIsMobile from "../hooks/useMobile";

interface User {
  id: number;
  nama: string;
  fotoProfil: string;
  chatSekarang?: boolean;
}

const users: User[] = [
  { id: 1, nama: "Agung Saputro", fotoProfil: "assets/img/fotoProfil/user.png" },
  { id: 2, nama: "Budi Santoso", fotoProfil: "assets/img/fotoProfil/FP2.jpg" },
  { id: 3, nama: "Siti Aminah", fotoProfil: "assets/img/fotoProfil/user.png" },
];

const dummyMessages = {
  1: ["Halo, bagaimana kabarmu?", "Apakah jaketnya masih ada ?"],
  2: ["Hai, saya ingin bertanya tentang produk anda", "Berapa harganya?"],
  3: ["Selamat pagi!", "Kalau mau tukar, produk apa yang anda inginkan ?"],
};

const FloatingChat = () => {
  const { isOpen, openChat, closeChat } = useChat();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<{ [key: number]: string[] }>(
    JSON.parse(localStorage.getItem("chatMessages") || JSON.stringify(dummyMessages))
  );
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const [chatUsers, setChatUsers] = useState<User[]>(() => {
    const savedUsers = JSON.parse(localStorage.getItem("chatUsers") || "[]");
  
    const mergedUsers = [...users, ...savedUsers.filter((u: User) => !users.some((du) => du.id === u.id))];
  
    localStorage.setItem("chatUsers", JSON.stringify(mergedUsers)); // Simpan kembali
  
    return mergedUsers;
  });
  

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        closeChat();
        setSelectedUser(null);

        const storedChatUsers = JSON.parse(localStorage.getItem("chatUsers") || "[]");
        const updatedChatUsers = storedChatUsers.map((user: User) => ({
          ...user,
          chatSekarang: false,
        }));

        localStorage.setItem("chatUsers", JSON.stringify(updatedChatUsers));
        setChatUsers(updatedChatUsers);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const storedChatUsers = JSON.parse(localStorage.getItem("chatUsers") || "[]");
    const userToChat = storedChatUsers.find((user: User) => user.chatSekarang);
    if (userToChat) {
      setSelectedUser(userToChat);
      openChat();
    }
  }, [openChat]);

  const addUserToChat = (user: User) => {
    setChatUsers((prevUsers) => {
      if (!prevUsers.find((u) => u.id === user.id)) {
        const newUsers = [...prevUsers, user];
        localStorage.setItem("chatUsers", JSON.stringify(newUsers));
        return newUsers;
      }
      return prevUsers;
    });
  };

  const sendMessage = () => {
    if (input.trim() !== "" && selectedUser) {
      addUserToChat(selectedUser);
      setMessages({
        ...messages,
        [selectedUser.id]: [...(messages[selectedUser.id] || []), `Me: ${input}`],
      });
      setInput("");
    }
  };

  return (
    <div className={`fixed ${isMobile ? 'bottom-20' : 'bottom-5'} right-5`}>
      <button
        className="bg-[#7f0353] text-white p-3 rounded-full shadow-lg hover:bg-[#990366] transition"
        onClick={isOpen ? closeChat : openChat}
      >
        💬
      </button>
      {isOpen && (
        <div
          ref={chatRef}
          className="w-80 h-96 bg-white shadow-xl rounded-lg p-4 flex flex-col fixed bottom-16 right-5 border border-gray-200"
        >
          {!selectedUser ? (
            <div>
              <h2 className="text-lg font-bold mb-2 text-center bg-[#7f0353] text-white py-2 rounded-t-md">
                <MessageOutlined /> Chats
              </h2>
              <input
                type="text"
                className="w-full p-2 border rounded mb-2"
                placeholder="Cari kontak..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="max-h-64 overflow-y-auto">
                {chatUsers
                  .filter((user) => user.nama.toLowerCase().includes(search.toLowerCase()))
                  .map((user) => (
                    <div
                      key={user.id}
                      className="p-2 flex items-center border-b cursor-pointer hover:bg-gray-100 rounded"
                      onClick={() => {
                        addUserToChat(user);
                        setSelectedUser(user);
                      }}
                    >
                      <img src={user.fotoProfil} alt={user.nama} className="w-10 h-10 rounded-full mr-2 border" onError={(e) => {
                            const imgElement = e.currentTarget;
                            if (!imgElement.dataset.fallback) {
                            imgElement.dataset.fallback = "true";
                            imgElement.src = `../${user.fotoProfil}`;
                            } else {
                            imgElement.src = "../assets/img/fotoProfil/user.png"; // Fallback terakhir jika kedua path gagal
                            }
                        }} />
                      {user.nama}
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between border-b pb-2 mb-2">
              <button
                className="text-[#7f0353] font-semibold"
                onClick={() => {
                    setSelectedUser(null);
                    setChatUsers(JSON.parse(localStorage.getItem("chatUsers") || "[]")); // ⬅️ Update state chatUsers
                }}
                >
                <ArrowLeftOutlined />
                </button>
                <h3 className="text-md font-bold flex">
                <img
                        src={selectedUser.fotoProfil}
                        alt={selectedUser.nama}
                        className="w-6 h-6 rounded-full mr-2 border"
                        onError={(e) => {
                            const imgElement = e.currentTarget;
                            if (!imgElement.dataset.fallback) {
                            imgElement.dataset.fallback = "true";
                            imgElement.src = `../${selectedUser.fotoProfil}`;
                            } else {
                            imgElement.src = "../assets/img/fotoProfil/user.png"; // Fallback terakhir jika kedua path gagal
                            }
                        }}
                        />
                  {selectedUser.nama}
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto border-b pb-2 flex flex-col px-2">
                {messages[selectedUser.id]?.map((msg, index) => (
                  <div key={index} className={`p-2 my-1 max-w-[75%] relative rounded-lg ${msg.startsWith("Me:") ? "bg-[#7f0353] text-white self-end ml-auto rounded-br-none" : "bg-gray-200 text-black self-start rounded-bl-none"}`}>
                    {msg.replace("Me: ", "")}
                  </div>
                ))}
              </div>
              <div className="flex mt-2">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 border rounded p-2" placeholder="Ketik pesan..." />
                <button onClick={sendMessage} className="bg-[#7f0353] text-white p-2 rounded ml-2 hover:bg-blue-600">➤</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FloatingChat;
