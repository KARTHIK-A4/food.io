// Hot Beverages Images
import degreeCoffeeImg from '../images/hot cofee/kumbakonam  degree cofee.jpg'
import blackCoffeeImg from '../images/hot cofee/black cofee.webp'
import badamMilkImg from '../images/hot cofee/hot badam-milk.jpg'
import gingerTeaImg from '../images/hot cofee/Ginger-Tea-Recipes-scaled.jpeg'
import honeyLemonImg from '../images/hot cofee/Honey Lemon Tea.webp'
import teaImg from '../images/hot cofee/tea.jpg'
import blackTeaImg from '../images/hot cofee/Black-Tea.jpg'
import roseMilkHotImg from '../images/hot cofee/Rose rose milk.webp'
import hotMilkImg from '../images/hot cofee/hot-milk.jpg'

// Cold Beverages Images
import coldCoffeeImg from '../images/cold cofee/cold milk cofee.webp'
import icedTeaImg from '../images/cold cofee/iced tea.jpg'
import coldRoseMilkImg from '../images/cold cofee/cold rose-milk.jpg'
import limeJuiceImg from '../images/cold cofee/cold lim juice.jpg'
import buttermilkImg from '../images/cold cofee/Buttermilk.webp'
import frappeImg from '../images/cold cofee/Blog-Thumbnail.jpg'

