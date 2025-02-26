const Pharmacy = require("../models/Pharmacy");

exports.addInventoryItem = async (req, res) => {
  const { name, price, stock, dose } = req.body;
  const pharmacyId = req.pharmacyId; // Get pharmacy ID from middleware

  try {
    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) return res.status(404).json({ error: "Pharmacy not found" });

    // Check if an item with the same name and dose already exists
    const existingItem = pharmacy.inventory.find(
      (item) =>
        item.name.toLocaleLowerCase() === name.toLocaleLowerCase() &&
        item.dose == dose
    );

    if (existingItem) {
      // If the item exists, increase its quantity
      existingItem.quantity += stock;
      existingItem.price = (existingItem.price > price ? existingItem.price : price);
    } else {
      // If the item does not exist, add it as a new item
      const newItem = { name, price, quantity: stock, dose };

      pharmacy.inventory.push(newItem);
    }

    await pharmacy.save();

    res.status(201).json({
      message: "Inventory item added successfully",
      inventory: pharmacy.inventory,
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding inventory item" });
  }
};
exports.updateInventoryItem = async (req, res) => {
  const { itemId } = req.params;
  const { name, price, stock, dose } = req.body;
  const pharmacyId = req.pharmacyId; // Get pharmacy ID from middleware

  try {
    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) return res.status(404).json({ error: "Pharmacy not found" });

    const item = pharmacy.inventory.id(itemId);
    if (!item)
      return res.status(404).json({ error: "Inventory item not found" });

    item.name = name || item.name;
    item.price = price || item.price;
    item.quantity = stock || item.quantity;
    item.dose = dose || item.dose;
    await pharmacy.save();

    res.json({
      message: "Inventory item updated successfully",
      inventory: pharmacy.inventory,
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating inventory item" });
  }
};

exports.getInventory = async (req, res) => {
  const pharmacyId = req.pharmacyId; // Get pharmacy ID from middleware

  try {
    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) return res.status(404).json({ error: "Pharmacy not found" });

    res.json({ inventory: pharmacy.inventory });
  } catch (error) {
    res.status(500).json({ error: "Error retrieving inventory" });
  }
};
