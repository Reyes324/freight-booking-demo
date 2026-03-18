"use client";

interface DriverNoteInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DriverNoteInput({ value, onChange }: DriverNoteInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 500) {
      onChange(e.target.value);
    }
  };

  const isAtLimit = value.length >= 500;

  return (
    <div>
      <label className="block text-sm text-gray-700 mb-1.5">
        向司机留言
        <span className="text-xs text-gray-400 ml-2">(选填)</span>
      </label>
      <div className="relative">
        <textarea
          value={value}
          onChange={handleChange}
          placeholder="如有特殊要求,可在此留言给司机"
          className={`w-full px-3.5 py-2.5 rounded-lg border resize-none
                    text-sm text-gray-900 placeholder:text-gray-400
                    transition-all
                    focus:outline-none focus:ring-4
                    ${
                      isAtLimit
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
                        : 'border-gray-200 hover:border-gray-300 focus:border-blue-600 focus:ring-blue-600/10'
                    }`}
          rows={4}
          maxLength={500}
        />
        <div
          className={`absolute bottom-2.5 right-3.5 text-xs pointer-events-none
                     ${isAtLimit ? 'text-red-500' : 'text-gray-400'}`}
        >
          {value.length}/500
        </div>
      </div>
    </div>
  );
}
