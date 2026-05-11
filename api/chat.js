// CryptoMind AI - Groq API Integration
// Environment Variable: GROQ_API_KEY (Vercel Dashboard এ সেট করুন)

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { message, history = [] } = req.body;
  
  if (!message || message.trim() === '') {
    return res.status(400).json({ error: 'Message is required' });
  }
  
  // 🔐 Get API key from environment variable (Vercel)
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  
  if (!GROQ_API_KEY) {
    console.error('❌ GROQ_API_KEY is not configured in Vercel environment variables');
    return res.status(200).json({ 
      reply: "⚠️ **API Key Missing**\n\nI'm not properly configured yet. Please add `GROQ_API_KEY` in Vercel Environment Variables.\n\n**Setup Instructions:**\n1. Go to Vercel Dashboard → Settings → Environment Variables\n2. Add key: `GROQ_API_KEY`\n3. Add value: Your Groq API key (get from [console.groq.com](https://console.groq.com))\n4. Redeploy the project\n\n*Until then, here's a crypto tip: Hardware wallets are the safest for long-term storage.* 🔒" 
    });
  }
  
  const lowerMsg = message.toLowerCase();
  
  // ⚡ Fast responses for common queries (saves API calls)
  const quickResponse = getQuickResponse(lowerMsg);
  if (quickResponse) {
    return res.status(200).json({ reply: quickResponse });
  }
  
  // 🤖 Call Groq API for complex analysis
  try {
    const systemPrompt = `You are CryptoMind AI — an expert cryptocurrency and blockchain analysis assistant.

CRITICAL RULES:
1. When user asks about PRICE, CHART, or VALUE of any cryptocurrency, you MUST include [[CHART:coin_id]] tag in your response.
2. Valid coin IDs for chart: bitcoin, ethereum, solana, binancecoin, ripple, dogecoin, cardano, avalanche-2, matic-network, chainlink
3. Example: "Bitcoin is trading at $52,000 [[CHART:bitcoin]]"
4. NEVER give financial advice — always include a risk disclaimer.
5. Reply in the SAME LANGUAGE as the user (Bengali, English, Spanish, etc.)
6. Use markdown: **bold**, bullet points, emojis for better readability.

Your expertise:
- Bitcoin, Ethereum, Altcoin technical & fundamental analysis
- Base network & Coinbase L2 ecosystem
- DeFi protocols (Uniswap, Aave, Compound, Aerodrome)
- NFT market trends
- Crypto security & scam prevention
- Portfolio management & risk strategies
- On-chain metrics and tokenomics

Always be helpful, accurate, and educational.`;
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 800,
        top_p: 0.9
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Groq API error:', data);
      throw new Error(data.error?.message || 'Groq API request failed');
    }
    
    const reply = data.choices[0].message.content;
    return res.status(200).json({ reply });
    
  } catch (error) {
    console.error('❌ Groq API error:', error.message);
    
    // Fallback response
    return res.status(200).json({ 
      reply: "⚠️ **Technical Issue**\n\nI'm having trouble connecting to my AI engine right now. Please try again in a moment.\n\n**Crypto Safety Reminder:** 🔒\n- Never share your seed phrase\n- Use 2FA on all exchange accounts\n- Verify URLs before connecting wallet\n\n*Try asking something simple like 'Bitcoin price' or 'What is DeFi?'*" 
    });
  }
}

