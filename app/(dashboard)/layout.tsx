import NavBar from '@/components/NavBar'
export default function DashboardLayout({ children }:{children:React.ReactNode}){return(<div><NavBar/><main className='container mt-6 space-y-6'>{children}</main></div>)}
