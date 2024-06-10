import React from 'react';

interface NcInputNumberProps {
  className?: string;
  value: number;
  onChange: (newQty: number) => void;
}

const NcInputNumber: React.FC<NcInputNumberProps> = ({
  className = '',
  value,
  onChange,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.max(1, parseInt(event.target.value) || 0);
    onChange(newValue);
  };

  return (
    <div className={`nc-NcInputNumber ${className}`}>
      Quantity:
      <input
        type="number"
        className="form-input block w-full border border-gray-300 rounded-md"
        value={value}
        onChange={handleChange}
        min={1}
        max={5}
      />
    </div>
  );
};

export default NcInputNumber;
