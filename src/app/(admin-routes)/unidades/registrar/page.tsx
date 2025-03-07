'use client'

import { useEffect, useState } from 'react'

interface Unit {
  id: number
  Description: string
  CNPJ: string
}

export default function RegisterUnit() {
  const [newUnit, setNewUnit] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [units, setUnits] = useState<Unit[]>([])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/unidades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newUnit, cnpj }),
      });

      if (response.ok) {
        const data = await response.json();
        setUnits((prevUnits) => [...prevUnits, data]);
        setNewUnit(''); // Limpa o campo após o envio
        setCnpj('');
      } else {
        // const errorData = await response.json();
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é número

    // Aplica a máscara
    value = value
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');

    setCnpj(value);
  };

  return (
    <div className="p-6 flex-1">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Cadastrar Unidade</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
              Unidade
            </label>
            <input
              type="text"
              id="unit"
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Salvar
          </button>
        </div>
      </form>

      <div>
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
                {/* <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Editar
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Excluir
                </th> */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {units.map((unit) => (
                <tr key={unit.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{unit.Description}</td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Pencil className="h-4 w-4" />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}