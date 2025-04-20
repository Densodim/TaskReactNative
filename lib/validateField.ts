export const VALIDATION_RULES: Record<string, validateType> = {
  title: {
    required: true,
    maxLength: 50,
    pattern: /^[a-zA-Zа-яА-ЯёЁ]+$/,
    message: "Only letters are allowed.",
  },
  description: {
    required: false,
    maxLength: 100,
    pattern: /^[a-zA-Zа-яА-ЯёЁ\s]+$/,
    message: "Only letters and spaces are allowed.",
  },
  location: {
    required: false,
    maxLength: 30,
    pattern: /^[a-zA-Zа-яА-ЯёЁ\s]+$/,
    message: "Only letters and spaces are allowed.",
  },
};

/* This `export default function validateField(fields: Record<string, string>) { ... }` function in
TypeScript is a validation function that takes a `fields` object as input, where each key represents
a field name and the corresponding value is the field's value to be validated. */
export default function validateField(fields: Record<string, string>) {
  for (const fieldName in fields) {
    const value = fields[fieldName];
    const rules = VALIDATION_RULES[fieldName];

    if (rules) {
      // Проверка: обязательно для заполнения
      if (rules.required && (!value || value.trim() === "")) {
        return `Поле "${fieldName}" обязательно для заполнения!`;
      }
      // Проверка: максимальная длина
      if (rules.maxLength && value.length > rules.maxLength) {
        return `Поле "${fieldName}" не должно превышать ${rules.maxLength} символов.`;
      }
      // Проверка: соответствие паттерну
      if (rules.pattern && !rules.pattern.test(value)) {
        return (
          rules.message ||
          `Поле "${fieldName}" не соответствует требуемому формату.`
        );
      }
    }
  }

  return null;
}

//type
type validateType = {
  required: boolean;
  maxLength: number;
  pattern: RegExp;
  message: string;
};
