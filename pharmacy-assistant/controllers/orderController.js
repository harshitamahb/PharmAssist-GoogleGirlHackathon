const Pharmacy = require("../models/Pharmacy");

const calculateTotalAmount = (products) => {
  let subtotal = 0;
  products.forEach((product) => {
    product.total = product.price * product.quantity;
    subtotal += product.total;
  });
  const gst = subtotal * 0.18; // Assuming 18% GST
  const totalAmount = subtotal + gst;
  return { subtotal, gst, totalAmount };
};

const generateReceipt = (order) => {
  let receipt = "Receipt\n";
  receipt += "---------------------------------\n";
  order.products.forEach((product) => {
    receipt += `${product.name} - ${product.quantity} x ${product.price} = ${product.total}\n`;
  });
  const { subtotal, gst, totalAmount } = calculateTotalAmount(order.products);
  receipt += "---------------------------------\n";
  receipt += `Subtotal: ${subtotal}\n`;
  receipt += `GST (18%): ${gst}\n`;
  receipt += `Total Amount: ${totalAmount}\n`;
  return receipt;
};

exports.placeOrder = async (req, res) => {
  const { medicines } = req.body;
  const pharmacyId = req.body.pharmacyId; // Get pharmacy ID from middleware

  try {
    const pharmacy = await Pharmacy.findById(pharmacyId);
    console.log(pharmacyId);
    if (!pharmacy) return res.status(404).json({ error: "Pharmacy not found" });

    // Fetch product details from inventory
    const orderProducts = medicines.map((product) => {
      const inventoryItem = pharmacy.inventory.find(
        (item) => item.name.toLowerCase() === product.name.toLowerCase()
      );
      if (inventoryItem) {
        return {
          name: inventoryItem.name,
          price: inventoryItem.price,
          quantity: 0, // Quantity will be set by the pharmacist later
        };
      } else {
        return {
          name: product.name,
          price: 0,
          quantity: 0,
          status: "Not Available",
        };
      }
    });

    const order = { products: orderProducts, status: "pending" };
    pharmacy.orders.push(order);
    await pharmacy.save();

    // Retrieve the newly created order's ID
    const newOrderId = pharmacy.orders[pharmacy.orders.length - 1]._id;

    res.status(201).json({
      message: "Order placed successfully",
      orderId: newOrderId, // Include the order ID in the response
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Error placing order" });
  }
};
exports.getOrderById = async (req, res) => {
  const { orderId } = req.params;
  const { pharmacyId } = req.query; // Get pharmacy ID from query parameters

  try {
    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) return res.status(404).json({ error: "Pharmacy not found" });

    const order = pharmacy.orders.id(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: "Error fetching order" });
  }
};

exports.completeOrder = async (req, res) => {
  const { orderId } = req.params;
  const { quantities } = req.body; // Quantities provided by the pharmacist
  const pharmacyId = req.pharmacyId; // Get pharmacy ID from middleware

  try {
    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) return res.status(404).json({ error: "Pharmacy not found" });

    const order = pharmacy.orders.id(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    // Update quantities and calculate totals
    order.products.forEach((product) => {
      if (product.status !== "Not Available") {
        // Use the product's _id to access the correct quantity from the quantities object
        const productId = product._id.toString();
        product.quantity = quantities[productId] || 0;
        product.total = product.price * product.quantity;
      }
    });

    order.status = "done";
    order.receipt = generateReceipt(order);
    await pharmacy.save();

    res.json({ message: "Order completed", order });
  } catch (error) {
    res.status(500).json({ error: "Error completing order" });
  }
};
exports.getOrders = async (req, res) => {
  const pharmacyId = req.pharmacyId; // Get pharmacy ID from middleware

  try {
    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) return res.status(404).json({ error: "Pharmacy not found" });

    res.json({ orders: pharmacy.orders });
  } catch (error) {
    res.status(500).json({ error: "Error fetching orders" });
  }
};
