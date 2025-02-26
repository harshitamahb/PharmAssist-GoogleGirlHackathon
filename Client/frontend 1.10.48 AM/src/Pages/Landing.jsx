import { useEffect, useState } from "react";
import axios from "axios";
import { Pill, Shield, Clock, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

function App({ setLogin, isAuth }) {
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate("/dashboard");
    }
    if (isAuth) {
      navigate("/dashboard");
    }
  },[]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message

    try {
      if (isSignUp) {
        // Sign-up API call
        const response = await axios.post(
          "http://localhost:5000/api/register",
          {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }
        );
        console.log(response.data.message);
        console.log("Token:", response.data.token);
        localStorage.setItem("token", response.data.token);
        setLogin(true);
        navigate("/dashboard");
      } else {
        // Sign-in API call
        const response = await axios.post("http://localhost:5000/api/login", {
          email: formData.email,
          password: formData.password,
        });
        console.log("Token:", response.data.token);
        localStorage.setItem("token", response.data.token);
        setLogin(true);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
    }
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setFormData({ name: "", email: "", password: "" });
    setError("");
  };

  return (
    <div
      className={`min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white relative overflow-hidden transition-colors duration-300`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/2 -right-4 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Navigation */}
      <nav className="relative border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Pill className="h-6 w-6 text-teal-500 animate-pulse" />
            <span className="text-xl font-bold">PharmaAssist</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/medications")}
              className="text-sm font-medium hover:text-teal-500 transition-colors duration-200"
            >
              Medications
            </button>
            <button
              onClick={() => navigate("/prescriptions")}
              className="text-sm font-medium hover:text-teal-500 transition-colors duration-200"
            >
              Prescriptions
            </button>
            <button
              onClick={() => navigate("/drug-info")}
              className="text-sm font-medium hover:text-teal-500 transition-colors duration-200"
            >
              Drug Information
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 relative">
        {!showChat ? (
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16 space-y-8">
              <div className="inline-block animate-fade-in">
                <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-500 text-sm font-medium">
                  AI-Powered Pharmacy Assistant
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
                Your Personal Pharmacy Assistant
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 animate-fade-in">
                Manage prescriptions, get medication reminders, and access drug
                information with our AI-powered pharmacy assistant.
              </p>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto animate-fade-in">
                <div className="flex flex-col items-center p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <Shield className="h-8 w-8 text-teal-500 mb-2" />
                  <h3 className="font-semibold">Secure & Private</h3>
                </div>
                <div className="flex flex-col items-center p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <Clock className="h-8 w-8 text-teal-500 mb-2" />
                  <h3 className="font-semibold">Medication Reminders</h3>
                </div>
                <div className="flex flex-col items-center p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <Search className="h-8 w-8 text-teal-500 mb-2" />
                  <h3 className="font-semibold">Drug Information</h3>
                </div>
              </div>
            </div>

            {/* Sign Up / Sign In Form Section */}
            <div className="max-w-md mx-auto p-8 rounded-xl bg-white dark:bg-gray-800 shadow-lg animate-fade-in">
              <form onSubmit={handleSubmit} className="space-y-6">
                {isSignUp && (
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium">
                      Pharmacy Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Med Easy"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required={isSignUp}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent transition-shadow duration-200"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent transition-shadow duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="******"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent transition-shadow duration-200"
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-white bg-teal-500 hover:bg-teal-600 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                  {isSignUp ? "Sign Up" : "Sign In"}
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={toggleForm}
                    className="text-sm text-teal-500 hover:underline transition duration-200"
                  >
                    {isSignUp
                      ? "Already have an account? Sign In"
                      : "Don't have an account? Sign Up"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="p-8 rounded-xl bg-white dark:bg-gray-800 shadow-lg">
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-2">Pharmacy Chat</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Welcome {formData.name}! How can I assist you with your
                  medications today?
                </p>
              </div>
              <div className="h-[400px] border border-gray-200 dark:border-gray-700 rounded-lg mb-4 p-4 overflow-y-auto">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-2 max-w-[80%]">
                  Hello! I'm your AI pharmacy assistant. How can I help you
                  today?
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent transition-shadow duration-200"
                />
                <button className="px-6 py-2 text-white bg-teal-500 hover:bg-teal-600 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
