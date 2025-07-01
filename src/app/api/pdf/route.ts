import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  const { data, startDate, endDate, isDebit} = await request.json();

  const pdfDoc = await PDFDocument.create();

  // Fonte
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Logo
  const logoPath = path.join(process.cwd(), "public", "logo.png");
  const logoBytes = fs.readFileSync(logoPath);
  const logoImage = await pdfDoc.embedPng(logoBytes);
  const logoDims = logoImage.scale(0.4);

  const pageWidth = 800;
  const pageHeight = 600;

  // Ajustar as larguras das colunas para que a tabela ocupe toda a largura
  const colWidths = [
    (pageWidth - 40) * 0.2, // 20% para a primeira coluna (DESCRIÇÃO)
    (pageWidth - 40) * 0.15, // 15% para a segunda coluna (DATA DE EMISSÃO)
    (pageWidth - 40) * 0.15, // 15% para a terceira coluna (VENCIMENTO)
    (pageWidth - 40) * 0.15, // 15% para a quarta coluna (DATA DE QUITAÇÃO)
    (pageWidth - 40) * 0.2, // 20% para a quinta coluna (VALOR)
  ];
  const tableWidth = colWidths.reduce((sum, w) => sum + w, 0); // Largura total da tabela
  const tableStartX = (pageWidth - tableWidth) / 2; // Posição inicial da tabela
  let y = 500; // Coordenada inicial Y
  const rowHeight = 25;

  let pageCount = 0;

const addPage = () => {
  const page = pdfDoc.addPage([pageWidth, pageHeight]);
  pageCount++;

  // Logo canto superior esquerdo
  page.drawImage(logoImage, {
    x: 50,
    y: 520,
    width: logoDims.width,
    height: logoDims.height,
  });
  
  
  // Título centralizado
const title = isDebit ? "LISTA DE DÉBITOS" : "LISTA DE RECEITAS";
const titleFontSize = 14;
const titleWidth = boldFont.widthOfTextAtSize(title, titleFontSize);
page.drawText(title, {
  x: (pageWidth - titleWidth) / 2,
  y: 530,
  size: titleFontSize,
  font: boldFont,
  color: rgb(0, 0, 0),
});

// Subtítulo com o período, se fornecido
if (startDate && endDate) {
  const period = `Período: ${new Date(startDate).toLocaleDateString("pt-BR")} até ${new Date(endDate).toLocaleDateString("pt-BR")}`;
  const periodFontSize = 11;
  const periodWidth = font.widthOfTextAtSize(period, periodFontSize);
  page.drawText(period, {
    x: (pageWidth - periodWidth) / 2,
    y: 515,
    size: periodFontSize,
    font: font,
    color: rgb(0.3, 0.3, 0.3),
  });
}


  // Data/hora atual formatada
  const now = new Date();
  const formatDate = now.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const footerText = `Emitido em ${formatDate}`;
  const pageNumberText = `Página ${pageCount}`;

  // Texto no rodapé (esquerda)
  page.drawText(footerText, {
    x: 50,
    y: 30,
    size: 10,
    font,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Texto no rodapé (direita)
  page.drawText(pageNumberText, {
    x: pageWidth - 100,
    y: 30,
    size: 10,
    font,
    color: rgb(0.3, 0.3, 0.3),
  });

  return page;
};


  // Adiciona a primeira página
  let page = addPage();

  const drawTextInCell = (text: string, x: number, y: number, maxWidth: number, font: any, page: any) => {
    const words = text.split(' ');
    let line = '';
    const lines: string[] = [];

    // Quebra o texto em linhas
    words.forEach((word) => {
      const testLine = line + word + ' ';
      const testWidth = font.widthOfTextAtSize(testLine, 10);

      if (testWidth > maxWidth) {
        lines.push(line);
        line = word + ' ';
      } else {
        line = testLine;
      }
    });

    lines.push(line); // Adiciona a última linha

    // Desenha as linhas quebradas com margem
    const margin = 4; // Margem de 3 pontos entre o texto e a borda
    lines.forEach((line, i) => {
      page.drawText(line, {
        x: x + margin, // Ajuste a posição para incluir a margem
        y: y - i * 12 - rowHeight / 2,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });
    });
  };

  const drawTable = () => {
    // Desenha a tabela
    data.forEach((row: any, index: any) => {
      const [desc, emission, due, paymentDate, value] = row; // Novo valor aqui
  
      const isBold = ["DESCRIÇÃO", "DATA DE EMISSÃO", "VENCIMENTO", "DATA DE QUITAÇÃO", "VALOR", "TOTAL"].includes(
        desc.trim().toUpperCase()
      ) || (index > 0 && !emission && !due && !paymentDate && !value); // Linha de unidade
  
      const currentFont = isBold ? boldFont : font;
  
      // Adiciona nova página se necessário
      if (y - rowHeight < 50) {
        page = addPage();
        y = 500;
      }
  
      // Desenhar células
      const columns = [desc, emission, due, paymentDate, value]; // Adicionado paymentDate aqui
      let x = tableStartX;
  
      columns.forEach((text, colIndex) => {
        if (colIndex === 0) {
          // Quebra de linha para a primeira coluna
          drawTextInCell(text, x, y, colWidths[colIndex], currentFont, page);
        } else {
          page.drawText(text, {
            x: x + 5,
            y: y - rowHeight / 2,
            size: 10,
            font: currentFont,
            color: rgb(0, 0, 0),
          });
        }
  
        x += colWidths[colIndex];
      });
  
      // Desenhar linhas horizontais e verticais
      page.drawLine({
        start: { x: tableStartX, y },
        end: { x: tableStartX + tableWidth, y },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
  
      for (let i = 0; i <= colWidths.length; i++) {
        const lineX = tableStartX + colWidths.slice(0, i).reduce((sum, w) => sum + w, 0);
        page.drawLine({
          start: { x: lineX, y: y - rowHeight },
          end: { x: lineX, y },
          thickness: 1,
          color: rgb(0, 0, 0),
        });
      }
  
      y -= rowHeight;
    });
  
    // Desenhar borda inferior da última linha
    page.drawLine({
      start: { x: tableStartX, y },
      end: { x: tableStartX + tableWidth, y },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
  };
  
  

  drawTable();

  const pdfBytes = await pdfDoc.save();
  return new Response(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="relatorio.pdf"`,
    },
  });
}
