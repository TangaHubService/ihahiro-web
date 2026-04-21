import { type SelectHTMLAttributes, forwardRef, useId } from "react";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", label, error, id: idProp, children, ...props }, ref) => {
    const genId = useId();
    const id = idProp ?? genId;

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label ? (
          <label htmlFor={id} className="text-sm font-medium text-foreground">
            {label}
          </label>
        ) : null}
        <select
          ref={ref}
          id={id}
          className={`w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none ring-primary/30 focus:ring-2 ${error ? "border-accent" : ""} ${className}`}
          {...props}
        >
          {children}
        </select>
        {error ? (
          <p className="text-sm text-accent" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

Select.displayName = "Select";
