import React from 'react';
import { motion } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Coins, ArrowUpRight } from 'lucide-react';
import { useBrand } from './BrandContext';

const TokenCard = () => {
  const { brandInfo } = useBrand();

  return (
    <div className={`bg-gradient-to-r ${brandInfo.primaryColor} m-4 rounded-xl shadow-lg`}>
      <div className="flex items-center justify-between m-4">
        <div className="flex items-center gap-2">
          <Coins className="w-6 h-6 text-white" />
          <h2 className="text-lg font-bold text-white">Available Tokens</h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1 text-white/80 hover:text-white text-sm"
        >
          Buy More <ArrowUpRight className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 backdrop-blur-xl p-4 rounded-lg border border-white/20">
          <div className="text-white/70 text-sm mb-1">Daily Tokens</div>
          <div className="text-2xl font-bold text-white">100/100</div>
          <div className="text-white/50 text-xs mt-1">Resets in 24h</div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl p-4 rounded-lg border border-white/20">
          <div className="text-white/70 text-sm mb-1">Total Balance</div>
          <div className="text-2xl font-bold text-white">1,000</div>
          <div className="text-white/50 text-xs mt-1">
            <ConnectButton />
          </div>
        </div>
      </div>

      <div className="mt-4 bg-white/10 backdrop-blur-xl p-3 rounded-lg border border-white/20">
        <div className="flex items-center justify-between">
          <div className="text-white/70 text-sm">Usage Today</div>
          <div className="text-white text-sm font-medium">45/100</div>
        </div>
        <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '45%' }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full bg-gradient-to-r ${brandInfo.secondaryColor}`}
          />
        </div>
      </div>
    </div>
  );
};

export default TokenCard;