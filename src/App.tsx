import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CardData, CardDetail, TabConfig, UserProfile } from './types';
import {
  DEFAULT_TABS,
  INITIAL_FAST_EASY_CARDS,
  INITIAL_CASINO_CARDS,
  INITIAL_FREE_MONEY_CARDS,
  INITIAL_REFERRAL_CARDS,
} from './data/offersData';
import {
  getAllEnrichedOffers,
  enrichCard,
  EnrichedOffer,
} from './data/enrichedOffers';
import { getUserProfile, logoutUser } from './data/wiiAvatars';
import {
  getFromStorage,
  saveToStorage,
  STORE_CARDS,
  STORE_DETAIL,
} from './utils';
import { trackPageView, startPresenceTracking } from './utils/trafficTracker';

// Components
import { Navbar } from './components/Navbar';
import {
  PlatformFilter,
  CategoryFilter,
  SortOption,
} from './components/SearchAndFilters';
import { MyOffersRow } from './components/MyOffersRow';
import { CategoryOfferRow } from './components/CategoryOfferRow';
import { CategoryNavStrip } from './components/CategoryNavStrip';
import { CompactOfferCard } from './components/CompactOfferCard';
import { OfferDetailModal } from './components/OfferDetailModal';
import { MobileBottomNav, MobileTab } from './components/MobileBottomNav';
import { OwnerAnalyticsModal } from './components/OwnerAnalyticsModal';
import { StaffAuthModal } from './components/StaffAuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { HomepageHero } from './components/HomepageHero';
import { Top10MobileView } from './components/Top10MobileView';
import { TrustReviewsSection } from './components/TrustReviewsSection';
import { ScammerMemeModal } from './components/ScammerMemeModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { RedditNotificationBanner } from './components/RedditNotificationBanner';
import { InboxModal } from './components/InboxModal';
import { AscendOffersDashboard } from './components/AscendOffersDashboard';
import { PageTransitionWrapper } from './components/PageTransitionWrapper';
import { MassCharacterEvacuationOverlay } from './components/MassCharacterEvacuationOverlay';

// Icons
import {
  Flame,
  Zap,
  Coins,
  Gift,
  Gamepad2,
  Sparkles,
  Layers,
  Trophy,
  BarChart2,
  Lock,
  User,
  Star,
  Maximize2,
  Minimize2,
  Filter,
  Check,
  ChevronDown,
} from 'lucide-react';

const STORE_SAVED_OFFERS = 'ohknee_saved_offers_v2';

const ALL_CATEGORY_ROW_IDS = [
  'row-featured',
  'row-fast-offers',
  'row-finance',
  'row-sweepstakes',
];

