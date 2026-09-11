import { useEffect, useState } from "react";
import { Mail, MapPin, Phone, Clock, CheckCircle2 } from "lucide-react";
import { useSettings } from "../hooks/useStore";
import { db } from "../lib/store";
import { Reveal } from "../components/common/Misc";
import Seo from "../components/common/Seo";
import { STATIC_ROUTES } from "../lib/seoRoutes";
import { breadcrumbJsonLd } from "../lib/seoConfig";

const CONTACT_ROUTE = STATIC_ROUTES.find((r) => r.path === "/contact");

export default function Contact() {
  const settings = useSettings();
  const [form, setForm] = useState({ name: "", email: "", mobile: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!/^[0-9]{10}$/.test(form.mobile.replace(/\D/g, "")))
      e.mobile = "Enter a valid 10-digit mobile number";
    if (!form.message.trim()) e.message = "Tell us how we can help";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    db.addMessage(form)
      .then(() => {
        setStatus("success");
        setForm({ name: "", email: "", mobile: "", message: "" });
      })
      .catch(() => setStatus("error"));
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-24 pt-28 sm:px-8">
      <Seo
        title={CONTACT_ROUTE.title}
        description={CONTACT_ROUTE.description}
        path={CONTACT_ROUTE.path}
        jsonLd={breadcrumbJsonLd(CONTACT_ROUTE.breadcrumbs)}
      />
      <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-mist">Get in Touch</p>
      <h1 className="mt-3 font-display text-[36px] leading-tight text-bone sm:text-[46px]">Contact Us</h1>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <div className="rounded-[24px] border border-line bg-charcoal/40 p-6 sm:p-8">
            <p className="mb-2 font-display text-2xl text-bone">Flagship Store</p>
            <p className="mb-6 text-sm text-mist">Come see the collection in person.</p>

            <div className="space-y-5 text-sm">
              <div className="flex items-start gap-3">
                <MapPin size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-bone" />
                <a href={settings.mapsUrl} target="_blank" rel="noreferrer" className="text-mist hover:text-bone">
                  {settings.address}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} strokeWidth={1.75} className="shrink-0 text-bone" />
                <span className="text-mist">
                  <a href={`tel:${settings.phone1}`} className="hover:text-bone">{settings.phone1}</a>
                  {" · "}
                  <a href={`tel:${settings.phone2}`} className="hover:text-bone">{settings.phone2}</a>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} strokeWidth={1.75} className="shrink-0 text-bone" />
                <a href={`mailto:${settings.email}`} className="text-mist hover:text-bone">{settings.email}</a>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={16} strokeWidth={1.75} className="shrink-0 text-bone" />
                <span className="text-mist">{settings.shopTiming}</span>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={onSubmit} noValidate className="rounded-[24px] border border-line p-6 sm:p-8">
            <p className="mb-6 font-display text-2xl text-bone">Send a Message</p>

            {status === "success" ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-charcoal/40 py-14 text-center">
                <CheckCircle2 size={28} strokeWidth={1.5} className="text-bone" />
                <p className="font-display text-xl text-bone">Message sent</p>
                <p className="max-w-xs text-sm text-mist">
                  Thanks for reaching out — our team will get back to you shortly.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-2 text-xs uppercase tracking-widest text-mist underline underline-offset-4 hover:text-bone"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <Field
                  label="Name"
                  value={form.name}
                  error={errors.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                />
                <Field
                  label="Email"
                  type="email"
                  value={form.email}
                  error={errors.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                />
                <Field
                  label="Mobile Number"
                  type="tel"
                  value={form.mobile}
                  error={errors.mobile}
                  onChange={(v) => setForm({ ...form, mobile: v })}
                />
                <div>
                  <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-mist">
                    How Can We Help?
                  </label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full resize-none rounded-2xl border border-line bg-charcoal/40 px-4 py-3 text-sm text-bone placeholder:text-mist focus:border-line-strong focus:outline-none"
                    placeholder="Tell us what you need…"
                  />
                  {errors.message && <p className="mt-1 text-[11px] text-bone/80">{errors.message}</p>}
                </div>

                {status === "error" && (
                  <p className="text-[12px] text-bone/80">
                    Something went wrong sending your message. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full rounded-full bg-bone py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-opacity disabled:opacity-60"
                >
                  {status === "loading" ? "Sending…" : "Submit"}
                </button>
              </div>
            )}
          </form>
        </Reveal>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, error, type = "text" }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-mist">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-full border border-line bg-charcoal/40 px-4 py-3 text-sm text-bone placeholder:text-mist focus:border-line-strong focus:outline-none"
      />
      {error && <p className="mt-1 text-[11px] text-bone/80">{error}</p>}
    </div>
  );
}
