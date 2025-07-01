import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Image as ImageIcon, User, Scale, Ruler, Calendar, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthContext";


interface UserDetails {
  height: string;
  weight: string;
}

export const PhotoUploadForm = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [frontPhoto, setFrontPhoto] = useState<File | null>(null);
  const [sidePhoto, setSidePhoto] = useState<File | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    height: '',
    weight: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Partial<UserDetails>>({});

  // Verificar se o usuário está autenticado
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'side') => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        if (type === 'front') {
          setFrontPhoto(file);
        } else {
          setSidePhoto(file);
        }
      } else {
        alert("Please upload a valid image file");
      }
    }
  };

  const handleInputChange = (field: keyof UserDetails, value: string) => {
    setUserDetails(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UserDetails> = {};

    if (!userDetails.height) newErrors.height = 'Height is required';
    if (!userDetails.weight) newErrors.weight = 'Weight is required';

    // Validate numeric fields
    if (userDetails.height && (isNaN(Number(userDetails.height)) || Number(userDetails.height) <= 0)) {
      newErrors.height = 'Please enter a valid height';
    }
    if (userDetails.weight && (isNaN(Number(userDetails.weight)) || Number(userDetails.weight) <= 0)) {
      newErrors.weight = 'Please enter a valid weight';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!frontPhoto || !sidePhoto) {
      toast.error("Please upload both front and side photos");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('front_photo', frontPhoto);
    formData.append('side_photo', sidePhoto);
    formData.append('height', userDetails.height);
    formData.append('weight', userDetails.weight);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch('http://localhost:8000/measurements/upload-photos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Upload failed");
      }

      const data = await response.json();
      
      toast.success("Photos uploaded and measurements calculated successfully!");
      navigate('/dashboard', { state: { measurements: data.measurement } });

    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const isFormValid = frontPhoto && sidePhoto && userDetails.height && userDetails.weight;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <User className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Body Analysis</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your photos and provide your details for accurate body measurements and analysis
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* User Details Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <Users className="h-6 w-6 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Personal Information</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Height */}
              <div className="space-y-2">
                <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                  <Ruler className="inline h-4 w-4 mr-1" />
                  Height (cm)
                </label>
                <input
                  type="number"
                  id="height"
                  value={userDetails.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  placeholder="170"
                  min="1"
                  max="300"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                    errors.height ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.height && <p className="text-sm text-red-600">{errors.height}</p>}
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                  <Scale className="inline h-4 w-4 mr-1" />
                  Weight (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  value={userDetails.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder="70"
                  min="1"
                  max="500"
                  step="0.1"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                    errors.weight ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.weight && <p className="text-sm text-red-600">{errors.weight}</p>}
              </div>
            </div>
          </div>

          {/* Photo Upload Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <ImageIcon className="h-6 w-6 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Photo Upload</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Front Photo Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Front Photo</h3>
                <p className="text-sm text-gray-600 mb-4">Upload a front-facing photo of your full body</p>
                
                <div className="relative">
                  <input
                    id="front-photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'front')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                    frontPhoto 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                  }`}>
                    {frontPhoto ? (
                      <div className="space-y-3">
                        <ImageIcon className="h-12 w-12 text-green-600 mx-auto" />
                        <div>
                          <p className="font-medium text-green-700">{frontPhoto.name}</p>
                          <p className="text-sm text-green-600">
                            {(frontPhoto.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <p className="text-sm text-green-600">✓ Front photo uploaded</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-lg font-medium text-gray-700">Click to upload front photo</p>
                          <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Side Photo Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Side Photo</h3>
                <p className="text-sm text-gray-600 mb-4">Upload a side-facing photo of your full body</p>
                
                <div className="relative">
                  <input
                    id="side-photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'side')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                    sidePhoto 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                  }`}>
                    {sidePhoto ? (
                      <div className="space-y-3">
                        <ImageIcon className="h-12 w-12 text-green-600 mx-auto" />
                        <div>
                          <p className="font-medium text-green-700">{sidePhoto.name}</p>
                          <p className="text-sm text-green-600">
                            {(sidePhoto.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <p className="text-sm text-green-600">✓ Side photo uploaded</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-lg font-medium text-gray-700">Click to upload side photo</p>
                          <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={!isFormValid || isUploading}
              className={`inline-flex items-center px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200 ${
                isFormValid && !isUploading
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Processing Your Analysis...
                </>
              ) : (
                <>
                  <User className="mr-3 h-5 w-5" />
                  Analyze My Body
                </>
              )}
            </button>
            
            {!isFormValid && (
              <p className="mt-3 text-sm text-gray-500">
                Please complete height and weight fields and upload both photos to continue
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};