import { useEffect, useState } from 'react';

export type Validation = {
    required?: boolean;
    maxLength?: number;
    minLength?: number;
    pattern?: RegExp;
    message?: string;
};

export const useValidation = (value: string, validation?: Validation) => {
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!validation) return;

        if (validation.required && !value) {
            setError("This field is required.");
        } else if (validation.minLength && value.length < validation.minLength) {
            setError(`Minimum length is ${validation.minLength}.`);
        } else if (validation.maxLength && value.length > validation.maxLength) {
            setError(`Maximum length is ${validation.maxLength}.`);
        } else if (validation.pattern && !validation.pattern.test(value)) {
            setError(validation.message || "Invalid format.");
        } else {
            setError(null);
        }
    }, [value, validation]);

    return error;
};
