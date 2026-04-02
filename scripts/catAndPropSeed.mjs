import clientPromise from "../lib/mongodb.mjs";
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
  export function getPropertiesByCategory(name) {
    const map = {
  
      /* ================== 📱 ĐIỆN THOẠI ================== */
      "Điện thoại": [
        { name: "Brand", values: ["Apple", "Samsung", "Xiaomi", "Oppo"], isVariant: false },
        { name: "RAM", values: ["4GB", "6GB", "8GB", "12GB", "16GB"], isVariant: true },
        { name: "Storage", values: ["64GB", "128GB", "256GB", "512GB"], isVariant: true },
        { name: "Color", values: ["Black", "White", "Blue", "Purple", "Gold"], isVariant: true },
        { name: "Screen Size (inch)", values: ["5.5", "6.1", "6.7"], isVariant: false },
        { name: "Battery (mAh)", values: ["3000", "4000", "5000"], isVariant: false },
        { name: "Camera (MP)", values: ["12", "48", "108"], isVariant: false },
        { name: "Chip", values: ["A15", "A16", "Snapdragon 8"], isVariant: false },
        { name: "SIM", values: ["1 SIM", "2 SIM", "eSIM"], isVariant: false },
        { name: "OS", values: ["iOS", "Android"], isVariant: false },
        { name: "Condition", values: ["New", "Like New"], isVariant: false }
      ],
  
      /* ================== 💻 LAPTOP ================== */
      "Laptop": [
        { name: "Brand", values: ["Dell", "HP", "Asus", "Apple"], isVariant: false },
        { name: "CPU", values: ["i5", "i7", "i9", "Ryzen 5", "Ryzen 7"], isVariant: false },
        { name: "RAM", values: ["8GB", "16GB", "32GB"], isVariant: true },
        { name: "Storage", values: ["256GB", "512GB", "1TB"], isVariant: true },
        { name: "GPU", values: ["Integrated", "RTX 3050", "RTX 4060"], isVariant: false },
        { name: "Screen Size (inch)", values: ["13", "14", "15.6", "17"], isVariant: false }
      ],
  
      /* ================== 🔋 PIN ================== */
      "Pin Dự Phòng": [
        { name: "Capacity (mAh)", values: ["5000", "10000", "20000"], isVariant: true },
        { name: "Output (W)", values: ["10", "18", "30"], isVariant: false },
        { name: "Brand", values: ["Anker", "Xiaomi", "Baseus"], isVariant: false }
      ],
  
      /* ================== 🔌 SẠC ================== */
      "Pin Gắn Trong, Cáp và Bộ Sạc": [
        { name: "Product Type", values: ["Cable", "Adapter", "Combo"], isVariant: false },
        { name: "Port", values: ["USB-A", "USB-C", "Lightning"], isVariant: false },
        { name: "Power (W)", values: ["10", "18", "30", "65"], isVariant: false }
      ],
  
      /* ================== 🎒 BALO ================== */
      "Ba Lô Nam": [
        { name: "Material", values: ["Canvas", "Polyester", "Leather"], isVariant: false },
        { name: "Capacity (L)", values: ["15", "20", "30"], isVariant: true },
        { name: "Color", values: ["Black", "Gray", "Blue"], isVariant: true },
        { name: "Style", values: ["Casual", "Travel"], isVariant: false }
      ],
  
      /* ================== 👕 QUẦN ÁO ================== */
      "Áo": [
        { name: "Size", values: ["S", "M", "L", "XL"], isVariant: true },
        { name: "Color", values: ["Black", "White", "Blue"], isVariant: true },
        { name: "Material", values: ["Cotton", "Poly"], isVariant: false }
      ],
  
      /* ================== 👟 GIÀY ================== */
      "Giày Thể Thao/ Sneakers": [
        { name: "Size", values: ["38", "39", "40", "41", "42"], isVariant: true },
        { name: "Brand", values: ["Nike", "Adidas"], isVariant: false },
        { name: "Color", values: ["Black", "White"], isVariant: true }
      ],
  
      /* ================== 🍔 ĐỒ ĂN ================== */
      "Đồ ăn vặt": [
        { name: "Flavor", values: ["Sweet", "Spicy", "Salty"], isVariant: false },
        { name: "Weight (g)", values: ["100", "200", "500"], isVariant: true },
        { name: "Origin", values: ["VN", "KR", "JP"], isVariant: false }
      ],
  
      /* ================== 🐶 PET ================== */
      "Thức ăn cho thú cưng": [
        { name: "Pet Type", values: ["Dog", "Cat"], isVariant: false },
        { name: "Weight (kg)", values: ["1", "5"], isVariant: true },
        { name: "Age", values: ["Puppy", "Adult"], isVariant: false }
      ],
  
      /* ================== 💡 ĐÈN ================== */
      "Đèn": [
        { name: "Light Type", values: ["LED", "Decor"], isVariant: false },
        { name: "Power (W)", values: ["5", "10"], isVariant: false }
      ],
  
      /* ================== 📚 SÁCH ================== */
      "Sách Tiếng Việt": [
        { name: "Genre", values: ["Novel", "Business"], isVariant: false },
        { name: "Language", values: ["Vietnamese"], isVariant: false }
      ],
  
    };
  
    return map[name] || [];
  }
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/đ/g, "d") // 🔥 FIX QUAN TRỌNG
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "") // 🔥 không dùng \w
    .trim()
    .replace(/\s+/g, "-")
}

