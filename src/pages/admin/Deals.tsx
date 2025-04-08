
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DealsContent from '@/components/admin/Deals';
import { CrmDataProvider } from '@/contexts/CrmDataContext';

const Deals = () => {
  return (
    <AdminLayout>
      <CrmDataProvider>
        <DealsContent />
      </CrmDataProvider>
    </AdminLayout>
  );
};

export default Deals;
