'use client'
import '../global.css'

export default function PageTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col items-center">{children}</div>
  )
}
