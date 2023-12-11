'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Toolbar } from './Toolbar'
import Heading from '@tiptap/extension-heading'
import Image from '@tiptap/extension-image'

const TipTap = ({
  description,
  onChange,
}: {
  description: string
  onChange: (richText: string) => void
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'px-6 text-gray-100 list-disc',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'px-6 text-gray-100 list-decimal',
          },
        },
      }),
      Heading.configure({
        HTMLAttributes: {
          class: 'text-xl font-bold text-gray-100',
          levels: [2],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: description,
    editorProps: {
      attributes: {
        class:
          'h-fit flex-col min-h-[250px] outline-none text-gray-100 text-wrap text-sm relative w-full tap-highlight-transparent shadow-sm px-3 py-14 rounded-medium  items-center justify-between gap-0 transition-background motion-reduce:transition-none !duration-150 outline-none focus:z-10 h-14 py-2 bg-gray-700 hover:bg-gray-800 focus:bg-gray-800  focus:ring-yellow-500',
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  return (
    <div className="flex flex-col gap-2 w-full">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className="w-full" />
    </div>
  )
}

export default TipTap
