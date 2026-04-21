import { type InputHTMLAttributes, forwardRef, useId } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, id: idProp, ...props }, ref) => {
    const genId = useId();
    const id = idProp ?? genId;

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label ? (
          <label htmlFor={id} className="text-sm font-medium text-foreground">
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={id}
          className={`w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none ring-primary/30 placeholder:text-muted focus:ring-2 ${error ? "border-accent" : ""} ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-sm text-accent" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
