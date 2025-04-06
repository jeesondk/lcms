export type TaxonomyItem = {
  path: string;
  name: string;
  pageId: number;
  isoLanguage: string;
  content: {
    id: number;
    key: string;
  }[];
  };