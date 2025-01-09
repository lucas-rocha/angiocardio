import { useState } from 'react';

interface EditBaixaProps {
  isPago: boolean;
  onStatusChange: (newStatus: boolean) => void;
  onDateChange?: (newDate: string) => void;
  baixaDate: string;
}

export default function EditBaixa({ isPago, onStatusChange, onDateChange, baixaDate }: EditBaixaProps) {
  const [showInput, setShowInput] = useState(false); // Controla a exibição do input
  const [newBaixaDate, setNewBaixaDate] = useState('');

  const handleCancel = () => {
    onStatusChange(false); // Altera o status para pendente
    setShowInput(false); // Esconde o input, caso estivesse visível
  };

  const handleAddDateClick = () => {
    setShowInput(true); // Exibe o input para adicionar a data
  };

  const handleHideInput = () => {
    setShowInput(false); // Esconde o input sem alterar nada
    setNewBaixaDate(''); // Limpa a data, caso algo tenha sido digitado
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setNewBaixaDate(date);
    if (onDateChange) {
      onDateChange(date); // Notifica o componente pai sobre a nova data
    }
  };

  return (
    <div className="p-4 border rounded-md">
      {isPago ? (
        <div>
          <p className="text-green-600 font-semibold">Pagamento efetuado em {baixaDate}</p>
          <button
            type="button"
            className="mt-2 px-3 py-2 bg-red-500 text-white rounded-md"
            onClick={handleCancel}
          >
            Cancelar
          </button>
        </div>
      ) : (
        <div>
          <p className="text-yellow-600 font-semibold">Pendente</p>
          {!showInput ? (
            <button
              type="button"
              className="mt-2 px-3 py-2 bg-blue-500 text-white rounded-md"
              onClick={handleAddDateClick}
            >
              Adicionar Data
            </button>
          ) : (
            <div className="mt-2">
              <label className="block text-sm mb-1">Nova data de baixa</label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-md"
                  value={newBaixaDate}
                  onChange={handleDateChange}
                />
                <button
                  className="px-3 py-2 bg-gray-500 text-white rounded-md"
                  onClick={handleHideInput}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
