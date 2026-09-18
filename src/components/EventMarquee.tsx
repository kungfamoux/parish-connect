import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const EventMarquee = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const messages = [
    "🎉 Thanksgiving Mass: Msgr. Anthony Anijielo Anniversary - Nov 14, 2026 @ 10 AM",
    "🙏 Retirement, 75th Birthday & 46th Priestly Anniversary Celebration",
    "✨ Join us at St. Mary Parish, Trans-Ekulu, Enugu",
    "📞 Contact: Fr. Daniel Onah - 07030322956"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 5000); // Change message every 5 seconds

    return () => clearInterval(interval);
  }, [messages.length]);

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-parish-burgundy to-parish-burgundy/90 text-parish-cream py-3 overflow-hidden">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-1 hover:bg-parish-burgundy/80 rounded-full transition-colors"
        aria-label="Close marquee"
      >
        <X className="h-4 w-4 text-parish-cream" />
      </button>
      
      <div className="flex items-center justify-center">
        <motion.div
          key={currentMessageIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center px-8 font-display text-sm md:text-base font-medium"
        >
          {messages[currentMessageIndex]}
        </motion.div>
      </div>
    </div>
  );
};

export default EventMarquee;