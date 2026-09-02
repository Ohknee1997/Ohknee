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
  SearchAndFilters,
  PlatformFilter,
  CategoryFilter,
  SortOption,
} from './components/SearchAndFilters';
import { MyOffersRow } from './components/MyOffersRow';
import { CategoryOfferRow } from './components/CategoryOfferRow';
import { CategoryNavStrip, CategoryTabItem } from './components/CategoryNavStrip';
import { CompactOfferCard } from './components/CompactOfferCard';
import { OfferDetailModal } from './components/OfferDetailModal';
import { LiveChatPanel } from './components/LiveChatPanel';
import { MobileBottomNav, MobileTab } from './components/MobileBottomNav';
import { OwnerAnalyticsModal } from './components/OwnerAnalyticsModal';
import { StaffAuthModal } from './components/StaffAuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { HomepageHero } from './components/HomepageHero';
import { TrustReviewsSection } from './components/TrustReviewsSection';
import { ScammerMemeModal } from './components/ScammerMemeModal';
import { HowItWorksModal } from './components/HowItWorksModal';

// Icons
import {
  Flame,
  Zap,
  Coins,
  Gift,
  Gamepad2,
  Sparkles,
  Layers,
  Star,
  ExternalLink,
  Maximize2,
  Minimize2,
  BarChart2,
  Lock,
  User,
  ArrowLeft,
} from 'lucide-react';

const STORE_SAVED_OFFERS = 'ohknee_saved_offers_v2';

