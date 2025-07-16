import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
}

const base = 'px-4 py-2 rounded-lg font-medium transition-shadow shadow-sm focus:outline-none';
const variants = {
  primary:   'bg-primary text-text hover:bg-primary/80',
  secondary: 'bg-card text-text/80 border border-line hover:bg-card/80',
  danger:    'bg-danger text-text hover:bg-danger/80',
};

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', children, ...props }) => {
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 