import { motion } from "framer-motion";
import { Calendar, Clock, Megaphone, Bell, Users, Heart } from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";

const Events = () => (
  <Layout>
    {/* Events Section */}
    <section className="py-24">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <SectionHeading subtitle="What's Happening" title="Parish Events" description="Stay connected with all activities and celebrations in our parish." />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center py-16"
        >
          <div className="bg-gradient-warm rounded-lg p-12 border border-border">
            <Calendar className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="font-heading text-2xl font-bold text-foreground mb-4">Coming Soon</h3>
            <p className="text-muted-foreground font-display max-w-md mx-auto">
              Parish events will be updated here soon. Please check back later for information about upcoming activities, celebrations, and special occasions.
            </p>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Weekly Announcements Section */}
    <section className="py-24 bg-gradient-to-br from-parish-cream via-background to-parish-warm">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-full bg-parish-burgundy/20 text-parish-burgundy">
            <Megaphone className="h-6 w-6" />
          </div>
          <h2 className="font-heading text-3xl font-bold text-foreground">Weekly Announcements</h2>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          {/* This Week's Highlights */}
          <div className="bg-white/60 backdrop-blur-sm border border-parish-burgundy/20 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="h-5 w-5 text-parish-burgundy" />
              <h3 className="font-heading text-xl font-bold text-foreground">This Week's Highlights</h3>
            </div>
            
            <div className="space-y-4">
              {[
                {
                  title: "Sunday Mass Schedule",
                  description: "Join us for Sunday masses at 6:00 AM (Igbo), 8:00 AM (Igbo), 10:00 AM (English/Latin), and 6:00 PM (English)",
                  icon: Calendar,
                  time: "Every Sunday"
                },
                {
                  title: "Weekday Masses",
                  description: "Daily masses available Monday-Friday at 6:00 AM and 6:00 PM. Saturday masses at 6:00 AM and 7:00 PM (Vigil)",
                  icon: Clock,
                  time: "Daily"
                },
                {
                  title: "Vespers & Benediction",
                  description: "Join us for Sunday evening vespers and benediction from 5:00 PM - 6:00 PM",
                  icon: Heart,
                  time: "Sundays 5:00 PM"
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className="flex gap-4 p-4 rounded-lg bg-parish-cream/30 border border-parish-burgundy/10"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-parish-burgundy/20 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-parish-burgundy" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-heading text-lg font-semibold text-foreground mb-1">{item.title}</h4>
                    <p className="text-muted-foreground font-display text-sm mb-2">{item.description}</p>
                    <span className="text-xs text-accent font-medium">{item.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Special Announcements */}
          <div className="bg-gradient-to-r from-parish-burgundy/20 to-parish-burgundy/10 border border-parish-burgundy/30 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-5 w-5 text-parish-burgundy" />
              <h3 className="font-heading text-xl font-bold text-foreground">Special Announcements</h3>
            </div>
            
            <div className="space-y-4">
              {[
                {
                  title: "Infant Baptism",
                  description: "Infant baptism is celebrated on the 1st and 3rd Saturday of every month at 4:00 PM. Registration is open on Tuesdays and Wednesdays.",
                  urgency: "Monthly"
                },
                {
                  title: "Marriage Preparation",
                  description: "Marriage preparation courses are held on Tuesdays and Thursdays from 4:00 PM - 6:00 PM, and Sundays from 6:30 PM - 8:00 PM.",
                  urgency: "Weekly"
                },
                {
                  title: "Catechism Classes",
                  description: "Religious education for children and adults: Sundays 3:00 PM - 5:00 PM, Tuesdays and Thursdays 4:00 PM - 6:00 PM.",
                  urgency: "Weekly"
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="p-4 rounded-lg bg-white/40 border border-parish-burgundy/20"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-heading text-lg font-semibold text-foreground">{item.title}</h4>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-parish-burgundy/20 text-parish-burgundy">
                      {item.urgency}
                    </span>
                  </div>
                  <p className="text-muted-foreground font-display text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Parish Meetings */}
          <div className="bg-white/60 backdrop-blur-sm border border-parish-burgundy/20 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="h-5 w-5 text-parish-burgundy" />
              <h3 className="font-heading text-xl font-bold text-foreground">Parish Meetings</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  title: "Parish Pastoral Council",
                  schedule: "1st Tuesday of every month",
                  time: "7:00 PM - 9:00 PM"
                },
                {
                  title: "Zonal Meetings",
                  schedule: "2nd Tuesday of every month",
                  time: "7:30 PM - 9:00 PM"
                },
                {
                  title: "Finance Committee",
                  schedule: "Last Friday of every month",
                  time: "6:30 PM - 9:00 PM"
                },
                {
                  title: "Executive Meetings",
                  schedule: "As scheduled",
                  time: "Various times"
                }
              ].map((meeting, index) => (
                <motion.div
                  key={meeting.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="p-4 rounded-lg bg-parish-cream/30 border border-parish-burgundy/10 text-center"
                >
                  <h4 className="font-heading text-base font-semibold text-foreground mb-2">{meeting.title}</h4>
                  <p className="text-sm text-muted-foreground mb-1">{meeting.schedule}</p>
                  <p className="text-xs text-accent font-medium">{meeting.time}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  </Layout>
);

export default Events;
