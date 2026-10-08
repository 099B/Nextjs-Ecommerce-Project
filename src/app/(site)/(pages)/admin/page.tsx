"use client";
import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Product } from "@/types/product";
import type { Category } from "@/types/category";

// ─── Types ────────────────────────────────────────────────────────────────────

type StoreSettings = {
  id: number;
  store_name: string;
  logo_url: string | null;
  contact_email: string | null;
  delivery_fee: number;
};

type PromoBanner = {
  id: number;
  layout: string;
  subtitle_fr: string;
  subtitle_en: string;
  subtitle_ar: string;
  title_fr: string;
  title_en: string;
  title_ar: string;
  description_fr: string;
  description_en: string;
  description_ar: string;
  image_url: string;
  bg_color: string;
  theme_color: string;
  button_text_fr: string;
  button_text_en: string;
  button_text_ar: string;
  button_link: string;
};

type HeroSlider = {
  id: number;
  discount: string;
  title_fr: string;
  title_en: string;
  title_ar: string;
  description_fr: string;
  description_en: string;
  description_ar: string;
  image_url: string;
  button_text_fr: string;
  button_text_en: string;
  button_text_ar: string;
  target_id: number | null;
};

type HeroSideBanner = {
  id: number;
  title_fr: string;
  title_en: string;
  title_ar: string;
  price: string;
  original_price: string | null;
  image_url: string;
  target_id: number | null;
};

type Order = {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  city: string;
  address: string;
  notes: string | null;
  total_price: number;
  items: any;
  status: string;
  created_at: string;
};

