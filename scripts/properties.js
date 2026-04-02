
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