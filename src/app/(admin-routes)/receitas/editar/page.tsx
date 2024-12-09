'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Save, ArrowLeft, CalendarIcon } from 'lucide-react'
import Swal from 'sweetalert2';
import { format, parse } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type DebitEntry = {
  id: string
  description: string
  value: number
  dueDate: string
  issueDate: string
  valueToPay: string
  unitId: string
  expectedDate: string
}

interface Unit {
  id: number
  Description: string
  CNP: string
}

export default function EditDebit() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id') // Obtém o ID da query string
  const [debit, setDebit] = useState<DebitEntry | null>(null)
  const [valueToPay, setValueToPay] = useState('')
  const [description, setDescription] = useState('')
  const [selectedUnit, setSelectedUnit] = useState('')
  const [issueDate, setIssueDate] = useState('')
  const [expectedDate, SetExpectedDate] = useState<string>('')
  const [dueDate, setDueDate] = useState('')

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

    async function fetchDebit() {
      try {
        const response = await fetch(`/api/creditos?id=${id}`)
        if (response.ok) {
          const data = await response.json()
          setDebit(data)
          setDescription(data.description)
          setValueToPay(data.valueToPay)
          
          const parseExpectedDate = new Date(data.expectedDate)
          console.log(parseExpectedDate)
          const parsedDate = new Date(parseExpectedDate.getTime() + parseExpectedDate.getTimezoneOffset() * 60000); 
          const formattedDate = format(parsedDate, 'yyyy-MM-dd')
          SetExpectedDate(formattedDate)

          const parseIssueDate = format(new Date(data.issueDate), 'dd/MM/yyyy', { locale: ptBR })
          const parsedIssueDate = parse(parseIssueDate, 'dd/MM/yyyy', new Date())
          const formattedIssueDate = format(parsedIssueDate, 'yyyy-MM-dd')
          setIssueDate(formattedIssueDate)
          console.log(formattedIssueDate)

          const parseDueDate = format(new Date(data.dueDate), 'dd/MM/yyyy', { locale: ptBR })
          const parsedDueDate = parse(parseDueDate, 'dd/MM/yyyy', new Date())
          const formattedDueDate = format(parsedDueDate, 'yyyy-MM-dd')
          setDueDate(formattedDueDate)
        } else {
          console.error('Erro ao buscar unidade.')
        }
      } catch (error) {
        console.error('Erro ao buscar unidade:', error)
      }
    }

    fetchDebit()
  }, [id])

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/creditos?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          description: description,
          expectedDate: expectedDate,
          issueDate: issueDate,
          dueDate: dueDate,
          valueToPay: valueToPay
         }),
      })

      if (response.ok) {
        handleSuccess()
        router.push('/receitas/lista') // Redireciona para a lista de unidades
      } else {
        console.error('Erro ao atualizar unidade.')
      }
    } catch (error) {
      console.error('Erro ao atualizar unidade:', error)
    }
  }

  if (!debit) {
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

      <h1 className="text-xl font-semibold text-gray-900 mb-6">Editar lançamento de débito</h1>

      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
        <div className="space-y-4">
          {/* <div>
            <label className="block text-sm mb-1">Selecione a unidade</label>
            <select className="w-full max-w-xs px-3 py-2 border rounded-md">
              {units.map(unit => (
                <option key={unit.id} value={unit.id}>{unit.Description}</option>
              ))}
            </select>
          </div> */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Descrição</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Valor</label>
              <div className="relative">
                <span className="absolute left-3 top-2">R$</span>
                <input
                  type="text"
                  className="w-full pl-8 pr-3 py-2 border rounded-md"
                  value={valueToPay}
                  onChange={(e) => setValueToPay(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-1">Data de Emissão</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-md"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                />
                <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Data de vencimento</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-md"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
                <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Data prevista de baixa</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-md"
                  value={expectedDate}
                  onChange={(e) => SetExpectedDate(e.target.value)}
                />
                <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
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
      
      {/* <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
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
              id="topay "
              value={valueToPay}
              onChange={(e) => setValueToPay(e.target.value)}
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
      </form> */}
    </div>
  )
}
