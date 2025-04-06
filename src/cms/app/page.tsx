'use client';
import Editor from "@/components/editor/Editor";
import { SidebarTree } from "@/components/SidebarTree";
import { TreeNode } from "@/types/treeNode";
import { useEffect, useState } from "react";


export default function Home() {
  // State to manage the taxonomy tree
  const [tree, setTree] = useState<TreeNode>({
    name: 'Root',
    children: [],
  });

  // State to manage the selected page and content
  const [selected, setSelected] = useState<{ pageId: number; contentId: number } | null>(null);

  // Fetch the taxonomy data from the server
   useEffect(() => {
    fetch('/api/taxonomy')
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched taxonomy data:', data);
        setTree(data);
      })
      .catch((error) => {
        console.error('Error fetching taxonomy data:', error);
      });
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-gray-100 overflow-y-auto">
      <SidebarTree
        tree={tree}
        onSelectContent={(pageId, isoLanguage, contentIds) => {
          // Load into editor
          console.log("Selected content:", pageId, isoLanguage, contentIds);
        }}
        onAddPage={(path) => console.log("Add page under path:", path)}
        onEditPage={(pageId) => console.log("Edit page", pageId)}
        onDeletePage={(pageId) => console.log("Delete page", pageId)}
        onAddContent={(pageId) => console.log("Add content to page", pageId)}
        onEditContent={(pageId, lang) => console.log("Edit content", pageId, lang)}
        onDeleteContent={(pageId, lang) => console.log("Delete content", pageId, lang)}
      />
      </aside>

      {/* Main area */}
      <main className="flex-1 p-4 overflow-y-auto">
         {selected ? (
          <Editor contentId={selected.contentId} />
        ) : (
          <div className="text-gray-500 italic mt-10 text-center">
            Select a content item from the sidebar to begin editing.
          </div>
        )}
      </main>
    </div>
  );
}
