// FINAL UI IMPROVED ProductForm
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
  properties: existingProperties,
}: any) {

  const router = useRouter();

  const inputClass =
    "w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400";

  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages || []);

  const [categories, setCategories] = useState<any[]>([]);
  const [category, setCategory] = useState(
    existingCategory?._id?.toString?.() || existingCategory || ""
  );
  const [productProperties, setProductProperties] = useState(existingProperties || {});
  const [variants, setVariants] = useState(existingVariants || []);
  const [brand, setBrand] = useState(existingBrand ||"");
  const [propSearch, setPropSearch] = useState("");

  useEffect(() => {
    axios.get("/api/categories?limit=9999").then(res => {
      setCategories(res.data.data || []);
    });
  }, []);

  const selectedCategory = categories.find(
    c => c._id?.toString() === category?.toString()
  );

  const categoryProperties = selectedCategory?.properties || [];

  useEffect(() => {
    if (!_id) {
      setProductProperties({});
      setVariants([]);
    }
  }, [category]);

  function addVariant() {
    setVariants(prev => [...prev, { price: "", stock: "", attributes: {} }]);
  }

  function updateVariant(index: number, field: string, value: any) {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  }

  function updateVariantAttr(index: number, key: string, value: string) {
    const newVariants = [...variants];
    newVariants[index].attributes[key] = value;
    if (isDuplicateVariant(newVariants[index], index)) {
      toast.error("Variant already exists!");
      return;
    }

    setVariants(newVariants);
  }
  function isDuplicateSKU() {
    const skus = variants.map(v => v.sku);
    return new Set(skus).size !== skus.length;
  }
  function isDuplicateVariant(newVariant: any, index: number) {
    return variants.some((v, i) => {
      if (i === index) return false;
      return JSON.stringify(v.attributes) === JSON.stringify(newVariant.attributes);
    });
  }

  function removeVariant(index: number) {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  }

  function generateVariants() {
    if (!categoryProperties.length) return;
  
    // fix undefined values
    const lists = categoryProperties.map((p: any) => p.values || []);
  
    function cartesian(arr: any[]): any[] {
      return arr.reduce(
        (a, b) => a.flatMap(d => b.map((e: any) => [...d, e])),
        [[]]
      );
    }
  
    const combos = cartesian(lists);
  
  
    const newVariants = combos.map((combo: any[], index: number) => {
      const attributes: any = {};
  
      combo.forEach((value, i) => {
        attributes[categoryProperties[i].name] = value;
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
    if (!category) {
      toast.error("Please select category");
      return;
    }
    if (
      variants.some(
        v =>
          v.price === "" ||
          v.stock === "" ||
          isNaN(Number(v.price)) ||
          isNaN(Number(v.stock))
      )
    ) {
      toast.error("Invalid price or stock");
      return;
    }
    if (isDuplicateSKU()) {
      toast.error("Duplicate SKU!");
      return;
    }
    const data = {
      title,
      description,
      price,
      brand,
      images,
      category: typeof category === "object" ? category._id : category,
      properties: productProperties,
      variants
    };
    console.log("Saving product with data:", data);
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
        <input
          value={brand}
          onChange={e => setBrand(e.target.value.toUpperCase())}
          className={inputClass}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Category</label>
        <CategorySelect value={category} onChange={setCategory}/>
      </div>

      {categoryProperties.length > 0 && (
        <div className="border rounded-lg bg-white shadow-sm">
          
          {/* HEADER */}
          <div className="flex justify-between items-center p-3 border-b">
            <h3 className="font-semibold">Properties</h3>

            <input
              placeholder="Search..."
              onChange={(e)=>setPropSearch(e.target.value)}
              className="border px-2 py-1 text-sm rounded w-40"
            />
          </div>

          {/* BODY */}
          <div className="max-h-[300px] overflow-y-auto p-3">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

              {categoryProperties
                .filter(p =>
                  p.name.toLowerCase().includes(propSearch.toLowerCase())
                )
                .map((prop: any) => (
                  <div key={prop.name}>
                    <label className="text-xs text-gray-500">{prop.name}</label>

                    <select
                      value={productProperties[prop.name] || ""}
                      onChange={e =>
                        setProductProperties(prev => ({
                          ...prev,
                          [prop.name]: e.target.value
                        }))
                      }
                      className="w-full border rounded px-2 py-1 text-sm"
                    >
                      <option value="">Select</option>
                      {prop.values.map((v: any) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Variants</h3>
          <div className="flex gap-2">
            <button type="button" onClick={generateVariants} className="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded text-sm cursor-pointer">Auto</button>
            <button type="button" onClick={addVariant} className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm cursor-pointer">+ Add</button>
            
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          <input
            placeholder="Set all price"
            className="border px-2 py-1 text-sm"
            onChange={e => {
              const val = e.target.value;
              setVariants(prev => prev.map(v => ({ ...v, price: val })));
            }}
          />
          <input
            placeholder="Set all stock"
            className="border px-2 py-1 text-sm"
            onChange={e => {
              const val = e.target.value;
              setVariants(prev => prev.map(v => ({ ...v, stock: val })));
            }}
          />
        </div>

        {variants.length > 0 && (
          <div className="mt-4 space-y-4">
            {variants.map((v, i) => (
              <div
                key={i}
                className="border rounded-xl p-4 bg-white shadow-sm"
              >
                {/* HEADER */}
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-sm">
                    Variant #{i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeVariant(i)}
                    className="btn-delete text-sm"
                  >
                    Remove
                  </button>
                </div>

                {/* ATTRIBUTES */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categoryProperties.map((prop: any) => (
                    <div key={prop.name}>
                      <label className="text-xs text-gray-500 mb-1 block">
                        {prop.name}
                      </label>

                      <select
                        value={v.attributes[prop.name] || ""}
                        onChange={(e) =>
                          updateVariantAttr(i, prop.name, e.target.value)
                        }
                        className="w-full border rounded-md px-2 py-2 text-sm bg-white"
                      >
                        <option value="">Select</option>
                        {prop.values.map((val: any) => (
                          <option key={val}>{val}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                {/* PRICE + STOCK */}
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

                {/* SKU */}
                <div className="mt-3 flex gap-2">
                  <input
                    value={v.sku || ""}
                    disabled
                    className="border px-3 py-2 rounded-md w-full bg-gray-100 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(v.sku || "")}
                    className="px-3 py-2 text-xs bg-gray-200 rounded-md"
                  >
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="text-sm font-medium">Images</label>
        <ImagesUpload images={images} setImages={setImages}/>
      </div>

      <div className="flex justify-center gap-2">
        <button className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">Save</button>
        <button type="button" onClick={()=>router.push("/products")} className="border px-4 py-2 rounded">Cancel</button>
      </div>

    </form>
  );
}
