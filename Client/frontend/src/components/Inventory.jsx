import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Filter, Plus } from "lucide-react";
import medicines from "../assets/data.json"; // Import the JSON dataset

export default function Inventory() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newItem, setNewItem] = useState({
    name: "",
    dose: "",
    stock: "",
    price: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchInventory = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/pharmacies/inventory",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setInventoryItems(response.data.inventory);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [token]);

  const handleAddOrUpdateItem = async () => {
    try {
      if (editingItemId) {
        // Update existing item
        await axios.patch(
          `http://localhost:5000/api/pharmacies/inventory/${editingItemId}`,
          newItem,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        // Add new item
        await axios.post(
          "http://localhost:5000/api/pharmacies/inventory",
          newItem,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      fetchInventory();
      setShowAddForm(false);
      setNewItem({ name: "", stock: 0, price: 0, dose: "" });
      setEditingItemId(null);
    } catch (error) {
      console.error("Error adding/updating inventory item:", error);
    }
  };

  const handleEditClick = (item) => {
    setNewItem(item);
    setEditingItemId(item._id);
    setShowAddForm(true);
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setNewItem({ ...newItem, name: value });

    if (value.length > 0) {
      const filteredSuggestions = medicines.filter((medicine) =>
        medicine.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setNewItem({ ...newItem, name: suggestion.name, dose: suggestion.dose });
    setSuggestions([]);
  };

  const filteredItems = inventoryItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 p-6 bg-base-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Inventory Management</h2>
        <button
          className="btn btn-primary flex items-center"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingItemId(null);
            setNewItem({ name: "", stock: 0, price: 0, dose: "" });
          }}
        >
          <Plus className="h-5 w-5 mr-2" />
          {editingItemId ? "Edit Item" : "Add New Item"}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Product Name"
            value={newItem.name}
            onChange={handleNameChange}
            className="input input-bordered w-full mb-2"
          />
          {suggestions.length > 0 && (
            <ul className="menu bg-base-100 border border-base-300 rounded-md shadow-md mt-2">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="p-2 cursor-pointer hover:bg-base-200"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.name}
                </li>
              ))}
            </ul>
          )}
          <input
            type="number"
            placeholder="Stock"
            value={newItem.stock}
            onChange={(e) =>
              setNewItem({ ...newItem, stock: parseInt(e.target.value) })
            }
            className="input input-bordered w-full mb-2"
          />
          <input
            type="number"
            placeholder="Price"
            value={newItem.price}
            onChange={(e) =>
              setNewItem({ ...newItem, price: parseFloat(e.target.value) })
            }
            className="input input-bordered w-full mb-2"
          />
          <button
            className="btn btn-success w-full"
            onClick={handleAddOrUpdateItem}
          >
            {editingItemId ? "Update Item" : "Save Item"}
          </button>
        </div>
      )}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/60 h-5 w-5" />
          <input
            type="text"
            placeholder="Search inventory..."
            className="input input-bordered w-full pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="btn btn-outline flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filter
        </button>
      </div>

      <div className="card bg-base-100 shadow-xl overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover">
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>
                  <span
                    className={`badge ${
                      item.stock > 1000 ? "badge-success" : "badge-warning"
                    }`}
                  >
                    {item.stock > 1000 ? "In Stock" : "Low Stock"}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => handleEditClick(item)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
