import { motion } from "framer-motion";

interface GlowOrbProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  delay?: number;
}

const sizeClasses = {
  sm: "w-32 h-32",
  md: "w-64 h-64",
  lg: "w-96 h-96",
};

export const GlowOrb = ({ className = "", size = "md", delay = 0 }: GlowOrbProps) => {
  return (
    <motion.div
      className={`absolute rounded-full bg-gradient-to-br from-primary/20 via-echo-candle/10 to-transparent blur-3xl ${sizeClasses[size]} ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: [0.3, 0.6, 0.3],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
};
