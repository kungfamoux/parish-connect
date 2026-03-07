import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Calendar, Users, Heart, BookOpen, Church, Settings } from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";

type FilterType = "all" | "mass" | "baptism" | "marriage" | "catechism" | "meetings" | "vespers";

const scheduleData = [
  // Sunday Masses
  { type: "mass" as const, day: "Sunday", time: "6:00 AM", language: "Igbo", note: "1st Mass (Adult)", icon: Church },
  { type: "mass" as const, day: "Sunday", time: "8:00 AM", language: "Igbo", note: "2nd Mass (Adult & Children)", icon: Church },
  { type: "mass" as const, day: "Sunday", time: "10:00 AM", language: "English/Latin", note: "3rd Mass (Adult)", icon: Church },
  { type: "mass" as const, day: "Sunday", time: "6:00 PM", language: "English", note: "4th Mass (Adult)", icon: Church },
  
  // Vespers/Benediction
  { type: "vespers" as const, day: "Sunday", time: "5:00 PM - 6:00 PM", language: "", note: "Vespers & Benediction", icon: Clock },
  
  // Weekday Morning Masses
  { type: "mass" as const, day: "Monday, Tuesday, Thursday", time: "6:00 AM", language: "Igbo", note: "Morning Mass", icon: Church },
  { type: "mass" as const, day: "Wednesday, Friday", time: "6:00 AM", language: "English", note: "Morning Mass", icon: Church },
  { type: "mass" as const, day: "Saturday", time: "6:00 AM", language: "Latin", note: "Morning Mass", icon: Church },
  
  // Weekday Evening Masses
  { type: "mass" as const, day: "Monday, Tuesday, Thursday", time: "6:00 PM", language: "English", note: "Evening Mass", icon: Church },
  { type: "mass" as const, day: "Wednesday, Friday", time: "6:00 PM", language: "Igbo", note: "Evening Mass", icon: Church },
  
  // Marriage Course
  { type: "marriage" as const, day: "Tuesday, Thursday", time: "4:00 PM - 6:00 PM", language: "", note: "Marriage Course", icon: Heart },
  { type: "marriage" as const, day: "Sunday", time: "6:30 PM - 8:00 PM", language: "", note: "Marriage Course", icon: Heart },
  
  // Infant Baptism
  { type: "baptism" as const, day: "1st & 3rd Saturday", time: "4:00 PM", language: "", note: "Infant Baptism", icon: Heart },
  { type: "baptism" as const, day: "Tuesday", time: "8:00 AM - 1:00 PM", language: "", note: "Baptism Registration", icon: Settings },
  { type: "baptism" as const, day: "Wednesday", time: "4:00 PM - 6:00 PM", language: "", note: "Baptism Registration", icon: Settings },
  
  // Catechism Classes
  { type: "catechism" as const, day: "Sunday Evening", time: "3:00 PM - 5:00 PM", language: "", note: "Catechism Classes", icon: BookOpen },
  { type: "catechism" as const, day: "Tuesday, Thursday", time: "4:00 PM - 6:00 PM", language: "", note: "Catechism Classes", icon: BookOpen },
  
  // Parish Council Meetings
  { type: "meetings" as const, day: "1st Tuesday", time: "7:00 PM - 9:00 PM", language: "", note: "Parish Pastoral Council Meeting", icon: Users },
  { type: "meetings" as const, day: "2nd Tuesday", time: "7:30 PM - 9:00 PM", language: "", note: "Zonal Meeting", icon: Users },
  { type: "meetings" as const, day: "Last Friday", time: "6:30 PM - 9:00 PM", language: "", note: "Finance Committee Meeting", icon: Users },
];

const filterLabels: Record<FilterType, string> = {
  all: "All",
  mass: "Holy Mass",
  vespers: "Vespers",
  baptism: "Baptism",
  marriage: "Marriage",
  catechism: "Catechism",
  meetings: "Meetings",
};

const filterIcons: Record<FilterType, any> = {
  all: Calendar,
  mass: Church,
  vespers: Clock,
  baptism: Heart,
  marriage: Heart,
  catechism: BookOpen,
  meetings: Users,
};

