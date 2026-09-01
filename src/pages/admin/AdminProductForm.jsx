import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  X,
  ImagePlus,
} from "lucide-react";

import { useProducts } from "../../hooks/useStore";
import { db } from "../../lib/store";
import { CATEGORY_SIZES } from "../../lib/data";
import { imageFileToDataUrl } from "../../lib/imageUpload";

const EMPTY = {
  name: "",
  description: "",
  product_code: "",

  was_price: "",
  now_price: "",

  category: "shirts",

  fabric: "",
  colour: "",
  occasion: "",
  care_instruction: "",

  sizes: [],
  images: [],

  is_new_arrival: false,
  is_offer: false,
  is_featured: false,

  // ONLY TWO OPTIONS
  stock_status: "in_stock",
};

export default function AdminProductForm() {
  const { id } = useParams();

  const products = useProducts();
  const navigate = useNavigate();

  const editing = Boolean(id);

  const [form, setForm] = useState(EMPTY);

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [imageInputKey, setImageInputKey] =
    useState(0);

  /* ============================================================
     LOAD EXISTING PRODUCT
  ============================================================ */

  useEffect(() => {
    if (!editing) {
      setForm(EMPTY);
      return;
    }

    const existing = products.find(
      (p) => p.id === id
    );

    if (existing) {
      setForm({
        ...EMPTY,
        ...existing,

        /*
          Old products without stock_status
          will automatically be In Stock.
        */
        stock_status:
          existing.stock_status === "out_of_stock"
            ? "out_of_stock"
            : "in_stock",

        images: Array.isArray(existing.images)
          ? existing.images
          : [],

        sizes: Array.isArray(existing.sizes)
          ? existing.sizes
          : [],
      });
    }
  }, [
    editing,
    id,
    products,
  ]);

  const availableSizes =
    CATEGORY_SIZES[form.category] || [];

  /* ============================================================
     CATEGORY
  ============================================================ */

  const changeCategory = (nextCategory) => {
    setForm((current) => ({
      ...current,

      category: nextCategory,

      sizes: current.sizes.filter(
        (size) =>
          (
            CATEGORY_SIZES[nextCategory] || []
          ).includes(size)
      ),
    }));
  };

  /* ============================================================
     SIZE
  ============================================================ */

  const toggleSize = (size) => {
    setForm((current) => ({
      ...current,

      sizes: current.sizes.includes(size)
        ? current.sizes.filter(
            (item) => item !== size
          )
        : [
            ...current.sizes,
            size,
          ],
    }));
  };

  /* ============================================================
     IMAGE UPLOAD
  ============================================================ */

  const handleImageUpload = async (e) => {
    const files = Array.from(
      e.target.files || []
    );

    if (!files.length) return;

    setUploadingImage(true);

    try {
      const uploaded = await Promise.all(
        files.map((file) =>
          imageFileToDataUrl(file)
        )
      );

      setForm((current) => ({
        ...current,

        images: [
          ...current.images,
          ...uploaded,
        ],
      }));
    } catch (error) {
      alert(
        error.message ||
          "Unable to upload image."
      );
    } finally {
      setUploadingImage(false);

      setImageInputKey(
        (key) => key + 1
      );
    }
  };

  /* ============================================================
     REMOVE IMAGE
  ============================================================ */

  const removeImage = (index) => {
    setForm((current) => ({
      ...current,

      images: current.images.filter(
        (_, i) => i !== index
      ),
    }));
  };

  /* ============================================================
     SUBMIT
  ============================================================ */

  const onSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.now_price ||
      form.images.length === 0 ||
      form.sizes.length === 0
    ) {
      alert(
        "Please fill in the product name, price, at least one image and one size."
      );

      return;
    }

    const slug = form.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    try {
      await db.saveProduct({
      ...form,

      id: editing
        ? id
        : undefined,

      slug,

      was_price:
        form.was_price
          ? Number(form.was_price)
          : null,

      now_price:
        Number(form.now_price),

      /*
        Ensure ONLY these two values.
      */
      stock_status:
        form.stock_status ===
        "out_of_stock"
          ? "out_of_stock"
          : "in_stock",
      });
      navigate("/admin/products");
    } catch (error) {
      alert(error?.message || "Unable to save product.");
    }
  };

  return (
    <div className="mx-auto max-w-3xl">

      {/* BACK */}

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-xs uppercase tracking-widest text-mist hover:text-bone"
      >
        <ArrowLeft size={14} />
        Back
      </button>

      {/* TITLE */}

      <h1 className="font-display text-3xl text-bone">
        {editing
          ? "Edit Product"
          : "Add Product"}
      </h1>

      <form
        onSubmit={onSubmit}
        className="mt-8 space-y-8"
      >

        {/* ======================================================
            BASIC INFORMATION
        ====================================================== */}

        <FormSection title="Basic Information">

          <TextField
            label="Product Name"
            value={form.name}
            onChange={(value) =>
              setForm({
                ...form,
                name: value,
              })
            }
          />

          <TextArea
            label="Description"
            value={form.description}
            onChange={(value) =>
              setForm({
                ...form,
                description: value,
              })
            }
          />

          <TextField
            label="Product Code"
            value={form.product_code}
            onChange={(value) =>
              setForm({
                ...form,
                product_code: value,
              })
            }
          />

        </FormSection>

        {/* ======================================================
            PRICING
        ====================================================== */}

        <FormSection title="Pricing">

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <TextField
              label="Was Price (₹)"
              type="number"
              value={form.was_price}
              onChange={(value) =>
                setForm({
                  ...form,
                  was_price: value,
                })
              }
            />

            <TextField
              label="Now Price (₹)"
              type="number"
              value={form.now_price}
              onChange={(value) =>
                setForm({
                  ...form,
                  now_price: value,
                })
              }
            />

          </div>

        </FormSection>

        {/* ======================================================
            STOCK
        ====================================================== */}

        <FormSection
          title="Stock Status"
          hint="Choose whether this product is currently available."
        >

          <div className="grid grid-cols-2 gap-3">

            {/* IN STOCK */}

            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  stock_status:
                    "in_stock",
                })
              }
              className={`rounded-2xl border px-4 py-4 text-left transition-all ${
                form.stock_status ===
                "in_stock"
                  ? "border-bone bg-bone text-ink"
                  : "border-line-strong text-bone hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-2">

                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    form.stock_status ===
                    "in_stock"
                      ? "bg-green-600"
                      : "bg-green-500"
                  }`}
                />

                <span className="text-sm font-medium">
                  In Stock
                </span>

              </div>

              <p
                className={`mt-1 text-[11px] ${
                  form.stock_status ===
                  "in_stock"
                    ? "text-ink/60"
                    : "text-mist"
                }`}
              >
                Product is available
              </p>
            </button>

            {/* OUT OF STOCK */}

            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  stock_status:
                    "out_of_stock",
                })
              }
              className={`rounded-2xl border px-4 py-4 text-left transition-all ${
                form.stock_status ===
                "out_of_stock"
                  ? "border-bone bg-bone text-ink"
                  : "border-line-strong text-bone hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-2">

                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    form.stock_status ===
                    "out_of_stock"
                      ? "bg-red-600"
                      : "bg-red-500"
                  }`}
                />

                <span className="text-sm font-medium">
                  Out of Stock
                </span>

              </div>

              <p
                className={`mt-1 text-[11px] ${
                  form.stock_status ===
                  "out_of_stock"
                    ? "text-ink/60"
                    : "text-mist"
                }`}
              >
                Product is unavailable
              </p>
            </button>

          </div>

        </FormSection>

        {/* ======================================================
            CATEGORY
        ====================================================== */}

        <FormSection title="Category">

          <div className="flex flex-wrap gap-2">

            {[
              "shirts",
              "tees",
              "pants",
            ].map((category) => (
              <button
                type="button"
                key={category}
                onClick={() =>
                  changeCategory(category)
                }
                className={`rounded-full border px-4 py-2 text-xs capitalize transition-colors ${
                  form.category ===
                  category
                    ? "border-bone bg-bone text-ink"
                    : "border-line-strong text-bone hover:bg-white/5"
                }`}
              >
                {category}
              </button>
            ))}

          </div>

        </FormSection>

        {/* ======================================================
            SIZES
        ====================================================== */}

        <FormSection title="Sizes">

          <div className="flex flex-wrap gap-2">

            {availableSizes.map((size) => (
              <button
                type="button"
                key={size}
                onClick={() =>
                  toggleSize(size)
                }
                className={`h-10 w-10 rounded-full border text-xs transition-colors ${
                  form.sizes.includes(size)
                    ? "border-bone bg-bone text-ink"
                    : "border-line-strong text-bone hover:bg-white/5"
                }`}
              >
                {size}
              </button>
            ))}

          </div>

        </FormSection>

        {/* ======================================================
            IMAGES
        ====================================================== */}

        <FormSection
          title="Product Images"
          hint="Select images directly from your device."
        >

          <div className="flex flex-wrap gap-3">

            {form.images.map(
              (image, index) => (
                <div
                  key={index}
                  className="relative h-24 w-20 overflow-hidden rounded-xl border border-line"
                >

                  <img
                    src={image}
                    alt={`Product ${
                      index + 1
                    }`}
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeImage(index)
                    }
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-bone"
                  >
                    <X size={11} />
                  </button>

                </div>
              )
            )}

            <label className="flex h-24 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line-strong text-mist hover:text-bone">

              <ImagePlus
                size={18}
                strokeWidth={1.75}
              />

              <span className="text-[10px]">
                {uploadingImage
                  ? "Uploading…"
                  : "Upload"}
              </span>

              <input
                key={imageInputKey}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={
                  handleImageUpload
                }
                disabled={
                  uploadingImage
                }
              />

            </label>

          </div>

        </FormSection>

        {/* ======================================================
            OPTIONAL DETAILS
        ====================================================== */}

        <FormSection title="Optional Details">

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

            <TextField
              label="Fabric"
              value={form.fabric}
              onChange={(value) =>
                setForm({
                  ...form,
                  fabric: value,
                })
              }
            />

            <TextField
              label="Colour"
              value={form.colour}
              onChange={(value) =>
                setForm({
                  ...form,
                  colour: value,
                })
              }
            />

            <TextField
              label="Occasion"
              value={form.occasion}
              onChange={(value) =>
                setForm({
                  ...form,
                  occasion: value,
                })
              }
            />

          </div>

        </FormSection>

        {/* ======================================================
            CARE
        ====================================================== */}

        <FormSection title="Care Instructions">

          <TextArea
            label="Care Instructions"
            hideLabel
            value={
              form.care_instruction
            }
            onChange={(value) =>
              setForm({
                ...form,
                care_instruction:
                  value,
              })
            }
          />

        </FormSection>

        {/* ======================================================
            DISPLAY OPTIONS
        ====================================================== */}

        <FormSection title="Display Options">

          <div className="flex flex-wrap gap-2">

            {[
              [
                "is_new_arrival",
                "New Arrival",
              ],
              [
                "is_offer",
                "Offer Product",
              ],
              [
                "is_featured",
                "Featured Product",
              ],
            ].map(
              ([key, label]) => (
                <button
                  type="button"
                  key={key}
                  onClick={() =>
                    setForm({
                      ...form,
                      [key]:
                        !form[key],
                    })
                  }
                  className={`rounded-full border px-4 py-2 text-xs transition-colors ${
                    form[key]
                      ? "border-bone bg-bone text-ink"
                      : "border-line-strong text-bone hover:bg-white/5"
                  }`}
                >
                  {label}
                </button>
              )
            )}

          </div>

        </FormSection>

        {/* ======================================================
            BUTTONS
        ====================================================== */}

        <div className="flex gap-3 pt-2">

          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="flex-1 rounded-full border border-line-strong py-3.5 text-xs uppercase tracking-widest text-bone hover:bg-white/5"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex-1 rounded-full bg-bone py-3.5 text-xs font-semibold uppercase tracking-widest text-ink"
          >
            {editing
              ? "Save Changes"
              : "Add Product"}
          </button>

        </div>

      </form>
    </div>
  );
}

