import { uploadResume } from '@/src/service/genService';
import { useMutation, useQueryClient } from '@tanstack/react-query';


export function useUploadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadResume(file),
    onSuccess: () => {
      // Invalidate your stats query so the UI updates the "Chunks" count
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
    onError: (error) => {
      console.error("Upload failed:", error);
    }
  });
}