import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GlowOrb } from "@/components/GlowOrb";
import { ArrowLeft, ArrowRight, Heart, User, MessageCircle, Sparkles } from "lucide-react";

export interface MemoryProfile {
  name: string;
  relationship: string;
  ageEnergy: string;
  gender: string;
  languages: string;
  voiceVibe: string;
  commonPhrases: string;
  personalityTraits: string;
  coreValues: string;
  sharedMemories: string;
  whatYouMiss: string;
}

const INITIAL_PROFILE: MemoryProfile = {
  name: "",
  relationship: "",
  ageEnergy: "",
  gender: "",
  languages: "",
  voiceVibe: "",
  commonPhrases: "",
  personalityTraits: "",
  coreValues: "",
  sharedMemories: "",
  whatYouMiss: "",
};

const steps = [
  {
    id: 1,
    title: "Who are we remembering?",
    icon: <User className="w-6 h-6" />,
    fields: ["name", "relationship", "ageEnergy", "gender"],
  },
  {
    id: 2,
    title: "How did they speak?",
    icon: <MessageCircle className="w-6 h-6" />,
    fields: ["languages", "voiceVibe", "commonPhrases"],
  },
  {
    id: 3,
    title: "Who were they?",
    icon: <Heart className="w-6 h-6" />,
    fields: ["personalityTraits", "coreValues"],
  },
  {
    id: 4,
    title: "Your shared story",
    icon: <Sparkles className="w-6 h-6" />,
    fields: ["sharedMemories", "whatYouMiss"],
  },
];

const fieldLabels: Record<keyof MemoryProfile, { label: string; placeholder: string; type: "input" | "textarea" }> = {
  name: { label: "Their name", placeholder: "What did you call them?", type: "input" },
  relationship: { label: "Your relationship", placeholder: "e.g., My grandmother, My best friend, My father", type: "input" },
  ageEnergy: { label: "Age or age energy", placeholder: "e.g., 65, or 'forever young at heart'", type: "input" },
  gender: { label: "Gender", placeholder: "e.g., She/Her, He/Him, They/Them", type: "input" },
  languages: { label: "Languages & expressions", placeholder: "e.g., Hindi, English, Hinglish... any slang they used?", type: "input" },
  voiceVibe: { label: "Voice & tone", placeholder: "e.g., Warm and soft, Playfully teasing, Calm and wise", type: "input" },
  commonPhrases: { label: "Things they often said", placeholder: "Phrases, greetings, pet names they used...", type: "textarea" },
  personalityTraits: { label: "Personality traits", placeholder: "Were they funny? Strict? Caring? Patient? Adventurous?", type: "textarea" },
  coreValues: { label: "What they believed in", placeholder: "Family first? Hard work? Kindness? Faith? Education?", type: "textarea" },
  sharedMemories: { label: "Memories you cherish", placeholder: "Tell us about moments you shared together...", type: "textarea" },
  whatYouMiss: { label: "What you miss most", placeholder: "Their laugh? Their advice? Sunday mornings together?", type: "textarea" },
};

const CreateProfile = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<MemoryProfile>(INITIAL_PROFILE);
  const [direction, setDirection] = useState(1);

  const handleChange = (field: keyof MemoryProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    } else {
      // Save to sessionStorage and navigate to chat
      sessionStorage.setItem("memoryProfile", JSON.stringify(profile));
      navigate("/chat");
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  };

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const canProceed = step.fields.every(field => profile[field as keyof MemoryProfile].trim() !== "");

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <GlowOrb className="top-20 -left-32" size="lg" delay={0} />
      <GlowOrb className="bottom-20 -right-32" size="md" delay={1} />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        {/* Back to home */}
        <Button
          variant="echo-ghost"
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Home
        </Button>

        {/* Progress indicator */}
        <div className="flex gap-2 mb-8">
          {steps.map((s, i) => (
            <div
              key={s.id}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                i <= currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {/* Step header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-primary">
                {step.icon}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Step {step.id} of {steps.length}</p>
                <h2 className="font-serif text-2xl">{step.title}</h2>
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-6">
              {step.fields.map((field) => {
                const fieldConfig = fieldLabels[field as keyof MemoryProfile];
                return (
                  <div key={field} className="space-y-2">
                    <label className="text-sm text-foreground/80">{fieldConfig.label}</label>
                    {fieldConfig.type === "input" ? (
                      <Input
                        variant="echo"
                        value={profile[field as keyof MemoryProfile]}
                        onChange={(e) => handleChange(field as keyof MemoryProfile, e.target.value)}
                        placeholder={fieldConfig.placeholder}
                      />
                    ) : (
                      <Textarea
                        variant="echo"
                        value={profile[field as keyof MemoryProfile]}
                        onChange={(e) => handleChange(field as keyof MemoryProfile, e.target.value)}
                        placeholder={fieldConfig.placeholder}
                        rows={4}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-10">
          <Button
            variant="echo-outline"
            onClick={prevStep}
            disabled={isFirstStep}
            className={isFirstStep ? "invisible" : ""}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            variant="echo"
            onClick={nextStep}
            disabled={!canProceed}
          >
            {isLastStep ? (
              <>
                <Heart className="w-4 h-4 mr-2" />
                Begin Conversation
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
