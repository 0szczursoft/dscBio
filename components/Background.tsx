import React from 'react';

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-black">
        {/* Radial gradient for fade */}
      <div className="absolute h-full w-full bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      
      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      
      {/* Orbs */}
      <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-indigo-500/20 blur-[128px]" />
      <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-[128px]" />
    </div>
  );
};

export default Background;
