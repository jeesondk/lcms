import { NextRequest, NextResponse } from 'next/server';
import { getContentById } from '@/db/repositories/contentRepository';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const pageId = Number(searchParams.get('pageId'));
    const contentId = Number(searchParams.get('contentId'));

    if(!pageId || !contentId) {
        return NextResponse.json({ error: 'Invalid pageId or contentId' }, { status: 400 });
    }
    console.log('Received pageId:', pageId);
    
    const content = await getContentById(pageId, contentId);

    if (!content) {
        return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }
    return NextResponse.json(content.value);
}