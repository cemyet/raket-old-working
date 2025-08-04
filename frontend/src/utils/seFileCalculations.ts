// SE File calculation utilities based on the Python logic
// Implements the same logic for calculating RR (Income Statement) and BR (Balance Sheet)

export interface SEData {
  accountBalances?: Record<string, number>;
  sruMapping?: Record<string, string>;
  incomeStatement?: Array<{account: string, amount: number, description?: string}>;
  balanceSheet?: Array<{account: string, amount: number, description?: string, type?: string}>;
}

export interface CalculationRow {
  ID: string;
  Rubrik: string;
  SRU?: string;
  Style?: string;
  Calculation?: string;
  'Interval start'?: number;
  'Interval end'?: number;
  'Incl. acc'?: string;
  'Excl.int.start'?: number;
  'Excl.int.end'?: number;
  'Excl. acc.'?: string;
}

// Income Statement (RR) structure based on the Python code
export const RR_STRUCTURE: CalculationRow[] = [
  // Rörelseintäkter
  { ID: "RR1", Rubrik: "Rörelseintäkter", SRU: "H2", Style: "H2", Calculation: "" },
  { ID: "3.1", Rubrik: "Nettoomsättning", SRU: "7410", Style: "Normal", "Interval start": 3000, "Interval end": 3799 },
  { ID: "3.2", Rubrik: "Förändring av lager", SRU: "7411", Style: "Normal", "Interval start": 4900, "Interval end": 4999, "Incl. acc": "4960", "Excl.int.start": 4989, "Excl.int.end": 4989, "Excl. acc.": "4910-4929" },
  { ID: "3.3", Rubrik: "Aktiverat arbete för egen räkning", SRU: "7510", Style: "Normal", "Interval start": 3800, "Interval end": 3899 },
  { ID: "3.4", Rubrik: "Övriga rörelseintäkter", SRU: "7412", Style: "Normal", "Interval start": 3900, "Interval end": 3999 },
  { ID: "RI", Rubrik: "Summa rörelseintäkter, lagerförändringar mm", SRU: "7413", Style: "H3", Calculation: "3.1+3.2+3.3+3.4" },
  
  // Rörelsekostnader
  { ID: "RR2", Rubrik: "Rörelsekostnader", SRU: "H2", Style: "H2", Calculation: "" },
  { ID: "3.5", Rubrik: "Råvaror och förnödenheter", SRU: "7511", Style: "Normal", "Interval start": 4000, "Interval end": 4799, "Incl. acc": "4910-4929" },
  { ID: "3.6", Rubrik: "Handelsvaror", SRU: "7512", Style: "Normal", "Interval start": 4960, "Interval end": 4989 },
  { ID: "3.7", Rubrik: "Övriga externa kostnader", SRU: "7513", Style: "Normal", "Interval start": 5000, "Interval end": 6999 },
  { ID: "3.8", Rubrik: "Personalkostnader", SRU: "7514", Style: "Normal", "Interval start": 7000, "Interval end": 7699 },
  { ID: "3.9", Rubrik: "Avskrivningar materiella & immateriella anl. tillgångar", SRU: "7515", Style: "Normal", "Interval start": 7700, "Interval end": 7899, "Incl. acc": "7740", "Excl.int.start": 7749, "Excl.int.end": 7749, "Excl. acc.": "7790-7799" },
  { ID: "3.10", Rubrik: "Nedskrivningar av omsättningstillgångar", SRU: "7516", Style: "Normal", "Interval start": 7740, "Interval end": 7749, "Incl. acc": "7790-7799" },
  { ID: "3.11", Rubrik: "Övriga rörelsekostnader", SRU: "7517", Style: "Normal", "Interval start": 7900, "Interval end": 7999 },
  { ID: "RK", Rubrik: "Summa rörelsekostnader", SRU: "H3", Style: "H3", Calculation: "3.5+3.6+3.7+3.8+3.9+3.10+3.11" },
  
  { ID: "RR", Rubrik: "Rörelseresultat", SRU: "H3", Style: "H3", Calculation: "RI+RK" },
  
  // Finansiella poster
  { ID: "RR3", Rubrik: "Finansiella poster", SRU: "H2", Style: "H2", Calculation: "" },
  { ID: "3.16", Rubrik: "Övriga ränteintäkter och liknande resultatposter", SRU: "7417", Style: "Normal", "Interval start": 8300, "Interval end": 8399, "Incl. acc": "8370", "Excl.int.start": 8389, "Excl.int.end": 8389 },
  { ID: "3.18", Rubrik: "Räntekostnader och liknande resultatposter", SRU: "7522", Style: "Normal", "Interval start": 8400, "Interval end": 8499 },
  { ID: "FP", Rubrik: "Summa finansiella poster", SRU: "H3", Style: "H3", Calculation: "3.16+3.18" },
  
  { ID: "RFP", Rubrik: "Resultat efter finansiella poster", SRU: "H3", Style: "H3", Calculation: "RR+FP" },
  
  // Bokslutsdispositioner
  { ID: "RR4", Rubrik: "Bokslutsdispositioner", SRU: "H2", Style: "H2", Calculation: "" },
  { ID: "3.19", Rubrik: "Erhållna koncernbidrag", SRU: "7419", Style: "Normal", "Interval start": 8820, "Interval end": 8829 },
  { ID: "3.20", Rubrik: "Lämnade koncernbidrag", SRU: "7524", Style: "Normal", "Interval start": 8830, "Interval end": 8839 },
  { ID: "3.21", Rubrik: "Förändring av periodiseringsfonder", SRU: "7420/7525", Style: "Normal", "Interval start": 8810, "Interval end": 8811, "Incl. acc": "8819" },
  { ID: "3.22", Rubrik: "Förändring av överavskrivningar", SRU: "7421/7526", Style: "Normal", "Interval start": 8850, "Interval end": 8859 },
  { ID: "3.23", Rubrik: "Övriga bokslutsdispositioner", SRU: "7422/7527", Style: "Normal", "Interval start": 8840, "Interval end": 8899, "Incl. acc": "8850", "Excl.int.start": 8859, "Excl.int.end": 8859 },
  { ID: "BD", Rubrik: "Summa bokslutsdispositioner", SRU: "H3", Style: "H3", Calculation: "3.19+3.20+3.21+3.22+3.23" },

  { ID: "RFS", Rubrik: "Resultat före skatt", SRU: "H3", Style: "H3", Calculation: "RFP+BD" },
  
  // Skatter
  { ID: "RR5", Rubrik: "Skatter", SRU: "H2", Style: "H2", Calculation: "" },
  { ID: "3.24", Rubrik: "Skatt på årets resultat", SRU: "7528", Style: "Normal", "Interval start": 8900, "Interval end": 8989, "Excl. acc.": "8980" },

  { ID: "ÅR", Rubrik: "Årets resultat", SRU: "H3", Style: "H3", Calculation: "RFS+3.24" }
];

