import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  const data = [
    ["DESCRIÇÃO", "VALOR"],
    
    ["ISS NOTA NEW MED", "R$ 12.214,00"],
    ["ISS RETIDO CECOR 2/10", "R$ 4.500,00"],
    ["ROBERTO ***", "R$ 9.000,00"],
    ["TAXA BANCARIA SHILD", "R$ 4.020,00"],
    ["ISS TRIMESTRE NEW MED", "R$ 2.400,00"],
    
    ["CORDIS", ""],
    ["NF 9301 VALOR 16875,00 VENC 07/10", "R$ 16.875,00"],
    
    ["MICROPORT", ""],
    ["NF 47213/3 VALOR 23997,00 VENC 10/10", "R$ 23.997,00"],
    ["NF 48494/3 VALOR 2000,00", "R$ 2.000,00"],
    
    ["LITORAL", ""],
    ["NF 166977 VALOR 17500,00 *** VENC 15/10", "R$ 17.500,00"],
    ["NF 11284 STENTS RECIFE 2/3", "R$ 6.000,00"],
    ["NF 20921 VALOR 1400,00 VENC 28/10", "R$ 1.400,00"],
    ["NF 20556 VALOR 2670,00 VENC 04/10", "R$ 2.670,00"],
    ["100 TIG DEPOSITO 084.847.508-92", "R$ 3.800,00"],
    ["100 TIG DEPOSITO 084.847.508-92", "R$ 3.800,00"],
    ["100 TIG DEPOSITO 084.847.508-92", "R$ 3.800,00"],
    ["100 TIG DEPOSITO 084.847.508-92", "R$ 3.800,00"],
    ["100 TIG DEPOSITO 084.847.508-92", "R$ 3.800,00"],
    ["100 TIG DEPOSITO 084.847.508-92", "R$ 3.800,00"],
    ["100 TIG DEPOSITO 084.847.508-92", "R$ 3.800,00"],
    ["100 TIG DEPOSITO 084.847.508-92", "R$ 3.800,00"],
    ["100 TIG DEPOSITO 084.847.508-92", "R$ 3.800,00"],
    ["100 TIG DEPOSITO 084.847.508-92", "R$ 3.800,00"],
    ["100 TIG DEPOSITO 084.847.508-92", "R$ 3.800,00"],
    ["100 TIG DEPOSITO 084.847.508-92", "R$ 3.800,00"],
    
    ["NOBRE", ""],
    ["DEPOSITO EM CONTA", "R$ 20.000,00"],
    ["TOTAL", "R$ 425.087,50"]
  ];

  const pdfDoc = await PDFDocument.create();

  // Definir a fonte
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Carregar imagem do logo
  const logoPath = path.join(process.cwd(), "public", "logo.png"); // Ajuste o nome da imagem
  const logoBytes = fs.readFileSync(logoPath);
  const logoImage = await pdfDoc.embedPng(logoBytes);
  const logoDims = logoImage.scale(0.4);

  let y = 500; // Coordenada Y inicial para a primeira página
  const tableStartX = 50;
  const rowHeight = 25;
  const colWidths = [500, 150];

  const addPage = () => {
    const page = pdfDoc.addPage([800, 600]);

    // Adicionar logo no canto esquerdo superior
    page.drawImage(logoImage, {
      x: 50,
      y: 520,
      width: logoDims.width,
      height: logoDims.height,
    });

    // Adicionar texto "set/24" no canto direito superior
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

  const drawTable = () => {
    // Configuração da tabela
    data.forEach((row, index) => {
      const [desc, value] = row;

      // Verifica se a descrição deve ser em negrito
      const isBold = ["DESCRIÇÃO", "VALOR", "TOTAL", "CORDIS", "MICROPORT", "LITORAL", "NOBRE"].includes(desc.trim().toUpperCase());
      const currentFont = isBold ? boldFont : font;

      // Se o conteúdo passar do final da página, cria uma nova página
      if (y - rowHeight < 50) {
        page = addPage();
        y = 500; // Resetar Y após adicionar uma nova página
      }

      // Adicionar texto da descrição
      page.drawText(desc, {
        x: tableStartX + 5,
        y: y - rowHeight / 2,
        size: 10,
        font: currentFont,
        color: rgb(0, 0, 0),
      });

      if (value) {
        page.drawText(value, {
          x: tableStartX + colWidths[0] + 5,
          y: y - rowHeight / 2,
          size: 10,
          font: currentFont,
          color: rgb(0, 0, 0),
        });
      }

      // Adicionar linha horizontal
      page.drawLine({
        start: { x: tableStartX, y },
        end: { x: tableStartX + colWidths[0] + colWidths[1], y },
        thickness: 1,
        color: rgb(0, 0, 0),
      });

      // Adicionar linhas verticais
      page.drawLine({
        start: { x: tableStartX, y: y - rowHeight },
        end: { x: tableStartX, y },
        thickness: 1,
        color: rgb(0, 0, 0),
      });

      page.drawLine({
        start: { x: tableStartX + colWidths[0], y: y - rowHeight },
        end: { x: tableStartX + colWidths[0], y },
        thickness: 1,
        color: rgb(0, 0, 0),
      });

      page.drawLine({
        start: { x: tableStartX + colWidths[0] + colWidths[1], y: y - rowHeight },
        end: { x: tableStartX + colWidths[0] + colWidths[1], y },
        thickness: 1,
        color: rgb(0, 0, 0),
      });

      y -= rowHeight;
    });

    // Linha final horizontal
    page.drawLine({
      start: { x: tableStartX, y },
      end: { x: tableStartX + colWidths[0] + colWidths[1], y },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    // Linhas verticais para bordas na última linha
    page.drawLine({
      start: { x: tableStartX, y: 500 },
      end: { x: tableStartX, y },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    page.drawLine({
      start: { x: tableStartX + colWidths[0], y: 500 },
      end: { x: tableStartX + colWidths[0], y },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    page.drawLine({
      start: { x: tableStartX + colWidths[0] + colWidths[1], y: 500 },
      end: { x: tableStartX + colWidths[0] + colWidths[1], y },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
  };

  // Desenha a tabela no PDF
  drawTable();

  const pages = pdfDoc.getPages();
  pages.forEach((page, index) => {
    const pageNumber = index + 1;  // Página 1, 2, 3...
    page.drawText(`Página ${pageNumber}`, {
      x: 350,  // Posição X centralizada
      y: 20,   // Posição Y no rodapé
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    });
  });

  // Salvar o PDF
  const pdfBytes = await pdfDoc.save();

  return new Response(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=relatorio_paisagem.pdf",
    },
  });
}
