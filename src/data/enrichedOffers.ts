import { CardData } from '../types';
import {
  INITIAL_FAST_EASY_CARDS,
  INITIAL_CASINO_CARDS,
  INITIAL_FREE_MONEY_CARDS,
  INITIAL_REFERRAL_CARDS,
} from './offersData';

export interface EnrichedOffer extends CardData {
  categories: Array<
    | 'fast-easy'
    | 'featured'
    | 'bonuses-promos'
    | 'sports-betting'
    | 'sports'
    | 'betting'
    | 'banking'
    | 'crypto'
    | 'finance'
    | 'signup-trial'
    | 'puzzles'
    | 'sweepstakes'
    | 'casino'
    | 'play-to-earn'
    | 'other'
  >;
  platforms: Array<'desktop' | 'android' | 'apple'>;
  rewardDisplay: string;
  rewardValue: number; // For sorting
  badgeType?: 'HOT' | 'FAST' | 'NEW' | 'POPULAR' | 'TOP PICK' | 'INSTANT' | 'DAILY' | 'SIGNUP';
  badgeColor?: string;
  isFeatured?: boolean;
  descriptionText?: string;
  ratingValue?: number;
}

// Helper to extract a numeric dollar value for sorting
function parseNumericReward(payout?: string): number {
  if (!payout) return 5;
  const match = payout.match(/\$?(\d+(\.\d+)?)/);
  if (match && match[1]) {
    return parseFloat(match[1]);
  }
  if (payout.toLowerCase().includes('free') || payout.toLowerCase().includes('sc')) {
    return 10;
  }
  return 5;
}

