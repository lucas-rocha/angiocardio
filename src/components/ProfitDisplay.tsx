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

type ProfitDisplayProps = {
  debit: DebitEntry[];
  credit: DebitEntry[];
  selectMonth: string;
  selectYear: string;
};

export default function ProfitDisplay({ debit, credit, selectMonth, selectYear }: ProfitDisplayProps) {
  const totalCredits = credit.reduce((sum, entry) => sum + parseFloat(entry.valueToPay), 0);

  const totalDebits = debit.reduce((sum, entry) => sum + parseFloat(entry.valueToPay), 0);

  const profit = totalCredits - totalDebits;

  const boxColor = profit < 0 ? "bg-red-500" : "bg-[#06505A]";
  const LucroPrejuizo = profit < 0 ? "Prejuizo" : "Lucro";

  return (
    <div className={`w-full rounded-lg p-6 ${boxColor}`}>
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="text-white text-sm">{LucroPrejuizo}</div>
          <div className="text-white text-3xl font-medium">
            R$ {profit.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}  
          </div>
        </div>
        <div className="text-white text-sm">
          {selectMonth}/{selectYear}
          </div>
      </div>
    </div>
  )
}