/* ================== EXTRACT ALL PROPERTIES ================== */
function normalizeName(str) {
        return str
          .toLowerCase()
          .replace(/đ/g, "d") // 🔥 bắt buộc
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
          .replace(/[^a-z0-9\s]/g, "") // bỏ ký tự đặc biệt
          .replace(/\s+/g, " ") // chuẩn hóa khoảng trắng
          .trim()
  }
function extractAllProperties(categories) {
  const map = {};

  function traverse(node) {
    const props = getPropertiesByCategory(node.name);

    props.forEach(p => {
      if (!map[p.name]) {
        map[p.name] = {
          name: p.name,
          values: new Set(),
        };
      }

      p.values.forEach(v => map[p.name].values.add(v));
    });

    if (node.children) {
      node.children.forEach(traverse);
    }
  }

  categories.forEach(traverse);

  return Object.values(map).map(p => ({
    name: p.name,
    values: Array.from(p.values),
  }));
}

/* ================== INSERT CATEGORY ================== */

async function insertCategory(
  db,
  node,
  propMap,
  parent = null,
  level = 0,
  parentPath = ""
) {
  const slug = slugify(node.name);
  const path = parentPath ? `${parentPath}/${slug}` : slug;

  const propDefs = getPropertiesByCategory(node.name);

  const propIds = propDefs
    .map(p => propMap[p.name])
    .filter(Boolean);

  const res = await db.collection("categories").insertOne({
    name: node.name,
    name_normalized: normalizeName(node.name),

    slug,
    parent,
    level,
    path,

    isActive: true,
    properties: propIds,

    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const currentId = res.insertedId;

  if (node.children) {
    for (const child of node.children) {
      await insertCategory(
        db,
        child,
        propMap,
        currentId,
        level + 1,
        path
      );
    }
  }
}

/* ================== MAIN ================== */

async function seed() {
  const client = await clientPromise;
  const db = client.db("ecommerce");

  console.log("🧹 Clear...");
  await db.collection("categories").deleteMany({});
  await db.collection("properties").deleteMany({});
  await db.collection("propertyvalues").deleteMany({});

  /* ================== PROPERTIES ================== */

  console.log("🌱 Extract properties...");
  const allProps = extractAllProperties(categories);

  const propDocs = allProps.map(p => ({
    name: p.name,
    isVariant: detectVariant(p.name), // auto detect
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  const result = await db.collection("properties").insertMany(propDocs);

  const propMap = {};
  propDocs.forEach((p, i) => {
    propMap[p.name] = result.insertedIds[i];
  });

  /* ================== PROPERTY VALUES ================== */

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

  console.log("🌱 Insert values...");
  await db.collection("propertyvalues").insertMany(valueDocs);

  /* ================== CATEGORY ================== */

  console.log("🌱 Insert categories...");
  for (const cat of categories) {
    await insertCategory(db, cat, propMap);
  }
  await db.collection("categories").createIndex({
    name_normalized: "text"
  });
  console.log("🚀 DONE BASE SEED");
  process.exit();
}

/* ================== VARIANT DETECT ================== */

function detectVariant(name) {
  const keys = [
    "color",
    "size",
    "ram",
    "storage",
    "capacity",
  ];

  return keys.some(k =>
    name.toLowerCase().includes(k)
  );
}

seed();