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
import { EarnWordStudio } from './components/EarnWordStudio';
import { CompactOfferCard } from './components/CompactOfferCard';
import { HomepageHero } from './components/HomepageHero';
import { TrustReviewsSection } from './components/TrustReviewsSection';
import { ScammerMemeModal } from './components/ScammerMemeModal';
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
<<<<<<< HEAD
import { GitHubPushToast } from './components/GitHubPushToast';
import { GitHubSyncModal } from './components/GitHubSyncModal';
=======
import { MassCharacterEvacuationOverlay } from './components/MassCharacterEvacuationOverlay';
>>>>>>> parent of c5f07c3 (refactor: remove unused components and home tab)

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
  ArrowRight,
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
  const [isGitHubSyncModalOpen, setIsGitHubSyncModalOpen] = useState(false);
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

<<<<<<< HEAD
  // Mobile navigation active tab (opens to Home with the requested hero artwork, Top 10, or Earn)
  const [mobileTab, setMobileTab] = useState<MobileTab>('home');
  const [isScammerMemeOpen, setIsScammerMemeOpen] = useState<boolean>(false);

  // Animation & Transition tracking
=======
  // Animation & Transition tracking (session-persistent one-time initial breakaway)
>>>>>>> parent of c5f07c3 (refactor: remove unused components and home tab)
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
<<<<<<< HEAD
    // 1. Compute tab order for directional horizontal sliding (Home: 0, Top-10: 1, Earn: 2)
=======
    // 1. Red banner instant upward dismissal animation on first tab press
    if (isBannerVisible && !isBannerExiting) {
      setIsBannerExiting(true);
      setTimeout(() => {
        setIsBannerVisible(false);
        setIsBannerExiting(false);
      }, 300);
    }

    // 2. Compute tab order for directional horizontal sliding (Home: 0, Top-10: 1, Earn: 2)
>>>>>>> parent of c5f07c3 (refactor: remove unused components and home tab)
    const tabOrderMap: Record<MobileTab, number> = {
      home: 0,
      'top-10': 1,
      earn: 2,
    };
    const newDir = (tabOrderMap[tab] ?? 0) >= (tabOrderMap[mobileTab] ?? 0) ? 1 : -1;
    setSlideDirection(newDir);

    // 3. One-time initial entry animation check
    if (!hasPlayedInitialAnimation) {
      setIsInitialBreakaway(true);

      if (tab === 'home') {
<<<<<<< HEAD
        setMobileTab('home');
        setSelectedCategory('all');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsInitialBreakaway(false);
=======
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
>>>>>>> parent of c5f07c3 (refactor: remove unused components and home tab)
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
<<<<<<< HEAD
        setSelectedCategory('all');
=======
        setHomeViewMode('ascend');
        setSelectedCategory('all');
        setSearchQuery('');
>>>>>>> parent of c5f07c3 (refactor: remove unused components and home tab)
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
<<<<<<< HEAD
    <div className="fixed inset-0 w-full h-full bg-[#0d0f15] text-slate-100 flex flex-col overflow-hidden select-none selection:bg-purple-600 selection:text-white">
=======
    <div
      className={
        isHomepage
          ? 'h-screen max-h-screen overflow-hidden bg-transparent text-slate-900 flex flex-col selection:bg-purple-200 selection:text-purple-950'
          : 'min-h-screen bg-[#0d0f15] text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white'
      }
    >
>>>>>>> parent of c5f07c3 (refactor: remove unused components and home tab)
      {/* 1. CLEAN TOP APPLICATION BRANDING & TABS (OHKNEE.COM) */}
      <Navbar
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
<<<<<<< HEAD
        isHomepage={mobileTab === 'home'}
=======
        isHomepage={isHomepage}
>>>>>>> parent of c5f07c3 (refactor: remove unused components and home tab)
        onOpenScammerMeme={() => setIsScammerMemeOpen(true)}
        onGoHome={() => {
          setSelectedCategory('all');
          setSearchQuery('');
<<<<<<< HEAD
          handleSelectMobileTab('home');
=======
          setMobileTab('home');
          setHomeViewMode('initial');
>>>>>>> parent of c5f07c3 (refactor: remove unused components and home tab)
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
      <div className="flex-1 min-h-0 w-full overflow-hidden flex flex-col relative">
        <PageTransitionWrapper
          currentTab={mobileTab}
          isInitialBreakaway={isInitialBreakaway}
          slideDirection={slideDirection}
        >
<<<<<<< HEAD
          {/* HOME VIEW (Original Homepage with sunset quest hero image artwork + Community reviews) */}
          {mobileTab === 'home' ? (
            <div id="home-view-container" className="flex-1 min-h-0 w-full overflow-y-auto pb-24 md:pb-20 overscroll-contain">
              <HomepageHero
                onExploreClick={() => {
                  handleSelectMobileTab('top-10');
                }}
              />
              <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-4">
                <TrustReviewsSection />
              </div>
            </div>
          ) : mobileTab === 'top-10' ? (
            <div className="flex-1 min-h-0 w-full overflow-y-auto pb-24 md:pb-20 overscroll-contain">
=======
          {/* HOMEPAGE VIEW vs DEDICATED TOP 10 VIEW vs OFFER MARKETPLACE */}
          {mobileTab === 'top-10' ? (
            <div className="flex-1 w-full overflow-y-auto">
>>>>>>> parent of c5f07c3 (refactor: remove unused components and home tab)
              <Top10MobileView
                offers={top10Offers}
                allOffers={allOffers}
                onSelectOffer={setSelectedOffer}
                onToggleSave={handleToggleSaveOffer}
                savedOfferIds={savedOfferIds}
                onUpdateOffers={setAllOffers}
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
            /* EARN VIEW: DEDICATED MICROSOFT WORD TOOLS & BLURRY IMAGE FIXER STUDIO */
            <main
              id="earn-studio-view"
              className="flex-1 min-h-0 w-full overflow-y-auto max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-4 pb-24 md:pb-20 select-none overscroll-contain"
            >
              <EarnWordStudio
                allOffers={allOffers}
                onUpdateOffers={setAllOffers}
              />
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

      {/* 21. REAL-TIME GITHUB PUSH STATUS NOTIFICATION */}
      <GitHubPushToast onOpenSettings={() => setIsGitHubSyncModalOpen(true)} />

      {/* 22. GITHUB SYNC & AUTO-PUSH MODAL */}
      <GitHubSyncModal
        isOpen={isGitHubSyncModalOpen}
        onClose={() => setIsGitHubSyncModalOpen(false)}
      />

      {/* 23. SCAMMER MEME CARTOON MODAL */}
      <ScammerMemeModal
        isOpen={isScammerMemeOpen}
        onClose={() => setIsScammerMemeOpen(false)}
        onFinish={() => {
          setIsScammerMemeOpen(false);
          handleSelectMobileTab('top-10');
        }}
      />
    </div>
  );
}
