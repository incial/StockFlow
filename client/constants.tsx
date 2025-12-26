
import { Outlet, Product, User, UserRole, StockEntry } from './types';

export const MOCK_OUTLETS: Outlet[] = [
  { id: 'ot-1', name: 'Downtown Central', location: '123 Main St' },
  { id: 'ot-2', name: 'Uptown Plaza', location: '456 North Ave' },
  { id: 'ot-3', name: 'East Side Hub', location: '789 East Blvd' },
];

export const MOCK_PRODUCTS: Product[] = [
  // Parle Agro
  { id: 'p1', brand: 'Parle Agro', name: 'Frooti Bottle 20', mrp: 20 },
  { id: 'p2', brand: 'Parle Agro', name: 'Appy fizz', mrp: 20 },
  { id: 'p3', brand: 'Parle Agro', name: 'B Fizz', mrp: 20 },
  { id: 'p4', brand: 'Parle Agro', name: 'Parle Smoodh Toffee Caramel', mrp: 20 },
  { id: 'p5', brand: 'Parle Agro', name: 'Parle Agro Smoodh Chocolate Mil', mrp: 20 },
  { id: 'p6', brand: 'Parle Agro', name: 'Smoodh choco hasel nut', mrp: 20 },
  { id: 'p7', brand: 'Parle Agro', name: 'Smoodh Lassi', mrp: 20 },

  // PepsiCo
  { id: 'p8', brand: 'PepsiCo- Beverages', name: 'Pepsi Pet bottle', mrp: 20 },
  { id: 'p9', brand: 'PepsiCo- Beverages', name: 'Tropicana', mrp: 20 },
  { id: 'p10', brand: 'PepsiCo- Beverages', name: 'Mountain Dew Can', mrp: 60 },
  { id: 'p11', brand: 'PepsiCo- Beverages', name: '7uP', mrp: 20 },

  // Cadbury
  { id: 'p12', brand: 'Cadbury', name: 'Perk (Rs 20)', mrp: 20 },
  { id: 'p13', brand: 'Cadbury', name: 'Cadbury Fuse', mrp: 50 },
  { id: 'p14', brand: 'Cadbury', name: 'Crispello Chocolate', mrp: 45 },
  { id: 'p15', brand: 'Cadbury', name: 'Five star oreo', mrp: 50 },
  { id: 'p16', brand: 'Cadbury', name: 'Oreo Biscuit', mrp: 30 },

  // Britannia
  { id: 'p17', brand: 'Britannia', name: 'Good Day Cashew', mrp: 25 },
  { id: 'p18', brand: 'Britannia', name: 'Good Day Choco', mrp: 30 },
  { id: 'p19', brand: 'Britannia', name: 'Cake Gobbles 15', mrp: 15 },
  { id: 'p20', brand: 'Britannia', name: 'Swiss Roll', mrp: 10 },
];

export const MOCK_USERS: User[] = [
  { id: 'u-1', name: 'Admin User', email: 'admin@system.com', role: UserRole.ADMIN },
  { id: 'u-2', name: 'John Refiller', email: 'john@system.com', role: UserRole.REFILLER, outletId: 'ot-1' },
];

export const INITIAL_STOCK_ENTRIES: StockEntry[] = [
  {
    id: 's-init-1',
    outletId: 'ot-1',
    productId: 'p1',
    quantity: 120,
    amount: 1920.58,
    entryDate: '2025-06-30',
    enteredBy: 'u-2',
    createdAt: new Date().toISOString()
  },
  {
    id: 's-init-2',
    outletId: 'ot-1',
    productId: 'p2',
    quantity: 120,
    amount: 1920.24,
    entryDate: '2025-06-30',
    enteredBy: 'u-2',
    createdAt: new Date().toISOString()
  },
  {
    id: 's-init-3',
    outletId: 'ot-1',
    productId: 'p8',
    quantity: 120,
    amount: 2040.16,
    entryDate: '2025-06-26',
    enteredBy: 'u-2',
    createdAt: new Date().toISOString()
  },
];
