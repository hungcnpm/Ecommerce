import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

// ====== CONFIG ======
const MONGO_URI = process.env.MONGODB_URI

// ====== SCHEMA (reuse nếu bạn đã có thì import lại) ======
const ProductSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  properties: Object,
})

const CategorySchema = new mongoose.Schema({
  name: String,
  properties: [
    {
      name: String,
      values: [String],
    },
  ],
})

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema)
const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema)

// ====== DATA GENERATOR ======

const adjectives = ["Pro", "Max", "Ultra", "Mini", "Plus", "Smart", "Air"]
const brands = ["Samsung", "Apple", "Xiaomi", "Sony", "LG", "Asus"]

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomPrice(base = 100) {
  return Math.floor(base + Math.random() * base * 5)
}

function generateTitle(categoryName) {
  return `${randomItem(brands)} ${categoryName} ${randomItem(adjectives)}`
}

function generateDescription(title) {
  return `${title} là sản phẩm chất lượng cao, thiết kế hiện đại, phù hợp nhu cầu sử dụng hàng ngày.`
}

function generateProperties(category) {
  const props = {}
  if (!category.properties) return props

  for (const prop of category.properties) {
    if (prop.values?.length) {
      props[prop.name] = randomItem(prop.values)
    }
  }
  return props
}

// ====== MAIN SEED FUNCTION ======

async function seedProducts() {
  await mongoose.connect(MONGO_URI)
  console.log("✅ Connected MongoDB")

  const categories = await Category.find()

  if (!categories.length) {
    console.log("❌ No categories found")
    process.exit(1)
  }

  const products = []

  for (let i = 0; i < 100; i++) {
    const category = randomItem(categories)

    const title = generateTitle(category.name)

    const product = {
      title,
      description: generateDescription(title),
      price: randomPrice(50),
      category: category._id,
      properties: generateProperties(category),
    }

    products.push(product)
  }

  await Product.deleteMany({})
  await Product.insertMany(products)

  console.log(`🚀 Inserted ${products.length} products`)

  await mongoose.disconnect()
}

seedProducts().catch(err => {
  console.error(err)
  process.exit(1)
})