import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/auth';

interface Figure {
  url: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting image processing request');
    
    // Check admin authentication
    await requireAdminAuth();
    console.log('✅ Admin authentication passed');

    const { image_url } = await request.json();
    console.log('📥 Received image URL:', image_url);

    if (!image_url) {
      console.log('❌ No image URL provided');
      return NextResponse.json({ error: 'No image URL provided' }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(image_url);
      console.log('✅ Image URL format is valid');
    } catch {
      console.log('❌ Invalid image URL format');
      return NextResponse.json({ error: 'Invalid image URL' }, { status: 400 });
    }

    // Create FormData for external API with image URL
    const externalFormData = new FormData();
    console.log('📦 Created FormData for external API');
    
    // Fetch the image from the URL and convert to blob
    console.log('🔄 Fetching image from URL:', image_url);
    const imageResponse = await fetch(image_url);
    console.log('📊 Image fetch response status:', imageResponse.status, imageResponse.statusText);
    
    if (!imageResponse.ok) {
      console.log('❌ Failed to fetch image from URL. Status:', imageResponse.status);
      return NextResponse.json({ error: 'Failed to fetch image from URL' }, { status: 400 });
    }
    
    const imageBlob = await imageResponse.blob();
    console.log('📄 Image blob created. Size:', imageBlob.size, 'Type:', imageBlob.type);
    
    // Try different field names that the API might expect
    externalFormData.append('image', imageBlob, 'image.jpg');
    console.log('✅ Image appended to FormData with "image" field name');

    // Send to external processing API
    const externalApiUrl = 'https://questionbankapi.onrender.com/inference';
    console.log('🌐 Sending request to external API:', externalApiUrl);
    console.log('📋 Request method: POST');
    console.log('📦 FormData entries:');
      for (const [key, value] of externalFormData.entries()) {
        if (typeof value === 'object' && value && 'size' in value && 'type' in value) {
          const file = value as File;
          console.log(`  ${key}: ${value.constructor.name} (size: ${file.size}, type: ${file.type})`);
        } else {
          console.log(`  ${key}: ${String(value)}`);
        }
      }
    
    const response = await fetch(externalApiUrl, {
      method: 'POST',
      body: externalFormData,
    });
    
    console.log('📊 External API response status:', response.status, response.statusText);
    console.log('📋 External API response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ External API error response:', errorText);
      console.error('❌ External API failed with status:', response.status);
      return NextResponse.json(
        { error: 'Failed to process image with external service' },
        { status: 500 }
      );
    }

    console.log('✅ External API request successful, parsing JSON response');
    const processedData = await response.json();
    console.log('📄 External API response data:', JSON.stringify(processedData, null, 2));

    // Validate the response structure
    console.log('🔍 Validating external API response structure');
    console.log('✅ Response has success field:', !!processedData.success);
    console.log('✅ Response has transcription field:', !!processedData.transcription);
    
    if (!processedData.success || !processedData.transcription) {
      console.log('❌ Invalid response structure from external API');
      return NextResponse.json(
        { error: 'Invalid response from processing service' },
        { status: 500 }
      );
    }

    // Extract and structure the data for our application
    console.log('🔄 Extracting and structuring data for application');
    
    // Extract figures URLs from processed_images.figures array
    const figuresArray = processedData.processed_images?.figures?.map((figure: Figure) => figure.url) || [];
    console.log('📸 Extracted figures URLs:', figuresArray);
    
    const extractedData = {
      success: true,
      originalImageUrl: processedData.original_image_url,
      processedImageUrl: processedData.processed_images?.processed_image,
      figures: figuresArray, // Store array of figure URLs for database
      questionText: processedData.transcription?.transcription?.question_text || '',
      options: {
        A: processedData.transcription?.transcription?.options?.A || '',
        B: processedData.transcription?.transcription?.options?.B || '',
        C: processedData.transcription?.transcription?.options?.C || '',
        D: processedData.transcription?.transcription?.options?.D || '',
      },
      figuresDetected: processedData.transcription?.figures_detected || 0,
      confidence: processedData.transcription?.transcription?.confidence || 0,
      figureDescriptions: processedData.transcription?.transcription?.figures || [],
      apiResponse: processedData, // Store the complete raw API response for database
    };

    console.log('✅ Data extraction completed successfully');
    console.log('📤 Returning processed data to client');
    console.log('🎯 Final extracted data:', JSON.stringify(extractedData, null, 2));
    return NextResponse.json(extractedData);

  } catch (error: unknown) {
    console.error('💥 CRITICAL ERROR in process question endpoint:', error);
    console.error('🔍 Error type:', typeof error);
    console.error('🔍 Error constructor:', error?.constructor?.name);
    
    if (error instanceof Error) {
      console.error('📝 Error message:', error.message);
      console.error('📚 Error stack:', error.stack);
      
      if (error.message === 'Admin access required') {
        console.log('🚫 Admin access denied');
        return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
      }
    }
    
    console.error('❌ Returning 500 error to client');
    return NextResponse.json(
      { error: 'Failed to process question image' },
      { status: 500 }
    );
  }
}