'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useRef, useState } from 'react';
import { $getRoot } from 'lexical';

type AutoSavePluginProps = {
  contentId: number;
  interval?: number;
  onSave?: (timestamp: string) => void;
};

export function AutoSavePlugin({ contentId, interval = 5000, onSave }: AutoSavePluginProps) {
  const [editor] = useLexicalComposerContext();
  const lastSavedStateRef = useRef<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      editor.getEditorState().read(() => {
        const root = $getRoot();
        const textContent = root.getTextContent().trim();

        if (textContent.length === 0) {
          return;
        }
        const editorStateJSON = editor.getEditorState().toJSON();
        const currentStateString = JSON.stringify(editorStateJSON);

        if (currentStateString !== lastSavedStateRef.current) {
          lastSavedStateRef.current = currentStateString;

          fetch('/api/editor/save-content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: contentId,
              content: editorStateJSON,
            }),
          }).then((res) => {
            if (res.ok) {
              setLastSavedAt(new Date());
            } else {
              console.warn('Auto-save failed');
            }
          });
        }
      });
    }, interval);

    return () => clearInterval(timer);
  }, [editor, contentId, interval]);

  return (<div className="text-sm text-gray-500 mt-2">
    {lastSavedAt
      ? `Last saved at ${lastSavedAt.toLocaleTimeString()}`
      : 'Not saved yet'}
  </div>);
}
