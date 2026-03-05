import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import heroImage from "@/assets/hero-church.jpg";
import aboutImage from "@/assets/about-church.jpg";
import communityImage from "@/assets/community-event.jpg";

const photos = [
  { src: heroImage, alt: "Church exterior at sunset", category: "Parish Life" },
  { src: aboutImage, alt: "Church interior and altar", category: "Parish Life" },
  { src: communityImage, alt: "Community gathering", category: "Events" },
  { src: heroImage, alt: "Sunday worship", category: "Parish Life" },
  { src: communityImage, alt: "Parish bazaar", category: "Events" },
  { src: aboutImage, alt: "Stained glass windows", category: "Historical" },
  { src: communityImage, alt: "Youth fellowship", category: "Events" },
  { src: heroImage, alt: "Palm Sunday procession", category: "Parish Life" },
  { src: aboutImage, alt: "First Holy Communion", category: "Historical" },
];

const categories = ["All", "Parish Life", "Events", "Historical"];

const Gallery = () => {
  const [cat, setCat] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const filtered = cat === "All" ? photos : photos.filter((p) => p.category === cat);

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading subtitle="Our Memories" title="Photo Gallery" description="A visual journey through life in our parish community." />

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  cat === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {filtered.map((p, i) => (
              <motion.div
                key={`${p.alt}-${i}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setLightbox(i)}
                className="aspect-square rounded-lg overflow-hidden cursor-pointer group"
              >
                <img
                  src={p.src}
                  alt={p.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
          >
            <button onClick={() => setLightbox(null)} className="absolute top-6 right-6 text-primary-foreground">
              <X className="h-8 w-8" />
            </button>
            <img
              src={filtered[lightbox]?.src}
              alt={filtered[lightbox]?.alt}
              className="max-w-full max-h-[85vh] rounded-lg object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Gallery;
