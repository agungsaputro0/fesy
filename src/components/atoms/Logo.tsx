import React from 'react';

const Logo: React.FC = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img
        src="/assets/img/fesy-logo.png" 
        alt="Logo Fesy"
        width={70}
        height={70}
      />
      <div style={{ color: '#5c595f', marginLeft: '15px' }}>
        <h3><b><span className="text-[#7f0353]">Fesy</span></b></h3>
        <h5>E-commerce for your <b>pre-loved</b> clothes</h5>
      </div>
    </div>
  );
};

export default Logo;
