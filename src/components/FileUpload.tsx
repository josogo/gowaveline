
import React from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from './file-upload/FileUpload';

type ContactInfo = {
  companyName?: string;
  email?: string;
  phone?: string;
};

interface FileUploadWrapperProps {
  contactInfo?: ContactInfo;
}

const FileUploadWrapper: React.FC<FileUploadWrapperProps> = ({ contactInfo }) => {
  return <FileUpload contactInfo={contactInfo} />;
};

export default FileUploadWrapper;
