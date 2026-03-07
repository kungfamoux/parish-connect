import { motion } from "framer-motion";
import { BookOpen, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";

const articles: any[] = [];

const News = () => (
  <Layout>
    <section className="py-24">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <SectionHeading subtitle="Stay Informed" title="Parish News & Updates" description="Read the latest happenings and announcements from our parish community." />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center py-16"
        >
          <div className="bg-gradient-warm rounded-lg p-12 border border-border">
            <BookOpen className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="font-heading text-2xl font-bold text-foreground mb-4">Coming Soon</h3>
            <p className="text-muted-foreground font-display max-w-md mx-auto">
              News and updates will be available here soon. Please check back later for the latest parish announcements and events.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  </Layout>
);

export default News;
