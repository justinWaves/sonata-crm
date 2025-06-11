import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className = '', ...props }, ref) => (
  <input ref={ref} className={`border rounded px-3 py-2 ${className}`} {...props} />
));
Input.displayName = 'Input';

export default Input; 