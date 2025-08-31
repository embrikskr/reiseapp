import type { Config } from 'tailwindcss'
export default {
  content: ['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['var(--font-inter)'] },
      colors: {
        brand: { 50:'#eef6ff',100:'#d8ebff',200:'#b6d7ff',300:'#8dbdff',400:'#619dff',500:'#3d7cff',600:'#265ff3',700:'#1f4cd1',800:'#1e40af',900:'#1b398e' }
      },
      boxShadow: { soft:'0 10px 30px rgba(2,6,23,0.06)', lift:'0 12px 28px rgba(2,6,23,0.12)' },
      backgroundImage: {
        hero:'radial-gradient(1000px 600px at 10% -10%, rgba(56,189,248,0.20), transparent 60%), radial-gradient(800px 400px at 90% 0%, rgba(99,102,241,0.18), transparent 60%)',
        glass:'linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0.55))'
      }
    }
  },
  plugins: [],
} satisfies Config
