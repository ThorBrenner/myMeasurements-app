import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { User, ArrowRight, Calendar, Mail, Phone, MapPin, Activity, BarChart3, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/components/AuthContext";

const Profile = () => {
  const { user, logout } = useAuth();

  // Mock user data - in a real app, this would come from your backend
  const profileData = {
    name: user?.name || "John Doe",
    email: user?.email || "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    joinDate: "January 2024",
    totalAnalyses: 12,
    avgAccuracy: "94.2%",
    lastAnalysis: "2 days ago"
  };

  const handleLogout = () => {
    logout();
  };

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
            <Button variant="outline" onClick={handleLogout}>
              <Link to="/" className="text-gray-700 hover:text-indigo-600 transition-colors">Logout</Link>
              <LogOut className="mr-2 h-4 w-4" />
            </Button>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Profile Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <User className="h-16 w-16 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">{profileData.name}</h2>
          <p className="text-xl text-gray-600 mb-6">BodySim AI User</p>
          
          {/* Quick Access Dashboard Button */}
          <Link to="/dashboard">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all">
              View Dashboard <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Profile Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5 text-indigo-600" />
                  Personal Information
                </CardTitle>
                <CardDescription>Your account details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{profileData.email}</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{profileData.phone}</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium text-gray-900">{profileData.location}</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium text-gray-900">{profileData.joinDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5 text-indigo-600" />
                  Account Actions
                </CardTitle>
                <CardDescription>Manage your account and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Link to="/upload">
                    <Button variant="outline" className="w-full justify-start hover:bg-blue-50 hover:border-blue-300">
                      <Activity className="mr-2 h-4 w-4" />
                      New Analysis
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button variant="outline" className="w-full justify-start hover:bg-green-50 hover:border-green-300">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      View Results
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start hover:bg-purple-50 hover:border-purple-300">
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                  <Link to="/privacy">
                    <Button variant="outline" className="w-full justify-start hover:bg-gray-50 hover:border-gray-300">
                      <User className="mr-2 h-4 w-4" />
                      Privacy Settings
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistics Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-center">Account Statistics</CardTitle>
                <CardDescription className="text-center">Your BodySim AI activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{profileData.totalAnalyses}</div>
                  <div className="text-sm text-blue-700">Total Analyses</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-1">{profileData.avgAccuracy}</div>
                  <div className="text-sm text-green-700">Average Accuracy</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-lg font-semibold text-purple-600 mb-1">{profileData.lastAnalysis}</div>
                  <div className="text-sm text-purple-700">Last Analysis</div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-center">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/dashboard" className="block">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Go to Dashboard
                  </Button>
                </Link>
                <Link to="/upload" className="block">
                  <Button variant="outline" className="w-full">
                    <Activity className="mr-2 h-4 w-4" />
                    New Analysis
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;