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
import { CategoryOfferRow } from './components/CategoryOfferRow';
import { OfferDetailModal } from './components/OfferDetailModal';
import { MobileBottomNav, MobileTab } from './components/MobileBottomNav';
import { OwnerAnalyticsModal } from './components/OwnerAnalyticsModal';
import { StaffAuthModal } from './components/StaffAuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { Top10MobileView } from './components/Top10MobileView';
import { HomepageHero } from './components/HomepageHero';
import { ScammerMemeModal } from './components/ScammerMemeModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { InboxModal } from './components/InboxModal';
import { PageTransitionWrapper } from './components/PageTransitionWrapper';

// Icons
import {
  Zap,
  Coins,
  Gift,
  Sparkles,
  Trophy,
  BarChart2,
  Lock,
  User,
  Star,
  Landmark,
} from 'lucide-react';

const STORE_SAVED_OFFERS = 'ohknee_saved_offers_v2';

const ALL_CATEGORY_ROW_IDS = [
  'row-online-casinos',
  'row-sports-betting',
  'row-free-crypto',
  'row-featured',
  'row-fast-offers',
  'row-finance',
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

  // Category rows open/closed state (starts completely closed / not expanded)
  const [openRowIds, setOpenRowIds] = useState<Set<string>>(new Set());

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
        createdAt: new Date().toISOString(),
        lastLoginDate: new Date().toISOString(),
      }
    );
  });

  // Mobile navigation active tab ('hero' for initial picture/description, 'top-10', 'earn')
  const [mobileTab, setMobileTab] = useState<MobileTab>('hero');

  // Animation & Transition tracking
  const [hasPlayedInitialAnimation, setHasPlayedInitialAnimation] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('ohknee_initial_anim_played') === 'true';
    } catch {
      return false;
    }
  });
  const [isInitialBreakaway, setIsInitialBreakaway] = useState<boolean>(false);
  const [slideDirection, setSlideDirection] = useState<number>(1);

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

  // Real-time Traffic Tracking
  useEffect(() => {
    trackPageView(mobileTab);
  }, [mobileTab]);

  useEffect(() => {
    const stopPresence = startPresenceTracking(currentUserProfile?.username || 'Guest');
    return () => {
      stopPresence();
    };
  }, [currentUserProfile?.username]);

  // Primary filtering logic
  const filteredOffers = useMemo(() => {
    let list = [...allOffers];

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((card) => {
        const nameMatch = card.name.toLowerCase().includes(q);
        const payoutMatch = card.payout.toLowerCase().includes(q);
        const codeMatch = card.code?.toLowerCase().includes(q);
        const categoryMatch = card.categories.some((c) => c.toLowerCase().includes(q));
        const subMatch = card.instructionSub?.toLowerCase().includes(q);
        return nameMatch || payoutMatch || codeMatch || categoryMatch || subMatch;
      });
    }

    // 2. Platform Filter
    if (selectedPlatform !== 'all') {
      list = list.filter((card) => card.platforms.includes(selectedPlatform));
    }

    // 3. Category Filter
    if (selectedCategory !== 'all') {
      list = list.filter((card) => card.categories.includes(selectedCategory));
    }

    // 4. Sorting
    if (selectedSort === 'payout-desc') {
      list.sort((a, b) => b.rewardValue - a.rewardValue);
    } else if (selectedSort === 'payout-asc') {
      list.sort((a, b) => a.rewardValue - b.rewardValue);
    } else if (selectedSort === 'alpha') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list.sort((a, b) => {
        if (a.orderNumber !== undefined && b.orderNumber !== undefined) {
          return a.orderNumber - b.orderNumber;
        }
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return (b.rating || 0) - (a.rating || 0);
      });
    }

    return list;
  }, [allOffers, searchQuery, selectedPlatform, selectedCategory, selectedSort]);

  const top10Offers = useMemo(() => {
    // Strictly lock: #1 Stake, #2 Freecash, #3 Gemsloot
    const isStake = (o: EnrichedOffer) =>
      o.id === 'fast-stake' || (o.name.toLowerCase().includes('stake') && !o.name.toLowerCase().includes('pulsz'));
    const isFreecash = (o: EnrichedOffer) =>
      o.id === 'fast-freecash' || o.name.toLowerCase().includes('freecash');
    const isGemsloot = (o: EnrichedOffer) =>
      o.id === 'fast-gemsloot' || o.name.toLowerCase().includes('gemsloot') || o.name.toLowerCase().includes('gems loot');

    const stakeOffer = allOffers.find(isStake);
    const freecashOffer = allOffers.find(isFreecash);
    const gemslootOffer = allOffers.find(isGemsloot);

    const lockedTop3 = [stakeOffer, freecashOffer, gemslootOffer].filter(Boolean) as EnrichedOffer[];
    const lockedIds = new Set(lockedTop3.map((o) => o.id));

    const remainingOffers = allOffers
      .filter((o) => !lockedIds.has(o.id))
      .sort((a, b) => {
        const orderA = a.orderNumber !== undefined ? a.orderNumber : 999;
        const orderB = b.orderNumber !== undefined ? b.orderNumber : 999;
        if (orderA !== orderB) return orderA - orderB;

        const getVal = (p?: string, v?: number) => {
          if (v && v > 0) return v;
          const match = p?.match(/\$(\d+)/);
          return match ? parseInt(match[1], 10) : 10;
        };
        return getVal(b.payout, b.rewardValue) - getVal(a.payout, a.rewardValue);
      });

    return [...lockedTop3, ...remainingOffers].slice(0, 10);
  }, [allOffers]);

  // 1. ONLINE CASINO FREE SPINS (formerly Sweepstakes)
  const onlineCasinoOffers = useMemo(() => {
    return filteredOffers
      .filter(
        (o) =>
          o.categories.includes('sweepstakes') ||
          o.categories.includes('puzzles') ||
          o.categories.includes('casino') ||
          o.tabId === 'casino-codes' ||
          ['casino-realprize', 'casino-chanced', 'casino-crowncoins', 'casino-spree', 'casino-high5', 'casino-pulsz', 'casino-mcluck', 'casino-fortunecoins'].includes(o.id)
      )
      .sort((a, b) => (a.orderNumber || 99) - (b.orderNumber || 99));
  }, [filteredOffers]);

  // 2. SPORTS BETTING APPS
  const sportsBettingOffers = useMemo(() => {
    return filteredOffers
      .filter(
        (o) =>
          o.categories.includes('sports-betting') ||
          o.categories.includes('sports') ||
          o.categories.includes('betting') ||
          ['ref-sportzino', 'ref-fliff', 'ref-sleeper', 'fast-kalshi', 'ref-dabble'].includes(o.id)
      )
      .sort((a, b) => (a.orderNumber || 99) - (b.orderNumber || 99));
  }, [filteredOffers]);

  // 3. FREE CRYPTO
  const cryptoOffers = useMemo(() => {
    return filteredOffers
      .filter(
        (o) =>
          o.categories.includes('crypto') ||
          ['fast-coinbase', 'free-koinly', 'free-bydfi', 'free-kraken', 'ref-gemini', 'ref-webull'].includes(o.id)
      )
      .sort((a, b) => (a.orderNumber || 99) - (b.orderNumber || 99));
  }, [filteredOffers]);

  // 4. FEATURED
  const featuredOffers = useMemo(() => {
    return filteredOffers.filter(
      (o) =>
        o.isFeatured ||
        o.categories.includes('featured') ||
        ['fast-stake', 'fast-gemsloot', 'fast-freecash', 'fast-kalshi', 'fast-coinbase', 'fast-onepay', '30', '19', '13', '4', '9', '1'].includes(o.id)
    );
  }, [filteredOffers]);

  // 5. FAST OFFERS
  const fastOffers = useMemo(() => {
    return filteredOffers
      .filter(
        (o) =>
          o.categories.includes('fast-easy') ||
          o.categories.includes('signup-trial') ||
          o.tabId === 'fast-easy-money' ||
          ['free-metawin', 'free-debbie', 'free-myappfree', 'free-fetch', 'free-joko', 'free-shopback', 'free-snaplii', 'free-franki'].includes(o.id)
      )
      .sort((a, b) => (a.orderNumber || 99) - (b.orderNumber || 99));
  }, [filteredOffers]);

  // 6. FINANCE
  const financeOffers = useMemo(() => {
    return filteredOffers.filter(
      (o) =>
        o.categories.includes('finance') ||
        o.categories.includes('banking') ||
        ['free-sofi', 'ref-robinhood', 'ref-onepay', 'ref-sofibank', 'ref-aven', 'ref-sendwave', 'ref-self', 'ref-ava', 'ref-moneylion'].includes(o.id)
    );
  }, [filteredOffers]);

  // Jump from mobile navigation
  const handleSelectMobileTab = (tab: MobileTab) => {
    const tabOrderMap: Record<MobileTab, number> = {
      hero: 0,
      'top-10': 1,
      earn: 2,
    };
    const newDir = tabOrderMap[tab] >= tabOrderMap[mobileTab] ? 1 : -1;
    setSlideDirection(newDir);

    if (!hasPlayedInitialAnimation) {
      setIsInitialBreakaway(true);
      setMobileTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      setTimeout(() => {
        setIsInitialBreakaway(false);
        setHasPlayedInitialAnimation(true);
        try {
          sessionStorage.setItem('ohknee_initial_anim_played', 'true');
        } catch {}
      }, 320);
    } else {
      setIsInitialBreakaway(false);
      setMobileTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinishCashAppAnimation = () => {
    setIsScammerMemeOpen(false);
    setMobileTab('top-10');
  };

  return (
    <div className="min-h-screen bg-[#0d0f15] text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      {/* 1. CLEAN TOP APPLICATION BRANDING (OHKNEE.COM) */}
      <Navbar
        onGoHome={() => {
          handleSelectMobileTab('hero');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full transition-all overflow-hidden">
        <PageTransitionWrapper
          currentTab={mobileTab}
          isInitialBreakaway={isInitialBreakaway}
          slideDirection={slideDirection}
        >
          {mobileTab === 'hero' ? (
            /* HERO PICTURE VIEW WITH DESCRIPTION (First opened & when clicking logo) */
            <div className="flex-1 w-full overflow-y-auto flex flex-col justify-center items-center py-6 sm:py-10 pb-28 md:pb-20">
              <HomepageHero
                onExploreClick={() => handleSelectMobileTab('top-10')}
                onEarnClick={() => handleSelectMobileTab('earn')}
              />
            </div>
          ) : mobileTab === 'top-10' ? (
            /* DEDICATED TOP 10 VIEW NUMBERED 1-10000 */
            <div className="flex-1 w-full overflow-y-auto">
              <Top10MobileView
                offers={top10Offers}
                allOffers={allOffers}
                onSelectOffer={setSelectedOffer}
                onToggleSave={handleToggleSaveOffer}
                savedOfferIds={savedOfferIds}
              />
            </div>
          ) : (
            /* OFFERS EXPLORER SECTION (EARN) - ALL TABS CLOSED ON OPEN, STARTS IMMEDIATELY WITH FEATURED ROW */
            <main
              id="offers-explorer-section"
              className="flex-1 w-full bg-[#0d0f15] text-slate-100 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-5 select-none min-h-screen overflow-y-auto pb-28 md:pb-20"
            >
              {/* THE 6 CATEGORY ROWS */}
              <div className="w-full space-y-3 sm:space-y-4">
                {/* 1. ONLINE CASINO FREE SPINS (TOP ROW) */}
                <CategoryOfferRow
                  id="row-online-casinos"
                  title="ONLINE CASINO FREE SPINS"
                  subtitle="Daily free SC coins, free spins, sweepstakes casinos & prize wheels"
                  icon={<Gift size={20} className="stroke-[2.2] text-emerald-400" />}
                  offers={onlineCasinoOffers}
                  savedOfferIds={savedOfferIds}
                  isOpen={openRowIds.has('row-online-casinos')}
                  onToggleOpen={() => handleToggleRow('row-online-casinos')}
                  onSelectOffer={setSelectedOffer}
                  onToggleSave={handleToggleSaveOffer}
                />

                {/* 2. SPORTS BETTING APPS */}
                <CategoryOfferRow
                  id="row-sports-betting"
                  title="Sports Betting Apps"
                  subtitle="Top sportsbooks, DFS picks, match deposits & risk-free entries"
                  icon={<Trophy size={20} className="stroke-[2.2] text-emerald-400" />}
                  offers={sportsBettingOffers}
                  savedOfferIds={savedOfferIds}
                  isOpen={openRowIds.has('row-sports-betting')}
                  onToggleOpen={() => handleToggleRow('row-sports-betting')}
                  onSelectOffer={setSelectedOffer}
                  onToggleSave={handleToggleSaveOffer}
                />

                {/* 3. FREE CRYPTO */}
                <CategoryOfferRow
                  id="row-free-crypto"
                  title="Free Crypto"
                  subtitle="Free Bitcoin bonuses, exchange sign-ups, crypto debit cards & airdrops"
                  icon={<Coins size={20} className="stroke-[2.2] text-emerald-400" />}
                  offers={cryptoOffers}
                  savedOfferIds={savedOfferIds}
                  isOpen={openRowIds.has('row-free-crypto')}
                  onToggleOpen={() => handleToggleRow('row-free-crypto')}
                  onSelectOffer={setSelectedOffer}
                  onToggleSave={handleToggleSaveOffer}
                />

                {/* 4. FEATURED OFFERS */}
                <CategoryOfferRow
                  id="row-featured"
                  title="Featured"
                  subtitle="Top verified rewards with instant claim access"
                  icon={<Sparkles size={20} className="stroke-[2.2] text-emerald-400" />}
                  offers={featuredOffers}
                  savedOfferIds={savedOfferIds}
                  isOpen={openRowIds.has('row-featured')}
                  onToggleOpen={() => handleToggleRow('row-featured')}
                  onSelectOffer={setSelectedOffer}
                  onToggleSave={handleToggleSaveOffer}
                />

                {/* 5. FAST OFFERS */}
                <CategoryOfferRow
                  id="row-fast-offers"
                  title="Fast Offers"
                  subtitle="$100 - $150 sequential easy cash & instant tasks"
                  icon={<Zap size={20} className="stroke-[2.2] text-emerald-400" />}
                  offers={fastOffers}
                  savedOfferIds={savedOfferIds}
                  isOpen={openRowIds.has('row-fast-offers')}
                  onToggleOpen={() => handleToggleRow('row-fast-offers')}
                  onSelectOffer={setSelectedOffer}
                  onToggleSave={handleToggleSaveOffer}
                />

                {/* 6. FINANCE */}
                <CategoryOfferRow
                  id="row-finance"
                  title="Finance"
                  subtitle="Banking, high-yield accounts, and high-value credit booster rewards"
                  icon={<Landmark size={20} className="stroke-[2.2] text-emerald-400" />}
                  offers={financeOffers}
                  savedOfferIds={savedOfferIds}
                  isOpen={openRowIds.has('row-finance')}
                  onToggleOpen={() => handleToggleRow('row-finance')}
                  onSelectOffer={setSelectedOffer}
                  onToggleSave={handleToggleSaveOffer}
                />
              </div>

              {/* Footer Disclaimer */}
              <footer className="mt-12 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500 space-y-2">
                <p>
                  © {new Date().getFullYear()} OHKNEE.COM. All partner bonuses and promo codes verified.
                </p>
                <p className="text-[11px] text-slate-600 max-w-xl mx-auto">
                  Please participate responsibly. Offers subject to individual terms and regional availability.
                </p>
              </footer>
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
          title="Staff Portal"
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

      {/* 13. DEDICATED MOBILE BOTTOM NAVIGATION (Top 10 & Earn) */}
      <MobileBottomNav
        currentTab={mobileTab}
        onSelectTab={handleSelectMobileTab}
        savedCount={savedOfferIds.size}
        isDarkTheme={true}
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

      {/* 15. STAFF AUTH MODAL */}
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

      {/* 18. COMEDIC SCAMMER MEME MODAL */}
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
