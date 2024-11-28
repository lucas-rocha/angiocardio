import { Building2 } from "lucide-react";
import Link from "next/link";

type Unit = {
  id: string
  Description: string
  CNP: string
};

type UnitListProps = {
  data: Unit[];
};


export default function UnitList({ data }: UnitListProps) {
  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          <span className="text-gray-700 font-medium">Unidades</span>
        </div>
        <span className="text-sm text-gray-500">Mês atual</span>
      </div>
      
      <div className="divide-y divide-gray-200">
        {data.map(unit => (
          <div key={unit.id} className="py-3 flex justify-between items-center">
            <span className="text-sm text-gray-600">{unit.Description}</span>
            <span className="text-sm text-gray-700">R$ 17.500,00</span>
          </div>
        ))}
      </div>
      
      <div className="mt-2 text-right">
        <Link href={`/unidades/lista`}>
          <button className="text-sm text-gray-500 hover:text-gray-700">
            Ver tudo
          </button>
        </Link>
      </div>
    </div>
  )
}