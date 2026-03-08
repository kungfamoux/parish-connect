import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Church, Users, Heart } from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import aboutImage from "@/assets/blessed virgin mary.jpg";

const About = () => (
  <Layout>
    {/* Hero */}
    <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
      <img src={aboutImage} alt="Church interior" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-block font-heading text-xs tracking-[0.3em] uppercase text-accent mb-6"
        >
          Our Heritage
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight"
        >
          The Comprehensive
          <span className="block text-gradient-gold">History of St. Mary Parish</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="font-display text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto"
        >
          From humble beginnings to a thriving community of faith since 1981
        </motion.p>
      </div>
    </section>

    {/* Main History Content */}
    <section className="py-24 bg-gradient-to-br from-parish-cream via-background to-parish-warm">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        
        {/* The Foundations of Faith (1981–1985) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-parish-burgundy/20 text-parish-burgundy">
              <Calendar className="h-6 w-6" />
            </div>
            <h2 className="font-heading text-3xl font-bold text-foreground">The Foundations of Faith (1981–1985)</h2>
          </div>
          
          <div className="prose prose-lg max-w-none font-display text-muted-foreground leading-relaxed space-y-6">
            <p className="text-lg">
              The seeds of St. Mary Catholic Parish were sown in October 1981, when the Trans-Ekulu station began holding regular Sunday and daily masses. In those early days, the community relied on the spiritual guidance of Rev. Fr. Norbert Madu, who traveled from Abakpa to tend to the growing flock.
            </p>
            
            <p className="text-lg">
              On May 2, 1982, the parish reached a historic milestone when His Lordship, Bishop M.U. Eneja, performed the turning of the sod. The community quickly organized under Rev. Fr. Evans Nwamadi, who expanded the station from two to nine zones and introduced the beloved Harvest and Bazaar competitions.
            </p>
          </div>
        </motion.div>

        {/* Building the Sanctuary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-parish-burgundy/20 text-parish-burgundy">
              <Church className="h-6 w-6" />
            </div>
            <h2 className="font-heading text-3xl font-bold text-foreground">Building the Sanctuary</h2>
          </div>
          
          <p className="font-display text-lg text-muted-foreground leading-relaxed mb-6">
            The mid-80s was a period of intense physical development:
          </p>
          
          <div className="space-y-6">
            {[
              {
                year: "1984",
                title: "Land Application",
                description: "Under Rev. Fr. Boniface Onah, a formal application for church land in the Federal Housing Estate (Zone 11) was submitted."
              },
              {
                year: "1985",
                title: "First Mass & Fundraising",
                description: "After the passing of Rt. Rev. Msgr. Eze, who had laid the groundwork for the church flooring, Rev. Msgr. Okpalaibekwe conducted the first mass in the new station and launched a fundraising drive to complete the flooring."
              },
              {
                year: "1986",
                title: "International Support",
                description: "Bishop Eneja secured international support for the project, receiving grants from the Sacred Congregation for the Propagation of Faith to ensure the church's completion."
              }
            ].map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white/60 backdrop-blur-sm border border-parish-burgundy/20 rounded-lg p-6 shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-parish-burgundy text-white flex items-center justify-center font-bold text-sm">
                      {milestone.year}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-2">{milestone.title}</h3>
                    <p className="font-display text-muted-foreground leading-relaxed">{milestone.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Growth into a Mother Parish */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-parish-burgundy/20 text-parish-burgundy">
              <Users className="h-6 w-6" />
            </div>
            <h2 className="font-heading text-3xl font-bold text-foreground">Growth into a Mother Parish</h2>
          </div>
          
          <div className="prose prose-lg max-w-none font-display text-muted-foreground leading-relaxed space-y-6">
            <p className="text-lg">
              St. Mary's eventually grew from a station into a full Parish in 1988. Over the decades, it has not only built its own magnificent sanctuary but has also birthed new communities.
            </p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-parish-burgundy/20 to-parish-burgundy/10 border border-parish-burgundy/30 rounded-lg p-8 text-center"
            >
              <Heart className="h-8 w-8 text-parish-burgundy mx-auto mb-4" />
              <h3 className="font-heading text-2xl font-bold text-foreground mb-3">Birth of Mater Dei Parish</h3>
              <p className="font-display text-lg text-muted-foreground leading-relaxed">
                In August 2013, St. Mary's gave birth to Mater Dei Parish, which was created under the administration of Rev. Fr. Theodore Ozoamalu.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Key Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {[
            { number: "1981", label: "Founded" },
            { number: "1988", label: "Full Parish Status" },
            { number: "40+", label: "Years of Service" },
            { number: "2013", label: "Birthed Mater Dei" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="bg-white/60 backdrop-blur-sm border border-parish-burgundy/20 rounded-lg p-6 text-center"
            >
              <div className="text-3xl font-bold text-parish-burgundy mb-2">{stat.number}</div>
              <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Spiritual Leadership Link */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mb-20"
        >
          <div className="bg-gradient-to-r from-parish-burgundy/20 to-parish-burgundy/10 border border-parish-burgundy/30 rounded-lg p-8 text-center">
            <Users className="h-12 w-12 text-parish-burgundy mx-auto mb-4" />
            <h3 className="font-heading text-2xl font-bold text-foreground mb-4">Spiritual Leadership</h3>
            <p className="font-display text-lg text-muted-foreground leading-relaxed mb-6 max-w-2xl mx-auto">
              Over 33 dedicated priests have served St. Mary Parish since 1988, guiding our community through decades of faith, growth, and service.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9 }}
            >
              <Link 
                to="/parish-priests" 
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-parish-burgundy text-white font-semibold text-sm hover:bg-parish-burgundy/80 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-parish-burgundy/25"
              >
                View Complete Chronology <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-16 bg-gradient-burgundy text-center">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-heading text-2xl font-bold text-primary-foreground mb-6"
        >
          Join Our Living History
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-parish-cream/90 mb-8 max-w-2xl mx-auto"
        >
          Become part of our continuing story of faith, community, and service. All are welcome to join our parish family.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/80 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-accent/25">
            Get in Touch <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  </Layout>
);

export default About;
