import { AnalysisResult } from '@/types/analysis';

export const MOCK_ANALYSIS_DATABASE: Record<string, AnalysisResult> = {
  default: {
    id: 'scan-' + Date.now(),
    timestamp: new Date().toISOString(),
    imageUrl: '',
    objectName: 'Insulated Stainless Steel Water Bottle',
    category: 'Container / Hydration',
    confidence: 94,
    description: 'Double-walled vacuum insulated thermal flask with powder-coated matte finish and stainless steel twist cap.',
    condition: 'Excellent / Like New',
    estimatedWeight: {
      value: 385,
      unit: 'g',
      confidence: 82,
      label: 'AI Estimated Weight — Visual AI Estimate',
      isSensorMeasured: false,
    },
    color: {
      primary: 'Matte Cyan / Sky Blue',
      secondary: 'Brushed Silver Cap',
      hex: '#0284c7',
      rgb: 'rgb(2, 132, 199)',
    },
    dimensions: {
      length: 7.4,
      width: 7.4,
      height: 26.5,
      unit: 'cm',
      confidence: 85,
      source: 'AI estimated',
    },
    shape: 'Cylindrical with tapered spout neck',
    material: {
      primaryMaterial: '18/8 Food-Grade Stainless Steel',
      confidence: 92,
      texture: 'Powder-coated fine grain texture',
      reflectivity: 'Matte',
      transparency: 'Opaque',
    },
    estimatedVolume: {
      value: 750,
      unit: 'cm³',
    },
    estimatedDensity: {
      value: 0.51,
      unit: 'g/cm³',
    },
    manufactureInfo: {
      brand: 'HydroFlask / Klean Kanteen Type',
      model: '750ml Vacuum Bottle',
      categoryTag: 'Drinkware',
      notes: 'Standard 750ml capacity profile identified by height-to-diameter aspect ratio.',
    },
    assumptions: [
      'Visual height ratio corresponds to standard 750ml (25oz) thermal flasks.',
      'Bottle is empty or contains ambient air in weight estimate calculation.',
      'Wall thickness assumed at 1.2mm double-layered stainless steel structure.',
      'Density reflects hollow internal cavity of 750 cm³ container.'
    ],
    propertyTrust: [
      {
        property: 'Estimated Weight',
        value: '385 g',
        confidence: 82,
        method: 'Visual AI volumetric density formula',
        assumption: 'Empty 750ml stainless container with dual-layer wall thickness',
        warning: 'Does not account for liquid filled inside bottle'
      },
      {
        property: 'Dimensions',
        value: '7.4 × 7.4 × 26.5 cm',
        confidence: 85,
        method: 'Aspect ratio and focal distance calibration',
        assumption: 'Standard cylindrical perspective ratio'
      },
      {
        property: 'Material',
        value: '18/8 Stainless Steel',
        confidence: 92,
        method: 'Surface specular reflection and finish recognition',
        assumption: 'Standard food-grade thermal flask finish'
      },
      {
        property: 'Volume',
        value: '750 cm³ (750 ml)',
        confidence: 88,
        method: 'Geometric cylinder volume calculation V = π × r² × h',
        assumption: 'Standard cylindrical internal wall geometry'
      }
    ]
  },
  mug: {
    id: 'scan-mug-' + Date.now(),
    timestamp: new Date().toISOString(),
    imageUrl: '',
    objectName: 'Ceramic Coffee Mug',
    category: 'Tableware / Kitchenware',
    confidence: 96,
    description: 'Glazed stoneware ceramic coffee mug with C-shaped handle and glossy finish.',
    condition: 'Good',
    estimatedWeight: {
      value: 340,
      unit: 'g',
      confidence: 86,
      label: 'AI Estimated Weight — Visual AI Estimate',
      isSensorMeasured: false,
    },
    color: {
      primary: 'Ceramic Warm White',
      secondary: 'Dark Espresso Brown Interior',
      hex: '#f8fafc',
      rgb: 'rgb(248, 250, 252)',
    },
    dimensions: {
      length: 12.0,
      width: 8.5,
      height: 9.8,
      unit: 'cm',
      confidence: 88,
      source: 'AI estimated',
    },
    shape: 'Cylindrical with loop handle',
    material: {
      primaryMaterial: 'Glazed Stoneware Ceramic',
      confidence: 95,
      texture: 'Smooth vitreous glaze',
      reflectivity: 'High-Gloss',
      transparency: 'Opaque',
    },
    estimatedVolume: {
      value: 350,
      unit: 'cm³',
    },
    estimatedDensity: {
      value: 2.3,
      unit: 'g/cm³',
    },
    manufactureInfo: {
      brand: 'Standard Bistro Series',
      model: '12 oz Ceramic Mug',
      categoryTag: 'Drinkware',
    },
    assumptions: [
      'Glaze reflectivity indicates fired stoneware ceramic material.',
      'Empty weight estimated based on 5mm average wall thickness.'
    ],
    propertyTrust: [
      {
        property: 'Estimated Weight',
        value: '340 g',
        confidence: 86,
        method: 'Stoneware volume density matrix (2.3 g/cm³ base ceramic density)',
        assumption: 'Empty cup without hot beverage'
      }
    ]
  }
};
