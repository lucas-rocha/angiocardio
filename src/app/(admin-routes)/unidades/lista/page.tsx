'use client'

import { useState } from 'react'
import { Pencil, Trash2, Search } from 'lucide-react'

interface Unit {
  id: number
  name: string
}

export default function ListUnit() {
  const [searchQuery, setSearchQuery] = useState('')
  const [units, setUnits] = useState<Unit[]>([
    { id: 1, name: 'Cordis' },
    { id: 2, name: 'MICROPORT' },
    // { id: 3, name: 'LITORAL' },
    // { id: 4, name: 'NOBRE' },
    // { id: 5, name: 'MERIL' },
    // { id: 6, name: 'TEC RAD' },
  ])

  const filteredUnits = units.filter(unit => 
    unit.name.toLowerCase().includes(searchQuery.toLowerCase())
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
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="w-12 px-6 py-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unidade
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Editar
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Excluir
                </th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{unit.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Pencil className="h-4 w-4" />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}