import { FC, ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

interface TableProps {
  children: ReactNode;
  className?: string;
}

export const Table: FC<TableProps> = ({ children, className }) => {
  return (
    <div className="overflow-x-auto">
      <table className={cn('min-w-full divide-y divide-gray-200', className)}>
        {children}
      </table>
    </div>
  );
};

interface TableHeadProps {
  children: ReactNode;
}

export const TableHead: FC<TableHeadProps> = ({ children }) => {
  return <thead className="bg-gray-50">{children}</thead>;
};

interface TableBodyProps {
  children: ReactNode;
}

export const TableBody: FC<TableBodyProps> = ({ children }) => {
  return <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>;
};

interface TableRowProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const TableRow: FC<TableRowProps> = ({
  children,
  className,
  onClick,
}) => {
  return (
    <tr
      className={cn(
        'hover:bg-gray-50 transition-colors',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

interface TableCellProps {
  children: ReactNode;
  className?: string;
  isHeader?: boolean;
}

export const TableCell: FC<TableCellProps> = ({
  children,
  className,
  isHeader = false,
}) => {
  const Component = isHeader ? 'th' : 'td';
  return (
    <Component
      className={cn(
        isHeader
          ? 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
          : 'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
        className
      )}
    >
      {children}
    </Component>
  );
};
