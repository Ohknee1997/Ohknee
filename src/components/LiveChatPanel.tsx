import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Volume2,
  VolumeX,
  Minimize2,
  Maximize2,
  Flame,
  MessageSquare,
  Users,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: string;
  name: string;
  handle: string;
  avatar: string;
  color: string;
  badge: string;
  text: string;
  timestamp: string;
}

interface ChatRoom {
  id: string;
  name: string;
  flag: string;
  users: string;
}

const ROOMS: ChatRoom[] = [
  { id: 'general', name: 'Cooked: Main Lounge', flag: '🟢', users: '41,567' },
  { id: 'scrap', name: 'Scrap Copper & 5G', flag: '⚡', users: '18,294' },
  { id: 'politics', name: 'GOP vs DNC Tweakers', flag: '🇺🇸', users: '32,105' },
  { id: 'parking', name: 'Waffle House 24/7', flag: '🧇', users: '9,441' },
];

const SPEAKERS: Record<string, { name: string; handle: string; avatar: string; color: string; badge: string }> = {
  dale: { name: 'AutisticEDDIE', handle: '@AutisticEDDIE', avatar: '🧢', color: '#ef4444', badge: 'GOP TWEAKER' },
  crystal: { name: 'BORINGBUNNY', handle: '@BORINGBUNNY', avatar: '🐰', color: '#3b82f6', badge: 'DNC CRACKHEAD' },
  tammy: { name: 'METHINMYVIENS', handle: '@METHINMYVIENS', avatar: '⚡', color: '#f43f5e', badge: 'MAGA CRACKHEAD' },
  hunter: { name: 'Deeppockets6', handle: '@Deeppockets6', avatar: '💸', color: '#06b6d4', badge: 'DEMOCRAT TWEAKER' },
};

const SCRIPT_CONVERSATIONS = [
  [
    { speaker: 'dale', text: 'I HAVE BEEN AWAKE FOR 11 DAYS STRIPPING THE WIRING OUT OF THIS CHEVY MALIBU! IF TRUMP WAS IN OFFICE THE SCRAP COPPER PRICES WOULD BE $14 A POUND INSTEAD OF THIS SLEEPY JOE RECESSION!' },
    { speaker: 'crystal', text: 'AutisticEDDIE you uneducated fascist bootlicker! Taking that copper without a union card is micro-aggression! Bernie Sanders told me in my glass pipe that universal healthcare covers free butane torches for the working class!' },
    { speaker: 'tammy', text: 'BORINGBUNNY SHUT UP YOUR SOY-BOY DEMOCRATS INSTALLED 5G MICROCHIPS IN THE CRACK VIALS! GEORGE WASHINGTON HIMSELF JUST SPOKE TO ME THROUGH THE MICROWAVE CLOCK WHILE I WAS SCRAPING RESIN!' },
    { speaker: 'hunter', text: 'METHINMYVIENS your microwave is emitting carbon emissions that violate the Paris Climate Accord! I offset my crack smoking by riding a stolen CitiBike backwards through the Taco Bell drive-thru!' },
  ],
  [
    { speaker: 'tammy', text: 'I saw three ballot harvesters hiding in the dumpster behind the Dollar General at 4:30 AM! They were disguising themselves as stray possums to steal the county commissioner race!' },
    { speaker: 'hunter', text: 'Those weren\'t ballot harvesters METHINMYVIENS, that was literally me and my polyamorous drum circle looking for discarded lithium vape batteries to power our decentralized socialist compost grid!' },
    { speaker: 'dale', text: 'Deeppockets6 I caught you sniffing my car battery at 3 AM with a clipboard! You work for the IRS and the Department of Transportation! I\'m building a border wall around my trailer with stolen hubcaps!' },
    { speaker: 'crystal', text: 'A border wall of hubcaps?! That is peak capitalist imperialism AutisticEDDIE! Wealth redistribution means those hubcaps belong to the public sidewalk collective!' },
  ],
  [
    { speaker: 'crystal', text: 'Kamala Harris\'s laugh contains sacred 432Hz vibrations that automatically cleanse my pipe resin! The Democratic party is aligning the third-eye chakras of all under-housed nocturnal street philosophers!' },
    { speaker: 'tammy', text: 'BORINGBUNNY you are possessed by cultural Marxism! The REAL deep state is putting fluoride in the gas station slushies to make red-blooded patriots too tired to vacuum their carpets at 5 AM with the lights off!' },
    { speaker: 'dale', text: 'WHO IS TALKING ABOUT VACUUMING AT 5 AM?! I JUST TOOK APART MY ENTIRE CEILING FAN TO FIND THE FBI BUG! 74 SCREWS ON THE CARPET AND NOT A SINGLE ONE IS METRIC!' },
    { speaker: 'hunter', text: 'AutisticEDDIE the imperial measurement system was invented by big oil oligarchs! If we switched to the metric system my dealer would have to give me 1.0 grams instead of a skimpy 0.7 baggie!' },
  ],
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-0',
    sender: 'sponsor',
    name: 'OHKNEE LIVE CHAT',
    handle: '@LiveLobby',
    avatar: '⚡',
    color: '#f59e0b',
    badge: 'COMMUNITY',
    text: 'Welcome to Ohknee Community Chatroom. Talk strategies, verify cashout drops, and share bonus codes.',
    timestamp: '11:12:00',
  },
  {
    id: 'msg-1',
    sender: 'dale',
    name: 'AutisticEDDIE',
    handle: '@AutisticEDDIE',
    avatar: '🧢',
    color: '#ef4444',
    badge: 'GOP TWEAKER',
    text: 'I JUST WITHDREW 25$ OFF STAKE.US AND BOUGHT 4 GALLONS OF INDUSTRIAL GRADE CARBURETOR CLEANER!',
    timestamp: '11:12:15',
  },
  {
    id: 'msg-2',
    sender: 'crystal',
    name: 'BORINGBUNNY',
    handle: '@BORINGBUNNY',
    avatar: '🐰',
    color: '#3b82f6',
    badge: 'DNC CRACKHEAD',
    text: 'AutisticEDDIE that carburetor cleaner should be taxed at 90% to fund community gardens behind the Circle K!',
    timestamp: '11:12:30',
  },
];

