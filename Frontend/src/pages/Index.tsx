
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Camera, User, Shield, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-indigo-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">BodySim AI</h1>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-indigo-600 transition-colors">Home</Link>
              <Link to="/upload" className="text-gray-700 hover:text-indigo-600 transition-colors">Upload</Link>
              <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 transition-colors">Dashboard</Link>
              <Link to="/privacy" className="text-gray-700 hover:text-indigo-600 transition-colors">Privacy</Link>
            </div>
            <Link to="/login">
              <Button className="bg-indigo-600 hover:bg-indigo-700">Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Estimate Your Body Measurements
            <span className="block text-indigo-600">from a Photo</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Using advanced computer vision and AI, get accurate body measurements from simple photos. 
            Perfect for online shopping, fitness tracking, and health monitoring.
          </p>
          <div className="inline-flex items-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
            🚧 Coming Soon - Currently in Development
          </div>
          <Link to="/upload">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8 py-3">
              Try Demo <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Camera className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <CardTitle>Simple Photo Upload</CardTitle>
              <CardDescription>
                Just upload front and side photos of your body for accurate measurements
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <User className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <CardTitle>Precise Measurements</CardTitle>
              <CardDescription>
                Get detailed measurements including waist, chest, hips, and more using AI
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <CardTitle>Privacy First</CardTitle>
              <CardDescription>
                Your photos are processed securely and never stored permanently
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Upload Photos</h4>
              <p className="text-gray-600 text-sm">Take or upload front and side body photos</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">AI Analysis</h4>
              <p className="text-gray-600 text-sm">Our AI analyzes your body structure and proportions</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Generate Model</h4>
              <p className="text-gray-600 text-sm">Create a 3D body model for visualization</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">4</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Get Results</h4>
              <p className="text-gray-600 text-sm">Receive detailed measurements and insights</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <User className="h-6 w-6 mr-2" />
                <span className="text-xl font-bold">BodySim AI</span>
              </div>
              <p className="text-gray-400">
                Advanced body measurement estimation using computer vision and AI technology.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/upload" className="hover:text-white transition-colors">Upload Photos</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><span className="cursor-not-allowed">3D Viewer (Soon)</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><span className="cursor-not-allowed">Terms of Service</span></li>
                <li><span className="cursor-not-allowed">Contact Us</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Research</h4>
              <ul className="space-y-2 text-gray-400">
                <li><span className="cursor-not-allowed">Adversarial BodySim</span></li>
                <li><span className="cursor-not-allowed">Technical Papers</span></li>
                <li><span className="cursor-not-allowed">API Documentation</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400">
            <p>&copy; 2024 BodySim AI. All rights reserved. Inspired by Adversarial BodySim research.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
