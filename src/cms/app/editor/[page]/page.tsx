import React from 'react';
import Editor from '@/components/editor/Editor';

export default async function PageEditor({params}: {params: {page: string}}) {
    const { page } = await params;
    
  
  return (
    <Editor />
  )
}
