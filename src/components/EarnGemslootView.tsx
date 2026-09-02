import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Flame,
  Apple,
  Monitor,
  Grid,
  Sparkles,
  DollarSign,
  Gift,
  Coins,
  Gamepad2,
  Users,
  Send,
  Smile,
  Paperclip,
  Mic,
  Clock,
  ExternalLink,
  Star,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { EnrichedOffer } from '../data/enrichedOffers';
import { CompactOfferCard } from './CompactOfferCard';
import { initialsOf } from '../utils';

interface EarnGemslootViewProps {
  allOffers: EnrichedOffer[];
  savedOfferIds: Set<string>;
  onSelectOffer: (offer: EnrichedOffer) => void;
  onToggleSave: (offerId: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

interface ChatMsg {
  id: string;
  user: string;
  badge?: string;
  badgeColor?: string;
  time: string;
  text: string;
  isReward?: boolean;
  rewardAmount?: string;
}

const INITIAL_CHAT_MESSAGES: ChatMsg[] = [
  {
    id: 'm1',
    user: 'PrincessPeach7',
    badge: '💎',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    time: '09:10',
    text: 'Aido is everywhere',
  },
  {
    id: 'm2',
    user: 'awesometrout',
    badge: '🌐',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    time: '09:12',
    text: 'All the prime ones for ascend give bad links for me',
  },
  {
    id: 'm3',
    user: 'MoonMiles.io',
    badge: '🐐',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    time: '09:14',
    text: 'sup goat',
  },
  {
    id: 'm4',
    user: 'Aido77',
    badge: '👑',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    time: '09:14',
    text: 'I am nowhere 🗿',
  },
  {
    id: 'm5',
    user: 'Spockk',
    badge: '🌐',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    time: '09:18',
    text: "I'm not scared to kiss a boy",
  },
  {
    id: 'm6',
    user: 'brsay',
    badge: '🌸',
    badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    time: '09:19',
    text: 'Big instant win on raid challenge!',
    isReward: true,
    rewardAmount: '$ 313.33',
  },
  {
    id: 'm7',
    user: 'Your Mom',
    badge: '⚡',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    time: '09:19',
    text: 'https://gemsloot.com/leaderboard?&modal=profile&name=neil425',
  },
  {
    id: 'm8',
    user: 'Your Mom',
    badge: '⚡',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    time: '09:19',
    text: 'yall should look into these guys',
  },
  {
    id: 'm9',
    user: 'Spockk',
    badge: '🌐',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    time: '09:20',
    text: 'Sissy',
  },
  {
    id: 'm10',
    user: 'Your Mom',
    badge: '⚡',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    time: '09:20',
    text: 'sussy start with a version',
  },
];

export const EarnGemslootView: React.FC<EarnGemslootViewProps> = ({
  allOffers,
  savedOfferIds,
  onSelectOffer,
  onToggleSave,
  searchQuery: externalSearchQuery,
  onSearchChange,
}) => {
  const [internalSearch, setInternalSearch] = useState('');
  const query = externalSearchQuery !== undefined ? externalSearchQuery : internalSearch;

  // Platform filter for featured row: 'all' | 'apple' | 'android' | 'desktop' | 'windows'
  const [platformFilter, setPlatformFilter] = useState<'all' | 'apple' | 'android' | 'desktop' | 'windows'>('all');

  // Expanded row tracking (Featured is open by default like in screenshot)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set(['featured']));

  // Chat rain timer countdown simulation
  const [rainSeconds, setRainSeconds] = useState(156); // 2:36

  // Live chat messages
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>(INITIAL_CHAT_MESSAGES);
  const [newMsgText, setNewMsgText] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(true); // for mobile toggle
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Horizontal scroll ref for featured cards carousel
  const featuredScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setRainSeconds((prev) => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgText.trim()) return;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newMsg: ChatMsg = {
      id: `msg-${Date.now()}`,
      user: 'You',
      badge: '👑',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
      time: timeStr,
      text: newMsgText.trim(),
    };
    setChatMessages((prev) => [...prev, newMsg]);
    setNewMsgText('');
    setTimeout(() => {
      if (chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }
    }, 50);
  };

  const toggleRow = (rowId: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }
      return next;
    });
  };

  const scrollFeatured = (dir: 'left' | 'right') => {
    if (featuredScrollRef.current) {
      const amount = dir === 'left' ? -360 : 360;
      featuredScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // Categorize offers from allOffers
  const featuredOffers = allOffers.filter((o) => {
    if (platformFilter === 'apple' && !o.platforms.includes('apple')) return false;
    if (platformFilter === 'android' && !o.platforms.includes('android')) return false;
    if (platformFilter === 'desktop' && !o.platforms.includes('desktop')) return false;
    if (query.trim()) {
      return o.name.toLowerCase().includes(query.toLowerCase());
    }
    return true;
  });

  const fastOffers = allOffers.filter((o) => o.categories.includes('fast-easy'));
  const financeOffers = allOffers.filter((o) => o.categories.includes('finance') || o.categories.includes('banking') || o.categories.includes('crypto'));
  const signupOffers = allOffers.filter((o) => o.categories.includes('signup-trial'));
  const puzzleOffers = allOffers.filter((o) => o.categories.includes('puzzles'));
  const savedOffersList = allOffers.filter((o) => savedOfferIds.has(o.id));

  // Curated prominent Featured games matching the screenshot exactly
  const curatedFeaturedCards = [
    {
      id: 'raid-shadow-legends',
      name: 'Raid Shadow Legends',
      domain: 'plarium.com',
      payout: '$ 632.35',
      platforms: ['desktop', 'android'],
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'klondike-adventures',
      name: 'Klondike Adventures',
      domain: 'vizor-games.com',
      payout: '$ 276.64',
      platforms: ['android', 'apple'],
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'legend-of-mushroom',
      name: 'Legend of Mushroom',
      domain: 'joynetgames.com',
      payout: '$ 87.3',
      platforms: ['android', 'apple'],
      image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'arrows-puzzle',
      name: 'Arrows - Puzzle Challenge',
      domain: 'arrowspuzzle.com',
      payout: '$ 242.38',
      platforms: ['android', 'desktop'],
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'battle-legion',
      name: 'Battle Legion: 100v100',
      domain: 'traplight.com',
      payout: '$ 194',
      platforms: ['android', 'apple'],
      image: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'wild-survival',
      name: 'Wild Survival - Idle',
      domain: 'wildsurvival.io',
      payout: '$ 664.58',
      platforms: ['android'],
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'afk-journey',
      name: 'AFK Journey',
      domain: 'farlightgames.com',
      payout: '$ 256.28',
      platforms: ['android', 'apple', 'desktop'],
      image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'monopoly-go',
      name: 'Monopoly GO!',
      domain: 'scopely.com',
      payout: '$ 216.97',
      platforms: ['android', 'apple'],
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#f0f2f6] text-slate-800 transition-colors">
      {/* Clean Light-Gray Outer Layout with Desktop Split: Left Content + Right Chat */}
      <div className="max-w-[1680px] mx-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col lg:flex-row items-start gap-5">
        {/* LEFT COLUMN: Main Marketplace (Exact match to gem (2).png with light blue & green added) */}
        <div className="flex-1 w-full min-w-0 flex flex-col gap-3.5">
          {/* 1. TOP QUICK SEARCH BAR WITH "All Offers >" BUTTON */}
          <div className="w-full rounded-2xl bg-[#111522] border border-sky-500/20 p-2 sm:p-2.5 flex items-center justify-between gap-3 shadow-md shadow-slate-300/40">
            <div className="flex-1 flex items-center gap-3 px-3 py-1.5 text-slate-300">
              <Search size={19} className="text-sky-400 stroke-[2.2] flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  if (onSearchChange) onSearchChange(e.target.value);
                  else setInternalSearch(e.target.value);
                }}
                placeholder="Quick search"
                className="w-full bg-transparent text-sm sm:text-base font-semibold text-white placeholder-slate-400 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    if (onSearchChange) onSearchChange('');
                    else setInternalSearch('');
                  }}
                  className="text-xs font-bold text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800"
                >
                  Clear
                </button>
              )}
            </div>

            {/* "All Offers >" Gradient Button (Light Blue + Green Accent) */}
            <button
              type="button"
              onClick={() => {
                // Focus / show all offers
                if (onSearchChange) onSearchChange('');
                setPlatformFilter('all');
                setExpandedRows(new Set(['featured', 'my-offers', 'fast', 'finance', 'signup', 'puzzles']));
              }}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 text-white font-black text-xs sm:text-sm tracking-wide shadow-md shadow-emerald-500/25 hover:opacity-95 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              <span>All Offers</span>
              <ChevronRight size={16} className="stroke-[2.5]" />
            </button>
          </div>

          {/* 2. "MY OFFERS" ROW */}
          <div className="w-full flex flex-col gap-1.5">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-sky-400 font-black text-sm sm:text-base uppercase tracking-tight">
                  <span className="text-emerald-400">💎</span>
                  <span className="text-slate-900 font-extrabold">My Offers</span>
                  <ChevronRight size={16} className="text-slate-400 stroke-[2.5]" />
                </div>
                {/* Filter dropdown button */}
                <button
                  type="button"
                  onClick={() => {
                    setPlatformFilter((prev) => (prev === 'all' ? 'android' : prev === 'android' ? 'apple' : 'all'));
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-sky-200 text-slate-700 text-xs font-bold shadow-xs hover:border-sky-400 transition-colors"
                >
                  <span>Filter</span>
                  <ChevronDown size={13} className="text-sky-600" />
                </button>
              </div>
            </div>

            {/* Row Horizontal Container with Mini App Icons + Hidden Count + Show Row */}
            <div className="w-full rounded-2xl bg-[#111522] border border-slate-800 p-2.5 sm:p-3 flex items-center justify-between gap-3 shadow-md shadow-slate-300/30">
              <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-0.5">
                {(savedOffersList.length > 0 ? savedOffersList : fastOffers.slice(0, 9)).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectOffer(item)}
                    className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-[#181d2c] border border-slate-700/80 p-1 flex-shrink-0 hover:border-sky-400 transition-all hover:scale-105 shadow-xs"
                    title={item.name}
                  >
                    {item.logoUrl ? (
                      <img
                        src={item.logoUrl}
                        alt={item.name}
                        className="h-full w-full object-contain rounded-lg"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-xs font-black text-sky-400">{initialsOf(item.name)}</span>
                    )}
                  </button>
                ))}
                <span className="text-xs font-semibold text-slate-400 whitespace-nowrap pl-2">
                  {allOffers.length - 8} hidden
                </span>
              </div>

              <button
                type="button"
                onClick={() => toggleRow('my-offers')}
                className="flex-shrink-0 text-xs sm:text-sm font-bold text-sky-400 hover:text-emerald-400 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap"
              >
                {expandedRows.has('my-offers') ? 'Hide row' : 'Show row'}
              </button>
            </div>

            {/* Expanded My Offers Grid */}
            {expandedRows.has('my-offers') && (
              <div className="p-3 rounded-2xl bg-[#111522] border border-slate-800 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 animate-in fade-in duration-200">
                {(savedOffersList.length > 0 ? savedOffersList : fastOffers).map((offer) => (
                  <CompactOfferCard
                    key={offer.id}
                    offer={offer}
                    isSaved={savedOfferIds.has(offer.id)}
                    onToggleSave={onToggleSave}
                    onSelectOffer={onSelectOffer}
                    className="w-full"
                  />
                ))}
              </div>
            )}
          </div>

          {/* 3. "FEATURED" ROW (Large Highlighted Carousel with Hero Card + Game Cards + View More) */}
          <div className="w-full flex flex-col gap-2 mt-1">
            {/* Featured Header with Platform Selector & Navigation Arrows */}
            <div className="flex items-center justify-between gap-2 px-1 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-base sm:text-lg">
                  <span className="text-amber-500">🔥</span>
                  <span>Featured</span>
                  <ChevronDown size={17} className="text-slate-500" />
                </div>

                {/* Device Filter Icons Pill (Apple, Android, PC, Windows, Search) */}
                <div className="flex items-center gap-1 bg-[#111522] p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setPlatformFilter(platformFilter === 'apple' ? 'all' : 'apple')}
                    className={`p-1.5 rounded-lg transition-all ${
                      platformFilter === 'apple'
                        ? 'bg-sky-500 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                    title="Apple iOS"
                  >
                    <Apple size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlatformFilter(platformFilter === 'android' ? 'all' : 'android')}
                    className={`p-1.5 rounded-lg transition-all ${
                      platformFilter === 'android'
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                    title="Android"
                  >
                    <span className="text-xs font-bold">🤖</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlatformFilter(platformFilter === 'desktop' ? 'all' : 'desktop')}
                    className={`p-1.5 rounded-lg transition-all ${
                      platformFilter === 'desktop'
                        ? 'bg-sky-500 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                    title="Desktop / PC"
                  >
                    <Monitor size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlatformFilter(platformFilter === 'windows' ? 'all' : 'windows')}
                    className={`p-1.5 rounded-lg transition-all ${
                      platformFilter === 'windows'
                        ? 'bg-teal-500 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                    title="Windows"
                  >
                    <Grid size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Quick search"]') as HTMLInputElement;
                      if (input) input.focus();
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition-all"
                    title="Search"
                  >
                    <Search size={15} />
                  </button>
                </div>
              </div>

              {/* Carousel Left / Right Arrows */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollFeatured('left')}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-600 hover:text-sky-600 hover:border-sky-400 transition-all shadow-xs"
                >
                  <ChevronLeft size={17} className="stroke-[2.5]" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollFeatured('right')}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-600 hover:text-sky-600 hover:border-sky-400 transition-all shadow-xs"
                >
                  <ChevronRight size={17} className="stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Featured Cards Horizontal Scrolling Track */}
            <div
              ref={featuredScrollRef}
              className="w-full flex items-stretch gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth"
            >
              {/* CARD 0: ASCEND HERO CARD (Rocket mascot with flames, purple/cyan/emerald glow) */}
              <div
                onClick={() => {
                  const matched = allOffers.find((o) => o.id.includes('stake') || o.id.includes('gemsloot'));
                  if (matched) onSelectOffer(matched);
                }}
                className="w-[145px] sm:w-[155px] min-w-[145px] sm:min-w-[155px] h-[215px] sm:h-[230px] rounded-2xl bg-gradient-to-b from-sky-600 via-indigo-900 to-[#0a0d18] border border-sky-400/50 p-3 flex flex-col justify-between items-center text-center shadow-lg shadow-sky-500/20 cursor-pointer hover:scale-[1.03] transition-all relative overflow-hidden group select-none flex-shrink-0"
              >
                {/* Neon Glow Highlights */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-sky-400/30 rounded-full blur-xl" />
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-emerald-400/30 rounded-full blur-xl" />

                <div className="z-10 w-full flex flex-col items-center">
                  <span className="text-xs sm:text-sm font-black tracking-widest text-white uppercase drop-shadow-md">
                    ASCEND
                  </span>
                  <div className="mt-1 px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-xs">
                    EARN NOW
                  </div>
                </div>

                {/* Character in Flight with Rocket Fire */}
                <div className="z-10 flex flex-col items-center my-auto relative">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-purple-600/90 border-2 border-purple-300 flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(168,85,247,0.7)] group-hover:rotate-6 transition-transform">
                    👾
                  </div>
                  {/* Rocket Flame / Jets */}
                  <div className="w-6 h-4 bg-gradient-to-b from-amber-400 via-orange-500 to-transparent rounded-b-full blur-xs mt-0.5 animate-pulse" />
                </div>

                {/* Bottom Badge */}
                <div className="z-10 flex items-center gap-1 text-[10px] font-extrabold text-sky-200">
                  <Sparkles size={11} className="text-emerald-300" />
                  <span>Verified Fast</span>
                </div>
              </div>

              {/* CURATED GAME CARDS MATCHING SCREENSHOT */}
              {curatedFeaturedCards.map((card) => {
                const matchedOffer = allOffers.find(
                  (o) =>
                    o.id === card.id ||
                    o.name.toLowerCase().includes(card.name.toLowerCase()) ||
                    card.name.toLowerCase().includes(o.name.toLowerCase())
                );

                return (
                  <div
                    key={card.id}
                    onClick={() => {
                      if (matchedOffer) {
                        onSelectOffer(matchedOffer);
                      } else {
                        // Fallback object to view
                        onSelectOffer({
                          id: card.id,
                          name: card.name,
                          domain: card.domain,
                          accentRgb: '14, 165, 233',
                          payout: card.payout,
                          instructionSub: 'Complete in-game quests to cash out.',
                          payoutTag: 'VERIFIED',
                          tierClass: 'tier-free',
                          signupUrl: `https://${card.domain}`,
                          signupLabel: 'START PLAYING',
                          tabId: 'featured',
                          hidden: false,
                          categories: ['featured', 'fast-easy'],
                          platforms: card.platforms as any,
                          rewardDisplay: card.payout,
                          rewardValue: parseFloat(card.payout.replace(/[^0-9.]/g, '')) || 100,
                        });
                      }
                    }}
                    className="w-[145px] sm:w-[155px] min-w-[145px] sm:min-w-[155px] h-[215px] sm:h-[230px] rounded-2xl bg-[#111522] border border-slate-800 flex flex-col justify-between overflow-hidden shadow-md shadow-slate-300/30 cursor-pointer hover:border-sky-400 hover:scale-[1.03] transition-all group select-none flex-shrink-0"
                  >
                    {/* Top Game Artwork Image with Top-Right Device Badges */}
                    <div className="relative w-full h-[135px] sm:h-[145px] overflow-hidden bg-slate-950">
                      <img
                        src={card.image}
                        alt={card.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111522] via-transparent to-black/40" />

                      {/* Top-Right Platform Badges Overlay */}
                      <div className="absolute top-1.5 right-1.5 flex items-center gap-1 bg-black/70 backdrop-blur-xs px-1.5 py-0.5 rounded-md border border-white/20">
                        {card.platforms.includes('desktop') && <Monitor size={11} className="text-sky-300" />}
                        {card.platforms.includes('android') && <span className="text-[10px]">🤖</span>}
                        {card.platforms.includes('apple') && <Apple size={11} className="text-white" />}
                      </div>
                    </div>

                    {/* Bottom Title & Emerald Green Payout */}
                    <div className="p-2.5 pt-0 flex flex-col justify-end">
                      <h4 className="text-xs font-black text-white truncate group-hover:text-sky-300 transition-colors">
                        {card.name}
                      </h4>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-xs sm:text-sm font-black text-emerald-400 drop-shadow-xs">
                          {card.payout}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* CARD 8: "VIEW MORE" GRADIENT CARD */}
              <div
                onClick={() => {
                  setExpandedRows(new Set(['featured', 'my-offers', 'fast', 'finance', 'signup', 'puzzles']));
                }}
                className="w-[145px] sm:w-[155px] min-w-[145px] sm:min-w-[155px] h-[215px] sm:h-[230px] rounded-2xl bg-gradient-to-b from-sky-600 via-teal-700 to-[#111522] border border-sky-400/60 p-3 flex flex-col justify-center items-center text-center shadow-lg shadow-sky-500/20 cursor-pointer hover:scale-[1.03] transition-all group select-none flex-shrink-0"
              >
                {/* 4-Square Grid Icon */}
                <div className="grid grid-cols-2 gap-1.5 mb-2 group-hover:rotate-12 transition-transform">
                  <div className="w-5 h-5 rounded-md bg-white/30 border border-white/40" />
                  <div className="w-5 h-5 rounded-md bg-emerald-400/50 border border-white/40" />
                  <div className="w-5 h-5 rounded-md bg-sky-400/50 border border-white/40" />
                  <div className="w-5 h-5 rounded-md bg-white/30 border border-white/40" />
                </div>

                <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                  View More
                </span>
                <div className="mt-2 w-7 h-7 rounded-full bg-white text-sky-700 flex items-center justify-center font-black shadow-md group-hover:translate-x-1 transition-transform">
                  ▶
                </div>
              </div>
            </div>
          </div>

          {/* 4. "FAST OFFERS" ROW */}
          <div className="w-full flex flex-col gap-1.5 mt-1">
            <div className="flex items-center gap-1 text-emerald-600 font-extrabold text-sm sm:text-base px-1">
              <span>💲</span>
              <span className="text-slate-900">Fast Offers</span>
              <ChevronRight size={16} className="text-slate-400 stroke-[2.5]" />
            </div>

            <div className="w-full rounded-2xl bg-[#111522] border border-slate-800 p-2.5 sm:p-3 flex items-center justify-between gap-3 shadow-md shadow-slate-300/30">
              <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-0.5">
                {fastOffers.slice(0, 9).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectOffer(item)}
                    className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-[#181d2c] border border-slate-700/80 p-1 flex-shrink-0 hover:border-emerald-400 transition-all hover:scale-105 shadow-xs"
                    title={item.name}
                  >
                    {item.logoUrl ? (
                      <img
                        src={item.logoUrl}
                        alt={item.name}
                        className="h-full w-full object-contain rounded-lg"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-xs font-black text-emerald-400">{initialsOf(item.name)}</span>
                    )}
                  </button>
                ))}
                <span className="text-xs font-semibold text-slate-400 whitespace-nowrap pl-2">
                  14 hidden
                </span>
              </div>

              <button
                type="button"
                onClick={() => toggleRow('fast')}
                className="flex-shrink-0 text-xs sm:text-sm font-bold text-sky-400 hover:text-emerald-400 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap"
              >
                {expandedRows.has('fast') ? 'Hide row' : 'Show row'}
              </button>
            </div>

            {expandedRows.has('fast') && (
              <div className="p-3 rounded-2xl bg-[#111522] border border-slate-800 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 animate-in fade-in duration-200">
                {fastOffers.map((offer) => (
                  <CompactOfferCard
                    key={offer.id}
                    offer={offer}
                    isSaved={savedOfferIds.has(offer.id)}
                    onToggleSave={onToggleSave}
                    onSelectOffer={onSelectOffer}
                    className="w-full"
                  />
                ))}
              </div>
            )}
          </div>

          {/* 5. "FINANCE" ROW */}
          <div className="w-full flex flex-col gap-1.5 mt-1">
            <div className="flex items-center gap-1 text-slate-900 font-extrabold text-sm sm:text-base px-1">
              <span>🐷</span>
              <span>Finance</span>
              <ChevronRight size={16} className="text-slate-400 stroke-[2.5]" />
            </div>

            <div className="w-full rounded-2xl bg-[#111522] border border-slate-800 p-2.5 sm:p-3 flex items-center justify-between gap-3 shadow-md shadow-slate-300/30">
              <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-0.5">
                {financeOffers.slice(0, 9).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectOffer(item)}
                    className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-[#181d2c] border border-slate-700/80 p-1 flex-shrink-0 hover:border-sky-400 transition-all hover:scale-105 shadow-xs"
                    title={item.name}
                  >
                    {item.logoUrl ? (
                      <img
                        src={item.logoUrl}
                        alt={item.name}
                        className="h-full w-full object-contain rounded-lg"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-xs font-black text-sky-400">{initialsOf(item.name)}</span>
                    )}
                  </button>
                ))}
                <span className="text-xs font-semibold text-slate-400 whitespace-nowrap pl-2">
                  26 hidden
                </span>
              </div>

              <button
                type="button"
                onClick={() => toggleRow('finance')}
                className="flex-shrink-0 text-xs sm:text-sm font-bold text-sky-400 hover:text-emerald-400 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap"
              >
                {expandedRows.has('finance') ? 'Hide row' : 'Show row'}
              </button>
            </div>

            {expandedRows.has('finance') && (
              <div className="p-3 rounded-2xl bg-[#111522] border border-slate-800 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 animate-in fade-in duration-200">
                {financeOffers.map((offer) => (
                  <CompactOfferCard
                    key={offer.id}
                    offer={offer}
                    isSaved={savedOfferIds.has(offer.id)}
                    onToggleSave={onToggleSave}
                    onSelectOffer={onSelectOffer}
                    className="w-full"
                  />
                ))}
              </div>
            )}
          </div>

          {/* 6. "SIGN UP TRIAL" ROW */}
          <div className="w-full flex flex-col gap-1.5 mt-1">
            <div className="flex items-center gap-1 text-slate-900 font-extrabold text-sm sm:text-base px-1">
              <span>👤+</span>
              <span>Sign Up Trial</span>
              <ChevronRight size={16} className="text-slate-400 stroke-[2.5]" />
            </div>

            <div className="w-full rounded-2xl bg-[#111522] border border-slate-800 p-2.5 sm:p-3 flex items-center justify-between gap-3 shadow-md shadow-slate-300/30">
              <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-0.5">
                {signupOffers.slice(0, 9).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectOffer(item)}
                    className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-[#181d2c] border border-slate-700/80 p-1 flex-shrink-0 hover:border-teal-400 transition-all hover:scale-105 shadow-xs"
                    title={item.name}
                  >
                    {item.logoUrl ? (
                      <img
                        src={item.logoUrl}
                        alt={item.name}
                        className="h-full w-full object-contain rounded-lg"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-xs font-black text-teal-400">{initialsOf(item.name)}</span>
                    )}
                  </button>
                ))}
                <span className="text-xs font-semibold text-slate-400 whitespace-nowrap pl-2">
                  28 hidden
                </span>
              </div>

              <button
                type="button"
                onClick={() => toggleRow('signup')}
                className="flex-shrink-0 text-xs sm:text-sm font-bold text-sky-400 hover:text-emerald-400 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap"
              >
                {expandedRows.has('signup') ? 'Hide row' : 'Show row'}
              </button>
            </div>

            {expandedRows.has('signup') && (
              <div className="p-3 rounded-2xl bg-[#111522] border border-slate-800 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 animate-in fade-in duration-200">
                {signupOffers.map((offer) => (
                  <CompactOfferCard
                    key={offer.id}
                    offer={offer}
                    isSaved={savedOfferIds.has(offer.id)}
                    onToggleSave={onToggleSave}
                    onSelectOffer={onSelectOffer}
                    className="w-full"
                  />
                ))}
              </div>
            )}
          </div>

          {/* 7. "PUZZLES" ROW */}
          <div className="w-full flex flex-col gap-1.5 mt-1 pb-12">
            <div className="flex items-center gap-1 text-slate-900 font-extrabold text-sm sm:text-base px-1">
              <span>🧩</span>
              <span>Puzzles</span>
              <ChevronRight size={16} className="text-slate-400 stroke-[2.5]" />
            </div>

            <div className="w-full rounded-2xl bg-[#111522] border border-slate-800 p-2.5 sm:p-3 flex items-center justify-between gap-3 shadow-md shadow-slate-300/30">
              <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-0.5">
                {puzzleOffers.slice(0, 9).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectOffer(item)}
                    className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-[#181d2c] border border-slate-700/80 p-1 flex-shrink-0 hover:border-emerald-400 transition-all hover:scale-105 shadow-xs"
                    title={item.name}
                  >
                    {item.logoUrl ? (
                      <img
                        src={item.logoUrl}
                        alt={item.name}
                        className="h-full w-full object-contain rounded-lg"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-xs font-black text-emerald-400">{initialsOf(item.name)}</span>
                    )}
                  </button>
                ))}
                <span className="text-xs font-semibold text-slate-400 whitespace-nowrap pl-2">
                  20 hidden
                </span>
              </div>

              <button
                type="button"
                onClick={() => toggleRow('puzzles')}
                className="flex-shrink-0 text-xs sm:text-sm font-bold text-sky-400 hover:text-emerald-400 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap"
              >
                {expandedRows.has('puzzles') ? 'Hide row' : 'Show row'}
              </button>
            </div>

            {expandedRows.has('puzzles') && (
              <div className="p-3 rounded-2xl bg-[#111522] border border-slate-800 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 animate-in fade-in duration-200">
                {puzzleOffers.map((offer) => (
                  <CompactOfferCard
                    key={offer.id}
                    offer={offer}
                    isSaved={savedOfferIds.has(offer.id)}
                    onToggleSave={onToggleSave}
                    onSelectOffer={onSelectOffer}
                    className="w-full"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Live Community Chat (Exact match to gem (2).png with light blue & green added) */}
        <div className="w-full lg:w-[340px] xl:w-[360px] flex-shrink-0 flex flex-col rounded-2xl bg-[#111522] border border-slate-800 overflow-hidden shadow-xl shadow-slate-300/40 h-[640px] lg:h-[calc(100vh-140px)] sticky top-4">
          {/* Chat Header with Online Indicator & Voice Icon */}
          <div className="px-4 py-3 border-b border-slate-800/80 flex items-center justify-between bg-[#151a2b]">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white">Chat</span>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-extrabold border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>137</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-slate-400">
              <button
                type="button"
                className="p-1.5 rounded-lg hover:text-sky-400 hover:bg-slate-800 transition-colors"
                title="Voice Chat"
              >
                <Mic size={16} />
              </button>
              <button
                type="button"
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition-colors"
                title="Collapse Chat"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>

          {/* "Chat Rain" Banner ($ 10.59 • 2:36 countdown with light blue & green border) */}
          <div className="mx-3 my-2.5 p-2.5 rounded-xl bg-gradient-to-r from-sky-950/60 via-[#182033] to-emerald-950/60 border border-emerald-500/30 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300 text-base border border-emerald-500/40">
                🎁
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                  Chat Rain
                </div>
                <div className="text-sm font-black text-emerald-400 drop-shadow-xs">
                  $ 10.59
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-900 border border-slate-700 text-xs font-bold text-sky-300">
                <Clock size={12} className="text-sky-400" />
                <span>{formatTime(rainSeconds)}</span>
              </div>
              <ChevronDown size={15} className="text-slate-400" />
            </div>
          </div>

          {/* Live Message Thread */}
          <div
            ref={chatScrollRef}
            className="flex-1 px-3 py-2 overflow-y-auto space-y-3 text-xs leading-relaxed"
          >
            {chatMessages.map((msg, idx) => (
              <React.Fragment key={msg.id}>
                {idx === 2 && (
                  <div className="my-2 flex items-center gap-2">
                    <div className="h-[1px] flex-1 bg-slate-800" />
                    <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-950/80 border border-sky-500/30">
                      New messages
                    </span>
                    <div className="h-[1px] flex-1 bg-slate-800" />
                  </div>
                )}

                {msg.isReward ? (
                  /* Big Reward Drop Achievement Box (like in gem (2).png) */
                  <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-950/80 to-[#1c2438] border border-emerald-500/40 my-1 shadow-md">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <div className="flex items-center gap-1 font-bold text-slate-300">
                        <span>{msg.badge}</span>
                        <span className="text-white font-extrabold">{msg.user}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{msg.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 text-xs">{msg.text}</span>
                      <span className="text-sm font-black text-emerald-400 bg-emerald-950/90 px-2 py-0.5 rounded-md border border-emerald-500/50">
                        {msg.rewardAmount}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span className={`px-1 rounded text-[10px] font-bold ${msg.badgeColor}`}>
                        {msg.badge}
                      </span>
                      <span className="font-extrabold text-white">{msg.user}</span>
                      <span className="text-[10px] text-slate-500">• {msg.time}</span>
                    </div>
                    <p className="text-slate-300 pl-4 mt-0.5 break-words select-text">
                      {msg.text}
                    </p>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Bottom Chat Message Input Field */}
          <form
            onSubmit={handleSendChat}
            className="p-2.5 border-t border-slate-800/80 bg-[#131726] flex items-center gap-2"
          >
            <button
              type="button"
              className="text-slate-400 hover:text-sky-300 transition-colors p-1"
              title="Attach media"
            >
              <Paperclip size={16} />
            </button>

            <input
              type="text"
              value={newMsgText}
              onChange={(e) => setNewMsgText(e.target.value)}
              placeholder="Send a message..."
              className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
            />

            <button
              type="button"
              className="text-slate-400 hover:text-amber-300 transition-colors p-1"
              title="Emoji"
            >
              <Smile size={17} />
            </button>

            <button
              type="submit"
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white hover:opacity-90 active:scale-95 transition-all shadow-sm"
              title="Send"
            >
              <Send size={14} className="stroke-[2.5]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