export const coffeeMenu = [
  // Hot Coffee & Teas
  {
    id: 'hot-1',
    name: 'Kumbakonam Degree Coffee',
    category: 'hot',
    price: 35,
    originalPrice: 45,
    rating: 4.9,
    reviews: 320,
    description: 'Authentic South Indian filter coffee brewed with chicory-rich blend and frothy pure milk.',
    image: degreeCoffeeImg,
    badge: 'Bestseller',
    weekStatus: 'current_week', // featured this week
    prepTime: '4 mins',
    tags: ['Filter Coffee', 'Traditional', 'Strong']
  },
  {
    id: 'hot-2',
    name: 'Rich Black Coffee (Espresso Roast)',
    category: 'hot',
    price: 30,
    originalPrice: 40,
    rating: 4.8,
    reviews: 184,
    description: 'Freshly roasted dark Arabica beans extracted under pressure for intense aromatic flavor.',
    image: blackCoffeeImg,
    badge: '1 Week Ago Hit',
    weekStatus: 'past_week', // 1 week before favorite
    prepTime: '3 mins',
    tags: ['Bold', 'Zero Sugar', 'Energy']
  },
  {
    id: 'hot-3',
    name: 'Royal Saffron Badam Milk',
    category: 'hot',
    price: 50,
    originalPrice: 65,
    rating: 4.9,
    reviews: 210,
    description: 'Rich creamy milk infused with real crushed almonds, fragrant saffron, and cardamom.',
    image: badamMilkImg,
    badge: "Chef's Special",
    weekStatus: 'current_week',
    prepTime: '5 mins',
    tags: ['Nuts', 'Immunity', 'Sweet']
  },
  {
    id: 'hot-4',
    name: 'Fresh Ginger Cardamom Tea',
    category: 'hot',
    price: 25,
    originalPrice: 30,
    rating: 4.8,
    reviews: 450,
    description: 'Crushed highland ginger and green cardamom simmered with premium Assam tea leaves.',
    image: gingerTeaImg,
    badge: '1 Week Ago Hit',
    weekStatus: 'past_week',
    prepTime: '4 mins',
    tags: ['Spiced', 'Winter Warm', 'Herbal']
  },
  {
    id: 'hot-5',
    name: 'Honey Lemon Herbal Green Tea',
    category: 'hot',
    price: 40,
    originalPrice: 50,
    rating: 4.7,
    reviews: 130,
    description: 'Soothing organic green tea balanced with wild forest honey and fresh lemon squeeze.',
    image: honeyLemonImg,
    badge: 'Healthy Choice',
    weekStatus: 'current_week',
    prepTime: '3 mins',
    tags: ['Detox', 'Herbal', 'Vitamin C']
  },
  {
    id: 'hot-6',
    name: 'Classic Heritage Chai',
    category: 'hot',
    price: 20,
    originalPrice: 25,
    rating: 4.9,
    reviews: 580,
    description: 'The golden classic Indian roadside tea brewed with fresh spices and whole milk.',
    image: teaImg,
    badge: 'Evergreen',
    weekStatus: 'past_week',
    prepTime: '3 mins',
    tags: ['Chai', 'Classic', 'All Time']
  },
  {
    id: 'hot-7',
    name: 'Pure Highland Black Tea',
    category: 'hot',
    price: 25,
    originalPrice: 30,
    rating: 4.6,
    reviews: 95,
    description: 'Clear amber single-origin Nilgiri black tea with delicate floral notes.',
    image: blackTeaImg,
    badge: 'Low Calorie',
    weekStatus: 'past_week',
    prepTime: '3 mins',
    tags: ['Nilgiri', 'Aromatic', 'Clean']
  },
  {
    id: 'hot-8',
    name: 'Warm Rose Elixir Milk',
    category: 'hot',
    price: 45,
    originalPrice: 55,
    rating: 4.8,
    reviews: 140,
    description: 'Velvety warm milk scented with damask rose extract and subtle pistachio garnish.',
    image: roseMilkHotImg,
    badge: 'Sweet Comfort',
    weekStatus: 'current_week',
    prepTime: '4 mins',
    tags: ['Rose', 'Dessert Drink', 'Floral']
  },
  {
    id: 'hot-9',
    name: 'Farm Fresh Steamed Milk',
    category: 'hot',
    price: 25,
    originalPrice: 30,
    rating: 4.7,
    reviews: 80,
    description: 'Pure, organic unadulterated hot milk gently foamed to perfection.',
    image: hotMilkImg,
    badge: 'Pure & Simple',
    weekStatus: 'past_week',
    prepTime: '2 mins',
    tags: ['Kids Choice', 'Nutritious', 'Organic']
  },

  // Cold Coffee & Refreshers
  {
    id: 'cold-1',
    name: 'Signature Cold Milk Coffee',
    category: 'cold',
    price: 60,
    originalPrice: 75,
    rating: 5.0,
    reviews: 410,
    description: 'Slow-chilled espresso shaken with thick milk, vanilla syrup, and crushed ice.',
    image: coldCoffeeImg,
    badge: "Trending #1",
    weekStatus: 'current_week',
    prepTime: '4 mins',
    tags: ['Iced Latte', 'Cold Brew', 'Creamy']
  },
  {
    id: 'cold-2',
    name: 'Frosty Chocolate Frappuccino',
    category: 'cold',
    price: 85,
    originalPrice: 110,
    rating: 4.9,
    reviews: 360,
    description: 'Blended icy coffee with dark chocolate drizzle, whipped cream, and chocolate chips.',
    image: frappeImg,
    badge: '1 Week Ago Hit',
    weekStatus: 'past_week',
    prepTime: '6 mins',
    tags: ['Frappe', 'Chocolate', 'Indulgent']
  },
  {
    id: 'cold-3',
    name: 'Chilled Hibiscus Iced Tea',
    category: 'cold',
    price: 50,
    originalPrice: 65,
    rating: 4.8,
    reviews: 175,
    description: 'Crisp brewed tea poured over ice with fresh mint leaves and a slice of citrus.',
    image: icedTeaImg,
    badge: 'Summer Favorite',
    weekStatus: 'current_week',
    prepTime: '3 mins',
    tags: ['Mint', 'Crisp', 'Refreshing']
  },
  {
    id: 'cold-4',
    name: 'Royal Chilled Rose Milk',
    category: 'cold',
    price: 55,
    originalPrice: 70,
    rating: 4.9,
    reviews: 290,
    description: 'The nostalgic favorite: ice-cold fragrant rose milk with chia seeds (sabja) and nuts.',
    image: coldRoseMilkImg,
    badge: '1 Week Ago Hit',
    weekStatus: 'past_week',
    prepTime: '3 mins',
    tags: ['Rose Milk', 'Sabja', 'Cooling']
  },
  {
    id: 'cold-5',
    name: 'Zesty Cold Lime Juice',
    category: 'cold',
    price: 35,
    originalPrice: 45,
    rating: 4.8,
    reviews: 230,
    description: 'Freshly squeezed sun-ripened lemons with Himalayan pink salt, sugar, and mint.',
    image: limeJuiceImg,
    badge: 'Hydration Blast',
    weekStatus: 'current_week',
    prepTime: '2 mins',
    tags: ['Citrus', 'Electrolytes', 'Tangy']
  },
  {
    id: 'cold-6',
    name: 'South Special Spiced Buttermilk (Neer Mor)',
    category: 'cold',
    price: 30,
    originalPrice: 40,
    rating: 4.9,
    reviews: 310,
    description: 'Churned cooling yogurt tempered with mustard seeds, curry leaves, ginger, and green chillies.',
    image: buttermilkImg,
    badge: '1 Week Ago Hit',
    weekStatus: 'past_week',
    prepTime: '2 mins',
    tags: ['Probiotic', 'Spiced', 'Cooler']
  }
]
