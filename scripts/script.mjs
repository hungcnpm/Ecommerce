import clientPromise from "../lib/mongodb.mjs";

// 🔥 ===== RAW DATA (giữ nguyên của bạn) =====
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
  ]

// 🔥 ===== PROPERTY MAP =====

  function getPropertiesByCategory(name) {
    const map = {
  
      // 📱 ĐIỆN THOẠI
      "Điện thoại": [
        { name: "Brand", values: ["Apple", "Samsung", "Xiaomi", "Oppo"] },
        { name: "RAM", values: ["4GB", "6GB", "8GB", "12GB", "16GB"] },
        { name: "Storage", values: ["64GB", "128GB", "256GB", "512GB"] },
        { name: "Color", values: ["Black", "White", "Blue", "Purple", "Gold"] },
        { name: "Screen Size", values: ["5.5", "6.1", "6.7"] },
        { name: "Battery", values: ["3000mAh", "4000mAh", "5000mAh"] },
        { name: "Camera", values: ["12MP", "48MP", "108MP"] },
        { name: "Chip", values: ["A15", "A16", "Snapdragon 8"] },
        { name: "SIM", values: ["1 SIM", "2 SIM", "eSIM"] },
        { name: "OS", values: ["iOS", "Android"] },
        { name: "Condition", values: ["New", "Like New"] }
      ],
  
      // 📱 TABLET
      "Laptop": [
        { name: "Brand", values: ["Apple", "Samsung", "Xiaomi"] },
        { name: "Screen Size", values: ["8", "10", "11", "12.9"] },
        { name: "Storage", values: ["64GB", "128GB", "256GB"] },
        { name: "RAM", values: ["4GB", "6GB", "8GB"] },
        { name: "Battery", values: ["5000mAh", "7000mAh", "10000mAh"] }
      ],
  
      // 🔋 PIN DỰ PHÒNG
      "Pin Dự Phòng": [
        { name: "Capacity", values: ["5000mAh", "10000mAh", "20000mAh"] },
        { name: "Output", values: ["10W", "18W", "30W"] },
        { name: "Brand", values: ["Anker", "Xiaomi", "Baseus"] }
      ],
  
      // 🔌 SẠC + CÁP
      "Pin Gắn Trong, Cáp và Bộ Sạc": [
        { name: "Type", values: ["Cáp", "Củ sạc", "Combo"] },
        { name: "Port", values: ["USB-A", "USB-C", "Lightning"] },
        { name: "Power", values: ["10W", "18W", "30W", "65W"] }
      ],
  
      // 📱 ỐP / BAO DA
      "Ốp lưng, bao da, Miếng dán điện thoại": [
        { name: "Compatible", values: ["iPhone", "Samsung", "Xiaomi"] },
        { name: "Material", values: ["Silicone", "Nhựa", "Da"] },
        { name: "Color", values: ["Black", "Transparent", "Blue"] }
      ],
  
      // 🛡️ DÁN MÀN
      "Bảo vệ màn hình": [
        { name: "Type", values: ["Cường lực", "Nhám", "Chống nhìn trộm"] },
        { name: "Compatible", values: ["iPhone", "Samsung"] }
      ],
  
      // 📱 ĐẾ GIỮ
      "Đế giữ điện thoại": [
        { name: "Type", values: ["Ô tô", "Bàn", "Kẹp"] },
        { name: "Material", values: ["Nhựa", "Kim loại"] }
      ],
  
      // 💾 THẺ NHỚ
      "Thẻ nhớ": [
        { name: "Capacity", values: ["32GB", "64GB", "128GB", "256GB"] },
        { name: "Type", values: ["microSD", "SD"] }
      ],
  
      // 📶 SIM
      "Sim": [
        { name: "Type", values: ["4G", "5G"] },
        { name: "Provider", values: ["Viettel", "Mobifone", "Vinaphone"] }
      ],
  
      // 💻 LAPTOP
      "Laptop": [
        { name: "Brand", values: ["Dell", "HP", "Asus", "Apple"] },
        { name: "CPU", values: ["i5", "i7", "i9", "Ryzen 5", "Ryzen 7"] },
        { name: "RAM", values: ["8GB", "16GB", "32GB"] },
        { name: "Storage", values: ["256GB", "512GB", "1TB"] },
        { name: "GPU", values: ["Integrated", "RTX 3050", "RTX 4060"] },
        { name: "Screen Size", values: ["13", "14", "15.6", "17"] }
      ],
  
      // 👕 THỜI TRANG NAM
      "Áo": [
        { name: "Size", values: ["S", "M", "L", "XL"] },
        { name: "Color", values: ["Black", "White", "Blue"] },
        { name: "Material", values: ["Cotton", "Poly"] }
      ],
  
      // 👟 GIÀY NAM
      "Giày Thể Thao/ Sneakers": [
        { name: "Size", values: ["38", "39", "40", "41", "42"] },
        { name: "Brand", values: ["Nike", "Adidas"] },
        { name: "Color", values: ["Black", "White"] }
      ],
  
      // 🕒 ĐỒNG HỒ
      "Đồng Hồ Nam": [
        { name: "Brand", values: ["Casio", "Seiko"] },
        { name: "Strap", values: ["Leather", "Steel"] },
        { name: "Movement", values: ["Quartz", "Automatic"] }
      ],
      "Ba Lô Nam": [
        { name: "Material", values: ["Canvas", "Polyester", "Leather"] },
        { name: "Capacity", values: ["15L", "20L", "30L"] },
        { name: "Color", values: ["Black", "Gray", "Blue"] },
        { name: "Style", values: ["Casual", "Travel"] }
      ],

      "Túi Đeo Chéo Nam": [
        { name: "Material", values: ["Leather", "Canvas"] },
        { name: "Color", values: ["Black", "Brown"] },
        { name: "Size", values: ["Small", "Medium"] }
      ],

      "Bóp/Ví Nam": [
        { name: "Material", values: ["Leather", "PU"] },
        { name: "Color", values: ["Black", "Brown"] },
        { name: "Type", values: ["Bifold", "Trifold"] }
      ],
      "Đồ ăn vặt": [
        { name: "Flavor", values: ["Sweet", "Spicy", "Salty"] },
        { name: "Weight", values: ["100g", "200g", "500g"] },
        { name: "Origin", values: ["VN", "KR", "JP"] }
      ],

      "Đồ uống": [
        { name: "Type", values: ["Nước ngọt", "Trà", "Cà phê"] },
        { name: "Volume", values: ["330ml", "500ml", "1L"] },
        { name: "Sugar", values: ["Có đường", "Không đường"] }
      ],
      "Thức ăn cho thú cưng": [
        { name: "Pet Type", values: ["Dog", "Cat"] },
        { name: "Weight", values: ["1kg", "5kg"] },
        { name: "Age", values: ["Puppy", "Adult"] }
      ],

      "Phụ kiện cho thú cưng": [
        { name: "Type", values: ["Collar", "Leash", "Toy"] },
        { name: "Material", values: ["Nylon", "Leather"] }
      ],
      "Dụng cụ cầm tay": [
        { name: "Type", values: ["Hammer", "Screwdriver"] },
        { name: "Material", values: ["Steel"] }
      ],

      "Thiết bị mạch điện": [
        { name: "Voltage", values: ["220V", "110V"] },
        { name: "Type", values: ["Switch", "Socket"] }
      ],
      "Đồ chơi giải trí": [
        { name: "Age", values: ["3+", "6+", "12+"] },
        { name: "Material", values: ["Plastic", "Wood"] }
      ],
      "Đồng Hồ Nữ": [
        { name: "Brand", values: ["Casio", "Daniel Wellington"] },
        { name: "Color", values: ["Gold", "Rose Gold"] },
        { name: "Strap", values: ["Leather", "Steel"] }
      ],
      "Vệ sinh nhà cửa": [
        { name: "Type", values: ["Nước lau", "Bột"] },
        { name: "Volume", values: ["500ml", "1L"] }
      ],
      "Linh Kiện Máy Tính": [
        { name: "Type", values: ["CPU", "GPU", "RAM"] },
        { name: "Brand", values: ["Intel", "AMD", "Nvidia"] }
      ],

      "Màn Hình": [
        { name: "Size", values: ["24", "27", "32"] },
        { name: "Resolution", values: ["FHD", "2K", "4K"] },
        { name: "Refresh Rate", values: ["60Hz", "144Hz"] }
      ],
      "Ống kính": [
        { name: "Mount", values: ["Canon", "Sony"] },
        { name: "Focal Length", values: ["24mm", "50mm"] }
      ],
      "Tã & bô em bé": [
        { name: "Size", values: ["S", "M", "L", "XL"] },
        { name: "Type", values: ["Dán", "Quần"] }
      ],
      "Đèn": [
        { name: "Type", values: ["LED", "Decor"] },
        { name: "Power", values: ["5W", "10W"] }
      ],
      "Sách Tiếng Việt": [
        { name: "Genre", values: ["Novel", "Business"] },
        { name: "Language", values: ["Vietnamese"] }
      ],
      "Mũ bảo hiểm": [
        { name: "Size", values: ["M", "L", "XL"] },
        { name: "Type", values: ["Fullface", "3/4"] }
      ],
      "Chăm sóc da mặt": [
        { name: "Skin Type", values: ["Oily", "Dry"] },
        { name: "Type", values: ["Cleanser", "Serum"] }
      ],
      "Giày Thể Thao": [
        { name: "Size", values: ["39", "40", "41"] },
        { name: "Brand", values: ["Nike", "Adidas"] }
      ],
      "Du lịch & Khách sạn": [
        { name: "Location", values: ["Đà Nẵng", "Phú Quốc"] },
        { name: "Duration", values: ["2N1Đ", "3N2Đ"] }
      ]
              
    };
  
    return map[name] || [];
  }
