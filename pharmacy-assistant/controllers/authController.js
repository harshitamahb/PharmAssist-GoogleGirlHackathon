const Pharmacy = require("../models/Pharmacy");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new pharmacy instance
    const pharmacy = new Pharmacy({ name, email, password: hashedPassword });

    // Save the pharmacy to the database
    await pharmacy.save();

    // Generate a JWT token
    const token = jwt.sign({ id: pharmacy._id }, "your_jwt_secret", {
      expiresIn: "1h",
    });

    // Respond with a success message and the token
    res
      .status(201)
      .json({ message: "Pharmacy registered successfully", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error registering pharmacy" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the pharmacy by email
    const pharmacy = await Pharmacy.findOne({ email });
    if (!pharmacy) return res.status(404).json({ error: "Pharmacy not found" });

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, pharmacy.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Generate a JWT token
    const token = jwt.sign({ id: pharmacy._id }, "your_jwt_secret", {
      expiresIn: "1h",
    });

    // Respond with the token
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
};
exports.getPharmacist = async (req, res) => {
  const pharmacistId = req.pharmacyId;
  console.log(pharmacistId);
  try {
    const pharmacist = await Pharmacy.findById(pharmacistId);
    if (!pharmacist) {
      return res.status(404).json({ error: "Pharmacist not found" });
    }
    res.json(pharmacist);
  } catch (error) {
    res.status(500).json({ error: "Error fetching pharmacist details" });
  }
};
