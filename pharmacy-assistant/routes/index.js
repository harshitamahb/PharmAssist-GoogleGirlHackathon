const express = require("express");
const authController = require("../controllers/authController");
const orderController = require("../controllers/orderController");
const inventoryController = require("../controllers/inventoryController");
const router = express.Router();
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from header
  if (!token) return res.status(403).json({ error: "No token provided" });

  jwt.verify(token, "your_jwt_secret", (err, decoded) => {
    if (err)
      return res.status(500).json({ error: "Failed to authenticate token" });
    console.log(decoded);
    req.pharmacyId = decoded.id; // Assuming the token payload contains the pharmacy ID as 'id'
    next();
  });
};

// Authentication routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/pharmacist", verifyToken, authController.getPharmacist);
// Order routes 
router.post("/pharmacies/orders", orderController.placeOrder);
router.get("/pharmacies/orders/:orderId", orderController.getOrderById);
router.patch(
  "/pharmacies/orders/:orderId/complete",
  [verifyToken],
  orderController.completeOrder
);
router.get("/pharmacies/orders", verifyToken, orderController.getOrders);
// Inventory routes
router.post(
  "/pharmacies/inventory",
  [verifyToken],
  inventoryController.addInventoryItem
);
router.patch(
  "/pharmacies/inventory/:itemId",
  [verifyToken],
  inventoryController.updateInventoryItem
);
router.get(
  "/pharmacies/inventory",
  [verifyToken],
  inventoryController.getInventory
);
module.exports = router;
