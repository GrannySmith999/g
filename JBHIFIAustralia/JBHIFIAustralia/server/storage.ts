import { type User, type InsertUser, type Category, type InsertCategory, type Product, type InsertProduct, type Order, type InsertOrder, type OrderItem, type InsertOrderItem } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getProductsOnSale(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Orders
  getOrder(id: string): Promise<Order | undefined>;
  getOrderByNumber(orderNumber: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderPaymentStatus(id: string, status: string, stripePaymentIntentId?: string): Promise<Order | undefined>;

  // Order Items
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private categories: Map<string, Category> = new Map();
  private products: Map<string, Product> = new Map();
  private orders: Map<string, Order> = new Map();
  private orderItems: Map<string, OrderItem> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed categories
    const categories = [
      { id: "1", name: "Mobile Phones", nameEs: "Teléfonos Móviles", slug: "mobile-phones", imageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200", createdAt: new Date() },
      { id: "2", name: "Computers", nameEs: "Computadoras", slug: "computers", imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200", createdAt: new Date() },
      { id: "3", name: "TVs", nameEs: "Televisores", slug: "tvs", imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200", createdAt: new Date() },
      { id: "4", name: "Audio", nameEs: "Audio", slug: "audio", imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200", createdAt: new Date() },
      { id: "5", name: "Home Appliances", nameEs: "Electrodomésticos", slug: "home-appliances", imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200", createdAt: new Date() },
      { id: "6", name: "Gaming", nameEs: "Videojuegos", slug: "gaming", imageUrl: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200", createdAt: new Date() },
    ];

    categories.forEach(cat => this.categories.set(cat.id, cat));

    // Seed JB Hi-Fi products catalog (100+ products)
    const products = [
      // Mobile Phones (Category 1)
      {
        id: "1",
        name: "Google Pixel 10 Pro XL 5G 256GB (Moonstone)",
        nameEs: "Google Pixel 10 Pro XL 5G 256GB (Moonstone)",
        description: "Latest Google flagship with advanced AI photography and Tensor G5 chip",
        descriptionEs: "Último buque insignia de Google con fotografía AI avanzada y chip Tensor G5",
        price: "1399.00",
        originalPrice: "1599.00",
        categoryId: "1",
        brand: "Google",
        imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: true,
        discount: 200,
        createdAt: new Date()
      },
      {
        id: "2",
        name: "Samsung Galaxy S25 Ultra 256GB (Titanium Blue)",
        nameEs: "Samsung Galaxy S25 Ultra 256GB (Titanio Azul)",
        description: "Premium Samsung flagship with S Pen and 200MP camera",
        descriptionEs: "Buque insignia premium de Samsung con S Pen y cámara de 200MP",
        price: "1587.00",
        originalPrice: "1899.00",
        categoryId: "1",
        brand: "Samsung",
        imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: true,
        discount: 312,
        createdAt: new Date()
      },
      {
        id: "3",
        name: "Apple iPhone 16 Pro Max 256GB (Desert Titanium)",
        nameEs: "Apple iPhone 16 Pro Max 256GB (Titanio Desierto)",
        description: "Latest iPhone with A18 Pro chip and enhanced camera system",
        descriptionEs: "Último iPhone con chip A18 Pro y sistema de cámara mejorado",
        price: "1899.00",
        originalPrice: null,
        categoryId: "1",
        brand: "Apple",
        imageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: true,
        discount: 0,
        createdAt: new Date()
      },
      {
        id: "4",
        name: "Samsung Galaxy Z Fold7 256GB (Phantom Black)",
        nameEs: "Samsung Galaxy Z Fold7 256GB (Negro Fantasma)",
        description: "Foldable smartphone with dual screens and multitasking capabilities",
        descriptionEs: "Smartphone plegable con pantallas duales y capacidades multitarea",
        price: "2499.00",
        originalPrice: "2799.00",
        categoryId: "1",
        brand: "Samsung",
        imageUrl: "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: true,
        discount: 300,
        createdAt: new Date()
      },
      {
        id: "5",
        name: "Apple iPhone 16e 128GB (Black)",
        nameEs: "Apple iPhone 16e 128GB (Negro)",
        description: "Affordable iPhone with A18 chip and Super Retina XDR display",
        descriptionEs: "iPhone asequible con chip A18 y pantalla Super Retina XDR",
        price: "799.00",
        originalPrice: "899.00",
        categoryId: "1",
        brand: "Apple",
        imageUrl: "https://images.unsplash.com/photo-1564466809058-bf4114613385?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 100,
        createdAt: new Date()
      },
      {
        id: "6",
        name: "Google Pixel 9a 5G 128GB (Porcelain)",
        nameEs: "Google Pixel 9a 5G 128GB (Porcelana)",
        description: "Mid-range Pixel with AI photography and clean Android experience",
        descriptionEs: "Pixel de gama media con fotografía AI y experiencia Android limpia",
        price: "649.00",
        originalPrice: "749.00",
        categoryId: "1",
        brand: "Google",
        imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 100,
        createdAt: new Date()
      },
      {
        id: "7",
        name: "Samsung Galaxy A56 5G 128GB (Blue Black)",
        nameEs: "Samsung Galaxy A56 5G 128GB (Azul Negro)",
        description: "Affordable 5G smartphone with AMOLED display and long battery life",
        descriptionEs: "Smartphone 5G asequible con pantalla AMOLED y larga duración de batería",
        price: "499.00",
        originalPrice: "599.00",
        categoryId: "1",
        brand: "Samsung",
        imageUrl: "https://images.unsplash.com/photo-1567581935884-3349723552ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 100,
        createdAt: new Date()
      },
      {
        id: "8",
        name: "OPPO Reno13 Pro 256GB (Starlight Pink)",
        nameEs: "OPPO Reno13 Pro 256GB (Rosa Luz de Estrella)",
        description: "Stylish smartphone with portrait photography and fast charging",
        descriptionEs: "Smartphone elegante con fotografía de retratos y carga rápida",
        price: "899.00",
        originalPrice: "1099.00",
        categoryId: "1",
        brand: "OPPO",
        imageUrl: "https://images.unsplash.com/photo-1580910051074-3eb694886505?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 200,
        createdAt: new Date()
      },
      {
        id: "9",
        name: "Motorola Razr 50 Ultra (Midnight Blue)",
        nameEs: "Motorola Razr 50 Ultra (Azul Medianoche)",
        description: "Compact foldable phone with retro design and modern features",
        descriptionEs: "Teléfono plegable compacto con diseño retro y características modernas",
        price: "1699.00",
        originalPrice: "1899.00",
        categoryId: "1",
        brand: "Motorola",
        imageUrl: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 200,
        createdAt: new Date()
      },
      {
        id: "10",
        name: "ASUS ROG Phone 9 Pro (Phantom Black)",
        nameEs: "ASUS ROG Phone 9 Pro (Negro Fantasma)",
        description: "Ultimate gaming phone with 165Hz display and cooling system",
        descriptionEs: "Teléfono gaming definitivo con pantalla 165Hz y sistema de refrigeración",
        price: "1499.00",
        originalPrice: "1699.00",
        categoryId: "1",
        brand: "ASUS",
        imageUrl: "https://images.unsplash.com/photo-1583225214464-9296029427aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 200,
        createdAt: new Date()
      },

      // Computers (Category 2)
      {
        id: "11",
        name: "Apple MacBook Pro 14\" M4 Chip 512GB (Space Black)",
        nameEs: "Apple MacBook Pro 14\" Chip M4 512GB (Negro Espacial)",
        description: "Professional laptop with M4 chip for ultimate performance",
        descriptionEs: "Portátil profesional con chip M4 para máximo rendimiento",
        price: "2399.00",
        originalPrice: null,
        categoryId: "2",
        brand: "Apple",
        imageUrl: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: true,
        discount: 0,
        createdAt: new Date()
      },
      {
        id: "12",
        name: "Microsoft Surface Pro 11th Edition Copilot+ PC 13\" (Black)",
        nameEs: "Microsoft Surface Pro 11ma Edición Copilot+ PC 13\" (Negro)",
        description: "2-in-1 laptop with Snapdragon X Elite and AI capabilities",
        descriptionEs: "Portátil 2-en-1 con Snapdragon X Elite y capacidades AI",
        price: "1749.00",
        originalPrice: "2199.00",
        categoryId: "2",
        brand: "Microsoft",
        imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: true,
        discount: 450,
        createdAt: new Date()
      },
      {
        id: "13",
        name: "MSI Katana 15 HX 15.6\" QHD 165Hz Gaming Laptop (GeForce RTX 5050)",
        nameEs: "MSI Katana 15 HX 15.6\" QHD 165Hz Portátil Gaming (GeForce RTX 5050)",
        description: "High-performance gaming laptop with RTX graphics",
        descriptionEs: "Portátil gaming de alto rendimiento con gráficos RTX",
        price: "2399.00",
        originalPrice: "2699.00",
        categoryId: "2",
        brand: "MSI",
        imageUrl: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: true,
        discount: 300,
        createdAt: new Date()
      },
      {
        id: "14",
        name: "ASUS Vivobook S16 16\" OLED Laptop (Snapdragon X Elite)",
        nameEs: "ASUS Vivobook S16 16\" OLED Portátil (Snapdragon X Elite)",
        description: "Premium ultrabook with OLED display and all-day battery",
        descriptionEs: "Ultrabook premium con pantalla OLED y batería para todo el día",
        price: "1699.00",
        originalPrice: "1999.00",
        categoryId: "2",
        brand: "ASUS",
        imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 300,
        createdAt: new Date()
      },
      {
        id: "15",
        name: "Lenovo Yoga S7 14\" 2.8K OLED Laptop (Intel Core Ultra 5)",
        nameEs: "Lenovo Yoga S7 14\" 2.8K OLED Portátil (Intel Core Ultra 5)",
        description: "Creative laptop with stunning OLED display and AI features",
        descriptionEs: "Portátil creativo con impresionante pantalla OLED y características AI",
        price: "1499.00",
        originalPrice: "1799.00",
        categoryId: "2",
        brand: "Lenovo",
        imageUrl: "https://images.unsplash.com/photo-1606248897732-2c5ffe759c04?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 300,
        createdAt: new Date()
      },
      {
        id: "16",
        name: "Apple iPad Pro 11\" 256GB Wi-Fi (Space Black M4)",
        nameEs: "Apple iPad Pro 11\" 256GB Wi-Fi (Negro Espacial M4)",
        description: "Pro tablet with M4 chip for professional creative work",
        descriptionEs: "Tablet Pro con chip M4 para trabajo creativo profesional",
        price: "1399.00",
        originalPrice: null,
        categoryId: "2",
        brand: "Apple",
        imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 0,
        createdAt: new Date()
      },
      {
        id: "17",
        name: "HP 14s 14\" HD Laptop (Intel Celeron 128GB)",
        nameEs: "HP 14s 14\" HD Portátil (Intel Celeron 128GB)",
        description: "Budget-friendly laptop for everyday computing needs",
        descriptionEs: "Portátil económico para necesidades informáticas diarias",
        price: "449.00",
        originalPrice: "549.00",
        categoryId: "2",
        brand: "HP",
        imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 100,
        createdAt: new Date()
      },
      {
        id: "18",
        name: "Samsung Galaxy Tab S11 12.4\" Wi-Fi 256GB (Graphite)",
        nameEs: "Samsung Galaxy Tab S11 12.4\" Wi-Fi 256GB (Grafito)",
        description: "Premium Android tablet with S Pen for productivity",
        descriptionEs: "Tablet Android premium con S Pen para productividad",
        price: "1099.00",
        originalPrice: "1299.00",
        categoryId: "2",
        brand: "Samsung",
        imageUrl: "https://images.unsplash.com/photo-1561154464-82e9adf32764?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 200,
        createdAt: new Date()
      },
      {
        id: "19",
        name: "Dell Alienware x16 R2 16\" Gaming Laptop (RTX 5070)",
        nameEs: "Dell Alienware x16 R2 16\" Portátil Gaming (RTX 5070)",
        description: "Ultra-thin gaming laptop with premium performance",
        descriptionEs: "Portátil gaming ultra-delgado con rendimiento premium",
        price: "3999.00",
        originalPrice: "4499.00",
        categoryId: "2",
        brand: "Dell",
        imageUrl: "https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 500,
        createdAt: new Date()
      },
      {
        id: "20",
        name: "Lenovo Chrome 14M9610 14\" WUXGA OLED Touchscreen Chromebook",
        nameEs: "Lenovo Chrome 14M9610 14\" WUXGA OLED Touchscreen Chromebook",
        description: "Affordable Chromebook with OLED display for students",
        descriptionEs: "Chromebook asequible con pantalla OLED para estudiantes",
        price: "699.00",
        originalPrice: "899.00",
        categoryId: "2",
        brand: "Lenovo",
        imageUrl: "https://images.unsplash.com/photo-1484807352052-23338990c6c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 200,
        createdAt: new Date()
      },

      // TVs (Category 3)
      {
        id: "21",
        name: "Samsung 85\" QN900D Neo QLED 8K Smart TV",
        nameEs: "Samsung 85\" QN900D Neo QLED 8K Smart TV",
        description: "Premium 8K TV with Quantum Matrix Technology and AI upscaling",
        descriptionEs: "TV 8K premium con tecnología Quantum Matrix y upscaling AI",
        price: "7999.00",
        originalPrice: "9999.00",
        categoryId: "3",
        brand: "Samsung",
        imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: true,
        discount: 2000,
        createdAt: new Date()
      },
      {
        id: "22",
        name: "LG 77\" G4 OLED evo 4K Smart TV",
        nameEs: "LG 77\" G4 OLED evo 4K Smart TV",
        description: "Gallery Design OLED TV with perfect blacks and Dolby Vision",
        descriptionEs: "TV OLED con diseño Gallery con negros perfectos y Dolby Vision",
        price: "4999.00",
        originalPrice: "5999.00",
        categoryId: "3",
        brand: "LG",
        imageUrl: "https://images.unsplash.com/photo-1461151304267-38535e780c79?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: true,
        discount: 1000,
        createdAt: new Date()
      },
      {
        id: "23",
        name: "Sony 65\" X95L BRAVIA XR Mini LED 4K TV",
        nameEs: "Sony 65\" X95L BRAVIA XR Mini LED 4K TV",
        description: "Premium TV with Cognitive Processor XR and XR Triluminos Pro",
        descriptionEs: "TV premium con procesador cognitivo XR y XR Triluminos Pro",
        price: "3499.00",
        originalPrice: "3999.00",
        categoryId: "3",
        brand: "Sony",
        imageUrl: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: true,
        discount: 500,
        createdAt: new Date()
      },
      {
        id: "24",
        name: "TCL 75\" C855K QD-Mini LED 4K Google TV",
        nameEs: "TCL 75\" C855K QD-Mini LED 4K Google TV",
        description: "Large screen TV with Quantum Dot technology and Google TV",
        descriptionEs: "TV de pantalla grande con tecnología Quantum Dot y Google TV",
        price: "2199.00",
        originalPrice: "2799.00",
        categoryId: "3",
        brand: "TCL",
        imageUrl: "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 600,
        createdAt: new Date()
      },
      {
        id: "25",
        name: "Hisense 55\" U8N ULED 4K Mini-LED TV",
        nameEs: "Hisense 55\" U8N ULED 4K Mini-LED TV",
        description: "Mid-range TV with Mini-LED backlighting and Dolby Vision",
        descriptionEs: "TV de gama media con retroiluminación Mini-LED y Dolby Vision",
        price: "1199.00",
        originalPrice: "1499.00",
        categoryId: "3",
        brand: "Hisense",
        imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 300,
        createdAt: new Date()
      },
      {
        id: "26",
        name: "Samsung 43\" Q60D QLED 4K Smart TV",
        nameEs: "Samsung 43\" Q60D QLED 4K Smart TV",
        description: "Compact QLED TV perfect for bedrooms and small spaces",
        descriptionEs: "TV QLED compacto perfecto para dormitorios y espacios pequeños",
        price: "899.00",
        originalPrice: "1199.00",
        categoryId: "3",
        brand: "Samsung",
        imageUrl: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 300,
        createdAt: new Date()
      },

      // Audio (Category 4)
      {
        id: "27",
        name: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
        nameEs: "Sony WH-1000XM5 Auriculares Inalámbricos con Cancelación de Ruido",
        description: "Industry-leading noise canceling with 30-hour battery life",
        descriptionEs: "Cancelación de ruido líder en la industria con 30 horas de batería",
        price: "349.00",
        originalPrice: "449.00",
        categoryId: "4",
        brand: "Sony",
        imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: true,
        discount: 100,
        createdAt: new Date()
      },
      {
        id: "28",
        name: "Apple AirPods Pro (3rd Generation) USB-C",
        nameEs: "Apple AirPods Pro (3ra Generación) USB-C",
        description: "Premium earbuds with adaptive transparency and spatial audio",
        descriptionEs: "Auriculares premium con transparencia adaptiva y audio espacial",
        price: "399.00",
        originalPrice: null,
        categoryId: "4",
        brand: "Apple",
        imageUrl: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: true,
        discount: 0,
        createdAt: new Date()
      },
      {
        id: "29",
        name: "Bose QuietComfort Ultra Headphones",
        nameEs: "Bose QuietComfort Ultra Auriculares",
        description: "Premium noise canceling headphones with spatial audio",
        descriptionEs: "Auriculares premium con cancelación de ruido y audio espacial",
        price: "549.00",
        originalPrice: "649.00",
        categoryId: "4",
        brand: "Bose",
        imageUrl: "https://images.unsplash.com/photo-1545127398-14699f92334b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 100,
        createdAt: new Date()
      },
      {
        id: "30",
        name: "JBL Charge 5 Portable Bluetooth Speaker",
        nameEs: "JBL Charge 5 Altavoz Bluetooth Portátil",
        description: "Waterproof speaker with 20-hour playtime and powerbank function",
        descriptionEs: "Altavoz resistente al agua con 20 horas de reproducción y función powerbank",
        price: "199.00",
        originalPrice: "249.00",
        categoryId: "4",
        brand: "JBL",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 50,
        createdAt: new Date()
      },
      {
        id: "31",
        name: "Sonos Arc Ultra Soundbar",
        nameEs: "Sonos Arc Ultra Barra de Sonido",
        description: "Premium soundbar with Dolby Atmos and voice control",
        descriptionEs: "Barra de sonido premium con Dolby Atmos y control por voz",
        price: "1499.00",
        originalPrice: "1699.00",
        categoryId: "4",
        brand: "Sonos",
        imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 200,
        createdAt: new Date()
      },

      // Home Appliances (Category 5)
      {
        id: "32",
        name: "Dyson V15 Detect Absolute Vacuum Cleaner",
        nameEs: "Dyson V15 Detect Absolute Aspiradora",
        description: "Advanced cordless vacuum with laser dust detection technology",
        descriptionEs: "Aspiradora inalámbrica avanzada con tecnología de detección láser de polvo",
        price: "799.00",
        originalPrice: "999.00",
        categoryId: "5",
        brand: "Dyson",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: true,
        discount: 200,
        createdAt: new Date()
      },
      {
        id: "33",
        name: "Breville Barista Express Impress Espresso Machine",
        nameEs: "Breville Barista Express Impress Máquina de Espresso",
        description: "Semi-automatic espresso machine with built-in grinder",
        descriptionEs: "Máquina de espresso semiautomática con molinillo integrado",
        price: "899.00",
        originalPrice: "1099.00",
        categoryId: "5",
        brand: "Breville",
        imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 200,
        createdAt: new Date()
      },
      {
        id: "34",
        name: "Ninja Foodi MAX 15-in-1 SmartLid Multi-Cooker",
        nameEs: "Ninja Foodi MAX 15-en-1 SmartLid Multi-Cooker",
        description: "Versatile cooking appliance with pressure cook, air fry, and more",
        descriptionEs: "Electrodoméstico de cocina versátil con cocción a presión, fritura de aire y más",
        price: "399.00",
        originalPrice: "499.00",
        categoryId: "5",
        brand: "Ninja",
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 100,
        createdAt: new Date()
      },
      {
        id: "35",
        name: "KitchenAid Artisan Stand Mixer 4.8L (Empire Red)",
        nameEs: "KitchenAid Artisan Batidora de Pie 4.8L (Rojo Imperio)",
        description: "Iconic stand mixer for baking and food preparation",
        descriptionEs: "Batidora de pie icónica para hornear y preparar alimentos",
        price: "649.00",
        originalPrice: "799.00",
        categoryId: "5",
        brand: "KitchenAid",
        imageUrl: "https://images.unsplash.com/photo-1574781330855-d0db0cc5e66d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 150,
        createdAt: new Date()
      },

      // Gaming (Category 6)
      {
        id: "36",
        name: "PlayStation 5 Pro Console",
        nameEs: "Consola PlayStation 5 Pro",
        description: "Enhanced PlayStation 5 with improved GPU and 8K gaming",
        descriptionEs: "PlayStation 5 mejorado con GPU mejorada y gaming 8K",
        price: "1199.00",
        originalPrice: null,
        categoryId: "6",
        brand: "Sony",
        imageUrl: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: true,
        discount: 0,
        createdAt: new Date()
      },
      {
        id: "37",
        name: "Xbox Series X Console 1TB",
        nameEs: "Consola Xbox Series X 1TB",
        description: "Microsoft's most powerful gaming console with 4K gaming",
        descriptionEs: "La consola de juegos más potente de Microsoft con gaming 4K",
        price: "749.00",
        originalPrice: null,
        categoryId: "6",
        brand: "Microsoft",
        imageUrl: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: true,
        discount: 0,
        createdAt: new Date()
      },
      {
        id: "38",
        name: "Nintendo Switch OLED Model (White)",
        nameEs: "Nintendo Switch Modelo OLED (Blanco)",
        description: "Handheld gaming console with vibrant OLED screen",
        descriptionEs: "Consola de juegos portátil con pantalla OLED vibrante",
        price: "539.00",
        originalPrice: null,
        categoryId: "6",
        brand: "Nintendo",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 0,
        createdAt: new Date()
      },
      {
        id: "39",
        name: "Steam Deck OLED 512GB Handheld Gaming PC",
        nameEs: "Steam Deck OLED 512GB PC Gaming Portátil",
        description: "Portable PC gaming with access to Steam library",
        descriptionEs: "Gaming PC portátil con acceso a la biblioteca de Steam",
        price: "899.00",
        originalPrice: "999.00",
        categoryId: "6",
        brand: "Valve",
        imageUrl: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 100,
        createdAt: new Date()
      },

      // Additional Mobile Phones
      {
        id: "40",
        name: "Nothing Phone (3a) Pro 256GB (Black)",
        nameEs: "Nothing Phone (3a) Pro 256GB (Negro)",
        description: "Unique transparent design smartphone with Glyph interface",
        descriptionEs: "Smartphone de diseño transparente único con interfaz Glyph",
        price: "649.00",
        originalPrice: "749.00",
        categoryId: "1",
        brand: "Nothing",
        imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 100,
        createdAt: new Date()
      },
      {
        id: "41",
        name: "OnePlus 12 256GB (Flowy Emerald)",
        nameEs: "OnePlus 12 256GB (Esmeralda Fluida)",
        description: "Flagship phone with Hasselblad camera and 100W fast charging",
        descriptionEs: "Teléfono insignia con cámara Hasselblad y carga rápida de 100W",
        price: "1199.00",
        originalPrice: "1399.00",
        categoryId: "1",
        brand: "OnePlus",
        imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 200,
        createdAt: new Date()
      },
      {
        id: "42",
        name: "Xiaomi 14 Ultra 512GB (White)",
        nameEs: "Xiaomi 14 Ultra 512GB (Blanco)",
        description: "Photography-focused flagship with Leica co-engineered cameras",
        descriptionEs: "Buque insignia enfocado en fotografía con cámaras co-diseñadas con Leica",
        price: "1299.00",
        originalPrice: "1499.00",
        categoryId: "1",
        brand: "Xiaomi",
        imageUrl: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 200,
        createdAt: new Date()
      },
      {
        id: "43",
        name: "Huawei Pura 70 Pro 256GB (Gold)",
        nameEs: "Huawei Pura 70 Pro 256GB (Oro)",
        description: "Premium smartphone with advanced photography capabilities",
        descriptionEs: "Smartphone premium con capacidades avanzadas de fotografía",
        price: "1099.00",
        originalPrice: "1299.00",
        categoryId: "1",
        brand: "Huawei",
        imageUrl: "https://images.unsplash.com/photo-1567581935884-3349723552ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 200,
        createdAt: new Date()
      },

      // Additional Computers
      {
        id: "44",
        name: "Dell XPS 13 Plus 13.4\" OLED Laptop (Intel Core i7)",
        nameEs: "Dell XPS 13 Plus 13.4\" OLED Portátil (Intel Core i7)",
        description: "Ultra-premium ultrabook with stunning OLED display",
        descriptionEs: "Ultrabook ultra-premium con impresionante pantalla OLED",
        price: "2199.00",
        originalPrice: "2499.00",
        categoryId: "2",
        brand: "Dell",
        imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 300,
        createdAt: new Date()
      },
      {
        id: "45",
        name: "ASUS ProArt Display PA329CV 32\" 4K Monitor",
        nameEs: "ASUS ProArt Display PA329CV Monitor 32\" 4K",
        description: "Professional 4K monitor with 100% sRGB color accuracy",
        descriptionEs: "Monitor 4K profesional con 100% precisión de color sRGB",
        price: "799.00",
        originalPrice: "999.00",
        categoryId: "2",
        brand: "ASUS",
        imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 200,
        createdAt: new Date()
      },
      {
        id: "46",
        name: "Apple Studio Display 27\" 5K Retina",
        nameEs: "Apple Studio Display 27\" 5K Retina",
        description: "Professional display with P3 wide color and True Tone",
        descriptionEs: "Pantalla profesional con color amplio P3 y True Tone",
        price: "2199.00",
        originalPrice: null,
        categoryId: "2",
        brand: "Apple",
        imageUrl: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 0,
        createdAt: new Date()
      },

      // Additional TVs and Displays
      {
        id: "47",
        name: "Panasonic 65\" MZ2000 Master OLED Pro TV",
        nameEs: "Panasonic 65\" MZ2000 Master OLED Pro TV",
        description: "Professional OLED TV with Hollywood-grade color accuracy",
        descriptionEs: "TV OLED profesional con precisión de color de nivel Hollywood",
        price: "3999.00",
        originalPrice: "4599.00",
        categoryId: "3",
        brand: "Panasonic",
        imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 600,
        createdAt: new Date()
      },
      {
        id: "48",
        name: "Philips 48\" OLED808 Ambilight 4K TV",
        nameEs: "Philips 48\" OLED808 Ambilight 4K TV",
        description: "OLED TV with immersive Ambilight technology",
        descriptionEs: "TV OLED con tecnología Ambilight inmersiva",
        price: "1799.00",
        originalPrice: "2199.00",
        categoryId: "3",
        brand: "Philips",
        imageUrl: "https://images.unsplash.com/photo-1461151304267-38535e780c79?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 400,
        createdAt: new Date()
      },

      // Additional Audio Products
      {
        id: "49",
        name: "Sennheiser Momentum 4 Wireless Headphones",
        nameEs: "Sennheiser Momentum 4 Auriculares Inalámbricos",
        description: "Audiophile wireless headphones with 60-hour battery",
        descriptionEs: "Auriculares inalámbricos audiófilo con batería de 60 horas",
        price: "399.00",
        originalPrice: "499.00",
        categoryId: "4",
        brand: "Sennheiser",
        imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 100,
        createdAt: new Date()
      },
      {
        id: "50",
        name: "Marshall Acton III Bluetooth Speaker",
        nameEs: "Marshall Acton III Altavoz Bluetooth",
        description: "Iconic rock-inspired Bluetooth speaker with classic design",
        descriptionEs: "Altavoz Bluetooth icónico inspirado en rock con diseño clásico",
        price: "349.00",
        originalPrice: "399.00",
        categoryId: "4",
        brand: "Marshall",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 50,
        createdAt: new Date()
      },

      // Extended JB Hi-Fi Catalog (51-100+)
      // Additional Mobile Phones
      {
        id: "51",
        name: "TCL 50 Pro NXTPAPER 5G 256GB (Dark Gray)",
        nameEs: "TCL 50 Pro NXTPAPER 5G 256GB (Gris Oscuro)",
        description: "Unique paper-like display technology for eye comfort",
        descriptionEs: "Tecnología de pantalla única tipo papel para comodidad visual",
        price: "599.00",
        originalPrice: "699.00",
        categoryId: "1",
        brand: "TCL",
        imageUrl: "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 100,
        createdAt: new Date()
      },
      {
        id: "52",
        name: "Realme GT 7 Pro 256GB (Mars Orange)",
        nameEs: "Realme GT 7 Pro 256GB (Naranja Marte)",
        description: "Performance flagship with Snapdragon 8 Elite processor",
        descriptionEs: "Buque insignia de rendimiento con procesador Snapdragon 8 Elite",
        price: "899.00",
        originalPrice: "1099.00",
        categoryId: "1",
        brand: "Realme",
        imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 200,
        createdAt: new Date()
      },
      {
        id: "53",
        name: "Honor Magic7 Pro 512GB (Moonlight White)",
        nameEs: "Honor Magic7 Pro 512GB (Blanco Luz de Luna)",
        description: "AI-powered photography flagship with satellite communication",
        descriptionEs: "Buque insignia de fotografía AI con comunicación satelital",
        price: "1299.00",
        originalPrice: "1499.00",
        categoryId: "1",
        brand: "Honor",
        imageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 200,
        createdAt: new Date()
      },
      {
        id: "54",
        name: "Vivo X200 Pro 256GB (Aurora Green)",
        nameEs: "Vivo X200 Pro 256GB (Verde Aurora)",
        description: "Camera-centric flagship with ZEISS optics",
        descriptionEs: "Buque insignia centrado en cámara con ópticas ZEISS",
        price: "1199.00",
        originalPrice: "1399.00",
        categoryId: "1",
        brand: "Vivo",
        imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 200,
        createdAt: new Date()
      },
      {
        id: "55",
        name: "Nokia G310 5G 128GB (Blue)",
        nameEs: "Nokia G310 5G 128GB (Azul)",
        description: "Rugged affordable smartphone with 3 years of updates",
        descriptionEs: "Smartphone asequible resistente con 3 años de actualizaciones",
        price: "299.00",
        originalPrice: "399.00",
        categoryId: "1",
        brand: "Nokia",
        imageUrl: "https://images.unsplash.com/photo-1567581935884-3349723552ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 100,
        createdAt: new Date()
      },

      // Additional Computers & Tablets
      {
        id: "56",
        name: "Razer Blade 18 Gaming Laptop (RTX 5080)",
        nameEs: "Razer Blade 18 Portátil Gaming (RTX 5080)",
        description: "Ultimate gaming laptop with 18\" QHD+ display",
        descriptionEs: "Portátil gaming definitivo con pantalla QHD+ de 18\"",
        price: "5999.00",
        originalPrice: "6999.00",
        categoryId: "2",
        brand: "Razer",
        imageUrl: "https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 1000,
        createdAt: new Date()
      },
      {
        id: "57",
        name: "Framework Laptop 13 DIY Edition (Intel Core Ultra 7)",
        nameEs: "Framework Laptop 13 Edición DIY (Intel Core Ultra 7)",
        description: "Modular laptop you can upgrade and repair yourself",
        descriptionEs: "Portátil modular que puedes actualizar y reparar tú mismo",
        price: "1399.00",
        originalPrice: "1599.00",
        categoryId: "2",
        brand: "Framework",
        imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 200,
        createdAt: new Date()
      },
      {
        id: "58",
        name: "ASUS ROG Ally X Handheld Gaming PC",
        nameEs: "ASUS ROG Ally X PC Gaming Portátil",
        description: "Windows handheld gaming device with ROG performance",
        descriptionEs: "Dispositivo gaming portátil Windows con rendimiento ROG",
        price: "1199.00",
        originalPrice: "1399.00",
        categoryId: "2",
        brand: "ASUS",
        imageUrl: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 200,
        createdAt: new Date()
      },
      {
        id: "59",
        name: "Microsoft Surface Laptop Studio 2 (GeForce RTX 4060)",
        nameEs: "Microsoft Surface Laptop Studio 2 (GeForce RTX 4060)",
        description: "Creative powerhouse with unique tilting touchscreen",
        descriptionEs: "Potencia creativa con pantalla táctil inclinable única",
        price: "3499.00",
        originalPrice: "3999.00",
        categoryId: "2",
        brand: "Microsoft",
        imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 500,
        createdAt: new Date()
      },
      {
        id: "60",
        name: "LG Gram 17\" OLED Laptop (Intel Core Ultra 7)",
        nameEs: "LG Gram 17\" OLED Portátil (Intel Core Ultra 7)",
        description: "Ultra-lightweight 17\" laptop with OLED display",
        descriptionEs: "Portátil ultra-liviano de 17\" con pantalla OLED",
        price: "2299.00",
        originalPrice: "2699.00",
        categoryId: "2",
        brand: "LG",
        imageUrl: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 400,
        createdAt: new Date()
      },

      // Additional TVs
      {
        id: "61",
        name: "Sony 85\" X95L BRAVIA XR Mini LED 4K TV",
        nameEs: "Sony 85\" X95L BRAVIA XR Mini LED 4K TV",
        description: "Large premium TV with Cognitive Processor XR",
        descriptionEs: "TV premium grande con procesador cognitivo XR",
        price: "4999.00",
        originalPrice: "5999.00",
        categoryId: "3",
        brand: "Sony",
        imageUrl: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 1000,
        createdAt: new Date()
      },
      {
        id: "62",
        name: "LG 83\" C4 OLED evo 4K Smart TV",
        nameEs: "LG 83\" C4 OLED evo 4K Smart TV",
        description: "Massive OLED TV for home theater enthusiasts",
        descriptionEs: "TV OLED masivo para entusiastas del cine en casa",
        price: "4499.00",
        originalPrice: "5299.00",
        categoryId: "3",
        brand: "LG",
        imageUrl: "https://images.unsplash.com/photo-1461151304267-38535e780c79?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 800,
        createdAt: new Date()
      },
      {
        id: "63",
        name: "Samsung 50\" QN90D Neo QLED 4K Smart TV",
        nameEs: "Samsung 50\" QN90D Neo QLED 4K Smart TV",
        description: "Mid-size premium TV with Quantum Matrix Technology",
        descriptionEs: "TV premium de tamaño medio con tecnología Quantum Matrix",
        price: "1799.00",
        originalPrice: "2199.00",
        categoryId: "3",
        brand: "Samsung",
        imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 400,
        createdAt: new Date()
      },
      {
        id: "64",
        name: "TCL 98\" C955 QD-Mini LED 4K Google TV",
        nameEs: "TCL 98\" C955 QD-Mini LED 4K Google TV",
        description: "Massive screen TV for ultimate home cinema experience",
        descriptionEs: "TV de pantalla masiva para experiencia de cine en casa definitiva",
        price: "6999.00",
        originalPrice: "8999.00",
        categoryId: "3",
        brand: "TCL",
        imageUrl: "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 2000,
        createdAt: new Date()
      },
      {
        id: "65",
        name: "Hisense 75\" U7N ULED 4K Mini-LED TV",
        nameEs: "Hisense 75\" U7N ULED 4K Mini-LED TV",
        description: "Large affordable TV with Mini-LED backlighting",
        descriptionEs: "TV grande asequible con retroiluminación Mini-LED",
        price: "1999.00",
        originalPrice: "2499.00",
        categoryId: "3",
        brand: "Hisense",
        imageUrl: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 500,
        createdAt: new Date()
      },

      // Additional Audio Products
      {
        id: "66",
        name: "Audio-Technica ATH-M50xBT2 Wireless Headphones",
        nameEs: "Audio-Technica ATH-M50xBT2 Auriculares Inalámbricos",
        description: "Professional wireless headphones for monitoring and mixing",
        descriptionEs: "Auriculares inalámbricos profesionales para monitoreo y mezcla",
        price: "299.00",
        originalPrice: "349.00",
        categoryId: "4",
        brand: "Audio-Technica",
        imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 50,
        createdAt: new Date()
      },
      {
        id: "67",
        name: "Ultimate Ears MEGABOOM 4 Bluetooth Speaker",
        nameEs: "Ultimate Ears MEGABOOM 4 Altavoz Bluetooth",
        description: "360-degree sound portable speaker with 20-hour battery",
        descriptionEs: "Altavoz portátil con sonido 360 grados y 20 horas de batería",
        price: "299.00",
        originalPrice: "349.00",
        categoryId: "4",
        brand: "Ultimate Ears",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 50,
        createdAt: new Date()
      },
      {
        id: "68",
        name: "Focal Bathys Wireless Headphones",
        nameEs: "Focal Bathys Auriculares Inalámbricos",
        description: "French audiophile headphones with premium sound quality",
        descriptionEs: "Auriculares audiófilo franceses con calidad de sonido premium",
        price: "899.00",
        originalPrice: "1099.00",
        categoryId: "4",
        brand: "Focal",
        imageUrl: "https://images.unsplash.com/photo-1545127398-14699f92334b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 200,
        createdAt: new Date()
      },
      {
        id: "69",
        name: "Sonos Era 300 Smart Speaker",
        nameEs: "Sonos Era 300 Altavoz Inteligente",
        description: "Spatial audio smart speaker with voice control",
        descriptionEs: "Altavoz inteligente con audio espacial y control por voz",
        price: "699.00",
        originalPrice: "799.00",
        categoryId: "4",
        brand: "Sonos",
        imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 100,
        createdAt: new Date()
      },
      {
        id: "70",
        name: "Bose SoundLink Revolve+ II Bluetooth Speaker",
        nameEs: "Bose SoundLink Revolve+ II Altavoz Bluetooth",
        description: "Portable speaker with 360-degree sound and 17-hour battery",
        descriptionEs: "Altavoz portátil con sonido 360 grados y 17 horas de batería",
        price: "399.00",
        originalPrice: "449.00",
        categoryId: "4",
        brand: "Bose",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 50,
        createdAt: new Date()
      },

      // Additional Home Appliances
      {
        id: "71",
        name: "Shark IQ Robot Vacuum with Self-Empty Base",
        nameEs: "Shark IQ Robot Aspiradora con Base de Vaciado Automático",
        description: "Smart robot vacuum with mapping and self-emptying",
        descriptionEs: "Aspiradora robot inteligente con mapeo y vaciado automático",
        price: "599.00",
        originalPrice: "799.00",
        categoryId: "5",
        brand: "Shark",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 200,
        createdAt: new Date()
      },
      {
        id: "72",
        name: "Smeg Dolce&Gabbana Retro Toaster 4-Slice",
        nameEs: "Smeg Dolce&Gabbana Tostadora Retro 4 Rebanadas",
        description: "Designer toaster with Italian style and premium build",
        descriptionEs: "Tostadora de diseño con estilo italiano y construcción premium",
        price: "799.00",
        originalPrice: "999.00",
        categoryId: "5",
        brand: "Smeg",
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 200,
        createdAt: new Date()
      },
      {
        id: "73",
        name: "Vitamix A3500 Ascent Series Blender",
        nameEs: "Vitamix A3500 Ascent Series Licuadora",
        description: "Professional-grade blender for smoothies and food prep",
        descriptionEs: "Licuadora de grado profesional para batidos y preparación de alimentos",
        price: "899.00",
        originalPrice: "1099.00",
        categoryId: "5",
        brand: "Vitamix",
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 200,
        createdAt: new Date()
      },
      {
        id: "74",
        name: "De'Longhi La Specialista Arte Espresso Machine",
        nameEs: "De'Longhi La Specialista Arte Máquina de Espresso",
        description: "Semi-automatic espresso machine with advanced milk system",
        descriptionEs: "Máquina de espresso semiautomática con sistema de leche avanzado",
        price: "1299.00",
        originalPrice: "1599.00",
        categoryId: "5",
        brand: "De'Longhi",
        imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 300,
        createdAt: new Date()
      },
      {
        id: "75",
        name: "iRobot Roomba j9+ Robot Vacuum",
        nameEs: "iRobot Roomba j9+ Robot Aspiradora",
        description: "Advanced robot vacuum with object recognition and self-emptying",
        descriptionEs: "Aspiradora robot avanzada con reconocimiento de objetos y vaciado automático",
        price: "1399.00",
        originalPrice: "1699.00",
        categoryId: "5",
        brand: "iRobot",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 300,
        createdAt: new Date()
      },

      // Additional Gaming Products
      {
        id: "76",
        name: "Meta Quest 3S VR Headset 256GB",
        nameEs: "Meta Quest 3S Visor VR 256GB",
        description: "Affordable VR headset with mixed reality capabilities",
        descriptionEs: "Visor VR asequible con capacidades de realidad mixta",
        price: "499.00",
        originalPrice: "599.00",
        categoryId: "6",
        brand: "Meta",
        imageUrl: "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 100,
        createdAt: new Date()
      },
      {
        id: "77",
        name: "PlayStation Portal Remote Player",
        nameEs: "PlayStation Portal Reproductor Remoto",
        description: "Handheld device for remote PS5 gaming",
        descriptionEs: "Dispositivo portátil para jugar PS5 remotamente",
        price: "329.00",
        originalPrice: null,
        categoryId: "6",
        brand: "Sony",
        imageUrl: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 0,
        createdAt: new Date()
      },
      {
        id: "78",
        name: "Logitech G Pro X Superlight 2 Gaming Mouse",
        nameEs: "Logitech G Pro X Superlight 2 Ratón Gaming",
        description: "Ultra-lightweight wireless gaming mouse for esports",
        descriptionEs: "Ratón gaming inalámbrico ultra-liviano para esports",
        price: "249.00",
        originalPrice: "299.00",
        categoryId: "6",
        brand: "Logitech",
        imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 50,
        createdAt: new Date()
      },
      {
        id: "79",
        name: "Razer BlackShark V2 Pro Wireless Gaming Headset",
        nameEs: "Razer BlackShark V2 Pro Auriculares Gaming Inalámbricos",
        description: "Professional gaming headset with THX Spatial Audio",
        descriptionEs: "Auriculares gaming profesionales con audio espacial THX",
        price: "299.00",
        originalPrice: "349.00",
        categoryId: "6",
        brand: "Razer",
        imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 50,
        createdAt: new Date()
      },
      {
        id: "80",
        name: "SteelSeries Apex Pro TKL Wireless Gaming Keyboard",
        nameEs: "SteelSeries Apex Pro TKL Teclado Gaming Inalámbrico",
        description: "Tenkeyless mechanical keyboard with adjustable switches",
        descriptionEs: "Teclado mecánico tenkeyless con interruptores ajustables",
        price: "349.00",
        originalPrice: "399.00",
        categoryId: "6",
        brand: "SteelSeries",
        imageUrl: "https://images.unsplash.com/photo-1541728472741-03e45a58cf88?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 50,
        createdAt: new Date()
      },

      // More Premium Electronics
      {
        id: "81",
        name: "Apple Watch Ultra 2 49mm (Titanium)",
        nameEs: "Apple Watch Ultra 2 49mm (Titanio)",
        description: "Rugged smartwatch for extreme sports and outdoor adventures",
        descriptionEs: "Smartwatch resistente para deportes extremos y aventuras al aire libre",
        price: "1199.00",
        originalPrice: null,
        categoryId: "4",
        brand: "Apple",
        imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 0,
        createdAt: new Date()
      },
      {
        id: "82",
        name: "Samsung Galaxy Watch7 Classic 47mm",
        nameEs: "Samsung Galaxy Watch7 Classic 47mm",
        description: "Premium Android smartwatch with rotating bezel",
        descriptionEs: "Smartwatch Android premium con bisel giratorio",
        price: "599.00",
        originalPrice: "699.00",
        categoryId: "4",
        brand: "Samsung",
        imageUrl: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 100,
        createdAt: new Date()
      },
      {
        id: "83",
        name: "DJI Pocket 3 Creator Combo",
        nameEs: "DJI Pocket 3 Creator Combo",
        description: "Compact 4K camera with gimbal stabilization",
        descriptionEs: "Cámara 4K compacta con estabilización gimbal",
        price: "899.00",
        originalPrice: "1099.00",
        categoryId: "4",
        brand: "DJI",
        imageUrl: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 200,
        createdAt: new Date()
      },
      {
        id: "84",
        name: "GoPro HERO13 Black Creator Edition",
        nameEs: "GoPro HERO13 Black Edición Creator",
        description: "Ultimate action camera with 5.3K video recording",
        descriptionEs: "Cámara de acción definitiva con grabación de video 5.3K",
        price: "799.00",
        originalPrice: "899.00",
        categoryId: "4",
        brand: "GoPro",
        imageUrl: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 100,
        createdAt: new Date()
      },
      {
        id: "85",
        name: "Canon EOS R6 Mark II Mirrorless Camera Body",
        nameEs: "Canon EOS R6 Mark II Cuerpo de Cámara Sin Espejo",
        description: "Professional full-frame camera for photography and video",
        descriptionEs: "Cámara profesional full-frame para fotografía y video",
        price: "3299.00",
        originalPrice: "3699.00",
        categoryId: "4",
        brand: "Canon",
        imageUrl: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 400,
        createdAt: new Date()
      },

      // Smart Home & Accessories
      {
        id: "86",
        name: "Nest Hub Max 10\" Smart Display",
        nameEs: "Nest Hub Max 10\" Pantalla Inteligente",
        description: "Smart display with Google Assistant and security camera",
        descriptionEs: "Pantalla inteligente con Google Assistant y cámara de seguridad",
        price: "399.00",
        originalPrice: "449.00",
        categoryId: "4",
        brand: "Google",
        imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 50,
        createdAt: new Date()
      },
      {
        id: "87",
        name: "Amazon Echo Show 15 Smart Display",
        nameEs: "Amazon Echo Show 15 Pantalla Inteligente",
        description: "Large smart display for family organization and entertainment",
        descriptionEs: "Pantalla inteligente grande para organización familiar y entretenimiento",
        price: "449.00",
        originalPrice: "499.00",
        categoryId: "4",
        brand: "Amazon",
        imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 50,
        createdAt: new Date()
      },
      {
        id: "88",
        name: "Philips Hue Play HDMI Sync Box 8K",
        nameEs: "Philips Hue Play HDMI Sync Box 8K",
        description: "Sync your lights with TV content for immersive entertainment",
        descriptionEs: "Sincroniza tus luces con contenido de TV para entretenimiento inmersivo",
        price: "399.00",
        originalPrice: "499.00",
        categoryId: "4",
        brand: "Philips",
        imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 100,
        createdAt: new Date()
      },
      {
        id: "89",
        name: "Ring Video Doorbell Pro 2 with Chime Pro",
        nameEs: "Ring Video Doorbell Pro 2 con Chime Pro",
        description: "Smart doorbell with 1536p video and advanced motion detection",
        descriptionEs: "Timbre inteligente con video 1536p y detección de movimiento avanzada",
        price: "449.00",
        originalPrice: "549.00",
        categoryId: "4",
        brand: "Ring",
        imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 100,
        createdAt: new Date()
      },
      {
        id: "90",
        name: "Arlo Pro 5S 2K Security Camera System",
        nameEs: "Arlo Pro 5S Sistema de Cámaras de Seguridad 2K",
        description: "Wireless security cameras with color night vision",
        descriptionEs: "Cámaras de seguridad inalámbricas con visión nocturna a color",
        price: "799.00",
        originalPrice: "999.00",
        categoryId: "4",
        brand: "Arlo",
        imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 200,
        createdAt: new Date()
      },

      // PC Components & Accessories
      {
        id: "91",
        name: "NVIDIA GeForce RTX 5090 Founders Edition",
        nameEs: "NVIDIA GeForce RTX 5090 Founders Edition",
        description: "Ultimate graphics card for 4K gaming and AI workloads",
        descriptionEs: "Tarjeta gráfica definitiva para gaming 4K y cargas de trabajo AI",
        price: "2299.00",
        originalPrice: null,
        categoryId: "2",
        brand: "NVIDIA",
        imageUrl: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 0,
        createdAt: new Date()
      },
      {
        id: "92",
        name: "AMD Ryzen 9 9950X 16-Core Processor",
        nameEs: "AMD Ryzen 9 9950X Procesador 16-Core",
        description: "High-performance CPU for gaming and content creation",
        descriptionEs: "CPU de alto rendimiento para gaming y creación de contenido",
        price: "999.00",
        originalPrice: "1199.00",
        categoryId: "2",
        brand: "AMD",
        imageUrl: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 200,
        createdAt: new Date()
      },
      {
        id: "93",
        name: "ASUS ROG Strix Z890-E Gaming Motherboard",
        nameEs: "ASUS ROG Strix Z890-E Placa Base Gaming",
        description: "Premium gaming motherboard with WiFi 7 and PCIe 5.0",
        descriptionEs: "Placa base gaming premium con WiFi 7 y PCIe 5.0",
        price: "699.00",
        originalPrice: "799.00",
        categoryId: "2",
        brand: "ASUS",
        imageUrl: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 100,
        createdAt: new Date()
      },
      {
        id: "94",
        name: "Corsair Dominator Platinum RGB 64GB DDR5-6000",
        nameEs: "Corsair Dominator Platinum RGB 64GB DDR5-6000",
        description: "High-speed RGB memory for ultimate performance",
        descriptionEs: "Memoria RGB de alta velocidad para máximo rendimiento",
        price: "899.00",
        originalPrice: "1099.00",
        categoryId: "2",
        brand: "Corsair",
        imageUrl: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 200,
        createdAt: new Date()
      },
      {
        id: "95",
        name: "Samsung 990 PRO 4TB NVMe SSD with Heatsink",
        nameEs: "Samsung 990 PRO 4TB NVMe SSD con Disipador",
        description: "Ultra-fast NVMe SSD for gaming and professional work",
        descriptionEs: "SSD NVMe ultra-rápido para gaming y trabajo profesional",
        price: "599.00",
        originalPrice: "799.00",
        categoryId: "2",
        brand: "Samsung",
        imageUrl: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 200,
        createdAt: new Date()
      },

      // Health & Fitness Tech
      {
        id: "96",
        name: "Fitbit Charge 6 Advanced Fitness Tracker",
        nameEs: "Fitbit Charge 6 Rastreador de Fitness Avanzado",
        description: "Advanced fitness tracker with built-in GPS and heart rate monitoring",
        descriptionEs: "Rastreador de fitness avanzado con GPS integrado y monitoreo cardíaco",
        price: "229.00",
        originalPrice: "279.00",
        categoryId: "4",
        brand: "Fitbit",
        imageUrl: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 50,
        createdAt: new Date()
      },
      {
        id: "97",
        name: "Garmin Fenix 8 Solar Multisport GPS Watch",
        nameEs: "Garmin Fenix 8 Solar Reloj GPS Multideporte",
        description: "Premium GPS watch with solar charging and extensive health metrics",
        descriptionEs: "Reloj GPS premium con carga solar y métricas de salud extensas",
        price: "1299.00",
        originalPrice: "1499.00",
        categoryId: "4",
        brand: "Garmin",
        imageUrl: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 200,
        createdAt: new Date()
      },
      {
        id: "98",
        name: "Oura Ring Gen4 Smart Ring (Titanium)",
        nameEs: "Oura Ring Gen4 Anillo Inteligente (Titanio)",
        description: "Advanced health tracking ring with sleep and recovery insights",
        descriptionEs: "Anillo de seguimiento de salud avanzado con insights de sueño y recuperación",
        price: "449.00",
        originalPrice: "499.00",
        categoryId: "4",
        brand: "Oura",
        imageUrl: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 50,
        createdAt: new Date()
      },
      {
        id: "99",
        name: "WHOOP 4.0 Fitness Tracker with 12-Month Membership",
        nameEs: "WHOOP 4.0 Rastreador de Fitness con Membresía de 12 Meses",
        description: "Screenless fitness tracker focused on recovery and strain coaching",
        descriptionEs: "Rastreador de fitness sin pantalla enfocado en recuperación y entrenamiento",
        price: "399.00",
        originalPrice: "449.00",
        categoryId: "4",
        brand: "WHOOP",
        imageUrl: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 50,
        createdAt: new Date()
      },
      {
        id: "100",
        name: "Therabody Theragun PRO Plus Percussion Massager",
        nameEs: "Therabody Theragun PRO Plus Masajeador de Percusión",
        description: "Professional-grade percussive therapy device for muscle recovery",
        descriptionEs: "Dispositivo de terapia percusiva de grado profesional para recuperación muscular",
        price: "699.00",
        originalPrice: "799.00",
        categoryId: "5",
        brand: "Therabody",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        images: [],
        inStock: true,
        featured: false,
        discount: 100,
        createdAt: new Date()
      }
    ];

    products.forEach(product => this.products.set(product.id, product));
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      phone: insertUser.phone || null,
      address: insertUser.address || null,
      city: insertUser.city || null,
      state: insertUser.state || null,
      postcode: insertUser.postcode || null
    };
    this.users.set(id, user);
    return user;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = {
      ...insertCategory,
      id,
      createdAt: new Date(),
      imageUrl: insertCategory.imageUrl || null
    };
    this.categories.set(id, category);
    return category;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.categoryId === categoryId);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.featured);
  }

  async getProductsOnSale(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.discount && product.discount > 0);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = {
      ...insertProduct,
      id,
      createdAt: new Date(),
      description: insertProduct.description || null,
      descriptionEs: insertProduct.descriptionEs || null,
      originalPrice: insertProduct.originalPrice || null,
      categoryId: insertProduct.categoryId || null,
      brand: insertProduct.brand || null,
      images: (insertProduct.images || []) as string[],
      inStock: insertProduct.inStock !== undefined ? insertProduct.inStock : true,
      featured: insertProduct.featured !== undefined ? insertProduct.featured : false,
      discount: insertProduct.discount !== undefined ? insertProduct.discount : 0
    };
    this.products.set(id, product);
    return product;
  }

  // Orders
  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
    return Array.from(this.orders.values()).find(order => order.orderNumber === orderNumber);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      ...insertOrder,
      id,
      createdAt: new Date(),
      userId: insertOrder.userId || null,
      paymentStatus: insertOrder.paymentStatus || "pending",
      stripePaymentIntentId: insertOrder.stripePaymentIntentId || null,
      status: insertOrder.status || "pending"
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderPaymentStatus(id: string, status: string, stripePaymentIntentId?: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (order) {
      const updatedOrder = {
        ...order,
        paymentStatus: status,
        ...(stripePaymentIntentId && { stripePaymentIntentId })
      };
      this.orders.set(id, updatedOrder);
      return updatedOrder;
    }
    return undefined;
  }

  // Order Items
  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(item => item.orderId === orderId);
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = randomUUID();
    const orderItem: OrderItem = {
      ...insertOrderItem,
      id
    };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }
}

export const storage = new MemStorage();
