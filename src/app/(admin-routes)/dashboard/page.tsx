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
  const [units, setUnits] = useState<Unit[]>([])
  const [debits, setDebits] = useState<DebitEntry[]>([])
  const [filteredDebits, setFilteredDebits] = useState<DebitEntry[]>([])
  const [credits, setCredits] = useState<DebitEntry[]>([])
  const [filteredCredits, setFilteredCredits] = useState<DebitEntry[]>([])
  const [years, setYears] = useState<string[]>(['2024'])
  const [selectedMonth, setSelectedMonth] = useState<string>('Todos')
  const [selectedYear, setSelectedYear] = useState<string>('Todos')
  const [unitFilter, setUnitFilter] = useState('Todos');
  const [startDate, setStartDate] = useState<string>(""); // Data inicial
  const [endDate, setEndDate] = useState<string>("");

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
    const currentMonth = new Date().getMonth() + 1; // Janeiro é 0, Dezembro é 11
    const currentYear = new Date().getFullYear().toString();

    setSelectedMonth(currentMonth.toString());  // Define o mês atual
    setSelectedYear(currentYear);  // Define o ano atual
  }, []);

  useEffect(() => {
    async function fetchDebits() {
      try {
        const response = await fetch('/api/debitos')
        console.log(response)
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
      const dateOfBaixa = new Date(debit.baixaDate);
      const debitMonth = (dateOfBaixa.getMonth() + 1).toString()
      const debitYear = dateOfBaixa.getFullYear().toString()

      const matchesUnit = 
  (selectedUnit === 'Todos' && 
    debit.IsBaixa === true && 
    (selectedMonth === 'Todos' || selectedMonth == debitMonth) && 
    (selectedYear === 'Todos' || selectedYear == debitYear)) || 
  (debit.unitId === selectedUnit && 
    debit.IsBaixa === true && 
    (selectedMonth === 'Todos' || selectedMonth == debitMonth) && 
    (selectedYear === 'Todos' || selectedYear == debitYear));
      return matchesUnit
    });

    const filteredCredits = credits.filter((credit) => {
      const dateOfBaixa = new Date(credit.baixaDate);
      const debitMonth = (dateOfBaixa.getMonth() + 1).toString()
      const debitYear = dateOfBaixa.getFullYear().toString()

      const matchesUnit = 
      (selectedUnit === 'Todos' && 
        credit.IsBaixa === true && 
        (selectedMonth === 'Todos' || selectedMonth == debitMonth) && 
        (selectedYear === 'Todos' || selectedYear == debitYear)) || 
      (credit.unitId === selectedUnit && 
        credit.IsBaixa === true && 
        (selectedMonth === 'Todos' || selectedMonth == debitMonth) && 
        (selectedYear === 'Todos' || selectedYear == debitYear));
      return matchesUnit
    });

    setFilteredDebits(filteredDebits);
    setFilteredCredits(filteredCredits)
    console.log(filteredDebits)
  } 

  const handleSelectMonthChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const month = e.target.value;
    setSelectedMonth(month);
  
    // Filtra os débitos considerando o mês selecionado
    const filteredDebits = debits.filter((debit) => {
      const debitDate = new Date(debit.baixaDate);
      const debitMonth = debitDate.getMonth() + 1;
  
      // Se o mês for "Todos", inclui todos os registros; caso contrário, filtra pelo mês
      return month === 'Todos' || debitMonth === parseInt(month);
    });
  
    // Filtra os créditos considerando o mês selecionado
    const filteredCredits = credits.filter((credit) => {
      const creditDate = new Date(credit.baixaDate);
      const creditMonth = creditDate.getMonth() + 1;
  
      return month === 'Todos' || creditMonth === parseInt(month);
    });
  
    // Atualiza os estados dos débitos e créditos filtrados
    setFilteredDebits(filteredDebits);
    setFilteredCredits(filteredCredits);
  };

  const handleSelectYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = e.target.value;
    setSelectedYear(year);
  
    // Filtra os débitos considerando o ano selecionado
    const filteredDebits = debits.filter((debit) => {
      const debitDate = new Date(debit.baixaDate);
      const debitYear = debitDate.getFullYear();
  
      // Verifica unidade e ano
      const matchesUnit =
        (unitFilter === 'Todos' && debit.IsBaixa === true) ||
        (debit.unitId === unitFilter && debit.IsBaixa === true);
  
      // Se o ano for "Todos", inclui todos os registros; caso contrário, verifica o ano
      return matchesUnit && (year === 'Todos' || debitYear === parseInt(year));
    });
  
    // Filtra os créditos considerando o ano selecionado
    const filteredCredits = credits.filter((credit) => {
      const creditDate = new Date(credit.baixaDate);
      const creditYear = creditDate.getFullYear();
  
      // Verifica unidade e ano
      const matchesUnit =
        (unitFilter === 'Todos' && credit.IsBaixa === true) ||
        (credit.unitId === unitFilter && credit.IsBaixa === true);
  
      return matchesUnit && (year === 'Todos' || creditYear === parseInt(year));
    });
  
    // Atualiza os estados dos débitos e créditos filtrados
    
    setFilteredDebits(filteredDebits);
    setFilteredCredits(filteredCredits);
  };
  

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
  

  const handleDateChange = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    const filteredDebits = debits.filter((debit) => {
      if (!debit.baixaDate) return false; // Lidar com casos onde baixaDate é nulo ou indefinido
      const baixaDate = new Date(debit.baixaDate);
  
      const baixaDateOnly = new Date(baixaDate.getFullYear(), baixaDate.getMonth(), baixaDate.getDate());
      const startOnly = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const endOnly = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  
      return (
        baixaDateOnly >= startOnly &&
        baixaDateOnly <= endOnly &&
        (unitFilter === "Todos" || debit.unitId === unitFilter) &&
        debit.IsBaixa === true
      );
    });
  
    const filteredCredits = credits.filter((credit) => {
      if (!credit.baixaDate) return false; // Lidar com casos onde baixaDate é nulo ou indefinido
      const baixaDate = new Date(credit.baixaDate);
  
      const baixaDateOnly = new Date(baixaDate.getFullYear(), baixaDate.getMonth(), baixaDate.getDate());
      const startOnly = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const endOnly = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  
      return (
        baixaDateOnly >= startOnly &&
        baixaDateOnly <= endOnly &&
        (unitFilter === "Todos" || credit.unitId === unitFilter) &&
        credit.IsBaixa === true
      );
    });
  
    setFilteredDebits(filteredDebits);
    setFilteredCredits(filteredCredits);
  };

  useEffect(() => {
    if (startDate && endDate) {
      handleDateChange();
    }
  }, [startDate, endDate, debits, credits, unitFilter]);



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
        
        <div className="flex gap-4">
          <div>
            <label className="block text-sm mb-1">Data Inicial:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              className="w-full px-3 py-2 border rounded-md"
              onChange={(e) => {
                console.log(e.target.value)
                setStartDate(e.target.value)
              }}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Data Final:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              className="w-full px-3 py-2 border rounded-md"
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

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
        </div> */}
        {/* <div>
          <label className="block text-sm mb-1">Ano</label>
            <select className="w-full max-w-xs px-3 py-2 border rounded-md" onChange={handleSelectYearChange} value={selectedYear}>
              <option value="Todos">Todos</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
          </select>
        </div> */}
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