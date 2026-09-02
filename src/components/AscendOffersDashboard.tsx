import React, { useState, useMemo } from 'react';
import {
  Rocket,
  Zap,
  Sparkles,
  Trophy,
  Shield,
  Award,
  ChevronRight,
  ChevronLeft,
  Search,
  Check,
  Plus,
  ArrowRight,
  Gamepad2,
  DollarSign,
  TrendingUp,
  Smartphone,
  Monitor,
  Apple,
  Grid,
  ChevronDown,
  Layers,
  MessageSquare,
  Send,
  Users
} from 'lucide-react';
import { CardData } from '../types';

interface AscendOffersDashboardProps {
  onSelectOffer?: (offer: CardData) => void;
  onExploreEarn?: () => void;
}

type RankFilter = 'all' | 'gold' | 'silver' | 'bronze';
type PlatformFilter = 'all' | 'ios' | 'android' | 'pc';

interface AscendCard {
  id: string;
  title: string;
  payout: number;
  rank: 'gold' | 'silver' | 'bronze';
  category: 'featured' | 'fast' | 'finance' | 'signup' | 'puzzles';
  image: string;
  platforms: ('ios' | 'android' | 'pc')[];
  tag?: string;
  isAscendSpecial?: boolean;
  isViewMore?: boolean;
}

const ASCEND_CARDS: AscendCard[] = [
  {
    id: 'ascend-special-1',
    title: 'ASCEND',
    payout: 0,
    rank: 'gold',
    category: 'featured',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
    platforms: ['android', 'ios'],
    tag: 'EARN NOW',
    isAscendSpecial: true,
  },
  {
    id: 'raid-shadow-legends',
    title: 'Raid Shadow Legends',
    payout: 632.35,
    rank: 'gold',
    category: 'featured',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&auto=format&fit=crop&q=80',
    platforms: ['pc', 'android'],
    tag: 'RPG BATTLE',
  },
  {
    id: 'klondike-adventures',
    title: 'Klondike Adventures',
    payout: 276.64,
    rank: 'gold',
    category: 'featured',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&auto=format&fit=crop&q=80',
    platforms: ['android', 'ios'],
    tag: 'FARM & BUILD',
  },
  {
    id: 'legend-of-mushroom',
    title: 'Legend of Mushroom',
    payout: 87.30,
    rank: 'silver',
    category: 'featured',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=300&auto=format&fit=crop&q=80',
    platforms: ['android', 'ios'],
    tag: 'IDLE ADVENTURE',
  },
  {
    id: 'arrows-puzzle',
    title: 'Arrows - Puzzle Challenge',
    payout: 242.38,
    rank: 'gold',
    category: 'featured',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&auto=format&fit=crop&q=80',
    platforms: ['android', 'ios'],
    tag: 'LOGIC SOLVER',
  },
  {
    id: 'battle-legion',
    title: 'Battle Legion: 100v100',
    payout: 194.00,
    rank: 'silver',
    category: 'featured',
    image: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=300&auto=format&fit=crop&q=80',
    platforms: ['android', 'ios'],
    tag: 'MASSIVE AUTO',
  },
  {
    id: 'wild-survival',
    title: 'Wild Survival - Idle Defense',
    payout: 664.58,
    rank: 'gold',
    category: 'featured',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80',
    platforms: ['android'],
    tag: 'TOWER DEFENSE',
  },
  {
    id: 'afk-journey',
    title: 'AFK Journey',
    payout: 256.28,
    rank: 'gold',
    category: 'featured',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=300&auto=format&fit=crop&q=80',
    platforms: ['android', 'ios', 'pc'],
    tag: 'OPEN WORLD RPG',
  },
  {
    id: 'monopoly-go',
    title: 'Monopoly GO!',
    payout: 216.97,
    rank: 'silver',
    category: 'featured',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&auto=format&fit=crop&q=80',
    platforms: ['android', 'ios'],
    tag: 'BOARD BUILDER',
  },
  {
    id: 'match-masters',
    title: 'Match Masters PvP',
    payout: 45.52,
    rank: 'bronze',
    category: 'featured',
    image: 'https://images.unsplash.com/photo-1612287233207-6f81c96766df?w=300&auto=format&fit=crop&q=80',
    platforms: ['android', 'ios'],
    tag: 'MATCH 3 PVP',
  },
  {
    id: 'solitaire-cash',
    title: 'Solitaire Cash',
    payout: 38.50,
    rank: 'bronze',
    category: 'featured',
    image: 'https://images.unsplash.com/photo-1516116211227-bbc2f7902d1a?w=300&auto=format&fit=crop&q=80',
    platforms: ['ios'],
    tag: 'CLASSIC SKILL',
  },
];

