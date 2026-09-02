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
      setSearchQuery('');
    } else if (tab === 'top-10') {
      setSelectedCategory('top-10' as any);
      setOpenRowIds((prev) => new Set([...prev, 'row-top10']));
      setTimeout(() => {
        const el = document.getElementById('row-top10') || document.getElementById('offers-explorer-section');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } else if (tab === 'earn') {
      setSelectedCategory('all');
      setMobileTab('earn');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Transition from Cash App cartoon to Top 10 section
  const handleFinishCashAppAnimation = () => {
    setIsScammerMemeOpen(false);
    setSelectedCategory('top-10' as any);
    setMobileTab('top-10');
    setOpenRowIds((prev) => new Set([...prev, 'row-top10']));
    setTimeout(() => {
      const el = document.getElementById('row-top10') || document.getElementById('offers-explorer-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const isHomepage = selectedCategory === 'all' && searchQuery.trim() === '' && mobileTab === 'home';

  const handleSelectCategory = (catId: string) => {
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
          : 'min-h-screen bg-transparent text-slate-900 flex flex-col selection:bg-purple-200 selection:text-purple-950'
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
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full transition-all overflow-hidden">
        {/* HOMEPAGE VIEW vs DEDICATED TOP 10 VIEW vs OFFER MARKETPLACE */}
        {(mobileTab === 'top-10' || selectedCategory === 'top-10') ? (
          <div className="flex-1 flex flex-col justify-center items-center overflow-hidden px-2 sm:px-4 pb-16 lg:pb-8">
            <Top10MobileView
              offers={top10Offers}
              onSelectOffer={setSelectedOffer}
              onToggleSave={handleToggleSaveOffer}
              savedOfferIds={savedOfferIds}
            />
          </div>
        ) : isHomepage ? (
          <div className="flex-1 flex flex-col justify-center items-center overflow-y-auto px-4 pb-16 lg:pb-8">
            <HomepageHero onExploreClick={() => handleSelectMobileTab('top-10')} />
            {/* Desktop Trusted Community text section (no image, no yellow star, no chat room) */}
            <div className="hidden md:block w-full">
              <TrustReviewsSection />
            </div>
          </div>
        ) : (
          /* OFFERS EXPLORER SECTION */
          <main
            id="offers-explorer-section"
            className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-28 md:pb-16 overflow-y-auto"
          >
            {/* 4 Categorized Tabs at Top of Earn (as requested) */}
            <CategoryNavStrip
              activeCategory={selectedCategory}
              onSelectCategory={(tab) => {
                setSelectedCategory(tab.id as CategoryFilter);
                setOpenRowIds((prev) => new Set(prev).add(tab.rowId));
                setTimeout(() => {
                  const el = document.getElementById(tab.rowId);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
              }}
            />

            <div className="space-y-3 sm:space-y-4">
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
      )}
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

      {/* 13. DEDICATED MOBILE BOTTOM NAVIGATION */}
      <MobileBottomNav
        currentTab={mobileTab}
        onSelectTab={handleSelectMobileTab}
        savedCount={savedOfferIds.size}
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
    </div>
  );
}