// 🔥 slug
import clientPromise from "../lib/mongodb.mjs";

// ================== UTILS ==================

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

// ================== PROPERTY MAP ==================

function getPropertiesByCategory(name) {
  const map = {
    "Điện thoại": [
      { name: "Brand", values: ["Apple", "Samsung"], isVariant: false },
      { name: "RAM", values: ["4GB", "8GB", "12GB"], isVariant: true },
      { name: "Storage", values: ["128GB", "256GB"], isVariant: true },
      { name: "Color", values: ["Black", "White", "Blue"], isVariant: true }
    ],

    "Laptop": [
      { name: "Brand", values: ["Dell", "HP", "Apple"], isVariant: false },
      { name: "RAM", values: ["8GB", "16GB"], isVariant: true },
      { name: "Storage", values: ["256GB", "512GB"], isVariant: true }
    ],

    "Áo": [
      { name: "Size", values: ["S", "M", "L"], isVariant: true },
      { name: "Color", values: ["Black", "White"], isVariant: true },
      { name: "Material", values: ["Cotton"], isVariant: false }
    ]
  };

  return map[name] || [];
}

// ================== EXTRACT PROPERTIES ==================

function extractAllProperties() {
  const all = {};

  const categoriesToScan = [
    "Điện thoại",
    "Laptop",
    "Áo"
  ];

  for (const cat of categoriesToScan) {
    const props = getPropertiesByCategory(cat);

    for (const p of props) {
      if (!all[p.name]) {
        all[p.name] = {
          name: p.name,
          values: new Set(),
          isVariant: p.isVariant ?? true
        };
      }

      p.values?.forEach(v => all[p.name].values.add(v));
    }
  }

  return Object.values(all).map(p => ({
    name: p.name,
    values: Array.from(p.values),
    isVariant: p.isVariant
  }));
}

