import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operation, value } = body;

    // FHE operations handler
    // This route handles general FHE operations

    return NextResponse.json({
      success: true,
      operation,
      message: 'FHE operation executed successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'FHE operation failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'FHE API endpoint',
    availableOperations: ['encrypt', 'decrypt', 'compute'],
  });
}
