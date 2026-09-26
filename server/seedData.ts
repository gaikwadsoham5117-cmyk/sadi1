import { Product, Category, Order } from './types.js';

export const initialCategories: Category[] = [
  {
    id: 'paithani',
    name: 'Paithani Sarees',
    slug: 'Paithani',
    shortDesc: 'The queen of Maharashtrian silken splendor, woven with pure gold zari and majestic mor (peacock) pallu motifs.',
    fullDesc: 'Known as the Queen of Silks, each authentic Paithani saree is handwoven by master weavers in Yeola and Paithan. Adorned with delicate oblique borders, kaleidoscopic pallus, and vibrant jewel tones.',
    image: {
      url: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405329/virasat_sarees/purple_paithani.jpg',
      publicId: 'virasat_sarees/purple_paithani'
    },
    itemCount: 18
  },
  {
    id: 'silk',
    name: 'Silk Sarees',
    slug: 'Silk',
    shortDesc: 'Pure Kanjivaram and Banarasi mulberry silks adorned with authentic woven gold brocade.',
    fullDesc: 'From the temple corridors of Kanchipuram to the ancient ghats of Varanasi, our silk collection reflects unmatched opulence, crisp structure, and generational heritage.',
    image: {
      url: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405339/virasat_sarees/red_kanjivaram.jpg',
      publicId: 'virasat_sarees/red_kanjivaram'
    },
    itemCount: 24
  },
  {
    id: 'cotton',
    name: 'Cotton Sarees',
    slug: 'Cotton',
    shortDesc: 'Lightweight Chanderi, Maheshwari and soft handloom cottons for timeless grace and everyday luxury.',
    fullDesc: 'Handcrafted with natural breathability, delicate weaves, and subtle woven zari borders. Perfect for day functions, summer festivities, and refined professional gatherings.',
    image: {
      url: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405343/virasat_sarees/yellow_festive.jpg',
      publicId: 'virasat_sarees/yellow_festive'
    },
    itemCount: 14
  },
  {
    id: 'designer',
    name: 'Designer Sarees',
    slug: 'Designer',
    shortDesc: 'Modern artisanal silhouettes featuring scalloped borders, cutwork embroidery, and ethereal metallic organza textures.',
    fullDesc: 'Contemporary interpretations of ethnic wear tailored for modern cocktail nights, destination weddings, and red carpet festivities with intricate beadwork and shimmering sequins.',
    image: {
      url: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405342/virasat_sarees/pink_designer.jpg',
      publicId: 'virasat_sarees/pink_designer'
    },
    itemCount: 16
  },
  {
    id: 'traditional',
    name: 'Traditional Sarees',
    slug: 'Traditional',
    shortDesc: 'Heritage sarees honoring timeless weave cultures like Kasavu, Nauvari, and Pochampally ikats.',
    fullDesc: 'Timeless handloom weaves crafted by generational artisanal families across Indian weaving clusters, blessed with auspicious weaves and authentic natural dyes.',
    image: {
      url: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405339/virasat_sarees/green_banarasi.jpg',
      publicId: 'virasat_sarees/green_banarasi'
    },
    itemCount: 20
  },
  {
    id: 'festive',
    name: 'Festive Sarees',
    slug: 'Festive',
    shortDesc: 'Vibrant celebratory drapes glistening with intricate zardozi, meenakari, sequins, and rich brocade.',
    fullDesc: 'Celebrate Diwali, wedding sangeets, and grand pujas in opulent sarees that catch every ray of celebratory light with rich zardozi, meenakari, and radiant festive hues.',
    image: {
      url: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405340/virasat_sarees/blue_silk.jpg',
      publicId: 'virasat_sarees/blue_silk'
    },
    itemCount: 22
  }
];

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Royal Yeola Paithani Saree',
    slug: 'royal-yeola-paithani-saree',
    category: 'Paithani',
    price: 8499,
    originalPrice: 10999,
    discountPercentage: 23,
    stock: 12,
    description: 'An authentic Yeola handloom masterpiece adorned with a glorious Peacock (Mor) and floral vase (Kaldar) pallu woven in genuine gold tissue zari. Intricate peacock buttis shimmer across the rich lustrous body.',
    fabric: '100% Pure Mulberry Silk',
    sareeLength: '6.3 meters (including 0.8m running blouse piece)',
    blouseIncluded: true,
    blouseType: 'Unstitched matching silk with heavy zari border',
    careInstructions: 'Dry clean only. Preserve in clean muslin or soft cotton cloth away from moisture.',
    availability: 'In Stock',
    featured: true,
    bestSeller: true,
    newArrival: true,
    rating: 4.9,
    reviewsCount: 42,
    work: 'Handwoven Meenakari Peacock Pallu & Gold Buttis',
    zariType: 'Pure Tested Muga Gold Zari',
    occasion: 'Wedding, Traditional, Festival, Reception',
    colors: [
      { name: 'Purple', value: '#6A1B9A', image: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405329/virasat_sarees/purple_paithani.jpg', stock: 6, inStock: true },
      { name: 'Red', value: '#B71C1C', image: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405339/virasat_sarees/red_kanjivaram.jpg', stock: 4, inStock: true },
      { name: 'Green', value: '#1B5E20', image: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405339/virasat_sarees/green_banarasi.jpg', stock: 0, inStock: false },
      { name: 'Blue', value: '#1565C0', image: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405340/virasat_sarees/blue_silk.jpg', stock: 2, inStock: true }
    ],
    images: [
      { url: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405329/virasat_sarees/purple_paithani.jpg', publicId: 'virasat_sarees/purple_paithani' },
      { url: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405339/virasat_sarees/red_kanjivaram.jpg', publicId: 'virasat_sarees/red_kanjivaram' },
      { url: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405339/virasat_sarees/green_banarasi.jpg', publicId: 'virasat_sarees/green_banarasi' }
    ],
    reviews: [
      {
        id: 'rev-1',
        userName: 'Priyanka Patil',
        rating: 5,
        date: '2026-08-14',
        comment: 'Wore this for my brother\'s wedding reception. The peacock pallu is breathtakingly fine and the silk drape falls royally. Everyone asked where I bought it!',
        verifiedPurchase: true,
        location: 'Pune, Maharashtra'
      },
      {
        id: 'rev-2',
        userName: 'Aparna Kulkarni',
        rating: 5,
        date: '2026-07-28',
        comment: 'Authentic Yeola quality. The zari shine is subtle and regal, not flashy. Delivery was swift and packing came in a protected silk bag.',
        verifiedPurchase: true,
        location: 'Mumbai'
      }
    ],
    createdAt: '2026-06-10T10:00:00Z',
    updatedAt: '2026-09-20T12:00:00Z'
  },
  {
    id: 'prod-2',
    name: 'Kanchipuram Bridal Silk Saree',
    slug: 'kanchipuram-bridal-silk-saree',
    category: 'Silk',
    price: 12999,
    originalPrice: 16500,
    discountPercentage: 21,
    stock: 8,
    description: 'Handcrafted by master Kanchi weavers using 3-ply heavy mulberry silk yarn interlocked with solid temple korvai borders. The pallu features traditional rudraksha and floral vines bathed in pure golden luster.',
    fabric: 'Pure Kanchipuram Mulberry Silk',
    sareeLength: '6.3 meters with attached contrast blouse',
    blouseIncluded: true,
    blouseType: 'Heavy brocade blouse piece with woven gold sleeve motifs',
    careInstructions: 'Professional dry clean only. Wrap in soft mul-mul cotton cloth.',
    availability: 'In Stock',
    featured: true,
    bestSeller: true,
    newArrival: false,
    rating: 4.95,
    reviewsCount: 38,
    work: 'Interlocking Korvai Temple Borders with Pure Zari',
    zariType: 'Certified Half-Fine Gold Zari',
    occasion: 'Wedding, Traditional, Reception',
    colors: [
      { name: 'Bridal Crimson Red', value: '#B71C1C', image: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405339/virasat_sarees/red_kanjivaram.jpg', stock: 5, inStock: true },
      { name: 'Maroon', value: '#4A0E17', image: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405341/virasat_sarees/maroon_bridal.jpg', stock: 3, inStock: true }
    ],
    images: [
      { url: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405339/virasat_sarees/red_kanjivaram.jpg', publicId: 'virasat_sarees/red_kanjivaram' },
      { url: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405341/virasat_sarees/maroon_bridal.jpg', publicId: 'virasat_sarees/maroon_bridal' }
    ],
    reviews: [
      {
        id: 'rev-3',
        userName: 'Sunita Ramanathan',
        rating: 5,
        date: '2026-08-02',
        comment: 'Heirloom treasure! The weight of the silk and the tightness of the korvai weave prove its uncompromised authenticity.',
        verifiedPurchase: true,
        location: 'Bengaluru'
      }
    ],
    createdAt: '2026-05-15T09:00:00Z',
    updatedAt: '2026-09-18T14:30:00Z'
  },
  {
    id: 'prod-3',
    name: 'Varanasi Meenakari Banarasi Saree',
    slug: 'varanasi-meenakari-banarasi-saree',
    category: 'Silk',
    price: 9800,
    originalPrice: 13500,
    discountPercentage: 27,
    stock: 9,
    description: 'An illustrious Katan silk saree woven in the holy city of Banaras. Showcases multi-colored meenakari floral jaal across emerald green fabric with a lavish kalga-motif pallu.',
    fabric: 'Pure Katan Silk',
    sareeLength: '6.3 meters with contrast blouse',
    blouseIncluded: true,
    blouseType: 'Unstitched Katan Silk with Banarasi border',
    careInstructions: 'Dry clean only. Roll in cotton rolls to protect zari.',
    availability: 'In Stock',
    featured: true,
    bestSeller: false,
    newArrival: true,
    rating: 4.88,
    reviewsCount: 29,
    work: 'Kadwa Weave with Colorful Meenakari Resham Motifs',
    zariType: 'Antique Gold & Silver Zari',
    occasion: 'Festival, Wedding, Traditional, Party',
    colors: [
      { name: 'Emerald Green', value: '#1B5E20', image: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405339/virasat_sarees/green_banarasi.jpg', stock: 5, inStock: true },
      { name: 'Deep Royal Blue', value: '#1565C0', image: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405340/virasat_sarees/blue_silk.jpg', stock: 4, inStock: true }
    ],
    images: [
      { url: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405339/virasat_sarees/green_banarasi.jpg', publicId: 'virasat_sarees/green_banarasi' },
      { url: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405340/virasat_sarees/blue_silk.jpg', publicId: 'virasat_sarees/blue_silk' }
    ],
    createdAt: '2026-06-25T11:20:00Z',
    updatedAt: '2026-09-22T08:15:00Z'
  },
  {
    id: 'prod-4',
    name: 'Midnight Royal Blue Katan Silk',
    slug: 'midnight-royal-blue-katan-silk',
    category: 'Festive',
    price: 7600,
    originalPrice: 9500,
    discountPercentage: 20,
    stock: 15,
    description: 'Imbued with the grandeur of nocturnal skies, this deep royal blue silk saree is festooned with silver and gold zari shikargah animal and forest motifs.',
    fabric: 'Fine Katan Silk',
    sareeLength: '6.3 meters with running blouse',
    blouseIncluded: true,
    blouseType: 'Matching Blue Silk with zari sleeve border',
    careInstructions: 'Dry clean only.',
    availability: 'In Stock',
    featured: false,
    bestSeller: true,
    newArrival: false,
    rating: 4.82,
    reviewsCount: 31,
    work: 'Zari Brocade all over',
    zariType: 'Dual Tone Zari',
    occasion: 'Party, Reception, Festival',
    colors: [
      { name: 'Royal Blue', value: '#1565C0', image: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405340/virasat_sarees/blue_silk.jpg', stock: 10, inStock: true },
      { name: 'Purple', value: '#6A1B9A', image: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405329/virasat_sarees/purple_paithani.jpg', stock: 5, inStock: true }
    ],
    images: [
      { url: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405340/virasat_sarees/blue_silk.jpg', publicId: 'virasat_sarees/blue_silk' },
      { url: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405329/virasat_sarees/purple_paithani.jpg', publicId: 'virasat_sarees/purple_paithani' }
    ],
    createdAt: '2026-07-01T15:00:00Z',
    updatedAt: '2026-09-21T10:00:00Z'
  },
  {
    id: 'prod-5',
    name: 'Imperial Crimson Velvet-Touch Bridal Saree',
    slug: 'imperial-crimson-velvet-touch-bridal-saree',
    category: 'Traditional',
    price: 14500,
    originalPrice: 18999,
    discountPercentage: 24,
    stock: 6,
    description: 'A deeply auspicious crimson bridal saree handwoven with pure metallic zari motifs, inspired by ancient royal court regalia. Features heavy border with Sanskrit shloka embroidery on pallu.',
    fabric: 'Heavy Bridal Mulberry Silk',
    sareeLength: '6.3 meters with heavy blouse',
    blouseIncluded: true,
    blouseType: 'Heavy Zardozi hand-embroidered blouse piece',
    careInstructions: 'Professional dry clean. Keep wrapped in muslin cloth.',
    availability: 'Low Stock',
    featured: true,
    bestSeller: true,
    newArrival: false,
    rating: 5.0,
    reviewsCount: 54,
    work: 'Zardozi Hand Embroidery & Royal Pallu Border',
    zariType: 'Pure Antique Gold Thread',
    occasion: 'Wedding, Reception, Traditional',
    colors: [
      { name: 'Crimson Maroon', value: '#5A1022', image: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405341/virasat_sarees/maroon_bridal.jpg', stock: 4, inStock: true },
      { name: 'Bridal Red', value: '#B71C1C', image: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405339/virasat_sarees/red_kanjivaram.jpg', stock: 2, inStock: true }
    ],
    images: [
      { url: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405341/virasat_sarees/maroon_bridal.jpg', publicId: 'virasat_sarees/maroon_bridal' },
      { url: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405339/virasat_sarees/red_kanjivaram.jpg', publicId: 'virasat_sarees/red_kanjivaram' }
    ],
    createdAt: '2026-04-10T12:00:00Z',
    updatedAt: '2026-09-24T18:00:00Z'
  },
  {
    id: 'prod-6',
    name: 'Blush Rose Organza Designer Saree',
    slug: 'blush-rose-organza-designer-saree',
    category: 'Designer',
    price: 6499,
    originalPrice: 8500,
    discountPercentage: 23,
    stock: 14,
    description: 'Ethereal and gossamer, this blush pink organza saree boasts intricate scalloped resham borders, subtle metallic sequin highlights, and handcrafted cutwork.',
    fabric: 'Pure Silk Organza',
    sareeLength: '6.2 meters with matching raw silk blouse',
    blouseIncluded: true,
    blouseType: 'Unstitched Raw Silk blouse with delicate cuff motifs',
    careInstructions: 'Dry clean only. Steam iron on reverse.',
    availability: 'In Stock',
    featured: true,
    bestSeller: false,
    newArrival: true,
    rating: 4.79,
    reviewsCount: 22,
    work: 'Scalloped Cutwork Border & Gota Patti accents',
    zariType: 'Rose Gold Shimmer Zari',
    occasion: 'Party, Reception, Casual',
    colors: [
      { name: 'Blush Pink', value: '#F48FB1', image: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405342/virasat_sarees/pink_designer.jpg', stock: 14, inStock: true },
      { name: 'Pastel Yellow', value: '#FFF59D', image: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405343/virasat_sarees/yellow_festive.jpg', stock: 0, inStock: false }
    ],
    images: [
      { url: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405342/virasat_sarees/pink_designer.jpg', publicId: 'virasat_sarees/pink_designer' },
      { url: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405343/virasat_sarees/yellow_festive.jpg', publicId: 'virasat_sarees/yellow_festive' }
    ],
    createdAt: '2026-08-10T14:00:00Z',
    updatedAt: '2026-09-24T19:30:00Z'
  },
  {
    id: 'prod-7',
    name: 'Haldi Mustard Chanderi Silk Cotton Saree',
    slug: 'haldi-mustard-chanderi-silk-cotton-saree',
    category: 'Cotton',
    price: 4299,
    originalPrice: 5800,
    discountPercentage: 26,
    stock: 20,
    description: 'Handwoven in the historical loom clusters of Chanderi, Madhya Pradesh. Blends gossamer silk warps with airy cotton wefts, adorned with gold coin (ashrafi) buttis.',
    fabric: 'Handloom Chanderi Silk Cotton',
    sareeLength: '6.3 meters with matching blouse',
    blouseIncluded: true,
    blouseType: 'Running Chanderi fabric with gold piping border',
    careInstructions: 'Dry clean recommended or gentle hand wash in cold water.',
    availability: 'In Stock',
    featured: false,
    bestSeller: true,
    newArrival: false,
    rating: 4.86,
    reviewsCount: 35,
    work: 'Ashrafi Coin Butti & Delicate Eknalia Border',
    zariType: 'Lightweight Tested Gold Zari',
    occasion: 'Festival, Casual, Traditional, Office',
    colors: [
      { name: 'Mustard Yellow', value: '#FBC02D', image: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405343/virasat_sarees/yellow_festive.jpg', stock: 12, inStock: true },
      { name: 'Forest Green', value: '#2E7D32', image: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405339/virasat_sarees/green_banarasi.jpg', stock: 8, inStock: true }
    ],
    images: [
      { url: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405343/virasat_sarees/yellow_festive.jpg', publicId: 'virasat_sarees/yellow_festive' },
      { url: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405339/virasat_sarees/green_banarasi.jpg', publicId: 'virasat_sarees/green_banarasi' }
    ],
    createdAt: '2026-06-18T16:00:00Z',
    updatedAt: '2026-09-23T11:00:00Z'
  },
  {
    id: 'prod-8',
    name: 'Heritage Yeola Muniya Border Paithani',
    slug: 'heritage-yeola-muniya-border-paithani',
    category: 'Paithani',
    price: 11200,
    originalPrice: 14500,
    discountPercentage: 23,
    stock: 5,
    description: 'An heirloom Paithani featuring the revered parrot (Muniya / Tota-Maina) border hand-knotted by veteran weavers. The tissue zari pallu glimmers with lotus medallions and gold tassels.',
    fabric: 'Pure Mulberry Silk Handloom',
    sareeLength: '6.4 meters with running blouse piece',
    blouseIncluded: true,
    blouseType: 'Unstitched Silk with authentic Muniya border',
    careInstructions: 'Dry clean only. Store in pure cotton bag.',
    availability: 'Low Stock',
    featured: true,
    bestSeller: false,
    newArrival: true,
    rating: 4.98,
    reviewsCount: 19,
    work: 'Hand-knotted Muniya Border & Asavali Pallu',
    zariType: 'Certified Tested Pure Zari',
    occasion: 'Wedding, Traditional, Festival',
    colors: [
      { name: 'Amethyst Purple', value: '#4A148C', image: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405329/virasat_sarees/purple_paithani.jpg', stock: 3, inStock: true },
      { name: 'Wine Crimson', value: '#5A1022', image: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405341/virasat_sarees/maroon_bridal.jpg', stock: 2, inStock: true }
    ],
    images: [
      { url: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405329/virasat_sarees/purple_paithani.jpg', publicId: 'virasat_sarees/purple_paithani' },
      { url: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405341/virasat_sarees/maroon_bridal.jpg', publicId: 'virasat_sarees/maroon_bridal' }
    ],
    createdAt: '2026-07-20T10:30:00Z',
    updatedAt: '2026-09-25T14:00:00Z'
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'VIR-2026-8941',
    userId: 'user-sample-1',
    items: [
      {
        productId: 'prod-1',
        name: 'Royal Yeola Paithani Saree',
        slug: 'royal-yeola-paithani-saree',
        price: 8499,
        quantity: 1,
        selectedColor: 'Purple',
        image: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405329/virasat_sarees/purple_paithani.jpg'
      }
    ],
    shippingAddress: {
      fullName: 'Sunita Joshi',
      phone: '+91 98220 12345',
      email: 'sunita.joshi@gmail.com',
      addressLine1: 'Flat 402, Shivajinagar Residency, Model Colony',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411016'
    },
    subtotal: 8499,
    discount: 849,
    shipping: 0,
    total: 7650,
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    orderStatus: 'Delivered',
    razorpayOrderId: 'order_test_9011823901',
    razorpayPaymentId: 'pay_test_9011823901',
    createdAt: '2026-09-15T11:30:00Z',
    updatedAt: '2026-09-18T16:00:00Z'
  },
  {
    id: 'ord-1002',
    orderNumber: 'VIR-2026-8942',
    userId: 'user-sample-2',
    items: [
      {
        productId: 'prod-2',
        name: 'Kanchipuram Bridal Silk Saree',
        slug: 'kanchipuram-bridal-silk-saree',
        price: 12999,
        quantity: 1,
        selectedColor: 'Bridal Crimson Red',
        image: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405339/virasat_sarees/red_kanjivaram.jpg'
      }
    ],
    shippingAddress: {
      fullName: 'Aishwarya Deshmukh',
      phone: '+91 94225 67890',
      email: 'aishwarya.d@gmail.com',
      addressLine1: 'Bungalow 18, Tarabai Park',
      city: 'Kolhapur',
      state: 'Maharashtra',
      pincode: '416003'
    },
    subtotal: 12999,
    discount: 500,
    shipping: 0,
    total: 12499,
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    orderStatus: 'Shipped',
    razorpayOrderId: 'order_test_9022391022',
    razorpayPaymentId: 'pay_test_9022391022',
    createdAt: '2026-09-22T14:15:00Z',
    updatedAt: '2026-09-24T09:20:00Z'
  },
  {
    id: 'ord-1003',
    orderNumber: 'VIR-2026-8943',
    userId: 'user-sample-3',
    items: [
      {
        productId: 'prod-6',
        name: 'Blush Rose Organza Designer Saree',
        slug: 'blush-rose-organza-designer-saree',
        price: 6499,
        quantity: 1,
        selectedColor: 'Blush Pink',
        image: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405342/virasat_sarees/pink_designer.jpg'
      },
      {
        productId: 'prod-7',
        name: 'Haldi Mustard Chanderi Silk Cotton Saree',
        slug: 'haldi-mustard-chanderi-silk-cotton-saree',
        price: 4299,
        quantity: 1,
        selectedColor: 'Mustard Yellow',
        image: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405343/virasat_sarees/yellow_festive.jpg'
      }
    ],
    shippingAddress: {
      fullName: 'Neha Mehra',
      phone: '+91 98110 54321',
      email: 'neha.mehra@gmail.com',
      addressLine1: 'Apartment 7B, Defence Colony',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110024'
    },
    subtotal: 10798,
    discount: 1000,
    shipping: 0,
    total: 9798,
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    orderStatus: 'Confirmed',
    razorpayOrderId: 'order_test_9033481923',
    razorpayPaymentId: 'pay_test_9033481923',
    createdAt: '2026-09-24T18:40:00Z',
    updatedAt: '2026-09-24T18:42:00Z'
  }
];
