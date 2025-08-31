import NavBar from '@/components/NavBar'
import { Suspense } from 'react'   // ⬅️ legg til

export default function DashboardLayout({ children }:{children:React.ReactNode}) {
  return (
    <div>
      <NavBar/>
      <main className='container mt-6 space-y-6'>
        {/* ⬇️ pakk children i Suspense så sider som bruker useSearchParams er trygge */}
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </main>
    </div>
  )
}
