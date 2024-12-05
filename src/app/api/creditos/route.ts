import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');


    if(id) {
      const debit = await prisma.credits.findUnique({
        where: { id },
      });
    

      if (!debit) {
        return new Response(JSON.stringify({ error: 'Debit not found' }), {
          status: 404, // Correção na palavra "status"
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify(debit), {
        status: 200, // Correção na palavra "status"
        headers: { 'Content-Type': 'application/json' },
      });

    }
    const debits = await prisma.credits.findMany({
      include: {
        unit: true
      }
    }); // Substitua 'unit' pelo nome correto do modelo no seu esquema Prisma.
    return new Response(JSON.stringify(debits), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching debits:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch debits' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request: Request) {
  try {
    // Parse os dados recebidos do corpo da requisição
    const data = await request.json();

    // Criação do débito no banco de dados
    const newDebit = await prisma.credits.create({
      data: {
        description: data.description,
        valueToPay: data.valueToPay,
        dueDate: new Date(data.dueDate),
        expectedDate: new Date(data.expectedDate),
        issueDate: new Date(data.issueDate),
        unitId: data.unitId,
      },
    });

    // Retorna a resposta com o novo débito criado
    return NextResponse.json(newDebit, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar crédito:', error);
    return NextResponse.json({ error: 'Erro ao criar o crédito.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(request: Request) {
  const data = await request.json()

  const updatedCredits = await prisma.credits.updateMany({
    where: {
      id: { in: data.ids }
    },
    data: {
      IsBaixa: true
    }
  })
  
  return NextResponse.json(data, { status: 201 });
}