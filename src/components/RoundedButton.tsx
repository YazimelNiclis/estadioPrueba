import React from "react";
import { Button, ButtonProps } from "@nextui-org/react";

interface RoundedButtonProps extends ButtonProps {
  icon: React.ComponentType<{ size: number }>;
  className?: string;
}

const RoundedButton: React.FC<RoundedButtonProps> = ({
  icon: Icon,
  className = "",
  ...props
}) => {
  return (
    <Button
      isIconOnly
      size="sm"
      className={`bg-white rounded-full shadow-md ${className}`}
      {...props}
    >
      <Icon size={16} />
    </Button>
  );
};

export default RoundedButton;
