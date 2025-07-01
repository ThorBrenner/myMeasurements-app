import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MeasurementDisplayProps {
  measurements: Record<string, number>;
}

interface MeasurementItem {
  label: string;
  value: string;
  unit: string;
  accuracy: string;
}

export const MeasurementDisplay = ({ measurements }: MeasurementDisplayProps) => {
  const rawMeasurements = measurements;

  // Lista das medidas que devem ser exibidas
  const allowedMeasurements = [
    'ankle', 'arm-length', 'bicep', 'calf', 'chest', 'forearm',
    'height', 'hip', 'leg-length', 'shoulder-breadth',
    'shoulder-to-crotch', 'thigh', 'waist', 'wrist'
  ];

  const mapLabel = (key: string) => {
    const labelMap: Record<string, string> = {
      height: "Height",
      chest: "Chest",
      waist: "Waist",
      hip: "Hips",
      "shoulder-breadth": "Shoulder Width",
      "arm-length": "Arm Length",
      "leg-length": "Leg Length",
      neck: "Neck",
      bicep: "Bicep",
      calf: "Calf",
      thigh: "Thigh",
      wrist: "Wrist",
      ankle: "Ankle",
      forearm: "Forearm",
      "shoulder-to-crotch": "Shoulder to Crotch"
    };
    return labelMap[key] || key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' ');
  };

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

  // Filtrar apenas as medidas permitidas
  const filteredMeasurements = Object.entries(rawMeasurements)
    .filter(([key]) => allowedMeasurements.includes(key))
    .sort(([a], [b]) => {
      // Ordenar de acordo com a ordem da lista allowedMeasurements
      return allowedMeasurements.indexOf(a) - allowedMeasurements.indexOf(b);
    });

  const measurementsList: MeasurementItem[] = filteredMeasurements.map(([key, value]) => ({
    label: mapLabel(key),
    value: String(value),
    unit: "cm",
    accuracy: "high" // Placeholder accuracy until you implement real logic
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Body Measurements</CardTitle>
        <CardDescription>
          AI-estimated measurements with accuracy indicators ({measurementsList.length} measurements)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {measurementsList.length > 0 ? (
            measurementsList.map((measurement, index) => (
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
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No measurements available for the specified criteria.</p>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Measurement Notes</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Measurements are estimates based on photo analysis</li>
            <li>• Only specific measurements are displayed as configured</li>
            <li>• Accuracy may vary based on photo quality and clothing</li>
            <li>• For critical measurements, confirm with manual measuring</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
