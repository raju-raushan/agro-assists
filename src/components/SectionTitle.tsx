import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface SectionTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  title: string;
  description?: string;
}

export function SectionTitle({ title, description, className, ...props }: SectionTitleProps) {
  return (
    <div className={cn("mb-8", className)} {...props}>
      <h2 className="text-3xl font-bold tracking-tight text-primary">{title}</h2>
      {description && (
        <p className="mt-2 text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
