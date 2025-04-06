import { db } from '@/lib/db';
import { taxonomy, pages, content } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { TaxonomyItem } from '@/types/taxonomyItem';


export async function getTaxonomyItems(): Promise<TaxonomyItem[]> {
  const results = await db
    .select({
      path: taxonomy.path,
      taxonomyName: taxonomy.name,
      pageId: pages.id,
      isoLanguage: pages.iso_language,
      contentId: content.id,
      contentKey: content.key,
    })
    .from(taxonomy)
    .leftJoin(pages, eq(taxonomy.id, pages.id))
    .leftJoin(content, eq(content.pageId, pages.id));

  console.log("Results from taxonomy query:", results);

  // Group content items under their pages
  const itemsByPage = new Map<number, TaxonomyItem>();

  for (const row of results) {
    if (!row.pageId) continue;

    if (!itemsByPage.has(row.pageId)) {
      itemsByPage.set(row.pageId, {
        path: row.path,
        name: row.taxonomyName,
        pageId: row.pageId,
        isoLanguage: row.isoLanguage ?? "",
        content: [],
      });
    }

    const item = itemsByPage.get(row.pageId)!;

    if (row.contentId != null && row.contentKey) {
      item.content.push({
        id: row.contentId,
        key: row.contentKey,
      });
    }
  }

  return Array.from(itemsByPage.values());
}

export async function getTaxonomyItem(path: string, name: string) {
  try {
    const item = await db
      .select()
      .from(taxonomy)
      .where(and(eq(taxonomy.path, path), eq(taxonomy.name, name)))
      .then((res) => res[0]);

    return item;
  } catch (error) {
    console.error('Error fetching taxonomy item:', error);
    throw error;
  }
}

export async function addTaxonomyItem(path: string, name: string) {
  try {
    const newItem = await db.insert(taxonomy).values({ path, name }).returning();
    return newItem[0];
  } catch (error) {
    console.error('Error adding taxonomy item:', error);
    throw error;
  }
}

export async function updateTaxonomyItem(id: number, name: string) {
  try {
    const updatedItem = await db.update(taxonomy).set({ name }).where(eq(taxonomy.id, id)).returning();
    return updatedItem[0];
  } catch (error) {
    console.error('Error updating taxonomy item:', error);
    throw error;
  }
}
