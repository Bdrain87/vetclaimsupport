import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useKeyboardShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === 'k') {
        e.preventDefault();
        navigate('/claims');
      }
      if (mod && e.key === '1') {
        e.preventDefault();
        navigate('/app');
      }
      if (mod && e.key === '2') {
        e.preventDefault();
        navigate('/health');
      }
      if (mod && e.key === '3') {
        e.preventDefault();
        navigate('/claims');
      }
      if (mod && e.key === '4') {
        e.preventDefault();
        navigate('/prep');
      }
      if (e.key === '?' && !mod) {
        e.preventDefault();
        navigate('/settings/help');
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);
}
