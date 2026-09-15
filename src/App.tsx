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
  getAppDeduplicationKey,
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
import { SkillIssueSnakeGame } from './components/SkillIssueSnakeGame';
import { SocialsPhoneView } from './components/SocialsPhoneView';
import { GuestbookNotebookView } from './components/GuestbookNotebookView';

// Original Icons - Replacing generic clichés
import {
  Dice5,
  Swords,
  Boxes,
  Rocket,
  Vault,
  Lock,
  User,
  Star,
  BarChart2,
  Layers,
} from 'lucide-react';

const STORE_SAVED_OFFERS = 'ohknee_saved_offers_v2';

const ALL_CATEGORY_ROW_IDS = [
  'row-online-casinos',
  'row-sports-betting',
  'row-free-crypto',
  'row-fast-offers',
  'row-finance',
];

export default function App() {
  // Master offer collection with data enrichment
  const [allOffers, setAllOffers] = useState<EnrichedOffer[]>(() => {
    const savedCustomCards = getFromStorage<CardData[] | null>(STORE_CARDS, null);
    const initialOffers = getAllEnrichedOffers();
    const removedCardIds = new Set([
      'instant-cash-0', // MetaWin
      'free-crypto-2', // BYDFi
      'free-crypto-6', // Gemini Crypto
      'free-crypto-7', // Webull Crypto
      'cash-back-2', // Snaplii
      'cash-back-3', // Snaplii Deposit
      'cash-back-4', // Franki
      'sports-1', // Underdog
      'sports-4', // Fliff Sportsbook
      'sports-5', // Sleeper Fantasy
      'finance-ava', // Ava
      'finance-moneylion', // MoneyLion
    ]);
    const removedNames = new Set([
      'metawin', 'bydfi', 'gemini crypto', 'gemini', 'webull crypto', 'webull',
      'snaplii', 'snaplii deposit', 'franki', 'underdog', 'fliff', 'fliff sportsbook',
      'sleeper', 'sleeper fantasy', 'ava', 'moneylion'
    ]);

    if (savedCustomCards && Array.isArray(savedCustomCards) && savedCustomCards.length > 0) {
      const initialMap = new Map(initialOffers.map((o) => [o.id, o]));
      const nameMap = new Map(initialOffers.map((o) => [o.name.toLowerCase().trim(), o]));

      // Purge any stale generic cards that have no referral links
      const filteredCustomCards = savedCustomCards.filter((c) => {
        if (removedCardIds.has(c.id)) return false;
        const normName = (c.name || '').toLowerCase().trim();
        if (removedNames.has(normName) && !nameMap.has(normName)) return false;
        return true;
      });

      const existingIds = new Set(filteredCustomCards.map((c) => c.id));
      const missingOffers = initialOffers.filter((o) => !existingIds.has(o.id));

      const merged = filteredCustomCards.map((c) => {
        const canonical = initialMap.get(c.id) || nameMap.get((c.name || '').toLowerCase().trim());
        if (canonical) {
          const updated: CardData = {
            ...c,
            name: canonical.name,
            payout: canonical.payout,
            instructionSub: canonical.instructionSub,
            code: canonical.code,
            // CRITICAL: Always use canonical referral URL to prevent generic link leakage
            signupUrl: canonical.signupUrl,
            orderNumber: canonical.orderNumber !== undefined ? canonical.orderNumber : c.orderNumber,
          };
          if (!canonical.code) {
            delete updated.code;
          }
          if (c.id === 'fast-polymarket' || c.id === 'ref-polymarket' || c.name.toLowerCase().includes('polymarket')) {
            delete updated.code;
          }
          return enrichCard(updated);
        }
        return enrichCard(c);
      });

      const finalOffers = [...merged, ...missingOffers];
      saveToStorage(STORE_CARDS, finalOffers);
      return finalOffers;
    }
    saveToStorage(STORE_CARDS, initialOffers);
    return initialOffers;
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
    // Strictly lock top offers in requested exact order:
    // #1 Stake, #2 Freecash, #3 Gemsloot, #4 Polymarket, #5 DraftKings
    // #6 Kalshi, #7 Coinbase
    // After Coinbase: Crown Coins, Lonestar, Modo, MyPrize, Zula, CoinsBack (ShopBack)
    const isStake = (o: EnrichedOffer) =>
      o.id === 'fast-stake' || (o.name.toLowerCase().includes('stake') && !o.name.toLowerCase().includes('pulsz'));
    const isFreecash = (o: EnrichedOffer) =>
      o.id === 'fast-freecash' || o.name.toLowerCase().includes('freecash');
    const isGemsloot = (o: EnrichedOffer) =>
      o.id === 'fast-gemsloot' || o.name.toLowerCase().includes('gemsloot') || o.name.toLowerCase().includes('gems loot');
    const isPolymarket = (o: EnrichedOffer) =>
      o.id === 'fast-polymarket' || o.name.toLowerCase().includes('polymarket');
    const isDraftKings = (o: EnrichedOffer) =>
      o.id === 'fast-draftkings' || o.name.toLowerCase().includes('draftkings');
    const isEro = (o: EnrichedOffer) =>
      o.id === 'fast-ero' || o.id === 'ref-ero' || o.name.toLowerCase() === 'ero' || o.name.toLowerCase().includes('ero') || (o.domain || '').includes('ero.app');
    const isTilt = (o: EnrichedOffer) =>
      o.id === 'fast-tilt' || o.id === 'ref-tilt' || o.name.toLowerCase() === 'tilt' || o.name.toLowerCase().includes('tilt');
    const isReBet = (o: EnrichedOffer) =>
      o.id === 'fast-rebet' || o.id === 'ref-rebet' || o.name.toLowerCase().includes('rebet');
    const isOnyx = (o: EnrichedOffer) =>
      o.id === 'fast-onyx' || o.id === 'ref-onyx' || o.name.toLowerCase().includes('onyx');
    const isRips = (o: EnrichedOffer) =>
      o.id === 'fast-rips' || o.id === 'ref-rips' || (o.name.toLowerCase().includes('rip') && !o.name.toLowerCase().includes('rush') && !o.id.includes('riprush'));
    const isRipRush = (o: EnrichedOffer) =>
      o.id === 'fast-riprush' || o.id === 'ref-riprush' || o.name.toLowerCase().includes('rip rush') || o.name.toLowerCase().includes('riprush');
    const isKalshi = (o: EnrichedOffer) =>
      o.id === 'fast-kalshi' || o.name.toLowerCase().includes('kalshi');
    const isCoinbase = (o: EnrichedOffer) =>
      o.id === 'fast-coinbase' || o.name.toLowerCase().includes('coinbase');
    const isCrownCoins = (o: EnrichedOffer) =>
      o.id === '4' || o.name.toLowerCase().includes('crown coin');
    const isLonestar = (o: EnrichedOffer) =>
      o.id === '10' || o.name.toLowerCase().includes('lonestar') || o.name.toLowerCase().includes('lone star');
    const isModo = (o: EnrichedOffer) =>
      o.id === '13' || o.name.toLowerCase().includes('modo');
    const isMyPrize = (o: EnrichedOffer) =>
      o.id === '15' || o.name.toLowerCase().includes('myprize') || o.name.toLowerCase().includes('my prize');
    const isRealPrize = (o: EnrichedOffer) =>
      o.id === '19' || o.name.toLowerCase().includes('real prize') || o.name.toLowerCase().includes('realprize');

    // 1-18 exact order as requested by user:
    // 1: Stake, 2: Polymarket, 3: Coinbase, 4: Tilt, 5: Ero, 6: Rips, followed by other verified partners
    const orderedFinders = [
      isStake,        // 1: Stake.us
      isPolymarket,   // 2: Polymarket
      isCoinbase,     // 3: Coinbase (moved to #3)
      isTilt,         // 4: Tilt (moved to #4)
      isEro,          // 5: Ero (moved to #5)
      isRips,         // 6: Rips (moved to #6)
      isKalshi,       // 7: Kalshi
      isFreecash,     // 8: Freecash
      isGemsloot,     // 9: Gems Loot
      isDraftKings,   // 10: DraftKings
      isReBet,        // 11: ReBet
      isOnyx,         // 12: Onyx Odds
      isRipRush,      // 13: Rip Rush
      isCrownCoins,   // 14: Crown Coins
      isLonestar,     // 15: Lone Star
      isModo,         // 16: Modo
      isMyPrize,      // 17: MyPrize
      isRealPrize,    // 18: Real Prize
    ];

    const orderedOffers: EnrichedOffer[] = [];
    const usedIds = new Set<string>();

    for (const finder of orderedFinders) {
      const match = allOffers.find((o) => !usedIds.has(o.id) && finder(o));
      if (match) {
        orderedOffers.push(match);
        usedIds.add(match.id);
      }
    }

    const restList = allOffers.filter((o) => !usedIds.has(o.id));

    const isCasino = (o: EnrichedOffer) => {
      if (o.tabId === 'casino-codes') return true;
      const n = o.name.toLowerCase();
      const d = (o.domain || '').toLowerCase();
      const c = (o.categories || []).map((x) => x.toLowerCase());
      if (c.includes('sweepstakes') || c.includes('bonuses-promos')) return true;
      if (
        n.includes('casino') ||
        n.includes('slots') ||
        n.includes('sweeps') ||
        d.includes('casino') ||
        d.includes('slots')
      ) {
        return true;
      }
      return false;
    };

    const nonCasinoPriorityFinders = [
      (o: EnrichedOffer) => o.id === 'fast-onepay' || o.name.toLowerCase().includes('onepay') || o.name.toLowerCase().includes('one pay'),
      (o: EnrichedOffer) => o.id === 'banking-chime' || o.name.toLowerCase().includes('chime'),
      (o: EnrichedOffer) => o.id === 'cash-back-1' || o.name.toLowerCase().includes('coins back') || o.name.toLowerCase().includes('coinsback') || o.name.toLowerCase().includes('shopback'),
      (o: EnrichedOffer) => o.id === 'banking-1' || o.name.toLowerCase().includes('sofi'),
      (o: EnrichedOffer) => o.id === 'banking-2' || o.name.toLowerCase().includes('aven'),
      (o: EnrichedOffer) => o.id === 'banking-3' || o.name.toLowerCase().includes('sendwave'),
      (o: EnrichedOffer) => o.id === 'banking-4' || o.name.toLowerCase().includes('self'),
      (o: EnrichedOffer) => o.id === 'cash-back-vinted' || o.name.toLowerCase().includes('vinted'),
      (o: EnrichedOffer) => o.id === 'fast-goodwall' || o.name.toLowerCase().includes('goodwall'),
      (o: EnrichedOffer) => o.id === 'free-crypto-xplace' || o.name.toLowerCase().includes('x.place'),
      (o: EnrichedOffer) => o.id === 'finance-robinhood' || o.name.toLowerCase().includes('robinhood'),
      (o: EnrichedOffer) => o.id === 'finance-webull' || o.name.toLowerCase().includes('webull'),
      (o: EnrichedOffer) => o.id === 'finance-moneylion' || o.name.toLowerCase().includes('moneylion'),
      (o: EnrichedOffer) => o.id === 'finance-ava' || o.name.toLowerCase().includes('meetava') || o.name.toLowerCase() === 'ava',
      (o: EnrichedOffer) => o.id === 'sports-dabble' || o.name.toLowerCase().includes('dabble'),
      (o: EnrichedOffer) => o.id === 'sports-underdog' || o.name.toLowerCase().includes('underdog'),
      (o: EnrichedOffer) => o.id === 'sports-prizepicks' || o.name.toLowerCase().includes('prizepicks'),
      (o: EnrichedOffer) => o.id === 'sports-sportzino' || o.name.toLowerCase().includes('sportzino'),
      (o: EnrichedOffer) => o.id === 'sports-fliff' || o.name.toLowerCase().includes('fliff'),
      (o: EnrichedOffer) => o.id === 'sports-sleeper' || o.name.toLowerCase().includes('sleeper'),
      (o: EnrichedOffer) => o.id === 'crypto-kraken' || o.name.toLowerCase().includes('kraken'),
      (o: EnrichedOffer) => o.id === 'crypto-gemini' || o.name.toLowerCase().includes('gemini'),
      (o: EnrichedOffer) => o.id === 'crypto-bydfi' || o.name.toLowerCase().includes('bydfi'),
      (o: EnrichedOffer) => o.id === 'crypto-koinly' || o.name.toLowerCase().includes('koinly'),
      (o: EnrichedOffer) => o.id === 'cash-back-fetch' || o.name.toLowerCase().includes('fetch'),
      (o: EnrichedOffer) => o.id === 'cash-back-debbie' || o.name.toLowerCase().includes('debbie'),
      (o: EnrichedOffer) => o.id === 'cash-back-joko' || o.name.toLowerCase().includes('joko'),
      (o: EnrichedOffer) => o.id === 'cash-back-snaplii' || o.name.toLowerCase().includes('snaplii'),
      (o: EnrichedOffer) => o.id === 'cash-back-franki' || o.name.toLowerCase().includes('franki'),
      (o: EnrichedOffer) => o.id === 'cash-back-myappfree' || o.name.toLowerCase().includes('myappfree'),
    ];

    const nonCasinoPriorityOffers: EnrichedOffer[] = [];
    for (const finder of nonCasinoPriorityFinders) {
      const match = restList.find((o) => !usedIds.has(o.id) && finder(o));
      if (match) {
        nonCasinoPriorityOffers.push(match);
        usedIds.add(match.id);
      }
    }

    const remainingUnassigned = restList.filter((o) => !usedIds.has(o.id));
    const remainingNonCasino: EnrichedOffer[] = [];
    const remainingCasinos: EnrichedOffer[] = [];

    for (const item of remainingUnassigned) {
      if (isCasino(item)) {
        remainingCasinos.push(item);
      } else {
        remainingNonCasino.push(item);
      }
    }

    // User requested: "only one app on my top 10 page if there is a repeating app remove it starting from the bottom up so that they stay in the correct order that they are in at the moment."
    const combined = [
      ...orderedOffers,
      ...nonCasinoPriorityOffers,
      ...remainingNonCasino,
      ...remainingCasinos,
    ];
    const deduplicatedTop: EnrichedOffer[] = [];
    const seenTopKeys = new Set<string>();

    for (const o of combined) {
      const appKey = getAppDeduplicationKey(o);
      if (!seenTopKeys.has(appKey)) {
        seenTopKeys.add(appKey);
        deduplicatedTop.push(o);
      }
    }

    return deduplicatedTop;
  }, [allOffers]);

  // User requested: "On the second page the earn tab I also do not want any repeating apps find a spot for it according to its name and description"
  const {
    onlineCasinoOffers,
    sportsBettingOffers,
    cryptoOffers,
    fastOffers,
    financeOffers,
  } = useMemo(() => {
    // 1. Gather all unique apps across filteredOffers using canonical app keys
    const seenAppKeys = new Set<string>();
    const uniqueList: EnrichedOffer[] = [];

    for (const o of filteredOffers) {
      const appKey = getAppDeduplicationKey(o);
      if (!seenAppKeys.has(appKey)) {
        seenAppKeys.add(appKey);
        uniqueList.push(o);
      }
    }

    // 2. Classify each unique app into its single best category spot according to its name and description
    function getCategoryForOffer(o: EnrichedOffer): 'casino' | 'sports' | 'crypto' | 'finance' | 'fast' {
      const k = getAppDeduplicationKey(o);
      const name = o.name.toLowerCase();
      const desc = `${o.instructionSub || ''} ${o.descriptionText || ''} ${o.payoutTag || ''} ${o.payout || ''}`.toLowerCase();
      const cats = o.categories.map((c) => c.toLowerCase());

      // Sports Betting & Prediction Markets
      if (
        ['sportzino', 'fliff', 'sleeper', 'dabble', 'underdog', 'prizepicks', 'draftkings', 'kalshi', 'polymarket', 'rebet', 'onyx'].includes(k) ||
        cats.includes('sports-betting') ||
        cats.includes('sports') ||
        cats.includes('betting') ||
        desc.includes('sportsbook') ||
        desc.includes('dfs') ||
        desc.includes('event contract') ||
        desc.includes('prediction market') ||
        name.includes('sportsbook')
      ) {
        return 'sports';
      }

      // Crypto Exchanges, Wallets & Web3
      if (
        ['coinbase', 'kraken', 'gemini', 'bydfi', 'koinly', 'metawin', 'xplace'].includes(k) ||
        cats.includes('crypto') ||
        name.includes('crypto') ||
        desc.includes('bitcoin') ||
        desc.includes('crypto exchange') ||
        desc.includes('crypto debit') ||
        desc.includes('airdrop')
      ) {
        return 'crypto';
      }

      // Finance, Banking, Credit & Stocks
      if (
        ['sofi', 'robinhood', 'onepay', 'aven', 'sendwave', 'moneylion', 'self', 'meetava', 'webull', 'chime'].includes(k) ||
        cats.includes('banking') ||
        cats.includes('finance') ||
        name.includes('bank') ||
        desc.includes('checking') ||
        desc.includes('savings') ||
        desc.includes('credit card') ||
        desc.includes('credit line') ||
        desc.includes('high-yield') ||
        desc.includes('stocks')
      ) {
        return 'finance';
      }

      // Fast Tasks, Cashback, Receipts & Instant Rewards
      if (
        ['freecash', 'gemsloot', 'tilt', 'coinsback', 'fetch', 'debbie', 'joko', 'snaplii', 'franki', 'myappfree', 'rips', 'riprush', 'vinted', 'goodwall'].includes(k) ||
        cats.includes('fast-easy') ||
        cats.includes('signup-trial') ||
        o.tabId === 'fast-easy-money' ||
        desc.includes('cashback') ||
        desc.includes('cash back') ||
        desc.includes('receipt') ||
        desc.includes('tasks') ||
        desc.includes('card pack')
      ) {
        return 'fast';
      }

      // Casino, Slots & Sweepstakes
      return 'casino';
    }

    const casino: EnrichedOffer[] = [];
    const sports: EnrichedOffer[] = [];
    const crypto: EnrichedOffer[] = [];
    const fast: EnrichedOffer[] = [];
    const finance: EnrichedOffer[] = [];

    for (const o of uniqueList) {
      const cat = getCategoryForOffer(o);
      if (cat === 'sports') sports.push(o);
      else if (cat === 'crypto') crypto.push(o);
      else if (cat === 'finance') finance.push(o);
      else if (cat === 'fast') fast.push(o);
      else casino.push(o);
    }

    return {
      onlineCasinoOffers: casino,
      sportsBettingOffers: sports,
      cryptoOffers: crypto,
      fastOffers: fast,
      financeOffers: finance,
    };
  }, [filteredOffers]);

  // Track previous tab before opening snake game so clicking snake icon again returns back smoothly
  const previousNonSnakeTabRef = useRef<MobileTab>('hero');

  // Jump from mobile navigation
  const handleSelectMobileTab = (tab: MobileTab) => {
    if (mobileTab !== 'blank' && mobileTab !== 'snake' && mobileTab !== 'guestbook') {
      previousNonSnakeTabRef.current = mobileTab;
    }

    const tabOrderMap: Record<MobileTab, number> = {
      hero: 0,
      earn: 1,      // Categories (left of middle)
      'top-10': 2,  // Start Here (middle)
      socials: 3,   // Socials (right of middle)
      tab: 4,       // Tab (right of middle)
      blank: 5,     // Snake game
      snake: 5,     // Snake game
      guestbook: 6, // Notebook paper guestbook (1-1000)
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

  // Prevent scrolling when on the first page (hero view) or socials view
  useEffect(() => {
    if (mobileTab === 'hero' || mobileTab === 'socials') {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [mobileTab]);

  return (
    <div
      className={`bg-black text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black ${
        mobileTab === 'hero' || mobileTab === 'socials'
          ? 'h-screen h-[100dvh] max-h-[100dvh] overflow-hidden overscroll-none'
          : 'min-h-screen'
      }`}
    >
      {/* 1. CLEAN TOP APPLICATION BRANDING (OHKNEE) */}
      <Navbar
        isSticky={mobileTab !== 'top-10'}
        onGoHome={() => {
          handleSelectMobileTab('hero');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAnalytics={() => setIsOwnerAnalyticsOpen(true)}
        onSelectSnake={() => {
          if (mobileTab === 'blank' || mobileTab === 'snake') {
            handleSelectMobileTab(previousNonSnakeTabRef.current || 'hero');
          } else {
            handleSelectMobileTab('blank');
          }
        }}
        isSnakeActive={mobileTab === 'blank' || mobileTab === 'snake'}
        onSelectGuestbook={() => {
          if (mobileTab === 'guestbook') {
            handleSelectMobileTab(previousNonSnakeTabRef.current || 'hero');
          } else {
            handleSelectMobileTab('guestbook');
          }
        }}
        isGuestbookActive={mobileTab === 'guestbook'}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col w-full ${
          mobileTab === 'hero' ? 'min-h-0 overflow-y-auto' : ''
        }`}
      >
        {mobileTab === 'top-10' ? (
          /* DEDICATED TOP 10 VIEW NUMBERED 1-10000 (Pure native sticky without any transform wrappers) */
          <div className="flex-1 w-full">
            <Top10MobileView
              offers={top10Offers}
              allOffers={allOffers}
              selectedOffer={selectedOffer}
              onCloseOffer={() => setSelectedOffer(null)}
              onSelectOffer={setSelectedOffer}
              onToggleSave={handleToggleSaveOffer}
              savedOfferIds={savedOfferIds}
            />
          </div>
        ) : (
          <PageTransitionWrapper
            currentTab={mobileTab}
            isInitialBreakaway={isInitialBreakaway}
            slideDirection={slideDirection}
          >
            {mobileTab === 'hero' ? (
              /* HERO PICTURE VIEW WITH DESCRIPTION (First opened & when clicking logo) - NO SCROLL */
              <div className="flex-1 w-full h-full overflow-hidden flex flex-col justify-center items-center pb-16 sm:pb-20">
                <HomepageHero
                  onExploreClick={() => handleSelectMobileTab('top-10')}
                  onEarnClick={() => handleSelectMobileTab('earn')}
                />
              </div>
            ) : mobileTab === 'guestbook' ? (
              /* NOTEBOOK PAPER GUESTBOOK (FIRST 1,000 VISITORS REGISTER) */
              <main
                id="guestbook-register-view"
                className="flex-1 w-full bg-black flex flex-col items-center justify-start py-2 sm:py-4 px-2"
              >
                <GuestbookNotebookView />
              </main>
            ) : mobileTab === 'socials' ? (
              /* SOCIALS VIEW: SIMPLE OPAQUE CARDS */
              <SocialsPhoneView />
            ) : mobileTab === 'tab' ? (
              /* PLACEHOLDER TAB VIEW */
              <main
                id="custom-tab-screen"
                className="flex-1 w-full min-h-[calc(100dvh-130px)] bg-black flex flex-col items-center justify-center p-6 text-center select-none animate-in fade-in duration-200"
              >
                <div className="p-8 rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-md max-w-sm w-full flex flex-col items-center justify-center gap-3 shadow-2xl">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
                    <Layers size={28} />
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-wide">Tab</h2>
                  <p className="text-xs text-slate-400">Reserved for upcoming features.</p>
                </div>
              </main>
            ) : mobileTab === 'blank' || mobileTab === 'snake' ? (
              /* RETRO NOKIA SNAKE GAME WITH NORMAL CONTROLS */
              <main
                id="skill-issue-game-view"
                className="flex-1 w-full min-h-[85vh] bg-black flex flex-col items-center justify-center p-3 select-none"
              >
                <SkillIssueSnakeGame />
              </main>
            ) : (
              /* OFFERS EXPLORER SECTION (EARN) - ALL 5 CATEGORIES FIT ON ONE PAGE */
              <main
                id="offers-explorer-section"
                className="w-full bg-black text-slate-100 max-w-5xl mx-auto px-3 sm:px-6 py-3 select-none flex flex-col justify-between min-h-[calc(100dvh-130px)] sm:min-h-[calc(100vh-140px)] pb-24 md:pb-16"
              >
                {/* THE 5 DEDICATED CATEGORY ROWS (SPACED OUT EVENLY TO AVOID BLANK BLACK SPACE) */}
                <div className="w-full flex-1 flex flex-col justify-evenly gap-3 sm:gap-4 md:gap-5 my-auto py-2 sm:py-3">
                  {/* 1. CASINO */}
                  <CategoryOfferRow
                    id="row-online-casinos"
                    title="Casino"
                    subtitle="Daily free SC coins, free spins, sweepstakes casinos & prize wheels"
                    icon={<Dice5 size={20} className="stroke-[2.2]" />}
                    themeRgb="245, 158, 11"
                    offers={onlineCasinoOffers}
                    savedOfferIds={savedOfferIds}
                    isOpen={openRowIds.has('row-online-casinos')}
                    onToggleOpen={() => handleToggleRow('row-online-casinos')}
                    onSelectOffer={setSelectedOffer}
                    onToggleSave={handleToggleSaveOffer}
                  />

                  {/* 2. SPORTS */}
                  <CategoryOfferRow
                    id="row-sports-betting"
                    title="Sports"
                    subtitle="Top sportsbooks, DFS picks, match deposits & risk-free prediction entries"
                    icon={<Swords size={20} className="stroke-[2.2]" />}
                    themeRgb="59, 130, 246"
                    offers={sportsBettingOffers}
                    savedOfferIds={savedOfferIds}
                    isOpen={openRowIds.has('row-sports-betting')}
                    onToggleOpen={() => handleToggleRow('row-sports-betting')}
                    onSelectOffer={setSelectedOffer}
                    onToggleSave={handleToggleSaveOffer}
                  />

                  {/* 3. CRYPTO */}
                  <CategoryOfferRow
                    id="row-free-crypto"
                    title="Crypto"
                    subtitle="Free Bitcoin bonuses, exchange sign-ups, crypto debit cards & airdrops"
                    icon={<Boxes size={20} className="stroke-[2.2]" />}
                    themeRgb="147, 51, 234"
                    offers={cryptoOffers}
                    savedOfferIds={savedOfferIds}
                    isOpen={openRowIds.has('row-free-crypto')}
                    onToggleOpen={() => handleToggleRow('row-free-crypto')}
                    onSelectOffer={setSelectedOffer}
                    onToggleSave={handleToggleSaveOffer}
                  />

                  {/* 4. INSTANT GRATIFICATION */}
                  <CategoryOfferRow
                    id="row-fast-offers"
                    title="Instant Gratification"
                    subtitle="$100 - $150 sequential easy cash & instant tasks"
                    icon={<Rocket size={20} className="stroke-[2.2]" />}
                    themeRgb="249, 115, 22"
                    offers={fastOffers}
                    savedOfferIds={savedOfferIds}
                    isOpen={openRowIds.has('row-fast-offers')}
                    onToggleOpen={() => handleToggleRow('row-fast-offers')}
                    onSelectOffer={setSelectedOffer}
                    onToggleSave={handleToggleSaveOffer}
                  />

                  {/* 5. TAKES MONEY TO MAKE MONEY 💰 */}
                  <CategoryOfferRow
                    id="row-finance"
                    title="Takes Money to Make Money 💰"
                    subtitle="Banking, high-yield accounts, and high-value credit booster rewards"
                    icon={<Vault size={20} className="stroke-[2.2]" />}
                    themeRgb="14, 165, 233"
                    offers={financeOffers}
                    savedOfferIds={savedOfferIds}
                    isOpen={openRowIds.has('row-finance')}
                    onToggleOpen={() => handleToggleRow('row-finance')}
                    onSelectOffer={setSelectedOffer}
                    onToggleSave={handleToggleSaveOffer}
                  />
                </div>

                {/* Standard Website Footer - Placed at the very bottom, normal readable text */}
                <footer className="mt-auto pt-6 pb-2 border-t border-slate-800/80 text-center space-y-1.5 max-w-2xl mx-auto px-4 select-none">
                  <p className="text-xs sm:text-[13px] leading-relaxed text-slate-400 font-normal">
                    © 2026 OHKNEE.COM — Partner incentives are strictly scrutinized, aggressively vetted, and monitored around the clock.
                  </p>
                  <div className="flex items-center justify-center flex-wrap gap-x-3 gap-y-1 text-[11px] sm:text-xs text-slate-500 font-medium">
                    <span>Please participate responsibly</span>
                    <span>•</span>
                    <span>Terms apply</span>
                    <span>•</span>
                    <span>We know they work, because we tested them on ourselves first</span>
                  </div>
                </footer>
              </main>
          )}
        </PageTransitionWrapper>
        )}
      </div>

      {/* Subtle Desktop-Only Owner & Staff Controls (Hidden on Mobile) */}
      <aside
        id="bottom-right-admin-pod"
        aria-label="Owner Desktop Admin & Analysis Controls"
        className="hidden md:flex fixed bottom-4 right-4 z-40 items-center gap-1.5 p-1.5 rounded-2xl bg-[#090e1a]/85 border border-slate-800/80 backdrop-blur-md shadow-xl select-none"
      >
        <button
          type="button"
          onClick={() => setIsOwnerAnalyticsOpen(true)}
          className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-slate-800/80 transition-colors cursor-pointer"
          title="Website Statistics & Traffic Analysis"
          aria-label="Website Statistics & Traffic Analysis"
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
