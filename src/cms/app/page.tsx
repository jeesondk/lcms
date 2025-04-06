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
  const [addPageTargetPath, setAddPageTargetPath] = useState<string>('');
  const [selected, setSelected] = useState<{
    pageId: number;
    contentId: number;
    isoLanguage: string;
    type: 'rich' | 'string';
  } | null>(null);
  const [showAddPageModal, setShowAddPageModal] = useState(false);
  const [showAddContentModal, setShowAddContentModal] = useState(false);
  const [targetPage, setTargetPage] = useState<{ pageId: number, isoLanguage: string} | null>(null);
  const [value, setValue] = useState('');

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

  const handleUpdate = async () => {
    if (!selected) return;
  
    await fetch(`/api/content/${selected.contentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    });
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-gray-100 overflow-y-auto">
      <SidebarTree
        tree={tree}
        onSelectContent={(pageId, isoLanguage, contentIds, type) => {
          setSelected({ pageId, contentId: contentIds[0], isoLanguage, type: type as 'string' | 'rich' });
        }}
        onAddPage={(path) => {
          setAddPageTargetPath(path);
          setShowAddPageModal(true);
        }}
        onEditPage={(pageId) => console.log("Edit page", pageId)}
        onDeletePage={(pageId) => console.log("Delete page", pageId)}
        onAddContent={(pageId) => {
          setTargetPage({ pageId, isoLanguage: selected?.isoLanguage || '' });
          setShowAddContentModal(true);
        }}
        onEditContent={(pageId, lang) => console.log("Edit content", pageId, lang)}
        onDeleteContent={(pageId, lang) => console.log("Delete content", pageId, lang)}
      />
      </aside>

      {/* Main area */}
      <main className="flex-1 p-4 overflow-y-auto">
         {selected && selected.type === 'rich' ? (
          <Editor contentId={selected.contentId} />
        ) : selected && selected.type === 'string'?(
        <div className="max-w-xl space-y-4">
        <label className="block text-sm font-medium">Edit Content</label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>) : (
          <div className="text-gray-500 italic mt-10 text-center">
            Select a content item from the sidebar to begin editing.
          </div>
        )}
        <AddItemModal
          isOpen={showAddPageModal}
          onClose={() => setShowAddPageModal(false)}
          type="page"
          targetPath={addPageTargetPath}
          onSubmit={async ({ name }) => {
            console.log('Create page:', name, 'at path:', addPageTargetPath);
             
            const res = await fetch('/api/taxonomy', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                path: addPageTargetPath,
                name: name,
              }),
            });

            const data = await res.json();

            if (data.success) {
              // Close modal and reload taxonomy
              setShowAddPageModal(false);
              fetch('/api/taxonomy')
                .then((r) => r.json())
                .then(setTree);
            } else {
              console.error('Failed to create page:', data.error);
            }
          }}
          
        />

        <AddItemModal
          isOpen={showAddContentModal}
          onClose={() => setShowAddContentModal(false)}
          type="content"
          onSubmit={({ name, value, type }) => {
            if (targetPage) {
              fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  key: name,
                  value: type === 'string' ? value : undefined, // store value for strings only
                  type,
                  pageId: targetPage.pageId,
                  isoLanguage: targetPage.isoLanguage,
                }),
              }).then(() => {
                setShowAddContentModal(false);
                // Refresh the tree to reflect the new content
                fetch('/api/taxonomy')
                  .then((r) => r.json())
                  .then(setTree);
              });
            }
          }}
        />
      </main>
    </div>
  );
}
