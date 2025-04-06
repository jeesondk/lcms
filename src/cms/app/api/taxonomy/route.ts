// app/api/taxonomy/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { addTaxonomyItem, getTaxonomyItem, getTaxonomyItems } from '@/db/repositories/taxonomy';
import { buildTree } from '@/services/treeNoteBuilder';
import { addPage } from '@/db/repositories/page';
import { addContent } from '@/db/repositories/contentRepository';

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

export async function POST(req: NextRequest) {
    const body = await req.json();
      const { path, name } = body;
    
      if (!path || !name ) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }

      let targetPath = ''
      if(path.toLowerCase() === 'root') {
        targetPath = '/'
      }
      else {
        targetPath = path + '/' + name
      }
    
      try {
        let taxonomyRecord = await getTaxonomyItem(targetPath, name);
    
        if (!taxonomyRecord) {
          const inserted = await addTaxonomyItem(targetPath, name);
          taxonomyRecord = inserted;
        }

        const page = await addPage(taxonomyRecord.id, 'en');
        const content = await addContent(page[0].id, 'title', name);

        return NextResponse.json({ success: true, data: {taxonomyRecord, page, content} }, { status: 200 });
    } catch (error) {
        console.error('Error creating taxonomy item:', error);
        return NextResponse.json({ error: 'Failed to create taxonomy item' }, { status: 500 });
    }
}
