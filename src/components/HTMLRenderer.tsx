import React from 'react'

interface HTMLRendererProps {
  htmlString: string
}

export default function HTMLRenderer({ htmlString }: HTMLRendererProps) {
  return (
    <div
      className="prose prose-sm"
      dangerouslySetInnerHTML={{ __html: htmlString }}
    />
  )
}
