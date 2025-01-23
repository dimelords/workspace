import React from 'react';

export interface PluginTwoProps {
  title?: string;
}

const PluginTwo: React.FC<PluginTwoProps> = ({ title = 'Plugin Two' }) => {
  return (
    <div>
      <h1>{title}</h1>
    </div>
  );
};

export default PluginTwo;