// Helper to assign categories and platforms to existing cards
export function enrichCard(card: CardData): EnrichedOffer {
  const categories: EnrichedOffer['categories'] = [];
  const platforms: Array<'desktop' | 'android' | 'apple'> = ['desktop', 'android', 'apple'];

  let badgeType: EnrichedOffer['badgeType'] = undefined;
  let isFeatured = false;
  let descriptionText = card.instructionSub || '';

  const id = card.id.toLowerCase();
  const name = card.name.toLowerCase();
  const tabId = card.tabId;

  // 1. FAST & EASY CATEGORY
  if (tabId === 'fast-easy-money') {
    categories.push('fast-easy');
    categories.push('featured');
    isFeatured = true;
    badgeType = 'FAST';
    if (card.orderNumber === 1 || card.orderNumber === 2) {
      badgeType = 'TOP PICK';
    } else if (card.orderNumber === 3) {
      badgeType = 'INSTANT';
    }
  }

  // 2. CASINO BONUSES & PROMOS / SWEEPSTAKES
  if (tabId === 'casino-codes') {
    categories.push('sweepstakes');
    categories.push('bonuses-promos');
    if (['30', '19', '13', '4', '9', '1'].includes(card.id)) {
      // Zula, Real Prize, Modo, Crown Coins, High 5, Chanced
      isFeatured = true;
      categories.push('featured');
      badgeType = 'HOT';
    } else if (card.payoutTag?.includes('DAILY') || card.payout?.toLowerCase().includes('daily')) {
      badgeType = 'DAILY';
    } else {
      badgeType = 'POPULAR';
    }

    // Some casinos fit puzzle/casual slots/wheel categories
    if (
      name.includes('wheel') ||
      name.includes('hearts') ||
      name.includes('wizard') ||
      name.includes('baba') ||
      name.includes('city')
    ) {
      categories.push('puzzles');
    }
  }

  // 3. SPORTS BETTING
  if (
    name.includes('dabble') ||
    name.includes('underdog') ||
    name.includes('prizepicks') ||
    name.includes('sportzino') ||
    name.includes('fliff') ||
    name.includes('sleeper') ||
    name.includes('betting') ||
    name.includes('draftkings') ||
    name.includes('fanduel') ||
    id.includes('sports')
  ) {
    categories.push('sports-betting');
    categories.push('play-to-earn');
    isFeatured = true;
    categories.push('featured');
    if (!badgeType) badgeType = 'HOT';
  }

  // 4. BANKING APPS & SERVICES
  if (
    name.includes('sofi') ||
    name.includes('onepay') ||
    name.includes('aven') ||
    name.includes('sendwave') ||
    id.includes('banking')
  ) {
    categories.push('banking');
    categories.push('finance');
    if (name.includes('sofi')) {
      isFeatured = true;
      categories.push('featured');
      badgeType = 'TOP PICK';
    }
  }

  // 5. CRYPTO
  if (
    name.includes('coinbase') ||
    name.includes('kraken') ||
    name.includes('bydfi') ||
    name.includes('koinly') ||
    name.includes('gemini') ||
    name.includes('webull') ||
    name.includes('crypto') ||
    id.includes('crypto')
  ) {
    categories.push('crypto');
    categories.push('finance');
    if (name.includes('coinbase')) {
      isFeatured = true;
      categories.push('featured');
      badgeType = 'TOP PICK';
    }
  }

  // 6. FINANCE (Ava, MoneyLion, Debbie, Self, Robinhood, Kalshi, etc.)
  if (
    name.includes('ava') ||
    name.includes('moneylion') ||
    name.includes('debbie') ||
    name.includes('self') ||
    name.includes('robinhood') ||
    name.includes('kalshi') ||
    id.includes('finance')
  ) {
    if (!categories.includes('finance')) {
      categories.push('finance');
    }
    if (name.includes('kalshi') || name.includes('moneylion')) {
      isFeatured = true;
      categories.push('featured');
      badgeType = 'HOT';
    }
  }

  // 7. SIGN UP TRIAL & CASHBACK
  if (
    id.includes('cash-back') ||
    id.includes('instant-cash') ||
    name.includes('metawin') ||
    name.includes('debbie') ||
    name.includes('myappfree') ||
    name.includes('fetch') ||
    name.includes('joko') ||
    name.includes('shopback') ||
    name.includes('snaplii') ||
    name.includes('franki')
  ) {
    categories.push('signup-trial');
    if (!badgeType) badgeType = 'SIGNUP';
  }

  // 5. PLAY TO EARN & GAMING REWARDS
  if (
    name.includes('freecash') ||
    name.includes('gems loot') ||
    name.includes('dabble') ||
    name.includes('underdog') ||
    name.includes('prizepicks') ||
    name.includes('sportzino') ||
    name.includes('coin wizard') ||
    name.includes('myappfree')
  ) {
    categories.push('play-to-earn');
    if (name.includes('freecash') || name.includes('gems loot')) {
      isFeatured = true;
      badgeType = 'HOT';
    }
  }

  // Fallback category if none matched
  if (categories.length === 0) {
    categories.push('other');
  }

  // Compute clean display reward
  let rewardDisplay = card.payout || '$25 Bonus';
  if (card.payout?.includes('$')) {
    rewardDisplay = card.payout;
  } else if (card.payoutTag) {
    rewardDisplay = `${card.payoutTag} ${card.payout ? `• ${card.payout}` : ''}`;
  }

  // If specific description is not set, provide helpful copy
  if (!descriptionText) {
    if (card.code) {
      descriptionText = `Claim exclusive bonus with promo code ${card.code}. Verified link and instant activation.`;
    } else if (tabId === 'casino-codes') {
      descriptionText = `Free sweeps coins, daily login rewards, and instant redemption to bank or crypto.`;
    } else {
      descriptionText = `Sign up through OHKNEE.COM to claim the highest verified bonus reward.`;
    }
  }

  return {
    ...card,
    categories,
    platforms,
    rewardDisplay,
    rewardValue: parseNumericReward(card.payout),
    badgeType: badgeType || 'POPULAR',
    isFeatured,
    descriptionText,
    ratingValue: card.rating || 5,
  };
}

// Master collection of all live offers in database
export function getAllEnrichedOffers(): EnrichedOffer[] {
  const allRawCards: CardData[] = [
    ...INITIAL_FAST_EASY_CARDS,
    ...INITIAL_CASINO_CARDS,
    ...INITIAL_FREE_MONEY_CARDS,
    ...INITIAL_REFERRAL_CARDS,
  ];

  return allRawCards.map(enrichCard);
}
