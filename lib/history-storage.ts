import { ScanRecord, AnalysisResult } from '@/types/analysis';

const STORAGE_KEY = 'objectlens_scan_history_v1';

export function getScanHistory(): ScanRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error reading scan history:', err);
    return [];
  }
}

export function saveScanToHistory(analysis: AnalysisResult): ScanRecord {
  const history = getScanHistory();
  const record: ScanRecord = {
    id: analysis.id || 'scan-' + Date.now(),
    timestamp: analysis.timestamp || new Date().toISOString(),
    thumbnail: analysis.imageUrl || '',
    analysis,
  };

  const updated = [record, ...history.filter(item => item.id !== record.id)].slice(0, 50); // keep up to 50 scans
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving scan to local storage:', err);
  }
  return record;
}

export function deleteScanFromHistory(id: string): ScanRecord[] {
  const history = getScanHistory();
  const updated = history.filter(item => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error deleting scan:', err);
  }
  return updated;
}

export function clearAllHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing history:', err);
  }
}
