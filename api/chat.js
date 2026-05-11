export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { message, history = [] } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  
  const lowerMsg = message.toLowerCase();
  
  // Smart response generation
  let reply = '';
  
  if (lowerMsg.includes('bitcoin') && (lowerMsg.includes('price') || lowerMsg.includes('chart') || lowerMsg.includes('value') || lowerMsg.includes('buy'))) {
    reply = "Bitcoin (BTC) is currently showing consolidation above key support at $51,200. The RSI is near 55 indicating neutral momentum. Next resistance lies at $54,800. \n\n**Technical levels:**\n- Support: $50,200 / $48,500\n- Resistance: $54,800 / $56,300\n\n[[CHART:bitcoin]]\n\n⚠️ *Disclaimer: This is not financial advice. Cryptocurrency markets are highly volatile.*";
  } 
  else if (lowerMsg.includes('ethereum') && (lowerMsg.includes('price') || lowerMsg.includes('chart'))) {
    reply = "Ethereum (ETH) is trading within a symmetrical triangle pattern. Breakout above $3,350 could target $3,600. The Base network growth is positively impacting ETH gas economics.\n\n**Key metrics:**\n- Current support: $3,100\n- Resistance: $3,350 → $3,600\n\n[[CHART:ethereum]]\n\n*Always do your own research before trading.*";
  }
  else if (lowerMsg.includes('solana') && (lowerMsg.includes('price') || lowerMsg.includes('chart'))) {
    reply = "Solana (SOL) continues to show strength with increasing daily active addresses. The current price is testing the 50-day EMA.\n\n[[CHART:solana]]\n\n⚠️ *Volatility expected around network upgrade dates.*";
  }
  else if (lowerMsg.includes('base network') || lowerMsg.includes('base ecosystem')) {
    reply = "🔵 **Base Network Analysis**\n\nBase (Coinbase's L2) has reached $2.8B Total Value Locked.\n\n**Top protocols to watch:**\n- **Aerodrome Finance** — Leading DEX on Base\n- **Uniswap v3** — High liquidity pools\n- **Morpho Blue** — Efficient lending\n\n**Risk notes:**\n✓ Bridge funds via official Base bridge only\n✓ Start with small amounts for yield farming\n✓ Check smart contract audits before providing liquidity\n\n*Not financial advice. DYOR thoroughly.*";
  }
  else if (lowerMsg.includes('defi') || lowerMsg.includes('yield')) {
    reply = "🏦 **DeFi Yield Opportunities (April 2026)**\n\n| Protocol | Asset | APY | Risk |\n|----------|-------|-----|------|\n| Aave | USDC | 4.8% | Low |\n| Compound | DAI | 3.9% | Low |\n| Uniswap | ETH/USDC | 18-25% | Medium |\n| Aerodrome | Base/ETH | 32% | High |\n\n⚠️ **Important risks:**\n- Impermanent loss on LP positions\n- Smart contract vulnerabilities\n- Protocol governance changes\n\n*Never invest more than 5-10% of your portfolio in high-yield DeFi.*";
  }
  else if (lowerMsg.includes('scam') || lowerMsg.includes('protect') || lowerMsg.includes('security')) {
    reply = "🛡️ **Crypto Security Checklist**\n\n**Do ✅**\n- Store seed phrases offline (paper/metal)\n- Use hardware wallets for >$5k\n- Enable 2FA with authenticator app\n- Revoke token approvals monthly via revoke.cash\n\n**Don't ❌**\n- Share seed phrases with ANYONE\n- Click unknown Discord/Telegram DMs\n- Connect wallet to unverified dApps\n- Trust 'giveaway' or 'free mint' links\n\n*80% of hacks happen due to human error. Stay vigilant!*";
  }
  else if (lowerMsg.includes('altcoin') || lowerMsg.includes('season')) {
    reply = "📈 **Altcoin Season Indicators**\n\nCurrent altcoin season score: **52/100** (neutral)\n\n**What to watch:**\n1. BTC dominance below 48% → alt season begins\n2. ETH/BTC pair breaking resistance\n3. Layer-2 tokens (ARB, OP, MATIC) leading gains\n\n**Strategy for alt season:**\n- Scale into positions, don't FOMO\n- Take profits at 30-50% gains\n- Keep 40% in stables for dips\n\n⚠️ *Altcoins are 3-5x more volatile than Bitcoin.*";
  }
  else if (lowerMsg.includes('nft')) {
    reply = "🖼️ **NFT Market Outlook 2026**\n\n**Trends:**\n- Utility NFTs (gaming, access passes) outperforming PFP\n- Ethereum L2 and Base gaining NFT volume\n- Royalty enforcement improving\n\n**Top collections by floor price:**\n- Pudgy Penguins: 11.2 ETH\n- BAYC: 9.8 ETH\n- Azuki: 4.5 ETH\n\n*NFT liquidity remains lower than 2021 peaks — trade with caution.*";
  }
  else if (lowerMsg.includes('portfolio') || lowerMsg.includes('management')) {
    reply = "📊 **Portfolio Allocation Framework**\n\n**Conservative (Low Risk):**\n- 60% BTC + ETH\n- 30% Stables (earning yield)\n- 10% Top 10 altcoins\n\n**Moderate (Medium Risk):**\n- 40% BTC\n- 30% ETH\n- 20% Large-cap alts (SOL, AVAX, LINK)\n- 10% DeFi/L2 tokens\n\n**Aggressive (High Risk):**\n- 25% BTC\n- 25% ETH\n- 30% Mid-cap alts\n- 20% Small-cap / Meme\n\n⚠️ *Rebalance monthly. Never risk money you can't lose.*";
  }
  else if (lowerMsg.includes('risk') || lowerMsg.includes('management') && !lowerMsg.includes('portfolio')) {
    reply = "⚠️ **Risk Management Principles**\n\n**Golden rules:**\n1. **Position sizing** — Max 2-5% per trade\n2. **Stop losses** — Always set at 5-10%\n3. **Risk/Reward** — Minimum 1:2 ratio\n4. **Leverage** — Avoid >3x (or skip leverage entirely)\n\n**Portfolio risk limits:**\n- Crypto max: 10-30% of net worth\n- Each altcoin max: 5% of crypto portfolio\n\n*Risk management separates surviving traders from liquidated ones.*";
  }
  else {
    reply = "Thanks for your question! 🔮\n\nI can help you with:\n- **Price analysis** (Bitcoin, Ethereum, Solana, etc.)\n- **Base network & DeFi** strategies\n- **Technical indicators** (RSI, MACD, Support/Resistance)\n- **Risk management & security** tips\n- **Portfolio allocation** frameworks\n\nTry asking:\n- *\"Bitcoin price prediction\"*\n- *\"How to yield farm on Base\"*\n- *\"RSI oversold means what?\"*\n- *\"Altcoin season guide\"*\n\n⚠️ *All content is for educational purposes — never financial advice.*";
  }
  
  return res.status(200).json({ reply });
}
