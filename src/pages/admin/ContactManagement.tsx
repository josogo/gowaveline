
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ContactManagementContent from '@/components/admin/ContactManagement';
import { CrmDataProvider } from '@/contexts/CrmDataContext';

const ContactManagement = () => {
  return (
    <AdminLayout>
      <CrmDataProvider>
        <ContactManagementContent />
      </CrmDataProvider>
    </AdminLayout>
  );
};

export default ContactManagement;