type Tab = "products" | "categories" | "banners" | "sliders" | "side-banners" | "settings" | "orders";

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function uploadImage(file: File, directory: string, customFilename?: string): Promise<string | null> {
  const ext = file.name.split('.').pop() || 'png';
  const filename = customFilename ? `${customFilename}.${ext}` : `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = `${directory}/${filename}`;

  try {
    const { data, error } = await supabase.storage
      .from('images') // Ensure you have an 'images' bucket in Supabase that is public
      .upload(filePath, file, { upsert: true });

    if (error) {
      alert(`Upload error: ${error.message}`);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (err: any) {
    alert(`Upload error: ${err.message}`);
    return null;
  }
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 1px 8px rgba(0,0,0,0.07)",
      padding: "28px 32px",
      marginBottom: 28,
    }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e", marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid #eee" }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  border: "1px solid #d1d5db",
  borderRadius: 7,
  padding: "9px 12px",
  fontSize: 14,
  color: "#1a1a2e",
  background: "#fafafa",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

function Btn({ children, onClick, variant = "primary", disabled, type = "button" }: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "danger" | "secondary";
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const colors: Record<string, React.CSSProperties> = {
    primary: { background: "#aa0000", color: "#fff" },
    danger: { background: "#ef4444", color: "#fff" },
    secondary: { background: "#1a1a2e", color: "#fff" },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...colors[variant],
        border: "none",
        borderRadius: 7,
        padding: "9px 18px",
        fontSize: 14,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        transition: "opacity 0.15s",
      }}
    >
      {children}
    </button>
  );
}

// ─── Products Tab ─────────────────────────────────────────────────────────────

function ProductsTab({ categories }: { categories: Category[] }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    title_en: "", title_fr: "", title_ar: "",
    description_en: "", description_fr: "", description_ar: "",
    price: "", discounted_price: "", stock: "", category_id: "",
  });
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploadDir, setUploadDir] = useState("products");

  const load = useCallback(async () => {
    const { data } = await supabase.from("products").select("*").order("id", { ascending: false });
    if (data) setProducts(data as Product[]);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleField = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const imgs: string[] = [];
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const url = await uploadImage(files[i], uploadDir);
        if (!url) { setBusy(false); return; }
        imgs.push(url);
      }
    }
    const payload = {
      title_en: form.title_en,
      title_fr: form.title_fr,
      title_ar: form.title_ar,
      description_en: form.description_en || null,
      description_fr: form.description_fr || null,
      description_ar: form.description_ar || null,
      price: parseFloat(form.price),
      discounted_price: form.discounted_price ? parseFloat(form.discounted_price) : null,
      stock: form.stock ? parseInt(form.stock) : 0,
      category_id: form.category_id ? parseInt(form.category_id) : null,
      imgs: imgs.length > 0 ? imgs : null,
    };
    const { error } = await supabase.from("products").insert([payload]);
    if (error) {
      alert("Error: " + error.message);
    } else {
      setForm({ title_en: "", title_fr: "", title_ar: "", description_en: "", description_fr: "", description_ar: "", price: "", discounted_price: "", stock: "", category_id: "" });
      setFiles(null);
      load();
    }
    setBusy(false);
  };

  const del = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    load();
  };

  const grid3: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 };

  return (
    <>
      <SectionCard title="Add New Product">
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={grid3}>
            <Field label="Title (EN)"><input style={inputStyle} value={form.title_en} onChange={e => handleField("title_en", e.target.value)} required /></Field>
            <Field label="Title (FR)"><input style={inputStyle} value={form.title_fr} onChange={e => handleField("title_fr", e.target.value)} required /></Field>
            <Field label="Title (AR)"><input style={{ ...inputStyle, direction: "rtl" }} value={form.title_ar} onChange={e => handleField("title_ar", e.target.value)} required /></Field>
          </div>
          <div style={grid3}>
            <Field label="Description (EN)"><textarea style={{ ...inputStyle, resize: "vertical", minHeight: 70 }} value={form.description_en} onChange={e => handleField("description_en", e.target.value)} /></Field>
            <Field label="Description (FR)"><textarea style={{ ...inputStyle, resize: "vertical", minHeight: 70 }} value={form.description_fr} onChange={e => handleField("description_fr", e.target.value)} /></Field>
            <Field label="Description (AR)"><textarea style={{ ...inputStyle, resize: "vertical", minHeight: 70, direction: "rtl" }} value={form.description_ar} onChange={e => handleField("description_ar", e.target.value)} /></Field>
          </div>
          <div style={grid3}>
            <Field label="Price (MAD)"><input style={inputStyle} type="number" step="0.01" value={form.price} onChange={e => handleField("price", e.target.value)} required /></Field>
            <Field label="Discounted Price"><input style={inputStyle} type="number" step="0.01" value={form.discounted_price} onChange={e => handleField("discounted_price", e.target.value)} /></Field>
            <Field label="Stock"><input style={inputStyle} type="number" value={form.stock} onChange={e => handleField("stock", e.target.value)} /></Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            <Field label="Category">
              <select style={inputStyle} value={form.category_id} onChange={e => handleField("category_id", e.target.value)}>
                <option value="">— None —</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name_en}</option>)}
              </select>
            </Field>
            <Field label="Upload Target Folder (in public/)">
              <input style={inputStyle} value={uploadDir} onChange={e => setUploadDir(e.target.value)} required />
            </Field>
            <Field label="Images (multiple)">
              <input style={inputStyle} type="file" multiple accept="image/*" onChange={e => setFiles(e.target.files)} />
            </Field>
          </div>
          <div style={{ textAlign: "right" }}>
            <Btn type="submit" disabled={busy}>{busy ? "Saving…" : "Add Product"}</Btn>
          </div>
        </form>
      </SectionCard>

      <SectionCard title={`Products (${products.length})`}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f5f5fa" }}>
                {["ID", "Image", "Title (EN)", "Price", "Discounted", "Stock", "Category", "Actions"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#555", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "10px 12px", color: "#888" }}>{p.id}</td>
                  <td style={{ padding: "10px 12px" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.imgs?.[0] ?? "/images/products/product-01.png"} alt="" style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 6 }} />
                  </td>
                  <td style={{ padding: "10px 12px", fontWeight: 500 }}>{p.title_en}</td>
                  <td style={{ padding: "10px 12px" }}>{p.price} MAD</td>
                  <td style={{ padding: "10px 12px" }}>{p.discounted_price ? `${p.discounted_price} MAD` : "—"}</td>
                  <td style={{ padding: "10px 12px" }}>{p.stock ?? 0}</td>
                  <td style={{ padding: "10px 12px" }}>{categories.find(c => c.id === p.category_id)?.name_en ?? "—"}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <Btn variant="danger" onClick={() => del(p.id)}>Delete</Btn>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={8} style={{ padding: 20, textAlign: "center", color: "#aaa" }}>No products yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </>
  );
}

// ─── Categories Tab ───────────────────────────────────────────────────────────

function CategoriesTab() {
  const [cats, setCats] = useState<Category[]>([]);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name_en: "", name_fr: "", name_ar: "", slug: "" });
  const [file, setFile] = useState<File | null>(null);
  const [uploadDir, setUploadDir] = useState("categories");

  const load = useCallback(async () => {
    const { data } = await supabase.from("categories").select("*").order("id", { ascending: false });
    if (data) setCats(data as Category[]);
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleField = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    let image_url: string | null = null;
    if (file) {
      image_url = await uploadImage(file, uploadDir);
      if (!image_url) { setBusy(false); return; }
    }
    const { error } = await supabase.from("categories").insert([{ ...form, image_url }]);
    if (error) alert("Error: " + error.message);
    else { setForm({ name_en: "", name_fr: "", name_ar: "", slug: "" }); setFile(null); load(); }
    setBusy(false);
  };

  const del = async (id: number) => {
    if (!confirm("Delete this category?")) return;
    await supabase.from("categories").delete().eq("id", id);
    load();
  };

  return (
    <>
      <SectionCard title="Add Category">
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            <Field label="Name (EN)"><input style={inputStyle} value={form.name_en} onChange={e => handleField("name_en", e.target.value)} required /></Field>
            <Field label="Name (FR)"><input style={inputStyle} value={form.name_fr} onChange={e => handleField("name_fr", e.target.value)} required /></Field>
            <Field label="Name (AR)"><input style={{ ...inputStyle, direction: "rtl" }} value={form.name_ar} onChange={e => handleField("name_ar", e.target.value)} required /></Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            <Field label="Slug (unique URL key)"><input style={inputStyle} value={form.slug} onChange={e => handleField("slug", e.target.value)} required pattern="[a-z0-9-]+" title="Lowercase letters, numbers and hyphens only" /></Field>
            <Field label="Upload Target Folder (in public/)"><input style={inputStyle} value={uploadDir} onChange={e => setUploadDir(e.target.value)} required /></Field>
            <Field label="Image"><input style={inputStyle} type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)} /></Field>
          </div>
          <div style={{ textAlign: "right" }}>
            <Btn type="submit" disabled={busy}>{busy ? "Saving…" : "Add Category"}</Btn>
          </div>
        </form>
      </SectionCard>

      <SectionCard title={`Categories (${cats.length})`}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "#f5f5fa" }}>
              {["ID", "Image", "EN", "FR", "AR", "Slug", "Actions"].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#555" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cats.map(c => (
              <tr key={c.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td style={{ padding: "10px 12px", color: "#888" }}>{c.id}</td>
                <td style={{ padding: "10px 12px" }}>
                  {c.image_url
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={c.image_url} alt="" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6 }} />
                    : <span style={{ color: "#bbb" }}>—</span>}
                </td>
                <td style={{ padding: "10px 12px" }}>{c.name_en}</td>
                <td style={{ padding: "10px 12px" }}>{c.name_fr}</td>
                <td style={{ padding: "10px 12px", direction: "rtl" }}>{c.name_ar}</td>
                <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 12, color: "#aa0000" }}>{c.slug}</td>
                <td style={{ padding: "10px 12px" }}>
                  <Btn variant="danger" onClick={() => del(c.id)}>Delete</Btn>
                </td>
              </tr>
            ))}
            {cats.length === 0 && (
              <tr><td colSpan={7} style={{ padding: 20, textAlign: "center", color: "#aaa" }}>No categories yet.</td></tr>
            )}
          </tbody>
        </table>
      </SectionCard>
    </>
  );
}

// ─── Promo Banners Tab ────────────────────────────────────────────────────────

function BannersTab() {
  const [banners, setBanners] = useState<PromoBanner[]>([]);
  const [busy, setBusy] = useState(false);
  const emptyForm = {
    layout: "left", subtitle_en: "", subtitle_fr: "", subtitle_ar: "",
    title_en: "", title_fr: "", title_ar: "",
    description_en: "", description_fr: "", description_ar: "",
    bg_color: "#ffffff", theme_color: "#aa0000",
    button_text_en: "", button_text_fr: "", button_text_ar: "",
    button_link: "",
  };
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [uploadDir, setUploadDir] = useState("banners");

  const load = useCallback(async () => {
    const { data } = await supabase.from("promo_banners").select("*").order("id", { ascending: false });
    if (data) setBanners(data as PromoBanner[]);
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleField = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { alert("Please select a banner image."); return; }
    setBusy(true);
    const image_url = await uploadImage(file, uploadDir);
    if (!image_url) { setBusy(false); return; }
    const { error } = await supabase.from("promo_banners").insert([{ ...form, image_url }]);
    if (error) alert("Error: " + error.message);
    else { setForm(emptyForm); setFile(null); load(); }
    setBusy(false);
  };

  const del = async (id: number) => {
    if (!confirm("Delete this banner?")) return;
    await supabase.from("promo_banners").delete().eq("id", id);
    load();
  };

  const grid3: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 };

  return (
    <>
      <SectionCard title="Add Promo Banner">
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14 }}>
            <Field label="Layout">
              <select style={inputStyle} value={form.layout} onChange={e => handleField("layout", e.target.value)}>
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="center">Center</option>
              </select>
            </Field>
            <Field label="BG Color"><input style={inputStyle} type="color" value={form.bg_color} onChange={e => handleField("bg_color", e.target.value)} /></Field>
            <Field label="Theme Color"><input style={inputStyle} type="color" value={form.theme_color} onChange={e => handleField("theme_color", e.target.value)} /></Field>
            <Field label="Upload Target Folder (in public/)"><input style={inputStyle} value={uploadDir} onChange={e => setUploadDir(e.target.value)} required /></Field>
          </div>
          <div style={grid3}>
            <Field label="Subtitle (EN)"><input style={inputStyle} value={form.subtitle_en} onChange={e => handleField("subtitle_en", e.target.value)} required /></Field>
            <Field label="Subtitle (FR)"><input style={inputStyle} value={form.subtitle_fr} onChange={e => handleField("subtitle_fr", e.target.value)} required /></Field>
            <Field label="Subtitle (AR)"><input style={{ ...inputStyle, direction: "rtl" }} value={form.subtitle_ar} onChange={e => handleField("subtitle_ar", e.target.value)} required /></Field>
          </div>
          <div style={grid3}>
            <Field label="Title (EN)"><input style={inputStyle} value={form.title_en} onChange={e => handleField("title_en", e.target.value)} required /></Field>
            <Field label="Title (FR)"><input style={inputStyle} value={form.title_fr} onChange={e => handleField("title_fr", e.target.value)} required /></Field>
            <Field label="Title (AR)"><input style={{ ...inputStyle, direction: "rtl" }} value={form.title_ar} onChange={e => handleField("title_ar", e.target.value)} required /></Field>
          </div>
          <div style={grid3}>
            <Field label="Description (EN)"><textarea style={{ ...inputStyle, resize: "vertical", minHeight: 60 }} value={form.description_en} onChange={e => handleField("description_en", e.target.value)} required /></Field>
            <Field label="Description (FR)"><textarea style={{ ...inputStyle, resize: "vertical", minHeight: 60 }} value={form.description_fr} onChange={e => handleField("description_fr", e.target.value)} required /></Field>
            <Field label="Description (AR)"><textarea style={{ ...inputStyle, resize: "vertical", minHeight: 60, direction: "rtl" }} value={form.description_ar} onChange={e => handleField("description_ar", e.target.value)} required /></Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: 14 }}>
            <Field label="Button Text (EN)"><input style={inputStyle} value={form.button_text_en} onChange={e => handleField("button_text_en", e.target.value)} required /></Field>
            <Field label="Button Text (FR)"><input style={inputStyle} value={form.button_text_fr} onChange={e => handleField("button_text_fr", e.target.value)} required /></Field>
            <Field label="Button Text (AR)"><input style={{ ...inputStyle, direction: "rtl" }} value={form.button_text_ar} onChange={e => handleField("button_text_ar", e.target.value)} required /></Field>
            <Field label="Button Link"><input style={inputStyle} value={form.button_link} onChange={e => handleField("button_link", e.target.value)} required /></Field>
            <Field label="Image"><input style={inputStyle} type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)} /></Field>
          </div>
          <div style={{ textAlign: "right" }}>
            <Btn type="submit" disabled={busy}>{busy ? "Saving…" : "Add Banner"}</Btn>
          </div>
        </form>
      </SectionCard>

      <SectionCard title={`Promo Banners (${banners.length})`}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {banners.map(b => (
            <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", borderRadius: 8, border: "1px solid #eee", background: "#fafafa" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.image_url} alt="" style={{ width: 72, height: 48, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, margin: 0, fontSize: 14 }}>{b.title_en}</p>
                <p style={{ color: "#888", margin: 0, fontSize: 12 }}>Layout: {b.layout} · Link: {b.button_link}</p>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ width: 18, height: 18, borderRadius: 4, background: b.bg_color, border: "1px solid #ddd", display: "inline-block" }} title={`BG: ${b.bg_color}`} />
                <span style={{ width: 18, height: 18, borderRadius: 4, background: b.theme_color, border: "1px solid #ddd", display: "inline-block" }} title={`Theme: ${b.theme_color}`} />
                <Btn variant="danger" onClick={() => del(b.id)}>Delete</Btn>
              </div>
            </div>
          ))}
          {banners.length === 0 && <p style={{ color: "#aaa", textAlign: "center", padding: 20 }}>No banners yet.</p>}
        </div>
      </SectionCard>
    </>
  );
}

// ─── Hero Sliders Tab ─────────────────────────────────────────────────────────

function SlidersTab() {
  const [sliders, setSliders] = useState<HeroSlider[]>([]);
  const [busy, setBusy] = useState(false);
  const emptyForm = {
    discount: "", title_en: "", title_fr: "", title_ar: "",
    description_en: "", description_fr: "", description_ar: "",
    button_text_en: "", button_text_fr: "", button_text_ar: "",
    target_id: "",
  };
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [uploadDir, setUploadDir] = useState("sliders");

  const load = useCallback(async () => {
    const { data } = await supabase.from("hero_sliders").select("*").order("id", { ascending: false });
    if (data) setSliders(data as HeroSlider[]);
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleField = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { alert("Please select a slide image."); return; }
    setBusy(true);
    const image_url = await uploadImage(file, uploadDir);
    if (!image_url) { setBusy(false); return; }
    const payload = {
      ...form,
      image_url,
      target_id: form.target_id ? parseInt(form.target_id) : null,
    };
    const { error } = await supabase.from("hero_sliders").insert([payload]);
    if (error) alert("Error: " + error.message);
    else { setForm(emptyForm); setFile(null); load(); }
    setBusy(false);
  };

  const del = async (id: number) => {
    if (!confirm("Delete this slide?")) return;
    await supabase.from("hero_sliders").delete().eq("id", id);
    load();
  };

  const grid3: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 };

  return (
    <>
      <SectionCard title="Add Hero Slide">
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14 }}>
            <Field label="Discount Label (e.g. 30% OFF)"><input style={inputStyle} value={form.discount} onChange={e => handleField("discount", e.target.value)} required /></Field>
            <Field label="Target Product ID (optional)"><input style={inputStyle} type="number" value={form.target_id} onChange={e => handleField("target_id", e.target.value)} /></Field>
            <Field label="Upload Target Folder (in public/)"><input style={inputStyle} value={uploadDir} onChange={e => setUploadDir(e.target.value)} required /></Field>
            <Field label="Image"><input style={inputStyle} type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)} /></Field>
          </div>
          <div style={grid3}>
            <Field label="Title (EN)"><input style={inputStyle} value={form.title_en} onChange={e => handleField("title_en", e.target.value)} required /></Field>
            <Field label="Title (FR)"><input style={inputStyle} value={form.title_fr} onChange={e => handleField("title_fr", e.target.value)} required /></Field>
            <Field label="Title (AR)"><input style={{ ...inputStyle, direction: "rtl" }} value={form.title_ar} onChange={e => handleField("title_ar", e.target.value)} required /></Field>
          </div>
          <div style={grid3}>
            <Field label="Description (EN)"><textarea style={{ ...inputStyle, resize: "vertical", minHeight: 60 }} value={form.description_en} onChange={e => handleField("description_en", e.target.value)} required /></Field>
            <Field label="Description (FR)"><textarea style={{ ...inputStyle, resize: "vertical", minHeight: 60 }} value={form.description_fr} onChange={e => handleField("description_fr", e.target.value)} required /></Field>
            <Field label="Description (AR)"><textarea style={{ ...inputStyle, resize: "vertical", minHeight: 60, direction: "rtl" }} value={form.description_ar} onChange={e => handleField("description_ar", e.target.value)} required /></Field>
          </div>
          <div style={grid3}>
            <Field label="Button Text (EN)"><input style={inputStyle} value={form.button_text_en} onChange={e => handleField("button_text_en", e.target.value)} required /></Field>
            <Field label="Button Text (FR)"><input style={inputStyle} value={form.button_text_fr} onChange={e => handleField("button_text_fr", e.target.value)} required /></Field>
            <Field label="Button Text (AR)"><input style={{ ...inputStyle, direction: "rtl" }} value={form.button_text_ar} onChange={e => handleField("button_text_ar", e.target.value)} required /></Field>
          </div>
          <div style={{ textAlign: "right" }}>
            <Btn type="submit" disabled={busy}>{busy ? "Saving…" : "Add Slide"}</Btn>
          </div>
        </form>
      </SectionCard>

      <SectionCard title={`Hero Slides (${sliders.length})`}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {sliders.map(s => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", borderRadius: 8, border: "1px solid #eee", background: "#fafafa" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.image_url} alt="" style={{ width: 80, height: 52, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, margin: 0, fontSize: 14 }}>{s.title_en}</p>
                <p style={{ color: "#888", margin: 0, fontSize: 12 }}>Discount: {s.discount} · Button: {s.button_text_en}</p>
              </div>
              <Btn variant="danger" onClick={() => del(s.id)}>Delete</Btn>
            </div>
          ))}
          {sliders.length === 0 && <p style={{ color: "#aaa", textAlign: "center", padding: 20 }}>No slides yet.</p>}
        </div>
      </SectionCard>
    </>
  );
}

// ─── Hero Side Banners Tab ────────────────────────────────────────────────────

function SideBannersTab() {
  const [items, setItems] = useState<HeroSideBanner[]>([]);
  const [busy, setBusy] = useState(false);
  const emptyForm = { title_en: "", title_fr: "", title_ar: "", price: "", original_price: "", target_id: "" };
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [uploadDir, setUploadDir] = useState("banners");

  const load = useCallback(async () => {
    const { data } = await supabase.from("hero_side_banners").select("*").order("id", { ascending: false });
    if (data) setItems(data as HeroSideBanner[]);
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleField = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { alert("Please select an image."); return; }
    setBusy(true);
    const image_url = await uploadImage(file, uploadDir);
    if (!image_url) { setBusy(false); return; }
    const payload = {
      title_en: form.title_en,
      title_fr: form.title_fr,
      title_ar: form.title_ar,
      price: form.price,
      original_price: form.original_price || null,
      image_url,
      target_id: form.target_id ? parseInt(form.target_id) : null,
    };
    const { error } = await supabase.from("hero_side_banners").insert([payload]);
    if (error) alert("Error: " + error.message);
    else { setForm(emptyForm); setFile(null); load(); }
    setBusy(false);
  };

  const del = async (id: number) => {
    if (!confirm("Delete this side banner?")) return;
    await supabase.from("hero_side_banners").delete().eq("id", id);
    load();
  };

  return (
    <>
      <SectionCard title="Add Hero Side Banner">
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            <Field label="Title (EN)"><input style={inputStyle} value={form.title_en} onChange={e => handleField("title_en", e.target.value)} required /></Field>
            <Field label="Title (FR)"><input style={inputStyle} value={form.title_fr} onChange={e => handleField("title_fr", e.target.value)} required /></Field>
            <Field label="Title (AR)"><input style={{ ...inputStyle, direction: "rtl" }} value={form.title_ar} onChange={e => handleField("title_ar", e.target.value)} required /></Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: 14 }}>
            <Field label="Price (e.g. 299 MAD)"><input style={inputStyle} value={form.price} onChange={e => handleField("price", e.target.value)} required /></Field>
            <Field label="Original Price (optional)"><input style={inputStyle} value={form.original_price} onChange={e => handleField("original_price", e.target.value)} /></Field>
            <Field label="Target Product ID"><input style={inputStyle} type="number" value={form.target_id} onChange={e => handleField("target_id", e.target.value)} /></Field>
            <Field label="Upload Target Folder (in public/)"><input style={inputStyle} value={uploadDir} onChange={e => setUploadDir(e.target.value)} required /></Field>
            <Field label="Image"><input style={inputStyle} type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)} /></Field>
          </div>
          <div style={{ textAlign: "right" }}>
            <Btn type="submit" disabled={busy}>{busy ? "Saving…" : "Add Side Banner"}</Btn>
          </div>
        </form>
      </SectionCard>

      <SectionCard title={`Hero Side Banners (${items.length})`}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map(b => (
            <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", borderRadius: 8, border: "1px solid #eee", background: "#fafafa" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.image_url} alt="" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, margin: 0, fontSize: 14 }}>{b.title_en}</p>
                <p style={{ color: "#888", margin: 0, fontSize: 12 }}>
                  Price: {b.price}{b.original_price ? ` · Was: ${b.original_price}` : ""}{b.target_id ? ` · Product #${b.target_id}` : ""}
                </p>
              </div>
              <Btn variant="danger" onClick={() => del(b.id)}>Delete</Btn>
            </div>
          ))}
          {items.length === 0 && <p style={{ color: "#aaa", textAlign: "center", padding: 20 }}>No side banners yet.</p>}
        </div>
      </SectionCard>
    </>
  );
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────

