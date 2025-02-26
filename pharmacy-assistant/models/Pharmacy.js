const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  products: [{ name: String, quantity: Number,price:Number }],
  status: { type: String, enum: ["pending", "done"], default: "pending" },
  receipt: { type: String },
});

const PharmacySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  inventory: [{ name: String, price: Number, quantity: Number, dose:String}],
  orders: [OrderSchema],
});

module.exports = mongoose.model("Pharmacy", PharmacySchema);
