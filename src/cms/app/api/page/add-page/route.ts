import { NextRequest, NextResponse } from 'next/server';
import { addPage } from '@/db/repositories/page';

export async function POST(req: NextRequest) {
    const { content: body, id } = await req.json();
        console.log('Received contentId:', id);
        console.log('Received content:', body);
    
        if (!id) {
            return NextResponse.json({ error: 'Invalid contentId' }, { status: 400 });
        }
    
        if (!body) {
            return NextResponse.json({ error: 'Invalid content' }, { status: 400 });
        }
    
        saveContent(id, body)
            .then((result) => {
                console.log('Content saved:', result);
            })
            .catch((error) => {
                console.error('Error saving content:', error);
                return NextResponse.json({ success: false, error: 'Failed to save content' });
            });
            return NextResponse.json({ success: true });
    }