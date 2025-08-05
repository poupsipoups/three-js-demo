import { useState } from "react";

export interface BoidsSettings {
  separationForce: number;
  alignmentForce: number;
  cohesionForce: number;
  maxSpeed: number;
  maxForce: number;
}

export const useBoidsSettings = () => {
  const [settings, setSettings] = useState<BoidsSettings>({
    separationForce: 0.2, // ← Encore plus faible !
    alignmentForce: 0.1, // ← Encore plus faible !
    cohesionForce: 0.1, // ← Encore plus faible !
    maxSpeed: 0.1, // ← TRÈS lent !
    maxForce: 0.005, // ← Très doux !
  });

  const updateSetting = (key: keyof BoidsSettings, value: number) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return { settings, updateSetting };
};
