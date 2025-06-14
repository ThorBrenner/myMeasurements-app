
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const MeasurementDisplay = () => {
  // Mock measurement data - in real app this would come from API
  const measurements = [
    { label: "Height", value: "175.2", unit: "cm", accuracy: "high" },
    { label: "Chest", value: "96.5", unit: "cm", accuracy: "high" },
    { label: "Waist", value: "82.1", unit: "cm", accuracy: "high" },
    { label: "Hips", value: "94.3", unit: "cm", accuracy: "medium" },
    { label: "Shoulder Width", value: "44.7", unit: "cm", accuracy: "high" },
    { label: "Arm Length", value: "58.2", unit: "cm", accuracy: "medium" },
    { label: "Leg Length", value: "87.5", unit: "cm", accuracy: "high" },
    { label: "Neck", value: "37.8", unit: "cm", accuracy: "medium" },
  ];

  const getAccuracyColor = (accuracy: string) => {
    switch (accuracy) {
      case "high":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAccuracyPercentage = (accuracy: string) => {
    switch (accuracy) {
      case "high":
        return "95%";
      case "medium":
        return "85%";
      case "low":
        return "70%";
      default:
        return "N/A";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Body Measurements</CardTitle>
        <CardDescription>
          AI-estimated measurements with accuracy indicators
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {measurements.map((measurement, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">{measurement.label}</span>
                  <Badge className={`text-xs ${getAccuracyColor(measurement.accuracy)}`}>
                    {getAccuracyPercentage(measurement.accuracy)}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-indigo-600">
                  {measurement.value}
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    {measurement.unit}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Measurement Notes</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Measurements are estimates based on photo analysis</li>
            <li>• Accuracy may vary based on photo quality and clothing</li>
            <li>• For critical measurements, confirm with manual measuring</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
