
import { supabase } from '@/integrations/supabase/client';

export const useFileStorage = () => {
  const uploadToStorage = async (file: File, fileName: string) => {
    try {
      try {
        const { data: buckets } = await supabase.storage.listBuckets();
        const statementsBucketExists = buckets?.some(bucket => bucket.name === 'statements');
        
        if (!statementsBucketExists) {
          await supabase.storage.createBucket('statements', {
            public: false,
            fileSizeLimit: 10485760,
          });
        }
      } catch (error) {
        console.warn("Bucket error (may already exist):", error);
      }
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('statements')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) throw uploadError;
      
      const { data: urlData } = await supabase.storage
        .from('statements')
        .createSignedUrl(fileName, 60 * 60 * 24 * 7);
        
      return urlData?.signedUrl || '';
      
    } catch (error) {
      console.error("Storage upload error:", error);
      throw error;
    }
  };

  return { uploadToStorage };
};
