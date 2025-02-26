import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Check, Upload, FileText, Clock } from "lucide-react";

export default function UploadPrescription() {
  const [searchParams] = useSearchParams();
  const pharmacyId = searchParams.get("pharmacistId");
  const pharmacistName = searchParams.get("pharmacistName");

  const [selectedImage, setSelectedImage] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [message, setMessage] = useState("");
  const [orderStatus, setOrderStatus] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      setMessage("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://ef5f-34-147-80-53.ngrok-free.app/extract_medicines",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMedicines(response.data.medicines);
      setMessage("Medicines extracted successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage("Failed to extract medicines.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendToBackend = async () => {
    if (medicines.length === 0) {
      setMessage("No medicines extracted to send.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/pharmacies/orders",
        { pharmacyId, medicines },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMessage("Order placed successfully!");
      setOrderId(response.data.orderId); // Save the order ID for status checking
      setOrderStatus("pending");
    } catch (error) {
      console.error("Error placing order:", error);
      setMessage("Failed to place order.");
    } finally {
      setIsLoading(false);
    }
  };
  const checkOrderStatus = async () => {
    if (!orderId) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/api/pharmacies/orders/${orderId}`,
        {
          params: { pharmacyId }, // Include pharmacyId as a query parameter
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setOrderStatus(response.data.order.status);
      if (response.data.order.status === "done") {
        setReceipt(response.data.order.receipt);
      }
    } catch (error) {
      console.error("Error checking order status:", error);
      setMessage("Failed to check order status.");
    }
  };

  useEffect(() => {
    let statusCheckInterval;
    if (orderId && orderStatus !== "done") {
      statusCheckInterval = setInterval(checkOrderStatus, 300);
    }
    return () => {
      if (statusCheckInterval) clearInterval(statusCheckInterval);
    };
  }, [orderId, orderStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6 md:p-12">
      <div className="max-w-4xl mx-auto bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl p-8 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Place Your Order
          </h2>
          <span className="text-gray-400">{pharmacistName}</span>
        </div>

        {message && (
          <div className="bg-green-500/20 text-green-400 p-4 rounded-lg flex items-center gap-2">
            <Check className="w-5 h-5" />
            {message}
          </div>
        )}

        <div className="group transition duration-300">
          <label className="block text-sm font-medium text-gray-200 mb-4">
            Upload Prescription
          </label>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center transition-colors duration-300 hover:border-green-500/50">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="prescription-upload"
            />
            <label htmlFor="prescription-upload" className="cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-400">
                Click to upload or drag and drop your prescription
              </p>
              {selectedImage && (
                <p className="mt-2 text-sm text-green-500">
                  {selectedImage.name}
                </p>
              )}
            </label>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleUpload}
              disabled={!selectedImage || isLoading}
              className="min-w-[200px] bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? "Processing..." : "Upload Prescription"}
            </button>
          </div>
        </div>

        {medicines.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Extracted Medicines
            </h3>
            <div className="grid gap-3">
              {medicines.map((medicine, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50"
                >
                  <span className="text-white">{medicine.name}</span>
                  <span className="text-gray-400">{medicine.dose}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSendToBackend}
                disabled={isLoading}
                className="min-w-[200px] bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        )}

        {orderStatus && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Order Status
            </h3>
            <div
              className={`p-4 rounded-lg ${
                orderStatus === "done" ? "bg-green-500/20" : "bg-gray-800/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-white">Status</span>
                <span
                  className={`font-medium ${
                    orderStatus === "done" ? "text-green-400" : "text-gray-400"
                  }`}
                >
                  {orderStatus === "done" ? "Completed" : "Processing"}
                </span>
              </div>
            </div>
          </div>
        )}

        {receipt && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Receipt</h3>
            <div className="bg-gray-800/50 p-6 rounded-lg">
              <pre className="font-mono text-sm text-gray-300">{receipt}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
