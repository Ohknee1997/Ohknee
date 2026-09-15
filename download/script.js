/**
 * OHKNEE REWARD ARSENAL - COMPLETE STANDALONE SCRIPT (JAVASCRIPT)
 * Vanilla JavaScript (No dependencies required)
 */

(function () {
  'use strict';

  // Master Arsenal Dataset
  const CARDS_DATA = [
    // --- Fast Easy Money ($100-$150) ---
    {
      id: 'fast-freecash',
      name: 'Freecash',
      domain: 'freecash.com',
      payout: '$15 ($30–$230 Bonus)',
      payoutTag: 'FREE START',
      code: 'AMJJ6',
      signupUrl: 'https://freecash.com/r/AMJJ6',
      signupLabel: 'SIGN UP',
      tabId: 'fast-easy-money',
      orderNumber: 1,
      showStarsTopper: true,
      note: 'Enter referral code "AMJJ6" on signup (sign up, download any random game and open it for 2 minutes) to unlock bonus spins and instant withdrawals to PayPal or Crypto.',
      images: [
        'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80'
      ]
    },
    {
      id: 'fast-stake',
      name: 'Stake.us',
      domain: 'stake.us',
      payout: '$100–$150 Fast',
      payoutTag: 'INSTANT',
      signupUrl: 'https://stake.us/?c=20ae01b862',
      signupLabel: 'SIGN UP',
      tabId: 'fast-easy-money',
      orderNumber: 2,
      showStarsTopper: true,
      note: 'Stake.us daily reload & level-up bonus strategy. (Do Freecash before Stake.us! There\'s an offer for 30 extra and 200 extra!) Log in daily to claim free SC.',
      images: [
        'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1605870445919-838d190e8e1b?w=600&auto=format&fit=crop&q=80'
      ]
    },
    {
      id: 'fast-gemsloot',
      name: 'Gemsloot',
      domain: 'gemsloot.com',
      payout: '$35 Bonus',
      payoutTag: 'FREE START',
      code: 'ohknee',
      signupUrl: 'https://gemsloot.com/?aff=ohknee',
      signupLabel: 'SIGN UP',
      tabId: 'fast-easy-money',
      orderNumber: 3,
      showStarsTopper: true,
      note: 'Use code "ohknee" during registration. Complete the starter offerwall tasks and spin the daily reward wheel for instant withdrawals.',
      images: [
        'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&auto=format&fit=crop&q=80'
      ]
    },
    {
      id: 'fast-polymarket',
      name: 'Polymarket',
      domain: 'polymarket.com',
      payout: '$60 Bonus',
      payoutTag: 'TOP SQUAD',
      code: 'MOPEYDINGO1343',
      signupUrl: 'https://polymarket.us/squad/join/GHnKEKR4w2METrhVrP26?referrer=mopeydingo1343',
      signupLabel: 'SIGN UP',
      tabId: 'fast-easy-money',
      orderNumber: 4,
      showStarsTopper: true,
      note: 'Join my squad on Polymarket. Use code MOPEYDINGO1343 when signing up for $60.',
      images: [
        'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80'
      ]
    },
    {
      id: 'fast-draftkings',
      name: 'DraftKings',
      domain: 'draftkings.com',
      payout: '$200 Bonus',
      payoutTag: 'POPULAR',
      signupUrl: 'https://sportsbook.draftkings.com/r/sb/eamaya97/US-TX-SA/US-TX',
      signupLabel: 'SIGN UP',
      tabId: 'fast-easy-money',
      orderNumber: 5,
      showStarsTopper: true,
      note: 'Sign up and make predictions on sports & events with fast $200 bonus cashouts.',
      images: [
        'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&auto=format&fit=crop&q=80'
      ]
    },
    {
      id: 'fast-kalshi',
      name: 'Kalshi',
      domain: 'kalshi.com',
      payout: '$25 Bonus',
      payoutTag: 'TOP PICK',
      signupUrl: 'https://kalshi.com/sign-up/?referral=18cd159f-1a05-4412-9368-43ecd3d21187&m=true',
      signupLabel: 'SIGN UP',
      tabId: 'fast-easy-money',
      orderNumber: 5,
      showStarsTopper: true,
      note: 'Regulated prediction marketplace. Trade event contracts on real-world news and markets for a $25 bonus!',
      images: [
        'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80'
      ]
    },
    {
      id: 'fast-ero',
      name: 'Ero',
      domain: 'ero.app',
      payout: '$25 Bonus',
      payoutTag: 'INSTANT CASH',
      code: 'uoj7nba2x5',
      signupUrl: 'https://ero.app/r/uoj7nba2x5?link=u63qfmappxxh',
      signupLabel: 'SIGN UP',
      tabId: 'fast-easy-money',
      orderNumber: 6,
      showStarsTopper: true,
      note: 'Earn real cash rewards completing brand missions and testing apps with a 50% day-one boost. Enter code uoj7nba2x5.',
      images: [
        'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80'
      ]
    },
    {
      id: 'fast-coinbase',
      name: 'Coinbase',
      domain: 'coinbase.com',
      payout: '$30 Bonus',
      payoutTag: 'EASY FAST',
      code: 'R6Z6SB3',
      signupUrl: 'https://coinbase.com/join/R6Z6SB3?src=android-link',
      signupLabel: 'SIGN UP',
      tabId: 'fast-easy-money',
      orderNumber: 7,
      showStarsTopper: true,
      note: 'Buy $25 USDC or trade crypto to get $30 bonus! (Do Freecash first! Freecash offer for additional $30!) Also take quizzes for bonus crypto.',
      images: [
        'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=600&auto=format&fit=crop&q=80'
      ]
    },
    {
      id: 'fast-onepay',
      name: 'OnePay',
      domain: 'onepay.com',
      payout: '$6 ~ $50 Bonus',
      payoutTag: 'INSTANT BONUS',
      code: 'a0pJVrI0m',
      signupUrl: 'https://web.onepay.com/wlink/refer-a-friend?product=one_banking&referral_code=a0pJVrI0m&referrer_campaign_id=campaign.db1edd0a-4a5b-4651-8c20-d0fb7e98fec5',
      signupLabel: 'SIGN UP',
      tabId: 'fast-easy-money',
      orderNumber: 8,
      showStarsTopper: true,
      note: 'Deposit and verify ID to unlock welcome bonus using referral code a0pJVrI0m directly to your OnePay mobile banking account.'
    },
    {
      id: 'fast-goodwall',
      name: 'Goodwall',
      domain: 'goodwall.io',
      payout: '$5–$25 Rewards',
      payoutTag: 'REWARD BOOST',
      signupUrl: 'https://goodwall.onelink.me/45N9/cazsnfmp',
      signupLabel: 'SIGN UP',
      tabId: 'fast-easy-money',
      orderNumber: 9,
      showStarsTopper: true,
      note: 'Complete skill missions and social challenges to unlock cash and rewards.'
    },
    {
      id: 'cash-back-vinted',
      name: 'Vinted',
      domain: 'vinted.com',
      payout: '$15–$30 Credits',
      payoutTag: 'INVITE BONUS',
      code: 'ohknee97',
      signupUrl: 'https://www.vinted.com/invite/ohknee97',
      signupLabel: 'SIGN UP',
      tabId: 'fast-easy-money',
      orderNumber: 10,
      showStarsTopper: true,
      note: 'Buy and sell secondhand clothes with invite voucher bonus credits.'
    },
    {
      id: 'fast-sendwave',
      name: 'Sendwave',
      domain: 'sendwave.com',
      payout: '$10 Credit',
      payoutTag: 'TRANSFER CREDIT',
      code: '1ADY9',
      signupUrl: 'https://try.sendwave.com/kjap/alct9oam',
      signupLabel: 'SIGN UP',
      tabId: 'fast-easy-money',
      orderNumber: 11,
      showStarsTopper: true,
      note: 'Use code 1ADY9 to get a credit towards your first transfer! Download at https://try.sendwave.com/kjap/alct9oam'
    },

    // --- Casino Codes ---
    {
      id: '30',
      name: 'Zula Casino',
      domain: 'zulacasino.com',
      payout: '$10 Free SC',
      payoutTag: 'DAILY BONUS',
      signupUrl: 'https://www.zulacasino.com/signup/d04ec73e-fd45-482d-8355-7048698f7d89',
      signupLabel: 'SIGN UP',
      tabId: 'casino-codes',
      note: 'Claim $10 free Sweeps Coins upon phone verification + daily login bonuses.'
    },
    {
      id: '19',
      name: 'Real Prize',
      domain: 'realprize.com',
      payout: 'Free SC Package',
      payoutTag: 'NEW CASINO',
      signupUrl: 'https://realprize.com/refer/2615334',
      signupLabel: 'SIGN UP',
      tabId: 'casino-codes',
      note: 'Top rated sweeps casino with fast redemptions directly to bank account.'
    },
    {
      id: '13',
      name: 'Modo Casino',
      domain: 'modo.us',
      payout: 'Free Daily SC',
      payoutTag: 'TOP TIER',
      code: '7UFM7O',
      signupUrl: 'https://modo.us?referralCode=7UFM7O',
      signupLabel: 'SIGN UP',
      tabId: 'casino-codes',
      note: 'Code: 7UFM7O. Streak reward system gives escalating daily bonus up to 1 SC per day.'
    },
    {
      id: '11',
      name: 'Luck Party',
      domain: 'luckparty.com',
      payout: 'Welcome Match',
      payoutTag: 'CASINO BONUS',
      signupUrl: 'https://luckparty.com/signup/4fe04bf8-d210-4143-bc98-178a7a0dfa80',
      signupLabel: 'SIGN UP',
      tabId: 'casino-codes',
      note: 'Instant sweeps reload bonus for active players.'
    },
    {
      id: '15',
      name: 'MyPrize US',
      domain: 'myprize.us',
      payout: 'Multiplayer Casino',
      payoutTag: 'HOT',
      code: 'ONIAMAYA',
      signupUrl: 'https://myprize.us/invite/ONIAMAYA',
      signupLabel: 'SIGN UP',
      tabId: 'casino-codes',
      note: 'Referral code: ONIAMAYA. Play multiplayer sweeps casino tables with streamers and friends.'
    },
    {
      id: '10',
      name: 'Lonestar',
      domain: 'lonestar.com',
      payout: 'Free SC Coins',
      payoutTag: 'VERIFIED',
      signupUrl: 'https://lonestarcasino.com/refer/1589659',
      signupLabel: 'SIGN UP',
      tabId: 'casino-codes',
      note: 'Sign up through referral link for enhanced starter balance.'
    },
    {
      id: '4',
      name: 'Crown Coins',
      domain: 'crowncoinscasino.com',
      payout: 'Free Crown Coins',
      payoutTag: 'INSTANT BONUS',
      signupUrl: 'https://crowncoinscasino.com/?utm_campaign=f2828b01-a3b2-4575-8b47-08b95afe3c5e&utm_source=friends',
      signupLabel: 'SIGN UP',
      tabId: 'casino-codes',
      note: 'Daily login rewards and fast sweepstakes spins.'
    },

    // --- Literal Free Money ---
    {
      id: 'free-debbie',
      name: 'Debbie',
      domain: 'joindebbie.com',
      payout: '$20 Bonus',
      payoutTag: 'FREE START',
      code: '2EMIC9801',
      signupUrl: 'https://joindebbie.com/?ref_id=2EMIC9801',
      signupLabel: 'SIGN UP',
      tabId: 'free-money',
      note: 'Debt payoff and savings rewards app with $20 bonus. (Do the SoFi offer first!)'
    },
    {
      id: 'free-myfreeapp',
      name: 'MyFreeApp',
      domain: 'myfreeapp.io',
      payout: '$9 Bonus',
      payoutTag: 'FREE START',
      code: 'JCEHNRER',
      signupUrl: 'https://www.myfreeapp.io?referral_code=JCEHNRER',
      signupLabel: 'SIGN UP',
      tabId: 'free-money',
      note: 'Earn real cash testing apps and playing games with referral code JCEHNRER.'
    },
    {
      id: 'free-fetch',
      name: 'Fetch',
      domain: 'fetch.com',
      payout: '$3 Bonus',
      payoutTag: 'FREE START',
      code: 'K1K9U6',
      signupUrl: 'https://referral.fetch.com/vvv3/referralqr?code=K1K9U6',
      signupLabel: 'SIGN UP',
      tabId: 'free-money',
      note: 'Snap your first receipt and enter code K1K9U6 for bonus reward points.'
    },
    {
      id: 'free-kraken',
      name: 'Kraken',
      domain: 'kraken.com',
      payout: '$75 Bonus',
      payoutTag: 'TRADE REWARD',
      signupUrl: 'https://invite.kraken.com/JDNW/wsv48yot',
      signupLabel: 'SIGN UP',
      tabId: 'free-money',
      note: 'Sign up and trade crypto to unlock up to $75 in rewards.'
    },
    {
      id: 'free-joko',
      name: 'Joko',
      domain: 'joko.com',
      payout: '$5 Bonus',
      payoutTag: 'FREE START',
      signupUrl: 'https://hellojoko.app.link/tyX38HoTyP',
      signupLabel: 'SIGN UP',
      tabId: 'free-money',
      note: 'Automatic shopping cashback and discounts with $5 welcome reward.'
    },
    {
      id: 'free-gate',
      name: 'Gate.io',
      domain: 'us.gate.com',
      payout: '$5 Bonus',
      payoutTag: 'REWARDS HUB',
      code: 'VQRBVFHFVG',
      signupUrl: 'https://us.gate.com/rewards_hub?ch=RewardsHub&ref=VQRBVFHFVG&ref_type=145',
      signupLabel: 'SIGN UP',
      tabId: 'free-money',
      note: 'Crypto trading rewards hub bonus with promo code VQRBVFHFVG.'
    },
    {
      id: 'free-uphold',
      name: 'Uphold',
      domain: 'uphold.com',
      payout: '$20 Bonus',
      payoutTag: 'CRYPTO WALLET',
      signupUrl: 'https://wallet.uphold.com/signup?referral=6647f8bac0&campaign=uw_p_d_w_acq_raf&utm_source=raf&utm_medium=referafriend',
      signupLabel: 'SIGN UP',
      tabId: 'free-money',
      note: 'Multi-asset trading wallet bonus. (Freecash offer for an additional $40!)'
    },
    {
      id: 'free-giraffe',
      name: 'Cash Giraffe',
      domain: 'cashgiraffe.online',
      payout: '$4 Bonus',
      payoutTag: 'PLAY & EARN',
      signupUrl: 'https://cashgiraffe.online/invite/TfPcqzqg',
      signupLabel: 'SIGN UP',
      tabId: 'free-money',
      note: 'Play Android games and collect gems redeemable for instant PayPal cash.'
    },
    {
      id: 'free-benjamin',
      name: 'Benjamin',
      domain: 'benjaminone.com',
      payout: '$1 Bonus',
      payoutTag: 'DAILY CASHBACK',
      signupUrl: 'https://benjaminone.onelink.me/J580/5sf18auk',
      signupLabel: 'SIGN UP',
      tabId: 'free-money',
      note: 'Get daily cash back on card purchases and gift card boosts.'
    },
    {
      id: 'free-qmee',
      name: 'Qmee',
      domain: 'qmee.com',
      payout: '$1 Instant',
      payoutTag: 'NO MINIMUM',
      signupUrl: 'https://www.qmee.com/dashboard',
      signupLabel: 'SIGN UP',
      tabId: 'free-money',
      note: 'Instant cashout survey and search rewards platform with no minimum withdrawal.'
    },
    {
      id: 'free-attapoll',
      name: 'AttaPoll',
      domain: 'attapoll.app',
      payout: '$0.50 Bonus',
      payoutTag: 'SURVEY BONUS',
      code: 'ysmwy',
      signupUrl: 'https://attapoll.app/join/ysmwy',
      signupLabel: 'SIGN UP',
      tabId: 'free-money',
      note: 'Paid mobile surveys with instant cashout thresholds. Use code ysmwy.'
    },
    {
      id: 'free-upside',
      name: 'Upside',
      domain: 'upside.com',
      payout: '40¢/gal Bonus',
      payoutTag: 'GAS CASHBACK',
      code: 'ONI9733',
      signupUrl: 'https://upside.app.link/ONI9733',
      signupLabel: 'SIGN UP',
      tabId: 'free-money',
      note: 'Get up to 40¢/gal cash back on gas and dining with promo code ONI9733.'
    },
    {
      id: 'free-gomining',
      name: 'GoMining',
      domain: 'gomining.com',
      payout: '$5 Bonus',
      payoutTag: 'MINING REWARDS',
      code: 'OMO0LDP',
      signupUrl: 'https://gomining.com/?ref=OMO0LDP',
      signupLabel: 'SIGN UP',
      tabId: 'free-money',
      note: 'Digital Bitcoin mining liquid hash-rate rewards. (Depends on how you set it up and what coin you choose).'
    },

    // --- Referrals / Signup / Bonuses ---
    {
      id: 'ref-dabble',
      name: 'Dabble',
      domain: 'dabble.com',
      payout: '$10 Free Entry',
      payoutTag: 'FREE START',
      signupUrl: 'https://click.dabble.com/GaFA/3mz3pmcr',
      signupLabel: 'SIGN UP',
      tabId: 'referrals',
      note: 'Get $10 free entry cash for DFS and player picks, no deposit required!'
    },
    {
      id: 'ref-prizepicks',
      name: 'PrizePicks',
      domain: 'prizepicks.com',
      payout: '$25 Bonus',
      payoutTag: 'DEPOSIT MATCH',
      signupUrl: 'https://prizepicks.onelink.me/FjtC/oh2itiyc',
      signupLabel: 'SIGN UP',
      tabId: 'referrals',
      note: 'Daily fantasy sports player props with instant $25 bonus entry credit.'
    },
    {
      id: 'ref-ero',
      name: 'Ero',
      domain: 'ero.app',
      payout: '$25 Bonus',
      payoutTag: 'FREE START',
      code: 'uoj7nba2x5',
      signupUrl: 'https://ero.app/r/uoj7nba2x5?link=u63qfmappxxh',
      signupLabel: 'SIGN UP',
      tabId: 'referrals',
      note: 'Earn real cash rewards completing brand missions and testing apps with a 50% day-one boost. Enter code uoj7nba2x5.'
    },
    {
      id: 'ref-robinhood',
      name: 'Robinhood',
      domain: 'robinhood.com',
      payout: '$7–$30 Free Stock',
      payoutTag: 'FREE STOCK',
      signupUrl: 'https://join.robinhood.com/onia2',
      signupLabel: 'SIGN UP',
      tabId: 'referrals',
      note: 'Sign up and link your bank account to receive free stock valued between $7 and $30.'
    },
    {
      id: 'ref-sofi',
      name: 'SoFi Bank',
      domain: 'sofi.com',
      payout: '$13 Bonus',
      payoutTag: 'BANK BONUS',
      signupUrl: 'https://www.sofi.com/invite/relay?gcp=66005484-b2ad-44f8-8c3d-92a5d2bd3adb&isAliasGcp=false',
      signupLabel: 'SIGN UP',
      tabId: 'referrals',
      note: 'Get started with SoFi banking & financial rewards with exclusive invite reward.'
    },
    {
      id: 'ref-chime',
      name: 'Chime',
      domain: 'chime.com',
      payout: '$100 Bonus',
      payoutTag: 'CASH BONUS',
      signupUrl: 'https://www.chime.com/r/oniamaya/?c=s',
      signupLabel: 'SIGN UP',
      tabId: 'referrals',
      note: 'Set up direct deposit and deposit $200 or more in 14 days or less to get $100 cash bonus!'
    },
    {
      id: 'ref-aven',
      name: 'Aven',
      domain: 'aven.com',
      payout: '$5 Bonus',
      payoutTag: 'FREE START',
      code: 'OA25YEFBGX',
      signupUrl: 'https://aven.com/advisor',
      signupLabel: 'SIGN UP',
      tabId: 'referrals',
      note: 'MUST ENTER REFERRAL CODE OA25YEFBGX to unlock $5 bonus credit!'
    },
    {
      id: 'ref-self',
      name: 'Self Credit Builder',
      domain: 'self.inc',
      payout: '$20 Bonus',
      payoutTag: 'CREDIT BUILDER',
      code: 'FI4EZ0Y8',
      signupUrl: 'https://self.inc/refer/FI4EZ0Y8',
      signupLabel: 'SIGN UP',
      tabId: 'referrals',
      note: 'Build credit and savings with a Self Credit Builder Account using referral code FI4EZ0Y8.'
    },
    {
      id: 'ref-koinly',
      name: 'Koinly',
      domain: 'koinly.io',
      payout: '$25 Credit',
      payoutTag: 'PORTFOLIO BONUS',
      code: 'A6A33D50',
      signupUrl: 'https://koinly.io/?via=A6A33D50&utm_source=friend',
      signupLabel: 'SIGN UP',
      tabId: 'referrals',
      note: 'Track crypto portfolios and calculate taxes across exchanges with referral credit.'
    },
    {
      id: 'ref-paypal',
      name: 'PayPal',
      domain: 'paypal.com',
      payout: '$10 Cash Bonus',
      payoutTag: 'CASH BONUS',
      signupUrl: 'https://py.pl/26zAwV',
      signupLabel: 'SIGN UP',
      tabId: 'referrals',
      note: 'Send or spend $5 and receive a $10 bonus reward directly to your PayPal account.'
    },
    {
      id: 'ref-sezzle',
      name: 'Sezzle',
      domain: 'sezzle.com',
      payout: '$10 Credit',
      payoutTag: 'SPEND CREDIT',
      signupUrl: 'https://szzl.io/89uvs2',
      signupLabel: 'SIGN UP',
      tabId: 'referrals',
      note: 'Buy now pay later with $10 in bonus spend credits on signup.'
    },
    {
      id: 'ref-copper',
      name: 'Copper',
      domain: 'cpr.gg',
      payout: '$3 Bonus',
      payoutTag: 'REWARD BONUS',
      signupUrl: 'https://cpr.gg/r/ZLPTIZ',
      signupLabel: 'SIGN UP',
      tabId: 'referrals',
      note: 'Banking, rewards, and financial literacy app bonus.'
    },
    {
      id: 'ref-acorns',
      name: 'Acorns',
      domain: 'acorns.com',
      payout: '$20 Bonus',
      payoutTag: 'INVEST BONUS',
      code: 'RI20',
      signupUrl: 'https://signup.acorns.com/?s1=impactradius&s4=recurinvest20&promo_code=RI20&clickid=0::zjLSJ6xycWc30-i16YTNuUkpSYgREvzTtUo0&irgwc=1&afsrc=1&iradtype=TEXT_LINK&irmpname=Fluent%20-%20Acorns&s2=1411014&s1=impactradius&sharedid=34631_816992&s4=recurinvest20&email=oniamaya25%40gmail.com',
      signupLabel: 'SIGN UP',
      tabId: 'referrals',
      note: 'Automated micro-investing and roundups with $20 recurring investment bonus.'
    },
    {
      id: 'ref-cashapp',
      name: 'Cash App',
      domain: 'cash.app',
      payout: '$5 Bonus',
      payoutTag: 'INSTANT $5',
      code: 'B7X7MPD',
      signupUrl: 'https://cash.app/app/B7X7MPD',
      signupLabel: 'SIGN UP',
      tabId: 'referrals',
      note: 'Send $5 to a friend to receive your instant $5 welcome bonus using code B7X7MPD.'
    },
    {
      id: 'ref-yell',
      name: 'Yell Payment',
      domain: 'yellpayment.com',
      payout: '$5 Bonus',
      payoutTag: 'INVITE CREDIT',
      code: '26845623',
      signupUrl: 'https://api-b2c.yellpayment.com/referral?code=26845623',
      signupLabel: 'SIGN UP',
      tabId: 'referrals',
      note: 'Payment and money transfer rewards with referral code 26845623.'
    },
    {
      id: 'ref-go2bank',
      name: 'GO2bank',
      domain: 'go2bank.com',
      payout: '$50 Bonus',
      payoutTag: 'DIRECT DEPOSIT',
      code: 'Oni15',
      signupUrl: 'https://share.go2bank.com/Oni15',
      signupLabel: 'SIGN UP',
      tabId: 'referrals',
      note: 'Direct deposit at least $200 within 45 days to get $50 cash bonus!'
    },
    {
      id: 'ref-public',
      name: 'Public',
      domain: 'public.com',
      payout: '$100 Bonus',
      payoutTag: 'HIGH BONUS',
      code: 'Oni78253',
      signupUrl: 'https://share.public.com/Oni78253',
      signupLabel: 'SIGN UP',
      tabId: 'referrals',
      note: 'Invest in stocks, ETFs, crypto and high-yield treasuries. Deposit $1,000 for $100 bonus!'
    },
    {
      id: 'ref-xplace',
      name: 'x.place',
      domain: 'x.place',
      payout: 'Crypto Airdrop',
      payoutTag: 'INVITE PASS',
      code: 'Ohknee29',
      signupUrl: 'https://x.place/ref/Ohknee29',
      signupLabel: 'SIGN UP',
      tabId: 'referrals',
      note: 'Discover web3 quests and earn tokens with referral code Ohknee29.'
    },
    {
      id: 'ref-polymarket',
      name: 'Polymarket',
      domain: 'polymarket.com',
      payout: '$60 Bonus',
      payoutTag: 'FREE START',
      code: 'MOPEYDINGO1343',
      signupUrl: 'https://polymarket.us/squad/join/GHnKEKR4w2METrhVrP26?referrer=mopeydingo1343',
      signupLabel: 'SIGN UP',
      tabId: 'referrals',
      note: 'Join my squad on Polymarket. Use code MOPEYDINGO1343 when signing up for $60.'
    },
    {
      id: 'ref-draftkings',
      name: 'DraftKings Predictions',
      domain: 'draftkings.com',
      payout: '$200 Bonus',
      payoutTag: 'FREE START',
      signupUrl: 'https://sportsbook.draftkings.com/r/sb/eamaya97/US-TX-SA/US-TX',
      signupLabel: 'SIGN UP',
      tabId: 'referrals',
      note: 'Sign up and make predictions on sports & events with fast $200 bonus cashouts.'
    },
    {
      id: 'ref-sendwave',
      name: 'Sendwave',
      domain: 'sendwave.com',
      payout: '$10 Credit',
      payoutTag: 'TRANSFER CREDIT',
      code: '1ADY9',
      signupUrl: 'https://try.sendwave.com/kjap/alct9oam',
      signupLabel: 'SIGN UP',
      tabId: 'referrals',
      note: 'Use code 1ADY9 to get a credit towards your first transfer! Download at https://try.sendwave.com/kjap/alct9oam'
    }
  ];

  let currentTab = 'fast-easy-money';
  let activeDrawerId = null;

  // DOM Elements
  const gridEl = document.getElementById('cards-grid');
  const tabsNav = document.getElementById('site-navigation');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const toastEl = document.getElementById('toast');

  // Helper: Show Toast
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('is-show');
    setTimeout(() => {
      toastEl.classList.remove('is-show');
    }, 2500);
  }

  // Helper: Copy to Clipboard
  function copyCode(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('Copied: ' + text);
      }).catch(() => {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    showToast('Copied: ' + text);
  }

  // Render Cards for Active Tab
  function renderCards() {
    if (!gridEl) return;
    gridEl.innerHTML = '';

    const tabCards = CARDS_DATA.filter((c) => c.tabId === currentTab);
    tabCards.sort((a, b) => (a.orderNumber || 999) - (b.orderNumber || 999));

    tabCards.forEach((card) => {
      // Create Card Item
      const cardEl = document.createElement('div');
      cardEl.className = 'card' + (activeDrawerId === card.id ? ' is-expanded' : '');
      cardEl.id = 'card-' + card.id;

      // Stars Topper
      let starsHtml = '';
      if (card.showStarsTopper) {
        starsHtml = `
          <div class="stars-topper" title="5 Star Top Pick">
            <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
        `;
      }

      // Rank Badge
      let rankHtml = '';
      if (card.orderNumber) {
        rankHtml = `<div class="rank-badge">#${card.orderNumber}</div>`;
      }

      // Logo or Avatar
      const logoUrl = card.domain ? `https://logo.clearbit.com/${card.domain}` : '';
      const initials = card.name ? card.name.substring(0, 2).toUpperCase() : 'OK';

      // Promo Code Row
      let codeRowHtml = '';
      if (card.code) {
        codeRowHtml = `
          <div class="code-row">
            <span class="code-key">CODE:</span>
            <span class="code-value">${card.code}</span>
            <button class="code-copy" type="button" data-code="${card.code}">COPY</button>
          </div>
        `;
      }

      cardEl.innerHTML = `
        ${rankHtml}
        <div class="card-top">
          ${starsHtml}
          <div class="logo-tile">
            <img src="${logoUrl}" alt="${card.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
            <div class="avatar" style="display:none;">${initials}</div>
          </div>
          <div class="card-meta">
            <div class="card-name" title="${card.name}">${card.name}</div>
          </div>
          <div class="payout">
            <div class="payout-amt">${card.payout || '$100+ Free'}</div>
            <span class="payout-tag">${card.payoutTag || 'VERIFIED'}</span>
          </div>
          ${codeRowHtml}
        </div>
        <div class="card-cta">
          <div class="card-cta-row">
            <a href="${card.signupUrl}" target="_blank" rel="noopener noreferrer" class="signup-btn">${card.signupLabel || 'SIGN UP'}</a>
            <button type="button" class="secret-btn" data-card-id="${card.id}">SECRET SAUCE</button>
          </div>
        </div>
      `;

      // Event listeners on card
      cardEl.querySelector('.secret-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDrawer(card.id);
      });

      const copyBtn = cardEl.querySelector('.code-copy');
      if (copyBtn) {
        copyBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          copyCode(copyBtn.getAttribute('data-code'));
        });
      }

      gridEl.appendChild(cardEl);

      // If this card is active, render its Secret Sauce Drawer inline
      if (activeDrawerId === card.id) {
        const drawerEl = createDrawerElement(card);
        gridEl.appendChild(drawerEl);
      }
    });
  }

  // Create Secret Sauce Drawer Element
  function createDrawerElement(card) {
    const drawer = document.createElement('div');
    drawer.className = 'ohk-drawer';
    drawer.id = 'drawer-' + card.id;

    // Gallery of Proof Images
    let galleryHtml = '';
    if (card.images && card.images.length > 0) {
      const imgItems = card.images
        .map(
          (imgUrl) => `
          <div class="ohk-drawer-img" data-img-src="${imgUrl}">
            <img src="${imgUrl}" alt="Proof Note" />
          </div>
        `
        )
        .join('');
      galleryHtml = `
        <div style="margin-top: 14px;">
          <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-dim); margin-bottom: 6px;">Proof Pictures & Guide Notes:</div>
          <div class="ohk-drawer-gallery">${imgItems}</div>
        </div>
      `;
    }

    drawer.innerHTML = `
      <button class="ohk-drawer-close" type="button">&times;</button>
      <div class="ohk-drawer-title">${card.name} - Secret Sauce Strategy</div>
      <div class="ohk-drawer-sub">Pro Guide & Step-by-Step Profit Walkthrough</div>
      <div class="ohk-drawer-note">${card.note || 'Follow the sign-up link, complete instant verification, and apply promotional codes for full bonus allocation.'}</div>
      ${galleryHtml}
      <div style="margin-top: 18px; display: flex; justify-content: flex-end; gap: 8px;">
        <a href="${card.signupUrl}" target="_blank" rel="noopener noreferrer" class="signup-btn" style="min-width: 140px; text-align: center;">VISIT ${card.name.toUpperCase()}</a>
      </div>
    `;

    // Close Button
    drawer.querySelector('.ohk-drawer-close').addEventListener('click', () => {
      closeDrawer();
    });

    // Gallery Image Lightbox Clicks
    drawer.querySelectorAll('.ohk-drawer-img').forEach((el) => {
      el.addEventListener('click', () => {
        const src = el.getAttribute('data-img-src');
        openLightbox(src);
      });
    });

    return drawer;
  }

  // Toggle Drawer
  function toggleDrawer(cardId) {
    if (activeDrawerId === cardId) {
      closeDrawer();
    } else {
      activeDrawerId = cardId;
      if (drawerBackdrop) drawerBackdrop.classList.add('is-open');
      renderCards();
      const el = document.getElementById('drawer-' + cardId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }

  function closeDrawer() {
    activeDrawerId = null;
    if (drawerBackdrop) drawerBackdrop.classList.remove('is-open');
    renderCards();
  }

  // Lightbox
  function openLightbox(src) {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxModal.classList.add('is-open');
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('is-open');
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  // Tab Switching
  if (tabsNav) {
    tabsNav.addEventListener('click', (e) => {
      const btn = e.target.closest('.tab');
      if (!btn) return;
      const tabId = btn.getAttribute('data-tab');
      if (!tabId || tabId === currentTab) return;

      currentTab = tabId;
      activeDrawerId = null;
      if (drawerBackdrop) drawerBackdrop.classList.remove('is-open');

      // Update active class on tab buttons
      tabsNav.querySelectorAll('.tab').forEach((t) => {
        const isActive = t.getAttribute('data-tab') === currentTab;
        t.classList.toggle('is-active', isActive);
        t.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      renderCards();
    });
  }

  // Initial render on load
  document.addEventListener('DOMContentLoaded', () => {
    renderCards();
  });

  // Render immediately if DOM already loaded
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    renderCards();
  }
})();
