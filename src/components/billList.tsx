import { Receipt } from "lucide-react";
import Link from "next/link";
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

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
type DebitListProps = {
  data: DebitEntry[];
};

export default function BillsList({data}: DebitListProps) {
  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          <span className="text-gray-700 font-medium">Lista de contas a pagar</span>
        </div>
        <span className="text-sm text-gray-500">Mês atual</span>
      </div>
      
      <div className="divide-y divide-gray-200">
        {data.map(debit => (
          <div key={debit.id} className="py-3 flex justify-between items-center">
            <span className="text-sm text-gray-600">{debit.description}</span>
            <span className="text-sm text-gray-700">
            {new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
}).format(parseFloat(debit.valueToPay))}
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-2 text-right">
        <Link href={`/debitos/lista`}>
          <button className="text-sm text-gray-500 hover:text-gray-700">
            Ver tudo
          </button>
        </Link>
      </div>
    </div>
  )
}