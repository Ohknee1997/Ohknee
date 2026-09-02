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
import { EarnGemslootView } from './components/EarnGemslootView';
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
        }, 2600);
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
            /* OFFERS EXPLORER SECTION (EARN) - EXACT GEMS LOOT LAYOUT WITH LIGHT BLUE & GREENS + CLEAN VERY LIGHT GRAY BACKGROUND */
            <main
              id="offers-explorer-section"
              className="flex-1 w-full min-h-screen bg-[#f0f2f6] pb-28 md:pb-20 overflow-y-auto"
            >
              <EarnGemslootView
                allOffers={allOffers}
                savedOfferIds={savedOfferIds}
                onSelectOffer={setSelectedOffer}
                onToggleSave={handleToggleSaveOffer}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />

              {/* Clean Footer Disclaimer */}
              <footer className="mt-8 pb-10 text-center text-xs text-slate-500 space-y-1.5 px-4">
                <p className="font-semibold">
                  © {new Date().getFullYear()} OHKNEE.COM • Verified Rewards & Bonus Drops
                </p>
                <p className="text-[11px] text-slate-400 max-w-xl mx-auto">
                  Please participate responsibly. Offers subject to partner terms and regional availability.
                </p>
              </footer>
            </main>
          )}
        </PageTransitionWrapper>
      </div>

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
