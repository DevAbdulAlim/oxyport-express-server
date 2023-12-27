import { db } from "../src/config/database";


const users = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    password: "password123",
    role: "user",
    avatar: "avatar_url",
    bio: "Web developer passionate about coding",
    phone: "1234567890",
    birthDate: new Date("1990-01-01T00:00:00Z"),
    gender: "male",
    active: true,
    resetToken: null,
    resetTokenExpires: null,
    verifyToken: null,
    verifyTokenExpires: null,
  },
  // Add more users as needed
];

const addresses = [
  {
    city: "Dhaka",
    state: "Dhaka",
    postalCode: "1000",
    country: "Bangladesh",
    userId: 1, // Link to the user with ID 1
  },
  // Add more addresses as needed
];

const categories = [
  {
    name: "Electronics",
    description: "Gadgets and electronic devices",
  },
  // Add more categories as needed
];

const products = [
  {
    name: "Smartphone",
    description: "Latest smartphone model",
    price: 599.99,
    image: "phone_image_url",
    stock: 100,
    categoryId: 1, // Link to the category with ID 1
    userId: 1, // Link to the user with ID 1
  },
  // Add more products as needed
];

const reviews = [
  {
    text: "Great product!",
    rating: 5,
    productId: 1, // Link to the product with ID 1
  },
  // Add more reviews as needed
];

const carts = [
  {
    userId: 1, // Link to the user with ID 1
  },
  // Add more carts as needed
];

const cartItems = [
  {
    cartId: 1, // Link to the cart with ID 1
    productId: 1, // Link to the product with ID 1
    quantity: 2,
  },
  // Add more cart items as needed
];

const orders = [
  {
    userId: 1, // Link to the user with ID 1
    total: 120.5,
    status: "Pending",
    paymentMethod: "Credit Card",
    transactionId: "transaction123",
    deliveryDate: new Date("2023-01-10T12:00:00Z"),
  },
  // Add more orders as needed
];

const orderItems = [
  {
    orderId: 1, // Link to the order with ID 1
    productId: 1, // Link to the product with ID 1
    quantity: 1,
  },
  // Add more order items as needed
];

async function main() {
  try {
    // Assuming you have a Prisma instance named 'db' initialized

    // Seed users
    await Promise.all(users.map((user) => db.user.create({ data: user })));

    // Seed addresses
    await Promise.all(
      addresses.map((address) => db.address.create({ data: address }))
    );

    // Seed categories
    await Promise.all(
      categories.map((category) => db.category.create({ data: category }))
    );

    // Seed products
    await Promise.all(
      products.map((product) => db.product.create({ data: product }))
    );

    // Seed reviews
    await Promise.all(
      reviews.map((review) => db.review.create({ data: review }))
    );

    // Seed carts
    await Promise.all(carts.map((cart) => db.cart.create({ data: cart })));

    // Seed cart items
    await Promise.all(
      cartItems.map((cartItem) => db.cartItem.create({ data: cartItem }))
    );

    // Seed orders
    await Promise.all(orders.map((order) => db.order.create({ data: order })));

    // Seed order items
    await Promise.all(
      orderItems.map((orderItem) => db.orderItem.create({ data: orderItem }))
    );

    console.log("Seed data created successfully!");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    await db.$disconnect();
  }
}

main();
