"use client"

import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import BillsList from "@/components/billList";
import ProfitDisplay from "@/components/ProfitDisplay";
import UnitList from "@/components/UnitList";
import transformData from "@/utils/dataToData";
import { getServerSession } from "next-auth";
import { useEffect, useState } from "react";

type DebitEntry = {
  id: string
  description: string
  value: number
  dueDate: string
  issueDate: string
  valueToPay: string
  unitId: string
  expectedDate: string
  IsBaixa: boolean
}

interface Unit {
  id: string
  Description: string
  CNP: string
}

const originalData = [
  {
      "id": "cm48k7jyk0003vu2fdawsei88",
      "description": "N1",
      "valueToPay": "50",
      "dueDate": "1997-06-12T00:00:00.000Z",
      "expectedDate": "1997-06-12T00:00:00.000Z",
      "issueDate": "1997-06-12T00:00:00.000Z",
      "IsBaixa": true,
      "unitId": "cm42pk334000012lu0u559eip",
      "unit": {
          "id": "cm42pk334000012lu0u559eip",
          "Description": "Guaruja",
          "CNPJ": "56.565.655/6656-5"
      }
  },
  {
      "id": "cm48k90lh0005vu2f0sjxu2vk",
      "description": "n2",
      "valueToPay": "50",
      "dueDate": "1997-06-12T00:00:00.000Z",
      "expectedDate": "1997-06-12T00:00:00.000Z",
      "issueDate": "1997-06-12T00:00:00.000Z",
      "IsBaixa": true,
      "unitId": "cm42pk334000012lu0u559eip",
      "unit": {
          "id": "cm42pk334000012lu0u559eip",
          "Description": "Guaruja",
          "CNPJ": "56.565.655/6656-5"
      }
  },
  {
      "id": "cm48kbmyt000fvu2f6mguo55p",
      "description": "n4",
      "valueToPay": "1000",
      "dueDate": "1997-06-12T00:00:00.000Z",
      "expectedDate": "1997-06-12T00:00:00.000Z",
      "issueDate": "1997-06-12T00:00:00.000Z",
      "IsBaixa": true,
      "unitId": "cm42pk334000012lu0u559eip",
      "unit": {
          "id": "cm42pk334000012lu0u559eip",
          "Description": "Guaruja",
          "CNPJ": "56.565.655/6656-5"
      }
  },
  {
      "id": "cm48l1ht4000jvu2ff2jhkua9",
      "description": "N&8",
      "valueToPay": "5000",
      "dueDate": "1997-06-12T00:00:00.000Z",
      "expectedDate": "1997-06-12T00:00:00.000Z",
      "issueDate": "1997-06-12T00:00:00.000Z",
      "IsBaixa": true,
      "unitId": "cm40bk2mc000btwbfcqopew2g",
      "unit": {
          "id": "cm40bk2mc000btwbfcqopew2g",
          "Description": "Santos",
          "CNPJ": "45.454.545/4545-45"
      }
  },
  {
      "id": "cm48mrbng000lvu2fcyrgen36",
      "description": "sdsadasd",
      "valueToPay": "60",
      "dueDate": "2024-12-03T00:00:00.000Z",
      "expectedDate": "2024-12-03T00:00:00.000Z",
      "issueDate": "2024-12-03T00:00:00.000Z",
      "IsBaixa": false,
      "unitId": "cm40bco3k0002twbfpkxnsqls",
      "unit": {
          "id": "cm40bco3k0002twbfpkxnsqls",
          "Description": "Cubatão",
          "CNPJ": "65.656.566/5656-56"
      }
  }
];

