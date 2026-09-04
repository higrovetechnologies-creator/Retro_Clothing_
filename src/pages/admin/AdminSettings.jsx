import { useEffect, useState } from "react";
import { useSettings } from "../../hooks/useStore";
import { db } from "../../lib/store";
import { imageFileToDataUrl } from "../../lib/imageUpload";

export default function AdminSettings() {
  const settings = useSettings();

  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  const [uploadingFounder, setUploadingFounder] =
    useState(false);

  const [uploadingCofounder, setUploadingCofounder] =
    useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const set = (key, value) =>
    setForm((f) => ({
      ...f,
      [key]: value,
    }));

  const setNested = (parent, key, value) =>
    setForm((f) => ({
      ...f,
      [parent]: {
        ...f[parent],
        [key]: value,
      },
    }));

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await db.saveSettings(form);

      setSaved(true);

      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      alert(
        error?.message ||
          "Unable to save settings."
      );
    }
  };

  return (
    <div className="mx-auto max-w-3xl">

      <p className="text-[11px] font-medium uppercase tracking-widest text-mist">
        Configuration
      </p>

      <h1 className="mt-2 font-display text-3xl text-bone">
        Company Settings
      </h1>

      <p className="mt-2 text-sm text-mist">
        Changes here update the footer, contact page,
        WhatsApp ordering number and Our Story page
        across the site.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-8 space-y-8"
      >

        {/* ==================================================
            COMPANY DETAILS
        ================================================== */}

        <Section title="Company Details">

          <Field
            label="Company Name"
            value={form.name}
            onChange={(v) =>
              set("name", v)
            }
          />

          <Field
            label="Tagline"
            value={form.tagline}
            onChange={(v) =>
              set("tagline", v)
            }
          />

          <Field
            label="Since Year"
            value={form.since}
            onChange={(v) =>
              set("since", v)
            }
          />

          <TextArea
            label="Address"
            value={form.address}
            onChange={(v) =>
              set("address", v)
            }
          />

          <Field
            label="District"
            value={form.district}
            onChange={(v) =>
              set("district", v)
            }
          />

        </Section>

        {/* ==================================================
            CONTACT
        ================================================== */}

        <Section title="Contact">

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <Field
              label="Primary Mobile"
              value={form.phone1}
              onChange={(v) =>
                set("phone1", v)
              }
            />

            <Field
              label="Secondary Mobile"
              value={form.phone2}
              onChange={(v) =>
                set("phone2", v)
              }
            />

          </div>

          <Field
            label="WhatsApp Number (with country code)"
            value={form.whatsapp}
            onChange={(v) =>
              set("whatsapp", v)
            }
          />

          <Field
            label="Email"
            value={form.email}
            onChange={(v) =>
              set("email", v)
            }
          />

          <Field
            label="Instagram Link"
            value={form.instagram}
            onChange={(v) =>
              set("instagram", v)
            }
          />

          <Field
            label="Google Maps URL"
            value={form.mapsUrl}
            onChange={(v) =>
              set("mapsUrl", v)
            }
          />

          <Field
            label="Shop Timing"
            value={form.shopTiming}
            onChange={(v) =>
              set("shopTiming", v)
            }
          />

        </Section>

        {/* ==================================================
            LEADERSHIP
        ================================================== */}

        <Section title="Leadership">

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* ==================================================
                BALAJI — FOUNDER
            ================================================== */}

            <Field
              label="Founder Name"
              value={form.founder?.name}
              onChange={(v) =>
                setNested(
                  "founder",
                  "name",
                  v
                )
              }
            />

            <ImageUploadField
              label="Founder Photo"
              value={form.founder?.image}
              uploading={uploadingFounder}
              onUpload={async (file) => {

                setUploadingFounder(true);

                try {

                  const image =
                    await imageFileToDataUrl(
                      file
                    );

                  setNested(
                    "founder",
                    "image",
                    image
                  );

                } catch (error) {

                  alert(
                    error?.message ||
                      "Unable to upload image."
                  );

                } finally {

                  setUploadingFounder(false);

                }
              }}
            />

            {/* ==================================================
                SURYA — FOUNDER & CEO
            ================================================== */}

            <Field
              label="CEO Name"
              value={form.cofounder?.name}
              onChange={(v) =>
                setNested(
                  "cofounder",
                  "name",
                  v
                )
              }
            />

            <ImageUploadField
              label="CEO Photo"
              value={form.cofounder?.image}
              uploading={uploadingCofounder}
              onUpload={async (file) => {

                setUploadingCofounder(true);

                try {

                  const image =
                    await imageFileToDataUrl(
                      file
                    );

                  setNested(
                    "cofounder",
                    "image",
                    image
                  );

                } catch (error) {

                  alert(
                    error?.message ||
                      "Unable to upload image."
                  );

                } finally {

                  setUploadingCofounder(false);

                }
              }}
            />

          </div>

          {/* ==================================================
              LEADERSHIP SUMMARY
          ================================================== */}

          <div className="mt-5 rounded-2xl border border-line bg-charcoal/40 p-4">

            <p className="text-[11px] font-medium uppercase tracking-widest text-mist">
              Leadership
            </p>

            <div className="mt-3 space-y-2">

              <p className="text-sm text-bone">
                {form.founder?.name || "Balaji"}{" "}
                <span className="text-mist">
                  — Founder
                </span>
              </p>

              <p className="text-sm text-bone">
                {form.cofounder?.name || "Surya"}{" "}
                <span className="text-mist">
                  — CEO
                </span>
              </p>

            </div>

          </div>

        </Section>

        {/* ==================================================
            OUR STORY
        ================================================== */}

        <Section title="Our Story">

          <TextArea
            label="Short Description (Home page teaser)"
            value={form.storyShort}
            onChange={(v) =>
              set("storyShort", v)
            }
            rows={3}
          />

          <TextArea
            label="Full Story (Our Story page)"
            value={form.storyLong}
            onChange={(v) =>
              set("storyLong", v)
            }
            rows={6}
          />

        </Section>

        {/* ==================================================
            DELIVERY INFORMATION
        ================================================== */}

        <Section title="Delivery Information">

          <TextArea
            label="Delivery Information"
            value={form.deliveryInfo}
            onChange={(v) =>
              set("deliveryInfo", v)
            }
            rows={2}
          />

        </Section>

        {/* ==================================================
            SAVE
        ================================================== */}

        <div className="flex items-center gap-4">

          <button
            type="submit"
            className="rounded-full bg-bone px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-ink"
          >
            Save Changes
          </button>

          {saved && (
            <span className="text-xs text-mist">
              Saved — live on the website.
            </span>
          )}

        </div>

      </form>

    </div>
  );
}