function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [busy, setBusy] = useState<number | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (data) setOrders(data as Order[]);
  }, []);
  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: number, status: string) => {
    setBusy(id);
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) alert("Error: " + error.message);
    else load();
    setBusy(null);
  };

  return (
    <SectionCard title={`Orders (${orders.length})`}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "#f5f5fa" }}>
              {["ID", "Customer", "Contact", "Location", "Total", "Status", "Date", "Actions"].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#555", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td style={{ padding: "10px 12px", color: "#888" }}>#{o.id}</td>
                <td style={{ padding: "10px 12px", fontWeight: 500 }}>{o.first_name} {o.last_name}</td>
                <td style={{ padding: "10px 12px" }}>{o.phone}</td>
                <td style={{ padding: "10px 12px" }}>{o.city}<br/><span style={{ fontSize: 12, color: "#888" }}>{o.address}</span></td>
                <td style={{ padding: "10px 12px", fontWeight: 600 }}>{o.total_price} MAD</td>
                <td style={{ padding: "10px 12px" }}>
                  <span style={{ 
                    padding: "4px 8px", 
                    borderRadius: 4, 
                    fontSize: 12, 
                    fontWeight: 600,
                    background: o.status === 'complete' ? "#dcfce3" : "#fef0c7",
                    color: o.status === 'complete' ? "#166534" : "#92400e"
                  }}>
                    {o.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: "10px 12px" }}>{new Date(o.created_at).toLocaleString()}</td>
                <td style={{ padding: "10px 12px" }}>
                  {o.status !== 'complete' && (
                    <Btn 
                      variant="primary" 
                      onClick={() => updateStatus(o.id, 'complete')}
                      disabled={busy === o.id}
                    >
                      {busy === o.id ? "..." : "Mark Complete"}
                    </Btn>
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={8} style={{ padding: 20, textAlign: "center", color: "#aaa" }}>No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

// ─── Store Settings Tab ───────────────────────────────────────────────────────

function SettingsTab() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [form, setForm] = useState({ store_name: "", contact_email: "", delivery_fee: "0" });
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploadDir, setUploadDir] = useState("settings");

  const load = useCallback(async () => {
    const { data } = await supabase.from("store_settings").select("*").limit(1).single();
    if (data) {
      setSettings(data as StoreSettings);
      setForm({ store_name: data.store_name, contact_email: data.contact_email ?? "", delivery_fee: (data.delivery_fee ?? 0).toString() });
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleField = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    let logo_url = settings?.logo_url ?? null;
    if (file) {
      const uploaded = await uploadImage(file, uploadDir, "logo");
      if (!uploaded) { setBusy(false); return; }
      logo_url = uploaded;
    }
    const payload = { store_name: form.store_name, contact_email: form.contact_email || null, logo_url, delivery_fee: parseFloat(form.delivery_fee) || 0 };
    if (settings) {
      const { error } = await supabase.from("store_settings").update(payload).eq("id", settings.id);
      if (error) alert("Error: " + error.message);
      else alert("Settings updated successfully!");
    } else {
      const { error } = await supabase.from("store_settings").insert([payload]);
      if (error) alert("Error: " + error.message);
      else alert("Settings created successfully!");
    }
    setFile(null); // Clear the file state so it doesn't re-upload on next save
    // Reset the actual DOM input
    const fileInput = document.getElementById("logo-upload") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
    
    load();
    setBusy(false);
  };

  return (
    <SectionCard title="Store Settings">
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 500 }}>
        {settings?.logo_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={settings.logo_url} alt="Logo" style={{ height: 56, objectFit: "contain", borderRadius: 6, border: "1px solid #eee", padding: 6 }} />
        )}
        <Field label="Store Name"><input style={inputStyle} value={form.store_name} onChange={e => handleField("store_name", e.target.value)} required /></Field>
        <Field label="Contact Email"><input style={inputStyle} type="email" value={form.contact_email} onChange={e => handleField("contact_email", e.target.value)} /></Field>
        <Field label="Delivery Fee (MAD)"><input style={inputStyle} type="number" step="0.01" value={form.delivery_fee} onChange={e => handleField("delivery_fee", e.target.value)} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Upload Target Folder (in public/)"><input style={inputStyle} value={uploadDir} onChange={e => setUploadDir(e.target.value)} required /></Field>
          <Field label="Logo Image"><input id="logo-upload" style={inputStyle} type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)} /></Field>
        </div>
        <div>
          <Btn type="submit" disabled={busy}>{busy ? "Saving…" : settings ? "Update Settings" : "Create Settings"}</Btn>
        </div>
      </form>
    </SectionCard>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  // Load categories once logged in (needed by ProductsTab dropdown)
  useEffect(() => {
    if (!session) return;
    supabase.from("categories").select("*").order("name_en").then(({ data }) => {
      if (data) setCategories(data as Category[]);
    });
  }, [session]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    setLoading(false);
  };

  // ── Loading ──
  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f5f5fa" }}>
        <p style={{ color: "#888", fontSize: 16 }}>Loading…</p>
      </div>
    );
  }

  // ── Login screen ──
  if (!session) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "linear-gradient(135deg,#1a1a2e 0%,#16213e 60%,#0f3460 100%)" }}>
        <form onSubmit={handleLogin} style={{ background: "#fff", borderRadius: 14, boxShadow: "0 8px 40px rgba(0,0,0,0.25)", padding: "44px 40px", width: 380, maxWidth: "92vw" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg,#aa0000,#ff4848)", margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e", margin: 0 }}>Admin Panel</h2>
            <p style={{ color: "#888", fontSize: 13, marginTop: 4 }}>Sign in to manage your store</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="Email">
              <input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required />
            </Field>
            <Field label="Password">
              <input style={inputStyle} type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required />
            </Field>
            <button type="submit" style={{ marginTop: 8, background: "linear-gradient(135deg,#aa0000,#ff4848)", color: "#fff", border: "none", borderRadius: 8, padding: "12px 0", fontWeight: 700, fontSize: 15, cursor: "pointer", width: "100%" }}>
              Sign In
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ── Dashboard ──
  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "orders",       label: "Orders",         icon: "📦" },
    { id: "products",     label: "Products",       icon: "🛍️" },
    { id: "categories",   label: "Categories",     icon: "🗂️" },
    { id: "banners",      label: "Promo Banners",  icon: "🖼️" },
    { id: "sliders",      label: "Hero Sliders",   icon: "🎞️" },
    { id: "side-banners", label: "Side Banners",   icon: "📌" },
    { id: "settings",     label: "Store Settings", icon: "⚙️" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5fa", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      {/* Top bar */}
      <header style={{ background: "linear-gradient(135deg,#1a1a2e,#16213e)", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, boxShadow: "0 2px 12px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#aa0000,#ff4848)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
          </div>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Admin Dashboard</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: "#8892b0", fontSize: 13 }}>{session.user.email}</span>
          <Btn variant="secondary" onClick={() => supabase.auth.signOut()}>Sign Out</Btn>
        </div>
      </header>

      <div style={{ display: "flex", minHeight: "calc(100vh - 60px)" }}>
        {/* Sidebar */}
        <nav style={{ width: 220, background: "#fff", borderRight: "1px solid #eee", padding: "20px 0", flexShrink: 0 }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "11px 20px",
                border: "none",
                background: activeTab === t.id ? "#ffeeee" : "transparent",
                color: activeTab === t.id ? "#aa0000" : "#555",
                fontWeight: activeTab === t.id ? 700 : 500,
                fontSize: 14,
                cursor: "pointer",
                textAlign: "left",
                borderLeft: activeTab === t.id ? "3px solid #aa0000" : "3px solid transparent",
                transition: "all 0.15s",
              }}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        {/* Main content */}
        <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
          {activeTab === "orders"       && <OrdersTab />}
          {activeTab === "products"     && <ProductsTab categories={categories} />}
          {activeTab === "categories"   && <CategoriesTab />}
          {activeTab === "banners"      && <BannersTab />}
          {activeTab === "sliders"      && <SlidersTab />}
          {activeTab === "side-banners" && <SideBannersTab />}
          {activeTab === "settings"     && <SettingsTab />}
        </main>
      </div>
    </div>
  );
}
