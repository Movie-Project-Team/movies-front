import { useToast } from 'primevue/usetoast';

export const useToastMessage = () => {
  const toast = useToast();

  const show = (severity: 'success' | 'info' | 'warn' | 'error', summary: string, detail: string, life = 3000) => {
    toast.add({
      severity,
      summary,
      detail,
      life,
    });
  };

  return {
    success: (summary: string, detail: string, life?: number) => show('success', summary, detail, life),
    info: (summary: string, detail: string, life?: number) => show('info', summary, detail, life),
    warn: (summary: string, detail: string, life?: number) => show('warn', summary, detail, life),
    error: (summary: string, detail: string, life?: number) => show('error', summary, detail, life),
  };
};
