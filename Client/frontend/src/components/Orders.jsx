import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  Plus,
} from "lucide-react";

const statusColors = {
  done: "success",
  pending: "warning",
  processing: "info",
  cancelled: "error",
};

const statusIcons = {
  done: CheckCircle,
  pending: Clock,
  processing: AlertCircle,
  cancelled: XCircle,
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/pharmacies/orders",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleEditOrder = (orderId) => {
    console.log(`Edit order: ${orderId}`);
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/pharmacies/orders/${orderId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchOrders();
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/pharmacies/orders/${orderId}/complete`,
        {
          quantities: quantities[orderId] || [],
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchOrders();
    } catch (error) {
      console.error("Error completing order:", error);
    }
  };

  const handleQuantityChange = (orderId, productId, value) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [orderId]: {
        ...prevQuantities[orderId],
        [productId]: parseInt(value, 10) || 0,
      },
    }));
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;
    const matchesSearch = order._id
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusIcon = (status) => {
    const Icon = statusIcons[status];
    return <Icon className="h-4 w-4" />;
  };

  const calculateTotal = (products) => {
    return products.reduce(
      (total, product) => total + (product.price || 0) * product.quantity,
      0
    );
  };

  return (
    <main className="w-full relative flex flex-col h-screen p-2 overflow-hidden bg-base-200 text-base-content">
    <div className="flex-1 p-6 space-y-6 overflow-y-scroll bg-base-200">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <div className="flex gap-2">
          <button className="btn btn-primary flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            New Order
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/60 h-5 w-5" />
          <input
            type="text"
            placeholder="Search orders..."
            className="input input-bordered w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="select select-bordered w-full md:w-48"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="done">Completed</option>
          <option value="pending">Pending</option>
    
        </select>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr className="hover">
                      <td>{order._id}</td>
                      <td>{order.date || "N/A"}</td>
                      <td>${calculateTotal(order.products).toFixed(2)}</td>
                      <td>
                        <div
                          className={`badge badge-${
                            statusColors[order.status]
                          } gap-1`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn btn-ghost btn-xs"
                          onClick={() =>
                            setExpandedOrder(
                              expandedOrder === order._id ? null : order._id
                            )
                          }
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              expandedOrder === order._id ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </td>
                    </tr>
                    {expandedOrder === order._id && (
                      <tr>
                        <td colSpan={5}>
                          <div className="p-4 bg-base-200">
                            <h4 className="font-semibold mb-2">Order Items</h4>
                            <table className="table table-sm">
                              <thead>
                                <tr>
                                  <th>Item</th>
                                  <th>Quantity</th>
                                  <th>Price</th>
                                  <th>Subtotal</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.products.map((product) => (
                                  <tr key={product._id}>
                                    <td>{product.name}</td>
                                    <td>
                                      {order.status === "pending" ? (
                                        <input
                                          type="number"
                                          min="0"
                                          className="input input-bordered input-xs w-16"
                                          value={
                                            quantities[order._id]?.[product._id] || 0
                                          }
                                          onChange={(e) =>
                                            handleQuantityChange(
                                              order._id,
                                              product._id,
                                              e.target.value
                                            )
                                          }
                                        />
                                      ) : (
                                        product.quantity
                                      )}
                                    </td>
                                    <td>${(product.price || 0).toFixed(2)}</td>
                                    <td>
                                      $
                                      {(
                                        (quantities[order._id]?.[product._id] || product.quantity) *
                                        (product.price || 0)
                                      ).toFixed(2)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            {order.status === "pending" && (
                              <button
                                className="btn btn-primary mt-4"
                                onClick={() => handleCompleteOrder(order._id)}
                              >
                                Complete Order
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>
      </main>
  );
}