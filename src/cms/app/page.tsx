'use client';
import AddItemModal from "@/components/AddItemModal";
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
  const [addPageTargetPath, setAddPageTargetPath] = useState<string | null>(null);
  const [selected, setSelected] = useState<{ pageId: number; contentId: number, isoLanguage: string } | null>(null);
  const [showAddPageModal, setShowAddPageModal] = useState(false);
  const [showAddContentModal, setShowAddContentModal] = useState(false);
  const [targetPageId, setTargetPageId] = useState<number | null>(null);

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
          setSelected({ pageId, contentId: contentIds[0], isoLanguage });
        }}
        onAddPage={(path) => {
          setAddPageTargetPath(path);
          setShowAddPageModal(true);
        }}
        onEditPage={(pageId) => console.log("Edit page", pageId)}
        onDeletePage={(pageId) => console.log("Delete page", pageId)}
        onAddContent={(pageId) => {
          setTargetPageId(pageId);
          setShowAddContentModal(true);
        }}
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
        <AddItemModal
          isOpen={showAddPageModal}
          onClose={() => setShowAddPageModal(false)}
          type="page"
          targetPath={addPageTargetPath}
          onSubmit={({ name }) => {
            // Call your API to create the page
            console.log('Create page:', name);
          }}
        />

        <AddItemModal
          isOpen={showAddContentModal}
          onClose={() => setShowAddContentModal(false)}
          type="content"
          onSubmit={({ name, language }) => {
            if (targetPageId != null) {
              // Call your API to create content under the page
              console.log('Create content:', name, 'for page:', targetPageId, 'lang:', language);
            }
          }}
        />
      </main>
    </div>
  );
}
