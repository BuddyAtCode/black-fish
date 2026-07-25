import { AnimatePresence, motion } from "framer-motion";
import { ReactLenis } from "lenis/react";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import PageLoader from "./components/PageLoader";
import SiteChrome from "./components/SiteChrome";
import ArtistProfile from "./pages/ArtistProfile";
import Artists from "./pages/Artists";
import Booking from "./pages/Booking";
import Eshop from "./pages/Eshop";
import Landing from "./pages/Landing";
import Portfolio from "./pages/Portfolio";

function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <SiteChrome />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          className="page-transition"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
        >
          <Routes location={location}>
            <Route path="/" element={<Landing />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/artists/:artistSlug" element={<ArtistProfile />} />
            <Route path="/eshop" element={<Eshop />} />
            <Route path="/booking" element={<Booking />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ReactLenis root options={{ lerp: 0.075, smoothWheel: true }}>
        <PageLoader />
        <AnimatedRoutes />
      </ReactLenis>
    </BrowserRouter>
  );
}
