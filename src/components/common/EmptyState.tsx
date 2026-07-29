import React from "react";
import AppCard from "./AppCard";
import AppText from "./AppText";

interface IEmptyStateProps {
  message: string;
}

const EmptyState: React.FC<IEmptyStateProps> = ({ message }) => {
  return (
    <AppCard bordered>
      <AppText align="center" variant="bodySecondary">
        {message}
      </AppText>
    </AppCard>
  );
};

export default EmptyState;
