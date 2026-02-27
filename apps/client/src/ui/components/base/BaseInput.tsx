import React, { forwardRef } from 'react';

interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    isLoading?: boolean;
    containerClassName?: string;
}

const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
    ({ label, error, leftIcon, rightIcon, isLoading, containerClassName = '', className = '', ...props }, ref) => {
        return (
            <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
                {label && (
                    <label className="text-sm font-medium text-neutral-900 ml-1">
                        {label}
                    </label>
                )}
                <div className="relative flex items-center">
                    {leftIcon && (
                        <div className="absolute left-3 text-neutral-400">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={`
              w-full px-4 py-3 rounded-xl border transition-all duration-200
              ${leftIcon ? 'pl-11' : ''}
              ${rightIcon || isLoading ? 'pr-11' : ''}
              ${error
                                ? 'border-error bg-error/5 focus:ring-4 focus:ring-error/10'
                                : 'border-neutral-200 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10'}
              ${isLoading ? 'bg-neutral-50 cursor-wait' : 'bg-white'}
              ${props.disabled ? 'opacity-50 cursor-not-allowed bg-neutral-50' : ''}
              text-neutral-900 placeholder:text-neutral-400 text-sm
              ${className}
            `}
                        {...props}
                    />
                    {(rightIcon || isLoading) && (
                        <div className="absolute right-3 flex items-center">
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 text-brand-primary" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            ) : rightIcon}
                        </div>
                    )}
                </div>
                {error && <span className="text-xs text-error ml-1 font-medium">{error}</span>}
            </div>
        );
    }
);

BaseInput.displayName = 'BaseInput';

export default BaseInput;
