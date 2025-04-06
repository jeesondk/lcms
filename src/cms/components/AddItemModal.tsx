// components/ui/AddItemModal.tsx
'use client';

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment, useState } from 'react';

type AddItemModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: 'page' | 'content';
  onSubmit: (formData: { name: string; language?: string }) => void;
  targetPath?: string;
};

export default function AddItemModal({
  isOpen,
  onClose,
  type,
  onSubmit,
  targetPath = '',
}: AddItemModalProps) {
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, language });
    setName('');
    setLanguage('');
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild as={Fragment}>
          <div className="fixed inset-0 bg-black/30" />
        </TransitionChild>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
              <DialogTitle className="text-lg font-bold mb-4">
                {type === 'page' ? 'Add New Page' : 'Add New Content'}
              </DialogTitle>
              <div className="text-sm text-gray-600 mb-2">
                Adding page under: <span className="font-medium text-gray-800">{targetPath}</span>
              </div>
              <form onSubmit={handleSubmit}>
                <label className="block mb-2 text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border rounded p-2 mb-4"
                />
                {type === 'content' && (
                  <>
                    <label className="block mb-2 text-sm font-medium">Language</label>
                    <input
                      type="text"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      required
                      placeholder="e.g. en, nl"
                      className="w-full border rounded p-2 mb-4"
                    />
                  </>
                )}
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={onClose} className="text-gray-500">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Add
                  </button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
