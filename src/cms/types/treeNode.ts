export type TreeNode = {
    name: string;
    pageId?: number;
    isoLanguage?: string;
    contentIds?: number[];
    children: TreeNode[];
  };
  