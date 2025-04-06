import { db } from '@/lib/db';
import { taxonomy, pages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { TaxonomyItem } from '@/types/taxonomyItem';


export async function getTaxonomyItems(): Promise<TaxonomyItem[]> {
  const results = await db
    .select({
      path: taxonomy.path,
      taxonomyName: taxonomy.name,
      pageId: pages.id,
      pageName: pages.name,
      isoLanguage: pages.iso_language,
      contentIds: pages.content,
    })
    .from(taxonomy)
    .leftJoin(pages, eq(taxonomy.id, pages.taxonomyId));

    console.log('Results from taxonomy query:', results);

  const treeItems: TaxonomyItem[] = results
    .filter((r) => r.pageId !== null) // exclude taxonomy nodes without pages
    .map((r) => ({
      path: r.path,
      name: r.pageName || r.taxonomyName, // prefer page name, fallback to taxonomy
      pageId: r.pageId!,
      isoLanguage: r.isoLanguage ?? '',
      contentIds: r.contentIds ?? [],
    }));

  return treeItems;
}
