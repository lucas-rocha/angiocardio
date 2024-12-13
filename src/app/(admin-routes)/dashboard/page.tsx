"use client"

import BillsList from "@/components/billList";
import ProfitDisplay from "@/components/ProfitDisplay";
import ReceiverList from "@/components/ReceiverList";
import transformData from "@/utils/dataToData";
import { useEffect, useState } from "react";

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
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .split("T")[0]; // Primeiro dia do mês atual
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0]; // Último dia do mês atual

  const [units, setUnits] = useState<Unit[]>([])
  const [debits, setDebits] = useState<DebitEntry[]>([])
  const [filteredDebits, setFilteredDebits] = useState<DebitEntry[]>([])
  const [credits, setCredits] = useState<DebitEntry[]>([])
  const [filteredCredits, setFilteredCredits] = useState<DebitEntry[]>([])
  const [years, setYears] = useState<string[]>(['2024'])
  const [selectedMonth, setSelectedMonth] = useState<string>('Todos')
  const [selectedYear, setSelectedYear] = useState<string>('Todos')
  const [unitFilter, setUnitFilter] = useState('Todos');
  const [isPago, isSetPago] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('Todos')
  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(lastDayOfMonth);


  useEffect(() => {
    const date = new Date()
    const actualYear = date.getFullYear().toString()

    setYears((prevYear) => {
      if (!prevYear.includes(actualYear)) {
        return [...prevYear, actualYear];
      }
      return prevYear;
    })
  }, [])

  useEffect(() => {
    filterData(firstDayOfMonth, lastDayOfMonth);
  }, []);

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
    setUnitFilter(selectedUnit);
  
    // Filtra os dados considerando tanto o filtro do select quanto a pesquisa por data
    const filteredDebits = debits.filter((debit) => {
      const dateOfBaixa = new Date(debit.baixaDate);
      const debitDate = dateOfBaixa.toISOString().split("T")[0];
    
      // Verifica se a unidade corresponde
      const matchesUnit =
        (selectedUnit === "Todos" && debit.IsBaixa === true) ||
        (debit.unitId === selectedUnit && debit.IsBaixa === true);
    
      // Verifica se está dentro do intervalo de datas
      const matchesDateRange =
        (!startDate || debitDate >= startDate) &&
        (!endDate || debitDate <= endDate);
    
      // Verifica se o status corresponde
      const matchesStatus =
        selectedStatus === "Todos" || // Todos: inclui tanto true quanto false
        (selectedStatus === "Pago" && debit.IsBaixa === true) || // Pago: apenas true
        (selectedStatus === "Pendente" && debit.IsBaixa === false); // Pendente: apenas false
    
      return matchesUnit && matchesDateRange && matchesStatus;
    });
    
    const filteredCredits = credits.filter((credit) => {
      const dateOfBaixa = new Date(credit.baixaDate);
      const creditDate = dateOfBaixa.toISOString().split("T")[0];
  
      const matchesUnit = (selectedUnit === "Todos" && credit.IsBaixa === true) || (credit.unitId === selectedUnit && credit.IsBaixa === true)
  
      const matchesDateRange =
        (!startDate || creditDate >= startDate) &&
        (!endDate || creditDate <= endDate);
  
        const matchesStatus =
        selectedStatus === "Todos" || // Todos: inclui tanto true quanto false
        (selectedStatus === "Pago" && credit.IsBaixa === true) || // Pago: apenas true
        (selectedStatus === "Pendente" && credit.IsBaixa === false); // Pendente: apenas false
    
      return matchesUnit && matchesDateRange && matchesStatus;
    });
  
    setFilteredDebits(filteredDebits);
    setFilteredCredits(filteredCredits);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
    filterData(e.target.value, endDate);
  };
  
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
    filterData(startDate, e.target.value);
  };
  
  const filterData = (start: string, end: string) => {
    const filteredDebits = debits.filter((debit) => {
      const debitDate = new Date(debit.baixaDate).toISOString().split("T")[0];
      return (
        (!start || debitDate >= start) &&
        (!end || debitDate <= end)
      );
    });
  
    const filteredCredits = credits.filter((credit) => {
      const creditDate = new Date(credit.baixaDate).toISOString().split("T")[0];
      return (
        (!start || creditDate >= start) &&
        (!end || creditDate <= end)
      );
    });
  
    setFilteredDebits(filteredDebits);
    setFilteredCredits(filteredCredits);
  };

  const handleSelectStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedStatus(e.target.value)
  }
  

  const downloadPDF = async () => {
    // Transforme os dados necessários para o relatório
    const transformedDebitData = transformData(filteredDebits);
    const transformedCreditData = transformData(filteredCredits);
  
    // Monte o payload com dois objetos
    const payload = {
      debit: transformedDebitData,
      credit: transformedCreditData,
    };
  
    // Faça a requisição para gerar o PDF
    const response = await fetch("/api/dash", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  
    // Baixe o arquivo PDF
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "relatorio.pdf";
    link.click();
  };
  
  console.log(selectedStatus, filteredCredits)
  console.log(selectedStatus, filteredDebits)



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
  <label className="block text-sm mb-1">Data Início</label>
  <input
    type="date"
    className="w-full max-w-xs px-3 py-2 border rounded-md"
    onChange={handleStartDateChange}
    value={startDate}
  />
</div>
<div>
  <label className="block text-sm mb-1">Data Fim</label>
  <input
    type="date"
    className="w-full max-w-xs px-3 py-2 border rounded-md"
    onChange={handleEndDateChange}
    value={endDate}
  />
</div>

        {/* <div>
          <label className="block text-sm mb-1">Mês</label>
          <select className="w-full max-w-xs px-3 py-2 border rounded-md" onChange={handleSelectMonthChange} value={selectedMonth}>
            <option value="Todos">Todos</option>
            <option value="1">Janeiro</option>
            <option value="2">Fevereiro</option>
            <option value="3">Março</option>
            <option value="4">Abril</option>
            <option value="5">Maio</option>
            <option value="6">Junho</option>
            <option value="7">Julho</option>
            <option value="8">Agosto</option>
            <option value="9">Setembro</option>
            <option value="10">Outubro</option>
            <option value="11">Novembro</option>
            <option value="12">Dezembro</option>
        </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Ano</label>
            <select className="w-full max-w-xs px-3 py-2 border rounded-md" onChange={handleSelectYearChange} value={selectedYear}>
              <option value="Todos">Todos</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
        </div> */}
        <div>
          <label className="block text-sm mb-1">Status</label>
          <select className="w-full max-w-xs px-3 py-2 border rounded-md" onChange={(e) => setSelectedStatus(e.target.value)} value={selectedStatus}>
              <option value="Todos">Todos</option>
              <option value="pago">Pago</option>
              <option value="pendente">Pendente</option>
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
      <ProfitDisplay debit={filteredDebits} credit={filteredCredits} selectMonth={selectedMonth} selectYear={selectedYear}/>
      <div className="flex gap-4">
        <BillsList data={filteredDebits.slice(0, 5)}/>
        <ReceiverList data={filteredCredits.slice(0, 5)}/>
        {/* <UnitList data={units.slice(0, 5)}/> */}
      </div>
    </div>
  )
}