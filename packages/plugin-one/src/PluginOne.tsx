import React from 'react';

export interface PluginOneProps {
  title?: string;
}

const PluginOne: React.FC<PluginOneProps> = ({ title = 'Plugin One' }) => {
  return (
    <div>
      <h1>{title}</h1>
    </div>
  );
};

export default PluginOne;
