// controller file for order item routes
// getting access to data through prisma
const prisma = require("../db/db");

// USING GET
// route for getting all products
exports.getAll = async (req, res) => {
  const items = await prisma.orderItems.findMany();
  res.json(items);
};

// USING POST (creating)
// route for creating a single order item
exports.create = async (req, res) => {
  const order_id = Number(req.params.id);
  const { product_id, quantity, price } = req.body;
  if (!order_id || !product_id || quantity <= 0 || price < 0) {
    // maybe also consider really long strings
    return res.status(400).send("Inputs not correct.");
  }

  const existingItem = await prisma.orderItem.findFirst({
    where: {
      order_id,
      product_id,
    },
  });

  let newItem;

  if (existingItem) {
    // Update quantity by adding the new amount
    newItem = await prisma.orderItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + quantity,
      },
    });
  } else {
    // Create new order item
    newItem = await prisma.orderItem.create({
      data: {
        order_id,
        product_id,
        quantity,
        price,
      },
    });
  }
  if (newItem) {
    res.status(201).json(newItem);
  } else {
    res.status(404).send("Order not found");
  }
};

exports.getOrderTotal = async (req, res) => {
  const id = Number(req.params.id);

  const order = await prisma.order.findUnique({
    where: { order_id: id },
    include: { items: true }, // include order items
  });
  if (!order) {
    return res.status(404).send("Order not found");
  }

  const total = order.items.reduce((acc, item) => {
    return acc + item.price * parseInt(item.quantity);
  }, 0);

  res.json({ order_id: id, total_price: total });
};
