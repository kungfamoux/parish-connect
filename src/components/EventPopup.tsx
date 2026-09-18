import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, MapPin, Church, Star } from "lucide-react";

const EventPopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if popup has been shown in this session
    const sessionShown = sessionStorage.getItem('anniversaryPopupShown');
    if (!sessionShown) {
      setIsVisible(true);
      sessionStorage.setItem('anniversaryPopupShown', 'true');
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            {/* Popup Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-parish-burgundy to-parish-burgundy/90 p-6 relative">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 hover:bg-parish-burgundy/80 rounded-full transition-colors"
                  aria-label="Close popup"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-full bg-white/20">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-accent text-accent-foreground mb-2">
                      Major Event
                    </span>
                    <h3 className="font-heading text-xl font-bold text-white">Thanksgiving Mass</h3>
                    <p className="text-parish-cream/90 font-display text-sm">Msgr. Anthony Anijielo Anniversary</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="font-heading text-lg font-semibold text-foreground mb-2">
                  Retirement, 75th Birthday & 46th Priestly Anniversary
                </p>
                <p className="text-muted-foreground font-display text-sm mb-4">
                  Join us as we celebrate three decades of dedicated service to God and our parish community.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-parish-cream/30 rounded-lg">
                    <Calendar className="h-4 w-4 text-parish-burgundy flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground">Saturday, November 14, 2026</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-parish-cream/30 rounded-lg">
                    <Clock className="h-4 w-4 text-parish-burgundy flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground">10:00 AM</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-parish-cream/30 rounded-lg">
                    <MapPin className="h-4 w-4 text-parish-burgundy flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground">St. Mary Parish, Trans-Ekulu, Enugu</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-parish-cream/30 rounded-lg">
                    <Church className="h-4 w-4 text-parish-burgundy flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground">Most Rev. Dr. C.V.C. Onaga (Chief Celebrant)</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link
                    to="/events"
                    onClick={handleClose}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-parish-burgundy text-white font-semibold text-sm hover:bg-parish-burgundy/90 transition-colors"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={handleClose}
                    className="px-6 py-3 rounded-lg border border-border text-foreground font-semibold text-sm hover:bg-muted transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EventPopup;