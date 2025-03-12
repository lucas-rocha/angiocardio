'use client'

import { useEffect, useState } from 'react'
import { Pencil, Trash2, Search, Clipboard, PlusCircle } from 'lucide-react'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'
import EditData from '@/components/EditData'
import Swal from 'sweetalert2'
import { useIsUser } from '@/hooks/useIsUser'


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
  id: number
  Description: string
  CNP: string
}

interface CheckedItem {
  id: string;
  dateBaixa: string;
}

export default function ListDebits() {
  const [searchQuery, setSearchQuery] = useState('')
  const [debits, setDebits] = useState<DebitEntry[]>([])
  const [filterDebit, setFilterDebit] = useState<DebitEntry[]>([])
  const [checkedItems, setCheckedItems] = useState<CheckedItem[]>([]);
  const [checkAll, setCheckAll] = useState(false);
  const [units, setUnits] = useState<Unit[]>([])
  const [unitFilter, setUnitFilter] = useState('Todos');
  const [status, setStatus] = useState('Todos')
  const isUser = useIsUser()


  const timeZone = 'America/Sao_Paulo'; 

  const handleSuccess = () => {
    Swal.fire({
      title: 'Sucesso!',
      text: 'Receitas(s) Recebidas(s) com sucesso!',
      icon: 'success',
      confirmButtonText: 'OK',
      timer: 3000
    });
  };

  const handleCheckboxChange = (id: string, dateBaixa: string) => {
    // setCheckedItems((prev: any) =>
    //   prev.includes(id)
    //     ? prev.filter((itemId: string) => itemId !== id)
    //     : [...prev, id]
    // );
    setCheckedItems((prev) =>
    prev.some((item) => item.id === id)
      ? prev.filter((item) => item.id !== id) // Remove o item pelo ID
      : [...prev, { id, dateBaixa }] // Adiciona um novo item
    );
    console.log(checkedItems)
  };

  useEffect(() => {
    async function fetchDebits() {
      try {
        const response = await fetch('/api/creditos');
        const data = await response.json();
        
        setDebits(data);
        setFilterDebit(data)

        console.log(data)
      } catch (error) {
        console.error('Error fetching units:', error);
      }
    }

    fetchDebits();
  }, [checkedItems])

  const handleDelete = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: 'Tem certeza?',
        text: 'Você não poderá reverter esta ação!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar',
      });

      if(result.isConfirmed) {
        const response = await fetch(`/api/creditos?id=${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Atualize a lista de unidades após excluir
          setFilterDebit((prevDebits) => prevDebits.filter((debit) => debit.id !== id));
          Swal.fire('Excluído!', 'O Crédtio foi excluído com sucesso.', 'success');
        } else {
          Swal.fire('Erro!', 'Erro ao excluir o débito.', 'error');
        }
      }


    } catch (error) {
      console.error('Erro ao excluir unidade:', error);
    }
  };

  const handleCheckAll = () => {
    // if (checkAll) {
    //   setCheckedItems([]); // Desmarca tudo
    // } else {
    //   setCheckedItems(debits.map((unit) => unit.id)); // Marca tudo
    // }
    // setCheckAll(!checkAll);
    if (checkAll) {
      setCheckedItems([]); // Desmarca tudo
    } else {
      setCheckedItems(debits.map((unit) => {
        return { id: unit.id, dateBaixa: unit.baixaDate }
      })); // Marca tudo
      console.log(checkedItems)
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

  const normalizeDates = (items: CheckedItem[]) => {
    return items.map((item) => ({
      ...item,
      dateBaixa: item.dateBaixa
        ? new Date(item.dateBaixa).toISOString() // Converte para o formato ISO se não for null
        : new Date().toISOString(), // Usa a data atual se for null
    }));
  };

  const updateCredits = async () => {
    const normalizedItems = normalizeDates(checkedItems);

    try {
      const response = await fetch('/api/creditos', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates: normalizedItems }),
      });
  
      if (!response.ok) {
        throw new Error('Erro ao atualizar os débitos');
      }
  
      const result = await response.json();
      console.log('Resultado:', result);
      handleSuccess()
      setCheckedItems([])
    } catch (error) {
      
    }
  };

  const checkStatus = (statusBaixa: boolean, expectedDate: string) => {
    if (statusBaixa === true) {
      return 'recebido';
    }
  
    if (statusBaixa === false) {
      const parseExpectedDate = new Date(expectedDate);
      const today = new Date();
  
      // Criar novas datas com horas, minutos, segundos e milissegundos zerados
      const parsedDateOnly = new Date(parseExpectedDate.getFullYear(), parseExpectedDate.getMonth(), parseExpectedDate.getDate());
      const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
      console.log(parsedDateOnly < todayOnly);
  
      if (parsedDateOnly < todayOnly) {
        return 'vencido';
      }
  
      return 'pendente';
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  
    // Filtra os dados considerando tanto o filtro do select quanto a pesquisa
    const filtered = debits.filter((debit) => {
      const matchesUnit = unitFilter === 'Todos' || debit.unitId === unitFilter;
      const matchesSearch = debit.description.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === 'Todos' || status === checkStatus(debit.IsBaixa, debit.expectedDate)
      return matchesUnit && matchesSearch && matchesStatus;
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
      const matchesStatus = status === 'Todos' || status === checkStatus(debit.IsBaixa, debit.expectedDate)

      return matchesUnit && matchesSearch && matchesStatus;
    });

    setFilterDebit(filtered);
  } 

  const handleSelectChangeStatus = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = e.target.value;
    setStatus(selectedStatus)

    const filtered = debits.filter((debit) => {
      const matchesUnit = unitFilter === 'Todos' || debit.unitId === unitFilter;
      const matchesSearch = debit.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'Todos' || selectedStatus === checkStatus(debit.IsBaixa, debit.expectedDate)
      return matchesUnit && matchesSearch && matchesStatus;
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

  const saveDate = (id: string, newDate: string) => {
    setCheckedItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, dateBaixa: newDate } : item
      )
    );

    console.log(checkedItems)
  };

  return (
    <div className="p-6 flex-1">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Lista de todos os lançamentos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="unit-search" className="block text-sm font-medium text-gray-700 mb-1">
            Procurar por receita
          </label>
          <div className="relative">
            <input
              type="text"
              id="unit-search"
              placeholder="Procure pela receita"
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
        <div>
          <label className="block text-sm mb-1">Status</label>
          <select className="w-full max-w-xs px-3 py-2 border rounded-md" onChange={handleSelectChangeStatus}>
            <option value="Todos">Todos</option>
            <option value="recebido">Recebido</option>
            <option value="vencido">Vencido</option>
            <option value="pendente">Pendente</option>
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
          <button className="px-4 py-2 bg-teal-700 text-white rounded-[5px] hover:bg-teal-800" onClick={updateCredits}>
            Receber
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
                Nenhuma receita encontrada.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Parece que você ainda não tem receitas cadastradas. Que tal adicionar uma agora?
              </p>
              <button
                onClick={() => window.location.href = '/receitas/registrar'} // Exemplo de redirecionamento para a página de adicionar
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <PlusCircle className="inline h-5 w-5 mr-2" />
                Adicionar Receita
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
                  Unidade
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
                  Data de Emissão
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
                  data prevista de recebimento
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Data de Pagamento
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                ></th>
                {!isUser && (
                  <>   
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
                  </>
                )}
                {checkedItems.length !== 0 && (
                  <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Data de recebimento
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filterDebit.map((unit) => (
                <tr key={unit.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={checkedItems.some((item) => item.id === unit.id)}
                      onChange={() => handleCheckboxChange(unit.id, unit.baixaDate)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {unit.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {unit.unit.Description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(isNaN(Number(unit.valueToPay)) ? 0 : Number(unit.valueToPay))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(toZonedTime(unit.issueDate, 'UTC'), 'dd/MM/yyyy', { locale: ptBR })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(toZonedTime(unit.dueDate, 'UTC'), 'dd/MM/yyyy', { locale: ptBR })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(toZonedTime(unit.expectedDate, 'UTC'), 'dd/MM/yyyy', { locale: ptBR })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {unit.baixaDate ?
                      format(toZonedTime(new Date(unit.baixaDate), 'UTC'), 'dd/MM/yyyy', { locale: ptBR })
                      :'N/A'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {checkStatus(unit.IsBaixa, unit.expectedDate)}
                  </td>
                  {!isUser && (
                    <>  
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/receitas/editar?id=${unit.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {unit.IsBaixa === true ?
                          '-'
                        :
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDelete(unit.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        }
                      </td>
                    </>
                  )}
                  {checkedItems.length !== 0 &&
                    checkedItems.some((item) => item.id === unit.id) && ( // Verifica se o ID está nos checkedItems
                      <EditData
                        id={unit.id}
                        value={unit.baixaDate}
                        onSave={(id: string, newDate: string) => saveDate(unit.id, newDate)}
                      />
                  )}
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