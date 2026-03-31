"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ImagesUpload from "./ImagesUpload";
import CategorySelect from "./CategorySelect";

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
  
  useEffect(() => {
    if (!category) return;

    axios
      .get(`/api/categories/${category}/properties`)
      .then((res) => {
        setCategoryProperties(res.data);
      });
  }, [category]);

  const variantProps = categoryProperties.filter((p) => p.isVariant);

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

  async function saveProduct(e: any) {
    e.preventDefault();
  
    // 🔥 BASIC VALIDATE
    if (!title.trim()) {
      toast.error("Product name is required");
      return;
    }
  
    if (!price || isNaN(Number(price))) {
      toast.error("Invalid base price");
      return;
    }
  
    if (!category) {
      toast.error("Please select category");
      return;
    }
      for (const p of categoryProperties) {
        const found = productAttributes.find(
          (a) => a.property === p._id.toString()
        );
    
        if (!found || !found.value) {
          toast.error(`Chưa chọn ${p.name}`);
          return;
        }
      }
    if (!images || images.length === 0) {
      toast.error("Please upload at least 1 image");
      return;
    }
  
    // 🔥 ATTRIBUTES (non-variant)
    const nonVariantProps = categoryProperties.filter(p => !p.isVariant);
  
    const missingAttr = nonVariantProps.find(
      p => !productAttributes.find(a => a.property === p._id)
    );
  
    if (missingAttr) {
      toast.error(`Thiếu thuộc tính: ${missingAttr.name}`);
      return;
    }
  
    // 🔥 VARIANT VALIDATE
    if (variantProps.length > 0) {
      if (!variants || variants.length === 0) {
        toast.error("Chưa có variant");
        return;
      }
  
      for (let i = 0; i < variants.length; i++) {
        const v = variants[i];
  
        // price + stock
        if (
          v.price === "" ||
          v.stock === "" ||
          isNaN(Number(v.price)) ||
          isNaN(Number(v.stock))
        ) {
          toast.error(`Variant #${i + 1} có price/stock không hợp lệ`);
          return;
        }
  
        const attrs = v.attributes || {};
  
        // thiếu attribute
        if (Object.keys(attrs).length !== variantProps.length) {
          toast.error(`Variant #${i + 1} thiếu thuộc tính`);
          return;
        }
  
        // attribute rỗng
        for (const p of variantProps) {
          const key = p._id.toString();
          if (!attrs[key]) {
            toast.error(`Variant #${i + 1} thiếu ${p.name}`);
            return;
          }
        }
      }
    }
  
    // 🔥 DATA
    const data = {
      title,
      description,
      price,
      brand,
      images,
      category,
      attributes: productAttributes,
      variants,
    };
  
  
    // 🔥 SAVE
    if (_id) {
      await axios.put(`/api/products/${_id}`, data);
      toast.success("Updated");
    } else {
      await axios.post("/api/products", data);
      toast.success("Created");
    }
  
    router.push("/products");
  }

  return (
    <form onSubmit={saveProduct} className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow space-y-6">

      {/* BASIC */}
      <div>
        <label className="text-sm font-medium">Product Name</label>
        <input value={title} onChange={e => setTitle(e.target.value)} className={inputClass}/>
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} className={inputClass}/>
      </div>

      <div>
        <label className="text-sm font-medium">Price</label>
        <input value={price} onChange={e => setPrice(e.target.value)} className={inputClass}/>
      </div>

      <div>
        <label className="text-sm font-medium">Brand</label>
        <input value={brand} onChange={e => setBrand(e.target.value.toUpperCase())} className={inputClass}/>
      </div>

      <div>
        <label className="text-sm font-medium">Category</label>
        <CategorySelect value={category} onChange={(newCat)=>{ 
          if (variants.length > 0 || productAttributes.length > 0) {
            const ok = confirm("Đổi category sẽ xoá variants & attributes. Tiếp tục?");
            if (!ok) return;
          }
      
          setCategory(newCat);
        }}/>
      </div>

      {/* 🔥 ATTRIBUTES */}
      {categoryProperties.length > 0 && (
        <div className="border rounded-lg bg-white shadow-sm">

          <div className="flex justify-between items-center p-3 border-b">
            <h3 className="font-semibold">Properties</h3>

            <input
              placeholder="Search..."
              onChange={(e)=>setPropSearch(e.target.value)}
              className="border px-2 py-1 text-sm rounded w-40"
            />
          </div>

          <div className="max-h-[300px] overflow-y-auto p-3">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

            {categoryProperties
              .filter(p =>
                p.name.toLowerCase().includes(propSearch.toLowerCase())
              )
              .map((prop: any) => {

                const existing = productAttributes.find(
                  (p: any) =>
                    p.property?.toString() === prop._id?.toString()
                );

                return (
                  <div key={prop._id}>
                    <label className="text-xs text-gray-500">
                      {prop.name}
                    </label>

                    <select
                      value={existing?.value || ""}
                      onChange={(e) =>
                        updateAttribute(prop._id, e.target.value)
                      }
                      className="w-full border rounded px-2 py-1 text-sm"
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
        </div>
      )}

      {/* 🔥 VARIANTS */}
      <div>
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Variants</h3>
          <div className="flex gap-2">
            <button type="button" onClick={generateVariants} className="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded text-sm cursor-pointer">Auto</button>
            <button type="button" onClick={addVariant} className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm cursor-pointer">+ Add</button>
          </div>
        </div>

        {variants.length > 0 && (
          <div className="mt-4 space-y-4">
            {variants.map((v, i) => (
              <div key={i} className="border rounded-xl p-4 bg-white shadow-sm">

                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-sm">Variant #{i + 1}</span>
                  <button type="button" onClick={() => removeVariant(i)} className="btn-delete text-sm">Remove</button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {variantProps.map((prop: any) => (
                    <div key={prop._id}>
                      <label className="text-xs text-gray-500 mb-1 block">
                        {prop.name}
                      </label>

                      <select
                        value={v.attributes?.[prop._id.toString()] || ""}
                        onChange={(e) =>
                          updateVariantAttr(i, prop._id, e.target.value)
                        }
                        className="w-full border rounded-md px-2 py-2 text-sm bg-white"
                      >
                        <option value="">Select</option>

                        {prop.values.map((val: any) => (
                          <option key={val._id} value={val._id}>
                            {val.value}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <input
                    value={v.price}
                    onChange={(e) => updateVariant(i, "price", e.target.value)}
                    placeholder="Price"
                    className="border px-3 py-2 rounded-md"
                  />
                  <input
                    value={v.stock}
                    onChange={(e) => updateVariant(i, "stock", e.target.value)}
                    placeholder="Stock"
                    className="border px-3 py-2 rounded-md"
                  />
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      <ImagesUpload images={images} setImages={setImages}/>

      <div className="flex justify-center gap-2">
        <button className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">Save</button>
        <button type="button" onClick={()=>router.push("/products")} className="border px-4 py-2 rounded">Cancel</button>
      </div>

    </form>
  );
}
