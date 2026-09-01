export interface WeightEstimate {
  value: number;
  unit: 'g' | 'kg' | 'oz';
  confidence: number;
  label?: string; // e.g. "AI Estimated Weight — Visual AI Estimate" or "Measured Weight — Smart Sensor"
  isSensorMeasured?: boolean;
}

export interface ColorInfo {
  primary: string;
  secondary: string;
  hex: string;
  rgb: string;
}

export interface DimensionsInfo {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'mm' | 'in';
  confidence: number;
  source: 'AI estimated' | 'Reference-based' | 'User supplied' | 'Sensor measured';
}

export interface VolumeEstimate {
  value: number;
  unit: 'cm³' | 'ml' | 'l';
}

export interface DensityEstimate {
  value: number;
  unit: 'g/cm³' | 'kg/m³';
}

export interface MaterialInfo {
  primaryMaterial: string;
  confidence: number;
  texture: string;
  reflectivity: 'Matte' | 'Semi-Gloss' | 'High-Gloss' | 'Metallic' | 'Transparent/Glass';
  transparency: 'Opaque' | 'Translucent' | 'Transparent';
}

export interface ManufactureInfo {
  brand?: string;
  model?: string;
  categoryTag?: string;
  notes?: string;
}

export interface PropertyTrustItem {
  property: string;
  value: string;
  confidence: number;
  method: string;
  assumption: string;
  warning?: string;
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  imageUrl: string;
  objectName: string;
  category: string;
  confidence: number; // overall 0-100%
  description: string;
  condition: string;
  
  estimatedWeight: WeightEstimate;
  color: ColorInfo;
  dimensions: DimensionsInfo;
  shape: string;
  material: MaterialInfo;
  estimatedVolume: VolumeEstimate;
  estimatedDensity: DensityEstimate;
  manufactureInfo?: ManufactureInfo;
  
  assumptions: string[];
  propertyTrust: PropertyTrustItem[];
  detectedObjectsCount?: number;
  alternativeObjectCandidates?: string[];
}

export interface CalibrationOptions {
  referenceObject?: 'none' | 'credit-card' | 'us-quarter' | 'ruler-10cm';
  knownDimensionLengthCm?: number;
  knownMaterial?: string;
  knownModel?: string;
}

export interface ScanRecord {
  id: string;
  timestamp: string;
  thumbnail: string;
  analysis: AnalysisResult;
}

export interface ScaleSensorStatus {
  isConnected: boolean;
  deviceName?: string;
  currentWeightGrams?: number;
  batteryLevel?: number;
}
