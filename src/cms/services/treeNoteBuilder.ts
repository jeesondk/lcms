import { TaxonomyItem } from "@/types/taxonomyItem";
import { TreeNode } from "@/types/treeNode";

export function buildTree(items: TaxonomyItem[]): TreeNode {
  const root: TreeNode = { name: "Root", children: [] };

  for (const item of items) {
    const segments = item.path.split("/").filter(Boolean);
    let current = root;

    // Traverse or create folder segments
    for (const segment of segments) {
      let child = current.children.find(c => c.name === segment && !c.pageId);
      if (!child) {
        child = { name: segment, children: [] };
        current.children.push(child);
      }
      current = child;
    }

    // Page node
    let pageGroup = current.children.find(c => c.name === item.name && !c.pageId);
    if (!pageGroup) {
      pageGroup = { name: item.name, children: [] };
      current.children.push(pageGroup);
    }

    // Language node
    let languageNode = pageGroup.children.find(
      c => c.isoLanguage === item.isoLanguage && c.pageId === item.pageId
    );
    if (!languageNode) {
      languageNode = {
        name: item.isoLanguage,
        isoLanguage: item.isoLanguage,
        pageId: item.pageId,
        children: [],
      };
      pageGroup.children.push(languageNode);
    }

    // Add individual content items
    if (item.content && Array.isArray(item.content)) {
      for (const content of item.content) {
        const contentNode: TreeNode = {
          name: content.key,
          pageId: item.pageId,
          isoLanguage: item.isoLanguage,
          contentId: content.id,
          isContentItem: true,
          children: [],
        };
        languageNode.children.push(contentNode);
      }
    }
  }

  return root;
}
