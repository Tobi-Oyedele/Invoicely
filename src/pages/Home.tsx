import { Navbar } from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HowItWorks from "../components/home/HowItWorks";
import Features from "../components/home/Features";
import Hero from "../components/home/Hero";

const Home = () => {
  return (
    <div className="min-h-screen text-zinc-900 dark:text-zinc-50 font-sans antialiased selection:bg-zinc-100 dark:selection:bg-zinc-800 transition-colors">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Home;
