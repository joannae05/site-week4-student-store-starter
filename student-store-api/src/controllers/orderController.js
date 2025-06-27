// controller file for order routes
// getting access to data through prisma
const prisma = require("../db/db");

// USING GET
// route for getting all orders
exports.getAll = async (req, res) => {
  const orders = await prisma.order.findMany({
    include: {
      items: true,
    },
  }); // our prisma client instance. model. all rows applicable
  res.json(orders);
};

// route for getting a specific pet from an id
exports.getById = async (req, res) => {
  const order_id = Number(req.params.id); // number can be safer to use instead of parseInt
  // this doesnt throw an error if id is not valid, it just returns nothing, which is why we dont need a try and catch
  const order = await prisma.order.findUnique({
    where: { order_id },
    include: {
      items: true,
    },
  });
  if (order) {
    res.json(order);
  } else {
    res.status(404).send("Order not found");
  }
};

// USING POST (creating)
// route for creating a single pet
exports.create = async (req, res) => {
  const { customer_id, total_price, status, items } = req.body;
  if (!customer_id || !status || total_price < 0 || !Array.isArray(items)) {
    // maybe also consider really long strings
    return res.status(400).send("Inputs not correct.");
  }
  const newOrder = await prisma.order.create({
    // pay attention to all the brackets needed
    data: {
      // no need for id, it automatically generates it
      customer_id,
      total_price,
      status,
      items: {
        create: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
  });
  if (newOrder) {
    res.status(201).json(newOrder);
  } else {
    res.status(404).send("Order not found");
  }
};

// USING PUT (updating)
exports.update = async (req, res) => {
  const order_id = Number(req.params.id);
  const { customer_id, total_price, status, items } = req.body;
  try {
    const updatedOrder = await prisma.order.update({
      where: { order_id: order_id },
      data: {
        // prisma automatically ignores any fields not given to update, so dont worry
        customer_id,
        total_price,
        status,
        items: {
          create: items.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(404).send("Order not found");
  }
};

// USING DELETE
exports.remove = async (req, res) => {
  const order_id = Number(req.params.id);
  try {
    const deletedOrder = await prisma.order.delete({
      where: { order_id: order_id },
    });
    res.status(204).json(deletedOrder);
  } catch (error) {
    res.status(404).send("Product not found");
  }
  // res.status(204).send(); to not send anything
};
