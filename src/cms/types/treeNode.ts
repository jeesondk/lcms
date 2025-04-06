export type TreeNode = {
  name: string;
  children: TreeNode[];
  pageId?: number;
  isoLanguage?: string;
  contentIds?: number[]; 
  isContentItem?: boolean; 
  contentId?: number;
};
  