import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, "d MMMM yyyy 'à' HH:mm", { locale: fr });
}

export function formatDateInput(date: string | Date | null | undefined): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, "yyyy-MM-dd'T'HH:mm");
}
