'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Building2, ChevronDown, LayoutDashboard, LogOut, Receipt, WalletCards } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'

export default function Sidebar() {
  const { data: session } = useSession()
  const router = useRouter()
  const [openMenus, setOpenMenus] = useState<string[]>([])
  const pathname = usePathname()

  const toggleMenu = (menu: string) => {
    setOpenMenus(prevOpenMenus =>
      prevOpenMenus.includes(menu)
      ? prevOpenMenus.filter(item => item !== menu)
      : [...prevOpenMenus, menu]
      )
    }
    
  const isMenuOpen = (menu: string) => openMenus.includes(menu)

  const isMenuOpenAtRefresh = (menu: string) => {
    if(menu === pathname.split('/')[1]) {
      return true
    }

    return false
  }

  const isSubMenuOpen = (menu: string) => {
    console.log(pathname, menu)
    return true
  }

  function logout() {
    signOut({
      redirect: false
    })

    router.replace("/")

  }

  return (
    <div className="flex h-screen w-80 flex-col bg-[#F5F7F9] p-6 border-r border-[#D3D3D3]">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-700">Angiocardio Litoral</h1>
      </div>
      
      <nav className="flex flex-1 flex-col gap-2">
        <Link 
          href="/dashboard"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-white"
        >
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </Link>

        <div>
          <button
            onClick={() => toggleMenu('unidades')}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-gray-700 hover:bg-white ${(isMenuOpen('unidades') || isMenuOpenAtRefresh('unidades')) ? 'bg-white border rounded-md' : ''}`}
          >
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Unidades
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${isMenuOpen('unidades') ? 'rotate-180' : ''}`} />
          </button>
          {(isMenuOpen('unidades') || isMenuOpenAtRefresh('unidades')) && (
            <div className="pl-10 pt-1">
              <Link href="/unidades/registrar" className={`block py-1 text-gray-600 hover:text-gray-900 ${isSubMenuOpen('unidades/registrar') ? 'font-bold' : '' }`}>
                Registrar
              </Link>
              <Link href="/unidades/lista" className={`block py-1 text-gray-600 hover:text-gray-900 ${isSubMenuOpen('unidades/lista') ? 'font-bold' : '' }`}>
                Lista de Unidades
              </Link>
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => toggleMenu('payables')}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-gray-700 hover:bg-white ${isMenuOpen('payables') ? 'bg-white border rounded-md' : ''}`}
          >
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Contas a pagar
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${isMenuOpen('payables') ? 'rotate-180' : ''}`} />
          </button>
          {isMenuOpen('payables') && (
            <div className="pl-10 pt-1 space-y-1">
              <Link href="/payables/register" className="block py-1 text-gray-600 hover:text-gray-900">
                Registrar
              </Link>
              <Link href="/payables/list" className="block py-1 text-gray-600 hover:text-gray-900">
                Lista de todos os Débitos
              </Link>
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => toggleMenu('receivables')}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-gray-700 hover:bg-white ${isMenuOpen('receivables') ? 'bg-white border rounded-md' : ''}`}
          >
            <div className="flex items-center gap-2">
              <WalletCards className="h-5 w-5" />
              Contas a receber
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${isMenuOpen('receivables') ? 'rotate-180' : ''}`} />
          </button>
          {isMenuOpen('receivables') && (
            <div className="pl-10 pt-1">
              <Link href="/receivables/list" className="block py-1 text-gray-600 hover:text-gray-900">
                Lista de Recebíveis
              </Link>
            </div>
          )}
        </div>
      </nav>

      <button
        onClick={() => logout()}
        className="mt-auto flex w-full items-center justify-start gap-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-white"
      >
        <LogOut className="h-5 w-5" />
        Sair da conta
      </button>
    </div>
  )
}