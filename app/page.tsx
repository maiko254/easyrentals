import Hero from "./components/Hero";
import SearchBar from "./components/SearchBar";
import FeaturedListings from "./components/FeaturedListings";
import CallToAction from "./components/CallToAction";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Hero />
      <SearchBar />
      <FeaturedListings />
      <CallToAction />
    </main>
  );
}
