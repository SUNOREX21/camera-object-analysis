import { NextResponse } from 'next/server';
import { analyzeImageWithAI } from '@/lib/ai-service';
import { CalibrationOptions } from '@/types/analysis';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image, calibration } = body as { image: string; calibration?: CalibrationOptions };

    if (!image) {
      return NextResponse.json(
        { error: 'Image data is required in payload.' },
        { status: 400 }
      );
    }

    // Basic file size check (approximate base64 length limit for 10MB ~ 13.3M chars)
    if (image.length > 15 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image file size exceeds maximum 10MB limit.' },
        { status: 413 }
      );
    }

    const analysisResult = await analyzeImageWithAI(image, calibration);

    return NextResponse.json(analysisResult, { status: 200 });
  } catch (error: any) {
    console.error('[ObjectLens API Error]:', error);
    return NextResponse.json(
      {
        error: 'Failed to complete AI vision analysis.',
        details: error?.message || 'Unknown server processing error.',
      },
      { status: 500 }
    );
  }
}