// ================== INSERT CATEGORY ==================

async function insertCategory(
  db,
  category,
  propMap,
  parent = null,
  parentPath = "",
  level = 0
) {
  const slug = slugify(category.name);
  const path = parentPath ? `${parentPath}/${slug}` : slug;

  const propDefs = getPropertiesByCategory(category.name);

  const propIds = propDefs
    .map(p => propMap[p.name])
    .filter(Boolean);

  const res = await db.collection("categories").insertOne({
    name: category.name,
    slug,
    parent,
    level,
    path,
    isActive: true,
    properties: propIds,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const currentId = res.insertedId;

  if (category.children) {
    for (const child of category.children) {
      await insertCategory(db, child, propMap, currentId, path, level + 1);
    }
  }
}

// ================== GENERATE VARIANTS ==================

function cartesianProduct(arr) {
  return arr.reduce(
    (a, b) => a.flatMap(d => b.map(e => [...d, e])),
    [[]]
  );
}

// ================== SEED PRODUCTS ==================

async function seedProducts(db) {
  console.log("📦 Seeding products...");

  const category = await db.collection("categories").findOne({
    name: "Điện thoại"
  });

  const properties = await db.collection("properties").find({
    name: { $in: ["RAM", "Storage", "Color"] }
  }).toArray();

  const propMap = {};
  properties.forEach(p => {
    propMap[p.name] = p._id;
  });

  const values = await db.collection("propertyvalues").find({
    property: { $in: Object.values(propMap) }
  }).toArray();

  const grouped = {};

  values.forEach(v => {
    const key = v.property.toString();
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(v);
  });

  const product = await db.collection("products").insertOne({
    title: "iPhone 15 Pro Max",
    basePrice: 1200,
    brand: "Apple",
    category: category._id,
    properties: Object.values(propMap),
    images: [],
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const combos = cartesianProduct(Object.values(grouped));

  const variants = combos.map((combo, i) => ({
    product: product.insertedId,
    sku: `IP15-${i}`,
    price: 1200 + i * 50,
    stock: 50,

    attributes: combo.map(v => ({
      property: v.property,
      value: v._id
    })),

    createdAt: new Date(),
    updatedAt: new Date()
  }));

  await db.collection("variants").insertMany(variants);

  console.log("🔥 Variants:", variants.length);
}

// ================== MAIN SEED ==================

async function seed() {
  const client = await clientPromise;
  const db = client.db("ecommerce");

  console.log("🧹 Clearing...");
  await db.collection("categories").deleteMany({});
  await db.collection("properties").deleteMany({});
  await db.collection("propertyvalues").deleteMany({});
  await db.collection("products").deleteMany({});
  await db.collection("variants").deleteMany({});

  console.log("🌱 Extracting properties...");
  const allProps = extractAllProperties();

  // 🔥 insert properties
  const propDocs = allProps.map(p => ({
    name: p.name,
    isVariant: p.isVariant,
    createdAt: new Date(),
    updatedAt: new Date()
  }));

  const result = await db.collection("properties").insertMany(propDocs);

  const propMap = {};
  propDocs.forEach((p, i) => {
    propMap[p.name] = result.insertedIds[i];
  });

  // 🔥 insert values
  const valueDocs = [];

  allProps.forEach(p => {
    const propId = propMap[p.name];

    p.values.forEach(val => {
      valueDocs.push({
        property: propId,
        value: val,
        slug: slugify(val),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
  });

  await db.collection("propertyvalues").insertMany(valueDocs);

  // 🔥 categories (GIỮ DATA CỦA BẠN)
  for (const category of categories) {
    await insertCategory(db, category, propMap);
  }

  // 🔥 products + variants
  await seedProducts(db);

  console.log("✅ DONE");
  process.exit();
}

seed();

