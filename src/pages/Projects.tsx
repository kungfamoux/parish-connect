import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";

const projects = [
  { name: "New Parish Hall", goal: 25000000, raised: 18500000, description: "Construction of a modern multipurpose hall for parish events, meetings, and community activities.", image: "🏗️" },
  { name: "Scholarship Fund", goal: 5000000, raised: 3200000, description: "Providing educational support and scholarships for indigent students within the parish community.", image: "🎓" },
  { name: "Church Renovation", goal: 15000000, raised: 12000000, description: "Restoring and beautifying our sanctuary with new altars, sound system, and air conditioning.", image: "⛪" },
  { name: "Water Borehole Project", goal: 3000000, raised: 2800000, description: "Providing clean water access to the church and surrounding community through a modern borehole.", image: "💧" },
  { name: "Youth Centre Development", goal: 8000000, raised: 2000000, description: "Building a dedicated space for youth activities, skill acquisition, and digital literacy programmes.", image: "🏢" },
  { name: "Charity Outreach Fund", goal: 2000000, raised: 1500000, description: "Supporting the less privileged through food drives, medical outreaches, and financial assistance.", image: "🤝" },
];

const Projects = () => (
  <Layout>
    <section className="py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading subtitle="Building Together" title="Parish Projects & Fundraising" description="Your generous contributions help us build a vibrant community. Every naira counts." />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {projects.map((p, i) => {
            const pct = Math.round((p.raised / p.goal) * 100);
            return (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-lg p-6 shadow-parish"
              >
                <span className="text-4xl mb-4 block">{p.image}</span>
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">{p.name}</h3>
                <p className="text-sm text-muted-foreground mb-6">{p.description}</p>
                <div className="w-full bg-muted rounded-full h-3 mb-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full rounded-full bg-accent"
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mb-4">
                  <span>₦{(p.raised / 1000000).toFixed(1)}M of ₦{(p.goal / 1000000).toFixed(0)}M</span>
                  <span className="font-semibold text-foreground">{pct}%</span>
                </div>
                <button className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
                  <Heart className="h-4 w-4" /> Donate Now
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  </Layout>
);

export default Projects;
