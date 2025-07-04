import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ruler, Scale } from "lucide-react";
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

const allowedMeasurements = [...orderedMeasurements];

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
  "shoulder-to-crotch": "Shoulder to Crotch",
  weight: "Weight"
};

const keyToFieldMap: Record<string, string> = {
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

export const MeasurementDisplay = ({
  measurements: propMeasurements
}: {
  measurements?: Record<string, number>;
}) => {
  const [measurements, setMeasurements] = useState<Record<string, number> | null>(null);
  const [isLoading, setIsLoading] = useState(!propMeasurements);

  useEffect(() => {
    if (propMeasurements) {
      const converted = Object.fromEntries(
        Object.entries(keyToFieldMap).map(([key, field]) => [key, propMeasurements[field]])
      );
      const filtered = Object.fromEntries(
        Object.entries(converted).filter(
          ([k, v]) => allowedMeasurements.includes(k) && typeof v === "number"
        )
      ) as Record<string, number>;
      setMeasurements(filtered);
      setIsLoading(false);
    } else {
      fetchLatestMeasurement();
    }
  }, [propMeasurements]);

  const fetchLatestMeasurement = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch("http://localhost:8000/measurements/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) throw new Error("Failed to fetch measurements");

      const data = await response.json();
      const latest = data.reduce((a: any, b: any) =>
        new Date(a.timestamp) > new Date(b.timestamp) ? a : b
      );

      const converted = Object.fromEntries(
        Object.entries(keyToFieldMap).map(([key, field]) => [key, latest[field]])
      );
      const filtered = Object.fromEntries(
        Object.entries(converted).filter(
          ([k, v]) => allowedMeasurements.includes(k) && typeof v === "number"
        )
      ) as Record<string, number>;

      setMeasurements(filtered);
    } catch (e) {
      console.error(e);
      toast.error("Error loading measurements");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Body Measurements</CardTitle>
        <CardDescription>Showing your most recent measurements</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading measurements...</p>
          </div>
        ) : measurements && Object.keys(measurements).length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {orderedMeasurements.map((key, index) => {
              const value = measurements[key];
              if (value == null) return null;
              return (
                <div
                  key={key}
                  className={`text-center p-3 rounded-lg ${getMeasurementColor(index)}`}
                >
                  {key === "height" && <Ruler className="h-5 w-5 mx-auto mb-1" />}
                  {key === "weight" && <Scale className="h-5 w-5 mx-auto mb-1" />}
                  <p className="text-sm text-gray-600">{labelMap[key] || key}</p>
                  <div className="text-lg font-semibold">
                    {value} {key === "weight" ? "kg" : "cm"}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No measurements found.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};