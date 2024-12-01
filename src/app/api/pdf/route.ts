import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  const data = [
    ["DESCRIÇÃO", "DATA DE EMISSÃO", "VENCIMENTO", "DATA DE QUITAÇÃO", "VALOR", "STATUS"],

    ["ISS NOTA NEW MED", "-", "-", "-", "R$ 12.214,00", "Pago"],
    ["ISS RETIDO CECOR 2/10", "01/10", "02/10", "03/10", "R$ 4.500,00", "Pendente"],
    ["ROBERTO ***", "-", "-", "-", "R$ 9.000,00", "Pago"],
    ["TAXA BANCARIA SHILD", "-", "-", "-", "R$ 4.020,00", "Pendente"],
    ["ISS TRIMESTRE NEW MED", "-", "-", "-", "R$ 2.400,00", "Pago"],

    ["CORDIS", "", "", "", "", ""],
    ["NF 9301 VALOR 16875,00 VENC 07/10", "05/10", "07/10", "-", "R$ 16.875,00", "Pendente"],

    ["MICROPORT", "", "", "", "", ""],
    ["NF 47213/3 VALOR 23997,00 VENC 10/10", "08/10", "10/10", "-", "R$ 23.997,00", "Pago"],
    ["NF 48494/3 VALOR 2000,00", "-", "-", "-", "R$ 2.000,00", "Pendente"],

    ["LITORAL", "", "", "", "", ""],
    ["NF 166977 VALOR 17500,00 *** VENC 15/10", "12/10", "15/10", "-", "R$ 17.500,00", "Pago"],
    ["NF 11284 STENTS RECIFE 2/3", "-", "-", "-", "R$ 6.000,00", "Pendente"],
    ["NF 20921 VALOR 1400,00 VENC 28/10", "25/10", "28/10", "-", "R$ 1.400,00", "Pendente"],
    ["NF 20556 VALOR 2670,00 VENC 04/10", "02/10", "04/10", "-", "R$ 2.670,00", "Pago"],
    ["100 TIG DEPOSITO 084.847.508-92", "-", "-", "-", "R$ 3.800,00", "Pago"],
    ["100 TIG DEPOSITO 084.847.508-92", "-", "-", "-", "R$ 3.800,00", "Pago"],
    ["100 TIG DEPOSITO 084.847.508-92", "-", "-", "-", "R$ 3.800,00", "Pago"],

    ["NOBRE", "", "", "", "", ""],
    ["DEPOSITO EM CONTA", "-", "-", "-", "R$ 20.000,00", "Pago"],
    ["TOTAL", "", "", "", "R$ 425.087,50", ""]
  ];

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
    (pageWidth - 40) * 0.15  // 15% para a sexta coluna (STATUS)
  ];
  const tableWidth = colWidths.reduce((sum, w) => sum + w, 0); // Largura total da tabela
  const tableStartX = (pageWidth - tableWidth) / 2; // Posição inicial da tabela
  let y = 500; // Coordenada inicial Y
  const rowHeight = 25;

  const addPage = () => {
    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    // Adicionar logo no canto superior esquerdo
    page.drawImage(logoImage, {
      x: 50,
      y: 520,
      width: logoDims.width,
      height: logoDims.height,
    });

    // Adicionar texto no canto superior direito
    page.drawText("set/24", {
      x: 700,
      y: 550,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
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
    data.forEach((row, index) => {
      const [desc, emission, due, paymentDate, value, status] = row; // Novo valor aqui

      const isBold = ["DESCRIÇÃO", "DATA DE EMISSÃO", "VENCIMENTO", "DATA DE QUITAÇÃO", "VALOR", "STATUS", "TOTAL"].includes(
        desc.trim().toUpperCase()
      );
      const currentFont = isBold ? boldFont : font;

      // Adiciona nova página se necessário
      if (y - rowHeight < 50) {
        page = addPage();
        y = 500;
      }

      // Desenhar células
      const columns = [desc, emission, due, paymentDate, value, status]; // Adicionado paymentDate aqui
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
