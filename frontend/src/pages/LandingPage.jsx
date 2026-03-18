import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Zap,
  ShieldCheck,
  History,
  ArrowRight,
  LogIn,
  Layers
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-800">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 border-b bg-white">
        <h1 className="text-2xl font-bold text-blue-700 tracking-tight">
          SmartWiki
        </h1>

        <div className="flex items-center gap-6">
          <button className="text-gray-600 hover:text-blue-700">
            Features
          </button>
          <button className="text-gray-600 hover:text-blue-700">
            About
          </button>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-700 text-white px-5 py-2 rounded-lg font-medium"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="py-24 px-6 text-center max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
          Smarter Documentation.
          <br />
          <span className="text-blue-700">Built for Every User.</span>
        </h1>

        <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Deliver personalized, feature-aware documentation that adapts
          automatically based on user access — reducing confusion and improving
          productivity.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate("/register")}
            className="bg-blue-700 text-white px-8 py-3 rounded-lg font-medium flex items-center justify-center gap-2 shadow-sm"
          >
            Get Started
            <ArrowRight size={18} />
          </button>

          <button
            onClick={() => navigate("/login")}
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
          >
            Sign In
            <LogIn size={18} />
          </button>
        </div>
      </header>

      {/* Features Section */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-semibold text-gray-900">
            Core Features
          </h2>
          <p className="text-gray-600 mt-3">
            Everything you need for intelligent documentation
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {/* Feature Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-700 rounded-lg mb-5">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Feature-Based Access
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Show only relevant documentation based on user feature access.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-700 rounded-lg mb-5">
              <Zap size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Dynamic Filtering
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Real-time filtering ensures users always see accurate content.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-700 rounded-lg mb-5">
              <History size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Version Control
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Track updates and maintain consistent, up-to-date documentation.
            </p>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto bg-blue-700 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-semibold mb-4">
            Ready to simplify your documentation?
          </h2>
          <p className="mb-6 text-blue-100">
            Deliver personalized, clean, and efficient documentation experiences.
          </p>

          <button
            onClick={() => navigate("/register")}
            className="bg-white text-blue-700 px-6 py-3 rounded-lg font-medium"
          >
            Start Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Layers className="text-blue-700" size={18} />
          <span className="font-semibold text-gray-800">
            SmartWiki
          </span>
        </div>

        <p className="text-gray-500 text-sm">
          © 2026 SmartWiki. All rights reserved.
        </p>
      </footer>

    </div>
  );
}