// Parse account ranges from a calculation row
function parseAccountRanges(row: CalculationRow): Set<number> {
  const included = new Set<number>();
  
  // Add interval range
  if (row['Interval start'] && row['Interval end']) {
    const start = row['Interval start'];
    const end = row['Interval end'];
    for (let i = start; i <= end; i++) {
      included.add(i);
    }
  }
  
  // Add individual included accounts
  if (row['Incl. acc']) {
    const inclAccounts = row['Incl. acc'].split(',');
    for (const acc of inclAccounts) {
      const trimmed = acc.trim();
      if (trimmed.includes('-')) {
        const [rangeStart, rangeEnd] = trimmed.split('-').map(x => parseInt(x.trim()));
        if (!isNaN(rangeStart) && !isNaN(rangeEnd)) {
          for (let i = rangeStart; i <= rangeEnd; i++) {
            included.add(i);
          }
        }
      } else {
        const accountNum = parseInt(trimmed);
        if (!isNaN(accountNum)) {
          included.add(accountNum);
        }
      }
    }
  }
  
  // Remove excluded ranges
  if (row['Excl.int.start'] && row['Excl.int.end']) {
    const start = row['Excl.int.start'];
    const end = row['Excl.int.end'];
    for (let i = start; i <= end; i++) {
      included.delete(i);
    }
  }
  
  // Remove individual excluded accounts
  if (row['Excl. acc.']) {
    const exclAccounts = row['Excl. acc.'].split(',');
    for (const acc of exclAccounts) {
      const trimmed = acc.trim();
      if (trimmed.includes('-')) {
        const [rangeStart, rangeEnd] = trimmed.split('-').map(x => parseInt(x.trim()));
        if (!isNaN(rangeStart) && !isNaN(rangeEnd)) {
          for (let i = rangeStart; i <= rangeEnd; i++) {
            included.delete(i);
          }
        }
      } else {
        const accountNum = parseInt(trimmed);
        if (!isNaN(accountNum)) {
          included.delete(accountNum);
        }
      }
    }
  }
  
  return included;
}

