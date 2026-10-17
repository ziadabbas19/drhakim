import { useState } from 'react';
import { dashboardApi } from '../../api/dashboard.js';
import { useI18n } from '../../hooks/useI18n.js';
import { useToast } from '../../hooks/useToast.js';
import { findUploadProblem } from '../../validators/media.js';

// Validates and uploads files, reporting progress; resolves to the new library images.
export const useMediaUpload = ({ limits, onUploaded }) => {
  const { t } = useI18n();
  const toast = useToast();
  const [progress, setProgress] = useState(null);

  const upload = async (fileList) => {
    const files = [...fileList];
    if (!files.length) return [];

    // The limits arrive with the library; files dropped before that are still checked by the API.
    const problem = limits && findUploadProblem(files, limits, t);
    if (problem) {
      toast.error(problem);
      return [];
    }

    setProgress(0);
    try {
      const response = await dashboardApi.media.upload(files, setProgress);
      toast.success(response.message);
      onUploaded?.(response.data);
      return response.data;
    } catch (error) {
      toast.error(error.message);
      return [];
    } finally {
      setProgress(null);
    }
  };

  return { upload, progress, isUploading: progress !== null };
};
