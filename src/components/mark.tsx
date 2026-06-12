import type { ReactNode } from "react";

interface MarkProps {
  children: ReactNode;
}

export function Mark({ children }: MarkProps) {
  return (
    <mark className="bg-(--selection-bg) text-(--selection-fg) **:text-inherit rounded-sm px-[0.25em] not-italic">
      {children}
    </mark>
  );
}
