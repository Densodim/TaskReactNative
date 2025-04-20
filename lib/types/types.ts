export type Split<T> = {
  [K in keyof T]: {
    [P in K]: T[P];
  };
}[keyof T];

export type AllOrNone<T, Keys extends keyof T> = (
  | Required<Pick<T, Keys>>
  | Partial<Record<Keys, never>>
) &
  Split<T>;
