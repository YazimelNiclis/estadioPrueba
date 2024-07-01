import React from "react";
import { AccordionItem, AccordionItemProps } from "@nextui-org/react";

interface StyledAccordionItemProps extends AccordionItemProps {
  subtitle?: React.ReactNode;
  className?: string;
}

const StyledAccordionItem: React.FC<StyledAccordionItemProps> = ({
  subtitle,
  className = "",
  children,
  ...props
}) => {
  return (
    <AccordionItem
      {...props}
      classNames={{
        title: "font-bold",
        heading: "bg-[#EEF4F9] px-4 rounded-lg",
      }}
      className={className}
      subtitle={subtitle}
    >
      {children}
    </AccordionItem>
  );
};

export default StyledAccordionItem;
