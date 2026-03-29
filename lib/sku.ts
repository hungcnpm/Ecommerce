import { Db } from "mongodb";

// 🔥 atomic counter
export async function getNextSKU(db: any) {
  const result = await db.collection("counters").findOneAndUpdate(
    { _id: "sku" },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: "after" }
  );

  return result?.seq;
}
// 🔥 generate SKU
export function generateSKUEnterprise(
  attributes: any,
  prefix: string,
  id: number
) {
  const attrPart = Object.values(attributes)
    .map((v: any) => v.toString().slice(0, 3).toUpperCase())
    .join("-");

  return `${prefix}-${attrPart}-${id}`;
}
function getDateCode() {
    const d = new Date();
    const yy = String(d.getFullYear()).slice(2);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
  
    return `${yy}${mm}${dd}`;
  }
  
  function padId(id: number) {
    return String(id).padStart(6, "0");
  }
  
  export function generateSKUProMax(
    attributes: any,
    prefix: string,
    brand: string,
    id: number
  ) {
    const attrPart = Object.values(attributes)
      .map((v: any) => v.toString().slice(0, 3).toUpperCase())
      .join("-");
  
    return [
      prefix || "SKU",
      brand || "GEN",
      attrPart || "BASE",
      getDateCode(),
      padId(id)
    ].join("-");
  }