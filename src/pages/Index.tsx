import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, Heart, ArrowRight, BookOpen, Users, Church } from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import heroImage from "@/assets/hero section.jpg";
import communityImage from "@/assets/inside the church view 1.jpg";

const slides = [
  {
    id: 1,
    title: "Welcome to",
    subtitle: "St. Mary Parish",
    description: "A vibrant Catholic community in Trans-Ekulu, Enugu — united in faith, hope, and love.",
    badge: "Catholic Diocese of Enugu",
    image: heroImage
  },
  {
    id: 2,
    title: "Join Us in",
    subtitle: "Weekly Celebration",
    description: "Experience the joy of worship and fellowship in our Sunday Mass and community gatherings.",
    badge: "Sunday Services",
    image: communityImage
  },
  {
    id: 3,
    title: "Growing in",
    subtitle: "Faith Together",
    description: "Discover spiritual growth, service opportunities, and lasting friendships in our parish family.",
    badge: "Community Life",
    image: heroImage
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.6 },
  }),
};

const upcomingEvents = [
  { title: "Lenten Retreat", date: "March 15, 2026", time: "9:00 AM", category: "Spiritual" },
  { title: "Youth Fellowship Night", date: "March 20, 2026", time: "5:00 PM", category: "Youth" },
  { title: "Easter Vigil Mass", date: "April 4, 2026", time: "7:00 PM", category: "Liturgy" },
  { title: "Parish Bazaar", date: "April 18, 2026", time: "10:00 AM", category: "Community" },
];

const projects = [];

