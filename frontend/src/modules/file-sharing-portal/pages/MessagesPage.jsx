import { useState } from 'react';

const MessagesPage = () => {
    const [selectedConversation, setSelectedConversation] = useState(0);
    const [messageText, setMessageText] = useState('');

    const conversations = [
        {
            id: 0,
            name: 'Marcus Sterling, Esq.',
            firm: 'Sterling & Associates Law Firm',
            caseId: 'NY-2024-0812',
            avatar: 'https://via.placeholder.com/48',
            lastMessage: "The patient's history doesn't seem to correlate with...",
            time: '2m ago',
            online: true,
            unread: true
        },
        {
            id: 1,
            name: 'Elena Rodriguez',
            firm: null,
            caseId: 'CA-2023-9901',
            avatar: 'https://via.placeholder.com/48',
            lastMessage: "I've uploaded the surgical logs from last July...",
            time: '4h ago',
            online: false,
            unread: false
        },
        {
            id: 2,
            name: 'John Wentworth',
            firm: null,
            caseId: 'FL-2024-1102',
            avatar: null,
            initials: 'JW',
            lastMessage: 'Thank you for the detailed timeline report.',
            time: 'Yesterday',
            online: false,
            unread: false
        }
    ];

    const currentMessages = [
        {
            sender: 'Marcus Sterling, Esq.',
            avatar: 'https://via.placeholder.com/32',
            message: "Sarah, I've reviewed the preliminary timeline you sent. Could you take a closer look at the 14:00 entry on the day of the procedure? The anesthesiology logs don't seem to match the surgeon's notes regarding the titration of the sedative.",
            time: '10:42 AM',
            isOwn: false
        },
        {
            sender: 'Sarah Jenkins, RN',
            avatar: 'https://via.placeholder.com/32',
            message: "Good catch, Marcus. I noticed that discrepancy as well. I'm cross-referencing with the pharmacy dispensing records right now to see exactly when the medication left the cabinet.",
            time: '11:15 AM',
            isOwn: true,
            attachment: { name: 'Med_Logs_v2.pdf', size: '2.4 MB' }
        },
        {
            sender: 'Marcus Sterling, Esq.',
            avatar: 'https://via.placeholder.com/32',
            message: "Excellent. If the pharmacy timestamps contradict the surgeon's deposition, that's a significant pivot point for the cross-examination next week. Keep me updated.",
            time: '11:30 AM',
            isOwn: false
        }
    ];

    const attachments = [
        { name: 'Hospital_Discharge_A1.pdf', date: 'Aug 12', size: '1.2 MB', icon: 'picture_as_pdf', color: 'red' },
        { name: 'Surgical_Notes_Final.pdf', date: 'Aug 14', size: '4.8 MB', icon: 'picture_as_pdf', color: 'red' }
    ];

    const handleSendMessage = () => {
        if (messageText.trim()) {
            // Handle message send
            setMessageText('');
        }
    };

    return (
        <div className="h-screen overflow-hidden bg-background-light dark:bg-background-dark flex">
            {/* Sidebar: Global Navigation */}
            <aside className="w-20 lg:w-64 border-r border-primary/10 bg-white dark:bg-[#0b1618] flex flex-col items-center lg:items-start">
                <div className="p-6 flex items-center gap-3 w-full">
                    <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center text-white">
                        <span className="material-icons">medical_services</span>
                    </div>
                    <span className="hidden lg:block font-bold text-xl tracking-tight text-primary">MedLegal<span className="text-slate-400">Hub</span></span>
                </div>
                <nav className="mt-4 flex-1 w-full px-4 space-y-2">
                    <a className="flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-primary transition-colors rounded-lg group" href="#">
                        <span className="material-icons">dashboard</span>
                        <span className="hidden lg:block font-medium">Dashboard</span>
                    </a>
                    <a className="flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-primary transition-colors rounded-lg" href="#">
                        <span className="material-icons">folder</span>
                        <span className="hidden lg:block font-medium">Active Cases</span>
                    </a>
                    <a className="flex items-center gap-4 px-4 py-3 bg-primary/10 text-primary transition-colors rounded-lg" href="#">
                        <span className="material-icons">forum</span>
                        <span className="hidden lg:block font-medium">Messages</span>
                    </a>
                    <a className="flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-primary transition-colors rounded-lg" href="#">
                        <span className="material-icons">description</span>
                        <span className="hidden lg:block font-medium">Medical Records</span>
                    </a>
                    <div className="pt-4 border-t border-primary/5">
                        <a className="flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-primary transition-colors rounded-lg" href="#">
                            <span className="material-icons">settings</span>
                            <span className="hidden lg:block font-medium">Account Settings</span>
                        </a>
                    </div>
                </nav>
                <div className="p-4 w-full border-t border-primary/5">
                    <div className="flex items-center gap-3 p-2 bg-primary/5 rounded-xl">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600"></div>
                        <div className="hidden lg:block overflow-hidden">
                            <p className="text-xs font-bold truncate">Sarah Jenkins, RN</p>
                            <p className="text-[10px] text-primary">Senior Consultant</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Left Pane: Conversation List */}
            <main className="flex-1 flex overflow-hidden">
                <div className="w-80 lg:w-96 border-r border-primary/10 flex flex-col bg-white/50 dark:bg-[#0d1a1c]">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Messages</h2>
                            <button className="p-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors">
                                <span className="material-icons text-sm">edit</span>
                            </button>
                        </div>
                        <div className="relative">
                            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">search</span>
                            <input
                                className="w-full bg-background-light dark:bg-background-dark border-none rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary placeholder-slate-500"
                                placeholder="Search attorneys or cases..."
                                type="text"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {conversations.map((conv) => (
                            <div
                                key={conv.id}
                                className={`px-4 py-3 cursor-pointer ${selectedConversation === conv.id ? 'bg-primary/5 border-l-4 border-primary' : 'hover:bg-white/5 border-l-4 border-transparent'}`}
                                onClick={() => setSelectedConversation(conv.id)}
                            >
                                <div className="flex gap-3">
                                    <div className="relative shrink-0">
                                        {conv.avatar ? (
                                            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600"></div>
                                        ) : (
                                            <div className="h-12 w-12 bg-slate-700 rounded-lg flex items-center justify-center text-slate-300 font-bold">
                                                {conv.initials}
                                            </div>
                                        )}
                                        {conv.online && (
                                            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-[#0d1a1c] rounded-full"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-0.5">
                                            <h3 className="font-semibold text-sm truncate">{conv.name}</h3>
                                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{conv.time}</span>
                                        </div>
                                        <p className="text-xs text-primary font-medium mb-1 truncate italic">Case #{conv.caseId}</p>
                                        <p className="text-xs text-slate-400 truncate">{conv.lastMessage}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-primary/5 m-4 rounded-xl border border-primary/10">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="material-icons text-primary text-sm">verified_user</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">HIPAA COMPLIANT</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-tight">All messages and files are end-to-end encrypted and meet federal security standards.</p>
                    </div>
                </div>

                {/* Right Pane: Message Thread */}
                <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark relative">
                    {/* Thread Header */}
                    <header className="h-20 shrink-0 border-b border-primary/10 flex items-center justify-between px-8 bg-white/30 dark:bg-[#0b1618]/30 backdrop-blur-sm z-10">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
                                <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 border-2 border-background-dark rounded-full"></div>
                            </div>
                            <div>
                                <h2 className="font-bold text-lg leading-tight">Marcus Sterling, Esq.</h2>
                                <p className="text-xs text-primary flex items-center gap-1">
                                    <span className="material-icons text-[10px]">gavel</span>
                                    Sterling & Associates Law Firm | Case #NY-2024-0812
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                                <span className="material-icons">videocam</span>
                            </button>
                            <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                                <span className="material-icons">phone</span>
                            </button>
                            <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                                <span className="material-icons">more_vert</span>
                            </button>
                        </div>
                    </header>

                    {/* Messages Content */}
                    <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
                        <div className="flex justify-center my-4">
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-800/30 px-3 py-1 rounded-full uppercase tracking-tighter">
                                Tuesday, August 15th
                            </span>
                        </div>
                        {currentMessages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-4 max-w-2xl ${msg.isOwn ? 'self-end flex-row-reverse' : ''}`}>
                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 shrink-0"></div>
                                <div className={`flex flex-col ${msg.isOwn ? 'items-end' : ''}`}>
                                    <div className={`${msg.isOwn ? 'bg-primary text-white' : 'bg-white dark:bg-[#1a2b2f]'} p-4 rounded-xl ${msg.isOwn ? 'rounded-tr-none' : 'rounded-tl-none'} shadow-sm`}>
                                        <p className="text-sm leading-relaxed">{msg.message}</p>
                                    </div>
                                    {msg.attachment && (
                                        <div className="mt-2 flex gap-2">
                                            <div className="bg-white/5 border border-primary/20 rounded-lg p-2 flex items-center gap-3 w-48">
                                                <div className="h-8 w-8 bg-red-500/20 text-red-500 rounded flex items-center justify-center">
                                                    <span className="material-icons text-sm">picture_as_pdf</span>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] font-bold truncate">{msg.attachment.name}</p>
                                                    <p className="text-[9px] text-slate-500 uppercase">{msg.attachment.size}</p>
                                                </div>
                                                <span className="material-icons text-slate-500 text-xs ml-auto">download</span>
                                            </div>
                                        </div>
                                    )}
                                    <span className="text-[10px] text-slate-500 mt-1 block px-1">{msg.time} {msg.isOwn && '· Read'}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Message Input Area */}
                    <div className="p-6 bg-white/30 dark:bg-[#0b1618]/30 backdrop-blur-md border-t border-primary/10">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-center gap-2 mb-2 px-2">
                                <button className="p-1.5 text-slate-400 hover:text-primary transition-colors hover:bg-primary/10 rounded">
                                    <span className="material-icons text-sm">format_bold</span>
                                </button>
                                <button className="p-1.5 text-slate-400 hover:text-primary transition-colors hover:bg-primary/10 rounded">
                                    <span className="material-icons text-sm">format_italic</span>
                                </button>
                                <button className="p-1.5 text-slate-400 hover:text-primary transition-colors hover:bg-primary/10 rounded">
                                    <span className="material-icons text-sm">format_list_bulleted</span>
                                </button>
                                <div className="w-px h-4 bg-primary/10 mx-1"></div>
                                <button className="p-1.5 text-slate-400 hover:text-primary transition-colors hover:bg-primary/10 rounded">
                                    <span className="material-icons text-sm">attach_file</span>
                                </button>
                                <button className="p-1.5 text-slate-400 hover:text-primary transition-colors hover:bg-primary/10 rounded">
                                    <span className="material-icons text-sm">image</span>
                                </button>
                            </div>
                            <div className="relative flex items-end gap-4 bg-white dark:bg-background-dark border border-primary/20 rounded-xl p-2 shadow-inner">
                                <textarea
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 px-4 resize-none h-12 max-h-32"
                                    placeholder="Type your secure message..."
                                    rows="1"
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                ></textarea>
                                <button
                                    className="bg-primary hover:bg-primary/80 text-white h-10 w-10 rounded-lg flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-primary/20 shrink-0"
                                    onClick={handleSendMessage}
                                >
                                    <span className="material-icons">send</span>
                                </button>
                            </div>
                            <div className="mt-2 flex items-center justify-center gap-2 opacity-40">
                                <span className="material-icons text-[10px]">lock</span>
                                <span className="text-[10px] uppercase tracking-[0.2em]">End-to-End Encrypted</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Pane: File Drawer (Desktop only) */}
                <div className="hidden xl:flex w-72 border-l border-primary/10 flex-col bg-white/20 dark:bg-[#091214]">
                    <div className="p-6 border-b border-primary/10">
                        <h3 className="font-bold text-sm flex items-center gap-2">
                            <span className="material-icons text-primary text-sm">inventory_2</span>
                            Case Attachments
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-4">
                            <div className="group cursor-pointer">
                                <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Medical Records</p>
                                {attachments.map((file, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/10 transition-colors">
                                        <div className={`h-10 w-10 bg-${file.color}-500/10 text-${file.color}-500 rounded flex items-center justify-center`}>
                                            <span className="material-icons">{file.icon}</span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold truncate">{file.name}</p>
                                            <p className="text-[10px] text-slate-500">{file.date} · {file.size}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="group cursor-pointer">
                                <p className="text-[10px] text-slate-500 font-bold uppercase mb-2 mt-4">Images & Scans</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="aspect-square bg-slate-800 rounded-lg overflow-hidden border border-primary/10 relative group">
                                        <div className="h-full w-full bg-gradient-to-br from-slate-700 to-slate-900 opacity-60 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40">
                                            <span className="material-icons text-white text-sm">visibility</span>
                                        </div>
                                    </div>
                                    <div className="aspect-square bg-slate-800 rounded-lg overflow-hidden border border-primary/10 relative group">
                                        <div className="h-full w-full bg-gradient-to-br from-slate-700 to-slate-900 opacity-60 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40">
                                            <span className="material-icons text-white text-sm">visibility</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border-t border-primary/10">
                        <button className="w-full py-2.5 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors">
                            <span className="material-icons text-sm">cloud_download</span>
                            Download Case Bundle
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MessagesPage;
