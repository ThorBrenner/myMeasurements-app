import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "react-router-dom";
import { User, ArrowLeft, Download, Share } from "lucide-react";
import { MeasurementDisplay } from "@/components/MeasurementDisplay";
import { BodyViewer3D } from "@/components/BodyViewer3D";

const Dashboard = () => {
  const { state } = useLocation();
  const measurements = state?.measurements;

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
              <Link to="/history" className="text-gray-700 hover:text-indigo-600 transition-colors">History</Link>
              <Link to="/privacy" className="text-gray-700 hover:text-indigo-600 transition-colors">Privacy</Link>
            </div>
            <Link to="/upload">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                New Analysis
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Body Analysis</h2>
            <p className="text-gray-600">AI-generated measurements from your uploaded photos</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Measurements Panel */}
        <div className="mt-12">
            <MeasurementDisplay measurements={measurements} />
        </div>

        {/* Additional Information */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Details</CardTitle>
              <CardDescription>Information about your body analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Analysis Date:</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Time:</span>
                  <span className="font-medium">2.3 seconds</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Accuracy Score:</span>
                  <span className="font-medium text-green-600">94.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Model Version:</span>
                  <span className="font-medium">BodySim v2.1</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
              <CardDescription>Based on your body measurements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-1">Clothing Size</h4>
                  <p className="text-sm text-blue-700">Based on your measurements, we recommend size M for most brands.</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-1">Fitness Tracking</h4>
                  <p className="text-sm text-green-700">Your measurements can help track body composition changes over time.</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-1">Health Insights</h4>
                  <p className="text-sm text-purple-700">Consider consulting a healthcare professional for personalized advice.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
