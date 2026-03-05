import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";

type FilterType = "all" | "mass" | "confession" | "baptism" | "marriage";

const scheduleData = [
  { type: "mass" as const, day: "Sunday", time: "6:00 AM", language: "Igbo", note: "First Mass" },
  { type: "mass" as const, day: "Sunday", time: "8:00 AM", language: "English", note: "Second Mass" },
  { type: "mass" as const, day: "Sunday", time: "10:00 AM", language: "English", note: "Third Mass" },
  { type: "mass" as const, day: "Monday – Friday", time: "6:30 AM", language: "English", note: "Morning Mass" },
  { type: "mass" as const, day: "Monday – Friday", time: "5:30 PM", language: "English", note: "Evening Mass" },
  { type: "mass" as const, day: "Saturday", time: "6:30 AM", language: "English", note: "Morning Mass" },
  { type: "mass" as const, day: "Saturday", time: "7:00 PM", language: "English", note: "Vigil Mass" },
  { type: "confession" as const, day: "Saturday", time: "5:00 – 6:30 PM", language: "", note: "Before Vigil Mass" },
  { type: "confession" as const, day: "Wednesday", time: "5:00 – 5:30 PM", language: "", note: "Before Evening Mass" },
  { type: "baptism" as const, day: "Every 2nd Sunday", time: "After 10:00 AM Mass", language: "", note: "Register at Parish Office" },
  { type: "baptism" as const, day: "Catechism Classes", time: "Saturday 3:00 PM", language: "", note: "Ages 7–12 / 13–17 / Adults" },
  { type: "marriage" as const, day: "By Appointment", time: "Contact Parish Office", language: "", note: "6 months preparation required" },
  { type: "marriage" as const, day: "Marriage Counseling", time: "Thursday 5:00 PM", language: "", note: "For engaged couples" },
];

const filterLabels: Record<FilterType, string> = {
  all: "All",
  mass: "Holy Mass",
  confession: "Confession",
  baptism: "Baptism & Catechism",
  marriage: "Marriage",
};

const typeColors: Record<string, string> = {
  mass: "bg-primary/10 text-primary",
  confession: "bg-accent/10 text-accent",
  baptism: "bg-secondary/30 text-secondary-foreground",
  marriage: "bg-destructive/10 text-destructive",
};

const MassSchedule = () => {
  const [filter, setFilter] = useState<FilterType>("all");
  const filtered = filter === "all" ? scheduleData : scheduleData.filter((s) => s.type === filter);

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <SectionHeading subtitle="Worship With Us" title="Mass & Sacrament Schedule" description="All are welcome to join us in the celebration of the Holy Eucharist and the Sacraments." />

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {Object.entries(filterLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key as FilterType)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Schedule items */}
          <div className="space-y-3">
            {filtered.map((item, i) => (
              <motion.div
                key={`${item.type}-${item.day}-${item.time}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-lg p-5 flex flex-col sm:flex-row sm:items-center gap-3"
              >
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shrink-0 ${typeColors[item.type]}`}>
                  {filterLabels[item.type]}
                </span>
                <div className="flex-1">
                  <p className="font-heading text-sm font-semibold text-foreground">{item.day}</p>
                  <p className="text-xs text-muted-foreground">{item.note}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{item.time}</p>
                  {item.language && <p className="text-xs text-accent">{item.language}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MassSchedule;
