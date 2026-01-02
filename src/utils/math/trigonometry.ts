// src/core/math/trigonometry.ts

export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

export function sinDeg(deg: number): number {
  return Math.sin(degToRad(deg));
}

export function cosDeg(deg: number): number {
  return Math.cos(degToRad(deg));
}

export function tanDeg(deg: number): number {
  return Math.tan(degToRad(deg));
}

export function atanDeg(x: number): number {
  return radToDeg(Math.atan(x));
}


