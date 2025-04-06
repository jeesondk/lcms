import { addContent } from '@/db/repositories/contentRepository';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { pageId, key, value } = body;
    console.log('Received request to add content:', body);
    
    if (!pageId || !key || !value) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    try {
        const content = await addContent(pageId, key, value);
    
        return NextResponse.json({ success: true, content });
    } catch (error) {
        console.error('Error fetching content:', error);
        return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
    }
 }