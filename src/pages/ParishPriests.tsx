import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Calendar, Church } from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";

const ParishPriests = () => (
  <Layout>
    {/* Hero */}
    <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-gradient-burgundy">
      <div className="absolute inset-0 bg-gradient-to-br from-parish-burgundy/90 via-parish-burgundy to-parish-burgundy/95" />
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-block font-heading text-xs tracking-[0.3em] uppercase text-accent mb-6"
        >
          Spiritual Leadership
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight"
        >
          Parish Priests
          <span className="block text-gradient-gold">& Assistants</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="font-display text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto"
        >
          Honoring the dedicated priests who have served St. Mary Parish since 1988
        </motion.p>
      </div>
    </section>

    {/* Main Content */}
    <section className="py-24 bg-gradient-to-br from-parish-cream via-background to-parish-warm">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-parish-burgundy/20 text-parish-burgundy">
              <Church className="h-6 w-6" />
            </div>
            <h2 className="font-heading text-3xl font-bold text-foreground">A Legacy of Service</h2>
          </div>
          
          <p className="font-display text-lg text-muted-foreground leading-relaxed mb-8">
            Since becoming a full parish in 1988, St. Mary Catholic Parish has been blessed with dedicated spiritual leaders 
            who have guided our community through decades of growth, faith, and service. This chronology honors the 
            33 priests who have faithfully served our parish — 8 Parish Priests and 25 Assistant Priests.
          </p>

          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            {[
              { number: "33", label: "Total Priests", icon: Users },
              { number: "8", label: "Parish Priests", icon: Church },
              { number: "25", label: "Assistant Priests", icon: Users }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white/60 backdrop-blur-sm border border-parish-burgundy/20 rounded-lg p-6 text-center"
              >
                <stat.icon className="h-6 w-6 text-parish-burgundy mx-auto mb-2" />
                <div className="text-2xl font-bold text-parish-burgundy mb-1">{stat.number}</div>
                <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Chronology Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-white/60 backdrop-blur-sm border border-parish-burgundy/20 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-parish-burgundy to-parish-burgundy/80 p-6 text-white">
              <h3 className="font-heading text-2xl font-bold text-center">Complete Chronology</h3>
              <p className="text-center text-parish-cream/90 mt-2 font-display">September 1988 - Present</p>
            </div>
            
            <div className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-parish-burgundy/20">
                      <th className="text-left py-4 px-4 font-semibold text-foreground w-16">S/N</th>
                      <th className="text-left py-4 px-4 font-semibold text-foreground min-w-[300px]">Name</th>
                      <th className="text-left py-4 px-4 font-semibold text-foreground w-40">Role</th>
                      <th className="text-left py-4 px-4 font-semibold text-foreground w-48">Period</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-parish-burgundy/10">
                    {[
                      ["1", "Most Rev. Dr. F.E. Okobo", "Parish Priest", "Sept 1988 – Nov 1990"],
                      ["2", "Very Rev. Fr. Dr. E. Anike", "Asst. Parish Priest", "Sept 1988 – Aug 1989"],
                      ["3", "Very Rev. Fr. V. Onyeadu", "Asst. Parish Priest", "Sept 1989 – Aug 1991"],
                      ["4", "Very Rev. Fr. Dr. T. Anichebe", "Parish Priest", "Sept 1991 – Feb 1998"],
                      ["5", "Rev. Fr. Nnaji", "Asst. Parish Priest", "Sept 1992 – Aug 1994"],
                      ["6", "Rev. Fr. Geoffrey Aka", "Asst. Parish Priest", "Sept 1994 – Aug 1996"],
                      ["7", "Rev. Fr. F.N. Okoli", "Asst. Parish Priest", "Sept 1996 – Aug 1998"],
                      ["8", "Very Rev. Msgr. Luke Adike", "Parish Priest", "Jan 1998 – Feb 2003"],
                      ["9", "Rev. Fr. Vin Onyekelu", "Asst. Parish Priest", "Sept 1998 – Aug 1999"],
                      ["10", "Rev. Fr. Clem Ilechukwu", "Asst. Parish Priest", "Sept 1999 – Aug 2000"],
                      ["11", "Rev. Fr. Dom Mary Chukwu", "Asst. Parish Priest", "Sept 2000 – Aug 2001"],
                      ["12", "Rev. Fr. Sam Onyekpa", "Asst. Parish Priest", "Sept 2001 – Aug 2002"],
                      ["13", "Rev. Fr. K. Awulonu", "Asst. Parish Priest", "Feb 2002 – Aug 2003"],
                      ["14", "Very Rev. Msgr. Patrick Ugwu", "Parish Priest", "Feb 2003 – Jan 2010"],
                      ["15", "Rev. Fr. Hyginus Aniehe", "Asst. Parish Priest", "Aug 2003 – Sept 2004"],
                      ["16", "Rev. Fr. S. Zeowa", "Asst. Parish Priest", "Sept 2004 – Aug 2005"],
                      ["17", "Rev. Fr. A. Anichebe", "Asst. Parish Priest", "Sept 2005 – Aug 2006"],
                      ["18", "Rev. Fr. Ozougwu", "Asst. Parish Priest", "Sept 2008 – Dec 2009"],
                      ["19", "Very Rev. Msgr. G.C. Ogbuene", "Parish Priest", "Jan 2010 – Jan 2016"],
                      ["20", "Rev. Fr. D. Okafor", "Asst. Parish Priest", "Jan 2010 – Aug 2011"],
                      ["21", "Rev. Fr. C. Ozoude", "Asst. Parish Priest", "Sept 2011 – Aug 2012"],
                      ["22", "Rev. Fr. Joe U. Nnajiofor", "Asst. Parish Priest", "Sept 2012 – Aug 2013"],
                      ["23", "Rev. Fr. Remigius Ibudialor", "Asst. Parish Priest", "Sept 2013 – Aug 2014"],
                      ["24", "Rev. Fr. John Nworie", "Asst. Parish Priest", "Sept 2014 – Jan 2016"],
                      ["25", "Very Rev. Fr. Dr. G.M. Aguigwo", "Parish Priest", "Jan 2016 – Feb 2020"],
                      ["26", "Rev. Fr. Afamefuna Malunze", "Asst. Parish Priest", "Jan 2016 – Feb 2018"],
                      ["27", "Rev. Fr. Paul Obichukwu Mba", "Asst. Parish Priest", "Feb 2018 – Feb 2019"],
                      ["28", "Rev. Fr. Daniel Ogbodo", "Asst. Parish Priest", "Feb 2019 – Feb 2020"],
                      ["29", "Very Rev. Msgr. Anthony Anijielo", "Parish Priest", "Feb 2020 – Date"],
                      ["30", "Rev. Fr. Paul Uche", "Asst. Parish Priest", "Feb. 2020 – 2021"],
                      ["31", "Rev. Fr. Onyeka Onyia", "Asst. Parish Priest", "Feb. 2021 – 2022"],
                      ["32", "Rev. Fr. Nichodemus Nnaji", "Asst. Parish Priest", "Feb. 2022 – 2023"],
                      ["33", "Rev. Fr. Chinonso Odoh", "Asst. Parish Priest", "Feb. 2023 – Date"]
                    ].map((priest, index) => (
                      <motion.tr
                        key={priest[0]}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 + index * 0.02 }}
                        className="hover:bg-parish-burgundy/5 transition-colors"
                      >
                        <td className="py-4 px-4 text-muted-foreground font-medium">{priest[0]}</td>
                        <td className="py-4 px-4 text-foreground font-display font-medium">{priest[1]}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            priest[2] === "Parish Priest" 
                              ? "bg-parish-burgundy/20 text-parish-burgundy border border-parish-burgundy/30" 
                              : "bg-accent/20 text-accent border border-accent/30"
                          }`}>
                            {priest[2]}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground font-display">{priest[3]}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Current Leadership */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.5 }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <h3 className="font-heading text-2xl font-bold text-foreground mb-4">Current Leadership</h3>
            <p className="text-muted-foreground font-display">The priests currently serving our parish community</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: "Very Rev. Msgr. Anthony Anijielo",
                role: "Parish Priest",
                period: "Feb 2020 - Present",
                description: "Leading our parish with wisdom and spiritual guidance"
              },
              {
                name: "Rev. Fr. Chinonso Odoh",
                role: "Assistant Parish Priest",
                period: "Feb 2023 - Present",
                description: "Supporting our community through dedicated service"
              }
            ].map((priest, index) => (
              <motion.div
                key={priest.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.6 + index * 0.1 }}
                className="bg-gradient-to-br from-parish-burgundy/10 to-parish-burgundy/5 border border-parish-burgundy/20 rounded-lg p-8 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-parish-burgundy text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {priest.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <h4 className="font-heading text-lg font-bold text-foreground mb-2">{priest.name}</h4>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-parish-burgundy/20 text-parish-burgundy border border-parish-burgundy/30 mb-3">
                  {priest.role}
                </span>
                <p className="text-sm text-muted-foreground font-display mb-2">{priest.period}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{priest.description}</p>
              </motion.div>
            ))}
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
          Learn More About Our Parish
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link to="/about" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/80 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-accent/25">
            Parish History <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-primary-foreground/30 text-primary-foreground font-semibold text-sm hover:bg-primary-foreground/10 transition-colors">
            Contact Us
          </Link>
        </motion.div>
      </div>
    </section>
  </Layout>
);

export default ParishPriests;
