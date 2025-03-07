import React, { useEffect, useState } from "react";

function CurrencyInput({ value, onChange, disabled }: { value: number; onChange: (value: number) => void; disabled?: boolean }) {
  const [displayValue, setDisplayValue] = useState("");

  // Atualiza o valor de exibição quando o valor muda externamente
  useEffect(() => {
    setDisplayValue(
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value)
    );
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ""); // Remove não numéricos
    const numericValue = parseFloat(rawValue) / 100; // Divide por 100 para ajustar decimal
    setDisplayValue(
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(numericValue)
    );
    onChange(numericValue); // Retorna o valor numérico bruto
  };

  return (
    <input
      type="text"
      value={displayValue}
      onChange={handleInputChange}
      className="w-full pl-4 pr-3 py-2 border rounded-md"
      disabled={disabled}
    />
  );
}

export default CurrencyInput;