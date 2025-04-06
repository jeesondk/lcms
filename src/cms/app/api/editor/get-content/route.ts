import { NextRequest, NextResponse } from 'next/server';
import { getContentById } from '@/db/repositories/contentRepository';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get('id'));

    if(!id) {
        return NextResponse.json({ error: 'Invalid contentId' }, { status: 400 });
    }
    
    const content = await getContentById(id);

    if (!content) {
        return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }
    return NextResponse.json(content.value);
}