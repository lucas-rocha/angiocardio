'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Save, ArrowLeft, CalendarIcon } from 'lucide-react'
import Swal from 'sweetalert2';
import { format, parse } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import EditBaixa from '@/components/EditBaixa';
import CurrencyInput from '@/components/CurrencyInput';

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
  CNPJ: string
}

interface DebitoUpdate {
  description: string;
  expectedDate: string;
  issueDate: string;
  dueDate: string;
  valueToPay: number;
  isBaixa: boolean;
  baixaDate?: string | null; // Adicionando baixaDate como opcional
}

export default function EditDebit() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id') // Obtém o ID da query string
  const [debit, setDebit] = useState<DebitEntry | null>(null)
  const [valueToPay, setValueToPay] = useState(0)
  const [description, setDescription] = useState('')
  const [selectedUnit, setSelectedUnit] = useState('')
  const [issueDate, setIssueDate] = useState('')
  const [expectedDate, SetExpectedDate] = useState<string>('')
  const [dueDate, setDueDate] = useState('')
  const [isPago, setIsPago] = useState(false)
  const [baixaDate, setBaixaDate] = useState('')
  const [newDateBaixa, setNewDateBaixa] = useState('')

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

          const parseIssueDate = new Date(data.issueDate)
          const parsedIssueDate = new Date(parseIssueDate.getTime() + parseIssueDate.getTimezoneOffset() * 60000)
          const formattedIssueDate = format(parsedIssueDate, 'yyyy-MM-dd')
          setIssueDate(formattedIssueDate)

          const parseDueDate = new Date(data.dueDate)
          const parsedDueDate = new Date(parseDueDate.getTime() + parseDueDate.getTimezoneOffset() * 60000)
          const formattedDueDate = format(parsedDueDate, 'yyyy-MM-dd')
          setDueDate(formattedDueDate)


          setIsPago(data.IsBaixa)

          const parseBaixaDate = new Date(data.baixaDate)
          const parsedBaixaDate = new Date(parseBaixaDate.getTime() + parseBaixaDate.getTimezoneOffset() * 60000)
          const formattedBaixaDate = format(parsedBaixaDate, 'dd/MM/yyyy')
          setBaixaDate(formattedBaixaDate)
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
      const isTrue = newDateBaixa ? true : false

      const body: DebitoUpdate = {
        description: description,
        expectedDate: expectedDate,
        issueDate: issueDate,
        dueDate: dueDate,
        valueToPay: valueToPay,
        isBaixa: isTrue,
      };

      if (newDateBaixa) {
        body.baixaDate = newDateBaixa;
      } else {
        body.baixaDate = null; // Ou remova a propriedade, dependendo da necessidade
      }

      const response = await fetch(`/api/creditos?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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
    return <p>Carregando receitas...</p>
  }

  const handleStatusChange = (newStatus: boolean) => {
    setIsPago(newStatus); // Atualiza o status para pago ou pendente
    console.log(newStatus)
  };
  
  const handleNewDateChange = (newDate: string) => {
    setNewDateBaixa(newDate)// Salve ou trate a nova data aqui
  };

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
        {isPago && (
          <p className="text-red-600">*Para editar qualquer campo é necessário cancelar o pagamento primeiro</p>
        )}
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
                disabled={isPago ? true : false}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Valor</label>
              <div className="relative">
                <CurrencyInput 
                  value={valueToPay}
                  onChange={(value) => setValueToPay(value)}
                  disabled={isPago ? true : false}
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
                  disabled={isPago ? true : false}
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
                  disabled={isPago ? true : false}
                />
                <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Data prevista de recebimento</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-md"
                  value={expectedDate}
                  onChange={(e) => SetExpectedDate(e.target.value)}
                  disabled={isPago ? true : false}
                />
                <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div>
              <EditBaixa
                isPago={isPago}
                onStatusChange={handleStatusChange}
                onDateChange={handleNewDateChange}
                baixaDate=''
              />
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
