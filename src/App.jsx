import { useEffect } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Chatbot from "./components/chatbot/Chatbot";
import Home from "./pages/Home";
import CollectionPage from "./pages/CollectionPage";
import ProductDetail from "./pages/ProductDetail";
import OurStory from "./pages/OurStory";
import Contact from "./pages/Contact";
import Tirunelveli from "./pages/Tirunelveli";
import Seo from "./components/common/Seo";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductForm from "./pages/admin/AdminProductForm";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminSettings from "./pages/admin/AdminSettings";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (!pathname.startsWith("/admin")) window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function SiteLayout({ children }) {
  return (
    <>
      <div className="grain" aria-hidden="true" />
      <Header />
      <main className="min-h-screen bg-ink">{children}</main>
      <Footer />
      <Chatbot />
    </>
  );
}

function PublicRoutes() {
  return (
    <SiteLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<CollectionPage mode="all" title="All Collection" eyebrow="Full Range" />} />
        <Route path="/new-arrivals" element={<CollectionPage mode="new" title="New Arrivals" eyebrow="Just Dropped" />} />
        <Route path="/offers" element={<CollectionPage mode="offers" title="Offer Products" eyebrow="Limited Time" />} />
        <Route path="/shirts" element={<CollectionPage mode="category" category="shirts" title="Shirts" eyebrow="Category" />} />
        <Route path="/tees" element={<CollectionPage mode="category" category="tees" title="Tees" eyebrow="Category" />} />
        <Route path="/pants" element={<CollectionPage mode="category" category="pants" title="Pants" eyebrow="Category" />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/our-story" element={<OurStory />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/tirunelveli" element={<Tirunelveli />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SiteLayout>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/:id/edit" element={<AdminProductForm />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route path="*" element={<PublicRoutes />} />
      </Routes>
    </>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 pt-20 text-center">
      <Seo title="Page Not Found" description="This page doesn't exist. Explore Retro Clothing's shirts, tees and pants." path="/404" noindex />
      <p className="font-display text-6xl text-bone">404</p>
      <p className="mt-3 text-mist">This page doesn't exist. Let's get you back on track.</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link to="/" className="rounded-full border border-line-strong px-6 py-3 text-xs uppercase tracking-widest text-bone hover:bg-white/5">
          Back to Home
        </Link>
        <Link to="/shirts" className="rounded-full border border-line-strong px-6 py-3 text-xs uppercase tracking-widest text-bone hover:bg-white/5">
          Shirts
        </Link>
        <Link to="/tees" className="rounded-full border border-line-strong px-6 py-3 text-xs uppercase tracking-widest text-bone hover:bg-white/5">
          Tees
        </Link>
        <Link to="/pants" className="rounded-full border border-line-strong px-6 py-3 text-xs uppercase tracking-widest text-bone hover:bg-white/5">
          Pants
        </Link>
      </div>
    </div>
  );
}
