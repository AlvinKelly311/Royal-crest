export interface Variant { label: string; price: number }
export interface CatalogItem { name: string; variants: Variant[] }

// Prices in GHS. Keep in sync with the frontend products file.
const YOGUR = [{ label: "Bottle", price: 12 }, { label: "Cup", price: 15 }];
const COCONUT_PLUS = [{ label: "Bottle", price: 15 }, { label: "Cup", price: 20 }];
const CHILL = [{ label: "Small bottle", price: 8 }];
const BOBA = [{ label: "Small", price: 30 }, { label: "Big", price: 50 }];
const BEV = [{ label: "Regular", price: 10 }];

export const CATALOG: Record<string, CatalogItem> = {
  // Crest Yogur
  y1: { name: "Mango Yogur", variants: YOGUR },
  y2: { name: "Pineapple Yogur", variants: YOGUR },
  y3: { name: "Coconut Plus+", variants: COCONUT_PLUS },
  y4: { name: "Strawberry Yogur", variants: YOGUR },
  y5: { name: "Banana Yogur", variants: YOGUR },
  y6: { name: "Vanilla Yogur", variants: YOGUR },

  // Crest Chills
  c1: { name: "Classic Ice Coffee", variants: CHILL },
  c2: { name: "Vanilla Ice Coffee", variants: CHILL },
  c3: { name: "Mocha Ice Coffee", variants: CHILL },
  c4: { name: "Caramel Coffee", variants: CHILL },
  c5: { name: "Chocolate Ice Coffee", variants: CHILL },
  m1: { name: "Vanilla Milk", variants: CHILL },
  m2: { name: "Strawberry Milk", variants: CHILL },
  m3: { name: "Banana Milk", variants: CHILL },
  m4: { name: "Chocolate Milk", variants: CHILL },
  m5: { name: "Chocolate Banana Milk", variants: CHILL },
  m6: { name: "Strawberry Banana Milk", variants: CHILL },

  // Crest Bubble Tea
  bt1: { name: "Classic Milk Tea", variants: BOBA },
  bt2: { name: "Brown Sugar Milk Tea", variants: BOBA },
  bt3: { name: "Strawberry Milk Tea", variants: BOBA },
  bt4: { name: "Taro Milk Tea", variants: BOBA },
  bt5: { name: "Matcha Milk Tea", variants: BOBA },
  bt6: { name: "Mango Milk Tea", variants: BOBA },
  bt7: { name: "Passion Fruit Tea", variants: BOBA },
  bt8: { name: "Coconut Milk Tea", variants: BOBA },

  // Crest Bev
  bv1: { name: "Sobólo (Hibiscus Drink)", variants: BEV },
  bv2: { name: "Lemonade", variants: BEV },
  bv3: { name: "Chocolate Iced Tea", variants: BEV },
  bv4: { name: "Zankom (Zomkom)", variants: BEV },
  bv5: { name: "Emudro (Biya)", variants: BEV },
  bv6: { name: "Asaana (Elewonyo)", variants: BEV },
};
