import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";

const events = [
  { title: "Lenten Retreat", date: "March 15, 2026", time: "9:00 AM – 4:00 PM", location: "Parish Hall", category: "Spiritual", description: "A day of prayer, reflection, and renewal as we journey through the Lenten season." },
  { title: "Youth Fellowship Night", date: "March 20, 2026", time: "5:00 – 8:00 PM", location: "Youth Centre", category: "Youth", description: "An evening of praise, worship, and fellowship for young adults aged 18–35." },
  { title: "Easter Vigil Mass", date: "April 4, 2026", time: "7:00 PM", location: "Main Church", category: "Liturgy", description: "The most solemn and beautiful celebration of the liturgical year." },
  { title: "Parish Bazaar", date: "April 18, 2026", time: "10:00 AM – 5:00 PM", location: "Church Grounds", category: "Community", description: "Annual fundraising bazaar with food, games, and entertainment for all ages." },
  { title: "CWO Harvest Thanksgiving", date: "May 10, 2026", time: "10:00 AM", location: "Main Church", category: "Special", description: "Catholic Women Organisation annual harvest and thanksgiving celebration." },
  { title: "Children's Day Celebration", date: "May 27, 2026", time: "9:00 AM", location: "Parish Grounds", category: "Youth", description: "Fun activities, games, and prizes for the children of the parish." },
];

const categories = ["All", "Spiritual", "Youth", "Liturgy", "Community", "Special"];

const Events = () => {
  const [cat, setCat] = useState("All");
  const filtered = cat === "All" ? events : events.filter((e) => e.category === cat);

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading subtitle="What's Happening" title="Parish Events" description="Stay connected with all activities and celebrations in our parish." />

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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filtered.map((e, i) => (
              <motion.div
                key={e.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-parish transition-shadow group"
              >
                <div className="p-6">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent mb-4">
                    {e.category}
                  </span>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{e.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{e.description}</p>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2"><Calendar className="h-3 w-3 text-accent" /> {e.date}</div>
                    <div className="flex items-center gap-2"><Clock className="h-3 w-3 text-accent" /> {e.time}</div>
                    <div className="flex items-center gap-2"><MapPin className="h-3 w-3 text-accent" /> {e.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Events;
