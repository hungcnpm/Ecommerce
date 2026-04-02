"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ImagesUpload from "./ImagesUpload";
import CategorySelect from "./CategorySelect";
import { useSearchParams } from "next/navigation";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: existingCategory,
  variants: existingVariants,
  brand: existingBrand,
  attributes: existingAttributes,
}: any) {
  
  const router = useRouter();

  const inputClass =
    "w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400";

  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages || []);
 
  const [category, setCategory] = useState(
    existingCategory?._id?.toString?.() || existingCategory || ""
  );

  const [productAttributes, setProductAttributes] = useState(
    existingAttributes || []
  );

  const [variants, setVariants] = useState(existingVariants || []);
  const [brand, setBrand] = useState(existingBrand || "");
  const [propSearch, setPropSearch] = useState("");
  const [categoryProperties, setCategoryProperties] = useState<any[]>([]);
  const searchParams = useSearchParams();

  
  useEffect(() => {
    if (!category) return;

    axios
      .get(`/api/categories/${category}/properties`)
      .then((res) => {
        setCategoryProperties(res.data);
      });
  }, [category]);

  const variantProps = categoryProperties.filter((p) => p.isVariant);
  const nonVariantProps = categoryProperties.filter(p => !p.isVariant);
  const hasVariant = variantProps.length > 0;
  useEffect(() => {
    if (!hasVariant) {
      setVariants([]);
    }
  }, [hasVariant]);
  useEffect(() => {
  // ❗ chỉ reset khi tạo mới, KHÔNG phải edit
    if (!_id) {
      setProductAttributes([]);
      setVariants([]);
    }
  }, [category]);
  useEffect(() => {
    if (!existingVariants) return;
  
    const normalized = existingVariants.map((v: any) => ({
      ...v,
      attributes: Object.fromEntries(
        (v.attributes || []).map((a: any) => [
          a.property?.toString(),
          a.value?.toString(),
        ])
      ),
    }));
  
    setVariants(normalized);
  }, [existingVariants]);
  
  useEffect(() => {
    if (!existingAttributes) return;
  
    const normalized = existingAttributes.map((a: any) => ({
      property: a.property?.toString(),
      value: a.value?.toString(),
    }));
  
    setProductAttributes(normalized);
  }, [existingAttributes]);
  // 🔥 ATTRIBUTE UPDATE
  function updateAttribute(propertyId: string, valueId: string) {
    setProductAttributes((prev: any[]) => {
      const filtered = prev.filter(
        (p) => p.property?.toString() !== propertyId
      );

      return [
        ...filtered,
        {
          property: propertyId,
          value: valueId,
        },
      ];
    });
  }

  function addVariant() {
    if (variantProps.length === 0) {
      toast.error("Category này không có variant");
      return; 
    }
    if (variantProps.length > 0) {
      const missing = variants.some(v =>
        variantProps.some(p => !v.attributes?.[p._id.toString()])
      );
  
      if (missing) {
        toast.error("Chọn đầy đủ thuộc tính trước khi thêm variant");
        return;
      }
    }
  
    const attrs: any = {};
  
    variantProps.forEach(p => {
      attrs[p._id.toString()] = "";
    });
  
    setVariants(prev => [
      ...prev,
      { price: "", stock: "", attributes: attrs }
    ]);
  }

  function updateVariant(index: number, field: string, value: any) {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  }

  // 🔥 FIX: propertyId → valueId
  function updateVariantAttr(index: number, propertyId: string, valueId: string) {
    const newVariants = variants.map((v, i) => {
      if (i !== index) return v;
  
      return {
        ...v,
        attributes: {
          ...(v.attributes || {}),
          [propertyId.toString()]: valueId.toString(),
        },
      };
    });
    
    if (isDuplicateVariant(newVariants[index], index, newVariants)) {
      toast.error("Variant already exists!");
      return;
    }
  
    setVariants(newVariants);
  }

  function isDuplicateVariant(newVariant: any, index: number, list: any[]) {
    const keys = Object.keys(newVariant.attributes || {});

    if (keys.length === 0) return false;

    if (Object.values(newVariant.attributes).some(v => !v)) return false;

    // 🔥 normalize object
    const normalize = (obj: any) =>
      Object.entries(obj)
        .sort(([a], [b]) => a.localeCompare(b))
        .reduce((acc, [k, v]) => {
          acc[k] = v;
          return acc;
        }, {} as any);

    const current = JSON.stringify(normalize(newVariant.attributes));

    return list.some((v, i) => {
      if (i === index) return false;

      return current === JSON.stringify(normalize(v.attributes));
    });
  }

  function removeVariant(index: number) {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  }

  // 🔥 FIX: generate đúng ObjectId
  function generateVariants() {
    if (!categoryProperties.length) return;

    const lists = variantProps.map((p: any) => p.values || []);

    function cartesian(arr: any[]): any[] {
      return arr.reduce(
        (a, b) => a.flatMap(d => b.map((e: any) => [...d, e])),
        [[]]
      );
    }

    const combos = cartesian(lists);

    const newVariants = combos.map((combo: any[]) => {
      const attributes: any = {};

      combo.forEach((value, i) => {
        const prop = variantProps[i];
        attributes[prop._id.toString()] = value._id.toString(); // 🔥 KEY FIX
      });

      return {
        attributes,
        price: "",
        stock: "",
      };
    });

    setVariants(newVariants);
  }
  function mapVariantAttributes(attrsObj: any) {
    return Object.entries(attrsObj || {}).map(([property, value]) => ({
      property,
      value,
    }));
  } 
  async function saveProduct(e: any) {
    e.preventDefault();
  //#region validate data
    // 🔥 BASIC
  if (!title.trim()) {
    toast.error("Product name is required");
    return;
  }

  if (!category) {
    toast.error("Please select category");
    return;
  }

  if (!images || images.length === 0) {
    toast.error("Please upload at least 1 image");
    return;
  }

  // 🔥 NON-VARIANT ATTRIBUTES
  const missingAttr = nonVariantProps.find(
    p =>
      !productAttributes.find(
        a => a.property === p._id.toString() && a.value
      )
  );

  if (missingAttr) {
    toast.error(`Thiếu thuộc tính: ${missingAttr.name}`);
    return;
  }

  // 🔥 CASE: KHÔNG CÓ VARIANT
  if (variantProps.length === 0) {
    if (!price || isNaN(Number(price))) {
      toast.error("Price không hợp lệ");
      return;
    }
  }

  // 🔥 CASE: CÓ VARIANT
  if (variantProps.length > 0) {
    if (!variants || variants.length === 0) {
      toast.error("Chưa có variant");
      return;
    }

  const seen = new Set();

  for (let i = 0; i < variants.length; i++) {
    const v = variants[i];

    // price + stock
    if (
      v.price === "" ||
      v.stock === "" ||
      isNaN(Number(v.price)) ||
      isNaN(Number(v.stock))
    ) {
      toast.error(`Variant #${i + 1} price/stock không hợp lệ`);
      return;
    }

    const attrs = v.attributes || {};

    // đủ số lượng attr
    if (Object.keys(attrs).length !== variantProps.length) {
      toast.error(`Variant #${i + 1} thiếu thuộc tính`);
      return;
    }

    // từng attr phải có value
    for (const p of variantProps) {
      const key = p._id.toString();
      if (!attrs[key]) {
        toast.error(`Variant #${i + 1} thiếu ${p.name}`);
        return;
      }
    }

    // 🔥 CHECK DUPLICATE (QUAN TRỌNG)
    const key = Object.entries(attrs)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${v}`)
      .join("|");

    if (seen.has(key)) {
      toast.error(`Variant #${i + 1} bị trùng`);
      return;
    }

    seen.add(key);
  }
}
  //#endregion
    // 🔥 DATA
    const data = {
      title,
      description,
      brand,
      images,
      category,
      attributes: productAttributes,
      variants: variants.map(v => ({
        attributes: mapVariantAttributes(v.attributes),
        price: Number(v.price),
        stock: Number(v.stock),
      })),
    
      ...(variantProps.length === 0 && {
        price: Number(price), // ,
      }),
    };
    console.log("Saving product with data:", data);
    // 🔥 SAVE
    if (_id) {
      await axios.put(`/api/products/${_id}`, data);
      toast.success("Updated");
    } else {
      await axios.post("/api/products", data);
      toast.success("Created");
    }
    const page = searchParams.get("page") || "1";
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "newest";

    router.push(`/products?page=${page}&search=${search}&sort=${sort}&highlight=${_id?.toString()}`);
  }
  function CanceleEdit() {
    const page = searchParams.get("page") || "1";
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "newest";

    router.push(`/products?page=${page}&search=${search}&sort=${sort}`);
  }
  return (
    <form onSubmit={saveProduct} className="max-w-7xl mx-auto px-6 py-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
  
          {/* BASIC INFO */}
          <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
            <h2 className="text-lg font-semibold">Basic Information</h2>
  
            <div>
              <label className="label">Product Name</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="input"
              />
            </div>
  
            <div>
              <label className="label">Brand</label>
              <input
                value={brand}
                onChange={e => setBrand(e.target.value.toUpperCase())}
                className="input"
              />
            </div>
  
            <div>
              <label className="label">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="input min-h-[120px]"
              />
            </div>
  
            <div>
              <label className="label">Category</label>
              <CategorySelect
                value={category}
                onChange={(newCat) => {
                  if (variants.length > 0 || productAttributes.length > 0) {
                    const ok = confirm("Đổi category sẽ xoá variants & attributes. Tiếp tục?");
                    if (!ok) return;
                  }
                  setCategory(newCat);
                }}
              />
            </div>
          </div>
  
          {/* PRICING */}
          <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
            <h2 className="text-lg font-semibold">Pricing</h2>
  
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={hasVariant}
              placeholder={
                hasVariant
                  ? "Price is set per variant"
                  : "Enter product price"
              }
              className={`input ${
                hasVariant ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>
  
          {/* ATTRIBUTES */}
          {nonVariantProps.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Attributes</h2>
  
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {nonVariantProps.map((prop: any) => {
                  const existing = productAttributes.find(
                    (p: any) =>
                      p.property?.toString() === prop._id?.toString()
                  );
  
                  return (
                    <div key={prop._id}>
                      <label className="label">{prop.name}</label>
                      <select
                        value={existing?.value || ""}
                        onChange={(e) =>
                          updateAttribute(prop._id, e.target.value)
                        }
                        className="input"
                      >
                        <option value="">Select</option>
                        {prop.values.map((v: any) => (
                          <option key={v._id} value={v._id}>
                            {v.value}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
  
          {/* VARIANTS */}
          {variantProps.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Variants</h2>
                <div className="flex gap-2">
                  <button type="button" onClick={generateVariants} className="btn-success">
                    Auto Generate
                  </button>
                  <button type="button" onClick={addVariant} className="btn-primary">
                    + Add Variant
                  </button>
                </div>
              </div>
  
              <div className="space-y-4">
                {variants.map((v, i) => (
                  <div key={i} className="border rounded-xl p-4 bg-gray-50">
  
                    <div className="flex justify-between mb-3">
                      <span className="font-medium text-sm">Variant #{i + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeVariant(i)}
                        className="btn-danger text-xs"
                      >
                        Remove
                      </button>
                    </div>
  
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {variantProps.map((prop: any) => (
                        <select
                          key={prop._id}
                          value={v.attributes?.[prop._id.toString()] || ""}
                          onChange={(e) =>
                            updateVariantAttr(i, prop._id, e.target.value)
                          }
                          className="input"
                        >
                          <option value="">{prop.name}</option>
                          {prop.values.map((val: any) => (
                            <option key={val._id} value={val._id}>
                              {val.value}
                            </option>
                          ))}
                        </select>
                      ))}
                    </div>
  
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <input
                        value={v.price}
                        onChange={(e) => updateVariant(i, "price", e.target.value)}
                        placeholder="Price"
                        className="input"
                      />
                      <input
                        value={v.stock}
                        onChange={(e) => updateVariant(i, "stock", e.target.value)}
                        placeholder="Stock"
                        className="input"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
  
        </div>
  
        {/* RIGHT */}
        <div className="space-y-6">
  
          {/* IMAGES */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Media</h2>
            <ImagesUpload images={images} setImages={setImages} />
          </div>
  
          {/* ACTION */}
          <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-3">
            <button className="w-full btn-primary">Save Product</button>
            <button
              type="button"
              onClick={() => CanceleEdit()}
              className="w-full btn-secondary"
            >
              Cancel
            </button>
          </div>
  
        </div>
  
      </div>
    </form>
  );

  }
