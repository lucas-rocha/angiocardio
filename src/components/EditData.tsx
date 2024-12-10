import { addHours, format, parseISO } from "date-fns"
import { ptBR } from 'date-fns/locale'
import { useState } from "react"

type EditDataProps = {
  id: string
  value: string
  onSave: (id: string, newDate: string) => void
}

export default function EditData({ id, value, onSave }: EditDataProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(
    value
    ? format(addHours(parseISO(value), 3), "yyyy-MM-dd", { locale: ptBR }) // Ajusta para Horário de Brasília
    : format(new Date(), "yyyy-MM-dd", { locale: ptBR })
  );

  const handleSave = () => {
    setIsEditing(false);
    if (onSave) {
      onSave(id, inputValue); // Envia o novo valor para o pai
    }
  };

  console.log(value)

  return (
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={() => !isEditing && setIsEditing(true)}>
      {isEditing ? (
        <div>
          <input
            type="date"
            className="px-3 py-2 border rounded-md"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            // onBlur={handleSave}
          />
          <button onClick={handleSave}>Salvar</button>
        </div>
      ) : (
        format(parseISO(inputValue), "dd-MM-yyyy", { locale: ptBR })
      )}
    </td>
  )
}