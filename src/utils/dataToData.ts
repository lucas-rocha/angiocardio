type Unit = {
  id: string;
  Description: string;
  CNPJ: string;
};

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
};

const transformData = (originalData: DebitEntry[]): string[][] => {
  let totalValue = 0;  // Variável para armazenar o total

  const result = originalData.reduce((acc: any, item, index) => {
      // Adiciona a linha de cabeçalho, caso ainda não tenha sido adicionada
      if (index === 0) {
          acc.push(["DESCRIÇÃO", "DATA DE EMISSÃO", "VENCIMENTO", "DATA DE BAIXA", "VALOR"]);
      }

      // Formata as datas
      const dueDate = new Date(item.dueDate).toLocaleDateString("pt-BR");
      // const expectedDate = new Date(item.expectedDate).toLocaleDateString("pt-BR");
      const issueDate = new Date(item.issueDate).toLocaleDateString("pt-BR");
      const baixaDate = new Date(item.baixaDate).toLocaleDateString("pt-BR");

      // Determina o status (Pago/Pendente) com base em "IsBaixa"
      const status = item.IsBaixa ? "Pago" : "Pendente";

      // Formata o valor com a notação monetária brasileira
      const valueToPay = parseFloat(item.valueToPay);
      totalValue += valueToPay;  // Acumula o valor para o total
      const valueFormatted = `${valueToPay.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;

      // const arrayToBold = []
      
      // Adiciona o nome da unidade apenas se for a primeira vez
      if (index === 0 || item.unit.Description !== originalData[index - 1].unit.Description) {
        acc.push([item.unit.Description.toUpperCase(), "", "", "", "", ""]);
      }

      // Adiciona a linha com os dados da nota
      acc.push([ 
          item.description,
          issueDate, 
          dueDate,
          baixaDate, 
          valueFormatted
      ]);

      return acc;
  }, []);

  // Adiciona a linha de total no final da tabela
  const totalFormatted = `${totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
  result.push(["TOTAL", "", "", "", totalFormatted, ""]);

  return result;
};

export default transformData