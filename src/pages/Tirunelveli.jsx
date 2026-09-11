import { useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Clock, MessageCircle } from "lucide-react";
import { useSettings } from "../hooks/useStore";
import { CATEGORIES } from "../lib/data";
import { whatsappGeneralUrl } from "../lib/whatsapp";
import { Reveal } from "../components/common/Misc";
import CategoryCard from "../components/common/CategoryCard";
import Seo from "../components/common/Seo";
import { STATIC_ROUTES } from "../lib/seoRoutes";
import { breadcrumbJsonLd, faqJsonLd } from "../lib/seoConfig";

const ROUTE = STATIC_ROUTES.find((r) => r.path === "/tirunelveli");
const FAQS = ROUTE.faqs;

export default function Tirunelveli() {
  const settings = useSettings();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pb-24 pt-36 sm:pt-40 lg:pt-44">
      <Seo
        title={ROUTE.title}
        description={ROUTE.description}
        path={ROUTE.path}
        jsonLd={[breadcrumbJsonLd(ROUTE.breadcrumbs), faqJsonLd(FAQS)]}
      />

      {/* =========================================
          PAGE HEADER
          ========================================= */}
      <section className="mx-auto max-w-[900px] px-4 text-center sm:px-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-mist">
          Tirunelveli, Tamil Nadu
        </p>

        <h1 className="mt-4 font-display text-[36px] leading-[1.1] text-bone sm:text-[52px]">
          Clothing &amp; Fashion Store in Tirunelveli
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-[1.9] text-mist">
          {settings.storyShort}
        </p>
      </section>

      {/* =========================================
          STORE DETAILS
          ========================================= */}
      <Reveal className="mx-auto mt-14 max-w-[900px] px-4 sm:px-8">
        <div className="grid gap-6 rounded-[24px] border border-line bg-charcoal/40 p-6 sm:grid-cols-2 sm:p-8">
          <div className="flex items-start gap-3">
            <MapPin size={17} strokeWidth={1.75} className="mt-0.5 shrink-0 text-bone" />
            <div>
              <p className="text-[11px] font-medium uppercase tracking-widest text-mist">Address</p>
              <a
                href={settings.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block text-sm text-bone hover:underline"
              >
                {settings.address}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock size={17} strokeWidth={1.75} className="mt-0.5 shrink-0 text-bone" />
            <div>
              <p className="text-[11px] font-medium uppercase tracking-widest text-mist">Hours</p>
              <p className="mt-1 text-sm text-bone">{settings.shopTiming}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone size={17} strokeWidth={1.75} className="mt-0.5 shrink-0 text-bone" />
            <div>
              <p className="text-[11px] font-medium uppercase tracking-widest text-mist">Phone</p>
              <a href={`tel:${settings.phone1}`} className="mt-1 block text-sm text-bone hover:underline">
                {settings.phone1}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MessageCircle size={17} strokeWidth={1.75} className="mt-0.5 shrink-0 text-bone" />
            <div>
              <p className="text-[11px] font-medium uppercase tracking-widest text-mist">WhatsApp Ordering</p>
              <a
                href={whatsappGeneralUrl(settings.whatsapp, "Hello Retro Clothing 👋 I'd like to know more about your Tirunelveli store.")}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block text-sm text-bone hover:underline"
              >
                Chat with us
              </a>
            </div>
          </div>
        </div>
      </Reveal>

      {/* =========================================
          SHOP BY CATEGORY
          ========================================= */}
      <section className="mx-auto mt-20 max-w-[1200px] px-4 sm:px-8">
        <p className="mb-8 text-center text-[11px] font-medium uppercase tracking-[0.3em] text-mist">
          Shop the Tirunelveli Collection
        </p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>

      {/* =========================================
          FAQ
          ========================================= */}
      <section className="mx-auto mt-20 max-w-[760px] px-4 sm:px-8">
        <p className="mb-8 text-center text-[11px] font-medium uppercase tracking-[0.3em] text-mist">
          Frequently Asked Questions
        </p>

        <div className="space-y-4">
          {FAQS.map((faq) => (
            <Reveal key={faq.question} className="rounded-[20px] border border-line bg-charcoal/30 p-5">
              <p className="font-display text-lg text-bone">{faq.question}</p>
              <p className="mt-2 text-sm leading-relaxed text-mist">{faq.answer}</p>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-mist">
          Have another question?{" "}
          <Link to="/contact" className="text-bone hover:underline">
            Get in touch
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
