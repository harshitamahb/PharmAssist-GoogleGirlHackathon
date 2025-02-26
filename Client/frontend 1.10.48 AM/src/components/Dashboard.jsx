import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { DollarSign, ShoppingCart, Package, Users } from "lucide-react";

const salesData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 4500 },
  { name: "May", sales: 6000 },
  { name: "Jun", sales: 5500 },
];

const categoryData = [
  { name: "Antibiotics", value: 400 },
  { name: "Pain Relief", value: 300 },
  { name: "Vitamins", value: 300 },
  { name: "Cardiac", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6 bg-base-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base-content/60">Total Sales</p>
                <h3 className="text-2xl font-bold">$24,780</h3>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-4">
              <span className="text-success">+12.5%</span>
              <span className="text-base-content/60"> from last month</span>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base-content/60">Total Orders</p>
                <h3 className="text-2xl font-bold">1,482</h3>
              </div>
              <ShoppingCart className="h-8 w-8 text-secondary" />
            </div>
            <div className="mt-4">
              <span className="text-success">+8.2%</span>
              <span className="text-base-content/60"> from last month</span>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base-content/60">Inventory Items</p>
                <h3 className="text-2xl font-bold">847</h3>
              </div>
              <Package className="h-8 w-8 text-accent" />
            </div>
            <div className="mt-4">
              <span className="text-error">-2.4%</span>
              <span className="text-base-content/60"> from last month</span>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base-content/60">Active Customers</p>
                <h3 className="text-2xl font-bold">3,642</h3>
              </div>
              <Users className="h-8 w-8 text-warning" />
            </div>
            <div className="mt-4">
              <span className="text-success">+5.7%</span>
              <span className="text-base-content/60"> from last month</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="text-xl font-semibold mb-4">Sales Overview</h3>
            <LineChart width={500} height={300} data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#0088FE" />
            </LineChart>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="text-xl font-semibold mb-4">
              Category Distribution
            </h3>
            <PieChart width={500} height={300}>
              <Pie
                data={categoryData}
                cx={250}
                cy={150}
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
} 
