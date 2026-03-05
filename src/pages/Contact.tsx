import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send, Facebook, Instagram } from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message Sent!", description: "Thank you for reaching out. We'll get back to you soon." });
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading subtitle="Reach Out" title="Contact Us" description="We'd love to hear from you. Send us a message or visit us at the parish." />

          <div className="grid lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-5"
            >
              {[
                { name: "name", label: "Full Name", type: "text" },
                { name: "email", label: "Email Address", type: "email" },
                { name: "subject", label: "Subject", type: "text" },
              ].map((f) => (
                <div key={f.name}>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{f.label}</label>
                  <input
                    type={f.type}
                    required
                    value={form[f.name as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                <Send className="h-4 w-4" /> Send Message
              </button>
            </motion.form>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground mb-4">Parish Information</h3>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Address</p>
                      <p>St. Mary Catholic Parish, Trans-Ekulu, Enugu, Enugu State, Nigeria</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Phone</p>
                      <p>+234 803 000 0000</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Email</p>
                      <p>info@stmarytransekulu.org</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-heading text-lg font-bold text-foreground mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  <a href="#" className="p-3 rounded-full bg-muted text-foreground hover:bg-accent/20 hover:text-accent transition-colors">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="#" className="p-3 rounded-full bg-muted text-foreground hover:bg-accent/20 hover:text-accent transition-colors">
                    <Instagram className="h-5 w-5" />
                  </a>
                </div>
              </div>

              {/* Map */}
              <div className="rounded-lg overflow-hidden border border-border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.0!2d7.52!3d6.45!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMjcnMDAuMCJOIDfCsDMxJzEyLjAiRQ!5e0!3m2!1sen!2sng!4v1609459200000!5m2!1sen!2sng"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Parish Location"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
