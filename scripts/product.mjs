import clientPromise from "../lib/mongodb.mjs";

/* ================== HELPERS ================== */
const categories = [
  {
    name: "Balo & Túi Ví Nam",
    children: [
      { name: "Ba Lô Nam" },
      { name: "Ba Lô Laptop Nam" },
      { name: "Túi & Cặp Đựng Laptop" },
      { name: "Túi Chống Sốc Laptop Nam" },
      { name: "Túi Tote Nam" },
      { name: "Cặp Xách Công Sở Nam" },
      { name: "Ví Cầm Tay Nam" },
      { name: "Túi Đeo Hông & Túi Đeo Ngực Nam" },
      { name: "Túi Đeo Chéo Nam" },
      { name: "Bóp/Ví Nam" },
      { name: "Khác" }
    ]
  },
  {
    name: "Bách Hóa Online",
    children: [
      { name: "Đồ ăn vặt" },
      { name: "Đồ chế biến sẵn" },
      { name: "Nhu yếu phẩm" },
      { name: "Nguyên liệu nấu ăn" },
      { name: "Đồ làm bánh" },
      { name: "Sữa - trứng" },
      { name: "Đồ uống" },
      { name: "Ngũ cốc & mứt" },
      { name: "Các loại bánh" },
      { name: "Đồ uống có cồn" },
      { name: "Bộ quà tặng" },
      { name: "Thực phẩm tươi sống và thực phẩm đông lạnh" },
      { name: "Khác" }
    ]
  },
  {
    name: "Chăm Sóc Thú Cưng",
    children: [
      { name: "Thức ăn cho thú cưng" },
      { name: "Phụ kiện cho thú cưng" },
      { name: "Vệ sinh cho thú cưng" },
      { name: "Quần áo thú cưng" },
      { name: "Chăm sóc sức khỏe" },
      { name: "Làm đẹp cho thú cưng" },
      { name: "Khác" }
    ]
  },
  {
    name: "Dụng cụ và thiết bị tiện ích",
    children: [
      { name: "Dụng cụ cầm tay" },
      { name: "Dụng cụ điện và thiết bị lớn" },
      { name: "Thiết bị mạch điện" },
      { name: "Vật liệu xây dựng" },
      { name: "Thiết bị và phụ kiện xây dựng" }
    ]
  },
  {
    name: "Điện Thoại & Phụ Kiện",
    children: [
      { name: "Điện thoại" },
      { name: "Máy tính bảng" },
      { name: "Pin Dự Phòng" },
      { name: "Pin Gắn Trong, Cáp và Bộ Sạc" },
      { name: "Ốp lưng, bao da, Miếng dán điện thoại" },
      { name: "Bảo vệ màn hình" },
      { name: "Đế giữ điện thoại" },
      { name: "Thẻ nhớ" },
      { name: "Sim" }
    ]
  },
  {
    name: "Đồ Chơi",
    children: [
      { name: "Sở thích & Sưu tầm" },
      { name: "Đồ chơi giải trí" },
      { name: "Đồ chơi giáo dục" },
      { name: "Đồ chơi cho trẻ sơ sinh & trẻ nhỏ" },
      { name: "Đồ chơi vận động & ngoài trời" },
      { name: "Búp bê & Đồ chơi nhồi bông" }
    ]
  },
  {
    name: "Đồng Hồ",
    children: [
      { name: "Đồng Hồ Nam" },
      { name: "Đồng Hồ Nữ" },
      { name: "Bộ Đồng Hồ & Đồng Hồ Cặp" },
      { name: "Đồng Hồ Trẻ Em" },
      { name: "Phụ Kiện Đồng Hồ" },
      { name: "Khác" }
    ]
  },
  {
    name: "Giày Dép Nam",
    children: [
      { name: "Bốt" },
      { name: "Giày Thể Thao/ Sneakers" },
      { name: "Giày Sục" },
      { name: "Giày Tây Lười" },
      { name: "Giày Oxfords & Giày Buộc Dây" },
      { name: "Xăng-đan và Dép" },
      { name: "Phụ kiện giày dép" },
      { name: "Khác" }
    ]
  },
  {
    name: "Giày Dép Nữ",
    children: [
      { name: "Bốt" },
      { name: "Giày Thể Thao/ Sneaker" },
      { name: "Giày Đế Bằng" },
      { name: "Giày Cao Gót" },
      { name: "Giày Đế Xuồng" },
      { name: "Xăng-đan Và Dép" },
      { name: "Phụ Kiện Giày" },
      { name: "Giày Khác" }
    ]
  },
  {
    name: "Giặt Giũ & Chăm Sóc Nhà Cửa",
    children: [
      { name: "Giặt giũ & Chăm sóc nhà cửa" },
      { name: "Giấy vệ sinh, khăn giấy" },
      { name: "Vệ sinh nhà cửa" },
      { name: "Vệ sinh bát đĩa" },
      { name: "Dụng cụ vệ sinh" },
      { name: "Chất khử mùi, làm thơm" },
      { name: "Thuốc diệt côn trùng" },
      { name: "Túi, màng bọc thực phẩm" },
      { name: "Bao bì, túi đựng rác" }
    ]
  },
  {
    name: "Máy Tính & Laptop",
    children: [
      { name: "Máy Tính Bàn" },
      { name: "Màn Hình" },
      { name: "Linh Kiện Máy Tính" },
      { name: "Thiết Bị Lưu Trữ" },
      { name: "Thiết Bị Mạng" },
      { name: "Máy In, Máy Scan & Máy Chiếu" },
      { name: "Phụ Kiện Máy Tính" },
      { name: "Laptop" },
      { name: "Khác" }
    ]
  },
  {
    name: "Máy Ảnh & Máy Quay Phim",
    children: [
      { name: "Máy ảnh - Máy quay phim" },
      { name: "Camera giám sát & Camera hệ thống" },
      { name: "Thẻ nhớ" },
      { name: "Ống kính" },
      { name: "Phụ kiện máy ảnh" },
      { name: "Máy bay camera & Phụ kiện" }
    ]
  },
  {
    name: "Mẹ & Bé",
    children: [
      { name: "Đồ dùng du lịch cho bé" },
      { name: "Đồ dùng ăn dặm cho bé" },
      { name: "Phụ kiện cho mẹ" },
      { name: "Chăm sóc sức khỏe mẹ" },
      { name: "Đồ dùng phòng tắm & Chăm sóc cơ thể bé" },
      { name: "Đồ dùng phòng ngủ cho bé" },
      { name: "An toàn cho bé" },
      { name: "Thực phẩm cho bé" },
      { name: "Chăm sóc sức khỏe bé" },
      { name: "Tã & bô em bé" },
      { name: "Đồ chơi" },
      { name: "Bộ & Gói quà tặng" },
      { name: "Khác" }
    ]
  },
  {
    name: "Nhà Cửa & Đời Sống",
    children: [
      { name: "Chăn, Ga, Gối & Nệm" },
      { name: "Đồ nội thất" },
      { name: "Trang trí nhà cửa" },
      { name: "Dụng cụ & Thiết bị tiện ích" },
      { name: "Đồ dùng nhà bếp và hộp đựng thực phẩm" },
      { name: "Đèn" },
      { name: "Ngoài trời & Sân vườn" },
      { name: "Đồ dùng phòng tắm" },
      { name: "Vật phẩm thờ cúng" },
      { name: "Đồ trang trí tiệc" },
      { name: "Chăm sóc nhà cửa và giặt ủi" },
      { name: "Sắp xếp nhà cửa" },
      { name: "Dụng cụ pha chế" },
      { name: "Tinh dầu thơm phòng" },
      { name: "Đồ dùng phòng ăn" }
    ]
  },
  {
    name: "Nhà Sách Online",
    children: [
      { name: "Sách Tiếng Việt" },
      { name: "Sách ngoại văn" },
      { name: "Gói Quà" },
      { name: "Bút viết" },
      { name: "Dụng cụ học sinh & văn phòng" },
      { name: "Màu, Họa Cụ và Đồ Thủ Công" },
      { name: "Sổ và Giấy Các Loại" },
      { name: "Quà Lưu Niệm" },
      { name: "Nhạc cụ và phụ kiện âm nhạc" }
    ]
  },
  {
    name: "Ô Tô & Xe Máy & Xe Đạp",
    children: [
      { name: "Xe đạp, xe điện" },
      { name: "Mô tô, xe máy" },
      { name: "Xe Ô tô" },
      { name: "Mũ bảo hiểm" },
      { name: "Phụ kiện xe máy" },
      { name: "Phụ kiện xe đạp" },
      { name: "Phụ kiện bên trong ô tô" },
      { name: "Dầu nhớt & dầu nhờn" },
      { name: "Phụ tùng ô tô" },
      { name: "Phụ tùng xe máy" },
      { name: "Phụ kiện bên ngoài ô tô" },
      { name: "Chăm sóc ô tô" },
      { name: "Dịch vụ cho xe" }
    ]
  },
  {
    name: "Phụ Kiện & Trang Sức Nữ",
    children: [
      { name: "Nhẫn" },
      { name: "Bông tai" },
      { name: "Khăn choàng" },
      { name: "Găng tay" },
      { name: "Phụ kiện tóc" },
      { name: "Vòng tay & Lắc tay" },
      { name: "Lắc chân" },
      { name: "Mũ" },
      { name: "Dây chuyền" },
      { name: "Kính mắt" },
      { name: "Kim loại quý" },
      { name: "Thắt lưng" },
      { name: "Cà vạt & Nơ cổ" },
      { name: "Phụ kiện thêm" },
      { name: "Bộ phụ kiện" },
      { name: "Khác" },
      { name: "Vớ/ Tất" }
    ]
  },
  {
    name: "Sắc Đẹp",
    children: [
      { name: "Chăm sóc da mặt" },
      { name: "Tắm & chăm sóc cơ thể" },
      { name: "Trang điểm" },
      { name: "Chăm sóc tóc" },
      { name: "Dụng cụ & Phụ kiện Làm đẹp" },
      { name: "Vệ sinh răng miệng" },
      { name: "Nước hoa" },
      { name: "Chăm sóc nam giới" },
      { name: "Chăm sóc phụ nữ" },
      { name: "Bộ sản phẩm làm đẹp" },
      { name: "Khác" }
    ]
  },
  {
    name: "Sức Khỏe",
    children: [
      { name: "Vật tư y tế" },
      { name: "Chống muỗi & xua đuổi côn trùng" },
      { name: "Thực phẩm chức năng" },
      { name: "Tã người lớn" },
      { name: "Hỗ trợ làm đẹp" },
      { name: "Hỗ trợ tình dục" },
      { name: "Dụng cụ massage và trị liệu" },
      { name: "Khác" }
    ]
  },
  {
    name: "Thiết Bị Điện Gia Dụng",
    children: [
      { name: "Đồ gia dụng nhà bếp" },
      { name: "Đồ gia dụng lớn" },
      { name: "Máy hút bụi & Thiết bị làm sạch" },
      { name: "Quạt & Máy nóng lạnh" },
      { name: "Thiết bị chăm sóc quần áo" },
      { name: "Máy xay, ép, máy đánh trứng trộn bột, máy xay thực phẩm" },
      { name: "Bếp điện" },
      { name: "Khác" }
    ]
  },
  {
    name: "Thiết Bị Điện Tử",
    children: [
      { name: "Phụ kiện tivi" },
      { name: "Máy Game Console" },
      { name: "Phụ kiện Console" },
      { name: "Đĩa game" },
      { name: "Linh phụ kiện" },
      { name: "Tai nghe nhét tai" },
      { name: "Loa" },
      { name: "Tivi" },
      { name: "Tivi Box" },
      { name: "Headphones" }
    ]
  },
  {
    name: "Thể Thao & Du Lịch",
    children: [
      { name: "Vali" },
      { name: "Túi du lịch" },
      { name: "Phụ kiện du lịch" },
      { name: "Dụng Cụ Thể Thao & Dã Ngoại" },
      { name: "Giày Thể Thao" },
      { name: "Thời Trang Thể Thao & Dã Ngoại" },
      { name: "Phụ Kiện Thể Thao & Dã Ngoại" },
      { name: "Khác" }
    ]
  },
  {
    name: "Thời Trang Nam",
    children: [
      { name: "Áo Khoác" },
      { name: "Áo Vest và Blazer" },
      { name: "Áo Hoodie, Áo Len & Áo Nỉ" },
      { name: "Quần Jeans" },
      { name: "Quần Dài/Quần Âu" },
      { name: "Quần Short" },
      { name: "Áo" },
      { name: "Áo Ba Lỗ" },
      { name: "Đồ Lót" },
      { name: "Đồ Ngủ" },
      { name: "Đồ Bộ" },
      { name: "Vớ/Tất" },
      { name: "Trang Phục Truyền Thống" },
      { name: "Đồ Hóa Trang" },
      { name: "Trang Phục Ngành Nghề" },
      { name: "Khác" },
      { name: "Trang Sức Nam" },
      { name: "Kính Mắt Nam" },
      { name: "Thắt Lưng Nam" },
      { name: "Cà vạt & Nơ cổ" },
      { name: "Phụ Kiện Nam" }
    ]
  },
  {
    name: "Thời Trang Nữ",
    children: [
      { name: "Quần" },
      { name: "Quần đùi" },
      { name: "Chân váy" },
      { name: "Quần jeans" },
      { name: "Đầm/Váy" },
      { name: "Váy cưới" },
      { name: "Đồ liền thân" },
      { name: "Áo khoác, Áo choàng & Vest" },
      { name: "Áo len & Cardigan" },
      { name: "Hoodie và Áo nỉ" },
      { name: "Bộ" },
      { name: "Đồ lót" },
      { name: "Đồ ngủ" },
      { name: "Áo" },
      { name: "Đồ tập" },
      { name: "Đồ Bầu" },
      { name: "Đồ truyền thống" },
      { name: "Đồ hóa trang" },
      { name: "Vải" },
      { name: "Vớ/ Tất" },
      { name: "Khác" }
    ]
  },
  {
    name: "Thời Trang Trẻ Em",
    children: [
      { name: "Trang phục bé trai" },
      { name: "Trang phục bé gái" },
      { name: "Giày dép bé trai" },
      { name: "Giày dép bé gái" },
      { name: "Quần áo em bé" },
      { name: "Giày tập đi & Tất sơ sinh" },
      { name: "Phụ kiện trẻ em" },
      { name: "Khác" }
    ]
  },
  {
    name: "Túi Ví Nữ",
    children: [
      { name: "Ba Lô Nữ" },
      { name: "Cặp Laptop" },
      { name: "Ví Dự Tiệc & Ví Cầm Tay" },
      { name: "Túi Đeo Hông & Túi Đeo Ngực" },
      { name: "Túi Tote" },
      { name: "Túi Quai Xách" },
      { name: "Túi Đeo Chéo & Túi Đeo Vai" },
      { name: "Ví/Bóp Nữ" },
      { name: "Phụ Kiện Túi" },
      { name: "Khác" }
    ]
  },
  {
    name: "Voucher & Dịch Vụ",
    children: [
      { name: "Nhà hàng & Ăn uống" },
      { name: "Sự kiện & Giải trí" },
      { name: "Nạp tiền tài khoản" },
      { name: "Sức khỏe & Làm đẹp" },
      { name: "Gọi xe" },
      { name: "Khóa học" },
      { name: "Du lịch & Khách sạn" },
      { name: "Mua sắm" },
      { name: "Mã quà tặng Shopee" },
      { name: "Thanh toán hóa đơn" },
      { name: "Dịch vụ khác" }
    ]
  }
];
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