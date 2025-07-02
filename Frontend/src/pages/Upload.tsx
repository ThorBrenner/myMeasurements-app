
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "react-router-dom";
import { User, Upload as UploadIcon, Camera, ArrowLeft, AlertCircle } from "lucide-react";
import { PhotoUploadForm } from "@/components/PhotoUploadForm";
import { useAuth } from "@/components/AuthContext";

const Upload = () => {

  const { state } = useLocation();
  const measurements = state?.measurements;
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to view your history</CardDescription>
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
              <Link to="/upload" className="text-indigo-600 font-medium">Upload</Link>
              <Link to="/history" className="text-gray-700 hover:text-indigo-600 transition-colors">History</Link>
              <Link to="/privacy" className="text-gray-700 hover:text-indigo-600 transition-colors">Privacy</Link>
            </div>
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Upload Form */}
        <div className="mb-8">
          <PhotoUploadForm />
        </div>

        <div className="text-center mb-12">
          <UploadIcon className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload Your Photos</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload front and side photos of your body to get accurate measurements using our AI technology.
          </p>
        </div>

        {/* Instructions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="mr-2 h-5 w-5" />
              Photo Guidelines
            </CardTitle>
            <CardDescription>
              Follow these guidelines for the most accurate measurements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">✅ Do:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Wear form-fitting clothes</li>
                  <li>• Stand in good lighting</li>
                  <li>• Keep arms slightly away from body</li>
                  <li>• Stand against a plain background</li>
                  <li>• Include full body in frame</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">❌ Don't:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Wear loose or baggy clothing</li>
                  <li>• Take photos in dim lighting</li>
                  <li>• Pose or bend body parts</li>
                  <li>• Use busy backgrounds</li>
                  <li>• Cut off any body parts</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Privacy & Security</h4>
              <p className="text-sm text-blue-700">
                Your photos are processed locally and securely. We don't store your images permanently, 
                and all data is encrypted during processing. 
                <Link to="/privacy" className="underline font-medium ml-1">Read our privacy policy</Link>
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Upload;
