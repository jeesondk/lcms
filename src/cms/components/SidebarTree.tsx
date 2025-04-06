'use client';

import { useState } from 'react';
import { TreeNode } from '@/types/treeNode';
import {
  FileText,
  Folder,
  PencilSimple,
  Trash,
  Plus,
  CaretDown,
  CaretRight,
} from '@phosphor-icons/react';

type SidebarTreeProps = {
  tree: TreeNode;
  onSelectContent: (pageId: number, isoLanguage: string, contentIds: number[], type: string) => void;
  onAddPage: (parentPath: string) => void;
  onEditPage: (pageId: number) => void;
  onDeletePage: (pageId: number) => void;
  onAddContent: (pageId: number) => void;
  onEditContent: (pageId: number, isoLanguage: string) => void;
  onDeleteContent: (pageId: number, isoLanguage: string) => void;
};

export function SidebarTree({
  tree,
  onSelectContent,
  onAddPage,
  onEditPage,
  onDeletePage,
  onAddContent,
  onEditContent,
  onDeleteContent,
}: SidebarTreeProps) {
  const [selected, setSelected] = useState<{
    pageId: number;
    isoLanguage: string;
    contentId?: number;
  } | null>(null);

  const handleSelect = (pageId: number, isoLanguage: string, contentIds: number[], type: string) => {
    setSelected({ pageId, isoLanguage, contentId: contentIds[0] }); // assuming one selected at a time
    onSelectContent(pageId, isoLanguage, contentIds, type);
  };

  return (
    <div className="w-64 bg-gray-100 h-full overflow-y-auto p-2 border-r text-sm">
      <TreeNodeItem
        node={tree}
        onSelectContent={handleSelect}
        selected={selected}
        level={0}
        onAddPage={onAddPage}
        onEditPage={onEditPage}
        onDeletePage={onDeletePage}
        onAddContent={onAddContent}
        onEditContent={onEditContent}
        onDeleteContent={onDeleteContent}
      />
    </div>
  );
}

type TreeNodeItemProps = {
  node: TreeNode;
  onSelectContent: (pageId: number, isoLanguage: string, contentIds: number[], type: string) => void;
  selected: { pageId: number; isoLanguage: string } | null;
  level: number;
  onAddPage: (path: string) => void;
  onEditPage: (pageId: number) => void;
  onDeletePage: (pageId: number) => void;
  onAddContent: (pageId: number) => void;
  onEditContent: (pageId: number, isoLanguage: string) => void;
  onDeleteContent: (pageId: number, isoLanguage: string) => void;
};

function TreeNodeItem({
  node,
  onSelectContent,
  selected,
  level,
  onAddPage,
  onEditPage,
  onDeletePage,
  onAddContent,
  onEditContent,
  onDeleteContent,
}: TreeNodeItemProps) {
  const isContentItem = !!node.isContentItem;
  const isLanguageNode = !!node.pageId && !!node.isoLanguage && !isContentItem;

  const isSelected =
    isContentItem &&
    selected?.pageId === node.pageId &&
    selected?.isoLanguage === node.isoLanguage;
  const [open, setOpen] = useState(true);

  const isLeaf = !node.children || node.children.length === 0;

  const handleClick = () => {
    if (isContentItem && node.pageId && node.isoLanguage && node.contentId != null) {
      onSelectContent(node.pageId, node.isoLanguage, [node.contentId], 'string');
    } else {
      setOpen(!open);
    }
  };

  const icon = isContentItem ? (
      <FileText size={14} />
    ) : isLanguageNode ? (
      <Folder size={14} />
    ) : (
      <Folder size={16} weight="regular" />
    );

  return (
    <div className="pl-2">
      <div
        className={`flex items-center gap-1 py-1 px-2 rounded group ${
          isSelected ? 'bg-blue-100 text-blue-800 font-semibold' : ''
        }`}
        style={{ paddingLeft: `${level * 16}px` }}
        onClick={handleClick}
      >
        {!isLeaf && (
          <span className="text-xs text-gray-500">
            {open ? <CaretDown size={12} /> : <CaretRight size={12} />}
          </span>
        )}
        {icon}
        <span
          className={`${
            isContentItem
              ? 'text-green-700 cursor-pointer'
              : isLanguageNode
              ? 'text-blue-600 cursor-pointer'
              : 'font-medium'
              }`}
            >
              {node.name}
        </span>

        <div className="ml-auto hidden group-hover:flex gap-1">
          {!isLanguageNode ? (
            <>
              <button onClick={() => onAddPage(node.name)}>
                <Plus size={14} />
              </button>
              {node.pageId && (
                <>
                  <button onClick={() => onEditPage(node.pageId!)}>
                    <PencilSimple size={14} />
                  </button>
                  <button onClick={() => onDeletePage(node.pageId!)}>
                    <Trash size={14} />
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <button onClick={(e) => {
                e.stopPropagation();
                onAddContent(node.pageId!);
              }}>
                <Plus size={14} />
              </button>
              <button onClick={(e) => {
                e.stopPropagation();
                onEditContent(node.pageId!, node.isoLanguage!);
              }}>
                <PencilSimple size={14} />
              </button>
              <button onClick={(e) => {
                e.stopPropagation();
                onDeleteContent(node.pageId!, node.isoLanguage!);
              }}>
                <Trash size={14} />
              </button>
            </>
          )}
        </div>
      </div>

      {open &&
        node.children &&
        node.children.map((child, index) => (
          <TreeNodeItem
            key={`${node.name}-${index}`}
            node={child}
            onSelectContent={onSelectContent}
            selected={selected}
            level={level + 1}
            onAddPage={onAddPage}
            onEditPage={onEditPage}
            onDeletePage={onDeletePage}
            onAddContent={onAddContent}
            onEditContent={onEditContent}
            onDeleteContent={onDeleteContent}
          />
        ))}
    </div>
  );
}
