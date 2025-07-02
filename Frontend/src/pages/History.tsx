import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "react-router-dom";
import { User, ArrowLeft, Download, Share, Upload as UploadIcon } from "lucide-react";
import { MeasurementDisplay } from "@/components/MeasurementDisplay";
import { BodyViewer3D } from "@/components/BodyViewer3D";
import { MeasurementHistory } from "@/components/MeasurementHistory";
import { useAuth } from "@/components/AuthContext";

const History = () => {
  const { state } = useLocation();
  const measurements = state?.measurements;
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to view your history of measurements</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link to="/login">
              <Button>Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <Link to="/history" className="text-indigo-600 font-medium">History</Link>
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

        {/* Measurement History */}
        <div className="mt-12">
          <MeasurementHistory />
        </div>

    </main>
    </div>
    );
};

export default History;
