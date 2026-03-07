import { Link } from "react-router-dom";
import { Cross, MapPin, Phone, Mail, Facebook, Instagram } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground text-primary-foreground">
    <div className="container mx-auto px-4 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Cross className="h-6 w-6 text-accent" />
            <span className="font-heading text-lg font-semibold">St. Mary Parish</span>
          </div>
          <p className="text-primary-foreground/70 text-sm font-body leading-relaxed">
            A vibrant Catholic community in Trans-Ekulu, Enugu — growing in faith, love, and service since 1982.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-heading text-sm font-semibold mb-4 text-accent">Quick Links</h4>
          <div className="flex flex-col gap-2">
            {[
              { label: "About Us", path: "/about" },
              { label: "Mass Schedule", path: "/mass-schedule" },
              { label: "Events", path: "/events" },
              { label: "Projects", path: "/projects" },
              { label: "News", path: "/news" },
              { label: "Gallery", path: "/gallery" },
            ].map((l) => (
              <Link key={l.path} to={l.path} className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-heading text-sm font-semibold mb-4 text-accent">Contact Us</h4>
          <div className="flex flex-col gap-3 text-sm text-primary-foreground/70">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-accent" />
              <span>Trans-Ekulu, Enugu, Nigeria</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-accent" />
              <span>+234 803 000 0000</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-accent" />
              <span>info@stmarytransekulu.org</span>
            </div>
          </div>
        </div>

        {/* Mass Times */}
        <div>
          <h4 className="font-heading text-sm font-semibold mb-4 text-accent">Mass Times</h4>
          <div className="flex flex-col gap-2 text-sm text-primary-foreground/70">
            <p><span className="text-primary-foreground/90 font-medium">Sunday:</span> 6:00 AM, 8:00 AM, 10:00 AM, 6:00 PM</p>
            <p><span className="text-primary-foreground/90 font-medium">Weekdays:</span> 6:00 AM, 6:00 PM</p>
            <p><span className="text-primary-foreground/90 font-medium">Saturday:</span> 6:00 AM, 7:00 PM (Vigil)</p>
          </div>
          <div className="flex gap-3 mt-4">
            <a href="#" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-accent/20 transition-colors">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="#" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-accent/20 transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center text-xs text-primary-foreground/50">
        © {new Date().getFullYear()} St. Mary Catholic Parish, Trans-Ekulu. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