export default function App() {
  // Master offer collection with data enrichment
  const [allOffers, setAllOffers] = useState<EnrichedOffer[]>(() => {
    const savedCustomCards = getFromStorage<CardData[] | null>(STORE_CARDS, null);
    if (savedCustomCards && Array.isArray(savedCustomCards) && savedCustomCards.length > 0) {
      return savedCustomCards.map(enrichCard);
    }
    return getAllEnrichedOffers();
  });

  // Secret sauce details
  const [details, setDetails] = useState<Record<string, CardDetail>>(() => {
    return getFromStorage(STORE_DETAIL, {});
  });

  // User's saved / favorited offers
  const [savedOfferIds, setSavedOfferIds] = useState<Set<string>>(() => {
    const saved = getFromStorage<string[]>(STORE_SAVED_OFFERS, []);
    return new Set(saved);
  });

  // Category rows open/closed state (starts with Featured open like in screenshot)
  const [openRowIds, setOpenRowIds] = useState<Set<string>>(new Set(['row-featured']));

  // Earn Tab single frame view and quick filter states
  const [isSingleFrame, setIsSingleFrame] = useState(false);
  const [earnFilterMenuOpen, setEarnFilterMenuOpen] = useState(false);
  const [quickFilter, setQuickFilter] = useState<'all' | 'instant' | 'high_value' | 'daily' | 'saved'>('all');

  // Navigation, Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformFilter>('all');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [selectedSort, setSelectedSort] = useState<SortOption>('recommended');

  // Active detail modal
  const [selectedOffer, setSelectedOffer] = useState<EnrichedOffer | null>(null);

  // Other system modals
  const [isOwnerAnalyticsOpen, setIsOwnerAnalyticsOpen] = useState(false);
  const [isStaffAuthOpen, setIsStaffAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScammerMemeOpen, setIsScammerMemeOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [isNotificationDismissed, setIsNotificationDismissed] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(() => {
    return (
      getUserProfile() || {
        username: 'OhkneeMember',
        avatarId: 'avatar-001',
        joinedDate: new Date().toISOString(),
        balance: 150.0,
        claimedBonusCount: 6,
      }
    );
  });

  // Mobile navigation active tab & home view mode
  const [mobileTab, setMobileTab] = useState<MobileTab>('home');
  const [homeViewMode, setHomeViewMode] = useState<'initial' | 'ascend'>('initial');

  // Animation & Transition tracking (session-persistent one-time initial breakaway)
  const [hasPlayedInitialAnimation, setHasPlayedInitialAnimation] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('ohknee_initial_anim_played') === 'true';
    } catch {
      return false;
    }
  });
  const [isInitialBreakaway, setIsInitialBreakaway] = useState<boolean>(false);
  const [showCharacterEvacuation, setShowCharacterEvacuation] = useState<boolean>(false);
  const [slideDirection, setSlideDirection] = useState<number>(1);

  // Red banner dismissal state
  const [isBannerVisible, setIsBannerVisible] = useState<boolean>(true);
  const [isBannerExiting, setIsBannerExiting] = useState<boolean>(false);

  // Search input ref to focus
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Toggle open/closed state for a specific row
  const handleToggleRow = (rowId: string) => {
    setOpenRowIds((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }
      return next;
    });
  };

  // Expand all rows
  const handleExpandAllRows = () => {
    setOpenRowIds(new Set(ALL_CATEGORY_ROW_IDS));
  };

  // Collapse all rows (close everything)
  const handleCollapseAllRows = () => {
    setOpenRowIds(new Set());
  };

  // Sync saved offers to localStorage
  const handleToggleSaveOffer = (offerId: string) => {
    setSavedOfferIds((prev) => {
      const next = new Set(prev);
      if (next.has(offerId)) {
        next.delete(offerId);
      } else {
        next.add(offerId);
      }
      saveToStorage(STORE_SAVED_OFFERS, Array.from(next));
      return next;
    });
  };

  // Update secret sauce detail
  const handleUpdateDetail = (cardId: string, newDetail: CardDetail) => {
    setDetails((prev) => {
      const next = { ...prev, [cardId]: newDetail };
      saveToStorage(STORE_DETAIL, next);
      return next;
    });
  };

  // Analytics tracking
  useEffect(() => {
    trackPageView('home-gemsloot-redesign');
    const stopPresence = startPresenceTracking('home');
    return () => {
      stopPresence();
    };
  }, []);

  // Filter & Sort Engine
  const filteredOffers = useMemo(() => {
    let list = [...allOffers];

    // 1. Text Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((offer) => {
        return (
          offer.name.toLowerCase().includes(q) ||
          (offer.code && offer.code.toLowerCase().includes(q)) ||
          (offer.domain && offer.domain.toLowerCase().includes(q)) ||
          (offer.instructionSub && offer.instructionSub.toLowerCase().includes(q)) ||
          (offer.payout && offer.payout.toLowerCase().includes(q)) ||
          (offer.badgeType && offer.badgeType.toLowerCase().includes(q)) ||
          (offer.descriptionText && offer.descriptionText.toLowerCase().includes(q))
        );
      });
    }

    // 2. Platform Filter
    if (selectedPlatform !== 'all') {
      list = list.filter((offer) => offer.platforms.includes(selectedPlatform));
    }

    // 3. Category Filter
    if (selectedCategory !== 'all' && mobileTab !== 'earn') {
      list = list.filter((offer) => offer.categories.includes(selectedCategory));
    }

    // 4. Sorting
    if (selectedSort === 'payout-desc') {
      list.sort((a, b) => b.rewardValue - a.rewardValue);
    } else if (selectedSort === 'payout-asc') {
      list.sort((a, b) => a.rewardValue - b.rewardValue);
    } else if (selectedSort === 'alpha') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Recommended default: order numbers first, then featured, then rating
      list.sort((a, b) => {
        if (a.orderNumber && b.orderNumber) return a.orderNumber - b.orderNumber;
        if (a.orderNumber) return -1;
        if (b.orderNumber) return 1;
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return (b.ratingValue || 5) - (a.ratingValue || 5);
      });
    }

    return list;
  }, [allOffers, searchQuery, selectedPlatform, selectedCategory, selectedSort]);

  // Specific Categorized Sets for the Redesigned Hierarchy
  const savedOffersList = useMemo(() => {
    return allOffers.filter((o) => savedOfferIds.has(o.id));
  }, [allOffers, savedOfferIds]);

  const top10Offers = useMemo(() => {
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

  // 1. FEATURED (Top verified rewards & high yield partners)
  const featuredOffers = useMemo(() => {
    let list = filteredOffers.filter(
      (o) =>
        o.isFeatured ||
        o.categories.includes('featured') ||
        ['fast-stake', 'fast-gemsloot', 'fast-freecash', 'fast-kalshi', 'fast-coinbase', 'fast-onepay', '30', '19', '13', '4', '9', '1'].includes(o.id)
    );
    if (quickFilter === 'instant') {
      list = list.filter((o) => o.payoutTag?.includes('INSTANT') || o.instructionSub?.includes('instant') || o.id.includes('fast-'));
    } else if (quickFilter === 'high_value') {
      list = list.filter((o) => o.rewardValue >= 25);
    } else if (quickFilter === 'daily') {
      list = list.filter((o) => o.payoutTag?.includes('DAILY') || o.payout?.toLowerCase().includes('daily'));
    } else if (quickFilter === 'saved') {
      list = list.filter((o) => savedOfferIds.has(o.id));
    }
    return list;
  }, [filteredOffers, quickFilter, savedOfferIds]);

  // 2. FAST OFFERS (Sequential fast cash, trials & instant cashback)
  const fastOffers = useMemo(() => {
    let list = filteredOffers
      .filter(
        (o) =>
          o.categories.includes('fast-easy') ||
          o.categories.includes('signup-trial') ||
          o.tabId === 'fast-easy-money' ||
          ['free-metawin', 'free-debbie', 'free-myappfree', 'free-fetch', 'free-joko', 'free-shopback', 'free-snaplii', 'free-franki', 'ref-dabble'].includes(o.id)
      )
      .sort((a, b) => (a.orderNumber || 99) - (b.orderNumber || 99));

    if (quickFilter === 'instant') {
      list = list.filter((o) => o.payoutTag?.includes('INSTANT') || o.instructionSub?.includes('instant') || o.id.includes('fast-'));
    } else if (quickFilter === 'high_value') {
      list = list.filter((o) => o.rewardValue >= 25);
    } else if (quickFilter === 'daily') {
      list = list.filter((o) => o.payoutTag?.includes('DAILY') || o.payout?.toLowerCase().includes('daily'));
    } else if (quickFilter === 'saved') {
      list = list.filter((o) => savedOfferIds.has(o.id));
    }
    return list;
  }, [filteredOffers, quickFilter, savedOfferIds]);

  // 3. FINANCE (Banking, crypto, credit boosters, investments)
  const financeOffers = useMemo(() => {
    let list = filteredOffers.filter(
      (o) =>
        o.categories.includes('finance') ||
        o.categories.includes('banking') ||
        o.categories.includes('crypto') ||
        ['free-koinly', 'free-bydfi', 'free-kraken', 'free-sofi', 'ref-robinhood', 'ref-onepay', 'ref-sofibank', 'ref-aven', 'ref-sendwave', 'ref-self', 'ref-ava', 'ref-moneylion'].includes(o.id)
    );
    if (quickFilter === 'instant') {
      list = list.filter((o) => o.payoutTag?.includes('INSTANT') || o.instructionSub?.includes('instant') || o.id.includes('fast-'));
    } else if (quickFilter === 'high_value') {
      list = list.filter((o) => o.rewardValue >= 25);
    } else if (quickFilter === 'daily') {
      list = list.filter((o) => o.payoutTag?.includes('DAILY') || o.payout?.toLowerCase().includes('daily'));
    } else if (quickFilter === 'saved') {
      list = list.filter((o) => savedOfferIds.has(o.id));
    }
    return list;
  }, [filteredOffers, quickFilter, savedOfferIds]);

  // 4. SWEEPSTAKE & CASINOS (All 30 sweepstakes, daily SC, wheels & sports)
  const sweepstakesOffers = useMemo(() => {
    let list = filteredOffers.filter(
      (o) =>
        o.categories.includes('sweepstakes') ||
        o.categories.includes('bonuses-promos') ||
        o.categories.includes('puzzles') ||
        o.tabId === 'casino-codes' ||
        ['ref-dabble', 'ref-underdog', 'ref-prizepicks'].includes(o.id)
    );
    if (quickFilter === 'instant') {
      list = list.filter((o) => o.payoutTag?.includes('INSTANT') || o.instructionSub?.includes('instant') || o.id.includes('fast-'));
    } else if (quickFilter === 'high_value') {
      list = list.filter((o) => o.rewardValue >= 25);
    } else if (quickFilter === 'daily') {
      list = list.filter((o) => o.payoutTag?.includes('DAILY') || o.payout?.toLowerCase().includes('daily'));
    } else if (quickFilter === 'saved') {
      list = list.filter((o) => savedOfferIds.has(o.id));
    }
    return list;
  }, [filteredOffers, quickFilter, savedOfferIds]);

  // Reset all active filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedPlatform('all');
    setSelectedCategory('all');
    setSelectedSort('recommended');
  };

  // Jump from mobile navigation with initial breakaway animation or fluid horizontal glide
  const handleSelectMobileTab = (tab: MobileTab) => {
    // 1. Red banner instant upward dismissal animation on first tab press
    if (isBannerVisible && !isBannerExiting) {
      setIsBannerExiting(true);
      setTimeout(() => {
        setIsBannerVisible(false);
        setIsBannerExiting(false);
      }, 300);
    }

    // 2. Compute tab order for directional horizontal sliding (Home: 0, Top-10: 1, Earn: 2)
    const tabOrderMap: Record<MobileTab, number> = {
      home: 0,
      'top-10': 1,
      earn: 2,
    };
    const newDir = tabOrderMap[tab] >= tabOrderMap[mobileTab] ? 1 : -1;
    setSlideDirection(newDir);

    // 3. One-time initial entry animation check
    if (!hasPlayedInitialAnimation) {
      setIsInitialBreakaway(true);

      if (tab === 'home') {
        // "Home" Tab First-Click: Mass Character Evacuation Effect
        setShowCharacterEvacuation(true);
        setMobileTab('home');
        setHomeViewMode('ascend');
        setSelectedCategory('all');
        setSearchQuery('');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(() => {
          setShowCharacterEvacuation(false);
          setIsInitialBreakaway(false);
          setHasPlayedInitialAnimation(true);
          try {
            sessionStorage.setItem('ohknee_initial_anim_played', 'true');
          } catch {}
        }, 450);
      } else if (tab === 'top-10') {
        // "Top 10" Tab First-Click: Slide & Glitch Breakaway
        setMobileTab('top-10');
        setSelectedCategory('top-10' as any);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(() => {
          setIsInitialBreakaway(false);
          setHasPlayedInitialAnimation(true);
          try {
            sessionStorage.setItem('ohknee_initial_anim_played', 'true');
          } catch {}
        }, 320);
      } else if (tab === 'earn') {
        // "Earn" Tab First-Click: 3D Card Flip / Drop-In Breakaway
        setMobileTab('earn');
        setSelectedCategory('all');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(() => {
          setIsInitialBreakaway(false);
          setHasPlayedInitialAnimation(true);
          try {
            sessionStorage.setItem('ohknee_initial_anim_played', 'true');
          } catch {}
        }, 350);
      }
    } else {
      // Subsequent Tab Navigation: Unified continuous horizontal glide (200ms–250ms)
      setIsInitialBreakaway(false);
      setMobileTab(tab);

      if (tab === 'home') {
        setHomeViewMode('ascend');
        setSelectedCategory('all');
        setSearchQuery('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (tab === 'top-10') {
        setSelectedCategory('top-10' as any);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (tab === 'earn') {
        setSelectedCategory('all');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Transition from Cash App cartoon to Top 10 section
  const handleFinishCashAppAnimation = () => {
    if (isBannerVisible && !isBannerExiting) {
      setIsBannerExiting(true);
      setTimeout(() => {
        setIsBannerVisible(false);
        setIsBannerExiting(false);
      }, 300);
    }
    setIsScammerMemeOpen(false);
    setSelectedCategory('top-10' as any);
    setMobileTab('top-10');
    setOpenRowIds((prev) => new Set([...prev, 'row-top10']));
    setTimeout(() => {
      const el = document.getElementById('row-top10') || document.getElementById('offers-explorer-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const isHomepage =
    selectedCategory === 'all' &&
    searchQuery.trim() === '' &&
    mobileTab === 'home' &&
    homeViewMode === 'initial';

  const handleSelectCategory = (catId: string) => {
    if (isBannerVisible && !isBannerExiting) {
      setIsBannerExiting(true);
      setTimeout(() => {
        setIsBannerVisible(false);
        setIsBannerExiting(false);
      }, 300);
    }
    setSlideDirection(1);
    setIsInitialBreakaway(false);
    setSelectedCategory(catId as CategoryFilter);
    setMobileTab(catId === 'top-10' ? 'top-10' : 'earn');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (catId !== 'all') {
      const rowMap: Record<string, string> = {
        'fast-easy': 'row-fast-offers',
        'finance': 'row-finance',
        'signup-trial': 'row-signup',
        'sweepstakes': 'row-sweepstakes',
        'puzzles': 'row-puzzles',
        'play-to-earn': 'row-play-to-earn',
        'featured': 'row-featured',
        'top-10': 'row-top10',
      };
      const rowId = rowMap[catId] || `row-${catId}`;
      setOpenRowIds((prev) => new Set(prev).add(rowId));
    }
  };

  return (
    <div
      className={
        isHomepage
          ? 'h-screen max-h-screen overflow-hidden bg-transparent text-slate-900 flex flex-col selection:bg-purple-200 selection:text-purple-950'
          : 'min-h-screen bg-[#0d0f15] text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white'
      }
    >
      {/* 1. CLEAN TOP APPLICATION BRANDING & TABS (OHKNEE.COM) */}
      <Navbar
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        isHomepage={isHomepage}
        onOpenScammerMeme={() => setIsScammerMemeOpen(true)}
        onGoHome={() => {
          setSelectedCategory('all');
          setSearchQuery('');
          setMobileTab('home');
          setHomeViewMode('initial');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 2. REDDIT-STYLE DROP-DOWN NOTIFICATION BANNER (Slides down from behind top white header on initial load, floats up on dismiss) */}
      {isBannerVisible && (
        <RedditNotificationBanner
          onVisitInbox={() => setIsInboxOpen(true)}
          isDismissed={isNotificationDismissed}
          isExiting={isBannerExiting}
          onDismiss={() => {
            setIsNotificationDismissed(true);
            setIsBannerVisible(false);
          }}
        />
      )}

      {/* Mass Character Evacuation Overlay (Home First-Click Breakaway) */}
      {showCharacterEvacuation && (
        <MassCharacterEvacuationOverlay
          onComplete={() => setShowCharacterEvacuation(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full transition-all overflow-hidden">
        <PageTransitionWrapper
          currentTab={mobileTab}
          isInitialBreakaway={isInitialBreakaway}
          slideDirection={slideDirection}
        >
          {/* HOMEPAGE VIEW vs DEDICATED TOP 10 VIEW vs OFFER MARKETPLACE */}
          {mobileTab === 'top-10' ? (
            <div className="flex-1 w-full overflow-y-auto">
              <Top10MobileView
                offers={top10Offers}
                allOffers={allOffers}
                onSelectOffer={setSelectedOffer}
                onToggleSave={handleToggleSaveOffer}
                savedOfferIds={savedOfferIds}
              />
            </div>
          ) : mobileTab === 'home' ? (
            homeViewMode === 'ascend' ? (
              <div className="flex-1 w-full overflow-y-auto">
                <AscendOffersDashboard
                  onSelectOffer={(offer) => {
                    const matched = allOffers.find((o) => o.id === offer.id);
                    setSelectedOffer(matched || (offer as any));
                  }}
                  onExploreEarn={() => handleSelectMobileTab('earn')}
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center overflow-y-auto px-4 pb-16 lg:pb-8">
                <HomepageHero onExploreClick={() => handleSelectMobileTab('top-10')} />
                {/* Desktop Trusted Community text section (no image, no yellow star, no chat room) */}
                <div className="hidden md:block w-full">
                  <TrustReviewsSection />
                </div>
              </div>
            )
          ) : (
            /* OFFERS EXPLORER SECTION (EARN - EXACT 4 TABS & GEMSLOOT GUI) */
            <main
              id="offers-explorer-section"
              className={`flex-1 w-full bg-[#0d0f15] text-slate-100 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 select-none ${
                isSingleFrame
                  ? 'h-[calc(100vh-80px)] overflow-hidden flex flex-col justify-between pb-24 md:pb-16'
                  : 'min-h-screen overflow-y-auto pb-28 md:pb-20'
              }`}
            >
              {/* TOP BAR: My Offers + Filter Dropdown + Single Frame Toggle + Expand All */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 mb-2.5 sm:mb-3 px-0.5">
                {/* Left: Gem Icon + My Offers Title + Filter Dropdown (Gemsloot GUI) */}
                <div className="flex items-center gap-2 sm:gap-3 relative">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl">💎</span>
                    <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                      My Offers
                    </h2>
                  </div>

                  {/* Filter Dropdown Button */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setEarnFilterMenuOpen((prev) => !prev)}
                      className="flex items-center gap-1.5 bg-[#151926] hover:bg-[#1c2234] border border-[#242c40] text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Filter size={12} className="text-purple-400" />
                      <span>
                        {quickFilter === 'all'
                          ? 'Filter'
                          : quickFilter === 'instant'
                          ? 'Instant Cash'
                          : quickFilter === 'high_value'
                          ? '$25+ Value'
                          : quickFilter === 'daily'
                          ? 'Daily SC'
                          : 'Saved'}
                      </span>
                      <ChevronDown size={13} className="text-slate-400" />
                    </button>

                    {/* Filter Options Dropdown Popover */}
                    {earnFilterMenuOpen && (
                      <div className="absolute left-0 top-full mt-1.5 z-30 w-44 rounded-xl bg-[#131722] border border-[#23293b] shadow-2xl p-1.5 space-y-0.5 animate-in fade-in duration-150">
                        {[
                          { id: 'all', label: 'All Verified Offers' },
                          { id: 'instant', label: '⚡ Instant Payouts' },
                          { id: 'high_value', label: '💰 $25+ High Value' },
                          { id: 'daily', label: '⭐ Free Daily SC' },
                          { id: 'saved', label: '🔖 My Saved Offers' },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              setQuickFilter(opt.id as any);
                              setEarnFilterMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-bold text-left cursor-pointer transition-colors ${
                              quickFilter === opt.id
                                ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                                : 'text-slate-300 hover:bg-[#1a2030] hover:text-white border border-transparent'
                            }`}
                          >
                            <span>{opt.label}</span>
                            {quickFilter === opt.id && (
                              <Check size={12} className="text-purple-400" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Single Frame Mode Toggle & Master Expand / Collapse */}
                <div className="flex items-center gap-2">
                  {/* Single Frame Mode Toggle (Fits everything in one frame without scrolling) */}
                  <button
                    type="button"
                    onClick={() => setIsSingleFrame((prev) => !prev)}
                    title={
                      isSingleFrame
                        ? 'Switch to Standard Scrolling View'
                        : 'Fit all 4 categories in a single frame without scrolling'
                    }
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      isSingleFrame
                        ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-900/40'
                        : 'bg-[#151926] hover:bg-[#1c2234] border-[#242c40] text-slate-300 hover:text-white'
                    }`}
                  >
                    {isSingleFrame ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                    <span className="hidden sm:inline">
                      {isSingleFrame ? 'Exit Single Frame' : 'Single Frame View'}
                    </span>
                    <span className="sm:hidden">
                      {isSingleFrame ? 'Standard' : '1-Frame'}
                    </span>
                  </button>

                  {/* Expand / Collapse All Rows Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const allOpen = ALL_CATEGORY_ROW_IDS.every((id) =>
                        openRowIds.has(id)
                      );
                      if (allOpen) {
                        handleCollapseAllRows();
                      } else {
                        handleExpandAllRows();
                      }
                    }}
                    className="bg-[#151926] hover:bg-[#1c2234] border border-[#242c40] text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    {ALL_CATEGORY_ROW_IDS.every((id) => openRowIds.has(id))
                      ? 'Collapse All'
                      : 'Expand All'}
                  </button>
                </div>
              </div>

              {/* 4 Categorized Tabs at Top of Earn (as requested: "i want 4 tab only") */}
              <CategoryNavStrip
                activeCategory={selectedCategory}
                onSelectCategory={(tab) => {
                  setSelectedCategory(tab.id as CategoryFilter);
                  setOpenRowIds((prev) => new Set(prev).add(tab.rowId));
                  setTimeout(() => {
                    const el = document.getElementById(tab.rowId);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                  }, 50);
                }}
              />

              {/* THE EXACT 4 CATEGORY ROWS (Gemsloot GUI with Expandable Ribbons & Carousels) */}
              <div
                className={`w-full ${
                  isSingleFrame
                    ? 'flex-1 flex flex-col justify-around overflow-hidden'
                    : 'space-y-3 sm:space-y-4'
                }`}
              >
                {/* 1. FEATURED OFFERS */}
                <CategoryOfferRow
                  id="row-featured"
                  title="Featured"
                  subtitle="Top verified rewards with instant claim access"
                  icon={<Flame size={20} className="stroke-[2.2]" />}
                  offers={featuredOffers}
                  savedOfferIds={savedOfferIds}
                  isOpen={openRowIds.has('row-featured')}
                  onToggleOpen={() => handleToggleRow('row-featured')}
                  onSelectOffer={setSelectedOffer}
                  onToggleSave={handleToggleSaveOffer}
                  isSingleFrame={isSingleFrame}
                />

                {/* 2. FAST OFFERS */}
                <CategoryOfferRow
                  id="row-fast-offers"
                  title="Fast Offers"
                  subtitle="$100 - $150 sequential easy cash & instant tasks"
                  icon={<Zap size={20} className="stroke-[2.2]" />}
                  offers={fastOffers}
                  savedOfferIds={savedOfferIds}
                  isOpen={openRowIds.has('row-fast-offers')}
                  onToggleOpen={() => handleToggleRow('row-fast-offers')}
                  onSelectOffer={setSelectedOffer}
                  onToggleSave={handleToggleSaveOffer}
                  isSingleFrame={isSingleFrame}
                />

                {/* 3. FINANCE */}
                <CategoryOfferRow
                  id="row-finance"
                  title="Finance"
                  subtitle="Banking, crypto exchanges, and high-value credit booster rewards"
                  icon={<Coins size={20} className="stroke-[2.2]" />}
                  offers={financeOffers}
                  savedOfferIds={savedOfferIds}
                  isOpen={openRowIds.has('row-finance')}
                  onToggleOpen={() => handleToggleRow('row-finance')}
                  onSelectOffer={setSelectedOffer}
                  onToggleSave={handleToggleSaveOffer}
                  isSingleFrame={isSingleFrame}
                />

                {/* 4. SWEEPSTAKE */}
                <CategoryOfferRow
                  id="row-sweepstakes"
                  title="Sweepstake"
                  subtitle="Daily free SC coins, sweepstakes casinos & prize wheels"
                  icon={<Star size={20} className="stroke-[2.2]" />}
                  offers={sweepstakesOffers}
                  savedOfferIds={savedOfferIds}
                  isOpen={openRowIds.has('row-sweepstakes')}
                  onToggleOpen={() => handleToggleRow('row-sweepstakes')}
                  onSelectOffer={setSelectedOffer}
                  onToggleSave={handleToggleSaveOffer}
                  isSingleFrame={isSingleFrame}
                />
              </div>

              {/* Footer Disclaimer (Only in normal scrolling mode) */}
              {!isSingleFrame && (
                <footer className="mt-12 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500 space-y-2">
                  <p>
                    © {new Date().getFullYear()} OHKNEE.COM. All partner bonuses and promo codes verified.
                  </p>
                  <p className="text-[11px] text-slate-600 max-w-xl mx-auto">
                    Please participate responsibly. Offers subject to individual terms and regional availability.
                  </p>
                </footer>
              )}
            </main>
          )}
        </PageTransitionWrapper>
      </div>

      {/* Subtle Bottom-Right Owner & Staff Controls */}
      <aside
        id="bottom-right-admin-pod"
        aria-label="Admin Controls"
        className="fixed bottom-20 sm:bottom-4 right-4 z-40 flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#090e1a]/85 border border-slate-800/80 backdrop-blur-md shadow-xl"
      >
        <button
          type="button"
          onClick={() => setIsOwnerAnalyticsOpen(true)}
          className="p-2 rounded-xl text-slate-400 hover:text-teal-300 hover:bg-slate-800/80 transition-colors cursor-pointer"
          title="Owner Analytics"
          aria-label="Owner Analytics"
        >
          <BarChart2 size={16} />
        </button>
        <button
          type="button"
          onClick={() => setIsStaffAuthOpen(true)}
          className="p-2 rounded-xl text-slate-400 hover:text-teal-300 hover:bg-slate-800/80 transition-colors cursor-pointer"
          title="Staff Portal (Full access for Oniamaya3@gmail.com)"
          aria-label="Staff Portal"
        >
          <Lock size={16} />
        </button>
        <button
          type="button"
          onClick={() => setIsProfileOpen(true)}
          className="p-2 rounded-xl text-slate-400 hover:text-teal-300 hover:bg-slate-800/80 transition-colors cursor-pointer"
          title="User Profile"
          aria-label="User Profile"
        >
          <User size={16} />
        </button>
      </aside>

      {/* 13. DEDICATED MOBILE BOTTOM NAVIGATION */}
      <MobileBottomNav
        currentTab={mobileTab}
        onSelectTab={handleSelectMobileTab}
        savedCount={savedOfferIds.size}
        isDarkTheme={!isHomepage}
      />

      {/* 14. COMPREHENSIVE OFFER DETAIL MODAL */}
      <OfferDetailModal
        offer={selectedOffer}
        detail={selectedOffer ? details[selectedOffer.id] || { note: '', images: [], link2: '' } : { note: '', images: [], link2: '' }}
        isSaved={selectedOffer ? savedOfferIds.has(selectedOffer.id) : false}
        onToggleSave={handleToggleSaveOffer}
        onUpdateDetail={handleUpdateDetail}
        onClose={() => setSelectedOffer(null)}
      />

      {/* 15. STAFF AUTH MODAL (Full access for Oniamaya3@gmail.com) */}
      <StaffAuthModal
        isOpen={isStaffAuthOpen}
        onClose={() => setIsStaffAuthOpen(false)}
        onSuccess={() => {
          setIsStaffAuthOpen(false);
          setIsOwnerAnalyticsOpen(true);
        }}
      />

      {/* 16. OWNER ANALYTICS & TRAFFIC MODAL */}
      <OwnerAnalyticsModal
        isOpen={isOwnerAnalyticsOpen}
        onClose={() => setIsOwnerAnalyticsOpen(false)}
        cards={allOffers}
        tabs={DEFAULT_TABS}
      />

      {/* 17. USER PROFILE MODAL */}
      <UserProfileModal
        isOpen={isProfileOpen}
        userProfile={currentUserProfile}
        onClose={() => setIsProfileOpen(false)}
        onProfileUpdated={(updated) => setCurrentUserProfile(updated)}
        onLogout={() => {
          logoutUser();
          setCurrentUserProfile(null);
          setIsProfileOpen(false);
        }}
      />

      {/* 18. COMEDIC SCAMMER MEME / STICK FIGURE ANIMATION MODAL */}
      <ScammerMemeModal
        isOpen={isScammerMemeOpen}
        onClose={() => setIsScammerMemeOpen(false)}
        onFinish={handleFinishCashAppAnimation}
      />

      {/* 19. HOW IT WORKS MODAL */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onExplore={() => {
          const el = document.getElementById('offers-explorer-section');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
      />

      {/* 20. USER INBOX MODAL */}
      <InboxModal
        isOpen={isInboxOpen}
        onClose={() => setIsInboxOpen(false)}
        onClearNotifications={() => setIsNotificationDismissed(true)}
        onExploreOffers={() => {
          setSelectedCategory('all');
          setMobileTab('earn');
          const el = document.getElementById('offers-explorer-section');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
      />
    </div>
  );
}
