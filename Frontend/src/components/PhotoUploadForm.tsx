
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Image as ImageIcon, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const PhotoUploadForm = () => {
  const [frontPhoto, setFrontPhoto] = useState<File | null>(null);
  const [sidePhoto, setSidePhoto] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'side') => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        if (type === 'front') {
          setFrontPhoto(file);
        } else {
          setSidePhoto(file);
        }
        toast.success(`${type === 'front' ? 'Front' : 'Side'} photo uploaded successfully!`);
      } else {
        toast.error("Please upload a valid image file");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!frontPhoto || !sidePhoto) {
      toast.error("Please upload both front and side photos");
      return;
    }

    setIsUploading(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    toast.success("Photos processed successfully! Redirecting to dashboard...");
    
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Front Photo Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Front Photo</CardTitle>
            <CardDescription>
              Upload a front-facing photo of your full body
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label htmlFor="front-photo">Front Body Photo</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
                {frontPhoto ? (
                  <div className="space-y-2">
                    <ImageIcon className="h-8 w-8 text-green-600 mx-auto" />
                    <p className="text-sm font-medium text-green-600">{frontPhoto.name}</p>
                    <p className="text-xs text-gray-500">
                      Size: {(frontPhoto.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-600">Click to upload front photo</p>
                    <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
                  </div>
                )}
                <Input
                  id="front-photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'front')}
                  className="mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Side Photo Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Side Photo</CardTitle>
            <CardDescription>
              Upload a side-facing photo of your full body
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label htmlFor="side-photo">Side Body Photo</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
                {sidePhoto ? (
                  <div className="space-y-2">
                    <ImageIcon className="h-8 w-8 text-green-600 mx-auto" />
                    <p className="text-sm font-medium text-green-600">{sidePhoto.name}</p>
                    <p className="text-xs text-gray-500">
                      Size: {(sidePhoto.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-600">Click to upload side photo</p>
                    <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
                  </div>
                )}
                <Input
                  id="side-photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'side')}
                  className="mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <Button
          type="submit"
          size="lg"
          disabled={!frontPhoto || !sidePhoto || isUploading}
          className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3"
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing Photos...
            </>
          ) : (
            <>
              <User className="mr-2 h-4 w-4" />
              Analyze My Body
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
