'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  { href: '/', label: 'Feed', icon: '🏠' },
  { href: '/passport', label: 'Pass', icon: '🛂' },
  { href: '/new', label: 'Nytt', icon: '➕' },
  { href: '/settings', label: 'Meg', icon: '👤' },
]

export default function BottomNav(){
  const path = usePathname()
  return (
    <nav className="bottom-nav">
      <ul className="grid grid-cols-4">
        {items.map(it => {
          const active = path === it.href
          return (
            <li key={it.href}>
              <Link href={it.href} className={"flex flex-col items-center py-2 text-xs " + (active ? "text-blue-600 font-semibold" : "text-slate-600")}>
                <span aria-hidden>{it.icon}</span>
                {it.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
