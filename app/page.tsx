import Hero from "../components/Home/Hero";
import Navbar from "../components/Home/Navbar";
import Features from "../components/Home/Features";
import Footer from "../components/Home/Footer";
import CTA from "@/components/Home/CTA";

export default function landingPage() {
  return (
    <div className="">
      <Navbar />
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
}
