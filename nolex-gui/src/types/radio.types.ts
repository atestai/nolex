export interface RadioGroupContextValue {
    selectedValue: string | undefined;
    onChange: (value: string) => void;
    name: string;
}

export interface RadioBoxProps {
    value: string | undefined;
    label: string;
    description?: string;
    disabled?: boolean;
}

export interface RadioGroupProps {
    name: string;
    value: string | undefined;
    onChange: (value: string) => void;
    children: React.ReactNode;
    label?: string;
    className?: string;
}
