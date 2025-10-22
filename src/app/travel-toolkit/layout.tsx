import React from 'react';
import NavBar from '@/components/layout/navbar/NavBar';

const TravelToolkitLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <NavBar />
      <main>{children}</main>
    </div>
  );
};

export default TravelToolkitLayout;
