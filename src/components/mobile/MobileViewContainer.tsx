import React, { useState, useMemo, useEffect } from 'react';
import { EnrichedOffer } from '../../data/enrichedOffers';
import { UserProfile } from '../../types';
import { MobileTab } from '../MobileBottomNav';
import { TrustReviewsSection } from '../TrustReviewsSection';
import { OhkneeLogo } from '../OhkneeLogo';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  HelpCircle,
  Search,
  Flame,
  Trophy,
  Landmark,
  Coins,
  TrendingUp,
  ChevronRight,
  Wallet,
  ShieldCheck,
  Zap,
  Gift,
  ExternalLink,
  Lock,
  BarChart2,
  User as UserIcon,
  RefreshCw,
  Layers,
} from 'lucide-react';

interface MobileViewContainerProps {
  mobileTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  allOffers: EnrichedOffer[];
  savedOfferIds: Set<string>;
  onSelectOffer: (offer: EnrichedOffer) => void;
  onToggleSaveOffer: (id: string) => void;
  onOpenHowItWorks: () => void;
  currentUserProfile: UserProfile | null;
  onOpenStaffAuth: () => void;
  onOpenAnalytics: () => void;
  onOpenProfileModal: () => void;
}

export const MobileViewContainer: React.FC<MobileViewContainerProps> = ({
  mobileTab,
  onSelectTab,
  selectedCategory,
  onSelectCategory,
  allOffers,
  savedOfferIds,
  onSelectOffer,
  onToggleSaveOffer,
  onOpenHowItWorks,
  currentUserProfile,
  onOpenStaffAuth,
  onOpenAnalytics,
  onOpenProfileModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [boostTimer, setBoostTimer] = useState({ hours: 4, minutes: 22, seconds: 15 });

  // Ticking boost countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setBoostTimer((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        }
        if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 4, minutes: 30, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter offers based on search and category
  const filteredOffers = useMemo(() => {
    let list = [...allOffers];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          (o.payout && o.payout.toLowerCase().includes(q)) ||
          (o.instructionSub && o.instructionSub.toLowerCase().includes(q))
      );
    }
    if (selectedCategory && selectedCategory !== 'all') {
      list = list.filter((o) => {
        if (selectedCategory === 'featured') return o.isFeatured;
        if (selectedCategory === 'bonuses-promos') return o.category === 'bonuses-promos' || o.category === 'signup-trial';
        if (selectedCategory === 'sports-betting') return o.category === 'sports-betting' || o.category === 'sweepstakes';
        if (selectedCategory === 'banking') return o.category === 'banking' || o.category === 'fast-easy';
        if (selectedCategory === 'crypto') return o.category === 'crypto';
        if (selectedCategory === 'finance') return o.category === 'finance';
        return o.category === selectedCategory;
      });
    }
    return list;
  }, [allOffers, searchQuery, selectedCategory]);

  // Curated collections for mobile lobby sections
  const boostedOffers = useMemo(() => {
    return allOffers.filter((o) => o.isFeatured || o.payout.includes('$') || o.bonusMultiplier).slice(0, 6);
  }, [allOffers]);

  const featuredOffers = useMemo(() => {
    return allOffers.filter((o) => o.isFeatured || o.category === 'featured').slice(0, 8);
  }, [allOffers]);

  const othersAlsoDidOffers = useMemo(() => {
    return allOffers.filter((o) => o.category === 'fast-easy' || o.payout.includes('100') || o.payout.includes('25')).slice(0, 6);
  }, [allOffers]);

  const newOffers = useMemo(() => {
    return allOffers.filter((o) => o.id === 'ava-card' || o.id === 'moneylion-card' || o.id === 'webull' || o.id === 'sofi-card' || o.badgeType === 'new').slice(0, 6);
  }, [allOffers]);

  const top10Offers = useMemo(() => {
    // Sort by payout value descending and feature status
    return [...allOffers]
      .sort((a, b) => {
        const getVal = (p: string) => {
          const match = p.match(/\$(\d+)/);
          return match ? parseInt(match[1], 10) : 10;
        };
        return getVal(b.payout) - getVal(a.payout);
      })
      .slice(0, 10);
  }, [allOffers]);

  const formatTimer = () => {
    const h = String(boostTimer.hours).padStart(2, '0');
    const m = String(boostTimer.minutes).padStart(2, '0');
    const s = String(boostTimer.seconds).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  /* =======================================================================
     VIEW 1: MOBILE HOMEPAGE (Ends strictly after reviews!)
     ======================================================================= */
  if (mobileTab === 'home') {
    return (
      <div className="w-full pb-28 select-none">
        {/* Section 8: Mobile Homepage Hero */}
        <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#0e071e] via-[#090b14] to-[#070911] px-4 pt-6 pb-8 border-b border-purple-900/30">
          {/* Ambient Purple Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-md mx-auto text-center">
            {/* Loot Branding with White Loot Logo */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-black shadow-lg shadow-purple-900/30 mb-4">
              <div className="w-4 h-4 rounded-md bg-white/10 flex items-center justify-center p-0.5">
                <OhkneeLogo className="h-full w-full object-contain brightness-0 invert" />
              </div>
              <span className="tracking-wide">OHKNEE REWARDS</span>
            </div>

            {/* Headline with “Get paid” emphasized in purple */}
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-3">
              <span className="text-purple-400 font-extrabold drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                Get paid
              </span>{' '}
              <span className="text-white">
                for playing games & completing verified offers.
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto mb-5">
              Direct cash redemptions to your bank, PayPal, or crypto. Verified daily bonuses with zero hidden deposit requirements.
            </p>

            {/* Green Checkmarks: "No deposit", "Quick cashout" */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 mb-6">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl shadow-sm">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>No deposit</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl shadow-sm">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>Quick cashout</span>
              </div>
            </div>

            {/* CTAs: "Earn now!" and "How it works" */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => onSelectTab('earn')}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm tracking-wide shadow-xl shadow-purple-600/30 active:scale-95 transition-all cursor-pointer"
              >
                <Sparkles size={18} />
                <span>Earn now!</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={onOpenHowItWorks}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:border-purple-400/50 text-slate-200 hover:text-white font-bold text-xs transition-colors cursor-pointer"
              >
                <HelpCircle size={15} className="text-purple-400" />
                <span>How it works</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 5: Homepage Review Section (No stars, no image, no chat room) */}
        <div className="px-4 py-6">
          <TrustReviewsSection />
        </div>

        {/* Note: Per Rule 4: The mobile homepage ENDS HERE!
            No offer marketplace is placed directly underneath the reviews on mobile.
            The user intentionally navigates to Earn, Top 10, Cash Out, or Category Tabs. */}
      </div>
    );
  }

  /* =======================================================================
     VIEW 2: MOBILE EARN (Lobby & Offer Marketplace)
     ======================================================================= */
  if (mobileTab === 'earn') {
    return (
      <div className="w-full pb-28 px-4 pt-4 select-none">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search games, crypto, banks..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0d1220] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Boosted Offers Section with Countdown Timer */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Zap size={14} />
              </span>
              <h2 className="text-sm font-black text-white uppercase tracking-wider">
                Boosted Offers
              </h2>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/60 border border-red-500/40 text-red-400 text-[11px] font-mono font-bold">
              <Clock size={12} className="animate-pulse" />
              <span>{formatTimer()}</span>
            </div>
          </div>

          {/* Horizontally scrollable Boosted Cards */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-4 px-4 snap-x snap-mandatory">
            {boostedOffers.map((offer) => (
              <div
                key={`boosted-${offer.id}`}
                onClick={() => onSelectOffer(offer)}
                className="shrink-0 w-64 snap-start p-3.5 rounded-2xl bg-gradient-to-br from-[#120d24] to-[#0c0f1d] border border-purple-500/40 shadow-lg shadow-purple-900/20 active:scale-98 transition-transform cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={offer.img}
                        alt={offer.name}
                        className="w-10 h-10 rounded-xl object-cover border border-purple-400/30"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div>
                        <h3 className="text-xs font-black text-white line-clamp-1">{offer.name}</h3>
                        <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">
                          {offer.badgeType || 'Boosted'}
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white font-black text-[10px] shadow-sm">
                      +50% BOOST
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-tight">
                    {offer.instructionSub}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-purple-900/40 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400 font-semibold">Reward:</span>
                    <span className="text-xs font-black text-emerald-400">{offer.payout}</span>
                  </div>
                  <span className="text-[11px] text-purple-400 font-bold flex items-center gap-0.5">
                    Claim <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ascension Hub Daily Multiplier Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-indigo-950/50 to-slate-900 border border-purple-500/30 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider">
                Ascension Hub
              </h3>
              <p className="text-[11px] text-purple-200">
                Tier 1 Multiplier active (1.2x on next 3 offers)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSelectCategory('bonuses-promos')}
            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-[11px] transition-colors cursor-pointer shrink-0"
          >
            Level Up
          </button>
        </div>

        {/* Featured Offers Horizontal Row */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Flame size={14} />
              </span>
              <h2 className="text-sm font-black text-white uppercase tracking-wider">
                Featured Offers
              </h2>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">
              {featuredOffers.length} available
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-4 px-4 snap-x snap-mandatory">
            {featuredOffers.map((offer) => (
              <div
                key={`feat-${offer.id}`}
                onClick={() => onSelectOffer(offer)}
                className="shrink-0 w-60 snap-start p-3 rounded-2xl bg-[#0c101d] border border-slate-800 hover:border-purple-500/50 active:scale-98 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <img
                    src={offer.img}
                    alt={offer.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-black text-white truncate">{offer.name}</h3>
                    <p className="text-[10px] text-slate-400 truncate">{offer.instructionSub}</p>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-400">{offer.payout}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-800 px-2 py-0.5 rounded-md">
                    {offer.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Others Also Did Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30">
                <CheckCircle2 size={14} />
              </span>
              <h2 className="text-sm font-black text-white uppercase tracking-wider">
                Others Also Did
              </h2>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">High Completion Rate</span>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-4 px-4 snap-x snap-mandatory">
            {othersAlsoDidOffers.map((offer) => (
              <div
                key={`others-${offer.id}`}
                onClick={() => onSelectOffer(offer)}
                className="shrink-0 w-60 snap-start p-3 rounded-2xl bg-[#0c101d] border border-slate-800 hover:border-teal-500/50 active:scale-98 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <img
                    src={offer.img}
                    alt={offer.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-black text-white truncate">{offer.name}</h3>
                    <span className="text-[10px] text-teal-400 font-bold">Fast Approval</span>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-400">{offer.payout}</span>
                  <span className="text-[10px] text-slate-400">Instant</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Offers Section (e.g. Ava, MoneyLion, Webull) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
                <Sparkles size={14} />
              </span>
              <h2 className="text-sm font-black text-white uppercase tracking-wider">
                New Offers
              </h2>
            </div>
            <span className="text-[11px] text-sky-400 font-semibold">Recently Added</span>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-4 px-4 snap-x snap-mandatory">
            {newOffers.map((offer) => (
              <div
                key={`new-${offer.id}`}
                onClick={() => onSelectOffer(offer)}
                className="shrink-0 w-60 snap-start p-3 rounded-2xl bg-[#0c101d] border border-sky-500/30 active:scale-98 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <img
                    src={offer.img}
                    alt={offer.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-black text-white truncate">{offer.name}</h3>
                    <span className="text-[10px] text-sky-400 font-bold">New Bonus</span>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-400">{offer.payout}</span>
                  <span className="text-[10px] font-bold text-sky-300">Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Filtered Offers Grid */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              {selectedCategory && selectedCategory !== 'all' ? `${selectedCategory.toUpperCase()} OFFERS` : 'ALL OFFERS'}
            </h2>
            <span className="text-xs font-bold text-slate-400">{filteredOffers.length} offers</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {filteredOffers.map((offer) => (
              <div
                key={`list-${offer.id}`}
                onClick={() => onSelectOffer(offer)}
                className="p-3.5 rounded-2xl bg-[#0c111e] border border-slate-800 hover:border-purple-500/40 active:scale-99 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <img
                    src={offer.img}
                    alt={offer.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-black text-white truncate">{offer.name}</h3>
                      {offer.isFeatured && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-extrabold">
                          HOT
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{offer.instructionSub}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-400">
                        {offer.platforms.join(' • ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-black text-emerald-400 block">{offer.payout}</span>
                  <span className="text-[10px] font-bold text-purple-400">View &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================================
     VIEW 3: TOP 10 (Ranked Highest Paying Offers)
     ======================================================================= */
  if (mobileTab === 'top-10') {
    return (
      <div className="w-full pb-28 px-4 pt-4 select-none">
        <div className="mb-5 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-black mb-2">
            <Trophy size={14} />
            <span>HALL OF FAME</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Top 10 Highest Verified Offers
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Ranked by total guaranteed payout value and fastest approval times.
          </p>
        </div>

        <div className="space-y-3">
          {top10Offers.map((offer, index) => {
            const rank = index + 1;
            const rankBadgeColor =
              rank === 1
                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                : rank === 2
                ? 'bg-slate-300 text-slate-950 ring-2 ring-slate-200'
                : rank === 3
                ? 'bg-amber-700 text-white ring-2 ring-amber-600'
                : 'bg-slate-800 text-slate-300';

            return (
              <div
                key={`top10-${offer.id}`}
                onClick={() => onSelectOffer(offer)}
                className="relative p-4 rounded-2xl bg-gradient-to-r from-[#0d1222] to-[#080d19] border border-slate-800 hover:border-purple-500/50 active:scale-99 transition-all cursor-pointer flex items-center gap-3.5 shadow-md"
              >
                {/* Rank Number Badge */}
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl font-black text-sm shrink-0 shadow-md ${rankBadgeColor}`}
                >
                  #{rank}
                </div>

                <img
                  src={offer.img}
                  alt={offer.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80';
                  }}
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-black text-white truncate">{offer.name}</h3>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/30">
                      Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{offer.instructionSub}</p>
                  <span className="text-[10px] text-purple-300 font-semibold">
                    {offer.platforms.join(' • ')}
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-base font-black text-emerald-400 block">{offer.payout}</span>
                  <span className="text-[10px] font-extrabold text-slate-400">Claim &rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* =======================================================================
     VIEW 4: CASH OUT (Pending Transactions & Payouts)
     ======================================================================= */
  if (mobileTab === 'cash-out') {
    return (
      <div className="w-full pb-28 px-4 pt-4 select-none">
        {/* User Balance Overview */}
        <div className="mb-5 p-5 rounded-3xl bg-gradient-to-br from-purple-950/70 via-indigo-950/60 to-[#080d19] border border-purple-500/40 shadow-xl text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
            Available Balance
          </span>
          <div className="text-4xl font-black text-white tracking-tight my-2">$150.00</div>
          <p className="text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1">
            <CheckCircle2 size={14} /> Ready for instant withdrawal
          </p>
        </div>

        {/* Section 11: Rounded Pending Transactions Section */}
        <div className="mb-6 p-5 rounded-3xl bg-[#0b0f1d] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              <Clock size={14} className="text-purple-400" />
              Pending Transactions
            </h2>
            <span className="text-xs font-black text-purple-300 font-mono">$0</span>
          </div>

          <div className="text-center py-4">
            <p className="text-xs font-black text-slate-200">Nothing pending right now</p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
              Rewards from completed offers land here automatically while awaiting advertiser confirmation.
            </p>

            {/* Visual progress bar / loading-style element underneath */}
            <div className="mt-4 max-w-xs mx-auto">
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-gradient-to-r from-purple-500 to-teal-400 rounded-full animate-pulse" />
              </div>
              <span className="text-[10px] text-slate-500 mt-1.5 block">
                Automatic ledger sync active
              </span>
            </div>
          </div>
        </div>

        {/* Cash Out Methods */}
        <div>
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-3">
            Choose Withdrawal Method
          </h2>

          <div className="space-y-2.5">
            {/* Bank Transfer */}
            <div className="p-3.5 rounded-2xl bg-[#0c101e] border border-slate-800 hover:border-purple-500/40 active:scale-99 transition-all cursor-pointer flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                  <Landmark size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white">Direct Bank Transfer</h3>
                  <p className="text-[10px] text-slate-400">ACH / Instant wire • 1-2 business days</p>
                </div>
              </div>
              <span className="text-xs font-bold text-purple-400">Select &rarr;</span>
            </div>

            {/* PayPal */}
            <div className="p-3.5 rounded-2xl bg-[#0c101e] border border-slate-800 hover:border-purple-500/40 active:scale-99 transition-all cursor-pointer flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                  <Wallet size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white">PayPal Instant</h3>
                  <p className="text-[10px] text-slate-400">Delivered within minutes • $5 minimum</p>
                </div>
              </div>
              <span className="text-xs font-bold text-purple-400">Select &rarr;</span>
            </div>

            {/* Crypto / Bitcoin */}
            <div className="p-3.5 rounded-2xl bg-[#0c101e] border border-slate-800 hover:border-purple-500/40 active:scale-99 transition-all cursor-pointer flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Coins size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white">Bitcoin & USDT (Crypto)</h3>
                  <p className="text-[10px] text-slate-400">Zero network fees • Direct to wallet</p>
                </div>
              </div>
              <span className="text-xs font-bold text-purple-400">Select &rarr;</span>
            </div>

            {/* Digital Gift Cards */}
            <div className="p-3.5 rounded-2xl bg-[#0c101e] border border-slate-800 hover:border-purple-500/40 active:scale-99 transition-all cursor-pointer flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  <Gift size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white">Gift Cards (Amazon, Visa, Apple)</h3>
                  <p className="text-[10px] text-slate-400">Instant email voucher delivery</p>
                </div>
              </div>
              <span className="text-xs font-bold text-purple-400">Select &rarr;</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================================
     VIEW 5: PROFILE (Account, Stats & Staff Access)
     ======================================================================= */
  if (mobileTab === 'profile') {
    return (
      <div className="w-full pb-28 px-4 pt-4 select-none">
        {/* Profile Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#101424] to-[#080d19] border border-slate-800 shadow-xl text-center mb-5">
          <div className="w-16 h-16 rounded-2xl bg-purple-600/30 border-2 border-purple-400/50 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <UserIcon size={32} className="text-purple-300" />
          </div>
          <h2 className="text-base font-black text-white">
            {currentUserProfile?.username || 'OhkneeMember'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Member since {new Date(currentUserProfile?.joinedDate || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </p>

          <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Available Balance</span>
              <div className="text-lg font-black text-emerald-400 mt-0.5">$150.00</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Completed Offers</span>
              <div className="text-lg font-black text-purple-300 mt-0.5">6 Verified</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={onOpenProfileModal}
            className="w-full p-3.5 rounded-2xl bg-[#0c101e] border border-slate-800 hover:border-purple-500/40 text-left flex items-center justify-between text-xs font-bold text-slate-200 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <UserIcon size={16} className="text-purple-400" />
              <span>Edit Profile & Avatar</span>
            </div>
            <ChevronRight size={14} className="text-slate-400" />
          </button>

          <button
            type="button"
            onClick={onOpenHowItWorks}
            className="w-full p-3.5 rounded-2xl bg-[#0c101e] border border-slate-800 hover:border-purple-500/40 text-left flex items-center justify-between text-xs font-bold text-slate-200 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <HelpCircle size={16} className="text-purple-400" />
              <span>How OHKNEE Works</span>
            </div>
            <ChevronRight size={14} className="text-slate-400" />
          </button>

          {/* Staff Access (Full access for Oniamaya3@gmail.com) */}
          <button
            type="button"
            onClick={onOpenStaffAuth}
            className="w-full p-3.5 rounded-2xl bg-[#0c101e] border border-amber-500/30 hover:border-amber-500/50 text-left flex items-center justify-between text-xs font-bold text-amber-300 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Lock size={16} className="text-amber-400" />
              <span>Staff Portal (Oniamaya3@gmail.com)</span>
            </div>
            <ChevronRight size={14} className="text-amber-400" />
          </button>

          {/* Owner Analytics */}
          <button
            type="button"
            onClick={onOpenAnalytics}
            className="w-full p-3.5 rounded-2xl bg-[#0c101e] border border-slate-800 hover:border-purple-500/40 text-left flex items-center justify-between text-xs font-bold text-slate-200 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <BarChart2 size={16} className="text-teal-400" />
              <span>Traffic & Visitor Analytics</span>
            </div>
            <ChevronRight size={14} className="text-slate-400" />
          </button>
        </div>
      </div>
    );
  }

  return null;
};
