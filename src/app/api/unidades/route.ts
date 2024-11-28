import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // Parse os dados recebidos do corpo da requisição
    const data = await request.json();

    // // Validação básica para garantir que o nome está presente
    // if (!data.name) {
    //   return NextResponse.json({ error: 'O campo "name" é obrigatório.' }, { status: 400 });
    // }

    // Criação da unidade no banco de dados
    const newUnit = await prisma.unit.create({
      data: {
        Description: data.newUnit,
        CNPJ: data.cnpj
      },
    });

    // Retorna a resposta com a nova unidade criada
    return NextResponse.json(newUnit, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar unidade:', error);
    return NextResponse.json({ error: 'Erro ao criar a unidade.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}


export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if(id) {
      const unit = await prisma.unit.findUnique({
        where: { id },
      });
    

      if (!unit) {
        return new Response(JSON.stringify({ error: 'Unit not found' }), {
          status: 404, // Correção na palavra "status"
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify(unit), {
        status: 200, // Correção na palavra "status"
        headers: { 'Content-Type': 'application/json' },
      });

    }

    const units = await prisma.unit.findMany(); // Substitua 'unit' pelo nome correto do modelo no seu esquema Prisma.
    return new Response(JSON.stringify(units), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching units:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch units' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(request: Request) {
  try {
    // Obtém o ID da unidade a ser excluída da URL
    const { searchParams } = new URL(request.url);
    const unitId = searchParams.get('id');

    // Validação para garantir que o ID foi fornecido
    if (!unitId) {
      return NextResponse.json({ error: 'O ID da unidade é obrigatório.' }, { status: 400 });
    }

    // Excluir a unidade do banco de dados
    const deletedUnit = await prisma.unit.delete({
      where: {
        id: unitId, // Assumindo que o campo de ID é do tipo inteiro
      },
    });

    // Retorna a resposta com a unidade excluída
    return NextResponse.json(deletedUnit, { status: 200 });
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
    if (!data.Description && !data.CNPJ) {
      return NextResponse.json(
        { error: 'É necessário fornecer pelo menos um campo para atualização.' },
        { status: 400 }
      );
    }

    // Atualiza a unidade no banco de dados
    const updatedUnit = await prisma.unit.update({
      where: {
        id: unitId, // Assumindo que o campo de ID é do tipo string
      },
      data: {
        Description: data.Description,
        CNPJ: data.CNPJ,
      },
    });

    // Retorna a resposta com a unidade atualizada
    return NextResponse.json(updatedUnit, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar unidade:', error);
    return NextResponse.json({ error: 'Erro ao atualizar a unidade.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}