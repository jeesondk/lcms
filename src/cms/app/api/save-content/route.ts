import { NextRequest, NextResponse } from 'next/server';
import { saveContent } from '@/db/repositories/contentRepository';


export async function POST(req: NextRequest) {
  const { content: body, contentId } = await req.json();
    console.log('Received contentId:', contentId);
    console.log('Received content:', body);

    if (!contentId) {
        return NextResponse.json({ error: 'Invalid contentId' }, { status: 400 });
    }

    if (!body) {
        return NextResponse.json({ error: 'Invalid content' }, { status: 400 });
    }

    saveContent(contentId, body)
        .then((result) => {
            console.log('Content saved:', result);
        })
        .catch((error) => {
            console.error('Error saving content:', error);
            return NextResponse.json({ success: false, error: 'Failed to save content' });
        });
        return NextResponse.json({ success: true });
}
