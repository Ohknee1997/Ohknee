import React, { useMemo, useState } from 'react';
import { EnrichedOffer } from '../data/enrichedOffers';
import { initialsOf, getAppDeduplicationKey } from '../utils';
import {
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  X,
  ChevronsUpDown,
  Sparkles,
} from 'lucide-react';

interface Top10MobileViewProps {
  offers: EnrichedOffer[];
  allOffers?: EnrichedOffer[];
  onSelectOffer: (offer: EnrichedOffer) => void;
  onToggleSave?: (offerId: string) => void;
  savedOfferIds?: Set<string>;
}

export const Top10MobileView: React.FC<Top10MobileViewProps> = ({
  offers,
  allOffers,
  onSelectOffer,
}) => {
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Top banner interactive states: collapsible compact mode and fully closeable
  const [isBannerClosed, setIsBannerClosed] = useState<boolean>(false);
  const [isBannerExpanded, setIsBannerExpanded] = useState<boolean>(false);
  const [expandedTipIndices, setExpandedTipIndices] = useState<Set<number>>(new Set());

  const toggleTipIndex = (idx: number) => {
    setExpandedTipIndices((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const handleCopyPromoCode = (e: React.MouseEvent, offer: EnrichedOffer) => {
    e.stopPropagation();
    if (!offer.code) return;
    navigator.clipboard.writeText(offer.code).catch(() => {});
    setCopiedCodeId(offer.id);
    setTimeout(() => {
      setCopiedCodeId((prev) => (prev === offer.id ? null : prev));
    }, 2000);
  };

  // Pool of all verified partner offers
  // Requested strict order:
  // 1: Stake, 2: Freecash, 3: Gems Loot, 4: Polymarket, 5: DraftKings
  // 6: Tilt, 7: Kalshi, 8: Coinbase
  // After Coinbase: Crown Coins, Lonestar, Modo, MyPrize, Zula, CoinsBack (ShopBack)
  const masterOffers = useMemo(() => {
    const list = allOffers && allOffers.length > 0 ? allOffers : offers;

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

    // 1-17 exact order as requested by user ("Leave the rest up top exactly in the order that I had them")
    const orderedFinders = [
      isStake,        // 1
      isFreecash,     // 2
      isGemsloot,     // 3
      isPolymarket,   // 4
      isDraftKings,   // 5
      isTilt,         // 6
      isReBet,        // 7
      isOnyx,         // 8
      isRips,         // 9
      isRipRush,      // 10
      isKalshi,       // 11
      isCoinbase,     // 12
      isCrownCoins,   // 13
      isLonestar,     // 14
      isModo,         // 15
      isMyPrize,      // 16
      isRealPrize,    // 17
    ];

    const orderedOffers: EnrichedOffer[] = [];
    const usedIds = new Set<string>();

    for (const finder of orderedFinders) {
      const match = list.find((o) => !usedIds.has(o.id) && finder(o)) || offers.find((o) => !usedIds.has(o.id) && finder(o));
      if (match) {
        orderedOffers.push(match);
        usedIds.add(match.id);
      }
    }

    const restList = list.filter((o) => !usedIds.has(o.id));

    // Casino detector helper
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

    // User requested: "after real prize the casino around 16 or 17 after that in the order of apps I don't want any casino apps until the very bottom so after real prize move the rest of the casino apps to the bottom and bring up all of my other apps to showcase those better just until 16 or around where real prize is."
    // Non-casino apps priority sequence to showcase right after Real Prize
    const nonCasinoPriorityFinders = [
      (o: EnrichedOffer) => o.id === 'fast-onepay' || o.name.toLowerCase().includes('onepay') || o.name.toLowerCase().includes('one pay'),
      (o: EnrichedOffer) => o.id === 'cash-back-1' || o.name.toLowerCase().includes('coins back') || o.name.toLowerCase().includes('coinsback') || o.name.toLowerCase().includes('shopback'),
      (o: EnrichedOffer) => o.id === 'banking-1' || o.name.toLowerCase().includes('sofi'),
      (o: EnrichedOffer) => o.id === 'banking-2' || o.name.toLowerCase().includes('aven'),
      (o: EnrichedOffer) => o.id === 'banking-3' || o.name.toLowerCase().includes('sendwave'),
      (o: EnrichedOffer) => o.id === 'banking-4' || o.name.toLowerCase().includes('self'),
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

    // Combine: Top 1-17 -> All other apps showcased -> All rest casino apps at the very bottom
    const combined = [
      ...orderedOffers,
      ...nonCasinoPriorityOffers,
      ...remainingNonCasino,
      ...remainingCasinos,
    ];

    const deduplicatedOffers: EnrichedOffer[] = [];
    const seenAppKeys = new Set<string>();

    for (const item of combined) {
      const appKey = getAppDeduplicationKey(item);
      if (!seenAppKeys.has(appKey)) {
        seenAppKeys.add(appKey);
        deduplicatedOffers.push(item);
      }
    }

    return deduplicatedOffers;
  }, [offers, allOffers]);

  // Format payout number matching Gemsloot ($ 336.60 or $ 110.19) or ranges ($10–$75)
  const formatPayoutDisplay = (text?: string, value?: number) => {
    if (!text && !value) return '$ 25.00';
    const trimmed = text?.trim() || '';
    if (trimmed.toLowerCase().includes('free card')) {
      return 'Free Cards';
    }
    // ReBet and Onyx: Ensure dollar signs in front as requested
    if (trimmed === '100' || trimmed === '$100') {
      return '$ 100';
    }
    if (trimmed === '150' || trimmed === '$150') {
      return '$ 150';
    }
    // Support range like $10-$75 or $10–$75
    const rangeMatch = text?.match(/\$?(\d+)\s*[-–]\s*\$?(\d+)/);
    if (rangeMatch && rangeMatch[1] && rangeMatch[2]) {
      return `$ ${rangeMatch[1]}–$ ${rangeMatch[2]}`;
    }
    const numMatch = text?.match(/\$?(\d+(\.\d+)?)/);
    if (numMatch && numMatch[1]) {
      const num = parseFloat(numMatch[1]);
      return `$ ${num % 1 === 0 ? `${num}.00` : num.toFixed(2)}`;
    }
    if (value && value > 0) {
      return `$ ${value % 1 === 0 ? `${value}.00` : value.toFixed(2)}`;
    }
    if (trimmed.startsWith('$')) {
      return trimmed;
    }
    // Fallback ensuring dollar sign is present for monetary rewards
    return '$ 25.00';
  };

  // Curated brief and detail descriptions for top apps without prices
  const curatedTipsByAppKey: Record<string, { brief: string; detail: string }> = {
    stake: {
      brief: 'Easiest bonus claim you will ever get, keeping #1 weekly. Check your email to claim your bonus!',
      detail: 'Stake.us is the easiest bonus you will ever claim, keeping the number one position week after week. Make sure to check your email for the bonus — I see a lot of you guys signing up but not claiming your bonus.',
    },
    freecash: {
      brief: 'Play one game for a few minutes before registering your bonus.',
      detail: 'Freecash follows in easiest money: you download it and play one game for a few minutes before it registers your bonus. Great earnings playing games, doing surveys, and sign up bonuses.',
    },
    gemsloot: {
      brief: 'Test PC games and Ascend tab allows downloading 5 games (repeatable 3x).',
      detail: 'Gems Loot allows you to test PC games and use their Ascend tab that lets you download five games that you can complete three times!',
    },
    polymarket: {
      brief: 'Join our squad with code MOPEYDINGO1343 to trade event & crypto predictions.',
      detail: 'Join our squad on Polymarket with code MOPEYDINGO1343. Trade predictions on events, culture, and crypto with instant settlement.',
    },
    draftkings: {
      brief: 'Top picks and predictions on sports and pop culture with fast cashouts.',
      detail: 'Top picks and predictions on sports and pop culture with fast bonus cashouts. Verified referral bonus for new signups.',
    },
    tilt: {
      brief: 'Referral rewards with code M0LGX1. Easy signup and instant referral tracking.',
      detail: 'Get rewarded for every friend you refer https://tilt.com/r/M0LGX1 (Referral Code: M0LGX1)',
    },
    rebet: {
      brief: 'Match up to 100 in ReBet free cash on your first purchase with code U-DAR-HLT-VS.',
      detail: 'Got you a match of up to 100 in ReBet free cash on your first purchase, use code U-DAR-HLT-VS on signup! https://play.rebet.app/share/referral/U-DAR-HLT-VS',
    },
    onyx: {
      brief: 'Sports prediction bonus with promo code EK137068 for up to 150 matching.',
      detail: 'Sign up on Onyx Odds with promo code EK137068 for up to 150 bonus. https://app.onyxodds.com/create-account?promo_code=EK137068',
    },
    rips: {
      brief: 'Download Triumph Rips and enter code NQYCTUM to get a card pack for free.',
      detail: 'Use my referral link to win on Triumph Rips! Enter code NQYCTUM and get a card pack for free. https://rips.onelink.me/Wj0m/wi7qf68q?deep_link_sub1=xNLNfOEOuNOG9qmuGzbjKZqHtJD2',
    },
    riprush: {
      brief: 'Download Rip Rush and enter code UCLEKH6 when registering to get a free card pack.',
      detail: 'Use my link to win on Rip Rush! Download the game using my link, then enter code UCLEKH6 when you register to get a card pack for free. https://riprush.onelink.me/se7Y/t1tr9df3?deep_link_sub1=O9m5kGxxmsNtOM7n57QeBLOKIG43',
    },
    kalshi: {
      brief: 'Trade real-world event contracts on economic, political, and cultural predictions.',
      detail: 'Kalshi allows you to trade regulated event contracts on real-world news, inflation, and entertainment.',
    },
    coinbase: {
      brief: 'Crypto exchange signup with instant learning tasks and trading reward credits.',
      detail: 'Coinbase signup rewards and crypto earn modules give you instant crypto deposits for learning and trading.',
    },
    crowncoins: {
      brief: 'Daily free sweeps coins, loyalty wheel spins, and top-tier jackpot slots.',
      detail: 'Crown Coins offers daily free SC reloads, instant prize redemption, and high RTP sweepstakes slot games.',
    },
    lonestar: {
      brief: 'Free sweepstakes spins and daily gold coin reload bonuses.',
      detail: 'Lone Star sweeps casino offers daily free login coins, progressive jackpot slots, and instant prize redemption.',
    },
    modo: {
      brief: 'Daily sweepstakes casino reload with instant redemption on verified wins.',
      detail: 'Modo Casino delivers daily free SC coins, instant gift card & cash redemptions, and exclusive VIP rewards.',
    },
    myprize: {
      brief: 'Multiplayer live sweepstakes casino with community jackpot drops and creator rooms.',
      detail: 'MyPrize is the first multiplayer sweepstakes casino where you can spin together with friends and split jackpots.',
    },
    realprize: {
      brief: 'Daily sweeps coins, spins, and registration bonus with promo code 2615334.',
      detail: 'Real Prize sweepstakes casino gives free bonus coins, daily login rewards, and instant gift card or cash redemption with code 2615334. https://realprize.com/refer/2615334',
    },
    onepay: {
      brief: 'Verify your ID and deposit to get an instant 25 cash bonus.',
      detail: 'OnePay provides fast mobile banking with zero maintenance fees, instant ID verification bonuses, and seamless deposits.',
    },
    coinsback: {
      brief: 'Instant shopping cashback and fast rebate bonus tracker across retail brands.',
      detail: 'CoinsBack / ShopBack unlocks automatic cashback across thousands of retail stores with direct bank payouts.',
    },
    sofi: {
      brief: 'High-yield checking, automated investing, and direct deposit cash bonuses.',
      detail: 'SoFi delivers all-in-one digital banking, high-yield savings interest, and instant reward boosts on debit spending.',
    },
    robinhood: {
      brief: 'Commission-free stock and crypto trading with instant sign-up fractional shares.',
      detail: 'Robinhood unlocks stock, ETF, and crypto trading with fractional shares and recurring bonus deposits.',
    },
    webull: {
      brief: 'Free fractional stocks upon deposit and advanced market analytics.',
      detail: 'Webull gives free promotional stocks when opening and funding an account, plus after-hours trading tools.',
    },
    kraken: {
      brief: 'Regulated crypto exchange with instant Bitcoin purchases and low fees.',
      detail: 'Kraken allows secure crypto trading, instant fiat deposits, and yield staking with enterprise-grade security.',
    },
    gemini: {
      brief: 'Licensed digital asset exchange with crypto rewards and trading tools.',
      detail: 'Gemini provides insured crypto custody, instant crypto purchases, and automated dollar-cost averaging.',
    },
    zula: {
      brief: 'Daily free coins, fish hunter games, and sweepstakes slot tournaments.',
      detail: 'Zula Casino gives daily free Sweeps Coins upon login, free spin mystery boxes, and instant prize transfers.',
    },
  };

  // User requested: "continue after 6:00 and go on through every single app giving a brief description and color coordinating the title with the color of the logo as well"
  const allTipsData = useMemo(() => {
    return masterOffers.map((offer, idx) => {
      const appKey = getAppDeduplicationKey(offer);
      const curated = curatedTipsByAppKey[appKey];
      const accentRgb = offer.accentRgb || '59, 130, 246';

      let fallbackBrief = offer.instructionSub || offer.descriptionText || 'Verified signup bonus and instant reward tracking.';
      // Clean out price figures to adhere strictly to "no need for the prices"
      fallbackBrief = fallbackBrief.replace(/\$\s*\d+([–-]\$?\d+)?/g, 'bonus').trim();
      if (fallbackBrief.length > 90) {
        fallbackBrief = fallbackBrief.slice(0, 87) + '...';
      }

      return {
        num: idx + 1,
        name: offer.name,
        accentRgb,
        brief: curated ? curated.brief : fallbackBrief,
        detail: curated
          ? curated.detail
          : (offer.instructionSub
              ? `${offer.instructionSub} ${offer.descriptionText || ''}`
              : offer.descriptionText || `Complete registration on ${offer.name} to claim your verified rewards.`),
      };
    });
  }, [masterOffers]);

  return (
    <div
      id="top-10-ascension-view"
      className="w-full min-h-screen bg-[#0d0f15] text-slate-100 select-none pb-24 md:pb-16"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pt-1 sm:pt-2 pb-4">
        {/* =======================================================================
            TOP APP BREAKDOWN: COMPACT 1-ACROSS BANNER
            Title: Skinny letters, not bold, centered, in bright red
            ======================================================================= */}
        {isBannerClosed ? (
          /* Sleek Re-open Pill when Closed */
          <div className="mb-2 flex items-center justify-between gap-2 p-1.5 sm:p-2 rounded-xl bg-[#131724] border border-red-500/40 hover:border-red-500 transition-colors">
            <div className="w-10" />
            <button
              type="button"
              onClick={() => setIsBannerClosed(false)}
              className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold tracking-wider uppercase text-red-500 hover:text-red-400 cursor-pointer transition-colors font-['Righteous',sans-serif]"
            >
              <Sparkles size={13} className="text-red-500" />
              <span>HEY DUMBASS READ THIS!</span>
            </button>
            <button
              type="button"
              onClick={() => setIsBannerClosed(false)}
              className="px-2 py-0.5 rounded bg-[#0d101a] text-slate-300 hover:text-red-400 transition-colors cursor-pointer text-xs flex items-center gap-0.5 border border-slate-700"
            >
              <span>Open</span>
              <ChevronDown size={13} />
            </button>
          </div>
        ) : (
          /* Active Compact 1-Across Banner */
          <div
            id="top3-announcement-banner"
            className="mb-2 sm:mb-2.5 w-full rounded-xl bg-[#131724] border border-red-500/60 p-2 sm:p-2.5 shadow-md shadow-black/50 transition-all"
          >
            {/* Banner Header: Title Centered, Bold Unique Font, Bright Red ALL CAPS */}
            <div className="relative flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800/80">
              {/* Left spacer to keep center alignment accurate */}
              <div className="w-16 hidden sm:block" />

              {/* Centered Bold Red Unique Font Title */}
              <div className="flex-1 text-center">
                <span className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-widest text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.45)] font-['Righteous',sans-serif]">
                  HEY DUMBASS READ THIS!
                </span>
              </div>

              {/* Header controls: details expand & close */}
              <div className="flex items-center gap-1">
                {/* Compress / Expand Button */}
                <button
                  type="button"
                  onClick={() => setIsBannerExpanded(!isBannerExpanded)}
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#0d101a] border border-slate-700 hover:border-red-500/60 text-slate-300 hover:text-red-400 text-[10px] sm:text-[11px] font-normal transition-all cursor-pointer"
                  title={isBannerExpanded ? 'Collapse descriptions' : 'Expand full tips'}
                >
                  <ChevronsUpDown size={11} />
                  <span>{isBannerExpanded ? 'Less' : 'Details'}</span>
                </button>

                {/* Close (X) Button to dismiss banner */}
                <button
                  type="button"
                  onClick={() => setIsBannerClosed(true)}
                  className="p-1 rounded-md bg-[#0d101a] border border-slate-700 hover:border-red-500 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                  title="Dismiss banner"
                  aria-label="Close descriptions"
                >
                  <X size={12} />
                </button>
              </div>
            </div>

            {/* 1 ACROSS ROWS: Name of app in matching style color + text description (No prices) + Expand Arrow */}
            {/* User requested: "I would like the description area up top to be able to scroll and I would like it to continue after 6:00 and go on through every single app giving a brief description and color coordinating the title with the color of the logo as well but I don't want that to scroll down the entire page I wanted to stay inside of the boxed area up top where my boxes below don't move at all" */}
            <div className="flex flex-col gap-1 w-full max-h-[148px] sm:max-h-[164px] overflow-y-auto pr-1 select-text scroll-smooth [scrollbar-width:thin] [scrollbar-color:#334155_transparent]">
              {allTipsData.map((item, idx) => {
                const isItemExpanded = isBannerExpanded || expandedTipIndices.has(idx);

                return (
                  <div
                    key={`${item.num}-${item.name}`}
                    onClick={() => toggleTipIndex(idx)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleTipIndex(idx);
                      }
                    }}
                    className={`w-full flex flex-col p-1.5 rounded-lg bg-[#0e111a] border border-slate-800/80 hover:border-slate-700 transition-colors cursor-pointer text-left ${
                      isItemExpanded ? 'bg-[#151a28]' : ''
                    }`}
                  >
                    {/* Single Row Layout: #Badge + App Name in brand color + brief description + Chevron */}
                    <div className="flex items-center justify-between gap-2 w-full">
                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        {/* Number badge color coordinated with app logo */}
                        <span
                          style={{
                            backgroundColor: `rgba(${item.accentRgb}, 0.16)`,
                            borderColor: `rgba(${item.accentRgb}, 0.45)`,
                            color: `rgb(${item.accentRgb})`,
                          }}
                          className="w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center flex-shrink-0 border"
                        >
                          {item.num}
                        </span>

                        {/* App Name in color matching style */}
                        <span
                          style={{ color: `rgb(${item.accentRgb})` }}
                          className="text-[11px] sm:text-xs font-bold flex-shrink-0"
                        >
                          {item.name}:
                        </span>

                        {/* Brief text description right after the logo words, no prices */}
                        <span className="text-[10px] sm:text-[11px] text-slate-300 truncate font-normal leading-tight">
                          {item.brief}
                        </span>
                      </div>

                      {/* Expand / Collapse Indicator Arrow */}
                      <span className="text-slate-400 hover:text-slate-200 flex-shrink-0 p-0.5">
                        {isItemExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </span>
                    </div>

                    {/* Extended detail visible on expand */}
                    {isItemExpanded && (
                      <p className="mt-1 pt-1 border-t border-slate-800 text-[11px] text-slate-200 leading-relaxed font-normal animate-in fade-in duration-150">
                        {item.detail}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =======================================================================
            OFFERS GRID: NUMBERED SEQUENTIALLY 1 - 10000
            Theme-matched background colors based on each app's logo/brand accent!
            ======================================================================= */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-9 gap-1.5 sm:gap-2 w-full">
          {masterOffers.map((offer, idx) => {
            const rankNumber = idx + 1;
            const rawLogoSrc =
              offer.logoUrl ||
              (offer.domain
                ? `https://www.google.com/s2/favicons?domain=${offer.domain}&sz=128`
                : undefined);

            // Theme-matched custom color styles for the box background and borders
            const accentRgb = offer.accentRgb || '34, 197, 94';
            const cardBgStyle = {
              backgroundColor: `rgba(${accentRgb}, 0.12)`,
              borderColor: `rgba(${accentRgb}, 0.35)`,
              boxShadow: `0 4px 14px -3px rgba(${accentRgb}, 0.25)`,
            };
            const innerArtBgStyle = {
              backgroundColor: `rgba(${accentRgb}, 0.16)`,
              borderColor: `rgba(${accentRgb}, 0.40)`,
            };
            const accentTextStyle = {
              color: `rgb(${accentRgb})`,
            };

            const hasCode = Boolean(offer.code && offer.code.trim().length > 0);

            return (
              <div
                key={offer.id}
                onClick={() => onSelectOffer(offer)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectOffer(offer);
                  }
                }}
                style={cardBgStyle}
                className="group relative flex flex-col justify-between select-none cursor-pointer rounded-xl p-2 sm:p-2.5 min-h-[162px] sm:min-h-[176px] md:min-h-[188px] transition-all duration-150 hover:-translate-y-0.5 hover:brightness-110 border"
              >
                {/* 1. TOP ARTWORK / LOGO CONTAINER (Themed inner container) */}
                <div
                  style={innerArtBgStyle}
                  className="w-full h-18 sm:h-22 md:h-24 rounded-lg border relative flex items-center justify-center p-1.5 overflow-hidden flex-shrink-0 transition-colors backdrop-blur-xs"
                >
                  {/* Top-left: Sequential App Number (1 - 10000) */}
                  <div
                    style={{ borderColor: `rgba(${accentRgb}, 0.7)` }}
                    className="absolute top-1 left-1 z-10 px-1.5 py-0.2 rounded-full bg-[#181d2c]/95 border text-white text-[9px] sm:text-[10px] font-black shadow-xs flex items-center gap-0.5 backdrop-blur-xs"
                    title={`Rank #${rankNumber}`}
                  >
                    <span style={accentTextStyle} className="text-[8px]">#</span>
                    <span>{rankNumber}</span>
                  </div>

                  {/* High-Resolution Referral Partner Logo */}
                  {rawLogoSrc ? (
                    <img
                      src={rawLogoSrc}
                      alt={offer.name}
                      className="max-h-full max-w-full object-contain drop-shadow-md group-hover:scale-105 transition-transform"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <span style={accentTextStyle} className="text-base sm:text-lg font-black tracking-wider">
                        {initialsOf(offer.name)}
                      </span>
                    </div>
                  )}
                </div>

                {/* PROMO CODE DISPLAY UNDERNEATH IMAGE - CLEARLY VISIBLE & CLICK-TO-COPY */}
                {hasCode && (
                  <button
                    type="button"
                    onClick={(e) => handleCopyPromoCode(e, offer)}
                    title="Click to copy promo code"
                    aria-label={`Copy code ${offer.code}`}
                    style={{
                      borderColor: `rgba(${accentRgb}, 0.4)`,
                      backgroundColor: copiedCodeId === offer.id ? `rgba(${accentRgb}, 0.25)` : `rgba(15, 18, 29, 0.75)`,
                    }}
                    className="mt-1.5 w-full flex items-center justify-between gap-1 px-1.5 py-0.5 rounded-md border transition-all cursor-pointer text-white"
                  >
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="text-[8px] font-bold text-slate-300 uppercase tracking-wider flex-shrink-0">
                        CODE:
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-mono font-black tracking-wide text-white truncate">
                        {offer.code}
                      </span>
                    </div>
                    {copiedCodeId === offer.id ? (
                      <span
                        style={{
                          backgroundColor: `rgba(${accentRgb}, 0.3)`,
                          borderColor: `rgba(${accentRgb}, 0.6)`,
                          color: '#fff',
                        }}
                        className="flex items-center gap-0.5 text-[8px] font-extrabold flex-shrink-0 px-1 py-0.2 rounded border"
                      >
                        <Check size={9} />
                        COPIED
                      </span>
                    ) : (
                      <span
                        style={accentTextStyle}
                        className="flex items-center gap-0.5 text-[8px] font-bold flex-shrink-0"
                      >
                        <Copy size={9} />
                        COPY
                      </span>
                    )}
                  </button>
                )}

                {/* 2. TEXT INFORMATION: Name + Bold Payout
                    User requested: "If there's a code that you can copy I want the text to be centered directly under it 
                    if there is no code for you to copy I want it to be placed on the bottom left of the square" */}
                <div
                  className={`flex flex-col w-full min-w-0 pt-2 pb-0.5 px-0.5 ${
                    hasCode
                      ? 'items-center text-center justify-center'
                      : 'items-start text-left justify-end mt-auto'
                  }`}
                >
                  {/* Offer Name - Made slightly bigger as requested */}
                  <h4
                    className={`w-full truncate text-xs sm:text-[13px] md:text-sm font-bold text-white group-hover:underline transition-colors leading-tight ${
                      hasCode ? 'text-center' : 'text-left'
                    }`}
                  >
                    {offer.name}
                  </h4>

                  {/* Bold Payout ($ 336.60 style) - Made numbers and text bigger as requested */}
                  <div
                    className={`w-full flex items-center gap-1.5 mt-1 ${
                      hasCode ? 'justify-center text-center' : 'justify-start text-left'
                    }`}
                  >
                    <span className="text-sm sm:text-base md:text-[17px] font-black text-white tracking-tight leading-none truncate">
                      {formatPayoutDisplay(offer.payout, offer.rewardValue)}
                    </span>

                    {/* Quick Action Icon: Details trigger with accent styling */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectOffer(offer);
                      }}
                      style={accentTextStyle}
                      className="p-0.5 hover:bg-white/10 rounded transition-colors flex-shrink-0"
                      title="View Offer Details & Promo Link"
                    >
                      <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
