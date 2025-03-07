'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { Building2, ChevronDown, LayoutDashboard, LogOut, Receipt, WalletCards } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'

export default function Sidebar() {
  const { data: session } = useSession()
  const router = useRouter()
  const [openMenus, setOpenMenus] = useState<string[]>([])
  const [actualMenu, setActualMenu] = useState<string>('')
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

  useEffect(() => {
    setActualMenu(pathname)
  }, [])

  const isSubMenuOpen = (menu: string) => {
    if(actualMenu == menu) {
      return true
    }
    return false
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
        {/* <h1 className="text-xl font-semibold text-gray-700">Angiocardio Litoral</h1> */}
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
              <Link onClick={() => setActualMenu('/unidades/registrar')} href="/unidades/registrar" className={`block py-1 text-gray-600 hover:text-gray-900 ${isSubMenuOpen('/unidades/registrar') ? 'font-bold' : '' }`}>
                Novas Unidades
              </Link>
              <Link onClick={() => setActualMenu('/unidades/lista')} href="/unidades/lista" className={`block py-1 text-gray-600 hover:text-gray-900 ${isSubMenuOpen('/unidades/lista') ? 'font-bold' : '' }`}>
                Unidades Cadastradas
              </Link>
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => toggleMenu('debitos')}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-gray-700 hover:bg-white ${(isMenuOpen('debitos') || isMenuOpenAtRefresh('debitos')) ? 'bg-white border rounded-md' : ''}`}
          >
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Contas a pagar
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${isMenuOpen('debitos') ? 'rotate-180' : ''}`} />
          </button>
          {(isMenuOpen('debitos') || isMenuOpenAtRefresh('debitos'))  && (
            <div className="pl-10 pt-1 space-y-1">
              <Link onClick={() => setActualMenu('/debitos/registrar')}  href="/debitos/registrar" className={`block py-1 text-gray-600 hover:text-gray-900 ${isSubMenuOpen('/debitos/registrar') ? 'font-bold' : '' }`}>
                Adicionar Despesa
              </Link>
              <Link onClick={() => setActualMenu('/debitos/lista')} href="/debitos/lista" className={`block py-1 text-gray-600 hover:text-gray-900 ${isSubMenuOpen('/debitos/lista') ? 'font-bold' : '' }`}>
                Histórico de Despesas
              </Link>
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => toggleMenu('receitas')}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-gray-700 hover:bg-white ${(isMenuOpen('receitas') || isMenuOpenAtRefresh('receitas')) ? 'bg-white border rounded-md' : ''}`}
          >
            <div className="flex items-center gap-2">
              <WalletCards className="h-5 w-5" />
              Contas a receber
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${isMenuOpen('receitas') ? 'rotate-180' : ''}`} />
          </button>
          {(isMenuOpen('receitas') || isMenuOpenAtRefresh('receitas')) && (
            <div className="pl-10 pt-1">
              <Link onClick={() => setActualMenu('/receitas/registrar')} href="/receitas/registrar" className={`block py-1 text-gray-600 hover:text-gray-900 ${isSubMenuOpen('/receitas/registrar') ? 'font-bold' : '' }`}>
                Adicionar Receita
              </Link>
              <Link onClick={() => setActualMenu('/receitas/lista')} href="/receitas/lista" className={`block py-1 text-gray-600 hover:text-gray-900 ${isSubMenuOpen('/receitas/lista') ? 'font-bold' : '' }`}>
                Histórico de Receitas
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