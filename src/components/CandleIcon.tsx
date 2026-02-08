import { motion } from "framer-motion";

interface CandleIconProps {
  className?: string;
}

export const CandleIcon = ({ className = "" }: CandleIconProps) => {
  return (
    <div className={`relative ${className}`}>
      {/* Candle body */}
      <div className="w-4 h-16 bg-gradient-to-b from-foreground/20 to-foreground/10 rounded-sm mx-auto" />
      
      {/* Flame container */}
      <motion.div
        className="absolute -top-6 left-1/2 -translate-x-1/2"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.9, 1, 0.9],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Outer glow */}
        <div className="absolute w-8 h-8 bg-primary/30 rounded-full blur-md -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" />
        
        {/* Flame */}
        <svg width="16" height="24" viewBox="0 0 16 24" className="relative">
          <defs>
            <linearGradient id="flameGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="hsl(38, 90%, 60%)" />
              <stop offset="50%" stopColor="hsl(38, 80%, 70%)" />
              <stop offset="100%" stopColor="hsl(45, 100%, 90%)" />
            </linearGradient>
          </defs>
          <motion.path
            d="M8 0C8 0 2 8 2 14C2 18 5 22 8 24C11 22 14 18 14 14C14 8 8 0 8 0Z"
            fill="url(#flameGradient)"
            animate={{
              d: [
                "M8 0C8 0 2 8 2 14C2 18 5 22 8 24C11 22 14 18 14 14C14 8 8 0 8 0Z",
                "M8 0C8 0 3 9 3 14C3 18 5 22 8 24C11 22 13 18 13 14C13 9 8 0 8 0Z",
                "M8 0C8 0 2 8 2 14C2 18 5 22 8 24C11 22 14 18 14 14C14 8 8 0 8 0Z",
              ],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </svg>
      </motion.div>
    </div>
  );
};
