import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlowOrb } from "@/components/GlowOrb";
import { CandleIcon } from "@/components/CandleIcon";
import { Heart, MessageCircle, Sparkles } from "lucide-react";
import candleHero from "@/assets/candle-hero.jpg";

const Landing = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
    },
  } as const;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${candleHero})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/70" />
      
      {/* Ambient background elements */}
      <GlowOrb className="top-20 -left-32" size="lg" delay={0} />
      <GlowOrb className="bottom-20 -right-32" size="lg" delay={2} />
      <GlowOrb className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" size="md" delay={1} />

      {/* Main content */}
      <motion.div
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Candle icon */}
        <motion.div variants={itemVariants} className="mb-8">
          <CandleIcon className="w-8" />
        </motion.div>

        {/* Logo / Title */}
        <motion.h1
          variants={itemVariants}
          className="font-serif text-5xl md:text-7xl font-light tracking-wide text-center mb-4 gradient-text"
        >
          Memory Echo
        </motion.h1>

        {/* Tagline */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-muted-foreground text-center max-w-lg mb-2 font-light"
        >
          A gentle space to remember, reflect, and find comfort
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="text-sm text-echo-whisper text-center max-w-md mb-12"
        >
          Share your memories, and speak with a soft echo of someone you love
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-16">
          <Button
            variant="echo"
            size="xl"
            onClick={() => navigate("/create")}
            className="group"
          >
            <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Begin Remembering
          </Button>
          <Button
            variant="echo-outline"
            size="xl"
            onClick={() => navigate("/about")}
          >
            Learn More
          </Button>
        </motion.div>

        {/* Features */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl"
        >
          <FeatureCard
            icon={<Heart className="w-6 h-6 text-primary" />}
            title="Preserve Memories"
            description="Capture the essence of who they were—their voice, their habits, their love"
          />
          <FeatureCard
            icon={<MessageCircle className="w-6 h-6 text-primary" />}
            title="Gentle Conversations"
            description="Experience a warm echo of familiar words and caring presence"
          />
          <FeatureCard
            icon={<Sparkles className="w-6 h-6 text-primary" />}
            title="Find Comfort"
            description="A safe space for remembrance, healing, and cherishing what remains"
          />
        </motion.div>

        {/* Footer note */}
        <motion.p
          variants={itemVariants}
          className="mt-16 text-xs text-echo-whisper text-center max-w-sm"
        >
          Memory Echo is a tool for remembrance and comfort. It is not a replacement for professional grief support.
        </motion.p>
      </motion.div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="memorial-card rounded-xl p-6 text-center hover:glow-soft transition-all duration-500">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="font-serif text-lg mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

export default Landing;
