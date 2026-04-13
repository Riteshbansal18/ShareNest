import React, { useState, useEffect, useRef, useContext } from 'react';
import Navbar from '../components/Navbar';
import { GlobalContext } from '../context/GlobalContext';
import { messagesAPI } from '../api/services';
import { getSocket } from '../api/socket';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Messages() {
  const { isAuthenticated, user, onlineUsers } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const [showSidebar, setShowSidebar] = useState(true); // mobile: toggle between list & chat
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const activeConvRef = useRef(null);

  useEffect(() => { activeConvRef.current = activeConv; }, [activeConv]);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    loadConversations();
    const socket = getSocket();
    socket.on('message:new', (msg) => {
      const convId = msg.conversation;
      if (activeConvRef.current?._id === convId) {
        setMessages(prev => {
          // Skip own messages — already added optimistically
          if (msg.sender?._id === user?._id) {
            return prev.map(m => (m.isTemp && m.content === msg.content) ? msg : m);
          }
          return [...prev, msg];
        });
      }
      setConversations(prev => prev.map(c =>
        c._id === convId
          ? { ...c, lastMessage: msg.content, lastMessageAt: msg.createdAt, unread: activeConvRef.current?._id === convId ? 0 : (c.unread || 0) + 1 }
          : c
      ));
    });
    socket.on('typing:start', ({ userId, userName }) => setTypingUsers(prev => ({ ...prev, [userId]: userName })));
    socket.on('typing:stop', ({ userId }) => setTypingUsers(prev => { const n = { ...prev }; delete n[userId]; return n; }));
    return () => { socket.off('message:new'); socket.off('typing:start'); socket.off('typing:stop'); };
  }, [isAuthenticated]);

  useEffect(() => {
    if (activeConv) {
      loadMessages(activeConv._id);
      getSocket().emit('conversation:join', activeConv._id);
    }
  }, [activeConv?._id]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const loadConversations = async () => {
    try {
      const res = await messagesAPI.getConversations();
      setConversations(res.data.conversations);
      if (res.data.conversations.length > 0) setActiveConv(res.data.conversations[0]);
    } catch { console.error('Failed to load conversations'); }
    finally { setLoading(false); }
  };

  const loadMessages = async (convId) => {
    try {
      const res = await messagesAPI.getMessages(convId);
      setMessages(res.data.messages);
      setConversations(prev => prev.map(c => c._id === convId ? { ...c, unread: 0 } : c));
    } catch { console.error('Failed to load messages'); }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConv || sending) return;
    setSending(true);
    const content = newMessage.trim();
    setNewMessage('');
    getSocket().emit('typing:stop', { conversationId: activeConv._id, userId: user._id });

    // Optimistically add own message immediately — don't wait for socket
    const tempMsg = {
      _id: `temp-${Date.now()}`,
      conversation: activeConv._id,
      sender: { _id: user._id, fullName: user.fullName, profileImage: user.profileImage },
      content,
      createdAt: new Date().toISOString(),
      isTemp: true,
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      const res = await messagesAPI.sendMessage(activeConv._id, content);
      // Replace temp message with real one from server
      setMessages(prev => prev.map(m => m._id === tempMsg._id ? res.data.message : m));
    } catch {
      // Remove temp message on failure
      setMessages(prev => prev.filter(m => m._id !== tempMsg._id));
      toast.error('Failed to send message');
    } finally { setSending(false); }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!activeConv) return;
    getSocket().emit('typing:start', { conversationId: activeConv._id, userId: user._id, userName: user.fullName.split(' ')[0] });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      getSocket().emit('typing:stop', { conversationId: activeConv._id, userId: user._id });
    }, 1500);
  };

  const handleSelectConv = (conv) => {
    setActiveConv(conv);
    setShowSidebar(false); // on mobile, switch to chat view
  };

  const isOnline = (userId) => onlineUsers?.includes(userId?.toString());

  const getAvatarUrl = (participant) => {
    if (!participant) return '';
    const img = participant.profileImage;
    if (!img) return `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.fullName || 'U')}&background=1e3a5f&color=fff&size=64`;
    return img.startsWith('http') ? img : `http://localhost:5000${img}`;
  };

  const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const diff = Date.now() - d;
    if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diff < 604800000) return d.toLocaleDateString([], { weekday: 'short' });
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const typingList = Object.values(typingUsers);

  if (loading) return (
    <>
      <Navbar />
      <div className="pt-20 h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <main className="pt-16 h-screen flex overflow-hidden">

        {/* Conversations List — full screen on mobile when showSidebar, hidden when in chat */}
        <div className={`
          flex-shrink-0 border-r border-outline-variant/20 bg-surface-container-lowest flex flex-col
          w-full md:w-80
          ${showSidebar ? 'flex' : 'hidden md:flex'}
        `}>
          <div className="p-4 border-b border-outline-variant/20">
            <h2 className="text-xl font-bold text-on-surface">Messages</h2>
            <p className="text-xs text-on-surface-variant mt-1">{conversations.length} conversations</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-8 text-center">
                <span className="material-symbols-outlined text-4xl text-outline-variant">chat_bubble</span>
                <p className="text-on-surface-variant text-sm mt-3">No conversations yet</p>
                <Link to="/roommate-listing" className="text-primary text-sm font-semibold hover:underline mt-2 block">Find roommates to message</Link>
              </div>
            ) : (
              conversations.map(conv => (
                <button key={conv._id} onClick={() => handleSelectConv(conv)}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-surface-container transition-colors text-left ${activeConv?._id === conv._id ? 'bg-surface-container border-r-2 border-primary' : ''}`}>
                  <div className="relative flex-shrink-0">
                    <img src={getAvatarUrl(conv.participant)} alt="" className="w-12 h-12 rounded-full object-cover" />
                    {isOnline(conv.participant?._id) && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-on-surface text-sm truncate">{conv.participant?.fullName}</span>
                      <span className="text-xs text-on-surface-variant flex-shrink-0 ml-2">{formatTime(conv.lastMessageAt)}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant truncate mt-0.5">{conv.lastMessage || 'Start a conversation'}</p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                      {conv.unread}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area — full screen on mobile when !showSidebar */}
        <div className={`
          flex-1 flex flex-col bg-surface
          ${!showSidebar ? 'flex' : 'hidden md:flex'}
        `}>
          {activeConv ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 p-4 border-b border-outline-variant/20 bg-surface-container-lowest">
                {/* Back button — mobile only */}
                <button onClick={() => setShowSidebar(true)} className="md:hidden p-1.5 -ml-1 rounded-full hover:bg-surface-container">
                  <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
                </button>
                <div className="relative">
                  <img src={getAvatarUrl(activeConv.participant)} alt="" className="w-10 h-10 rounded-full object-cover" />
                  {isOnline(activeConv.participant?._id) && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white"></span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-on-surface">{activeConv.participant?.fullName}</h3>
                  <p className={`text-xs font-medium ${isOnline(activeConv.participant?._id) ? 'text-green-500' : 'text-on-surface-variant'}`}>
                    {isOnline(activeConv.participant?._id) ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-on-surface-variant text-sm">No messages yet. Say hello! 👋</p>
                  </div>
                ) : (
                  messages.map(msg => {
                    const isMe = msg.sender?._id === user?._id || msg.sender === user?._id;
                    return (
                      <div key={msg._id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                        {!isMe && <img src={getAvatarUrl(activeConv.participant)} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-1" />}
                        <div className={`max-w-[75%] flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
                          <div className={`px-4 py-2.5 rounded-2xl text-sm break-words ${isMe ? 'bg-primary text-white rounded-tr-sm' : 'bg-surface-container-low text-on-surface rounded-tl-sm'}`}>
                            {msg.content}
                          </div>
                          <span className="text-xs text-on-surface-variant">{formatTime(msg.createdAt)}</span>
                        </div>
                      </div>
                    );
                  })
                )}
                {typingList.length > 0 && (
                  <div className="flex gap-2 items-center">
                    <img src={getAvatarUrl(activeConv.participant)} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                    <div className="bg-surface-container-low px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                      <span className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSend} className="p-3 border-t border-outline-variant/20 bg-surface-container-lowest">
                <div className="flex items-center gap-2">
                  <input value={newMessage} onChange={handleTyping}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 bg-surface-container-highest rounded-full border-none focus:ring-2 focus:ring-primary/20 text-on-surface text-sm" />
                  <button type="submit" disabled={!newMessage.trim() || sending}
                    className="bg-primary text-white p-3 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 flex-shrink-0">
                    <span className="material-symbols-outlined text-sm">{sending ? 'hourglass_empty' : 'send'}</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <span className="material-symbols-outlined text-6xl text-outline-variant">forum</span>
                <p className="text-on-surface-variant mt-4 text-lg font-medium">Select a conversation</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
