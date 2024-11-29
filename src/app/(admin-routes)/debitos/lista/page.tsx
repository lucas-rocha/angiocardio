'use client'

import { useEffect, useState } from 'react'
import { Pencil, Trash2, Search, Clipboard, PlusCircle } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'


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


export default function ListDebits() {
  const [searchQuery, setSearchQuery] = useState('')
  const [debits, setDebits] = useState<DebitEntry[]>([])
  const [filterDebit, setFilterDebit] = useState<DebitEntry[]>([])
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [checkAll, setCheckAll] = useState(false);
  const [units, setUnits] = useState<Unit[]>([])
  const [unitFilter, setUnitFilter] = useState('Todos');


  const handleCheckboxChange = (id: string) => {
    setCheckedItems((prev: any) =>
      prev.includes(id)
        ? prev.filter((itemId: string) => itemId !== id)
        : [...prev, id]
    );
  };

  useEffect(() => {
    async function fetchDebits() {
      try {
        const response = await fetch('/api/debitos');
        const data = await response.json();
        console.log(data)
        
        setDebits(data);
        setFilterDebit(data)
      } catch (error) {
        console.error('Error fetching units:', error);
      }
    }

    fetchDebits();
  }, [])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/debitos?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Atualize a lista de unidades após excluir
        setFilterDebit((prevDebits) => prevDebits.filter((debit) => debit.id !== id));
      } else {
        console.error('Erro ao excluir unidade');
      }
    } catch (error) {
      console.error('Erro ao excluir unidade:', error);
    }
  };

  const handleCheckAll = () => {
    if (checkAll) {
      setCheckedItems([]); // Desmarca tudo
    } else {
      setCheckedItems(debits.map((unit) => unit.id)); // Marca tudo
    }
    setCheckAll(!checkAll);
  };

  useEffect(() => {
    async function fetchUnits() {
      try {
        const response = await fetch('/api/unidades');
        const data = await response.json();
        console.log(data)
        
        setUnits(data);
      } catch (error) {
        console.error('Error fetching units:', error);
      }
    }

    fetchUnits();
  }, [])

  const updateDebits = async () => {
    try {
      const response = await fetch('/api/debitos', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: checkedItems}),
      });
  
      if (!response.ok) {
        throw new Error('Erro ao atualizar os débitos');
      }
  
      const result = await response.json();
      console.log('Resultado:', result);
    } catch (error) {
      
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  
    // Filtra os dados considerando tanto o filtro do select quanto a pesquisa
    const filtered = debits.filter((debit) => {
      const matchesUnit = unitFilter === 'Todos' || debit.unitId === unitFilter;
      const matchesSearch = debit.description.toLowerCase().includes(query.toLowerCase());
      return matchesUnit && matchesSearch;
    });
  
    setFilterDebit(filtered);
  };

  const handleSelectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUnit = e.target.value;
    setUnitFilter(selectedUnit);

    // Filtra os dados considerando tanto o filtro do select quanto a pesquisa
    const filtered = debits.filter((debit) => {
      const matchesUnit = selectedUnit === 'Todos' || debit.unitId === selectedUnit;
      const matchesSearch = debit.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesUnit && matchesSearch;
    });

    setFilterDebit(filtered);
  } 

  const downloadPDF = async () => {
    const response = await fetch("/api/pdf");
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "relatorio.pdf";
    link.click();
  };

  return (
    <div className="p-6 flex-1">
       <h1 className="text-xl font-semibold text-gray-900 mb-6">Lista de todos os lançamentos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="unit-search" className="block text-sm font-medium text-gray-700 mb-1">
            Procurar por débito
          </label>
          <div className="relative">
            <input
              type="text"
              id="unit-search"
              placeholder="Digite aqui a unidade"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
          </div>
        </div>
        <div>
            <label className="block text-sm mb-1">Selecione a unidade</label>
            <select className="w-full max-w-xs px-3 py-2 border rounded-md" onChange={handleSelectChange}>
             <option value="Todos">Todos</option>
              {units.map(unit => (
                <option key={unit.id} value={unit.id}>{unit.Description}</option>
              ))}
            </select>
          </div>

      </div>

      {checkedItems.length !== 0 && (
        <div className="flex space-x-2 mt-4 justify-end">
          <button className="px-4 py-2 text-red-600 hover:bg-gray-100 rounded-[5px]">
            Excluir
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-[5px] flex items-center space-x-2 hover:bg-gray-100" onClick={downloadPDF}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>EXPORTAR</span>
          </button>
          <button className="px-4 py-2 bg-teal-700 text-white rounded-[5px] hover:bg-teal-800" onClick={updateDebits}>
            Dar baixa
          </button>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-sm font-medium text-gray-700 mb-4">Lançamentos atuais</h2>
        <div className="border rounded-lg overflow-hidden">
        {debits.length === 0 ? (
          <div className="flex justify-center items-center py-10 text-center">
            <div>
              <Clipboard className="mx-auto h-12 w-12 text-gray-400" />
              <p className="text-lg text-gray-600 mt-4">
                Nenhuma unidade encontrada.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Parece que você ainda não tem unidades cadastradas. Que tal adicionar uma agora?
              </p>
              <button
                onClick={() => window.location.href = '/unidades/registrar'} // Exemplo de redirecionamento para a página de adicionar
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <PlusCircle className="inline h-5 w-5 mr-2" />
                Adicionar Unidade
              </button>
            </div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="w-12 px-6 py-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={checkAll}
                    onChange={handleCheckAll}
                  />
                </th>
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
                  Data prevista de baixa
                </th>
                <th
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
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filterDebit.map((unit) => (
                <tr key={unit.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={checkedItems.includes(unit.id)}
                      onChange={() => handleCheckboxChange(unit.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {unit.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(isNaN(Number(unit.valueToPay)) ? 0 : Number(unit.valueToPay))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(unit.dueDate), 'dd/MM/yyyy', { locale: ptBR })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(unit.expectedDate), 'dd/MM/yyyy', { locale: ptBR })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/debitos/editar?id=${unit.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDelete(unit.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
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