const newsItems = [
  { title: "Bishop's Pastoral Visit Scheduled for May", date: "March 1, 2026", excerpt: "His Lordship will visit our parish for confirmation and pastoral assessment..." },
  { title: "CWO Launches New Outreach Programme", date: "Feb 20, 2026", excerpt: "The Catholic Women Organisation is extending its community support to neighboring villages..." },
  { title: "Youth Choir Wins Diocesan Competition", date: "Feb 10, 2026", excerpt: "Our talented young musicians brought home the gold at the annual diocesan choir festival..." },
];

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentSlideData = slides[currentSlide];

  return (
  <Layout>
    {/* Hero Slideshow */}
    <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <img
            key={slide.id}
            src={slide.image}
            alt={slide.subtitle}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-accent w-8' 
                : 'bg-primary-foreground/50 hover:bg-primary-foreground/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <motion.span
          key={currentSlideData.badge}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-block font-heading text-xs tracking-[0.3em] uppercase text-accent mb-6"
        >
          {currentSlideData.badge}
        </motion.span>
        <motion.h1
          key={currentSlideData.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight"
        >
          {currentSlideData.title}
          <span className="block text-gradient-gold">{currentSlideData.subtitle}</span>
        </motion.h1>
        <motion.p
          key={currentSlideData.description}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="font-display text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto"
        >
          {currentSlideData.description}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/about"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md bg-accent text-accent-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-gold"
          >
            Learn More <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/mass-schedule"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md border border-primary-foreground/30 text-primary-foreground font-semibold text-sm hover:bg-primary-foreground/10 transition-colors"
          >
            Mass Schedule
          </Link>
        </motion.div>
      </div>
    </section>

    {/* About Snapshot */}
    <section className="py-24 bg-gradient-warm">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="font-heading text-xs tracking-[0.2em] uppercase text-accent mb-3 block">Our Parish</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
              A Community Rooted in Faith
            </h2>
            <p className="font-display text-lg text-muted-foreground leading-relaxed mb-6">
              Established in 1982, St. Mary Catholic Parish, Trans-Ekulu has grown from a small mission station 
              into a thriving community of over 5,000 families. We are dedicated to the spiritual growth and 
              welfare of every parishioner through the celebration of the sacraments, evangelization, and works of charity.
            </p>
            <div className="grid grid-cols-3 gap-6 mb-8">
              {[
                { icon: Users, label: "5,000+", sub: "Families" },
                { icon: Church, label: "40+", sub: "Years" },
                { icon: Heart, label: "20+", sub: "Societies" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <s.icon className="h-6 w-6 text-accent mx-auto mb-2" />
                  <p className="font-heading text-2xl font-bold text-foreground">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.sub}</p>
                </div>
              ))}
            </div>
            <Link to="/about" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors">
              Read Our Story <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <img src={communityImage} alt="Parish community" className="rounded-lg shadow-parish w-full object-cover aspect-[4/3]" />
            <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-lg hidden md:block">
              <p className="font-heading text-sm font-semibold">Sunday Mass</p>
              <p className="text-2xl font-bold">6, 8 & 10 AM</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Mass Schedule Snapshot */}
    <section className="py-24 bg-gradient-burgundy relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-parish-burgundy/90 via-parish-burgundy to-parish-burgundy/95" />
      <div className="relative container mx-auto px-4 lg:px-8">
        <SectionHeading
          subtitle="Join Us in Worship"
          title="Mass & Sacrament Schedule"
          description="Come and encounter Christ in the Holy Eucharist. All are welcome."
          light
        />
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { 
              day: "Sunday", 
              times: ["6:00 AM (Igbo)", "8:00 AM (Igbo)", "10:00 AM (English/Latin)", "6:00 PM (English)"], 
              icon: "☀️",
              description: "4 Masses Available"
            },
            { 
              day: "Weekdays", 
              times: ["6:00 AM (Mon/Tue/Thu: Igbo)", "6:00 AM (Wed/Fri: English)", "6:00 PM (Mon/Tue/Thu: English)", "6:00 PM (Wed/Fri: Igbo)"], 
              icon: "📿",
              description: "Daily Mass"
            },
            { 
              day: "Saturday", 
              times: ["6:00 AM (Latin)", "7:00 PM (Vigil Mass)"], 
              icon: "🕯️",
              description: "Weekend Preparation"
            },
          ].map((m, i) => (
            <motion.div
              key={m.day}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center shadow-2xl hover:shadow-white/10 transition-all duration-300 group"
            >
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-colors">
                <span className="text-4xl filter drop-shadow-lg">{m.icon}</span>
              </div>
              <h3 className="font-heading text-xl font-bold text-primary-foreground mb-2">{m.day}</h3>
              <p className="text-accent text-sm font-medium mb-4">{m.description}</p>
              <div className="space-y-2">
                {m.times.map((t, index) => (
                  <motion.p 
                    key={t}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="text-sm text-primary-foreground/90 leading-relaxed"
                  >
                    {t}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link 
              to="/mass-schedule" 
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/80 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-accent/25 hover:shadow-accent/40"
            >
              View Full Schedule <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Upcoming Events */}
    <section className="py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading subtitle="What's Happening" title="Upcoming Events" description="Stay connected with parish activities and celebrations." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {upcomingEvents.map((event, i) => (
            <motion.div
              key={event.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-parish transition-shadow group"
            >
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent mb-4">
                {event.category}
              </span>
              <h3 className="font-heading text-base font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                {event.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Calendar className="h-3 w-3" /> {event.date}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" /> {event.time}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/events" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors">
            View All Events <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>

    {/* Parish Projects */}
    <section className="py-24 bg-gradient-warm">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading subtitle="Building Together" title="Parish Projects" description="Support our ongoing projects and help us build a stronger community." />
        <div className="text-center py-16">
          <div className="bg-white/60 backdrop-blur-sm border border-parish-burgundy/20 rounded-lg p-12 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-parish-burgundy/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🏗️</span>
            </div>
            <h3 className="font-heading text-2xl font-bold text-foreground mb-4">Coming Soon</h3>
            <p className="text-muted-foreground font-display mb-8">
              Our parish projects are currently being planned and developed. Check back soon for information about our building initiatives, community programs, and ways you can get involved.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Link 
                to="/projects" 
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-parish-burgundy text-white font-semibold text-sm hover:bg-parish-burgundy/80 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-parish-burgundy/25"
              >
                View Projects <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>

    {/* Latest News */}
    <section className="py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading subtitle="Parish News" title="Latest Updates" description="Stay informed about life in our parish community." />
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {newsItems.map((item, i) => (
            <motion.div
              key={item.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-card border border-border rounded-lg p-6 h-full hover:shadow-parish transition-shadow">
                <div className="flex items-center gap-2 text-xs text-accent font-medium mb-3">
                  <BookOpen className="h-3 w-3" /> {item.date}
                </div>
                <h3 className="font-heading text-base font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.excerpt}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/news" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors">
            Read All News <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-24 bg-gradient-burgundy text-center">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-4xl mb-4 block">✝️</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Come, Be Part of Our Family
          </h2>
          <p className="font-display text-lg text-primary-foreground/70 mb-10">
            Whether you're a lifelong parishioner or visiting for the first time, there's a place for you here.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-md bg-accent text-accent-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-gold"
          >
            Get in Touch <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  </Layout>
  );
};

export default Index;
