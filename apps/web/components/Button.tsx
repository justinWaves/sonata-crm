import React from 'react';

type ButtonProps = (
  | (React.ButtonHTMLAttributes<HTMLButtonElement> & {
      variant?: 'primary' | 'secondary';
      as?: 'button';
    })
  | (React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      variant?: 'primary' | 'secondary';
      as: 'a';
      href: string;
    })
);

const Button: React.FC<ButtonProps> = (props) => {
  const { variant = 'primary', className = '', as = 'button', ...rest } = props as any;
  const base =
    'px-4 py-2 rounded font-semibold transition ' +
    (variant === 'secondary'
      ? 'bg-white border border-black text-black hover:bg-gray-100'
      : 'bg-blue-600 text-white hover:bg-blue-700');
  if (as === 'a') {
    const { href, ...anchorProps } = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return <a href={href} className={`${base} ${className}`} {...anchorProps} />;
  }
  return <button className={`${base} ${className}`} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)} />;
};

export default Button; 