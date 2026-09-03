import { useState } from "react";
import { Plus, Trash2, Pencil, X, Star } from "lucide-react";
import { useReviews } from "../../hooks/useStore";
import { db } from "../../lib/store";
import { EmptyState } from "../../components/common/Misc";
import { imageFileToDataUrl } from "../../lib/imageUpload";

const EMPTY = {
  name: "",
  text: "",
  rating: 5,
  image_url: "",
  is_featured: true,
};

export default function AdminReviews() {
  const reviews = useReviews();

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [uploadingImage, setUploadingImage] = useState(false);

  /* ============================================================
     CREATED TIME
  ============================================================ */

  const getCreatedTime = (review) => {
    const value = review?.created_at || review?.createdAt;

    if (!value) return 0;

    const time = new Date(value).getTime();

    return Number.isNaN(time) ? 0 : time;
  };

  /* ============================================================
     SORT REVIEWS
  ============================================================ */

  const sortedReviews = [...(reviews || [])].sort(
    (a, b) => getCreatedTime(b) - getCreatedTime(a)
  );

  /* ============================================================
     NEW REVIEW
  ============================================================ */

  const openNew = () => {
    setForm({ ...EMPTY });
    setEditing("new");
  };

  /* ============================================================
     EDIT REVIEW
  ============================================================ */

  const openEdit = (review) => {
    setForm({
      ...EMPTY,
      ...review,

      // Support old data if any
      name:
        review?.name ||
        review?.customer_name ||
        "",

      text:
        review?.text ||
        review?.review_text ||
        "",

      rating: Number(review?.rating) || 5,

      image_url:
        review?.image_url || "",

      is_featured:
        Boolean(review?.is_featured),
    });

    setEditing(review);
  };

  /* ============================================================
     CLOSE MODAL
  ============================================================ */

  const close = () => {
    if (uploadingImage) return;

    setEditing(null);
    setForm({ ...EMPTY });
  };

  /* ============================================================
     SAVE REVIEW
  ============================================================ */

  const save = async (e) => {
    e.preventDefault();

    const reviewText = form.text?.trim();

    if (!reviewText) {
      alert("Please enter the review text.");
      return;
    }

    const review = {
      id: editing === "new" ? undefined : editing?.id,

      name:
        form.name?.trim() || "Anonymous",

      text: reviewText,

      rating: Math.min(
        5,
        Math.max(1, Number(form.rating) || 5)
      ),

      image_url:
        form.image_url || "",

      is_featured:
        Boolean(form.is_featured),
    };

    console.log("Saving review:", review);

    try {
      await db.saveReview(review);

      close();
    } catch (error) {
      console.error("Review save failed:", error);

      alert(
        error?.message ||
          "Unable to save review."
      );
    }
  };

  /* ============================================================
     DELETE
  ============================================================ */

  const deleteReview = async (review) => {
    const confirmed = window.confirm(
      "Delete this review?"
    );

    if (!confirmed) return;

    try {
      await db.deleteReview(review.id);
    } catch (error) {
      console.error(
        "Review delete failed:",
        error
      );

      alert(
        error?.message ||
          "Unable to delete review."
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
            Customer Reviews
          </h1>

          <p className="mt-1 text-sm text-mist">
            Reviews marked "Show in Showcase" appear
            in the Reviews carousel on the Home page.
          </p>
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

          Add Review
        </button>
      </div>

      {/* ======================================================
          REVIEWS LIST
      ======================================================= */}

      <div className="mt-8">
        {!sortedReviews.length ? (
          <EmptyState
            title="No reviews yet"
            message="Reviews you add here can be showcased on the Home page."
            actionLabel="Add Review"
            onAction={openNew}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {sortedReviews.map((review) => {
              const reviewName =
                review.name ||
                review.customer_name ||
                "Anonymous";

              const reviewText =
                review.text ||
                review.review_text ||
                "";

              const rating =
                Number(review.rating) || 5;

              return (
                <div
                  key={review.id}
                  className="rounded-2xl border border-line bg-charcoal/20 p-4"
                >
                  {/* ==================================================
                      CUSTOMER
                  ================================================== */}

                  <div className="flex items-start gap-3">
                    {review.image_url ? (
                      <img
                        src={review.image_url}
                        alt=""
                        className="h-11 w-11 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-[11px] text-mist">
                        {reviewName?.[0]?.toUpperCase() ||
                          "?"}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium text-bone">
                          {reviewName}
                        </p>

                        {review.is_featured && (
                          <span className="shrink-0 rounded-full border border-bone/30 bg-bone px-2.5 py-1 text-[9px] font-semibold uppercase tracking-widest text-ink">
                            In Showcase
                          </span>
                        )}
                      </div>

                      {/* STARS */}

                      <div className="mt-1 flex items-center gap-0.5">
                        {Array.from({
                          length: 5,
                        }).map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            strokeWidth={1}
                            className={
                              i < rating
                                ? "fill-bone text-bone"
                                : "text-line-strong"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ==================================================
                      REVIEW TEXT
                  ================================================== */}

                  <p className="mt-3 text-[13px] leading-relaxed text-bone/90">
                    “{reviewText}”
                  </p>

                  {/* ==================================================
                      ACTIONS
                  ================================================== */}

                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        openEdit(review)
                      }
                      className="flex items-center gap-1.5 rounded-full border border-line-strong px-3 py-1.5 text-[11px] text-bone transition-colors hover:bg-white/5"
                    >
                      <Pencil size={12} />

                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteReview(review)
                      }
                      className="flex items-center gap-1.5 rounded-full border border-line-strong px-3 py-1.5 text-[11px] text-bone transition-colors hover:bg-white/5"
                    >
                      <Trash2 size={12} />

                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================
          MODAL
      ======================================================== */}

      {editing && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4 py-6"
          onClick={(e) => {
            if (
              e.target === e.currentTarget
            ) {
              close();
            }
          }}
        >
          <form
            onSubmit={save}
            className="glass-strong max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl p-6"
          >
            {/* ==================================================
                MODAL HEADER
            ================================================== */}

            <div className="mb-5 flex items-center justify-between">
              <p className="font-display text-xl text-bone">
                {editing === "new"
                  ? "Add Review"
                  : "Edit Review"}
              </p>

              <button
                type="button"
                onClick={close}
                disabled={uploadingImage}
                className="text-mist transition-colors hover:text-bone disabled:opacity-50"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {/* ==================================================
                  CUSTOMER NAME
              ================================================== */}

              <Field
                label="Customer Name"
                value={form.name}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    name: value,
                  }))
                }
                placeholder="e.g. Aravind K."
              />

              {/* ==================================================
                  REVIEW TEXT
              ================================================== */}

              <div>
                <label className="mb-1.5 block text-[11px] text-mist">
                  Review Text{" "}
                  <span className="text-bone">
                    *
                  </span>
                </label>

                <textarea
                  value={form.text || ""}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      text: e.target.value,
                    }))
                  }
                  placeholder="What did the customer say?"
                  rows={4}
                  className="w-full rounded-2xl border border-line bg-charcoal/40 px-4 py-2.5 text-sm text-bone placeholder:text-mist/60 focus:border-line-strong focus:outline-none"
                />
              </div>

              {/* ==================================================
                  RATING
              ================================================== */}

              <div>
                <label className="mb-1.5 block text-[11px] text-mist">
                  Rating
                </label>

                <div className="flex items-center gap-1.5">
                  {Array.from({
                    length: 5,
                  }).map((_, i) => {
                    const value = i + 1;

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setForm(
                            (current) => ({
                              ...current,
                              rating: value,
                            })
                          )
                        }
                        className="p-0.5"
                        aria-label={`${value} star${
                          value > 1
                            ? "s"
                            : ""
                        }`}
                      >
                        <Star
                          size={22}
                          strokeWidth={1.25}
                          className={
                            value <=
                            (form.rating || 0)
                              ? "fill-bone text-bone"
                              : "text-line-strong"
                          }
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ==================================================
                  CUSTOMER PHOTO
              ================================================== */}

              <div>
                <label className="mb-1.5 block text-[11px] text-mist">
                  Customer Photo (Optional)
                </label>

                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-line-strong bg-charcoal/40 p-3 text-sm text-bone transition-colors hover:bg-white/5 ${
                    uploadingImage
                      ? "pointer-events-none opacity-60"
                      : ""
                  }`}
                >
                  {form.image_url ? (
                    <img
                      src={form.image_url}
                      alt="Preview"
                      className="h-16 w-16 rounded-full bg-black/20 object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-line text-[11px] text-mist">
                      Upload
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="text-xs text-bone">
                      {uploadingImage
                        ? "Uploading…"
                        : form.image_url
                        ? "Change photo"
                        : "Choose photo from device"}
                    </p>

                    <p className="mt-1 text-[10px] text-mist">
                      Optional — shown next to the
                      customer's name
                    </p>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={
                      uploadingImage
                    }
                    onChange={async (e) => {
                      const file =
                        e.target.files?.[0];

                      if (!file) return;

                      setUploadingImage(
                        true
                      );

                      try {
                        const image_url =
                          await imageFileToDataUrl(
                            file,
                            {
                              maxSize: 400,
                            }
                          );

                        setForm(
                          (current) => ({
                            ...current,
                            image_url,
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

              {/* ==================================================
                  SHOWCASE
              ================================================== */}

              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-line bg-charcoal/40 px-4 py-3">
                <input
                  type="checkbox"
                  checked={Boolean(
                    form.is_featured
                  )}
                  onChange={(e) =>
                    setForm(
                      (current) => ({
                        ...current,
                        is_featured:
                          e.target.checked,
                      })
                    )
                  }
                  className="h-4 w-4 accent-bone"
                />

                <div>
                  <p className="text-sm text-bone">
                    Show in Reviews Showcase
                  </p>

                  <p className="text-[11px] text-mist">
                    Displays this review in the
                    carousel on the Home page.
                  </p>
                </div>
              </label>
            </div>

            {/* ==================================================
                SAVE BUTTON
            ================================================== */}

            <button
              type="submit"
              disabled={
                uploadingImage ||
                !form.text?.trim()
              }
              className="mt-6 w-full rounded-full bg-bone py-3 text-xs font-semibold uppercase tracking-widest text-ink transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            >
              {editing === "new"
                ? "Add Review"
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