import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";

const projects = [];

const Projects = () => (
  <Layout>
    <section className="py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading subtitle="Building Together" title="Parish Projects & Fundraising" description="Your generous contributions help us build a vibrant community. Every naira counts." />
        <div className="text-center py-16">
          <p className="text-2xl font-semibold text-muted-foreground">Will be updated soon</p>
        </div>
      </div>
    </section>
  </Layout>
);

export default Projects;