/* ============================================================
   FORM SECTION
============================================================ */

function FormSection({
  title,
  hint,
  children,
}) {
  return (
    <div className="glass rounded-2xl p-6">

      <p className="mb-1 text-[11px] font-medium uppercase tracking-widest text-mist">
        {title}
      </p>

      {hint && (
        <p className="mb-4 text-[12px] text-mist/80">
          {hint}
        </p>
      )}

      <div className="mt-4">
        {children}
      </div>

    </div>
  );
}

/* ============================================================
   TEXT FIELD
============================================================ */

function TextField({
  label,
  value,
  onChange,
  type = "text",
}) {
  return (
    <div className="mb-4 last:mb-0">

      <label className="mb-1.5 block text-[11px] text-mist">
        {label}
      </label>

      <input
        type={type}
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-full border border-line bg-charcoal/40 px-4 py-2.5 text-sm text-bone focus:border-line-strong focus:outline-none"
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
  hideLabel = false,
}) {
  return (
    <div>

      {!hideLabel && (
        <label className="mb-1.5 block text-[11px] text-mist">
          {label}
        </label>
      )}

      <textarea
        rows={3}
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full resize-none rounded-2xl border border-line bg-charcoal/40 px-4 py-3 text-sm text-bone focus:border-line-strong focus:outline-none"
      />

    </div>
  );
}