import React, { useMemo, useState, useRef, useEffect } from 'react';
import { EnrichedOffer } from '../data/enrichedOffers';
import { initialsOf, getAppDeduplicationKey } from '../utils';
import {
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';

interface Top10MobileViewProps {
  offers: EnrichedOffer[];
  allOffers?: EnrichedOffer[];
  onSelectOffer: (offer: EnrichedOffer) => void;
  onToggleSave?: (offerId: string) => void;
  savedOfferIds?: Set<string>;
  selectedOffer?: EnrichedOffer | null;
  onCloseOffer?: () => void;
}

export const Top10MobileView: React.FC<Top10MobileViewProps> = ({
  offers,
  allOffers,
  onSelectOffer,
  selectedOffer,
  onCloseOffer,
}) => {
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Top banner interactive states: collapsible compact mode and fully closeable
  const [isBannerClosed, setIsBannerClosed] = useState<boolean>(false);
  const [isBannerExpanded, setIsBannerExpanded] = useState<boolean>(false);
  const [expandedTipIndices, setExpandedTipIndices] = useState<Set<number>>(new Set());
  // Expanded full-box view inside the red border for the selected app
  const [expandedTipAppIdx, setExpandedTipAppIdx] = useState<number | null>(null);

  // Sticky description box & square cards scroll synchronization
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const activeCardIndexRef = useRef<number>(0);
  const stickyHeaderRef = useRef<HTMLDivElement>(null);
  const descScrollRef = useRef<HTMLDivElement>(null);
  const isAutoScrollingDesc = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // When exiting out of the briefing modal, close the tab in the description box above as well
  const prevSelectedOfferRef = useRef<EnrichedOffer | null>(selectedOffer || null);
  useEffect(() => {
    if (prevSelectedOfferRef.current && !selectedOffer) {
      setExpandedTipAppIdx(null);
    }
    prevSelectedOfferRef.current = selectedOffer || null;
  }, [selectedOffer]);

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
    const isFanDuel = (o: EnrichedOffer) =>
      o.id === 'fast-fanduel' || o.id === 'sports-fanduel' || o.name.toLowerCase().includes('fanduel');
    const isPrizePicks = (o: EnrichedOffer) =>
      o.id === 'fast-prizepicks' || o.id === 'sports-2' || o.id === 'sports-prizepicks' || o.name.toLowerCase().includes('prizepick');
    const isBabaCasino = (o: EnrichedOffer) =>
      o.id === '3' || o.id.includes('baba') || o.name.toLowerCase().includes('baba');
    const isVinted = (o: EnrichedOffer) =>
      o.id === 'cash-back-vinted' || o.id === 'ref-vinted' || o.name.toLowerCase().includes('vinted');

    // 1-9+ exact order as requested by user:
    // 1: Stake, 2: Kalshi ($55), 3: Poly, 4: Draft Kings, 5: FanDuel, 6: Prize Picks ($50), 7: Ero, 8: Freecash, 9: Gems Loot, 10: Coinbase, 11: Vinted
    const orderedFinders = [
      isStake,        // 1: Stake
      isKalshi,       // 2: Kalshi
      isPolymarket,   // 3: Poly (Polymarket)
      isDraftKings,   // 4: Draft Kings
      isFanDuel,      // 5: FanDuel
      isPrizePicks,   // 6: Prize Picks
      isEro,          // 7: Ero
      isFreecash,     // 8: Freecash
      isGemsloot,     // 9: Gems Loot
      isCoinbase,     // 10: Coinbase
      isVinted,       // 11: Vinted ("vented")
      isTilt,         // 12: Tilt
      isRips,         // 13: Rips
      isReBet,        // 14: ReBet
      isOnyx,         // 15: Onyx Odds
      isRipRush,      // 16: Rip Rush
      isCrownCoins,   // 17: Crown Coins
      isLonestar,     // 18: Lone Star
      isModo,         // 19: Modo
      isBabaCasino,   // 20: Baba Casino
      isMyPrize,      // 21: MyPrize
      isRealPrize,    // 22: Real Prize
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
    // Non-casino apps priority sequence to showcase right after Real Prize (ONLY verified referral partners)
    const nonCasinoPriorityFinders = [
      (o: EnrichedOffer) => o.id === 'fast-onepay' || o.id === 'banking-0' || o.name.toLowerCase().includes('onepay') || o.name.toLowerCase().includes('one pay'),
      (o: EnrichedOffer) => o.id === 'banking-chime' || o.name.toLowerCase().includes('chime'),
      (o: EnrichedOffer) => o.id === 'cash-back-1' || o.name.toLowerCase().includes('coins back') || o.name.toLowerCase().includes('coinsback') || o.name.toLowerCase().includes('shopback'),
      (o: EnrichedOffer) => o.id === 'banking-1' || o.name.toLowerCase().includes('sofi'),
      (o: EnrichedOffer) => o.id === 'banking-2' || o.name.toLowerCase().includes('aven'),
      (o: EnrichedOffer) => o.id === 'banking-3' || o.name.toLowerCase().includes('sendwave'),
      (o: EnrichedOffer) => o.id === 'banking-4' || o.name.toLowerCase().includes('self'),
      (o: EnrichedOffer) => o.id === 'cash-back-vinted' || o.name.toLowerCase().includes('vinted'),
      (o: EnrichedOffer) => o.id === 'fast-goodwall' || o.name.toLowerCase().includes('goodwall'),
      (o: EnrichedOffer) => o.id === 'free-crypto-xplace' || o.name.toLowerCase().includes('x.place'),
      (o: EnrichedOffer) => o.id === 'trading-cards-1' || o.id === 'finance-robinhood' || o.name.toLowerCase().includes('robinhood'),
      (o: EnrichedOffer) => o.id === 'sports-0' || o.id === 'sports-dabble' || o.name.toLowerCase().includes('dabble'),
      (o: EnrichedOffer) => o.id === 'sports-2' || o.id === 'sports-prizepicks' || o.name.toLowerCase().includes('prizepicks'),
      (o: EnrichedOffer) => o.id === 'free-crypto-3' || o.id === 'crypto-kraken' || o.name.toLowerCase().includes('kraken'),
      (o: EnrichedOffer) => o.id === 'free-crypto-1' || o.id === 'crypto-koinly' || o.name.toLowerCase().includes('koinly'),
      (o: EnrichedOffer) => o.id === 'instant-cash-3' || o.id === 'cash-back-fetch' || o.name.toLowerCase().includes('fetch'),
      (o: EnrichedOffer) => o.id === 'instant-cash-1' || o.id === 'cash-back-debbie' || o.name.toLowerCase().includes('debbie'),
      (o: EnrichedOffer) => o.id === 'cash-back-0' || o.id === 'cash-back-joko' || o.name.toLowerCase().includes('joko'),
      (o: EnrichedOffer) => o.id === 'crypto-gate' || o.name.toLowerCase().includes('gate'),
      (o: EnrichedOffer) => o.id === 'crypto-uphold' || o.name.toLowerCase().includes('uphold'),
      (o: EnrichedOffer) => o.id === 'instant-cash-2' || o.id === 'cash-back-myappfree' || o.name.toLowerCase().includes('myfreeapp'),
      (o: EnrichedOffer) => o.id === 'fin-paypal' || o.name.toLowerCase().includes('paypal'),
      (o: EnrichedOffer) => o.id === 'fin-sezzle' || o.name.toLowerCase().includes('sezzle'),
      (o: EnrichedOffer) => o.id === 'fin-copper' || o.name.toLowerCase().includes('copper'),
      (o: EnrichedOffer) => o.id === 'invest-acorns' || o.name.toLowerCase().includes('acorns'),
      (o: EnrichedOffer) => o.id === 'fin-cashapp' || o.name.toLowerCase().includes('cash app'),
      (o: EnrichedOffer) => o.id === 'fin-attapoll' || o.name.toLowerCase().includes('attapoll'),
      (o: EnrichedOffer) => o.id === 'fin-cashgiraffe' || o.name.toLowerCase().includes('cash giraffe'),
      (o: EnrichedOffer) => o.id === 'fin-benjamin' || o.name.toLowerCase().includes('benjamin'),
      (o: EnrichedOffer) => o.id === 'fin-qmee' || o.name.toLowerCase().includes('qmee'),
      (o: EnrichedOffer) => o.id === 'fin-yell' || o.name.toLowerCase().includes('yell'),
      (o: EnrichedOffer) => o.id === 'fin-upside' || o.name.toLowerCase().includes('upside'),
      (o: EnrichedOffer) => o.id === 'banking-go2bank' || o.name.toLowerCase().includes('go2bank'),
      (o: EnrichedOffer) => o.id === 'invest-public' || o.name.toLowerCase().includes('public'),
      (o: EnrichedOffer) => o.id === 'fin-gomining' || o.name.toLowerCase().includes('gomining'),
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
      brief: 'Easiest $25 you will ever get: just sign up, verify, and check your email!',
      detail:
        'This is absolutely the easiest $25 you will ever get: just sign up and verify your ID, and then you will get an email. Make sure you check your email — I have so many people signing up and not claiming their bonuses!',
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
      brief:
        'Join our squad for $60 bonus! (Link Discord for $5 free to start without a deposit)',
      detail:
        'Join our squad on Polymarket to trade event and crypto predictions and claim your $60 bonus! If you cannot afford to make a deposit, once you verify your ID, go to the bottom right, tap "Rewards", and find the "Link Discord" button — that gives you $5 instantly! Then make a trade with that free $5 to trigger the bonus rewards.',
    },
    draftkings: {
      brief: 'Top picks and predictions on sports and pop culture with fast cashouts.',
      detail: 'Top picks and predictions on sports and pop culture with fast bonus cashouts. Verified referral bonus for new signups.',
    },
    fanduel: {
      brief: 'Trade $1+ daily for 5 days to earn a $20 daily Predicts Bonus (up to $100 total rewards)!',
      detail: 'FanDuel Predicts offers regulated event and sports predictions. Trade $1+ daily for 5 days to earn a $20 daily Predicts Bonus (up to $100 total bonus rewards)! https://fndl.co/m0p4sk7',
    },
    prizepicks: {
      brief: 'Daily fantasy sports player props with instant $50 bonus entry credit.',
      detail: 'PrizePicks gives you instant player prediction entries across all major sports leagues. Sign up and get your $50 bonus entry credit! https://prizepicks.onelink.me/FjtC/oh2itiyc',
    },
    ero: {
      brief: 'Earn real cash completing brand missions and app tasks with an instant 50% day-one boost.',
      detail: 'Ero (by EarnOS) rewards you in real cash for completing quick brand missions, connecting apps, and playing games. Cash out instantly to your free ero Visa card or direct to your bank. Use code uoj7nba2x5 for an extra 50% earnings boost on your first day! https://ero.app/r/uoj7nba2x5?link=u63qfmappxxh (Referral Code: uoj7nba2x5)',
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
    mintpull: {
      brief: 'Grab a FREE card pack on MintPull with invite code M4VUN4.',
      detail: "Grab a FREE card pack on MintPull! Use my invite code M4VUN4 or just tap the link below to claim yours instantly. Let's win big! https://mintpullios.onelink.me/neMv/86iumkry?invite_code=M4VUN4",
    },
    kalshi: {
      brief:
        'Trade event contracts on real-world news and markets for a $55 bonus!',
      detail:
        'Kalshi allows you to trade regulated event contracts on real-world news and markets for a $55 bonus! You just need to make trades to qualify. Even if you only deposit $1, you can just buy and sell a $1 offer multiple times to unlock the $55 reward! https://kalshi.com/sign-up/?referral=18cd159f-1a05-4412-9368-43ecd3d21187&m=true',
    },
    coinbase: {
      brief: 'Crypto exchange signup with instant learning tasks and trading reward credits.',
      detail: 'Coinbase lets you buy, sell, and trade crypto safely. Sign up with my link and start earning free crypto bonuses. https://coinbase.com/join/R6Z6SB3?src=android-link',
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
      detail: 'OnePay provides fast mobile banking with zero maintenance fees, instant ID verification bonuses, and seamless deposits with code a0pJVrI0m. https://web.onepay.com/wlink/refer-a-friend?product=one_banking&referral_code=a0pJVrI0m&referrer_campaign_id=campaign.db1edd0a-4a5b-4651-8c20-d0fb7e98fec5',
    },
    chime: {
      brief: 'Open account with direct deposit to unlock $100 referral cash bonus.',
      detail: 'Chime mobile banking with fee-free overdraft, early direct deposit, and a $100 cash bonus when you sign up with referral. https://www.chime.com/r/oniamaya/?c=s',
    },
    self: {
      brief: 'Build credit and unlock savings with credit builder account rewards.',
      detail: 'Self Credit Builder helps you build credit history with credit bureaus while saving money, with bonus referral perks using code FI4EZ0Y8. https://self.inc/refer/FI4EZ0Y8',
    },
    koinly: {
      brief: 'Crypto tax calculator and portfolio tracking bonus.',
      detail: 'Koinly simplifies crypto tax reporting and tracking across wallets with a referral credit on upgrades. https://koinly.io/?via=A6A33D50&utm_source=friend',
    },
    vinted: {
      brief: 'Buy and sell secondhand clothes with invite voucher bonus credits.',
      detail: 'Vinted is an online marketplace for buying and selling secondhand fashion. Sign up with invite code ohknee97. https://www.vinted.com/invite/ohknee97',
    },
    goodwall: {
      brief: 'Join youth challenges, build social impact skills, and earn instant rewards.',
      detail: 'Goodwall connects you with skill-building challenges, courses, and reward incentives. Sign up using my link for bonus rewards. https://goodwall.onelink.me/45N9/cazsnfmp',
    },
    xplace: {
      brief: 'Web3 crypto tasks and reward platform with referral code Ohknee29.',
      detail: 'x.place rewards users for discovering web3 games, quests, and community airdrops. Enter referral code Ohknee29 during signup. https://x.place/ref/Ohknee29',
    },
    sendwave: {
      brief: 'Get $20.00 credit towards your first transfer with referral code 1ADY9.',
      detail: 'Sendwave offers fast, zero-fee international money transfers. Use code 1ADY9 to get a $20.00 credit towards your first transfer. Download at https://try.sendwave.com/kjap/alct9oam',
    },
    coinsback: {
      brief: 'Instant shopping cashback and fast rebate bonus tracker across retail brands.',
      detail: 'CoinsBack / ShopBack unlocks automatic cashback across thousands of retail stores with direct bank payouts. Code: dp9DMq. https://app.shopback.com/dp9DMq',
    },
    sofi: {
      brief: 'High-yield checking, automated investing, and direct deposit cash bonuses.',
      detail: 'SoFi delivers all-in-one digital banking, high-yield savings interest, and instant reward boosts on debit spending.',
    },
    robinhood: {
      brief: 'Commission-free stock and crypto trading with instant sign-up fractional shares.',
      detail: 'Robinhood unlocks stock, ETF, and crypto trading with fractional shares and recurring bonus deposits. https://join.robinhood.com/onia2',
    },
    kraken: {
      brief: 'Regulated crypto exchange with instant Bitcoin purchases and low fees.',
      detail: 'Kraken allows secure crypto trading, instant fiat deposits, and yield staking with enterprise-grade security. https://invite.kraken.com/JDNW/wsv48yot',
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

      const detailText = curated
        ? curated.detail
        : (offer.instructionSub
            ? `${offer.instructionSub} ${offer.descriptionText || ''}`
            : offer.descriptionText || `Complete registration on ${offer.name} to claim your verified rewards.`);

      const extractedUrlMatch = detailText.match(/https?:\/\/[^\s]+/);
      // ALWAYS prioritize verified offer signupUrl referral link first!
      const referralUrl = offer.signupUrl || (extractedUrlMatch ? extractedUrlMatch[0] : '#');

      return {
        num: idx + 1,
        name: offer.name,
        accentRgb,
        brief: curated ? curated.brief : fallbackBrief,
        detail: detailText,
        offer,
        referralUrl,
      };
    });
  }, [masterOffers]);

  // Synchronize scrolling: instantaneously switch description box and highlight active card below
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        let bestIdx = 0;
        const screenCenterX = window.innerWidth / 2;
        const screenCenterY = window.innerHeight / 2;

        // Focus on the card closest to the center of the screen (the one in the center viewport)
        const hitCard = (
          document.elementFromPoint(screenCenterX, screenCenterY) ||
          document.elementFromPoint(screenCenterX - 40, screenCenterY) ||
          document.elementFromPoint(screenCenterX + 40, screenCenterY) ||
          document.elementFromPoint(screenCenterX, screenCenterY - 30) ||
          document.elementFromPoint(screenCenterX, screenCenterY + 30)
        )?.closest('[id^="card-square-"]');

        if (hitCard) {
          const parsed = parseInt(hitCard.id.replace('card-square-', ''), 10);
          if (!isNaN(parsed) && parsed >= 0 && parsed < masterOffers.length) {
            bestIdx = parsed;
          }
        } else {
          // Robust fallback checking which card is closest to the screen center
          let minDistance = Infinity;
          for (let i = 0; i < masterOffers.length; i++) {
            const cardEl = document.getElementById(`card-square-${i}`);
            if (cardEl) {
              const rect = cardEl.getBoundingClientRect();
              if (rect.bottom < 0 || rect.top > window.innerHeight) continue;

              const cardCenterX = rect.left + rect.width / 2;
              const cardCenterY = rect.top + rect.height / 2;
              const dist = Math.hypot(cardCenterX - screenCenterX, cardCenterY - screenCenterY);
              if (dist < minDistance) {
                minDistance = dist;
                bestIdx = i;
              }
            }
          }
        }

        // Only update state & trigger instant snap if the active index actually changed!
        if (bestIdx !== activeCardIndexRef.current) {
          activeCardIndexRef.current = bestIdx;
          setActiveCardIndex(bestIdx);

          // Instantaneous clicky switch in description box - zero lag
          if (!isAutoScrollingDesc.current && descScrollRef.current) {
            const container = descScrollRef.current;
            let targetScrollTop = 0;
            if (bestIdx >= 2) {
              const slot1El = document.getElementById(`desc-item-${bestIdx - 2}`);
              if (slot1El) {
                targetScrollTop = slot1El.offsetTop - container.offsetTop;
              }
            }
            container.scrollTop = targetScrollTop;
          }
        }

        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [masterOffers]);

  return (
    <div
      id="top-10-ascension-view"
      className="w-full min-h-screen bg-black text-slate-100 select-none pb-24 md:pb-16"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pt-0 pb-4">
        {/* =======================================================================
            TOP APP BREAKDOWN: STICKY 1-ACROSS BANNER
            Slides up to top: 0, covers header/logo, and stops as red border touches top!
            ======================================================================= */}
        <div
          ref={stickyHeaderRef}
          id="sticky-top-description-wrapper"
          className="sticky top-0 z-45 pt-0 pb-1.5 bg-black transition-shadow"
        >
          {/* Active Compact 1-Across Banner */}
          <div
            id="top3-announcement-banner"
            className="mb-1 w-full rounded-xl bg-[#131724] border-2 border-red-500 p-2 shadow-md shadow-black/50 transition-all relative overflow-hidden"
          >
            {/* When a tab/app is selected, expand to take up the full size of the description box in opaque white style */}
            {expandedTipAppIdx !== null && allTipsData[expandedTipAppIdx] ? (
              (() => {
                const item = allTipsData[expandedTipAppIdx];
                const offer = item.offer;
                const referralUrl = item.referralUrl || offer?.signupUrl || '#';
                const hasCode = Boolean(offer?.code && offer.code.trim().length > 0);
                const cleanDetail = item.detail.replace(/https?:\/\/[^\s]+/g, '').trim();

                return (
                  <div
                    id="expanded-description-box"
                    className="w-full min-h-[195px] sm:min-h-[210px] rounded-lg bg-white text-zinc-900 p-3 sm:p-4 shadow-xl flex flex-col justify-between relative select-text animate-in fade-in zoom-in-95 duration-150"
                  >
                    {/* Big Red X in Top Right so they can exit out once done */}
                    <button
                      type="button"
                      id="close-description-detail-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedTipAppIdx(null);
                        if (onCloseOffer) {
                          onCloseOffer();
                        }
                      }}
                      className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 active:scale-90 border-2 border-red-500 flex items-center justify-center text-red-600 hover:text-red-700 transition-all cursor-pointer shadow-md z-30"
                      title="Close description"
                      aria-label="Close description"
                    >
                      <X size={20} strokeWidth={3.5} />
                    </button>

                    {/* Header: Badge, App Name in brand color, and Promo Code */}
                    <div className="flex items-center gap-2 pr-11 border-b border-zinc-200 pb-2 mb-2">
                      <span
                        style={{
                          backgroundColor: `rgba(${item.accentRgb}, 0.18)`,
                          borderColor: `rgb(${item.accentRgb})`,
                          color: `rgb(${item.accentRgb})`,
                        }}
                        className="px-2.5 py-1 rounded-md text-sm font-black border flex-shrink-0"
                      >
                        #{item.num}
                      </span>
                      <h3
                        style={{ color: `rgb(${item.accentRgb})` }}
                        className="text-base sm:text-lg font-black tracking-tight truncate leading-none"
                      >
                        {item.name}
                      </h3>
                      {hasCode && (
                        <span className="hidden xs:inline-flex ml-auto text-[10px] sm:text-xs font-mono font-bold bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                          CODE: {offer.code}
                        </span>
                      )}
                    </div>

                    {/* Body: Clean Brief and Detailed Information */}
                    <div className="flex-1 overflow-y-auto max-h-[115px] sm:max-h-[135px] pr-1 space-y-1.5 [scrollbar-width:thin]">
                      <p className="text-xs sm:text-[13px] font-bold text-zinc-950 leading-snug">
                        {item.brief}
                      </p>
                      {cleanDetail && (
                        <p className="text-xs sm:text-[12.5px] text-zinc-700 font-normal leading-relaxed">
                          {cleanDetail}
                        </p>
                      )}
                    </div>

                    {/* Bottom: Obvious Referral Link Button & Promo Code Copy */}
                    <div className="pt-2.5 mt-2 border-t border-zinc-200 flex items-center gap-2">
                      <a
                        id={`proceed-referral-btn-${item.num}`}
                        href={referralUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-black text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg transition-all text-center cursor-pointer"
                      >
                        <span>PROCEED TO {item.name.toUpperCase()} (REFERRAL LINK)</span>
                        <ExternalLink size={14} />
                      </a>

                      {hasCode && (
                        <button
                          type="button"
                          onClick={(e) => handleCopyPromoCode(e, offer)}
                          className="py-2 px-3 rounded-lg bg-zinc-100 hover:bg-zinc-200 active:scale-95 text-zinc-800 text-xs font-bold border border-zinc-300 flex items-center gap-1 cursor-pointer transition-colors flex-shrink-0"
                          title="Copy promo code"
                        >
                          {copiedCodeId === offer.id ? (
                            <>
                              <Check size={13} className="text-emerald-600 stroke-[3]" />
                              <span className="text-emerald-700 font-black">COPIED</span>
                            </>
                          ) : (
                            <>
                              <Copy size={13} />
                              <span>{offer.code}</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()
            ) : (
              <>
                {/* Banner Header: Title Centered in Very Middle, Bright Neon Green */}
                <div className="flex items-center justify-center pb-1.5 mb-1.5 border-b border-slate-800/80 text-center w-full">
                  <span className="text-[13px] xs:text-sm sm:text-base md:text-lg font-bold uppercase tracking-tight xs:tracking-normal sm:tracking-wide text-[#00ff88] drop-shadow-[0_0_12px_rgba(0,255,136,0.65)] font-['Righteous',sans-serif] truncate">
                    100 VERIFIED AND TRUSTED SIGNUP BONUSES
                  </span>
                </div>

                {/* 1 ACROSS ROWS: Clicking any row expands to take up the entire description box */}
                <div
                  ref={descScrollRef}
                  id="description-scroll-container"
                  className="flex flex-col gap-1 w-full h-[178px] sm:h-[188px] max-h-[178px] sm:max-h-[188px] overflow-y-auto pr-1 select-text [scrollbar-width:thin] [scrollbar-color:#334155_transparent]"
                >
                  {allTipsData.map((item, idx) => {
                    const isCurrentActive = idx === activeCardIndex;

                    return (
                      <div
                        id={`desc-item-${idx}`}
                        key={`${item.num}-${item.name}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedTipAppIdx(idx);
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            setExpandedTipAppIdx(idx);
                          }
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 min-h-[34px] rounded-lg border transition-all cursor-pointer text-left ${
                          isCurrentActive
                            ? 'bg-[#1b1526] border-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.25)]'
                            : 'bg-[#0e111a] border-slate-800/80 hover:border-slate-700 hover:bg-[#151a28]'
                        }`}
                      >
                        {/* Single Row Layout: #Badge + App Name in brand color + brief description */}
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          {/* Number badge color coordinated with app logo */}
                          <span
                            style={{
                              backgroundColor: `rgba(${item.accentRgb}, 0.16)`,
                              borderColor: `rgba(${item.accentRgb}, 0.45)`,
                              color: `rgb(${item.accentRgb})`,
                            }}
                            className="w-6 h-6 rounded-md text-xs sm:text-sm font-black flex items-center justify-center flex-shrink-0 border"
                          >
                            {item.num}
                          </span>

                          {/* App Name in color matching style */}
                          <span
                            style={{ color: `rgb(${item.accentRgb})` }}
                            className="text-xs sm:text-[13px] font-bold flex-shrink-0"
                          >
                            {item.name}:
                          </span>

                          {/* Brief text description */}
                          <span className="text-[11.5px] sm:text-xs text-slate-100 truncate font-medium leading-tight">
                            {item.brief}
                          </span>
                        </div>

                        {/* Visual prompt showing it expands */}
                        <span className="text-slate-400 hover:text-white text-[10px] font-bold flex items-center gap-1 flex-shrink-0 ml-1.5 px-1.5 py-0.5 rounded bg-slate-800/60 border border-slate-700/50">
                          <span>READ</span>
                          <ChevronDown size={12} />
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

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
            const isCurrentActive = idx === activeCardIndex;

            // When active, highlight the square and icon with matching opaque red border & glowing accent
            const cardBgStyle = isCurrentActive
              ? {
                  backgroundColor: 'rgba(239, 68, 68, 0.16)',
                  borderColor: '#ef4444',
                  boxShadow: '0 0 16px 2px rgba(239, 68, 68, 0.42), 0 4px 14px -3px rgba(239, 68, 68, 0.3)',
                }
              : {
                  backgroundColor: `rgba(${accentRgb}, 0.12)`,
                  borderColor: `rgba(${accentRgb}, 0.35)`,
                  boxShadow: `0 4px 14px -3px rgba(${accentRgb}, 0.25)`,
                };

            const innerArtBgStyle = isCurrentActive
              ? {
                  backgroundColor: 'rgba(239, 68, 68, 0.22)',
                  borderColor: '#ef4444',
                }
              : {
                  backgroundColor: `rgba(${accentRgb}, 0.16)`,
                  borderColor: `rgba(${accentRgb}, 0.40)`,
                };

            const accentTextStyle = isCurrentActive
              ? {
                  color: '#ef4444',
                }
              : {
                  color: `rgb(${accentRgb})`,
                };

            const hasCode = Boolean(offer.code && offer.code.trim().length > 0);

            return (
              <div
                id={`card-square-${idx}`}
                key={offer.id}
                onClick={() => {
                  onSelectOffer(offer);
                  setExpandedTipAppIdx(idx);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectOffer(offer);
                    setExpandedTipAppIdx(idx);
                  }
                }}
                style={cardBgStyle}
                className={`group relative flex flex-col justify-between select-none cursor-pointer rounded-xl p-2 sm:p-2.5 min-h-[162px] sm:min-h-[176px] md:min-h-[188px] transition-colors duration-75 border ${
                  isCurrentActive
                    ? 'border-2 border-red-500 ring-1 ring-red-500/60 brightness-110 z-10'
                    : 'border hover:-translate-y-0.5 hover:brightness-110'
                }`}
              >
                {/* 1. TOP ARTWORK / LOGO CONTAINER (Themed inner container) */}
                <div
                  style={innerArtBgStyle}
                  className={`w-full h-18 sm:h-22 md:h-24 rounded-lg border relative flex items-center justify-center overflow-hidden flex-shrink-0 transition-colors ${
                    isCurrentActive ? 'border-2 border-red-500 shadow-inner' : 'border'
                  }`}
                >
                  {/* Top-left: Sequential App Number (1 - 1000) - Tightly in corner, 1px border, off the logo */}
                  <div
                    style={{
                      borderColor: isCurrentActive ? '#ef4444' : `rgba(${accentRgb}, 0.5)`,
                    }}
                    className={`absolute top-0 left-0 z-20 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-tl-[7px] rounded-br-lg border-r border-b text-white text-xs sm:text-sm font-black shadow-xs flex items-center gap-0.5 backdrop-blur-md ${
                      isCurrentActive
                        ? 'bg-red-950/95 text-red-100'
                        : 'bg-[#0a0d17]/95'
                    }`}
                    title={`Rank #${rankNumber}`}
                  >
                    <span style={accentTextStyle} className="text-[10px] sm:text-xs font-black leading-none opacity-90">#</span>
                    <span className="font-mono tracking-tight leading-none">{rankNumber}</span>
                  </div>

                  {/* High-Resolution Referral Partner Logo - Padded and sized to never touch/overlap the corner badge */}
                  <div className="w-full h-full flex items-center justify-center p-1.5 pt-3.5 sm:pt-4">
                    {rawLogoSrc ? (
                      <img
                        src={rawLogoSrc}
                        alt={offer.name}
                        className="max-h-[88%] max-w-[76%] object-contain drop-shadow-md group-hover:scale-105 transition-transform"
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

                {/* 2. TEXT INFORMATION: Name + Bold Payout (Completely uniform & centered across all squares) */}
                <div className="flex flex-col w-full min-w-0 pt-2 pb-0.5 px-0.5 items-center text-center justify-center mt-auto">
                  {/* Offer Name */}
                  <h4 className="w-full truncate text-xs sm:text-[13px] md:text-sm font-bold text-white group-hover:underline transition-colors leading-tight text-center">
                    {offer.name}
                  </h4>

                  {/* Bold Payout ($ 336.60 style) - Centered and completely uniform */}
                  <div className="w-full flex items-center justify-center mt-1">
                    <span className="text-sm sm:text-base md:text-[17px] font-black text-white tracking-tight leading-none truncate text-center">
                      {formatPayoutDisplay(offer.payout, offer.rewardValue)}
                    </span>
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
