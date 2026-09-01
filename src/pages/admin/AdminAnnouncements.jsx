import { useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { useAnnouncements } from "../../hooks/useStore";
import { db } from "../../lib/store";
import { EmptyState } from "../../components/common/Misc";
import { imageFileToDataUrl } from "../../lib/imageUpload";

const EMPTY = {
  title: "",
  image: "",
  timing: "",
  location: "",
};

export default function AdminAnnouncements() {
  const announcements = useAnnouncements();

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [uploadingImage, setUploadingImage] = useState(false);

  /*
   * ============================================================
   * SORT ANNOUNCEMENTS
   *
   * Latest added announcement = FIRST
   * ============================================================
   */
  const getCreatedTime = (announcement) => {
    const value =
      announcement?.created_at ||
      announcement?.createdAt;

    if (!value) return 0;

    const time = new Date(value).getTime();

    return Number.isNaN(time) ? 0 : time;
  };

  const sortedAnnouncements = [
    ...(announcements || []),
  ].sort((a, b) => {
    return (
      getCreatedTime(b) -
      getCreatedTime(a)
    );
  });

  const openNew = () => {
    setForm({ ...EMPTY });
    setEditing("new");
  };

  const openEdit = (announcement) => {
    setForm({
      ...EMPTY,
      ...announcement,
    });

    setEditing(announcement);
  };

  const close = () => {
    if (uploadingImage) return;

    setEditing(null);
    setForm({ ...EMPTY });
  };

  const save = async (e) => {
    e.preventDefault();

    if (!form.image) {
      alert(
        "Please upload an announcement image."
      );
      return;
    }

    const announcement = {
      ...form,

      /*
       * New announcement gets no ID.
       * store.js will generate ID + created_at.
       *
       * Existing announcement keeps its ID
       * and its original created_at.
       */
      id:
        editing === "new"
          ? undefined
          : editing.id,

      title:
        form.title?.trim() || "",

      timing:
        form.timing?.trim() || "",

      location:
        form.location?.trim() || "",

      image: form.image,

      /*
       * Do NOT manually change created_at here.
       * store.js controls creation time.
       */
    };

    try {
      await db.saveAnnouncement(
        announcement
      );

      close();
    } catch (error) {
      alert(
        error?.message ||
          "Unable to save announcement."
      );
    }
  };

  return (
    <div>
      {/* ======================================================
          HEADER
      ======================================================= */}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest text-mist">
            Manage
          </p>

          <h1 className="mt-2 font-display text-3xl text-bone">
            Announcements
          </h1>
        </div>

        <button
          type="button"
          onClick={openNew}
          className="flex items-center gap-2 rounded-full bg-bone px-5 py-3 text-xs font-semibold uppercase tracking-widest text-ink"
        >
          <Plus
            size={14}
            strokeWidth={2}
          />

          Add Announcement
        </button>
      </div>

      {/* ======================================================
          ANNOUNCEMENTS
      ======================================================= */}

      <div className="mt-8">
        {!sortedAnnouncements.length ? (
          <EmptyState
            title="No announcements yet"
            message="Announcements you add here appear on the Home page automatically."
            actionLabel="Add Announcement"
            onAction={openNew}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {sortedAnnouncements.map(
              (announcement, index) => (
                <div
                  key={announcement.id}
                  className="overflow-hidden rounded-2xl border border-line bg-charcoal/20"
                >
                  {/* IMAGE */}

                  <div className="flex w-full justify-center bg-black/10">
                    <img
                      src={announcement.image}
                      alt={
                        announcement.title ||
                        "Announcement"
                      }
                      className="block h-auto max-h-[420px] w-auto max-w-full object-contain"
                    />
                  </div>

                  {/* DETAILS */}

                  <div className="p-4">
                    {/* NEWEST BADGE */}

                    {index === 0 && (
                      <span className="mb-2 inline-flex rounded-full border border-bone/30 bg-bone px-2.5 py-1 text-[9px] font-semibold uppercase tracking-widest text-ink">
                        Latest
                      </span>
                    )}

                    {announcement.title ? (
                      <p className="font-display text-lg text-bone">
                        {announcement.title}
                      </p>
                    ) : (
                      <p className="text-sm text-mist">
                        No title
                      </p>
                    )}

                    {announcement.timing && (
                      <p className="mt-1 text-xs text-mist">
                        {announcement.timing}
                      </p>
                    )}

                    {announcement.location && (
                      <p className="text-xs text-mist">
                        {announcement.location}
                      </p>
                    )}

                    <div className="mt-3 flex gap-2">
                      {/* EDIT */}

                      <button
                        type="button"
                        onClick={() =>
                          openEdit(
                            announcement
                          )
                        }
                        className="flex items-center gap-1.5 rounded-full border border-line-strong px-3 py-1.5 text-[11px] text-bone transition-colors hover:bg-white/5"
                      >
                        <Pencil size={12} />

                        Edit
                      </button>

                      {/* DELETE */}

                      <button
                        type="button"
                        onClick={() => {
                          const confirmed =
                            window.confirm(
                              "Delete this announcement?"
                            );

                          if (
                            confirmed
                          ) {
                            db.deleteAnnouncement(
                              announcement.id
                            ).catch((error) => alert(error?.message || "Unable to delete announcement."));
                          }
                        }}
                        className="flex items-center gap-1.5 rounded-full border border-line-strong px-3 py-1.5 text-[11px] text-bone transition-colors hover:bg-white/5"
                      >
                        <Trash2
                          size={12}
                        />

                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* ======================================================
          MODAL
      ======================================================= */}

      {editing && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4 py-6"
          onClick={(e) => {
            if (
              e.target ===
              e.currentTarget
            ) {
              close();
            }
          }}
        >
          <form
            onSubmit={save}
            className="glass-strong max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl p-6"
          >
            {/* MODAL HEADER */}

            <div className="mb-5 flex items-center justify-between">
              <p className="font-display text-xl text-bone">
                {editing === "new"
                  ? "Add Announcement"
                  : "Edit Announcement"}
              </p>

              <button
                type="button"
                onClick={close}
                disabled={
                  uploadingImage
                }
                className="text-mist transition-colors hover:text-bone disabled:opacity-50"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {/* TITLE */}

              <Field
                label="Title (Optional)"
                value={form.title}
                onChange={(value) =>
                  setForm(
                    (current) => ({
                      ...current,
                      title: value,
                    })
                  )
                }
                placeholder="e.g. New Collection"
              />

              {/* IMAGE */}

              <div>
                <label className="mb-1.5 block text-[11px] text-mist">
                  Announcement Image
                  <span className="ml-1 text-bone">
                    *
                  </span>
                </label>

                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-line-strong bg-charcoal/40 p-3 text-sm text-bone transition-colors hover:bg-white/5 ${
                    uploadingImage
                      ? "pointer-events-none opacity-60"
                      : ""
                  }`}
                >
                  {form.image ? (
                    <img
                      src={form.image}
                      alt="Preview"
                      className="h-16 w-16 rounded-xl bg-black/20 object-contain"
                    />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-line text-[11px] text-mist">
                      Upload
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="text-xs text-bone">
                      {uploadingImage
                        ? "Uploading…"
                        : form.image
                        ? "Change image"
                        : "Choose image from device"}
                    </p>

                    <p className="mt-1 text-[10px] text-mist">
                      Image is required
                    </p>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={
                      uploadingImage
                    }
                    onChange={async (
                      e
                    ) => {
                      const file =
                        e.target.files?.[0];

                      if (!file) return;

                      setUploadingImage(
                        true
                      );

                      try {
                        const image =
                          await imageFileToDataUrl(
                            file
                          );

                        setForm(
                          (current) => ({
                            ...current,
                            image,
                          })
                        );
                      } catch (error) {
                        alert(
                          error?.message ||
                            "Unable to upload image."
                        );
                      } finally {
                        setUploadingImage(
                          false
                        );

                        e.target.value =
                          "";
                      }
                    }}
                  />
                </label>
              </div>

              {/* TIMING */}

              <Field
                label="Timing (Optional)"
                value={form.timing}
                onChange={(value) =>
                  setForm(
                    (current) => ({
                      ...current,
                      timing: value,
                    })
                  )
                }
                placeholder="e.g. 6–8 Sept, 5–9 PM"
              />

              {/* LOCATION */}

              <Field
                label="Location (Optional)"
                value={form.location}
                onChange={(value) =>
                  setForm(
                    (current) => ({
                      ...current,
                      location: value,
                    })
                  )
                }
                placeholder="e.g. Tirunelveli"
              />
            </div>

            {/* SAVE */}

            <button
              type="submit"
              disabled={
                uploadingImage ||
                !form.image
              }
              className="mt-6 w-full rounded-full bg-bone py-3 text-xs font-semibold uppercase tracking-widest text-ink transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            >
              {editing === "new"
                ? "Add Announcement"
                : "Save Changes"}
            </button>
          </form>
        </div>
      )}
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
  placeholder = "",
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] text-mist">
        {label}
      </label>

      <input
        type="text"
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-full border border-line bg-charcoal/40 px-4 py-2.5 text-sm text-bone placeholder:text-mist/60 focus:border-line-strong focus:outline-none"
      />
    </div>
  );
}