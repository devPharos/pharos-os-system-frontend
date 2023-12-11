'use client'

import { type Editor } from '@tiptap/react'
import * as Toggle from '@radix-ui/react-toggle'
import {
  Bold,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
} from 'lucide-react'

type Props = {
  editor: Editor | null
}

export function Toolbar({ editor }: Props) {
  if (!editor) {
    return null
  }

  return (
    <div className="bg-gray-600 p-1 flex gap-2 w-full rounded-lg ">
      <Toggle.Root
        pressed={editor.isActive('heading')}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        className={
          editor.isActive('heading')
            ? 'p-2 rounded-lg bg-gray-500 hover:bg-gray-600'
            : 'p-2 rounded-lg hover:bg-gray-500'
        }
        key={0}
      >
        <Heading2 className="w-4 h-4" />
      </Toggle.Root>

      <Toggle.Root
        pressed={editor.isActive('bold')}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        className={
          editor.isActive('bold')
            ? 'p-2 rounded-lg bg-gray-500 hover:bg-gray-600'
            : 'p-2 rounded-lg hover:bg-gray-500'
        }
        key={1}
      >
        <Bold className="w-4 h-4" />
      </Toggle.Root>

      <Toggle.Root
        pressed={editor.isActive('italic')}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        className={
          editor.isActive('italic')
            ? 'p-2 rounded-lg bg-gray-500 hover:bg-gray-600'
            : 'p-2 rounded-lg hover:bg-gray-500'
        }
        key={2}
      >
        <Italic className="w-4 h-4" />
      </Toggle.Root>

      <Toggle.Root
        pressed={editor.isActive('strike')}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        className={
          editor.isActive('strike')
            ? 'p-2 rounded-lg bg-gray-500 hover:bg-gray-600'
            : 'p-2 rounded-lg hover:bg-gray-500'
        }
        key={3}
      >
        <Strikethrough className="w-4 h-4" />
      </Toggle.Root>

      <div className="bg-gray-500 h-full w-px " />
      <Toggle.Root
        pressed={editor.isActive('bulletList')}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        className={
          editor.isActive('bulletList')
            ? 'p-2 rounded-lg bg-gray-500 hover:bg-gray-600'
            : 'p-2 rounded-lg hover:bg-gray-500'
        }
        key={4}
      >
        <List className="w-4 h-4" />
      </Toggle.Root>

      <Toggle.Root
        pressed={editor.isActive('orderedList')}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        className={
          editor.isActive('orderedList')
            ? 'p-2 rounded-lg bg-gray-500 hover:bg-gray-600'
            : 'p-2 rounded-lg hover:bg-gray-500'
        }
        key={5}
      >
        <ListOrdered className="w-4 h-4" />
      </Toggle.Root>
    </div>
  )
}
