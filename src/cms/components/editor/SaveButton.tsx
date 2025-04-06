
'use client'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import React, { useCallback } from 'react'

export default function SaveButton({contentId}: {contentId: number}) {
    const [editor] = useLexicalComposerContext();

    const handleSave = useCallback(() => {
      editor.update(() => {
        const editorStateJSON = editor.getEditorState().toJSON();
  
        fetch('/api/editor/save-content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: contentId,
            content: editorStateJSON,
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
