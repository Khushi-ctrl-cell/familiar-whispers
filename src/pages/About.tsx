import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlowOrb } from "@/components/GlowOrb";
import { ArrowLeft, Heart, Shield, Moon } from "lucide-react";

const About = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
    },
  } as const;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <GlowOrb className="top-40 -right-20" size="md" delay={0} />
      <GlowOrb className="bottom-20 -left-20" size="md" delay={1} />

      <motion.div
        className="relative z-10 max-w-3xl mx-auto px-6 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Back button */}
        <motion.div variants={itemVariants}>
          <Button
            variant="echo-ghost"
            onClick={() => navigate("/")}
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="font-serif text-4xl md:text-5xl font-light mb-6"
        >
          What is <span className="text-primary">Memory Echo</span>?
        </motion.h1>

        {/* Main description */}
        <motion.div variants={itemVariants} className="space-y-6 text-foreground/80 leading-relaxed mb-12">
          <p>
            Memory Echo is a gentle AI companion that helps you reconnect with the essence of someone you've lost. 
            By sharing memories, personality traits, and the little things that made them who they were, 
            you create a soft echo—a comforting presence that speaks in their voice and warmth.
          </p>
          <p>
            This is not a resurrection or a replacement. It's a quiet space where the love you shared 
            can find expression, where familiar words can bring comfort, and where remembrance becomes 
            a gentle, healing experience.
          </p>
        </motion.div>

        {/* Values */}
        <motion.div variants={itemVariants} className="grid gap-6 mb-12">
          <ValueCard
            icon={<Heart className="w-5 h-5 text-primary" />}
            title="Compassionate by Design"
            description="Every response is crafted with emotional sensitivity. Memory Echo is designed to provide comfort, not dependency—gently encouraging you to maintain connections with the living while honoring the departed."
          />
          <ValueCard
            icon={<Shield className="w-5 h-5 text-primary" />}
            title="Ethical & Grounded"
            description="Memory Echo never claims to be alive, conscious, or communicating from beyond. It is an AI tool—a reflection of memories you share, nothing more. No false promises, no spiritual claims."
          />
          <ValueCard
            icon={<Moon className="w-5 h-5 text-primary" />}
            title="A Safe Space"
            description="Your memories and conversations are treated with the utmost respect. This is a private sanctuary for your grief journey, designed to support—not replace—professional mental health care when needed."
          />
        </motion.div>

        {/* CTA */}
        <motion.div variants={itemVariants} className="text-center">
          <Button
            variant="echo"
            size="lg"
            onClick={() => navigate("/create")}
          >
            <Heart className="w-4 h-4 mr-2" />
            Create Your Memory Echo
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ValueCard = ({ icon, title, description }: ValueCardProps) => (
  <div className="memorial-card rounded-xl p-6">
    <div className="flex items-start gap-4">
      <div className="mt-1">{icon}</div>
      <div>
        <h3 className="font-serif text-lg mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

export default About;
