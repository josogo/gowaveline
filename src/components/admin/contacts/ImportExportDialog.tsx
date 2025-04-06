
import React, { useRef, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Upload, FileText, AlertCircle, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ImportExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any) => void;
  onExport?: () => void;
  contactsCount?: number;
}

export const ImportExportDialog: React.FC<ImportExportDialogProps> = ({
  isOpen,
  onClose,
  onImport,
  onExport,
  contactsCount
}) => {
  const [activeTab, setActiveTab] = useState('import');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleImport = () => {
    if (selectedFile) {
      setIsUploading(true);
      // Simulate upload delay
      setTimeout(() => {
        onImport(selectedFile);
        setIsUploading(false);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 1000);
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Import & Export Contacts</DialogTitle>
          <DialogDescription>
            Import contacts from a CSV file or export your contacts database
            {contactsCount !== undefined && ` (${contactsCount} contacts)`}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="import">Import</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>
          
          <TabsContent value="import" className="space-y-4 pt-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Required Format</AlertTitle>
              <AlertDescription>
                Please ensure your CSV file has headers for: name, email, phone, company, and type.
              </AlertDescription>
            </Alert>
            
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              {selectedFile ? (
                <div className="space-y-2">
                  <FileText className="h-8 w-8 mx-auto text-green-500" />
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {Math.round(selectedFile.size / 1024)} KB
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-gray-400" />
                  <p>Drag & drop your CSV file here or click to browse</p>
                </div>
              )}
              <Input 
                type="file"
                ref={fileInputRef}
                accept=".csv"
                onChange={handleFileChange}
                className={selectedFile ? "hidden" : "opacity-0 absolute inset-0 cursor-pointer"}
              />
            </div>
            
            {selectedFile && (
              <div className="flex justify-end">
                <Button 
                  onClick={handleImport} 
                  className="bg-orange-500 hover:bg-orange-600"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Import Contacts
                    </>
                  )}
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="export" className="pt-4">
            <div className="space-y-4">
              <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                <Check className="h-4 w-4" />
                <AlertTitle>Export Options</AlertTitle>
                <AlertDescription>
                  Export all your contacts or apply filters before exporting
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="radio" id="export-all" name="export-option" defaultChecked />
                  <label htmlFor="export-all">Export all contacts</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="export-filtered" name="export-option" />
                  <label htmlFor="export-filtered">Export filtered contacts only</label>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleExport}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export as CSV
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
