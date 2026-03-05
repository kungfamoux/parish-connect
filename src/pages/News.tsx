import { motion } from "framer-motion";
import { BookOpen, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";

const articles = [
  { title: "Bishop's Pastoral Visit Scheduled for May", date: "March 1, 2026", author: "Parish Office", excerpt: "His Lordship, Most Rev. Dr. Callistus Onaga, will visit our parish for confirmation and pastoral assessment. Over 200 candidates have been prepared for the Sacrament of Confirmation." },
  { title: "CWO Launches New Outreach Programme", date: "Feb 20, 2026", author: "CWO Secretariat", excerpt: "The Catholic Women Organisation is extending its community support programme to five neighboring villages, providing food, clothing, and medical supplies to the less privileged." },
  { title: "Youth Choir Wins Diocesan Competition", date: "Feb 10, 2026", author: "Youth Ministry", excerpt: "Our talented young musicians brought home the gold trophy at the annual diocesan choir festival held at Holy Ghost Cathedral, Enugu. Congratulations to all choir members!" },
  { title: "Parish Council Elections Slated for June", date: "Feb 5, 2026", author: "Parish Office", excerpt: "Elections for the Parish Pastoral Council will hold in June. Nominations are now open for interested and qualified parishioners." },
  { title: "New Catechism Programme Begins", date: "Jan 28, 2026", author: "Catechetical Ministry", excerpt: "A revamped catechetical programme for children and adults begins this March. Registration is ongoing at the Parish Office." },
  { title: "Christmas Charity Drive a Huge Success", date: "Jan 10, 2026", author: "Charity Committee", excerpt: "The parish raised over ₦3.5 million during the Christmas charity drive, providing food hampers and school supplies to over 500 families." },
];

const News = () => (
  <Layout>
    <section className="py-24">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <SectionHeading subtitle="Stay Informed" title="Parish News & Updates" description="Read the latest happenings and announcements from our parish community." />
        <div className="space-y-6">
          {articles.map((a, i) => (
            <motion.article
              key={a.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-parish transition-shadow group cursor-pointer"
            >
              <div className="flex items-center gap-3 text-xs text-accent font-medium mb-3">
                <BookOpen className="h-3 w-3" />
                <span>{a.date}</span>
                <span className="text-muted-foreground">• {a.author}</span>
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                {a.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{a.excerpt}</p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:text-accent transition-colors">
                Read More <ArrowRight className="h-3 w-3" />
              </span>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default News;
