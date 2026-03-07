import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import aboutImage from "@/assets/blessed virgin mary.jpg";

const leaders = [
  { name: "Rev. Fr. Chukwuemeka Obi", role: "Parish Priest", bio: "Ordained in 2005, Fr. Chukwuemeka has served our parish since 2018 with zeal and dedication." },
  { name: "Rev. Fr. Ikechukwu Nwosu", role: "Assistant Parish Priest", bio: "A young and dynamic priest who coordinates youth ministry and catechetical programmes." },
  { name: "Chief Nnamdi Eze", role: "PPC Chairman", bio: "Leading the Parish Pastoral Council with over 15 years of committed service." },
  { name: "Lady Ada Okeke", role: "CWO President", bio: "Championing women's ministry and community outreach across the parish." },
];

const About = () => (
  <Layout>
    {/* Hero */}
    <section className="relative h-[50vh] min-h-[350px] flex items-center justify-center overflow-hidden">
      <img src={aboutImage} alt="Church interior" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="relative z-10 text-center px-4">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-4">About Our Parish</h1>
        <p className="font-display text-lg text-primary-foreground/70">Rooted in faith, growing in love</p>
      </div>
    </section>

    {/* History */}
    <section className="py-24">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <SectionHeading subtitle="Our Story" title="Parish History" />
        <div className="prose prose-lg max-w-none font-display text-muted-foreground leading-relaxed space-y-6">
          <p>St. Mary Catholic Parish, Trans-Ekulu was established in 1982 as a mass centre under St. Patrick's Parish, Emene. Through the prayers and dedication of pioneer parishioners, the community grew rapidly and was elevated to a full parish in 1988.</p>
          <p>Over the decades, the parish has witnessed tremendous growth — from a small wooden structure to the beautiful church building that stands today. The parish has produced several priests, religious sisters, and lay leaders who serve the Church across Nigeria and beyond.</p>
          <p>Today, St. Mary Parish is home to over 5,000 families and continues to thrive as a beacon of faith, charity, and community in the Catholic Diocese of Enugu.</p>
        </div>
      </div>
    </section>

    {/* Mission & Vision */}
    <section className="py-24 bg-gradient-warm">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-background border border-border rounded-lg p-8 shadow-parish"
          >
            <span className="text-3xl mb-4 block">🙏</span>
            <h3 className="font-heading text-xl font-bold text-foreground mb-4">Our Mission</h3>
            <p className="font-display text-muted-foreground leading-relaxed">
              To proclaim the Gospel of Jesus Christ, celebrate the sacraments, and serve the people of God through works of mercy, education, and community building — living as a united family of faith.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="bg-background border border-border rounded-lg p-8 shadow-parish"
          >
            <span className="text-3xl mb-4 block">⭐</span>
            <h3 className="font-heading text-xl font-bold text-foreground mb-4">Our Vision</h3>
            <p className="font-display text-muted-foreground leading-relaxed">
              To be a model Catholic parish — vibrant in worship, dynamic in evangelization, generous in charity, and excellent in all things — reflecting the love of Christ to all we encounter.
            </p>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Leadership */}
    <section className="py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading subtitle="Our Leaders" title="Parish Leadership" description="Meet the dedicated individuals who guide our parish community." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {leaders.map((l, i) => (
            <motion.div
              key={l.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center text-3xl">
                👤
              </div>
              <h4 className="font-heading text-sm font-bold text-foreground mb-1">{l.name}</h4>
              <p className="text-xs text-accent font-semibold mb-2">{l.role}</p>
              <p className="text-xs text-muted-foreground">{l.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-16 bg-gradient-burgundy text-center">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-2xl font-bold text-primary-foreground mb-6">Want to learn more?</h2>
        <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-md bg-accent text-accent-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
          Contact Us <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  </Layout>
);

export default About;
