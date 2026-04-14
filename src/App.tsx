import { Toaster } from "@/components/ui/toaster";

import { Toaster as Sonner } from "@/components/ui/sonner";

import { TooltipProvider } from "@/components/ui/tooltip";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";

import About from "./pages/About";

import MassSchedule from "./pages/MassSchedule";

import Events from "./pages/Events";

import Projects from "./pages/Projects";

import News from "./pages/News";

import Gallery from "./pages/Gallery";

import Contact from "./pages/Contact";

import ParishPriests from "./pages/ParishPriests";

import BaptismalRecords from "./pages/BaptismalRecords";

import NotFound from "./pages/NotFound";



const queryClient = new QueryClient();



const App = () => (

  <QueryClientProvider client={queryClient}>

    <TooltipProvider>

      <Toaster />

      <Sonner />

      <BrowserRouter>

        <Routes>

          <Route path="/" element={<Index />} />

          <Route path="/about" element={<About />} />

          <Route path="/parish-priests" element={<ParishPriests />} />

          <Route path="/mass-schedule" element={<MassSchedule />} />

          <Route path="/events" element={<Events />} />

          <Route path="/projects" element={<Projects />} />

          <Route path="/news" element={<News />} />

          <Route path="/gallery" element={<Gallery />} />

          <Route path="/contact" element={<Contact />} />

          <Route path="/baptismal-records" element={<BaptismalRecords />} />

          <Route path="*" element={<NotFound />} />

        </Routes>

      </BrowserRouter>

    </TooltipProvider>

  </QueryClientProvider>

);



export default App;

