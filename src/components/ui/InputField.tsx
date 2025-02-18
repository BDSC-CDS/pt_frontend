import { ChangeEvent } from "react";

interface InputFieldProps {
    label: string,
    name: string,
    value: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    error?: string,
    type?: string 
}

export default function InputField({ label, name, value, onChange, error, type = "text" }:  InputFieldProps){
    return (
        <div className="mb-3 w-full">
            <input
                id={name}
                name={name}
                placeholder={label}
                type={type}
                value={value}
                onChange={onChange}
                autoComplete={name}
                className={`border rounded px-2 py-1 w-full text-black ${error ? "border-red-500" : ""}`}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
}