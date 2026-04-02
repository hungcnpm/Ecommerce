"use client";

import Layout from "@/components/Layout";
import axios from "axios";
import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import ConfirmModal from "@/components/ConfirmModal";
import toast from "react-hot-toast";
import { set } from "mongoose";
import { useRouter } from "next/navigation";
export default function Products() {
  //#region States
  const [products, setProducts] = useState([]);
  const [productToDelete, setProductToDelete] = useState(null);

  // 🔥 SaaS states
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [sort, setSort] = useState("newest");
  const [totalPages, setTotalPages] = useState(1);
  const [highlightId, setHighlightId] = useState("");
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const highlightRef = useRef<HTMLTableRowElement | null>(null);
  const isFirstLoad = useRef(true);
  //#endregion
  
  //#region Effects
  // 🔥 debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
  
    setPage(Number(params.get("page")) || 1);
    setSearch(params.get("search") || "");
    setSort(params.get("sort") || "newest");
    setDebouncedSearch(params.get("search") || "");
    setIsReady(true);
    setHighlightId((params.get("highlight") || "").trim());
  }, []);
  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [products]);
  useEffect(() => {
    if (highlightId) {
      const t = setTimeout(() => {
        setHighlightId("");
      }, 3000);
  
      return () => clearTimeout(t);
    }
  }, [highlightId]);
  useEffect(() => {
    if(!isReady) return;  
    loadProducts();
  }, [page, debouncedSearch, sort, isReady]);
  //#endregion
  async function deleteProduct(id: string) {
    await axios.delete(`/api/products/${id}`);
    toast.success("Product deleted");
    setProductToDelete(null);
    loadProducts();
  }
  async function loadProducts() {
    const res = await fetch(
      `/api/products?page=${page}&limit=${limit}&search=${debouncedSearch}&sort=${sort}`
    );
  
    const data = await res.json();
  
    if (!Array.isArray(data.products)) {
      setProducts([]);
    } else {
      setProducts(Array.isArray(data.products) ? data.products : []);
    }
    setTotalPages(data.totalPages || 1);
  }
  async function deleteSelected() {
    for (const id of selected) {
      await axios.delete(`/api/products/${id}`);
    }
    toast.success("Deleted selected products");
    setSelected([]);
    loadProducts();
  }

  // 🔥 filter + pagination
  const paginated = products;
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="text-sm text-gray-500">
              SaaS product management
            </p>
          </div>

          <Link href="/products/newproduct" className="btn-primary">
            + Add Product
          </Link>
        </div>

        {/* TOOLBAR */}
        <div className="sticky top-0 z-10 bg-white border rounded-xl p-4 mb-4 flex flex-wrap gap-3 items-center justify-between">

          {/* LEFT */}
          <div className="flex gap-2 items-center">

            {/* SEARCH */}
            <input
              placeholder="Search product..."
              value={search}
              onChange={(e) =>{
                setSearch(e.target.value)
                setPage(1)
              }
              } 
              className="input w-[250px]"
            />

            {/* SORT */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input w-[160px] mb-4"
            >
              <option value="newest">Newest</option>
              <option value="name">Name</option>
              <option value="price_asc">Price ↑</option>
              <option value="price_desc">Price ↓</option>
            </select>

          </div>

          {/* RIGHT */}
          <div className="flex gap-2">

            {selected.length > 0 && (
              <button onClick={deleteSelected} className="btn-danger">
                Delete ({selected.length})
              </button>
            )}

          </div>

        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl border shadow-sm flex flex-col h-[calc(100vh-260px)] ">
          <div className="flex-1 overflow-auto">
          {!isReady ? (
            <div>Loading...</div>
          ) : products.length === 0 ? (
            <div>No products</div>
          ) : (
            // table
            <table className="w-full text-sm">

              <thead className="bg-gray-50 text-xs uppercase text-gray-600 sticky top-0 z-20 shadow-sm">
                <tr>
                  <th className="px-4 py-3">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelected(paginated.map((p: any) => p._id));
                        } else {
                          setSelected([]);
                        }
                      }}
                    />
                  </th>

                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">

                {paginated.map((p: any) => {
                  const lowStock =
                  p.variants?.some((v: any) => v.stock < 5) ||
                  false;

                  return (
                    <Fragment key={p._id}>
                      <tr  key={p._id}
                        className={`transition cursor-pointer ${
                          p._id?.toString() === highlightId
                            ? "bg-yellow-100 border-l-4 border-yellow-400"
                            : "hover:bg-gray-50"
                        }`}
                        ref={p._id?.toString() === highlightId ? highlightRef : null}
                        >

                        {/* CHECK */}
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selected.includes(p._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelected((prev) => [...prev, p._id]);
                              } else {
                                setSelected((prev) =>
                                  prev.filter((id) => id !== p._id)
                                );
                              }
                            }}
                          />
                        </td>

                        {/* PRODUCT */}
                        <td
                          className="px-4 py-3 cursor-pointer"
                          onClick={() =>
                            setExpanded(expanded === p._id ? null : p._id)
                          }
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images?.[0] || ""}
                              className="w-10 h-10 rounded-lg object-cover border"
                            />
                            <div>
                              <div className="font-medium">{p.title}</div>
                              <div className="text-xs text-gray-500">
                                {p.brand || "-"}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* PRICE */}
                        <td className="px-4 py-3 font-semibold text-blue-600">
                        {p.price !== null
                        ? `$${p.price}`
                        : `$${p.minPrice} - $${p.maxPrice}`}
                        </td>

                        {/* STATUS */}
                        <td className="px-4 py-3">
                          {lowStock ? (
                            <span className="badge-warning">Low stock</span>
                          ) : (
                            <span className="badge-success">Active</span>
                          )}
                        </td>

                        {/* ACTION */}
                        <td className="px-4 py-3">
                          <div className="flex gap-2 justify-end">
                            <Link
                              href={`/products/edit/${p._id}?page=${page}&search=${search}&sort=${sort}`}
                              className="btn-secondary"
                            >
                              Edit
                            </Link>

                            <button
                              onClick={() => setProductToDelete(p)}
                              className="btn-danger"
                            >
                              Delete
                            </button>
                          </div>
                        </td>

                      </tr>

                      {/* EXPAND */}
                      {expanded === p._id && (
                        <tr>
                          <td colSpan={5} className="bg-gray-50 px-6 py-4">

                            <div className="text-sm text-gray-600">
                              <div className="mb-2 font-medium">Variants</div>

                              {p.variants?.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                  {p.variants.map((v: any, i: number) => (
                                    <div key={i} className="border rounded p-2">
                                      <div>Price: ${v.price}</div>
                                      <div>Stock: {v.stock}</div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div>No variants</div>
                              )}

                            </div>

                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}

              </tbody>
            </table>
          )}
          </div>
           {/* PAGINATION */}
          <div className="border-t p-4 flex justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  page === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

       

        {/* MODAL */}
        {productToDelete && (
          <ConfirmModal
            title={`Delete "${productToDelete.title}" ?`}
            onConfirm={() => deleteProduct(productToDelete._id)}
            onCancel={() => setProductToDelete(null)}
          />
        )}

      </div>
    </Layout>
  );
}