export interface ScoredKeyword {
  keyword: string;
  volume: number;
  competition: string;
  bid: number;
  volumeScore: number;
  competitionScore: number;
  priceScore: number;
  totalScore: number;
  clientName: string;
}

export const calculateVolumeScore = (volume: number): number => {
  if (volume < 50) return 0;
  if (volume < 500) return 25;
  if (volume < 2000) return 40;
  if (volume < 5000) return 30;
  return 15;
};

export const calculateCompetitionScore = (competition: string): number => {
  const comp = competition?.toLowerCase().trim();
  if (comp === 'low') return 40;
  if (comp === 'medium') return 20;
  if (comp === 'high') return 10;
  return 0;
};

export const calculatePriceScore = (bid: number): number => {
  if (bid < 1) return 0;
  if (bid <= 2) return 20;
  if (bid <= 4) return 20;
  if (bid <= 5) return 15;
  if (bid <= 8) return 5;
  return 0;
};

export const parseCSV = (csv: string, clientName: string): ScoredKeyword[] => {
  const lines = csv.trim().split('\n');
  
  let headerLineIdx = -1;
  let headers: string[] = [];
  
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    if (lines[i].includes('Keyword') && lines[i].includes('Competition')) {
      headerLineIdx = i;
      headers = lines[i].split('\t').map(h => h.trim());
      break;
    }
  }
  
  if (headerLineIdx === -1) {
    throw new Error('Could not find header row');
  }
  
  const keywordIdx = headers.findIndex(h => h === 'Keyword');
  const volumeIdx = headers.findIndex(h => h === 'Avg. monthly searches');
  const competitionIdx = headers.findIndex(h => h === 'Competition' && !h.includes('indexed'));
  const bidIdx = headers.findIndex(h => h === 'Top of page bid (high range)');
  
  if (keywordIdx === -1 || volumeIdx === -1 || competitionIdx === -1 || bidIdx === -1) {
    throw new Error('Missing required columns');
  }
  
  const results: ScoredKeyword[] = [];
  
  for (let i = headerLineIdx + 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const cols = lines[i].split('\t').map(c => c.trim());
    const keyword = cols[keywordIdx];
    const volume = parseInt(cols[volumeIdx]?.replace(/,/g, '') || '0') || 0;
    const competition = cols[competitionIdx];
    const bidStr = cols[bidIdx] || '0';
    
    if (!keyword) continue;
    
    const bid = parseFloat(bidStr.replace(/[$,]/g, '')) || 0;
    
    const volumeScore = calculateVolumeScore(volume);
    const competitionScore = calculateCompetitionScore(competition);
    const priceScore = calculatePriceScore(bid);
    const totalScore = Math.round(volumeScore + competitionScore + priceScore);
    
    results.push({
      keyword,
      volume,
      competition,
      bid,
      volumeScore,
      competitionScore,
      priceScore,
      totalScore,
      clientName,
    });
  }
  
  return results.sort((a, b) => b.totalScore - a.totalScore);
};
