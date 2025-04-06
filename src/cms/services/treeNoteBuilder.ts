import { TaxonomyItem } from "@/types/taxonomyItem";
import { TreeNode } from "@/types/treeNode";

export function buildTree(items: TaxonomyItem[]): TreeNode {
    const root: TreeNode = { name: "Root", children: [] };
  
    for (const item of items) {
      const segments = item.path.split("/").filter(Boolean);
      let current = root;
  
      // Traverse folder path if there are any segments
      for (const segment of segments) {
        let child = current.children.find(c => c.name === segment && !c.pageId);
        if (!child) {
          child = { name: segment, children: [] };
          current.children.push(child);
        }
        current = child;
      }
  
      // 🧠 Here's the key part: ensure grouping by pageName
      let pageGroup = current.children.find(c => c.name === item.name && !c.pageId);
      if (!pageGroup) {
        pageGroup = { name: item.name, children: [] };
        current.children.push(pageGroup);
      }
  
      // Add the language variant
      const langNode: TreeNode = {
        name: item.isoLanguage,
        pageId: item.pageId,
        isoLanguage: item.isoLanguage,
        contentIds: item.contentIds,
        children: [],
      };
  
      pageGroup.children.push(langNode);
    }
  
    return root;
  }