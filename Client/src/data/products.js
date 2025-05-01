// data/products.js

const products = [
  // Electronics
  { Id: 1, name: "Laptop", Price: 1200, category: "Electronics" },
  { Id: 2, name: "Smartphone", Price: 800, category: "Electronics" },
  { Id: 3, name: "Headphones", Price: 150, category: "Electronics" },
  { Id: 4, name: "Keyboard", Price: 100, category: "Electronics" },

  // Fruits
  { Id: 5, name: "Apple", Price: 1, category: "Fruits" },
  { Id: 6, name: "Banana", Price: 1, category: "Fruits" },
  { Id: 7, name: "Orange", Price: 2, category: "Fruits" },
  { Id: 8, name: "Grapes", Price: 5, category: "Fruits" },

  // Clothes
  { Id: 9, name: "T-Shirt", Price: 20, category: "Clothes" },
  { Id: 10, name: "Jeans", Price: 40, category: "Clothes" },
  { Id: 11, name: "Jacket", Price: 60, category: "Clothes" },
  { Id: 12, name: "Sneakers", Price: 50, category: "Clothes" },

  // Groceries
  { Id: 13, name: "Rice (1kg)", Price: 2, category: "Groceries" },
  { Id: 14, name: "Sugar (1kg)", Price: 1.5, category: "Groceries" },
  { Id: 15, name: "Flour (1kg)", Price: 1, category: "Groceries" },
  { Id: 16, name: "Vegetable Oil (500ml)", Price: 3, category: "Groceries" },

  // Books
  { Id: 17, name: "Book: ReactJS GuIde", Price: 30, category: "Books" },
  { Id: 18, name: "Book: JavaScript Mastery", Price: 25, category: "Books" },

  // Furniture
  { Id: 19, name: "Sofa", Price: 400, category: "Furniture" },
  { Id: 20, name: "Dining Table", Price: 250, category: "Furniture" }
];

export const categories = [
  "Electronics",
  "Fruits",
  "Clothes",
  "Groceries",
  "Books",
  "Furniture"
];

export default products;
