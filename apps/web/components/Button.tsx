import React from 'react';

type ButtonBaseProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
};

type ButtonAsButton = ButtonBaseProps & React.ButtonHTMLAttributes<HTMLButtonElement> & {
  as?: 'button';
};

type ButtonAsAnchor = ButtonBaseProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  as: 'a';
};

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const Button = ({ children, variant = 'primary', className = '', as, ...props }: ButtonProps) => {
  const baseClassName = `px-4 py-2 rounded font-medium transition ${
    variant === 'secondary' 
      ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50' 
      : 'bg-blue-600 text-white hover:bg-blue-700'
  } ${className}`;

  if (as === 'a') {
    return (
      <a className={baseClassName} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  return (
    <button className={baseClassName} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
};

export default Button; 