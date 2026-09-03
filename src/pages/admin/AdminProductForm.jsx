import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  X,
  ImagePlus,
  Check,
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

  const [saving, setSaving] =
    useState(false);

  const [showSuccess, setShowSuccess] =
    useState(false);

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

        stock_status:
          existing.stock_status ===
          "out_of_stock"
            ? "out_of_stock"
            : "in_stock",

        images: Array.isArray(
          existing.images
        )
          ? existing.images
          : [],

        sizes: Array.isArray(
          existing.sizes
        )
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

  const changeCategory = (
    nextCategory
  ) => {
    setForm((current) => ({
      ...current,

      category: nextCategory,

      sizes: current.sizes.filter(
        (size) =>
          (
            CATEGORY_SIZES[
              nextCategory
            ] || []
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

  const handleImageUpload = async (
    e
  ) => {
    const files = Array.from(
      e.target.files || []
    );

    if (!files.length) return;

    setUploadingImage(true);

    try {
      const uploaded =
        await Promise.all(
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
        error?.message ||
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

    if (saving) return;

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

    setSaving(true);

    try {
      await db.saveProduct({
        ...form,

        id: editing
          ? id
          : undefined,

        was_price:
          form.was_price
            ? Number(
                form.was_price
              )
            : null,

        now_price:
          Number(
            form.now_price
          ),

        stock_status:
          form.stock_status ===
          "out_of_stock"
            ? "out_of_stock"
            : "in_stock",
      });

      /*
       * SHOW SUCCESS POPUP
       */

      setShowSuccess(true);

      /*
       * REDIRECT AFTER POPUP
       */

      setTimeout(() => {
        navigate(
          "/admin/products"
        );
      }, 1800);

    } catch (error) {
      console.error(
        "Product save failed:",
        error
      );

      alert(
        error?.message ||
          "Unable to save product."
      );

      setSaving(false);
    }
  };

  return (
    <>
      {/* ========================================================
          MAIN PAGE
      ======================================================== */}

      <div className="mx-auto max-w-3xl">

        {/* BACK */}

        <button
          type="button"
          onClick={() =>
            navigate(-1)
          }
          className="mb-6 flex items-center gap-2 text-xs uppercase tracking-widest text-mist transition-colors hover:text-bone"
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

        <p className="mt-2 text-sm text-mist">
          {editing
            ? "Update your product information and availability."
            : "Add a new product to your Retro Clothing collection."}
        </p>

        {/* FORM */}

        <form
          onSubmit={onSubmit}
          className="mt-8 space-y-8"
        >

          {/* BASIC INFORMATION */}

          <FormSection
            title="Basic Information"
          >

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
              value={
                form.description
              }
              onChange={(value) =>
                setForm({
                  ...form,
                  description:
                    value,
                })
              }
            />

            <TextField
              label="Product Code"
              value={
                form.product_code
              }
              onChange={(value) =>
                setForm({
                  ...form,
                  product_code:
                    value,
                })
              }
            />

          </FormSection>

          {/* PRICING */}

          <FormSection
            title="Pricing"
          >

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              <TextField
                label="Was Price (₹)"
                type="number"
                value={
                  form.was_price
                }
                onChange={(value) =>
                  setForm({
                    ...form,
                    was_price:
                      value,
                  })
                }
              />

              <TextField
                label="Now Price (₹)"
                type="number"
                value={
                  form.now_price
                }
                onChange={(value) =>
                  setForm({
                    ...form,
                    now_price:
                      value,
                  })
                }
              />

            </div>

          </FormSection>

          {/* STOCK STATUS */}

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

          {/* CATEGORY */}

          <FormSection
            title="Category"
          >

            <div className="flex flex-wrap gap-2">

              {[
                "shirts",
                "tees",
                "pants",
              ].map(
                (category) => (
                  <button
                    type="button"
                    key={category}
                    onClick={() =>
                      changeCategory(
                        category
                      )
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
                )
              )}

            </div>

          </FormSection>

          {/* SIZES */}

          <FormSection
            title="Sizes"
          >

            <div className="flex flex-wrap gap-2">

              {availableSizes.length >
              0 ? (
                availableSizes.map(
                  (size) => (
                    <button
                      type="button"
                      key={size}
                      onClick={() =>
                        toggleSize(
                          size
                        )
                      }
                      className={`h-10 w-10 rounded-full border text-xs transition-colors ${
                        form.sizes.includes(
                          size
                        )
                          ? "border-bone bg-bone text-ink"
                          : "border-line-strong text-bone hover:bg-white/5"
                      }`}
                    >
                      {size}
                    </button>
                  )
                )
              ) : (
                <p className="text-xs text-mist">
                  No sizes available
                  for this category.
                </p>
              )}

            </div>

          </FormSection>

          {/* ====================================================
              PRODUCT IMAGES
          ==================================================== */}

          <FormSection
            title="Product Images"
            hint="Select images directly from your device. Click the red X button to remove unwanted images."
          >

            <div className="flex flex-wrap gap-4">

              {/* EXISTING / UPLOADED IMAGES */}

              {form.images.map(
                (
                  image,
                  index
                ) => (
                  <div
                    key={`${image}-${index}`}
                    className="relative h-24 w-20"
                  >

                    {/* IMAGE */}

                    <div className="h-full w-full overflow-hidden rounded-xl border border-line">

                      <img
                        src={image}
                        alt={`Product ${
                          index + 1
                        }`}
                        className="h-full w-full object-cover"
                      />

                    </div>

                    {/* DELETE BUTTON */}

                    <button
                      type="button"
                      onClick={() =>
                        removeImage(
                          index
                        )
                      }
                      className="absolute -right-2 -top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-red-500 text-white shadow-lg transition-all hover:scale-110 hover:bg-red-600 active:scale-95"
                      aria-label={`Delete image ${
                        index + 1
                      }`}
                      title="Delete image"
                    >
                      <X
                        size={14}
                        strokeWidth={2.5}
                      />
                    </button>

                  </div>
                )
              )}

              {/* UPLOAD */}

              <label
                className={`flex h-24 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line-strong text-mist transition-all hover:border-bone hover:bg-white/5 hover:text-bone ${
                  uploadingImage
                    ? "pointer-events-none opacity-50"
                    : ""
                }`}
              >

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
                  key={
                    imageInputKey
                  }
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

          {/* OPTIONAL DETAILS */}

          <FormSection
            title="Optional Details"
          >

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

              <TextField
                label="Fabric"
                value={
                  form.fabric
                }
                onChange={(value) =>
                  setForm({
                    ...form,
                    fabric: value,
                  })
                }
              />

              <TextField
                label="Colour"
                value={
                  form.colour
                }
                onChange={(value) =>
                  setForm({
                    ...form,
                    colour: value,
                  })
                }
              />

              <TextField
                label="Occasion"
                value={
                  form.occasion
                }
                onChange={(value) =>
                  setForm({
                    ...form,
                    occasion: value,
                  })
                }
              />

            </div>

          </FormSection>

          {/* CARE INSTRUCTIONS */}

          <FormSection
            title="Care Instructions"
          >

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

          {/* DISPLAY OPTIONS */}

          <FormSection
            title="Display Options"
          >

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

          {/* ACTION BUTTONS */}

          <div className="flex gap-3 pt-2">

            <button
              type="button"
              onClick={() =>
                navigate(-1)
              }
              disabled={saving}
              className="flex-1 rounded-full border border-line-strong py-3.5 text-xs uppercase tracking-widest text-bone transition-all hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                saving ||
                uploadingImage
              }
              className="flex-1 rounded-full bg-bone py-3.5 text-xs font-semibold uppercase tracking-widest text-ink transition-all hover:bg-white/90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? editing
                  ? "Saving..."
                  : "Adding..."
                : editing
                ? "Save Changes"
                : "Add Product"}
            </button>

          </div>

        </form>

      </div>

      {/* ========================================================
          SUCCESS POPUP
      ======================================================== */}

      {showSuccess && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">

          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#111111]/95 p-8 text-center shadow-2xl">

            {/* SUCCESS ICON */}

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-500/20">

                <Check
                  size={28}
                  strokeWidth={2.5}
                  className="text-black"
                />

              </div>

            </div>

            {/* TITLE */}

            <h2 className="mt-6 font-display text-2xl text-bone">
              {editing
                ? "Product Updated"
                : "Product Added"}
            </h2>

            {/* DESCRIPTION */}

            <p className="mt-2 text-sm leading-6 text-mist">
              {editing
                ? "Your product has been successfully updated."
                : "Your product has been successfully added to the collection."}
            </p>

            {/* PRODUCT NAME */}

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">

              <p className="text-[9px] uppercase tracking-[0.2em] text-mist">
                Product
              </p>

              <p className="mt-1 truncate text-sm font-medium text-bone">
                {form.name}
              </p>

            </div>

            {/* REDIRECT TEXT */}

            <div className="mt-6 flex items-center justify-center gap-2">

              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />

              <p className="text-[9px] uppercase tracking-[0.2em] text-mist/60">
                Redirecting to products…
              </p>

            </div>

          </div>

        </div>
      )}

    </>
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
          onChange(
            e.target.value
          )
        }
        className="w-full rounded-full border border-line bg-charcoal/40 px-4 py-2.5 text-sm text-bone outline-none transition-colors focus:border-line-strong"
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
          onChange(
            e.target.value
          )
        }
        className="w-full resize-none rounded-2xl border border-line bg-charcoal/40 px-4 py-3 text-sm text-bone outline-none transition-colors focus:border-line-strong"
      />

    </div>
  );
}