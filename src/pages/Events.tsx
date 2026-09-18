import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Users, Church, ChevronDown, ChevronUp, Phone, CreditCard, FileText, MapPin, Star } from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";

const Events = () => {
  const [expandedSections, setExpandedSections] = useState({
    contact: false,
    committee: false,
    brochure: false,
    bank: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const committeeMembers = [
    { name: "Chief Victor Nwani", role: "Chairman" },
    { name: "Sir Anthony Uwandu", role: "Member" },
    { name: "Prof. Chinelo Igwenagu", role: "Secretary" },
    { name: "Chief Godwin Nwachukwu", role: "Member" },
    { name: "Prof. Augustine Nwagbara", role: "Member" },
    { name: "Ezinne Ifeoma Otiji", role: "Member" },
    { name: "Sir Chumaife Nze", role: "Member" },
    { name: "Chief Charles Achor", role: "Member" },
    { name: "Hon. Godwin Abonyi", role: "Member" },
    { name: "Dr Mrs Nkiru Okpalanze", role: "Member" },
    { name: "Amb. Paulinus Eze", role: "Finance" },
    { name: "Lolo Vera Chukwuobasi", role: "Finance" },
    { name: "Dr Chika Anisiuba", role: "Member" },
    { name: "Amb. Nneka Peter Nwankwo", role: "Member" },
    { name: "Ezinne Grace Uka", role: "Member" },
    { name: "Chukwuemeka Iloanusi", role: "Member" },
    { name: "Chidimma Umezurike", role: "Member" },
    { name: "Anthony Agbo", role: "Member" },
    { name: "Kennedy Ekwo", role: "Member" },
    { name: "Chikwado Agu", role: "Member" },
    { name: "Blessing Ezugwu", role: "Member" },
    { name: "Emmanuel Ezugwu", role: "Member" }
  ];

  return (
  <Layout>
    {/* Events Section */}
    <section className="py-24">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <SectionHeading subtitle="What's Happening" title="Parish Events" description="Stay connected with all activities and celebrations in our parish." />
        
        {/* Major Anniversary Event */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="bg-gradient-to-br from-parish-burgundy/20 to-parish-burgundy/10 border-2 border-parish-burgundy/30 rounded-xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-full bg-parish-burgundy text-white">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-accent text-accent-foreground mb-2">
                  Major Event
                </span>
                <h3 className="font-heading text-2xl font-bold text-foreground">Thanksgiving Mass</h3>
                <p className="text-muted-foreground font-display">Msgr. Anthony Anijielo Anniversary</p>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 mb-6">
              <p className="font-heading text-lg font-semibold text-foreground mb-2">
                Retirement, 75th Birthday & 46th Priestly Anniversary
              </p>
              <p className="text-muted-foreground font-display mb-4">
                Join us as we celebrate three decades of dedicated service to God and our parish community.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-parish-burgundy" />
                  <span className="text-sm font-medium text-foreground">Saturday, November 14, 2026</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-parish-burgundy" />
                  <span className="text-sm font-medium text-foreground">10:00 AM</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-parish-burgundy" />
                  <span className="text-sm font-medium text-foreground">St. Mary Parish, Trans-Ekulu, Enugu</span>
                </div>
                <div className="flex items-center gap-2">
                  <Church className="h-4 w-4 text-parish-burgundy" />
                  <span className="text-sm font-medium text-foreground">Most Rev. Dr. C.V.C. Onaga (Chief Celebrant)</span>
                </div>
              </div>
            </div>

            {/* Expandable Sections */}
            <div className="space-y-3">
              {/* Contact Information */}
              <div className="bg-white/40 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('contact')}
                  className="w-full p-4 flex items-center justify-between hover:bg-white/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-parish-burgundy" />
                    <span className="font-heading font-semibold text-foreground">Contact Information</span>
                  </div>
                  {expandedSections.contact ? <ChevronUp className="h-5 w-5 text-parish-burgundy" /> : <ChevronDown className="h-5 w-5 text-parish-burgundy" />}
                </button>
                {expandedSections.contact && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 pt-0 border-t border-parish-burgundy/10"
                  >
                    <div className="space-y-3">
                      <div className="p-3 bg-white/60 rounded-lg">
                        <p className="font-medium text-foreground mb-1">Rev. Fr. Daniel Onah (Parish Vicar)</p>
                        <p className="text-sm text-muted-foreground">07030322956</p>
                      </div>
                      <div className="p-3 bg-white/60 rounded-lg">
                        <p className="font-medium text-foreground mb-1">Engr. Victor Nwani (Chairman Planning Committee)</p>
                        <p className="text-sm text-muted-foreground">08033226114</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Committee Members */}
              <div className="bg-white/40 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('committee')}
                  className="w-full p-4 flex items-center justify-between hover:bg-white/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-parish-burgundy" />
                    <span className="font-heading font-semibold text-foreground">Anniversary Committee (22 Members)</span>
                  </div>
                  {expandedSections.committee ? <ChevronUp className="h-5 w-5 text-parish-burgundy" /> : <ChevronDown className="h-5 w-5 text-parish-burgundy" />}
                </button>
                {expandedSections.committee && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 pt-0 border-t border-parish-burgundy/10"
                  >
                    <div className="grid md:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                      {committeeMembers.map((member, index) => (
                        <div key={index} className="p-2 bg-white/60 rounded-lg text-sm">
                          <p className="font-medium text-foreground">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Brochure & Sponsorship */}
              <div className="bg-white/40 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('brochure')}
                  className="w-full p-4 flex items-center justify-between hover:bg-white/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-parish-burgundy" />
                    <span className="font-heading font-semibold text-foreground">Brochure & Sponsorship Rates</span>
                  </div>
                  {expandedSections.brochure ? <ChevronUp className="h-5 w-5 text-parish-burgundy" /> : <ChevronDown className="h-5 w-5 text-parish-burgundy" />}
                </button>
                {expandedSections.brochure && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 pt-0 border-t border-parish-burgundy/10"
                  >
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Cover Pages</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between"><span>Center spread</span><span className="font-medium">#150,000</span></div>
                          <div className="flex justify-between"><span>Inside Front cover</span><span className="font-medium">#200,000</span></div>
                          <div className="flex justify-between"><span>Inside back cover</span><span className="font-medium">#150,000</span></div>
                          <div className="flex justify-between"><span>Outside back cover</span><span className="font-medium">#250,000</span></div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Goodwill Messages & Adverts</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between"><span>Full page</span><span className="font-medium">#40,000</span></div>
                          <div className="flex justify-between"><span>Half page</span><span className="font-medium">#30,000</span></div>
                          <div className="flex justify-between"><span>Quarter page</span><span className="font-medium">#20,000</span></div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Holy Pictures Sponsorship</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between"><span>Jesus</span><span className="font-medium">#40,000</span></div>
                          <div className="flex justify-between"><span>Mother Mary</span><span className="font-medium">#40,000</span></div>
                          <div className="flex justify-between"><span>St. Joseph</span><span className="font-medium">#40,000</span></div>
                          <div className="flex justify-between"><span>St. Anthony</span><span className="font-medium">#40,000</span></div>
                          <div className="flex justify-between"><span>Pope, Bishops et al</span><span className="font-medium">#30,000</span></div>
                          <div className="flex justify-between"><span>Celebrant (MSGR ANIJIELO)</span><span className="font-medium">#50,000</span></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Bank Details */}
              <div className="bg-white/40 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('bank')}
                  className="w-full p-4 flex items-center justify-between hover:bg-white/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-parish-burgundy" />
                    <span className="font-heading font-semibold text-foreground">Bank Details for Contributions</span>
                  </div>
                  {expandedSections.bank ? <ChevronUp className="h-5 w-5 text-parish-burgundy" /> : <ChevronDown className="h-5 w-5 text-parish-burgundy" />}
                </button>
                {expandedSections.bank && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 pt-0 border-t border-parish-burgundy/10"
                  >
                    <div className="bg-white/60 rounded-lg p-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bank:</span>
                          <span className="font-medium text-foreground">FIRST BANK</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Account Name:</span>
                          <span className="font-medium text-foreground">Msgr. Anthony Anijielo Anniversary Committee</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Account Number:</span>
                          <span className="font-medium text-foreground">2049341360</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Deadline Notice */}
            <div className="mt-6 p-4 bg-accent/20 border border-accent/30 rounded-lg">
              <p className="text-sm font-medium text-accent-foreground">
                <strong>Deadline for Submission:</strong> Saturday, October 24, 2026
              </p>
              <p className="text-xs text-accent-foreground/80 mt-1">
                Msgr. Anijielo loves us, now we reciprocate 🥰
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  </Layout>
  );
};

export default Events;
