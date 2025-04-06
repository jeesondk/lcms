import { NextRequest, NextResponse } from 'next/server';
import { getTaxonomyItems } from '@/db/repositories/taxonomy';
import { buildTree } from '@/services/treeNoteBuilder';

export async function GET(req: NextRequest) {
    console.log('Received request for taxonomy');
    console.log('Request URL:', req.url);
    console.log('Request Method:', req.method); 
    
    const taxonomy = await getTaxonomyItems();
    if (!taxonomy) {
        return NextResponse.json({ error: 'Taxonomy not found' }, { status: 404 });
    }

    console.log('Received taxonomy items:', taxonomy);
    console.log('Number of taxonomy items:', taxonomy.length);

    const tree = buildTree(taxonomy);
    console.log('Built tree:', JSON.stringify(tree, null, 2));


    return NextResponse.json(tree);
}

