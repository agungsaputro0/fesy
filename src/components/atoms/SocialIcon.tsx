// components/atoms/SocialIcon.tsx
import { FacebookOutlined, TwitterOutlined, YoutubeOutlined } from '@ant-design/icons';
import React from 'react';

const SocialIcon: React.FC = () => {
  return (
    <div className="social-icons whitespace-nowrap">
      <FacebookOutlined style={{ fontSize: '24px', margin: '0 10px', color: '#5c595f' }} />
      <TwitterOutlined style={{ fontSize: '24px', margin: '0 10px', color: '#5c595f' }} />
      <YoutubeOutlined style={{ fontSize: '24px', margin: '0 10px', color: '#5c595f' }} />
    </div>
  );
};

export default SocialIcon;
