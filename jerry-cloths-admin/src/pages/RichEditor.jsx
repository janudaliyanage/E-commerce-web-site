import React, { useRef, useCallback } from 'react';
import { Bold, Italic, Heading2, List, Image as ImageIcon, Minus } from 'lucide-react';
import { uploadImage } from '../services/api';

const RichEditor = ({ value, onChange }) => {
    const editorRef = useRef(null);

    // Initialize content once
    const initRef = useRef(false);
    if (!initRef.current && editorRef.current && value) {
        editorRef.current.innerHTML = value;
        initRef.current = true;
    }

    const exec = (command, val = null) => {
        editorRef.current.focus();
        document.execCommand(command, false, val);
        notifyChange();
    };

    const notifyChange = useCallback(() => {
        if (onChange && editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    }, [onChange]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const url = await uploadImage(file);
        if (url) {
            editorRef.current.focus();
            document.execCommand('insertImage', false, url);
            // Style the image after insert
            const imgs = editorRef.current.querySelectorAll('img');
            imgs.forEach(img => {
                img.style.maxWidth = '100%';
                img.style.borderRadius = '8px';
                img.style.margin = '8px 0';
            });
            notifyChange();
        } else {
            alert('Failed to upload image');
        }
        e.target.value = '';
    };

    const toolbarButtons = [
        { icon: Bold, action: () => exec('bold'), title: 'Bold' },
        { icon: Italic, action: () => exec('italic'), title: 'Italic' },
        { icon: Heading2, action: () => exec('formatBlock', '<h2>'), title: 'Heading' },
        { icon: List, action: () => exec('insertUnorderedList'), title: 'List' },
        { icon: Minus, action: () => exec('insertHorizontalRule'), title: 'Divider' },
    ];

    return (
        <div className="border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-black transition">
            {/* Toolbar */}
            <div className="flex items-center gap-1 px-3 py-2 bg-gray-50 border-b border-gray-200 flex-wrap">
                {toolbarButtons.map(({ icon: Icon, action, title }) => (
                    <button
                        key={title}
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); action(); }}
                        title={title}
                        className="p-1.5 rounded hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition"
                    >
                        <Icon size={16} />
                    </button>
                ))}

                {/* Divider */}
                <div className="w-px h-5 bg-gray-300 mx-1" />

                {/* Image Upload */}
                <label className="p-1.5 rounded hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition cursor-pointer" title="Insert Image">
                    <ImageIcon size={16} />
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
            </div>

            {/* Editable Area */}
            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={notifyChange}
                onBlur={notifyChange}
                className="min-h-48 p-4 text-sm text-gray-700 leading-relaxed focus:outline-none"
                style={{
                    lineHeight: '1.7',
                }}
                data-placeholder="Write a rich description... You can add text, headings, lists and images."
            />

            <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        [contenteditable] h2 {
          font-size: 1.2rem;
          font-weight: 700;
          margin: 12px 0 6px;
          color: #111;
        }
        [contenteditable] ul {
          list-style: disc;
          padding-left: 1.5rem;
          margin: 6px 0;
        }
        [contenteditable] img {
          max-width: 100%;
          border-radius: 8px;
          margin: 8px 0;
          display: block;
        }
        [contenteditable] hr {
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 12px 0;
        }
      `}</style>
        </div>
    );
};

export default RichEditor;