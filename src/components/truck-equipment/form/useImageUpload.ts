import { supabase } from "@/integrations/supabase/client";

export function useImageUpload() {
  const handleImageUpload = async (file: File) => {
    if (!file) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    
    const { error: uploadError, data } = await supabase.storage
      .from('truck-equipment-images')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('truck-equipment-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  return { handleImageUpload };
}