const CHAT_MESSAGES = [
  { user: 'PrincessPeach7', text: 'Aido is everywhere', time: '09:10', color: 'text-pink-400' },
  { user: 'awesometrout', text: 'All the prime ones for ascend give bad links for me', time: '09:12', color: 'text-cyan-400' },
  { user: 'MoonMiles.io', text: 'sup goat', time: '09:14', color: 'text-amber-400' },
  { user: 'Aido77', text: 'I am nowhere 🗿', time: '09:14', color: 'text-purple-400' },
  { user: 'brsay', text: 'Won $313.33 on daily SC rush!!', time: '09:19', color: 'text-emerald-400' },
  { user: 'Spockk', text: 'Ascend hub gold slots give the crazy multiplier', time: '09:20', color: 'text-blue-400' },
];

export const AscendOffersDashboard: React.FC<AscendOffersDashboardProps> = ({
  onSelectOffer,
  onExploreEarn,
}) => {
  const [selectedRank, setSelectedRank] = useState<RankFilter>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [slottedOffers, setSlottedOffers] = useState<string[]>([
    'raid-shadow-legends',
    'klondike-adventures',
  ]);
  const [isAscending, setIsAscending] = useState(false);
  const [ascendCompleted, setAscendCompleted] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [liveChat, setLiveChat] = useState(CHAT_MESSAGES);

  // Filtered Cards
  const filteredCards = useMemo(() => {
    return ASCEND_CARDS.filter((card) => {
      if (card.isAscendSpecial) return true;
      if (selectedRank !== 'all' && card.rank !== selectedRank) return false;
      if (selectedPlatform !== 'all' && !card.platforms.includes(selectedPlatform as any)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return card.title.toLowerCase().includes(q) || card.tag?.toLowerCase().includes(q);
      }
      return true;
    });
  }, [selectedRank, selectedPlatform, searchQuery]);

  const handleToggleSlot = (cardId: string) => {
    if (slottedOffers.includes(cardId)) {
      setSlottedOffers((prev) => prev.filter((id) => id !== cardId));
    } else {
      if (slottedOffers.length < 5) {
        setSlottedOffers((prev) => [...prev, cardId]);
      }
    }
  };

  const handleAscendClick = () => {
    if (slottedOffers.length === 0) return;
    setIsAscending(true);
    setTimeout(() => {
      setIsAscending(false);
      setAscendCompleted(true);
      setTimeout(() => setAscendCompleted(false), 3500);
    }, 1200);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setLiveChat((prev) => [
      ...prev,
      {
        user: 'You',
        text: chatInput.trim(),
        time: 'Just now',
        color: 'text-purple-400',
      },
    ]);
    setChatInput('');
  };

  const rankBadgeStyle = (rank: 'gold' | 'silver' | 'bronze') => {
    switch (rank) {
      case 'gold':
        return 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-yellow-300 border-yellow-500/40';
      case 'silver':
        return 'bg-gradient-to-r from-slate-400/20 to-zinc-300/20 text-slate-200 border-slate-400/40';
      case 'bronze':
        return 'bg-gradient-to-r from-amber-700/20 to-orange-600/20 text-amber-300 border-amber-600/40';
    }
  };

  return (
    <div
      id="ascend-offers-dashboard"
      className="w-full min-h-screen bg-[#0d0f15] text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white pb-24"
    >
      {/* Top Search / Filter Bar (as seen in visual reference) */}
      <div className="w-full bg-[#12151e] border-b border-slate-800/80 px-3 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Quick Search */}
          <div className="relative w-full sm:w-80 md:w-96">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Quick search"
              className="w-full pl-10 pr-4 py-2 bg-[#1a1e2b] border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* All Offers CTA Button */}
          <button
            type="button"
            onClick={onExploreEarn}
            className="w-full sm:w-auto px-4 py-2 bg-[#9333ea] hover:bg-[#a855f7] active:bg-[#7e22ce] text-white font-black text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(147,51,234,0.35)] cursor-pointer"
          >
            <span>All Offers</span>
            <ChevronRight size={16} className="stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-6 flex flex-col lg:flex-row gap-6">
        {/* Left / Center Section: Header, Ascension Hub, Filter Tabs, Game Grid */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* 1. Header Section: Bold text titled "Ascend your Offers for Massive Rewards" with accent glow styling */}
          <div className="relative overflow-hidden p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-[#171b29] via-[#1a182d] to-[#171b29] border border-purple-500/30 shadow-[0_0_30px_rgba(147,51,234,0.12)]">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[11px] font-extrabold uppercase tracking-wider">
                  <Rocket size={13} className="text-purple-400" />
                  <span>Ascension Multiplier Live</span>
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                  Ascend your Offers for{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                    Massive Rewards
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-medium leading-relaxed">
                  Install and play 5 offers of the same rank to trigger an instant tier multiplier payout!
                </p>

                {/* Rank Bonus Badges ($3 Bonus, $1 Bonus, $5 Bonus) */}
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <div className="px-3 py-1.5 rounded-xl bg-[#1c2233] border border-amber-700/50 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-xs">
                    <Award size={14} className="text-amber-500" />
                    <span>Bronze: $1 Bonus</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-[#1c2233] border border-slate-500/50 text-slate-200 text-xs font-bold flex items-center gap-1.5 shadow-xs">
                    <Shield size={14} className="text-slate-300" />
                    <span>Silver: $3 Bonus</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-[#1c2233] border border-yellow-500/50 text-yellow-300 text-xs font-bold flex items-center gap-1.5 shadow-xs">
                    <Trophy size={14} className="text-yellow-400" />
                    <span>Gold: $5 Bonus</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Ascension Hub Panel: 5-slot offer progress grid + ASCEND OFFERS CTA */}
          <div
            id="ascension-hub-panel"
            className="p-4 sm:p-5 rounded-2xl bg-[#131722] border border-slate-800 shadow-xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
                  <Rocket size={18} />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-black tracking-wider text-white uppercase flex items-center gap-2">
                    <span>ASCENSION HUB</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {slottedOffers.length}/5 Slotted
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Select 5 verified offers below to activate tier multiplier
                  </p>
                </div>
              </div>

              {/* ASCEND OFFERS CTA Button */}
              <button
                type="button"
                onClick={handleAscendClick}
                disabled={slottedOffers.length === 0 || isAscending}
                className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  slottedOffers.length >= 5
                    ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:scale-105 active:scale-95'
                    : 'bg-purple-600/30 text-purple-300 border border-purple-500/30 hover:bg-purple-600/40'
                }`}
              >
                <Zap size={16} className={isAscending ? 'animate-spin' : 'fill-current'} />
                <span>{isAscending ? 'ASCENDING...' : 'ASCEND OFFERS'}</span>
              </button>
            </div>

            {/* 5-Slot Offer Progress Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-4">
              {[0, 1, 2, 3, 4].map((slotIdx) => {
                const cardId = slottedOffers[slotIdx];
                const card = cardId ? ASCEND_CARDS.find((c) => c.id === cardId) : null;

                return (
                  <div
                    key={slotIdx}
                    className={`relative p-2.5 rounded-xl border flex flex-col items-center justify-center text-center min-h-[95px] transition-all ${
                      card
                        ? 'bg-[#1a1f2e] border-purple-500/40 shadow-[0_0_12px_rgba(147,51,234,0.15)]'
                        : 'bg-[#10131a]/60 border-slate-800/80 border-dashed text-slate-500'
                    }`}
                  >
                    {card ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleToggleSlot(card.id)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[11px] font-black hover:bg-red-600 cursor-pointer shadow-md"
                          title="Remove slot"
                        >
                          ✕
                        </button>
                        <img
                          src={card.image}
                          alt={card.title}
                          className="w-8 h-8 rounded-lg object-cover mb-1 border border-slate-700"
                        />
                        <span className="text-[11px] font-bold text-slate-200 line-clamp-1">
                          {card.title}
                        </span>
                        <span className="text-[10px] font-black text-emerald-400">
                          ${card.payout.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-7 h-7 rounded-lg bg-slate-800/50 flex items-center justify-center mb-1 text-slate-500">
                          <Plus size={14} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">
                          Slot {slotIdx + 1}
                        </span>
                        <span className="text-[9px] text-slate-600">Empty</span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {ascendCompleted && (
              <div className="mt-3 p-2.5 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-200 text-xs font-bold text-center animate-bounce">
                🎉 Ascension Multiplier applied! Your 5-offer chain unlocked an extra Tier Bonus payout!
              </div>
            )}
          </div>

          {/* 3. Category Filter Bar (Horizontal Rank Selector) + Platform Toggles */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            {/* Rank Tabs: [All] [Gold] [Silver] [Bronze] */}
            <div className="flex items-center gap-1.5 bg-[#131722] p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedRank('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedRank === 'all'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setSelectedRank('gold')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  selectedRank === 'gold'
                    ? 'bg-yellow-500 text-slate-950 font-black shadow-xs'
                    : 'text-yellow-400/80 hover:text-yellow-300'
                }`}
              >
                <Trophy size={13} />
                <span>Gold</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRank('silver')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  selectedRank === 'silver'
                    ? 'bg-slate-300 text-slate-950 font-black shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Shield size={13} />
                <span>Silver</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRank('bronze')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  selectedRank === 'bronze'
                    ? 'bg-amber-600 text-white font-black shadow-xs'
                    : 'text-amber-400/80 hover:text-amber-300'
                }`}
              >
                <Award size={13} />
                <span>Bronze</span>
              </button>
            </div>

            {/* Platform Filter Icons (matching gem screenshot) */}
            <div className="flex items-center gap-1.5 bg-[#131722] p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedPlatform('all')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedPlatform === 'all'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="All Devices"
              >
                <Grid size={15} />
              </button>
              <button
                type="button"
                onClick={() => setSelectedPlatform('ios')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedPlatform === 'ios'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="iOS / Apple"
              >
                <Apple size={15} />
              </button>
              <button
                type="button"
                onClick={() => setSelectedPlatform('android')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedPlatform === 'android'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Android"
              >
                <Smartphone size={15} />
              </button>
              <button
                type="button"
                onClick={() => setSelectedPlatform('pc')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedPlatform === 'pc'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="PC / Desktop"
              >
                <Monitor size={15} />
              </button>
            </div>
          </div>

          {/* 4. Featured Offers Row Header (as in screenshot) */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-purple-600/20 text-purple-400">
                <Sparkles size={16} />
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">Featured</h3>
              <span className="text-xs text-slate-500 font-bold">({filteredCards.length} Offers)</span>
            </div>
          </div>

          {/* 5. Offer Grid Layout: Multi-column grid showcasing dark game cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {filteredCards.map((card) => {
              if (card.isAscendSpecial) {
                return (
                  <div
                    key={card.id}
                    onClick={onExploreEarn}
                    className="relative group rounded-2xl overflow-hidden bg-gradient-to-b from-[#3b82f6] via-[#7c3aed] to-[#9333ea] p-4 flex flex-col items-center justify-between text-center min-h-[200px] border border-purple-400/40 shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-40 pointer-events-none" />
                    <div className="relative z-10 w-full flex items-center justify-between text-[11px] font-black uppercase text-white tracking-wider">
                      <span className="bg-black/30 px-2 py-0.5 rounded-full border border-white/20">
                        {card.tag}
                      </span>
                      <Rocket size={16} />
                    </div>

                    <div className="relative z-10 my-auto flex flex-col items-center">
                      <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center text-white text-2xl shadow-xl">
                        🚀
                      </div>
                      <h4 className="mt-2 text-lg sm:text-xl font-black text-white tracking-wider">
                        ASCEND
                      </h4>
                      <p className="text-[11px] text-white/80 font-bold">Earn Multipliers</p>
                    </div>

                    <div className="relative z-10 w-full py-1.5 px-3 rounded-xl bg-white text-purple-950 font-black text-xs flex items-center justify-center gap-1 shadow-md">
                      <span>Explore Hub</span>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                );
              }

              const isSlotted = slottedOffers.includes(card.id);

              return (
                <div
                  key={card.id}
                  className="group relative rounded-2xl bg-[#131722] border border-[#242b3d] hover:border-purple-500/60 p-2.5 sm:p-3 flex flex-col justify-between transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                >
                  {/* Card Thumbnail Image */}
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Rank Badge Tag */}
                    <div
                      className={`absolute top-2 left-2 px-2 py-0.5 rounded-md border text-[10px] font-extrabold uppercase tracking-wide backdrop-blur-md ${rankBadgeStyle(
                        card.rank
                      )}`}
                    >
                      {card.rank}
                    </div>

                    {/* Slot / Add to Ascension hub check button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleSlot(card.id);
                      }}
                      className={`absolute top-2 right-2 p-1.5 rounded-lg border backdrop-blur-md transition-all cursor-pointer ${
                        isSlotted
                          ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                          : 'bg-black/40 text-slate-300 border-white/20 hover:bg-purple-600/80 hover:text-white'
                      }`}
                      title={isSlotted ? 'Slotted in Hub' : 'Add to Ascension Hub'}
                    >
                      {isSlotted ? <Check size={13} className="stroke-[3]" /> : <Plus size={13} />}
                    </button>
                  </div>

                  {/* Info */}
                  <div className="mt-2.5">
                    <h4 className="text-xs sm:text-sm font-extrabold text-white truncate group-hover:text-purple-300 transition-colors">
                      {card.title}
                    </h4>
                    <div className="mt-1 flex items-baseline justify-between">
                      <span className="text-xs sm:text-sm font-black text-emerald-400">
                        ${card.payout.toFixed(2)}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {card.tag}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectOffer) {
                        onSelectOffer({
                          id: card.id,
                          name: card.title,
                          payout: `$${card.payout.toFixed(2)}`,
                          signupUrl: '#',
                          signupLabel: 'Start Offer',
                          tabId: 'fast-easy',
                          accentRgb: '147, 51, 234',
                          sub: card.tag,
                        });
                      }
                    }}
                    className="mt-2.5 w-full py-1.5 rounded-xl bg-[#1c2233] hover:bg-purple-600/30 hover:border-purple-500/40 text-slate-200 hover:text-white border border-slate-700/60 text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <span>Claim</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              );
            })}

            {/* View More Card */}
            <div
              onClick={onExploreEarn}
              className="rounded-2xl bg-gradient-to-br from-[#1b172a] to-[#251538] border border-purple-500/40 p-4 flex flex-col items-center justify-center text-center group hover:border-purple-400 transition-all cursor-pointer min-h-[200px]"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform mb-2">
                <Grid size={24} />
              </div>
              <span className="text-sm font-black text-white">View More</span>
              <span className="text-xs text-purple-300 mt-1 flex items-center gap-1 font-bold">
                <span>Explore All</span>
                <ChevronRight size={14} />
              </span>
            </div>
          </div>

          {/* Secondary Rows: Fast Offers, Finance, Sign Up Trial, Puzzles (as in screenshot) */}
          <div className="space-y-2 pt-2">
            {[
              { title: 'My Offers', count: '208 hidden' },
              { title: 'Fast Offers', count: '14 hidden' },
              { title: 'Finance', count: '26 hidden' },
              { title: 'Sign Up Trial', count: '28 hidden' },
              { title: 'Puzzles', count: '20 hidden' },
            ].map((row, idx) => (
              <div
                key={idx}
                onClick={onExploreEarn}
                className="p-3 rounded-xl bg-[#131722] border border-slate-800/90 flex items-center justify-between text-xs hover:border-purple-500/40 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white">{row.title}</span>
                  <span className="text-slate-500 text-[11px]">({row.count})</span>
                </div>
                <span className="text-purple-400 font-bold hover:underline">Show row</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Mini Live Chat Panel (as seen in visual reference) */}
        <div className="w-full lg:w-72 xl:w-80 shrink-0">
          <div className="sticky top-20 rounded-2xl bg-[#131722] border border-slate-800 overflow-hidden flex flex-col h-[560px] shadow-xl">
            {/* Chat Header */}
            <div className="p-3.5 bg-[#171c2b] border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black text-white">Chat</span>
                <span className="text-[11px] font-bold text-slate-400">• 137</span>
              </div>
              <div className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-black flex items-center gap-1">
                <span>Chat Rain $10.59</span>
              </div>
            </div>

            {/* Chat Message List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs">
              {liveChat.map((msg, i) => (
                <div key={i} className="p-2 rounded-xl bg-[#181d2c] border border-slate-800/80">
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className={`font-extrabold ${msg.color}`}>{msg.user}</span>
                    <span className="text-slate-500">{msg.time}</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="p-2.5 bg-[#171c2b] border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Send a message..."
                className="flex-1 px-3 py-1.5 bg-[#10131d] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors cursor-pointer"
                title="Send"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
