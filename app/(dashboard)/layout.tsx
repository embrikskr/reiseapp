import NavBar from '@/components/NavBar'
import BottomNav from '@/components/BottomNav'
import { Suspense } from 'react'

export default function DashboardLayout({ children }:{children:React.ReactNode}){
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar/>
      <main className="container mt-6 mb-20 md:mb-0 space-y-6">
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </main>
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40">
        <BottomNav/>
      </div>
    </div>
  )
}
