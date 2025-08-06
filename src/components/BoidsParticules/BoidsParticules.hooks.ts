import { useState } from "react";

export interface BoidsSettings {
  separationForce: number;
  alignmentForce: number;
  cohesionForce: number;
  maxSpeed: number;
  maxForce: number;
  boundaryAvoidance: number;
}

export const useBoidsSettings = () => {
  const [settings, setSettings] = useState<BoidsSettings>({
    separationForce: 0.2,
    alignmentForce: 0.1,
    cohesionForce: 0.1,
    maxSpeed: 0.1,
    maxForce: 0.005,
    boundaryAvoidance: 0.1,
  });

  const updateSetting = (key: keyof BoidsSettings, value: number) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return { settings, updateSetting };
};
