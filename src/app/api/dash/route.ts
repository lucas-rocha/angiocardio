import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";
import { format, formatDate } from "date-fns";

export async function POST(request: Request) {
  const { debit, credit, startDate, endDate } = await request.json();
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const logoPath = path.join(process.cwd(), "public", "logo.png");
  const logoBytes = fs.readFileSync(logoPath);
  const logoImage = await pdfDoc.embedPng(logoBytes);
  const logoDims = logoImage.scale(0.4);

  const pageWidth = 800;
  const pageHeight = 600;
  const colWidths = [
    (pageWidth - 40) * 0.2,
    (pageWidth - 40) * 0.15,
    (pageWidth - 40) * 0.15,
    (pageWidth - 40) * 0.15,
    (pageWidth - 40) * 0.2
  ];
  const tableWidth = colWidths.reduce((sum, w) => sum + w, 0);
  const tableStartX = (pageWidth - tableWidth) / 2;
  let y = 500;
  const rowHeight = 25;
  let pageCount = 1;

  // Função para extrair e formatar o mês/ano corretamente
const getBaixaMonthYear = () => {
  const baixaDate = debit[2][3]; // Quarta coluna da terceira linha
  console.log("Data de baixa original:", baixaDate); // Diagnóstico
  const [day, month, year] = baixaDate.split("/"); // Divide a data no formato DD/MM/YYYY
  const months = [
    "jan", "fev", "mar", "abr", "mai", "jun", 
    "jul", "ago", "set", "out", "nov", "dez"
  ];
  const monthName = months[parseInt(month, 10) - 1]; // Converte mês para índice
  const shortYear = year.slice(-2); // Últimos dois dígitos do ano
  console.log("Mês e ano extraídos:", `${monthName}/${shortYear}`); // Diagnóstico
  return `${monthName}/${shortYear}`;
};


  const addPage = () => {
    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    page.drawImage(logoImage, { 
      x: 30, 
      y: 550, 
      width: logoDims.width, 
      height: logoDims.height 
    });

    if(startDate != null && endDate != null) {
      const periodoTexto = `Período: ${format(new Date(startDate + 'T00:00:00'), 'dd/MM/yyyy')} até ${format(new Date(endDate + 'T00:00:00'), 'dd/MM/yyyy')}`;
      page.drawText(periodoTexto, {
        x: logoDims.width + 50,
        y: 550,
        size: 12,
        font: boldFont,
        color: rgb(0.3, 0.3, 0.3)
      });
    }

    return page;
  };

const drawPageNumber = (page: any) => {
  const fontSize = 10;
  const actualDate = new Date();

  const dateText = `Emitido em ${format(actualDate, "dd/MM/yyyy 'às' HH:mm")}`;
  const pageText = `Página ${pageCount}`;
  const combinedText = `${dateText}  •  ${pageText}`;

  page.drawText(combinedText, {
    x: pageWidth - 50 - font.widthOfTextAtSize(combinedText, fontSize), // alinhado à direita com margem
    y: 30, // posição no rodapé
    size: fontSize,
    font: font,
    color: rgb(0.3, 0.3, 0.3),
  });

  pageCount++;
};



  // const marginBetweenSections = 30; // Margem entre seções

  let totalDebitos = 0;
let totalCreditos = 0;

const drawTableSection = (data: string[][], title: string, isDebit: boolean) => {
  // Desenha o título da seção (DÉBITOS ou CRÉDITOS)
  page.drawText(title, {
    x: tableStartX,
    y: y,  // Posição do título
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  y -= rowHeight; // Desce para a linha de separação

  // Linha de separação entre título e a tabela
  page.drawLine({
    start: { x: tableStartX, y },
    end: { x: tableStartX + tableWidth, y },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  y -= rowHeight; // Desce para a primeira linha da tabela

  // Desenha a tabela com dados
  data.forEach((row, index) => {
    if (y - rowHeight < 50) {
      // Verifica se o espaço acabou e cria uma nova página
      page = addPage();  // Cria uma nova página quando chega no limite
      y = 500;  // Reseta a posição para o topo da nova página
    }

    let x = tableStartX;
    row.forEach((text, colIndex) => {
      // Identifica unidades e coloca em negrito
      const isUnit = colIndex === 0 && (index === 0 || text.trim().toUpperCase() === text.trim());

      // Define negrito para unidades, descrições e totais
      const isBold =
        isUnit || // Texto das unidades
        ["DESCRIÇÃO", "TOTAL"].includes(row[0].trim().toUpperCase()); // Cabeçalhos ou Totais

      const currentFont = isBold ? boldFont : font;

      page.drawText(text, {
        x: x + 5,
        y: y - rowHeight / 2,
        size: 10,
        font: currentFont,
        color: rgb(0, 0, 0),
      });
      x += colWidths[colIndex];
    });

    // Desenha as linhas verticais entre as colunas (incluindo entre "VALOR" e "STATUS")
    let currentX = tableStartX;
    colWidths.forEach((colWidth) => {
      // Desenha as bordas verticais entre as colunas
      page.drawLine({
        start: { x: currentX, y: y },
        end: { x: currentX, y: y - rowHeight },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
      currentX += colWidth;
    });

    // **Desenha a borda vertical direita em todas as linhas**
    page.drawLine({
      start: { x: currentX, y: y },  // Posição final da última coluna
      end: { x: currentX, y: y - rowHeight },  // Desenha até a linha de baixo
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    // Desenha a linha horizontal entre as linhas da tabela
    page.drawLine({
      start: { x: tableStartX, y },
      end: { x: tableStartX + tableWidth, y },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    y -= rowHeight;

    // Se for uma linha de total, adicione ao total
    if (index === data.length - 1) {
      const value = row[4].replace('R$', '').replace('.', '').replace(',', '.').trim();  // Remove R$ e converte vírgula para ponto
      const numericValue = parseFloat(value);
      if (isDebit) {
        totalDebitos += numericValue;
      } else {
        totalCreditos += numericValue;
      }
    }
  });

  // Desenha a borda horizontal na última linha (se necessário)
  page.drawLine({
    start: { x: tableStartX, y },
    end: { x: tableStartX + tableWidth, y },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  // Ajuste para a próxima seção (CRÉDITOS) ou próxima parte da tabela
  y -= 50;  // Deixa uma pequena margem entre as seções
};

// Função para desenhar o lucro ou prejuízo
const drawLucroOuPrejuizo = (page: any) => {
  // Calcular lucro ou prejuízo
  const lucroOuPrejuizo = totalCreditos - totalDebitos; // Créditos menos débitos

  console.log(`Total Débitos: ${totalDebitos}`);
  console.log(`Total Créditos: ${totalCreditos}`);
  console.log(`Lucro ou Prejuízo: ${lucroOuPrejuizo}`);

  const resultado = lucroOuPrejuizo >= 0
    ? `Lucro: R$ ${lucroOuPrejuizo.toFixed(2)}`
    : `Prejuízo: R$ ${Math.abs(lucroOuPrejuizo).toFixed(2)}`;

  // Desenha o título da seção
  page.drawText("LUCRO OU PREJUÍZO", {
    x: tableStartX,
    y: y,  // Posição do título
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  y -= rowHeight;

  // Desenha o resultado
  page.drawText(resultado, {
    x: tableStartX,
    y: y,  // Posição do texto
    size: 12,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  y -= rowHeight * 2;  // Deixa espaço para o final
};

// Agora, ao desenhar as tabelas de Débitos e Créditos, chamamos as funções:

let page = addPage();
drawTableSection(debit, "DÉBITOS", true);  // Passa `true` para débitos
drawTableSection(credit, "CRÉDITOS", false); // Passa `false` para créditos


drawLucroOuPrejuizo(page);
drawPageNumber(page); // Agora sim, abaixo de "Lucro ou Prejuízo"

  
  const pdfBytes = await pdfDoc.save();
  return new Response(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="relatorio.pdf"`,
    },
  });
}

