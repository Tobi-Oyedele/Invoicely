import { useEffect } from "react";
import { Navbar } from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HowItWorks from "../components/home/HowItWorks";
import Features from "../components/home/Features";
import Hero from "../components/home/Hero";

const Home = () => {
  useEffect(() => {
    document.title =
      "Invoicely | Free Online Invoice Generator for Freelancers";
  }, []);

  return (
    <div className="min-h-screen text-fg bg-canvas font-sans antialiased selection:bg-line-strong">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Home;
