'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Save, ArrowLeft } from 'lucide-react'
import Swal from 'sweetalert2';

interface Unit {
  id: string
  Description: string
  CNP: string
}

export default function EditUnit() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id') // Obtém o ID da query string
  const [unit, setUnit] = useState<Unit | null>(null)
  const [description, setDescription] = useState('')
  const [cnpj, setCnpj] = useState('')

  const handleSuccess = () => {
    Swal.fire({
      title: 'Sucesso!',
      text: 'Unidade atualizada com sucesso!',
      icon: 'success',
      confirmButtonText: 'OK',
      timer: 3000
    });
  };

  useEffect(() => {
    if (!id) return

    async function fetchUnit() {
      try {
        const response = await fetch(`/api/unidades?id=${id}`)
        if (response.ok) {
          const data = await response.json()
          setUnit(data)
          setDescription(data.Description)
          setCnpj(data.CNPJ)
        } else {
          console.error('Erro ao buscar unidade.')
        }
      } catch (error) {
        console.error('Erro ao buscar unidade:', error)
      }
    }

    fetchUnit()
  }, [id])

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/unidades?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Description: description, CNPJ: cnpj }),
      })

      if (response.ok) {
        handleSuccess()
        router.push('/unidades/lista') // Redireciona para a lista de unidades
      } else {
        console.error('Erro ao atualizar unidade.')
      }
    } catch (error) {
      console.error('Erro ao atualizar unidade:', error)
    }
  }

  if (!unit) {
    return <p>Carregando unidade...</p>
  }

  return (
    <div className="p-6 flex-1">
      <button
        onClick={() => router.back()}
        className="flex items-center mb-6 text-gray-700 hover:text-gray-900"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Voltar
      </button>

      <h1 className="text-xl font-semibold text-gray-900 mb-6">Editar Unidade</h1>
      
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Descrição
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="cnp" className="block text-sm font-medium text-gray-700">
              CNP
            </label>
            <input
              type="text"
              id="cnp"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Save className="h-5 w-5 mr-2" />
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  )
}
