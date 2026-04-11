import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const mockChats = [
    {
        id: 1,
        name: 'Elena Vance',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBIIn1KwVwpULUJNeR1I0MdqXhILZ7L_r5Fk3CiXVHYV4D4aW5J63ygbmVv_M88PW3nnklqtdmSt8dtEerQvvKaAxbZYya2Cb3Rqq1sWsdahUPgBJoPoPLwXEbxwnUF57rmuEJdM89QYem0JCGnu9JdVxeTfll4NgxFs2aDr8NHeMMKE98gocTgZwRjL0gk2o9Wt49g6lYI62Qo8y3zjcRzzwC628J5eWNIGfpHk3T477De7DhXRYPYweaEQBKsIZKcKW8u2UGUKoy',
        lastMessage: "That sounds perfect! What time works for you?",
        timestamp: '10:42 AM',
        unread: 2,
        active: true
    },
    {
        id: 2,
        name: 'James T.',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLwg7ylVcRMaQHT_aBDoC-tBzuzRkOqwoFxg4Yz49yeTKYyPeCQ_ciOgsPoVMioxWGzHkvh7klv_FBG2JuyFnsVCByhJm_vou1b2V0LgahvAd7QPZ_PO1M-xmkO5QYMWcOuvFOv5QSDq5qFJQ0FqLslMHz9Dbz20BHwnt7YTBVn8fNR-XLjzjqw2DykcomKfD0hiYMqCpIUn_aKIi66rXo5ZXPzODFzBctecs-SUKsllXbRmk5KGcsvS4sCHBYcb6eJQwk_rJqMK4S',
        lastMessage: "I just uploaded some new photos of the studio space.",
        timestamp: 'Yesterday',
        unread: 0,
        active: false
    },
    {
        id: 3,
        name: 'Sarah Jenkins',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtV2hc5Sc91mQ8-G4YccJ7_X01HMClsj3z4ammHjQjxBUeZTr24Di5wr_naNJXZgcnUGzCt6ZjJz4BA8DQbtgap0Zm9DNui81lqph6B7DtIND-QQo-92pYZzu4gL5Z4uW173WA9CHWl2juM5E4KR3wATcQ5n4gGW1SFUs4aMwk_9kFPuJsiZS2L1Kko7AgF4bULuoxpzp1-9jb-Ml6EDRsztBkCTBSfILdHn4EPvigO3NYrxJCB-nDATZEjpa8fHAF60JBLC8xMswo',
        lastMessage: "No worries, let me know if you change your mind.",
        timestamp: 'Mon',
        unread: 0,
        active: false
    }
];

const mockMessages = [
    { id: 1, sender: 'them', text: "Hi! I saw your profile and I think we'd be great roommates.", time: '10:30 AM' },
    { id: 2, sender: 'me', text: "Hey Elena! Thanks for reaching out. I liked your profile too, especially the part about being pet friendly 🐶", time: '10:35 AM' },
    { id: 3, sender: 'them', text: "Yes! I have a golden retriever mix. Are you free to grab coffee this weekend to chat and see if we vibe?", time: '10:38 AM' },
    { id: 4, sender: 'me', text: "I'd love that. Saturday morning maybe?", time: '10:40 AM' },
    { id: 5, sender: 'them', text: "That sounds perfect! What time works for you?", time: '10:42 AM' }
];

