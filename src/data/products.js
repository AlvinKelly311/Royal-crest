// Prices are in GHS, from the client's review.
// Every product has `variants` (size or pack) and each variant has its own price. Photos are in /public/products.
// `price` is filled in automatically with the lowest variant price, so it is never typed twice.

export const CATEGORIES = [
  { id: "yogur", name: "Crest Yogur", blurb: "Where Freshness Meets Excellent Taste" },
  { id: "oven", name: "Crest Oven and Bites", blurb: "Freshly baked, perfectly made.", comingSoon: true },
  { id: "chills", name: "Crest Chills", blurb: "Cold, bold and smooth." },
  { id: "boba", name: "Crest Bubble Tea", blurb: "Chewy pearls, cold teas." },
  { id: "bev", name: "Crest Bev", blurb: "Authentic Ghanaian beverages." },
];

// fills in `price` from the cheapest variant
const make = (p) => ({ ...p, price: Math.min(...p.variants.map((v) => v.price)) });

// price sets used by many products
const YOGUR = [{ label: "Bottle", price: 12 }, { label: "Cup", price: 15 }];
const COCONUT_PLUS = [{ label: "Bottle", price: 15 }, { label: "Cup", price: 20 }];
const CHILL = [{ label: "Small bottle", price: 8 }];
const BOBA = [{ label: "Small", price: 30 }, { label: "Big", price: 50 }];
const BEV = [{ label: "Regular", price: 10 }];

