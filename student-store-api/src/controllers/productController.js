// controller file for product routes
// getting access to data through prisma
const prisma = require("../db/db");

// USING GET
// route for getting all products or
// route for getting only a specific catergory or sort or both
exports.getNeeded = async (req, res) => {
  const allowedSortFields = ["price", "name"];
  const category = req.query.category;
  const sort = req.query.sort;
  // in the future make it maybe not case sesetive
  const where = category ? { category } : undefined;
  const orderBy = allowedSortFields.includes(sort)
    ? { [sort]: "asc" }
    : undefined;

  const products = await prisma.product.findMany({
    where,
    orderBy,
  });

  if (products.length > 0) {
    res.json(products);
  } else {
    res.status(404).send("No matching products found");
  }
};

// route for getting a specific pet from an id
exports.getById = async (req, res) => {
  const id = Number(req.params.id); // number can be safer to use instead of parseInt
  // this doesnt throw an error if id is not valid, it just returns nothing, which is why we dont need a try and catch
  const product = await prisma.product.findUnique({ where: { id } });
  if (product) {
    res.json(product);
  } else {
    res.status(404).send("Product not found");
  }
};

// USING POST (creating)
// route for creating a single pet
exports.create = async (req, res) => {
  const { name, category, image_url, description, price } = req.body;
  if (!name || !category || !image_url || !description || price < 0) {
    // maybe also consider really long strings
    return res.status(400).send("Inputs not correct.");
  }
  const newProduct = await prisma.product.create({
    // pay attention to all the brackets needed
    data: {
      // no need for id, it automatically generates it
      name,
      category,
      image_url,
      description,
      price,
    },
  });
  if (newProduct) {
    res.status(201).json(newProduct);
  } else {
    res.status(404).send("Product not found");
  }
};

// USING PUT (updating)
exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, category, image_url, description, price } = req.body;
  try {
    const updatedPet = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        // prisma automatically ignores any fields not given to update, so dont worry
        name,
        category,
        image_url,
        description,
        price,
      },
    });
    res.status(200).json(updatedPet);
  } catch (error) {
    res.status(404).send("Product not found");
  }
};

// USING DELETE
exports.remove = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await prisma.product.delete({
      where: { id: Number(id) },
    });
    res.status(204).json(deletedProduct);
  } catch (error) {
    res.status(404).send("Product not found");
  }
  // res.status(204).send(); to not send anything
};
