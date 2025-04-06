
'use client'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import React, { useCallback } from 'react'

export default function SaveButton({contentId}: {contentId: number}) {
    const [editor] = useLexicalComposerContext();

    const handleSave = useCallback(() => {
      editor.update(() => {
        const editorState = editor.getEditorState();
        const json = editorState.toJSON();
  
        fetch('/api/save-content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contentId: contentId,
            content: json,
          }),
        }).then(() => {
          alert('Content saved!');
        });
      });
    }, [editor]);
  
    return (
    <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-2"
    onClick={handleSave}>Save</button>
    
  )
}
