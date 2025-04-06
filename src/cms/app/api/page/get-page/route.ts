import { NextRequest, NextResponse } from 'next/server';
import { getPageContent } from '@/db/repositories/contentRepository';

export async function GET(req: NextRequest) {
    const { pageId } = await req.json();
    
    const content = await getPageContent(pageId);

    if (!content) {
        return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }
    return NextResponse.json(content);
}