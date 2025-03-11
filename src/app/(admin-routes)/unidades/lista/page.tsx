'use client'

import { useEffect, useState } from 'react'
import { Pencil, Trash2, Search, Clipboard, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import Swal from 'sweetalert2';
import { useIsUser } from '@/hooks/useIsUser';


interface Unit {
  id: number
  Description: string
  CNP: string
}

export default function ListUnit() {
  const [searchQuery, setSearchQuery] = useState('')
  const [units, setUnits] = useState<Unit[]>([])
  const isUser = useIsUser()

  const handleError = () => {
    Swal.fire({
      title: 'Erro!',
      text: 'Erro ao excluir unidade pois já possui lançamento!',
      icon: 'success',
      confirmButtonText: 'OK',
      timer: 3000
    });
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

  const handleDelete = async (id: number) => {
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
        const response = await fetch(`/api/unidades?id=${id}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          // Atualize a lista de unidades após excluir
          setUnits((prevUnits) => prevUnits.filter((unit) => unit.id !== id));
          Swal.fire('Excluído!', 'A unidades foi excluída com sucesso.', 'success');
        } else {
          handleError()
        }
      }
    } catch (error) {
      console.error('Erro ao excluir unidade:', error);
    }
  };

  const filteredUnits = units.filter(unit => 
    unit.Description.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <div className="p-6 flex-1">
       <h1 className="text-xl font-semibold text-gray-900 mb-6">Lista todas as Unidades</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="unit-search" className="block text-sm font-medium text-gray-700 mb-1">
            Procurar por Unidade
          </label>
          <div className="relative">
            <input
              type="text"
              id="unit-search"
              placeholder="Digite aqui a unidade"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-sm font-medium text-gray-700 mb-4">Unidades atuais</h2>
        <div className="border rounded-lg overflow-hidden">
        {units.length === 0 ? (
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
                onClick={() => window.location.href = '/unidades/registrar  '} // Exemplo de redirecionamento para a página de adicionar
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
                  />
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Unidade
                </th>
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUnits.map((unit) => (
                <tr key={unit.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {unit.Description}
                  </td>
                  {!isUser && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">
                        <Link href={`/unidades/editar?id=${unit.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDelete(unit.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </>
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