/* ============================================================
   IMAGE UPLOAD FIELD
============================================================ */

function ImageUploadField({
  label,
  value,
  uploading,
  onUpload,
}) {
  return (
    <div>

      <label className="mb-1.5 block text-[11px] text-mist">
        {label}
      </label>

      <label
        className="
          flex
          cursor-pointer
          items-center
          gap-3
          rounded-2xl
          border
          border-dashed
          border-line-strong
          bg-charcoal/40
          p-3
          transition-colors
          hover:bg-white/5
        "
      >

        {value ? (
          <img
            src={value}
            alt="Preview"
            className="h-16 w-16 rounded-xl object-cover"
          />
        ) : (
          <div
            className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-xl
              border
              border-line
              text-[10px]
              text-mist
            "
          >
            Upload
          </div>
        )}

        <div>

          <p className="text-xs text-bone">
            {uploading
              ? "Uploading…"
              : "Choose image from device"}
          </p>

          <p className="mt-1 text-[10px] text-mist">
            No image URL needed
          </p>

        </div>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={(e) => {

            const file =
              e.target.files?.[0];

            if (file) {
              onUpload(file);
            }

            e.target.value = "";

          }}
        />

      </label>

    </div>
  );
}

/* ============================================================
   SECTION
============================================================ */

function Section({
  title,
  children,
}) {
  return (
    <div className="glass rounded-2xl p-6">

      <p className="mb-4 text-[11px] font-medium uppercase tracking-widest text-mist">
        {title}
      </p>

      <div className="space-y-4">
        {children}
      </div>

    </div>
  );
}

/* ============================================================
   FIELD
============================================================ */

function Field({
  label,
  value,
  onChange,
}) {
  return (
    <div>

      <label className="mb-1.5 block text-[11px] text-mist">
        {label}
      </label>

      <input
        value={value || ""}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="
          w-full
          rounded-full
          border
          border-line
          bg-charcoal/40
          px-4
          py-2.5
          text-sm
          text-bone
          focus:border-line-strong
          focus:outline-none
        "
      />

    </div>
  );
}

/* ============================================================
   TEXT AREA
============================================================ */

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
}) {
  return (
    <div>

      <label className="mb-1.5 block text-[11px] text-mist">
        {label}
      </label>

      <textarea
        rows={rows}
        value={value || ""}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="
          w-full
          resize-none
          rounded-2xl
          border
          border-line
          bg-charcoal/40
          px-4
          py-3
          text-sm
          text-bone
          focus:border-line-strong
          focus:outline-none
        "
      />

    </div>
  );
}
