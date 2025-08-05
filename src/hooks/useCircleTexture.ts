import { useMemo } from "react";
import * as THREE from "three";

export const useCircleTexture = () => {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext("2d")!;

    context.beginPath();
    context.arc(32, 32, 30, 0, 2 * Math.PI);
    context.fillStyle = "white";
    context.fill();

    return new THREE.CanvasTexture(canvas);
  }, []);
};
