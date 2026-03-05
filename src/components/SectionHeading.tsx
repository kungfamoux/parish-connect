import { motion } from "framer-motion";

interface SectionHeadingProps {
  subtitle?: string;
  title: string;
  description?: string;
  centered?: boolean;
  light?: boolean;
}

const SectionHeading = ({ subtitle, title, description, centered = true, light = false }: SectionHeadingProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6 }}
    className={`mb-12 ${centered ? "text-center" : ""}`}
  >
    {subtitle && (
      <span className="font-heading text-xs font-semibold tracking-[0.2em] uppercase text-accent mb-3 block">
        {subtitle}
      </span>
    )}
    <h2 className={`font-heading text-3xl md:text-4xl font-bold mb-4 ${light ? "text-primary-foreground" : "text-foreground"}`}>
      {title}
    </h2>
    {description && (
      <p className={`max-w-2xl font-display text-lg leading-relaxed ${centered ? "mx-auto" : ""} ${light ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
        {description}
      </p>
    )}
  </motion.div>
);

export default SectionHeading;
