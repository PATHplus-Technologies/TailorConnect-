
import { useEffect, useState, useRef, Suspense } from 'react';
import { chatService } from '@/services/chat';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

function ChatContent() {
    const { t } = useLanguage();
    const [conversations, setConversations] = useState<any[]>([]);
    const [activeConvId, setActiveConvId] = useState<number | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const searchParams = useSearchParams();

    // Init User ID and Auto-Select conversation from URL
    useEffect(() => {
        const uid = localStorage.getItem('user_id');
        if (uid) setCurrentUserId(Number(uid));

        loadConversations();

        // Auto-start or select conversation if 'tailor' or 'client' param exists
        const tailorId = searchParams.get('tailor');
        const clientId = searchParams.get('client');
        const targetId = tailorId || clientId;

        if (targetId) {
            handleStartChat(Number(targetId));
        }
    }, [searchParams]);

    // Polling for messages
    useEffect(() => {
        if (activeConvId) {
            loadMessages(activeConvId);
            const interval = setInterval(() => loadMessages(activeConvId), 3000);
            return () => clearInterval(interval);
        }
    }, [activeConvId]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const loadConversations = async () => {
        try {
            const data = await chatService.getConversations();
            setConversations(data);
        } catch (e) { console.error(e); }
    };

    const loadMessages = async (convId: number) => {
        try {
            const data = await chatService.getMessages(convId);
            // Sort by timestamp
            const sorted = data.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

            setMessages(prev => {
                // simple check to avoid re-render if data is same
                if (prev.length === sorted.length && prev[prev.length - 1]?.id === sorted[sorted.length - 1]?.id) {
                    return prev;
                }
                return sorted;
            });
        } catch (e) { console.error(e); }
    };

    const handleStartChat = async (userId: number) => {
        try {
            const conv = await chatService.startConversation(userId);
            setActiveConvId(conv.id);
            loadConversations(); // Refresh list
        } catch (e) { console.error(e); }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConvId) return;
        try {
            await chatService.sendMessage({ conversation: activeConvId, content: newMessage });
            setNewMessage('');
            loadMessages(activeConvId);
            loadConversations(); // Update last message in sidebar
        } catch (e) { console.error(e); }
    };

    // Helper to get the "other" participant name
    const getOtherParticipant = (conv: any) => {
        if (!currentUserId || !conv.participants) return t('common.loading');
        const other = conv.participants.find((p: any) => p.id !== currentUserId);
        return other ? other.username : 'User';
    };

    return (
        <div className="h-[calc(100vh-64px)] bg-gray-100 flex overflow-hidden">
            {/* Sidebar */}
            <div className={`w-full md:w-80 bg-white border-r border-gray-200 flex flex-col ${activeConvId ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-gray-100 bg-white flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">{t('chat.messages')}</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations
                        .filter(c => {
                            // If we have a specific target in URL (tailor/client param), ONLY show that conversation
                            const tailorParam = searchParams.get('tailor');
                            const clientParam = searchParams.get('client');
                            const targetId = Number(tailorParam || clientParam);

                            if (targetId && currentUserId) {
                                // Check if this conversation involves the target user
                                const other = c.participants?.find((p: any) => p.id !== currentUserId);
                                return other && other.id === targetId;
                            }
                            return true; // Show all if no filter
                        })
                        .map(c => {
                            const active = activeConvId === c.id;
                            const otherName = getOtherParticipant(c);
                            const initial = otherName[0]?.toUpperCase() || '?';
                            const lastMsgTime = c.updated_at ? new Date(c.updated_at).toLocaleDateString() : '';

                            return (
                                <div
                                    key={c.id}
                                    onClick={() => setActiveConvId(c.id)}
                                    className={`p-4 border-b border-gray-50 cursor-pointer transition-all hover:bg-gray-50 flex gap-4 ${active ? 'bg-green-50' : ''}`}
                                >
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
                                        {initial}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-gray-900 truncate">{otherName}</h3>
                                            <span className="text-xs text-gray-400">{lastMsgTime}</span>
                                        </div>
                                        <p className={`text-sm truncate ${active ? 'text-green-700 font-medium' : 'text-gray-500'}`}>
                                            {c.last_message ? c.last_message.content : t('chat.startConversation')}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    {conversations.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400 p-8 text-center">
                            <span className="text-4xl mb-2">ðŸ’¬</span>
                            <p>{t('chat.empty')}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col bg-[#e5ddd5] ${!activeConvId ? 'hidden md:flex' : 'flex'}`}>
                {activeConvId ? (
                    <>
                        <div className="p-3 border-b border-gray-200 flex items-center gap-4 bg-white shadow-sm z-10">
                            <button onClick={() => setActiveConvId(null)} className="md:hidden text-gray-500 p-2">
                                â†
                            </button>
                            {(() => {
                                const activeConv = conversations.find(c => c.id === activeConvId);
                                const name = activeConv ? getOtherParticipant(activeConv) : t('chat.messages');
                                return (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                                            {name[0]?.toUpperCase()}
                                        </div>
                                        <h3 className="font-bold text-gray-800">{name}</h3>
                                    </div>
                                );
                            })()}
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-2 relative">
                            {/* Background Pattern Overlay (Optional) */}
                            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4a5568 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                            {messages.map((msg, idx) => {
                                const isMe = msg.sender === currentUserId;
                                const showTime = idx === 0 || (new Date(msg.timestamp).getTime() - new Date(messages[idx - 1].timestamp).getTime() > 300000); // 5 min gap

                                return (
                                    <div key={msg.id}>
                                        {showTime && (
                                            <div className="flex justify-center my-4">
                                                <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded shadow-sm">
                                                    {new Date(msg.timestamp).toLocaleString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        )}
                                        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[75%] md:max-w-[60%] p-3 rounded-xl shadow-sm relative text-sm md:text-base ${isMe
                                                ? 'bg-[#dcf8c6] text-gray-900 rounded-tr-none'
                                                : 'bg-white text-gray-900 rounded-tl-none'
                                                }`}>
                                                <p>{msg.content}</p>
                                                <span className={`text-[10px] block text-right mt-1 ${isMe ? 'text-green-800' : 'text-gray-400'}`}>
                                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-3 bg-white">
                            <form onSubmit={handleSend} className="flex gap-2 items-center max-w-4xl mx-auto">
                                <input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="flex-1 bg-gray-100 text-gray-900 border-none px-6 py-3 rounded-full focus:ring-1 focus:ring-green-500 outline-none transition-all placeholder-gray-500"
                                    placeholder={t('chat.typeMessage')}
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-green-700 transition-transform hover:scale-105 shadow disabled:opacity-50 disabled:scale-100"
                                >
                                    âž¤
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-100 border-l border-gray-200">
                        <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-6xl mb-6 text-gray-400">
                            ðŸ“±
                        </div>
                        <h2 className="text-2xl font-light text-gray-600 mb-2">{t('chat.webTitle')}</h2>
                        <p className="text-sm">{t('chat.selectConversation')}</p>
                        <div className="mt-8 h-1 w-64 bg-gray-300 rounded-full"></div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading chat...</div>}>
            <ChatContent />
        </Suspense>
    );
}