const typeColors: Record<string, string> = {
  mass: "bg-gradient-to-r from-parish-burgundy/20 to-parish-burgundy/10 border-parish-burgundy/30 text-parish-burgundy",
  vespers: "bg-gradient-to-r from-purple-500/20 to-purple-500/10 border-purple-500/30 text-purple-700",
  baptism: "bg-gradient-to-r from-blue-500/20 to-blue-500/10 border-blue-500/30 text-blue-700",
  marriage: "bg-gradient-to-r from-pink-500/20 to-pink-500/10 border-pink-500/30 text-pink-700",
  catechism: "bg-gradient-to-r from-green-500/20 to-green-500/10 border-green-500/30 text-green-700",
  meetings: "bg-gradient-to-r from-orange-500/20 to-orange-500/10 border-orange-500/30 text-orange-700",
};

const iconColors: Record<string, string> = {
  mass: "text-parish-burgundy",
  vespers: "text-purple-600",
  baptism: "text-blue-600",
  marriage: "text-pink-600",
  catechism: "text-green-600",
  meetings: "text-orange-600",
};

const MassSchedule = () => {
  const [filter, setFilter] = useState<FilterType>("all");
  const filtered = filter === "all" ? scheduleData : scheduleData.filter((s) => s.type === filter);

  return (
    <Layout>
      <section className="py-24 bg-gradient-to-br from-parish-cream via-background to-parish-warm">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <SectionHeading 
            subtitle="Worship With Us" 
            title="Mass & Sacrament Schedule" 
            description="Join us for prayer, worship, and community activities throughout the week." 
          />

          {/* Enhanced Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {Object.entries(filterLabels).map(([key, label]) => {
              const Icon = filterIcons[key as FilterType];
              return (
                <button
                  key={key}
                  onClick={() => setFilter(key as FilterType)}
                  className={`group relative px-5 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                    filter === key 
                      ? "bg-gradient-to-r from-parish-burgundy to-parish-burgundy/80 text-white shadow-lg shadow-parish-burgundy/25" 
                      : "bg-white/80 backdrop-blur-sm text-parish-dark border border-parish-burgundy/20 hover:border-parish-burgundy/40 hover:bg-parish-burgundy/5"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${filter === key ? "text-white" : iconColors[key]}`} />
                    {label}
                  </span>
                  {filter === key && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-parish-burgundy to-parish-burgundy/80 -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Enhanced Schedule items */}
          <div className="space-y-4">
            {filtered.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={`${item.type}-${item.day}-${item.time}`}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.08, type: "spring", bounce: 0.3 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={`group relative overflow-hidden rounded-xl border ${typeColors[item.type]} bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Icon and Type Badge */}
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg bg-white/70 shadow-md ${iconColors[item.type]}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${typeColors[item.type]}`}>
                          {filterLabels[item.type]}
                        </span>
                        {item.language && (
                          <span className="text-xs text-accent font-medium mt-1">{item.language}</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading text-base font-bold text-foreground mb-1">{item.day}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.note}</p>
                    </div>
                    
                    {/* Time */}
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-2 text-foreground">
                        <Clock className="h-4 w-4 text-accent" />
                        <span className="font-bold text-lg">{item.time}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Enhanced Special Notes Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-16 bg-gradient-to-r from-parish-burgundy via-parish-burgundy/90 to-parish-burgundy/80 rounded-2xl p-8 border border-parish-burgundy/30 shadow-2xl shadow-parish-burgundy/20"
          >
            <div className="text-center mb-6">
              <h3 className="font-heading text-2xl font-bold text-white mb-2">Important Information</h3>
              <p className="text-parish-cream/90 font-display">Please take note of the following details</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Children's Mass is specially designed for families with young children",
                "Please register for infant baptism at the parish office during designated times",
                "Marriage course attendance is required for all couples preparing for marriage",
                "Catechism classes are available for children, teens, and adults",
                "All parishioners are welcome to attend pastoral council meetings"
              ].map((note, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-parish-gold mt-2 flex-shrink-0" />
                  <p className="text-sm text-parish-cream/95 leading-relaxed">{note}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default MassSchedule;