export default function Messages() {
    const [activeChat, setActiveChat] = useState(mockChats[0]);
    const [messages, setMessages] = useState(mockMessages);
    const [newMessage, setNewMessage] = useState("");

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const newMsg = {
            id: messages.length + 1,
            sender: 'me',
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMsg]);
        setNewMessage("");
    };

    return (
        <div className="h-screen flex flex-col bg-surface-container-low font-inter">
            <Navbar />

            <main className="flex-1 pt-20 px-4 md:px-8 pb-4 flex overflow-hidden">
                <div className="w-full max-w-7xl mx-auto flex gap-6 mt-4 bg-surface-container-highest/20 rounded-3xl overflow-hidden shadow-sm border border-outline-variant/30">

                    {/* Sidebar: Chat List */}
                    <aside className="w-full md:w-96 bg-surface-container-lowest border-r border-outline-variant/50 flex flex-col hidden md:flex shrink-0">
                        <div className="p-6 border-b border-outline-variant/50 flex justify-between items-center">
                            <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">Messages</h2>
                            <button className="bg-surface-container-high p-2 rounded-full text-on-surface hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">edit_square</span>
                            </button>
                        </div>

                        <div className="p-4 border-b border-outline-variant/50">
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">search</span>
                                <input
                                    type="text"
                                    placeholder="Search conversations..."
                                    className="w-full bg-surface-container pl-12 pr-4 py-3 rounded-full border-transparent focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {mockChats.map((chat) => (
                                <div
                                    key={chat.id}
                                    onClick={() => setActiveChat(chat)}
                                    className={`p-4 mx-2 my-2 rounded-2xl cursor-pointer flex items-center gap-4 transition-all duration-300 ${activeChat.id === chat.id ? 'bg-primary-container/20 border border-primary/20 shadow-sm' : 'hover:bg-surface-container-high border border-transparent'}`}
                                >
                                    <div className="relative">
                                        <img src={chat.avatar} alt={chat.name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
                                        {chat.active && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className={`truncate font-bold ${activeChat.id === chat.id ? 'text-primary' : 'text-on-surface'}`}>{chat.name}</h3>
                                            <span className={`text-[10px] whitespace-nowrap ${chat.unread > 0 ? 'text-primary font-bold' : 'text-outline-variant font-medium'}`}>{chat.timestamp}</span>
                                        </div>
                                        <p className={`text-xs truncate ${chat.unread > 0 ? 'text-on-surface font-semibold' : 'text-on-surface-variant'}`}>
                                            {chat.lastMessage}
                                        </p>
                                    </div>

                                    {chat.unread > 0 && (
                                        <div className="w-5 h-5 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center shrink-0 shadow-sm">
                                            {chat.unread}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* Main Chat Area */}
                    <section className="flex-1 bg-surface-container-lowest flex flex-col min-w-0">
                        {/* Chat Header */}
                        <div className="h-20 px-6 border-b border-outline-variant/30 flex items-center justify-between bg-white/50 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <button className="md:hidden text-outline-variant p-2 -ml-2">
                                    <span className="material-symbols-outlined">arrow_back</span>
                                </button>
                                <div className="relative cursor-pointer group">
                                    <img src={activeChat.avatar} alt={activeChat.name} className="w-12 h-12 rounded-full object-cover border border-outline-variant/20 group-hover:opacity-80 transition-opacity" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-on-surface text-lg leading-tight">{activeChat.name}</h3>
                                    <p className="text-xs text-secondary font-medium tracking-wide flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div> Online
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="w-10 h-10 rounded-full border border-outline-variant/50 flex items-center justify-center text-outline hover:bg-surface-container hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined">call</span>
                                </button>
                                <button className="w-10 h-10 rounded-full border border-outline-variant/50 flex items-center justify-center text-outline hover:bg-surface-container hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined">videocam</span>
                                </button>
                                <button className="w-10 h-10 rounded-full flex items-center justify-center text-outline hover:bg-surface-container transition-colors">
                                    <span className="material-symbols-outlined">more_vert</span>
                                </button>
                            </div>
                        </div>

                        {/* Message History */}
                        <div className="flex-1 p-6 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-surface-container-lowest custom-scrollbar space-y-6">
                            <div className="text-center text-xs font-semibold text-outline-variant my-4 uppercase tracking-widest">Today</div>

                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.sender !== 'me' && (
                                        <img src={activeChat.avatar} className="w-8 h-8 rounded-full object-cover self-end mr-3 mb-1 shadow-sm" alt="Avatar" />
                                    )}
                                    <div className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'} max-w-[70%]`}>
                                        <div className={`px-5 py-3 rounded-2xl shadow-sm leading-relaxed text-sm ${msg.sender === 'me'
                                                ? 'bg-primary text-white rounded-br-none'
                                                : 'bg-surface-container text-on-surface rounded-bl-none'
                                            }`}>
                                            {msg.text}
                                        </div>
                                        <span className="text-[10px] text-outline-variant font-medium mt-1 mx-1">{msg.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-outline-variant/30">
                            <form onSubmit={handleSendMessage} className="flex items-end gap-3 bg-surface-container-low p-2 rounded-3xl border border-outline-variant/50 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                                <button type="button" className="p-2 text-outline hover:text-primary transition-colors rounded-full shrink-0">
                                    <span className="material-symbols-outlined">add_circle</span>
                                </button>
                                <textarea
                                    rows="1"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } }}
                                    className="flex-1 bg-transparent border-none resize-none max-h-32 min-h-[44px] py-3 text-sm focus:ring-0 text-on-surface placeholder-outline-variant custom-scrollbar"
                                    placeholder="Type a message..."
                                ></textarea>
                                <button type="submit" disabled={!newMessage.trim()} className={`p-3 rounded-full flex items-center justify-center transition-all shrink-0 ${newMessage.trim() ? 'bg-primary text-white shadow-md hover:scale-105' : 'bg-surface-container-highest text-outline'}`}>
                                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                                </button>
                            </form>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
