import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Donations from "./pages/Donations";
import DonationDetails from "./pages/DonationDetails";
import DonateFood from "./pages/DonateFood";
import ManageDonations from "./pages/ManageDonations";
import EditDonation from "./pages/EditDonation";
import NotFound from "./pages/NotFound";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/donations/:id" element={<DonationDetails />} />
          <Route path="/donate" element={<DonateFood />} />
          <Route path="/manage" element={<ManageDonations />} />
          <Route path="/edit/:id" element={<EditDonation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
