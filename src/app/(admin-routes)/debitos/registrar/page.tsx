'use client'

import { useEffect, useState } from 'react'
import { CalendarIcon, Clipboard, PlusCircle } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import CurrencyInput from '@/components/CurrencyInput'

type DebitEntry = {
  id: string;
  description: string;
  valueToPay: string;
  dueDate: string;
  expectedDate: string;
  issueDate: string;
  IsBaixa: boolean;
  baixaDate: string;
  unitId: string;
  unit: Unit;
}

interface Unit {
  id: string
  Description: string
  CNP: string
}

export default function DebitosRegistro() {
  const [debits, setDebits] = useState<DebitEntry[]>([])
  const [description, setDescription] = useState('')
  const [valueToPay, setValueToPay] = useState(0)
  const [selectedUnit, setSelectedUnit] = useState('')
  const [issueDate, setIssueDate] = useState('')
  const [expectedDate, SetExpectedDate] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [units, setUnits] = useState<Unit[]>([])
  // const [isFirstType, setIsFirstType] = useState(true)

  useEffect(() => {
    async function fetchUnits() {
      try {
        const response = await fetch('/api/unidades');
        const data = await response.json();
        
        setUnits(data);
      } catch (error) {
        console.error('Error fetching units:', error);
      }
    }

    fetchUnits();
  }, [])

  useEffect(() => {
    if (units.length > 0) {
      setSelectedUnit(units[0].id); // Define a primeira unidade como selecionada
    }
  }, [units])

  useEffect(() => {
    async function fetchDebits() {
      try {
        const response = await fetch('/api/debitos');
        const data = await response.json();
        console.log(data)
        
        setDebits(data);
      } catch (error) {
        console.error('Error fetching units:', error);
      }
    }

    fetchDebits();
  }, [])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const currentDate = new Date()
    const expectedDateInput = new Date(expectedDate)

    const checkOverdue = () => {
      if(expectedDateInput > currentDate) {
        return true
      }

      if(expectedDateInput < currentDate) {
        return false
      }
    }

    console.log(checkOverdue())

    try {
      const response = await fetch('/api/debitos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          description,
          valueToPay,
          dueDate,
          expectedDate,
          issueDate,
          unitId: selectedUnit,
          isOverdue: checkOverdue()
         }),
      });

      if (response.ok) {
        const data = await response.json();
        setDebits((prevDebits) => [...prevDebits, data]);
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUnit(e.target.value);
  };

  return (
    <div className="p-6 flex-1">
      <h1 className="text-xl font-medium">Adicionar Despesa</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Selecione a unidade</label>
            <select className="w-full max-w-xs px-3 py-2 border rounded-md" onChange={handleSelectChange}>
              {units.map(unit => (
                <option key={unit.id} value={unit.id}>{unit.Description}</option>
              ))}
            </select>
          </div>

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
                {/* <span className="absolute left-3 top-2">R$</span> */}
                {/* <input
                  type="text"
                  className="w-full pl-8 pr-3 py-2 border rounded-md"
                  value={valueToPay}
                  onChange={handleInputChange}
                /> */}
                <CurrencyInput value={valueToPay} onChange={(value) => setValueToPay(value)} />
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
                  onChange={(e) => {
                    setDueDate(e.target.value)
                    
                    SetExpectedDate(e.target.value)
                  }}
                />
                <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Data prevista de pagamento</label>
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

        <button
          type="submit"
          className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800"
        >
          Salvar
        </button>
      </form>


      <div className="mt-6">
        <h2 className="text-sm font-medium text-gray-700 mb-4">Últimas despesas adicionadas</h2>
        <div className="border rounded-lg overflow-hidden">
        {debits.length === 0 ? (
          <div className="flex justify-center items-center py-10 text-center">
            <div>
              <Clipboard className="mx-auto h-12 w-12 text-gray-400" />
              <p className="text-lg text-gray-600 mt-4">
                Nenhuma despesa encontrada.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Parece que você ainda não tem despesas cadastradas. Que tal adicionar uma agora?
              </p>
            </div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Descrição
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Valor
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Data de Vencimento
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  data prevista de pagamento
                </th>
                {/* <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Editar
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Excluir
                </th> */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {debits.map((debit) => (
                <tr key={debit.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {debit.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(Number(debit.valueToPay))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(debit.dueDate), 'dd/MM/yyyy', { locale: ptBR })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(debit.expectedDate), 'dd/MM/yyyy', { locale: ptBR })}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Pencil className="h-4 w-4" />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        </div>
      </div>

    </div>
  )
}