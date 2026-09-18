import { ReactNode } from "react";
import Navbar from "./Navbar";
import EventMarquee from "./EventMarquee";
import EventPopup from "./EventPopup";

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <EventMarquee />
    <EventPopup />
    <main className="flex-1 pt-20">{children}</main>
  </div>
);

export default Layout;
