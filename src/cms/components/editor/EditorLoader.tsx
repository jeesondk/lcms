// EditorLoader.tsx
'use client';

import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export default function EditorLoader({ contentId }: { contentId: number }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const loadContent = async () => {
      const res = await fetch(`/api/editor/get-content?id=${contentId}`);
      const state = await res.json();

      if (state) {
        editor.update(() => {
          const parsed = editor.parseEditorState(state);
          editor.setEditorState(parsed);
        });
      }
    };

    loadContent();
  }, [contentId, editor]);

  return null;
}
