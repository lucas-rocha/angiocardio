import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    console.log("Qual foi", id) 

    if(id) {
      const debit = await prisma.debits.findUnique({
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
    const debits = await prisma.debits.findMany(); // Substitua 'unit' pelo nome correto do modelo no seu esquema Prisma.
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
    const newDebit = await prisma.debits.create({
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
    console.error('Erro ao criar débito:', error);
    return NextResponse.json({ error: 'Erro ao criar o débito.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(request: Request) {
  const data = await request.json()

  const updatedDebits = await prisma.debits.updateMany({
    where: {
      id: { in: data.ids }
    },
    data: {
      IsBaixa: true
    }
  })
  
  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(request: Request) {
  try {
    // Obtém o ID da unidade a ser excluída da URL
    const { searchParams } = new URL(request.url);
    const debitId = searchParams.get('id');

    // Validação para garantir que o ID foi fornecido
    if (!debitId) {
      return NextResponse.json({ error: 'O ID da unidade é obrigatório.' }, { status: 400 });
    }

    // Excluir a unidade do banco de dados
    const deletedDebit = await prisma.debits.delete({
      where: {
        id: debitId, // Assumindo que o campo de ID é do tipo inteiro
      },
    });

    // Retorna a resposta com a unidade excluída
    return NextResponse.json(deletedDebit, { status: 200 });
  } catch (error) {
    console.error('Erro ao excluir unidade:', error);
    return NextResponse.json({ error: 'Erro ao excluir a unidade.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: Request) {
  try {
    // Obtém o ID da unidade a ser atualizada da URL
    const { searchParams } = new URL(request.url);
    const unitId = searchParams.get('id');

    // Validação para garantir que o ID foi fornecido
    if (!unitId) {
      return NextResponse.json({ error: 'O ID da unidade é obrigatório.' }, { status: 400 });
    }

    // Obtém os dados do corpo da requisição
    const data = await request.json();

    // Validação básica para garantir que ao menos um campo foi enviado para atualização
    if (!data.description) {
      return NextResponse.json(
        { error: 'É necessário fornecer pelo menos um campo para atualização.' },
        { status: 400 }
      );
    }

    const primaryexpectedDate = new Date(data.expectedDate)
    const primarydueDate = new Date(data.dueDate)
    const primaryissueDate = new Date(data.issueDate)

    // Atualiza a unidade no banco de dados
    const updatedUnit = await prisma.debits.update({
      where: {
        id: unitId, // Assumindo que o campo de ID é do tipo string
      },
      data: {
        description: data.description,
        valueToPay: data.valueToPay,
        expectedDate: new Date(primaryexpectedDate.getTime() + primaryexpectedDate.getTimezoneOffset() * 60000),
        dueDate: new Date(primarydueDate.getTime() + primarydueDate.getTimezoneOffset() * 60000),
        issueDate: new Date(primarydueDate.getTime() + primarydueDate.getTimezoneOffset() * 60000)
      },
    });

    // Retorna a resposta com a unidade atualizada
    return NextResponse.json(updatedUnit, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar o débito:', error);
    return NextResponse.json({ error: 'Erro ao atualizar a unidade.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}