export const PRODUCTS = [
  // ---------- Crest Yogur ----------
  make({ id: "y1", category: "yogur", name: "Mango Yogur", desc: "Creamy yogurt with real mango.", available: true, image: "/products/mangoyur.jpg", variants: YOGUR }),
  make({ id: "y2", category: "yogur", name: "Pineapple Yogur", desc: "Smooth yogurt with sweet pineapple.", available: true, image: "/products/pineapple.jpg", variants: YOGUR }),
  make({ id: "y3", category: "yogur", name: "Coconut Plus+", desc: "Creamy coconut yogurt loaded with real coconut flakes.", available: true, image: "/products/coconut.jpg", variants: COCONUT_PLUS }),
  make({ id: "y4", category: "yogur", name: "Strawberry Yogur", desc: "Smooth yogurt with real strawberry.", available: true, image: "/products/strawberry.jpg", variants: YOGUR }),
  make({ id: "y5", category: "yogur", name: "Banana Yogur", desc: "Thick, creamy and lightly sweet.", available: true, image: "/products/Banana.jpg", variants: YOGUR }),
  make({ id: "y6", category: "yogur", name: "Vanilla Yogur", desc: "Classic smooth vanilla.", available: true, image: "/products/Vanila.jpg", variants: YOGUR }),

  // ---------- Crest Chills (coffee and milk collections, small bottle) ----------
  make({ id: "c1", category: "chills", name: "Classic Ice Coffee", desc: "Pure coffee perfection. Bold, smooth and refreshing.", available: true, image: "/products/classic ice coffee.jpg", variants: CHILL }),
  make({ id: "c2", category: "chills", name: "Vanilla Ice Coffee", desc: "Delightfully smooth with a sweet vanilla twist.", available: true, image: "/products/vanilaice.jpg", variants: CHILL }),
  make({ id: "c3", category: "chills", name: "Mocha Ice Coffee", desc: "Rich coffee blended with real chocolate for the ultimate treat.", available: true, image: "/products/mocha.jpg", variants: CHILL }),
  make({ id: "c4", category: "chills", name: "Caramel Coffee", desc: "Indulgent caramel meets smooth coffee.", available: true, image: "/products/caramelcoffee.jpg", variants: CHILL }),
  make({ id: "c5", category: "chills", name: "Chocolate Ice Coffee", desc: "Deep, rich chocolate blended with bold coffee. Pure indulgence.", available: true, image: "/products/chocolatecoffee.jpg", variants: CHILL }),
  make({ id: "m1", category: "chills", name: "Vanilla Milk", desc: "Smooth vanilla goodness. Simply delightful.", available: true, image: "/products/Vanilamilk.jpg", variants: CHILL }),
  make({ id: "m2", category: "chills", name: "Strawberry Milk", desc: "Fruity, creamy and perfectly refreshing.", available: true, image: "/products/strawberrymilk.jpg", variants: CHILL }),
  make({ id: "m3", category: "chills", name: "Banana Milk", desc: "Sweet banana blended with creamy milk.", available: true, image: "/products/Bananamilk.jpg", variants: CHILL }),
  make({ id: "m4", category: "chills", name: "Chocolate Milk", desc: "Rich chocolate indulgence in every sip.", available: true, image: "/products/chocolatemilk.jpg", variants: CHILL }),
  make({ id: "m5", category: "chills", name: "Chocolate Banana Milk", desc: "Chocolate meets banana for the perfect blend.", available: true, image: "/products/chocolatebanana.jpg", variants: CHILL }),
  make({ id: "m6", category: "chills", name: "Strawberry Banana Milk", desc: "A fruity duo bursting with creamy flavor.", available: true, image: "/products/strawberrybanana.jpg", variants: CHILL }),

  // ---------- Crest Bubble Tea (small 30, big 50) ----------
  make({ id: "bt1", category: "boba", name: "Classic Milk Tea", desc: "Timeless flavor you'll love.", available: true, image: "/products/classic.jpg", variants: BOBA }),
  make({ id: "bt2", category: "boba", name: "Brown Sugar Milk Tea", desc: "Rich. Caramel. Satisfying.", available: true, image: "/products/brownsugar.jpg", variants: BOBA }),
  make({ id: "bt3", category: "boba", name: "Strawberry Milk Tea", desc: "Sweet, fruity and oh-so-smooth.", available: true, image: "/products/strawberrymilktea.jpg", variants: BOBA }),
  make({ id: "bt4", category: "boba", name: "Taro Milk Tea", desc: "Creamy, dreamy and unique.", available: true, image: "/products/taro.jpg", variants: BOBA }),
  make({ id: "bt5", category: "boba", name: "Matcha Milk Tea", desc: "Earthy, smooth and refreshing.", available: true, image: "/products/matcha.jpg", variants: BOBA }),
  make({ id: "bt6", category: "boba", name: "Mango Milk Tea", desc: "Tropical mango burst!", available: true, image: "/products/mango.jpg", variants: BOBA }),
  make({ id: "bt7", category: "boba", name: "Passion Fruit Tea", desc: "Zesty, fruity and full of life.", available: true, image: "/products/passion.jpg", variants: BOBA }),
  make({ id: "bt8", category: "boba", name: "Coconut Milk Tea", desc: "Tropical vibes in every sip.", available: true, image: "/products/coconutmilktea].jpg", variants: BOBA }),

  // ---------- Crest Bev (10 cedis) ----------
  make({ id: "bv1", category: "bev", name: "Sobólo (Hibiscus Drink)", desc: "A refreshing blend of hibiscus, ginger, cloves, pineapple and orange. Bold. Natural. Timeless.", available: true, image: "/products/sobolo.jpg", variants: BEV }),
  make({ id: "bv2", category: "bev", name: "Lemonade", desc: "Zesty and refreshing lemon drink, perfectly chilled for a burst of citrus goodness.", available: true, image: "/products/lemondae.jpg", variants: BEV }),
  make({ id: "bv3", category: "bev", name: "Chocolate Iced Tea", desc: "Smooth black tea infused with rich chocolate flavor. Cool. Bold. Indulgent.", available: true, image: "/products/chocolate.jpg", variants: BEV }),
  make({ id: "bv4", category: "bev", name: "Zankom (Zomkom)", desc: "A traditional millet drink with ginger, cloves, pepper and a touch of sweetness. Hearty. Spicy. Nourishing.", available: true, image: "/products/zankom.jpg", variants: BEV }),
  make({ id: "bv5", category: "bev", name: "Emudro (Biya)", desc: "A zesty ginger drink with tamarind and natural spices. Refreshing and revitalizing.", available: true, image: "/products/emudo.jpg", variants: BEV }),
  make({ id: "bv6", category: "bev", name: "Asaana (Elewonyo)", desc: "Caramelized sweetness with a hint of tang, topped with milk. A true Ghanaian classic.", available: true, image: "/products/asanaa.jpg", variants: BEV }),
];

// ---------- Crest Oven and Bites: COMING SOON ----------
// Kept out of PRODUCTS so the shop shows "Coming soon" with no prices.
// When baking starts: give each item `variants` with real prices, wrap it in make({...}), move it into PRODUCTS above,
// and delete `comingSoon: true` from the Oven category.
export const OVEN_AND_BITES_LATER = [
  { id: "o1", category: "oven", name: "Cakes", desc: "Soft, fresh layer cakes.", image: "/products/cake.jpg" },
  { id: "o2", category: "oven", name: "Cupcakes", desc: "Buttercream-topped and sweet.", image: "/products/cupcake.jpg" },
  { id: "o3", category: "oven", name: "Cookies", desc: "Soft centers, golden edges.", image: "/products/cookies.jpg" },
  { id: "o4", category: "oven", name: "Breads", desc: "Golden, crusty and fresh.", image: "/products/bread.jpg" },
  { id: "o5", category: "oven", name: "Pastries", desc: "Flaky, buttery and still warm.", image: "/products/pastries.jpg" },
  { id: "o6", category: "oven", name: "Desserts", desc: "Sweet treats for every moment.", image: "/products/deserts.jpg" },
  { id: "o7", category: "oven", name: "Savory Bites", desc: "Meat pies, sausage rolls and more.", image: "/products/savory.jpg" },
];