const ALL_CATEGORY_ROW_IDS = [
  'row-featured',
  'row-fast-offers',
  'row-finance',
  'row-signup',
  'row-puzzles',
  'row-sweepstakes',
  'row-play-to-earn',
  'row-other',
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

  // Category rows open/closed state (starts empty -> EVERYTHING starts closed and not expanded)
  const [openRowIds, setOpenRowIds] = useState<Set<string>>(new Set());

  // Navigation, Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformFilter>('all');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [selectedSort, setSelectedSort] = useState<SortOption>('recommended');

  // Active detail modal
  const [selectedOffer, setSelectedOffer] = useState<EnrichedOffer | null>(null);

  // Live Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatDocked, setIsChatDocked] = useState(false);

  // Other system modals
  const [isOwnerAnalyticsOpen, setIsOwnerAnalyticsOpen] = useState(false);
  const [isStaffAuthOpen, setIsStaffAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScammerMemeOpen, setIsScammerMemeOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
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

  // Mobile navigation active tab
  const [mobileTab, setMobileTab] = useState<MobileTab>('home');

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
    if (selectedCategory !== 'all') {
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

  const featuredOffers = useMemo(() => {
    return filteredOffers.filter((o) => o.isFeatured || o.categories.includes('featured'));
  }, [filteredOffers]);

  const fastOffers = useMemo(() => {
    return filteredOffers
      .filter((o) => o.categories.includes('fast-easy'))
      .sort((a, b) => (a.orderNumber || 99) - (b.orderNumber || 99));
  }, [filteredOffers]);

  const financeOffers = useMemo(() => {
    return filteredOffers.filter((o) => o.categories.includes('finance'));
  }, [filteredOffers]);

  const signupOffers = useMemo(() => {
    return filteredOffers.filter((o) => o.categories.includes('signup-trial'));
  }, [filteredOffers]);

  const puzzleOffers = useMemo(() => {
    return filteredOffers.filter((o) => o.categories.includes('puzzles'));
  }, [filteredOffers]);

  const sweepstakesOffers = useMemo(() => {
    return filteredOffers.filter((o) => o.categories.includes('sweepstakes'));
  }, [filteredOffers]);

  const playToEarnOffers = useMemo(() => {
    return filteredOffers.filter((o) => o.categories.includes('play-to-earn'));
  }, [filteredOffers]);

  // Remaining / other offers
  const remainingOffers = useMemo(() => {
    const knownIds = new Set([
      ...fastOffers.map((o) => o.id),
      ...financeOffers.map((o) => o.id),
      ...signupOffers.map((o) => o.id),
      ...puzzleOffers.map((o) => o.id),
      ...sweepstakesOffers.map((o) => o.id),
      ...playToEarnOffers.map((o) => o.id),
    ]);
    return filteredOffers.filter((o) => !knownIds.has(o.id));
  }, [
    filteredOffers,
    fastOffers,
    financeOffers,
    signupOffers,
    puzzleOffers,
    sweepstakesOffers,
    playToEarnOffers,
  ]);

  // Reset all active filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedPlatform('all');
    setSelectedCategory('all');
    setSelectedSort('recommended');
  };

  // Jump from mobile navigation
  const handleSelectMobileTab = (tab: MobileTab) => {
    setMobileTab(tab);
    if (tab === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setSelectedCategory('all');
    } else if (tab === 'fast-cash') {
      setOpenRowIds((prev) => new Set([...prev, 'row-fast-offers']));
      setTimeout(() => {
        const el = document.getElementById('row-fast-offers');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else setSelectedCategory('fast-easy');
      }, 50);
    } else if (tab === 'sweepstakes') {
      setOpenRowIds((prev) => new Set([...prev, 'row-sweepstakes']));
      setTimeout(() => {
        const el = document.getElementById('row-sweepstakes');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else setSelectedCategory('sweepstakes');
      }, 50);
    } else if (tab === 'saved') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setSelectedCategory('all');
    }
  };

  const isFilteringActive =
    searchQuery.trim() !== '' ||
    selectedPlatform !== 'all' ||
    selectedCategory !== 'all' ||
    selectedSort !== 'recommended';

  const handleSelectNavTab = (tab: CategoryTabItem) => {
    setSelectedCategory(tab.id as CategoryFilter);
    setOpenRowIds((prev) => {
      const next = new Set(prev);
      next.add(tab.rowId);
      return next;
    });
    setTimeout(() => {
      const el = document.getElementById(tab.rowId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  const isHomepage = selectedCategory === 'all' && searchQuery.trim() === '';

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId as CategoryFilter);
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
      };
      const rowId = rowMap[catId];
      if (rowId) {
        setOpenRowIds((prev) => new Set(prev).add(rowId));
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#080c15] text-slate-100 flex flex-col selection:bg-teal-400 selection:text-slate-950">
      {/* 1. CLEAN TOP APPLICATION BRANDING & TABS (OHKNEE.COM) */}
      <Navbar
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        isHomepage={isHomepage}
        onOpenScammerMeme={() => setIsScammerMemeOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full transition-all">
        {/* HOMEPAGE VIEW: Hero + Reviews/Trust */}
        {isHomepage ? (
          <>
            {/* 2. LARGE CENTERED HERO SECTION WITH VISUAL & CATCHY REWARD MESSAGE */}
            <HomepageHero
              onExploreClick={() => {
                const el = document.getElementById('offers-explorer-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              onHowItWorksClick={() => setIsHowItWorksOpen(true)}
            />

            {/* 3. REVIEWS / TRUST SECTION */}
            <TrustReviewsSection />
          </>
        ) : (
          /* CATEGORY PAGE HEADER (Scammer Tab & Hero are completely absent!) */
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2 select-none">
            <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-[#0a101d] border border-slate-800 shadow-md">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white hover:border-teal-400 transition-colors cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>← Back to Homepage</span>
                </button>
                <div className="h-5 w-px bg-slate-800" />
                <h2 className="text-base sm:text-lg font-black text-white">
                  {selectedCategory === 'fast-easy'
                    ? 'Fast Cash ($100 - $150 Easy Money)'
                    : selectedCategory === 'finance'
                    ? 'Finance & Crypto Bonuses'
                    : selectedCategory === 'signup-trial'
                    ? 'Sign Up Trials & Instant Cashback'
                    : selectedCategory === 'sweepstakes'
                    ? 'Sweepstakes Casinos (Free SC Daily)'
                    : selectedCategory === 'puzzles'
                    ? 'Puzzles, Bingo & Spin Wheels'
                    : selectedCategory === 'play-to-earn'
                    ? 'Play to Earn Games'
                    : selectedCategory === 'featured'
                    ? 'Featured Offers'
                    : 'Verified Reward Offers'}
                </h2>
              </div>
              <span className="hidden sm:inline-flex text-xs font-semibold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-3 py-1 rounded-lg">
                Verified Category
              </span>
            </div>
          </div>
        )}

        {/* OFFERS EXPLORER SECTION */}
        <main
          id="offers-explorer-section"
          className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-16"
        >
          {/* Section Heading & Expand Controls */}
          <div className="flex items-center justify-between gap-3 px-1 py-3 mb-3 border-b border-slate-800/80">
            <div>
              <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-200">
                {isHomepage ? 'ALL VERIFIED REWARDS & OFFERS' : 'CATEGORY OFFERS'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {isHomepage
                  ? 'Browse all curated opportunities below, or filter by platform'
                  : 'Complete offers in this category to claim verified rewards'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExpandAllRows}
                className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-teal-300 transition-colors cursor-pointer py-1.5 px-3 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800"
                title="Open all category rows"
              >
                <Maximize2 size={12} />
                <span>Expand All</span>
              </button>
              <span className="text-slate-700">•</span>
              <button
                type="button"
                onClick={handleCollapseAllRows}
                className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-teal-300 transition-colors cursor-pointer py-1.5 px-3 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800"
                title="Close all category rows"
              >
                <Minimize2 size={12} />
                <span>Collapse All</span>
              </button>
            </div>
          </div>

          {/* Search, Platform & Sorting Controls */}
          <div className="mb-4">
            <SearchAndFilters
              searchQuery={searchQuery}
              selectedPlatform={selectedPlatform}
              selectedCategory={selectedCategory}
              selectedSort={selectedSort}
              totalOfferCount={allOffers.length}
              matchingOfferCount={filteredOffers.length}
              onSearchChange={setSearchQuery}
              onPlatformChange={setSelectedPlatform}
              onCategoryChange={setSelectedCategory}
              onSortChange={setSelectedSort}
              onClearFilters={() => {
                setSearchQuery('');
                setSelectedPlatform('all');
                setSelectedCategory('all');
                setSelectedSort('recommended');
              }}
            />
          </div>

          <div className="space-y-3">
            {/* Top Category Navigation Strip */}
            <CategoryNavStrip
              activeCategory={selectedCategory}
              onSelectCategory={handleSelectNavTab}
            />

            {/* Saved Offers Row (when user has saved offers) */}
            {savedOffersList.length > 0 && (
              <MyOffersRow
                savedOffers={savedOffersList}
                allOffers={allOffers}
                onSelectOffer={setSelectedOffer}
                onToggleSave={handleToggleSaveOffer}
              />
            )}

            {/* 4. FEATURED OFFERS */}
            <CategoryOfferRow
              id="row-featured"
              title="Featured Offers"
              subtitle="Top verified rewards with instant claim access"
              icon={<Flame size={24} className="stroke-[2.2]" />}
              offers={featuredOffers}
              savedOfferIds={savedOfferIds}
              isOpen={openRowIds.has('row-featured')}
              onToggleOpen={() => handleToggleRow('row-featured')}
              onSelectOffer={setSelectedOffer}
              onToggleSave={handleToggleSaveOffer}
              initialOpen={false}
              initialExpanded={false}
            />

            {/* 5. FAST OFFERS (100$-150$ Fast & Easy sequential order) */}
            <CategoryOfferRow
              id="row-fast-offers"
              title="Fast Offers (100$ - 150$ Easy Money)"
              subtitle="Execute in strict chronological order #1 to #6 for guaranteed cashouts"
              icon={<Zap size={24} className="stroke-[2.2]" />}
              offers={fastOffers}
              savedOfferIds={savedOfferIds}
              isOpen={openRowIds.has('row-fast-offers')}
              onToggleOpen={() => handleToggleRow('row-fast-offers')}
              onSelectOffer={setSelectedOffer}
              onToggleSave={handleToggleSaveOffer}
              initialOpen={false}
              initialExpanded={false}
            />

            {/* 6. FINANCE & CRYPTO */}
            <CategoryOfferRow
              id="row-finance"
              title="Finance & Crypto Bonuses"
              subtitle="Banking, crypto exchanges, and high-value signup bonuses"
              icon={<Coins size={24} className="stroke-[2.2]" />}
              offers={financeOffers}
              savedOfferIds={savedOfferIds}
              isOpen={openRowIds.has('row-finance')}
              onToggleOpen={() => handleToggleRow('row-finance')}
              onSelectOffer={setSelectedOffer}
              onToggleSave={handleToggleSaveOffer}
              initialOpen={false}
              initialExpanded={false}
            />

            {/* 7. SIGN UP TRIAL */}
            <CategoryOfferRow
              id="row-signup"
              title="Sign Up Trial & Instant Cashback"
              subtitle="Zero-risk free trials and receipt cashback rewards"
              icon={<Gift size={24} className="stroke-[2.2]" />}
              offers={signupOffers}
              savedOfferIds={savedOfferIds}
              isOpen={openRowIds.has('row-signup')}
              onToggleOpen={() => handleToggleRow('row-signup')}
              onSelectOffer={setSelectedOffer}
              onToggleSave={handleToggleSaveOffer}
              initialOpen={false}
              initialExpanded={false}
            />

            {/* 8. PUZZLES & CASUAL SLOTS */}
            <CategoryOfferRow
              id="row-puzzles"
              title="Puzzles, Bingo & Spin Wheels"
              subtitle="Free daily sweep coin spins and casual cashout puzzles"
              icon={<Gamepad2 size={24} className="stroke-[2.2]" />}
              offers={puzzleOffers}
              savedOfferIds={savedOfferIds}
              isOpen={openRowIds.has('row-puzzles')}
              onToggleOpen={() => handleToggleRow('row-puzzles')}
              onSelectOffer={setSelectedOffer}
              onToggleSave={handleToggleSaveOffer}
              initialOpen={false}
              initialExpanded={false}
            />

            {/* 9. SWEEPSTAKES CASINOS */}
            <CategoryOfferRow
              id="row-sweepstakes"
              title="Sweepstakes Casinos (Free SC Daily)"
              subtitle="Verified sweepstakes casinos with instant crypto or bank redemptions"
              icon={<Coins size={24} className="stroke-[2.2]" />}
              offers={sweepstakesOffers}
              savedOfferIds={savedOfferIds}
              isOpen={openRowIds.has('row-sweepstakes')}
              onToggleOpen={() => handleToggleRow('row-sweepstakes')}
              onSelectOffer={setSelectedOffer}
              onToggleSave={handleToggleSaveOffer}
              initialOpen={false}
              initialExpanded={false}
            />

            {/* 10. PLAY TO EARN */}
            <CategoryOfferRow
              id="row-play-to-earn"
              title="Play to Earn & Reward Portals"
              subtitle="Earn gift cards, crypto, and direct PayPal for games and surveys"
              icon={<Sparkles size={24} className="stroke-[2.2]" />}
              offers={playToEarnOffers}
              savedOfferIds={savedOfferIds}
              isOpen={openRowIds.has('row-play-to-earn')}
              onToggleOpen={() => handleToggleRow('row-play-to-earn')}
              onSelectOffer={setSelectedOffer}
              onToggleSave={handleToggleSaveOffer}
              initialOpen={false}
              initialExpanded={false}
            />

              {/* 11. OTHER CATEGORIES / DISCOVERY */}
              {remainingOffers.length > 0 && (
                <CategoryOfferRow
                  id="row-other"
                  title="More Verified Offers"
                  subtitle="Additional partner bonuses and referral rewards"
                  icon={<Layers size={24} className="stroke-[2.2]" />}
                  offers={remainingOffers}
                  savedOfferIds={savedOfferIds}
                  isOpen={openRowIds.has('row-other')}
                  onToggleOpen={() => handleToggleRow('row-other')}
                  onSelectOffer={setSelectedOffer}
                  onToggleSave={handleToggleSaveOffer}
                  initialOpen={false}
                  initialExpanded={false}
                />
              )}
            </div>

          {/* Footer Disclaimer */}
          <footer className="mt-14 pt-8 border-t border-slate-800/80 text-center text-xs text-slate-500 space-y-2">
            <p>
              © {new Date().getFullYear()} OHKNEE.COM. All partner bonuses and promo codes verified.
            </p>
            <p className="text-[11px] text-slate-600 max-w-xl mx-auto">
              Please gamble and participate responsibly. Offers subject to individual terms and regional availability.
              21+ where applicable.
            </p>
          </footer>
        </main>
      </div>

      {/* Subtle Bottom-Right Owner & Staff Controls */}
      <aside
        id="bottom-right-admin-pod"
        aria-label="Admin Controls"
        className="fixed bottom-4 right-4 z-40 flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#090e1a]/85 border border-slate-800/80 backdrop-blur-md shadow-xl"
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

      {/* 12. LIVE CHAT (Desktop right panel / docked OR mobile floating & bottom-sheet) */}
      <LiveChatPanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        isDocked={isChatDocked}
        onToggleDock={() => setIsChatDocked((d) => !d)}
      />

      {/* Mobile Floating Chat Trigger (when chat is closed) */}
      {!isChatOpen && (
        <button
          type="button"
          id="mobile-chat-fab"
          onClick={() => setIsChatOpen(true)}
          className="md:hidden fixed bottom-18 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 shadow-xl shadow-amber-500/20 active:scale-95 cursor-pointer"
          aria-label="Open Live Chat"
        >
          <span className="relative">
            <Sparkles size={20} />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#080c15]" />
          </span>
        </button>
      )}

      {/* 13. DEDICATED MOBILE BOTTOM NAVIGATION */}
      <MobileBottomNav
        currentTab={mobileTab}
        onSelectTab={handleSelectMobileTab}
        savedCount={savedOfferIds.size}
        isChatOpen={isChatOpen}
        onToggleChat={() => setIsChatOpen((o) => !o)}
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
    </div>
  );
}
