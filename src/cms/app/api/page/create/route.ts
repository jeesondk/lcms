// app/api/page/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { addPage } from '@/db/repositories/page';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { taxonomyId, name, iso_language } = body;

  if (!taxonomyId || !name || !iso_language) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {

    const insertedPage = await addPage(taxonomyId, iso_language);

    return NextResponse.json({ success: true, page: insertedPage[0] });
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
}
