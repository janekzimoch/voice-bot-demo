import React from "react";

type TextFieldProps = {
  label: string;
  rows: number;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  name: string;
  value: string;
};

export default function TextField({
  label,
  rows,
  onChange,
  name,
  value,
}: TextFieldProps) {
  return (
    <div className="flex max-w-[400px] flex-col pb-1">
      <div className="-mb-1 ml-1.5 text-left text-sm font-light text-gray-500">
        {label}
      </div>
      <div className=" mt-1 overflow-clip rounded-xl border border-prm-green">
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          placeholder="Type something..."
          className="no-scrollbar scrollbar mt-1 h-full w-full resize-none rounded-xl px-2 text-sm text-gray-500 focus:outline-none"
        />
      </div>
    </div>
  );
}