// ⚡ Quick response mapper (doesn't call API)
function getQuickResponse(lowerMsg) {
  // Price queries
  if (lowerMsg.match(/bitcoin.*price|price.*bitcoin|btc price|bitcoin value|bitcoin chart/i)) {
    return "Bitcoin (BTC) is currently consolidating above key support at **$51,200**. RSI indicates neutral momentum at 54. Next resistance at **$54,800**.\n\n**Technical levels:**\n- Support: $50,200 | $48,500\n- Resistance: $54,800 | $56,300\n\n[[CHART:bitcoin]]\n\n⚠️ *Not financial advice. Markets are volatile.*";
  }
  
  if (lowerMsg.match(/ethereum.*price|price.*ethereum|eth price|ethereum chart|eth value/i)) {
    return "Ethereum (ETH) is trading in a symmetrical triangle pattern. Breakout above **$3,350** could target $3,600.\n\n**Key metrics:**\n- Support: $3,100 → $2,950\n- Resistance: $3,350 → $3,600\n- 24h volume: $12.4B\n\n[[CHART:ethereum]]\n\n⚠️ *Base network growth is positively impacting ETH gas economics.*";
  }
  
  if (lowerMsg.match(/solana.*price|price.*solana|sol price|solana chart/i)) {
    return "Solana (SOL) continues to show strength with **2.1M daily active addresses**. Price is testing the 50-day EMA.\n\n**Current metrics:**\n- TVL: $4.2B\n- Staking ratio: 72%\n\n[[CHART:solana]]\n\n⚠️ *Monitor network upgrade schedule for potential volatility.*";
  }
  
  // Base Network
  if (lowerMsg.includes('base network') || lowerMsg.includes('base ecosystem') || lowerMsg.includes('what is base')) {
    return "🔵 **Base Network Analysis**\n\nBase is Coinbase's Ethereum Layer-2 solution built on OP Stack.\n\n**Key Stats:**\n- TVL: **$2.8 Billion**\n- Daily transactions: 1.2M\n- Unique addresses: 8.5M+\n\n**Top protocols:**\n1. **Aerodrome Finance** — Leading DEX (30% of TVL)\n2. **Uniswap v3** — High liquidity pools\n3. **Morpho Blue** — Efficient lending market\n\n**Getting started:**\n→ Bridge ETH from Mainnet via [bridge.base.org](https://bridge.base.org)\n→ Start with small amounts ($50-100)\n→ Always verify contract addresses\n\n⚠️ *Base is still early — smart contract risks exist.*";
  }
  
  // DeFi
  if (lowerMsg.includes('defi') || (lowerMsg.includes('yield') && !lowerMsg.includes('portfolio'))) {
    return "🏦 **DeFi Yield Opportunities (April 2026)**\n\n| Protocol | Asset | APY Range | Risk Level |\n|----------|-------|-----------|------------|\n| Aave | USDC | 4-6% | 🟢 Low |\n| Compound | DAI | 3-5% | 🟢 Low |\n| Uniswap | ETH/USDC | 15-25% | 🟡 Medium |\n| Aerodrome | Base/ETH | 25-40% | 🔴 High |\n\n**Risk Management:**\n- Impermanent loss on LP positions\n- Smart contract vulnerabilities\n- Keep 50% in stable/low-risk\n\n*Never invest more than 10% of portfolio in high-yield DeFi.*";
  }
  
  // Security
  if (lowerMsg.includes('scam') || lowerMsg.includes('security') || lowerMsg.includes('protect') || lowerMsg.includes('hack')) {
    return "🛡️ **Crypto Security Checklist**\n\n**✓ DO these:**\n- Store seed phrases **offline** (paper/metal)\n- Use **hardware wallet** for >$5,000\n- Enable 2FA with **authenticator app** (not SMS)\n- Revoke token approvals monthly via [revoke.cash](https://revoke.cash)\n- Verify URLs before connecting wallet\n\n**✗ NEVER:**\n- Share seed phrases with ANYONE\n- Click unknown Discord/Telegram links\n- Connect wallet to unverified dApps\n- Trust 'giveaway' or 'free mint' promises\n- Respond to 'support' DMs\n\n**80% of hacks are due to human error. Stay vigilant!** 🔒";
  }
  
  // Altcoin season
  if (lowerMsg.includes('altcoin season') || lowerMsg.includes('alt season')) {
    return "📈 **Altcoin Season Indicator**\n\nCurrent score: **52/100** (Neutral Zone)\n\n**What to watch for entry:**\n1. BTC dominance drops below **48%**\n2. ETH/BTC pair breaks **0.055**\n3. L2 tokens (ARB, OP, MATIC) lead gains\n\n**Strategy during alt season:**\n- Scale in positions — don't FOMO\n- Take profits at **30-50%** gains\n- Keep **40% in stables** for dips\n- Rotate profits back to BTC/ETH\n\n⚠️ *Altcoins are 3-5x more volatile than Bitcoin.*";
  }
  
  // NFTs
  if (lowerMsg.includes('nft') && !lowerMsg.includes('scam')) {
    return "🖼️ **NFT Market Outlook 2026**\n\n**Current trends:**\n- Utility NFTs (gaming, access) outperforming PFP\n- Ethereum L2 & Base gaining volume\n- Royalty enforcement improving\n\n**Top collections by floor price:**\n| Collection | Floor | Volume (24h) |\n|------------|-------|--------------|\n| Pudgy Penguins | 11.2 ETH | 2,100 ETH |\n| Bored Ape | 9.8 ETH | 1,800 ETH |\n| Azuki | 4.5 ETH | 950 ETH |\n\n⚠️ *NFT liquidity is lower than 2021 peaks — trade with caution.*";
  }
  
  // Portfolio management
  if (lowerMsg.includes('portfolio') && (lowerMsg.includes('management') || lowerMsg.includes('allocation'))) {
    return "📊 **Portfolio Allocation Framework**\n\n**🟢 Conservative (Lower Risk):**\n- 60% BTC + ETH\n- 30% Stablecoins (earning 4-6%)\n- 10% Top 10 altcoins\n\n**🟡 Moderate (Medium Risk):**\n- 40% BTC\n- 30% ETH\n- 20% Large-cap alts (SOL, AVAX, LINK)\n- 10% DeFi/L2 tokens\n\n**🔴 Aggressive (Higher Risk):**\n- 25% BTC\n- 25% ETH\n- 30% Mid-cap alts\n- 20% Small-cap / Narrative plays\n\n**Golden rules:**\n→ Rebalance **monthly**\n→ Never risk money you can't lose\n→ Keep 20-30% cash for opportunities\n\n⚠️ *This is educational — not personalized advice.*";
  }
  
  // Risk management
  if (lowerMsg.includes('risk management') && !lowerMsg.includes('portfolio')) {
    return "⚠️ **Crypto Risk Management Principles**\n\n**Per-trade rules:**\n| Rule | Recommendation |\n|------|----------------|\n| Position Size | 2-5% of portfolio |\n| Stop Loss | 5-10% from entry |\n| Risk/Reward | Minimum 1:2 |\n| Leverage | 0-3x maximum |\n\n**Portfolio risk limits:**\n- Crypto max: **10-30%** of net worth\n- Each altcoin max: **5%** of crypto portfolio\n- Daily loss limit: **10%** of trading capital\n\n**The 3 Golden Rules:**\n1. Protect capital first, profits second\n2. Never revenge trade after a loss\n3. When in doubt — stay in cash\n\n*Risk management separates surviving traders from liquidated ones.* 🛡️";
  }
  
  // General crypto question
  if (lowerMsg.includes('what is crypto') || lowerMsg.includes('crypto for beginners')) {
    return "🔮 **Cryptocurrency 101**\n\n**What is Crypto?**\nDigital money secured by cryptography and decentralized networks.\n\n**Top 3 by market cap:**\n1. **Bitcoin (BTC)** — Digital gold, store of value\n2. **Ethereum (ETH)** — Smart contract platform\n3. **BNB** — Exchange ecosystem token\n\n**Getting started:**\n1. Learn basics (you're doing it! 📚)\n2. Start with BTC/ETH only\n3. Use reputable exchanges (Coinbase, Binance)\n4. Move to hardware wallet after $1,000+\n\n⚠️ *Only invest what you can afford to lose — start small!*";
  }
  
  return null; // No quick response found
}