const QUICK_EMOJIS = ['😂', '🔥', '💀', '💸', '⚡', '🦅', '🧢', '👀', '💯'];

interface LiveChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isDocked?: boolean;
  onToggleDock?: () => void;
}

export const LiveChatPanel: React.FC<LiveChatPanelProps> = ({
  isOpen,
  onClose,
  isDocked = false,
  onToggleDock,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [currentRoom, setCurrentRoom] = useState<ChatRoom>(ROOMS[0]);
  const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);
  const [onlineCount, setOnlineCount] = useState(41567);

  const scriptGroupRef = useRef(0);
  const scriptIndexRef = useRef(0);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);
  const nextMsgTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-fluctuate online count
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount((c) => c + Math.floor(Math.random() * 7) - 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Play micro synth sound for message
  const playSound = (freq = 700, duration = 0.04) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio context restricted or muted
    }
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typingUser, isOpen]);

  // Automated lively chat engine
  useEffect(() => {
    if (!isOpen) {
      if (nextMsgTimeoutRef.current) clearTimeout(nextMsgTimeoutRef.current);
      setTypingUser(null);
      return;
    }

    const scheduleNext = () => {
      const delay = Math.floor(Math.random() * 5000) + 8000;
      nextMsgTimeoutRef.current = setTimeout(() => {
        const group = SCRIPT_CONVERSATIONS[scriptGroupRef.current % SCRIPT_CONVERSATIONS.length];
        const line = group[scriptIndexRef.current % group.length];
        const speaker = SPEAKERS[line.speaker];

        setTypingUser(`${speaker.name} is typing...`);

        setTimeout(() => {
          const now = new Date().toTimeString().split(' ')[0];
          const newMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            sender: line.speaker,
            name: speaker.name,
            handle: speaker.handle,
            avatar: speaker.avatar,
            color: speaker.color,
            badge: speaker.badge,
            text: line.text,
            timestamp: now,
          };

          setMessages((prev) => [...prev.slice(-45), newMsg]);
          playSound(line.speaker === 'dale' ? 600 : 800, 0.05);

          scriptIndexRef.current += 1;
          if (scriptIndexRef.current >= group.length) {
            scriptIndexRef.current = 0;
            scriptGroupRef.current += 1;
          }

          setTypingUser(null);
          scheduleNext();
        }, 2200);
      }, delay);
    };

    scheduleNext();

    return () => {
      if (nextMsgTimeoutRef.current) clearTimeout(nextMsgTimeoutRef.current);
    };
  }, [isOpen, soundEnabled]);

  // Send user message
  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const now = new Date().toTimeString().split(' ')[0];
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'me',
      name: 'You (Anonymous)',
      handle: '@You',
      avatar: '🌟',
      color: '#f59e0b',
      badge: 'MEMBER',
      text: inputText.trim(),
      timestamp: now,
    };

    setMessages((prev) => [...prev.slice(-45), userMsg]);
    setInputText('');
    playSound(950, 0.06);
  };

  // Trigger Beef interactive feature
  const handleTriggerBeef = () => {
    const group = SCRIPT_CONVERSATIONS[Math.floor(Math.random() * SCRIPT_CONVERSATIONS.length)];
    const now = new Date().toTimeString().split(' ')[0];
    const item1 = group[0];
    const item2 = group[1];
    const sp1 = SPEAKERS[item1.speaker];
    const sp2 = SPEAKERS[item2.speaker];

    const msg1: ChatMessage = {
      id: `beef-1-${Date.now()}`,
      sender: item1.speaker,
      name: sp1.name,
      handle: sp1.handle,
      avatar: sp1.avatar,
      color: sp1.color,
      badge: sp1.badge,
      text: item1.text,
      timestamp: now,
    };

    const msg2: ChatMessage = {
      id: `beef-2-${Date.now() + 1}`,
      sender: item2.speaker,
      name: sp2.name,
      handle: sp2.handle,
      avatar: sp2.avatar,
      color: sp2.color,
      badge: sp2.badge,
      text: item2.text,
      timestamp: now,
    };

    setMessages((prev) => [...prev.slice(-45), msg1, msg2]);
    playSound(1100, 0.1);
  };

  if (!isOpen) return null;

  return (
    <aside
      id="live-chat-panel"
      className={`fixed z-40 flex flex-col bg-[#0b0f19] border-slate-800 shadow-2xl transition-all duration-300 ${
        isDocked
          ? 'top-14 right-0 bottom-0 w-80 lg:w-96 border-l'
          : 'bottom-0 right-0 sm:bottom-4 sm:right-4 w-full sm:w-96 h-[85vh] sm:h-[620px] max-h-[95vh] rounded-t-2xl sm:rounded-2xl border'
      }`}
    >
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-[#0f172a] px-3.5 py-2.5">
        {/* Room selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsRoomDropdownOpen(!isRoomDropdownOpen)}
            className="flex items-center gap-2 rounded-lg bg-slate-900 border border-slate-700/80 px-2.5 py-1 text-xs font-bold text-white hover:border-amber-400/50 transition-colors"
          >
            <span>{currentRoom.flag}</span>
            <span className="truncate max-w-[140px]">{currentRoom.name}</span>
            <ChevronDown size={12} className="text-slate-400" />
          </button>

          {isRoomDropdownOpen && (
            <div className="absolute left-0 top-full mt-1 w-52 rounded-xl bg-slate-900 border border-slate-700 p-1 shadow-2xl z-50 animate-in fade-in duration-150">
              {ROOMS.map((room) => (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => {
                    setCurrentRoom(room);
                    setIsRoomDropdownOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-left transition-colors ${
                    currentRoom.id === room.id
                      ? 'bg-amber-500/15 text-amber-300 font-bold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span>{room.flag}</span>
                    <span>{room.name}</span>
                  </span>
                  <span className="text-[10px] text-slate-500">{room.users}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live status + controls */}
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{onlineCount.toLocaleString()}</span>
          </span>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1 rounded-md text-slate-400 hover:text-white transition-colors"
            title={soundEnabled ? 'Mute audio' : 'Unmute audio'}
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>

          {/* Dock / Undock (Desktop only) */}
          {onToggleDock && (
            <button
              type="button"
              onClick={onToggleDock}
              className="hidden lg:block p-1 rounded-md text-slate-400 hover:text-white transition-colors"
              title={isDocked ? 'Float window' : 'Dock to sidebar'}
            >
              {isDocked ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>
          )}

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white transition-colors"
            title="Close chat"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 no-scrollbar text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-xl p-2.5 border transition-all ${
              msg.sender === 'me'
                ? 'bg-amber-500/10 border-amber-500/30 ml-4'
                : msg.sender === 'sponsor'
                ? 'bg-slate-900/90 border-amber-500/40 text-amber-200'
                : 'bg-slate-900/60 border-slate-800/80 mr-4'
            }`}
          >
            {/* Sender row */}
            <div className="flex items-center justify-between gap-1 mb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">{msg.avatar}</span>
                <span
                  className="font-bold text-[11px] truncate max-w-[130px]"
                  style={{ color: msg.color }}
                >
                  {msg.name}
                </span>
                {msg.badge && (
                  <span className="rounded bg-slate-800 px-1 py-0.5 text-[8px] font-black tracking-wider text-slate-400 border border-slate-700/60">
                    {msg.badge}
                  </span>
                )}
              </div>
              <span className="text-[9px] text-slate-500 font-mono">
                {msg.timestamp}
              </span>
            </div>

            {/* Message Body */}
            <p className="text-slate-200 leading-relaxed break-words text-[11.5px]">
              {msg.text}
            </p>
          </div>
        ))}

        {/* Typing indicator */}
        {typingUser && (
          <div className="flex items-center gap-1.5 text-[11px] text-amber-400/80 italic px-2 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
            <span>{typingUser}</span>
          </div>
        )}

        <div ref={chatMessagesEndRef} />
      </div>

      {/* Quick Action Tools: Emojis + Trigger Beef */}
      <div className="border-t border-slate-800/80 bg-[#0f172a]/90 px-3 py-1.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setInputText((t) => t + emoji)}
              className="text-xs p-1 hover:scale-125 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleTriggerBeef}
          className="flex items-center gap-1 rounded bg-red-500/20 border border-red-500/40 px-2 py-0.5 text-[10px] font-black text-red-300 hover:bg-red-500/30 transition-colors whitespace-nowrap active:scale-95 cursor-pointer"
          title="Simulate debate beef"
        >
          <Flame size={11} />
          <span>Beef</span>
        </button>
      </div>

      {/* Message Input Bar */}
      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2 border-t border-slate-800 bg-[#0b0f19] p-2.5"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Send a chat message..."
          className="flex-1 rounded-xl bg-slate-900 border border-slate-700/80 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400 text-slate-950 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <Send size={14} />
        </button>
      </form>
    </aside>
  );
};
