import clientPromise from "../lib/mongodb.mjs";

/* ================== HELPERS ================== */

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function cartesianProduct(arr) {
  return arr.reduce(
    (a, b) => a.flatMap(d => b.map(e => [...d, e])),
    [[]]
  );
}

/* ================== PROPERTY MAP ================== */

const PROPERTY_MAP = {
  "Điện thoại": [
    { name: "Brand", values: ["Apple", "Samsung", "Xiaomi"], isVariant: false },
    { name: "RAM", values: ["6GB", "8GB", "12GB"], isVariant: true },
    { name: "Storage", values: ["128GB", "256GB", "512GB"], isVariant: true },
    { name: "Color", values: ["Black", "White", "Blue"], isVariant: true },
  ],

  "Laptop": [
    { name: "Brand", values: ["Apple", "Dell", "Asus"], isVariant: false },
    { name: "RAM", values: ["8GB", "16GB", "32GB"], isVariant: true },
    { name: "Storage", values: ["256GB", "512GB", "1TB"], isVariant: true },
  ],

  "Áo": [
    { name: "Size", values: ["M", "L", "XL"], isVariant: true },
    { name: "Color", values: ["Black", "White", "Blue"], isVariant: true },
  ],
};

/* ================== PRODUCT TEMPLATES ================== */

const MODELS = {
  "Điện thoại": [
    { name: "iPhone 15", brand: "Apple", base: 900 },
    { name: "iPhone 15 Pro Max", brand: "Apple", base: 1200 },
    { name: "Samsung S23 Ultra", brand: "Samsung", base: 1100 },
    { name: "Xiaomi 13 Pro", brand: "Xiaomi", base: 800 },
  ],

  "Laptop": [
    { name: "Macbook Air M2", brand: "Apple", base: 1300 },
    { name: "Dell XPS 13", brand: "Dell", base: 1200 },
    { name: "Asus ROG Strix", brand: "Asus", base: 1500 },
  ],

  "Áo": [
    { name: "Áo thun basic", brand: "Local Brand", base: 10 },
    { name: "Áo hoodie", brand: "Local Brand", base: 20 },
  ],
};

/* ================== EXTRACT PROPERTIES ================== */

function extractAllProperties() {
  const all = {};

  Object.values(PROPERTY_MAP).forEach(list => {
    list.forEach(p => {
      if (!all[p.name]) {
        all[p.name] = {
          name: p.name,
          values: new Set(),
          isVariant: p.isVariant,
        };
      }
      p.values.forEach(v => all[p.name].values.add(v));
    });
  });

  return Object.values(all).map(p => ({
    name: p.name,
    values: [...p.values],
    isVariant: p.isVariant,
  }));
}

/* ================== MAIN SEED ================== */

async function seed() {
  const client = await clientPromise;
  const db = client.db("ecommerce");

  console.log("🧹 Clearing...");
  await db.collection("categories").deleteMany({});
  await db.collection("properties").deleteMany({});
  await db.collection("propertyvalues").deleteMany({});
  await db.collection("products").deleteMany({});
  await db.collection("variants").deleteMany({});

  /* ===== PROPERTIES ===== */
  const allProps = extractAllProperties();

  const propDocs = allProps.map(p => ({
    name: p.name,
    isVariant: p.isVariant,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  const propRes = await db.collection("properties").insertMany(propDocs);

  const propMap = {};
  propDocs.forEach((p, i) => {
    propMap[p.name] = propRes.insertedIds[i];
  });

  /* ===== VALUES ===== */
  const valueDocs = [];

  allProps.forEach(p => {
    const propId = propMap[p.name];

    p.values.forEach(val => {
      valueDocs.push({
        property: propId,
        value: val,
        slug: slugify(val),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  });

  await db.collection("propertyvalues").insertMany(valueDocs);

  const values = await db.collection("propertyvalues").find().toArray();

  const valueGrouped = {};
  values.forEach(v => {
    const key = v.property.toString();
    if (!valueGrouped[key]) valueGrouped[key] = [];
    valueGrouped[key].push(v);
  });

  /* ===== CATEGORIES ===== */
  const categoryIds = {};

  for (const name of Object.keys(PROPERTY_MAP)) {
    const res = await db.collection("categories").insertOne({
      name,
      slug: slugify(name),
      level: 1,
      path: slugify(name),
      properties: PROPERTY_MAP[name].map(p => propMap[p.name]),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    categoryIds[name] = res.insertedId;
  }

  /* ===== PRODUCTS ===== */
  let total = 0;

  for (let i = 0; i < 500; i++) {
    const catName = random(Object.keys(PROPERTY_MAP));
    const categoryId = categoryIds[catName];
    const model = random(MODELS[catName]);

    const props = PROPERTY_MAP[catName];

    // product attributes (non-variant)
    const attributes = props
      .filter(p => !p.isVariant)
      .map(p => {
        const vals = valueGrouped[propMap[p.name].toString()];
        const val = random(vals);

        return {
          property: propMap[p.name],
          value: val._id,
        };
      });

    const title = `${model.name} ${random(["Chính hãng", "Giá tốt", "Sale"])}`;

    const basePrice = model.base;

    const productRes = await db.collection("products").insertOne({
      title,
      slug: slugify(title + "-" + i),
      description: "Sản phẩm chất lượng cao",

      brand: model.brand,
      category: categoryId,

      price: basePrice,
      minPrice: basePrice,
      maxPrice: basePrice + 300,

      images: [
        `https://picsum.photos/seed/${i}/500`,
        `https://picsum.photos/seed/${i + 1}/500`,
      ],

      attributes,
      properties: props.map(p => propMap[p.name]),

      rating: +(Math.random() * 2 + 3).toFixed(1),
      sold: rand(10, 2000),
      discount: rand(0, 30),

      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const productId = productRes.insertedId;

    /* ===== VARIANTS ===== */
    const variantProps = props.filter(p => p.isVariant);

    const arrays = variantProps.map(p =>
      valueGrouped[propMap[p.name].toString()]
    );

    const combos = cartesianProduct(arrays);

    const variants = [];

    for (let combo of combos.slice(0, 10)) {
      let price = basePrice;

      combo.forEach(v => {
        const val = v.value.toLowerCase();
        if (val.includes("256")) price += 100;
        if (val.includes("512")) price += 200;
        if (val.includes("16")) price += 80;
      });

      const attrs = combo.map(v => ({
        property: v.property,
        value: v._id,
      }));

      const key = attrs
        .map(a => `${a.property}:${a.value}`)
        .sort()
        .join("|");

      variants.push({
        product: productId,
        sku: `SKU-${i}-${variants.length}`,
        price,
        stock: rand(0, 100),
        attributes: attrs,
        variantKey: key,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await db.collection("variants").insertMany(variants);

    total++;
  }

  console.log("🚀 DONE:", total, "products");
  process.exit();
}

seed();