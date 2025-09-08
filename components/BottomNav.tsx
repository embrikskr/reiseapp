'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Globe2, PlusCircle, User, Settings } from 'lucide-react'

const items = [
  { href: '/', label: 'Feed', icon: Home },
  { href: '/passport', label: 'Pass', icon: Globe2 },
  { href: '/new', label: 'Nytt', icon: PlusCircle },
  { href: '/settings', label: 'Meg', icon: Settings },
  { href: '/profile/meg', label: 'Profil', icon: User },
]

export default function BottomNav(){
  const path = usePathname()
  return (
    <nav className="bottom-nav">
      <ul className="grid grid-cols-5">
        {items.map(it => {
          const active = path === it.href
          const Icon = it.icon
          return (
            <li key={it.href}>
              <Link href={it.href} className={"flex flex-col items-center py-2 text-[11px] " + (active ? "text-blue-600 font-semibold" : "text-slate-600 dark:text-slate-300")}>
                <Icon size={18} />
                {it.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
