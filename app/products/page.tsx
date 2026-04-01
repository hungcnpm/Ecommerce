"use client";

import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import ConfirmModal from "@/components/ConfirmModal";
import toast from "react-hot-toast";

export default function Products() {
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

  // 🔥 debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  async function loadProducts() {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function deleteProduct(id: string) {
    await axios.delete(`/api/products/${id}`);
    toast.success("Product deleted");
    setProductToDelete(null);
    loadProducts();
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
  const filtered = products
  .filter((p: any) =>
    p.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  )
  .sort((a: any, b: any) => {
    if (sort === "price_asc") return a.price - b.price
    if (sort === "price_desc") return b.price - a.price
    if (sort === "name") return a.title.localeCompare(b.title)
    return 0
  })

  const paginated = filtered.slice(
    (page - 1) * limit,
    page * limit
  );

  const totalPages = Math.ceil(filtered.length / limit);

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
              onChange={(e) => setSearch(e.target.value)}
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
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden max-h-[600px] ">

          <table className="w-full text-sm">

            <thead className="bg-gray-50 text-xs uppercase text-gray-600 sticky top-[0px]">
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
                const lowStock = p.variants?.some((v: any) => v.stock < 5);

                return (
                  <>
                    <tr key={p._id} className="hover:bg-gray-50">

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
                        ${p.price || 0}
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
                            href={"/products/edit/" + p._id}
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
                  </>
                );
              })}

            </tbody>
          </table>

        </div>

        {/* PAGINATION */}
        <div className="flex justify-center gap-2 mt-4">
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