// Calculate sums for income statement based on Python logic
export function calculateRRSums(seData: SEData): Array<{ID: string, Rubrik: string, summa: number}> {
  const results: Array<{ID: string, Rubrik: string, summa: number}> = [];
  const accountBalances = seData.accountBalances || {};
  const sruMapping = seData.sruMapping || {};

  for (const row of RR_STRUCTURE) {
    const { ID: rowId, Rubrik: rubrik, Calculation: calculation, SRU: sruCode } = row;
    let total = 0;

    if (calculation && calculation !== '') {
      const parts = calculation.split(/([+-])/).filter(p => p.trim() !== '');
      let op = '+';
      for (const part of parts) {
        const trimmed = part.trim();
        if (trimmed === '+' || trimmed === '-') {
          op = trimmed;
          continue;
        }
        const found = results.find(r => r.ID === trimmed);
        if (found) {
          total += op === '+' ? found.summa : -found.summa;
        }
      }
    } else {
      const includedAccounts = parseAccountRanges(row);
      for (const [accountId, balance] of Object.entries(accountBalances)) {
        if (balance !== 0) {
          const accountIdInt = parseInt(accountId);
          if (isNaN(accountIdInt)) continue;
          if (sruMapping[accountIdInt]) {
            const accountSru = sruMapping[accountIdInt];
            if (sruCode?.includes('/')) {
              const [sruPos, sruNeg] = sruCode.split('/').map(s => s.trim());
              if (accountSru === sruPos || accountSru === sruNeg) {
                total += balance;
              }
            } else if (accountSru === sruCode) {
              total += balance;
            }
          } else if (includedAccounts.has(accountIdInt)) {
            total += balance;
          }
        }
      }
    }

    results.push({ ID: rowId, Rubrik: rubrik, summa: total });
  }

  // Sätt "Övriga skatter" (3.25) till 0 för att inte påverka ÅR
  results.forEach(r => {
    if (r.ID === '3.25') {
      r.summa = 0;
    }
  });

  return results;
}

// Format amount for display (reverse sign for income statement as per Python code)
export function formatAmount(amount: number, rowId?: string): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0';
  }
  
  if (amount === 0) {
    // Return empty string for RR headers (RR1, RR2, RR3, RR4, RR5)
    if (rowId && rowId.startsWith('RR') && rowId.length > 2) {
      return '';
    }
    return '0';
  }
  
  // Display amount as-is (sign correction is now handled in the backend)
  return new Intl.NumberFormat('sv-SE', { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0 
  }).format(amount).replace(/,/g, ' ');
}

// Extract key financial metrics from SE data
export function extractKeyMetrics(seData: SEData) {
  const results = calculateRRSums(seData);
  
  const nettoomsattning = results.find(r => r.ID === '3.1')?.summa || 0;
  const rorelseresultat = results.find(r => r.ID === 'RR')?.summa || 0;
  const resultatEfterFinansiellaPoster = results.find(r => r.ID === 'RFP')?.summa || 0;
  const aretsResultat = results.find(r => r.ID === 'ÅR')?.summa || 0;
  
  return {
    nettoomsattning: Math.abs(nettoomsattning),
    rorelseresultat: Math.abs(rorelseresultat),
    resultatEfterFinansiellaPoster: Math.abs(resultatEfterFinansiellaPoster),
    aretsResultat: Math.abs(aretsResultat),
    results // Full results array for detailed display
  };
}