"use client"

import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import BillsList from "@/components/billList";
import ProfitDisplay from "@/components/ProfitDisplay";
import UnitList from "@/components/UnitList";
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
}


interface Unit {
  id: string
  Description: string
  CNP: string
}

export default function Dashboard() {
  const [units, setUnits] = useState<Unit[]>([])
  const [debits, setDebits] = useState<DebitEntry[]>([])

  useEffect(() => {
    async function fetchDebits() {
      try {
        const response = await fetch('/api/debitos');
        const data = await response.json();
        console.log(data)
        
        setDebits(data);
      } catch (error) {
        console.error('Error fetching units:', error);
      }
    }

    fetchDebits();
  }, [])

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

  return (
    <div className="flex flex-col gap-4 w-full">
      <ProfitDisplay />
      <div className="flex gap-4">
        <BillsList data={debits}/>
        <UnitList data={units}/>
      </div>
    </div>
  )
}