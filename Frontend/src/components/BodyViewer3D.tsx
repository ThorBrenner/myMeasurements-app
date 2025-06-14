
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, ZoomIn, ZoomOut, Move, User } from "lucide-react";

export const BodyViewer3D = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              3D Body Model
              <Badge className="ml-2 bg-yellow-100 text-yellow-800">Coming Soon</Badge>
            </CardTitle>
            <CardDescription>
              Interactive 3D visualization of your body measurements
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" disabled>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" disabled>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" disabled>
              <Move className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="3d" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="3d">3D Model</TabsTrigger>
            <TabsTrigger value="front">Front View</TabsTrigger>
            <TabsTrigger value="side">Side View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="3d" className="mt-6">
            <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
              {/* Placeholder for 3D viewer */}
              <div className="text-center space-y-4">
                <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                  <User className="h-16 w-16 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">3D Model Coming Soon</h3>
                  <p className="text-gray-500 text-sm max-w-sm">
                    Interactive 3D body visualization will be available in the next update. 
                    This will allow you to view and manipulate your body model in real-time.
                  </p>
                </div>
                <div className="flex justify-center space-x-4 pt-4">
                  <div className="text-center">
                    <div className="w-3 h-3 bg-indigo-600 rounded-full mx-auto mb-1"></div>
                    <span className="text-xs text-gray-500">Rotate</span>
                  </div>
                  <div className="text-center">
                    <div className="w-3 h-3 bg-indigo-600 rounded-full mx-auto mb-1"></div>
                    <span className="text-xs text-gray-500">Zoom</span>
                  </div>
                  <div className="text-center">
                    <div className="w-3 h-3 bg-indigo-600 rounded-full mx-auto mb-1"></div>
                    <span className="text-xs text-gray-500">Measure</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="front" className="mt-6">
            <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-20 h-32 bg-indigo-200 rounded-lg mx-auto relative">
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-indigo-400 rounded-full"></div>
                  <div className="absolute top-8 left-1 w-2 h-8 bg-indigo-400 rounded"></div>
                  <div className="absolute top-8 right-1 w-2 h-8 bg-indigo-400 rounded"></div>
                  <div className="absolute bottom-8 left-2 w-2 h-6 bg-indigo-400 rounded"></div>
                  <div className="absolute bottom-8 right-2 w-2 h-6 bg-indigo-400 rounded"></div>
                </div>
                <p className="text-sm text-gray-600">Front view silhouette with measurement points</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="side" className="mt-6">
            <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-16 h-32 bg-indigo-200 rounded-lg mx-auto relative">
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-indigo-400 rounded-full"></div>
                  <div className="absolute top-8 right-1 w-2 h-8 bg-indigo-400 rounded"></div>
                  <div className="absolute bottom-8 right-2 w-2 h-6 bg-indigo-400 rounded"></div>
                </div>
                <p className="text-sm text-gray-600">Side view silhouette with measurement points</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
          <h4 className="font-medium text-indigo-900 mb-2">3D Features (Coming Soon)</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center text-indigo-700">
              <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></div>
              Real-time rotation
            </div>
            <div className="flex items-center text-indigo-700">
              <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></div>
              Zoom & pan controls
            </div>
            <div className="flex items-center text-indigo-700">
              <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></div>
              Measurement overlays
            </div>
            <div className="flex items-center text-indigo-700">
              <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></div>
              Export 3D model
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
