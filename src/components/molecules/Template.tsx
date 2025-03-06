import { useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/AuthContext';
import { useNavigate } from 'react-router-dom';

const Template = () => {
  const { userAuth } = useAuth();
  const navigate = useNavigate();

  const handleSeeXXX = (uid: string) => {
    navigate(`/XXX/${uid}`);
  };

  const loadingIndicator = <LoadingOutlined style={{ fontSize: 24, color: 'white' }} spin />;

  return (
    <section>
      <div className="pt-16 flex justify-center mb-20" style={{ paddingLeft: '80px' }}>
        <div className="bg-white/90 rounded-lg shadow-left-bottom border border-gray-400 p-6 space-y-4 w-full max-w-full">
          <h1 className="text-4xl font-bold text-gray-800 text-left mb-[25px]">Template</h1>
          
        </div>
      </div>
    </section>
  );
};

export default Template;