export default function Dashboard() {
  const [units, setUnits] = useState<Unit[]>([])
  const [debits, setDebits] = useState<DebitEntry[]>([])
  const [filteredDebits, setFilteredDebits] = useState<DebitEntry[]>([])
  const [credits, setCredits] = useState<DebitEntry[]>([])
  const [filteredCredits, setFilteredCredits] = useState<DebitEntry[]>([])
  const [years, setYears] = useState<string[]>(['2024'])
  const [selectedMonth, setSelectedMonth] = useState<string>('Todos')
  const [selectedYear, setSelectedYear] = useState<string>('Todos')
  const [unitFilter, setUnitFilter] = useState('Todos');

  useEffect(() => {
    const date = new Date()
    const actualYear = date.getFullYear().toString()


    console.log(date)
    setYears((prevYear) => {
      if (!prevYear.includes(actualYear)) {
        return [...prevYear, actualYear];
      }
      return prevYear;
    })
  }, [])

  useEffect(() => {
    async function fetchDebits() {
      try {
        const response = await fetch('/api/debitos');
        const data: DebitEntry[] = await response.json();
        
        setDebits(data);
        const filteredData = data.filter(dt => dt.IsBaixa == true)

        setFilteredDebits(filteredData)
      } catch (error) {
        console.error('Error fetching units:', error);
      }
    }

    fetchDebits();
  }, [])

  useEffect(() => {
    async function fetchCredits() {
      try {
        const response = await fetch('/api/creditos');
        const data: DebitEntry[] = await response.json();
        
        setCredits(data);
        const filteredData = data.filter(dt => dt.IsBaixa == true)

        setFilteredCredits(filteredData)
      } catch (error) {
        console.error('Error fetching units:', error);
      }
    }

    fetchCredits();
  }, [])

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

  const handleSelectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUnit = e.target.value;
    setUnitFilter(selectedUnit)

    // Filtra os dados considerando tanto o filtro do select quanto a pesquisa
    const filteredDebits = debits.filter((debit) => {
      const matchesUnit = (selectedUnit === 'Todos' && debit.IsBaixa == true) || (debit.unitId === selectedUnit && debit.IsBaixa == true);
      return matchesUnit
    });

    const filteredCredits = credits.filter((credit) => {
      const matchesUnit = (selectedUnit === 'Todos' && credit.IsBaixa == true) || (credit.unitId === selectedUnit && credit.IsBaixa == true);
      return matchesUnit
    });

    setFilteredDebits(filteredDebits);
    setFilteredCredits(filteredCredits)
  } 

  const handleSelectMonthChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const month = e.target.value;
    setSelectedMonth(month);
  }

  const handleSelectYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = e.target.value;
    setSelectedYear(year);

    const filteredDebits = debits.filter((debit) => {
      const matchesUnit = (unitFilter === 'Todos' && debit.IsBaixa == true) || (debit.unitId === unitFilter && debit.IsBaixa == true);
      return matchesUnit
    });
  }

  const downloadPDF = async () => {
    const response = await fetch("/api/dash");
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "relatorio.pdf";
    link.click();
  };


  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex gap-4 items-end justify-end">
        <div>
          <label className="block text-sm mb-1">Unidade</label>
            <select className="w-full max-w-xs px-3 py-2 border rounded-md" onChange={handleSelectChange}>
              <option value="Todos">Todos</option>
              {units.map(unit => (
                <option key={unit.id} value={unit.id}>{unit.Description}</option>
              ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Mês</label>
          <select className="w-full max-w-xs px-3 py-2 border rounded-md" onChange={handleSelectMonthChange}>
            <option value="Todos">Todos</option>
            <option value="Janeiro">Janeiro</option>
            <option value="Fevereiro">Fevereiro</option>
            <option value="Março">Março</option>
            <option value="Abril">Abril</option>
            <option value="Junho">Junho</option>
            <option value="Julho">Julho</option>
            <option value="Agosto">Agosto</option>
            <option value="Setembro">Setembro</option>
            <option value="Outubro">Outubro</option>
            <option value="Novembro">Novembro</option>
            <option value="Dezembro">Dezembro</option>
            
        </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Ano</label>
            <select className="w-full max-w-xs px-3 py-2 border rounded-md" onChange={handleSelectYearChange}>
              <option value="Todos">Todos</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
          </select>
        </div>
        <div>
          <button className="px-4 py-2 border border-gray-300 rounded-[5px] flex items-center space-x-2 hover:bg-gray-100" onClick={downloadPDF}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>EXPORTAR</span>
          </button>
        </div>
      </div>
      <ProfitDisplay debit={filteredDebits} credit={filteredCredits}/>
      <div className="flex gap-4">
        <BillsList data={filteredDebits}/>
        <UnitList data={units}/>
      </div>
    </div>
  )
}