import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Ruler, Scale, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { toast } from "sonner";

const orderedMeasurements = [
  "weight",
  "height",
  "ankle",
  "arm-length",
  "bicep",
  "calf",
  "chest",
  "forearm",
  "hip",
  "leg-length",
  "shoulder-breadth",
  "shoulder-to-crotch",
  "thigh",
  "waist",
  "wrist"
];

const labelMap: Record<string, string> = {
  height: "Height",
  chest: "Chest",
  waist: "Waist",
  hip: "Hip",
  thigh: "Thigh",
  bicep: "Bicep",
  ankle: "Ankle",
  "arm-length": "Arm Length",
  calf: "Calf",
  forearm: "Forearm",
  "leg-length": "Leg Length",
  "shoulder-breadth": "Shoulder Width",
  "shoulder-to-crotch": "Shoulder to Crotch",
  wrist: "Wrist",
  weight: "Weight"
};

const keyToFieldMap: Record<string, keyof BodyMeasurement> = {
  height: "height_cm",
  chest: "chest_cm",
  waist: "waist_cm",
  hip: "hip_cm",
  thigh: "thigh_cm",
  bicep: "bicep_cm",
  ankle: "ankle_cm",
  "arm-length": "arm_length_cm",
  calf: "calf_cm",
  forearm: "forearm_cm",
  "leg-length": "leg_length_cm",
  "shoulder-breadth": "shoulder_breadth_cm",
  "shoulder-to-crotch": "shoulder_to_crotch_cm",
  wrist: "wrist_cm",
  weight: "weight_kg"
};

interface BodyMeasurement {
  id: string;
  user_id: string;
  timestamp: string;
  height_cm: number | null;
  weight_kg: number | null;
  chest_cm: number | null;
  waist_cm: number | null;
  hip_cm: number | null;
  thigh_cm: number | null;
  bicep_cm: number | null;
  ankle_cm: number | null;
  arm_length_cm: number | null;
  calf_cm: number | null;
  forearm_cm: number | null;
  leg_length_cm: number | null;
  shoulder_breadth_cm: number | null;
  shoulder_to_crotch_cm: number | null;
  wrist_cm: number | null;
}

export const MeasurementHistory = () => {
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchMeasurements();
    }
  }, [isAuthenticated]);

  const fetchMeasurements = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const response = await fetch("http://localhost:8000/measurements/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) throw new Error("Failed to fetch measurements");

      const data = await response.json();
      setMeasurements(data);
    } catch (error: any) {
      console.error("Error fetching measurements:", error);
      toast.error(`Failed to load measurements: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getTrend = (current: number | null, previous: number | null) => {
    if (!current || !previous) return null;
    const diff = current - previous;
    if (Math.abs(diff) < 0.1) return "stable";
    return diff > 0 ? "up" : "down";
  };

  const getTrendIcon = (trend: string | null) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case "stable":
        return <Minus className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getMeasurementValue = (measurement: BodyMeasurement, key: string): number | null => {
    const field = keyToFieldMap[key];
    return field ? measurement[field] as number | null : null;
  };

  const getMeasurementColor = (index: number): string => {
    const colors = [
      "bg-blue-50 text-blue-900",
      "bg-green-50 text-green-900",
      "bg-purple-50 text-purple-900",
      "bg-orange-50 text-orange-900",
      "bg-pink-50 text-pink-900",
      "bg-indigo-50 text-indigo-900",
      "bg-teal-50 text-teal-900",
      "bg-red-50 text-red-900",
      "bg-yellow-50 text-yellow-900",
      "bg-cyan-50 text-cyan-900",
      "bg-emerald-50 text-emerald-900",
      "bg-violet-50 text-violet-900",
      "bg-rose-50 text-rose-900",
      "bg-amber-50 text-amber-900"
    ];
    return colors[index % colors.length];
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">Please log in to view your measurement history.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your measurements...</p>
        </CardContent>
      </Card>
    );
  }

  if (measurements.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Measurement History
          </CardTitle>
          <CardDescription>
            Your body measurement history will appear here
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600 mb-4">No measurements found. Upload your first photos to get started!</p>
          <Button asChild>
            <a href="/upload">Upload Photos</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Measurement History ({measurements.length} records)
          </CardTitle>
          <CardDescription>
            Track your body measurements over time - showing {orderedMeasurements.length} specific measurements
          </CardDescription>
        </CardHeader>
      </Card>

      {measurements.map((measurement, index) => {
        const previousMeasurement = measurements[index + 1];

        return (
          <Card key={measurement.id} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    Measurement #{measurements.length - index}
                  </CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Calendar className="mr-1 h-4 w-4" />
                    {formatDate(measurement.timestamp)}
                  </CardDescription>
                </div>
                {index === 0 && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Latest
                  </span>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {orderedMeasurements.map((measurementKey, i) => {
                  const value = getMeasurementValue(measurement, measurementKey);
                  const previousValue = previousMeasurement ? getMeasurementValue(previousMeasurement, measurementKey) : null;
                  if (!value) return null;

                  return (
                    <div key={measurementKey} className={`text-center p-3 rounded-lg ${getMeasurementColor(i)}`}>
                      {measurementKey === "height" && <Ruler className="h-5 w-5 mx-auto mb-1" />}
                      {measurementKey === "weight" && <Scale className="h-5 w-5 mx-auto mb-1" />}
                      <p className="text-sm text-gray-600">{labelMap[measurementKey]}</p>
                      <div className="flex items-center justify-center">
                        <p className="font-semibold">
                          {value} {measurementKey === "weight" ? "kg" : "cm"}
                        </p>
                        {getTrendIcon(getTrend(value, previousValue))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
