
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { User, ArrowLeft, Shield, Lock, Eye, Trash } from "lucide-react";

const Privacy = () => {
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
              <Link to="/privacy" className="text-indigo-600 font-medium">Privacy</Link>
            </div>
            <Link to="/profile">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <User className="mr-2 h-4 w-4" />
                  My Profile
                </Button>
              </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <Shield className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Privacy & Data Protection</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your privacy is our top priority. Learn how we protect your personal data and body images.
          </p>
        </div>

        <div className="space-y-8">
          {/* Data Collection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="mr-2 h-5 w-5" />
                What Data We Collect
              </CardTitle>
              <CardDescription>Information about the data we process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Photos You Upload:</h4>
                  <ul className="text-gray-600 space-y-1 ml-4">
                    <li>• Front and side body photos</li>
                    <li>• Only used for measurement analysis</li>
                    <li>• Processed locally when possible</li>
                    <li>• Never used for training our models</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Technical Information:</h4>
                  <ul className="text-gray-600 space-y-1 ml-4">
                    <li>• Device type and browser information</li>
                    <li>• IP address (anonymized)</li>
                    <li>• Usage statistics (aggregated)</li>
                    <li>• Error logs for debugging</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Protection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="mr-2 h-5 w-5" />
                How We Protect Your Data
              </CardTitle>
              <CardDescription>Security measures we implement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold">Encryption & Security:</h4>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• End-to-end encryption for all uploads</li>
                    <li>• HTTPS/TLS for all communications</li>
                    <li>• Regular security audits</li>
                    <li>• SOC 2 compliant infrastructure</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Access Controls:</h4>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• Limited employee access</li>
                    <li>• Multi-factor authentication</li>
                    <li>• Audit logs for all access</li>
                    <li>• Regular access reviews</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Usage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                How We Use Your Data
              </CardTitle>
              <CardDescription>Our data usage practices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">✅ We DO:</h4>
                  <ul className="text-green-700 space-y-1 text-sm">
                    <li>• Process your photos to generate measurements</li>
                    <li>• Store results temporarily for your session</li>
                    <li>• Use aggregated, anonymous data for research</li>
                    <li>• Improve our AI models with synthetic data</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-900 mb-2">❌ We DON'T:</h4>
                  <ul className="text-red-700 space-y-1 text-sm">
                    <li>• Store your photos permanently</li>
                    <li>• Share your images with third parties</li>
                    <li>• Use your data for advertising</li>
                    <li>• Sell your personal information</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trash className="mr-2 h-5 w-5" />
                Data Retention & Deletion
              </CardTitle>
              <CardDescription>How long we keep your data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">24 Hours</div>
                    <div className="text-sm text-blue-700">Uploaded photos deleted</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">30 Days</div>
                    <div className="text-sm text-green-700">Analysis results stored</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-1">On Request</div>
                    <div className="text-sm text-purple-700">Complete data deletion</div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Your Rights:</h4>
                  <p className="text-gray-600 text-sm">
                    You can request immediate deletion of all your data at any time. 
                    Contact us at privacy@bodysim.ai or use the delete button in your dashboard.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Questions About Privacy?</CardTitle>
              <CardDescription>Get in touch with our privacy team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Contact Information:</h4>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>Email: privacy@bodysim.ai</li>
                    <li>Phone: +1 (555) 123-4567</li>
                    <li>Address: 123 Privacy St, Secure City</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Response Times:</h4>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• Data deletion requests: 24 hours</li>
                    <li>• Privacy questions: 48 hours</li>
                    <li>• Data access requests: 7 days</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Last updated: {new Date().toLocaleDateString()} | 
            This privacy policy is based on best practices and may be updated as our service evolves.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Privacy;
