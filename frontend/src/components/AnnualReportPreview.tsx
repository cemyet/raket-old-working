import React from 'react';
import { Card } from "@/components/ui/card";
import { calculateRRSums, extractKeyMetrics, formatAmount, type SEData } from '@/utils/seFileCalculations';

interface CompanyData {
  results?: string;
  result?: number | null;
  dividend: string;
  customDividend?: number;
  significantEvents: string;
  hasEvents: boolean;
  depreciation: string;
  employees: number;
  location: string;
  date: string;
  boardMembers: Array<{ name: string; personalNumber: string }>;
  seFileData?: SEData & {
    annualReport?: {
      header: {
        organization_number: string;
        fiscal_year: number;
        company_name: string;
        location: string;
        date: string;
      };
      financial_results: {
        revenue: number;
        operating_profit: number;
        net_result: number;
        total_assets: number;
        income_statement: any[];
        balance_sheet: any[];
      };
      significant_events: string[];
      depreciation_policy: string;
      employees: {
        count: number;
        description: string;
      };
      board_members: Array<{
        name: string;
        role: string;
      }>;
    };
    // Previous year data from parse-se-python
    income_statement_year_minus1?: Array<{
      id: string;
      label: string;
      amount: number | null;
      level: number;
      section: string;
      bold: boolean;
      sru: string;
    }>;
    balance_sheet_year_minus1?: Array<{
      id: string;
      label: string;
      amount: number;
      level: number;
      section: string;
      type: string;
      bold: boolean;
    }>;
  };
  organizationNumber?: string;
  fiscalYear?: number;
  // Previous year data from parse-se-python (camelCase keys)
  incomeStatementYearMinus1?: Array<{
    id: string;
    label: string;
    amount: number | null;
    level: number;
    section: string;
    bold: boolean;
    sru: string;
  }>;
  balanceSheetYearMinus1?: Array<{
    id: string;
    label: string;
    amount: number;
    level: number;
    section: string;
    type: string;
    bold: boolean;
  }>;
}

interface AnnualReportPreviewProps {
  companyData: CompanyData;
  currentStep: number;
}

export function AnnualReportPreview({ companyData, currentStep }: AnnualReportPreviewProps) {
  // Get structured annual report data if available - FORCE REDEPLOY
  const annualReportData = companyData.seFileData?.annualReport;
  
  // Fallback to calculated metrics for legacy data
  const seMetrics = !annualReportData && companyData.seFileData ? extractKeyMetrics(companyData.seFileData) : null;
  const rrResults = !annualReportData && companyData.seFileData ? calculateRRSums(companyData.seFileData) : [];

  const getPreviewContent = () => {
    if (currentStep === 0) {
      return (
        <div className="text-center py-20">
          <div className="text-muted-foreground mb-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-muted flex items-center justify-center">
              📄
            </div>
            <h3 className="text-lg font-medium mb-2">Årsredovisning</h3>
            <p className="text-sm">Din rapport kommer att visas här när du börjar processen</p>
          </div>
        </div>
      );
    }

    // Use structured data from Python if available
    const headerData = annualReportData?.header || {
      organization_number: companyData.organizationNumber || 'XXX XXX-XXXX',
      fiscal_year: companyData.fiscalYear || new Date().getFullYear(),
      company_name: 'Företag AB',
      location: companyData.location || 'Stockholm',
      date: companyData.date || new Date().toLocaleDateString('sv-SE')
    };

    return (
      <div className="space-y-6">
        {/* Company Header */}
        <div className="border-b pb-4">
                          <h1 className="text-2xl font-bold text-foreground">🚀 ÅRSREDOVISNING 2.3 🚀</h1>
          <h2 className="text-xl font-semibold text-foreground mt-2">{headerData.company_name}</h2>
          <p className="text-sm text-muted-foreground">
            Org.nr: {headerData.organization_number}
          </p>
          <p className="text-sm text-muted-foreground">
            Räkenskapsår: {headerData.fiscal_year}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {headerData.location}, {headerData.date}
          </p>
        </div>

        {/* Financial Results Section */}
        {currentStep >= 0.5 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground border-b pb-2">Resultaträkning</h2>
            
            {/* Data Source Info */}
            <div className="space-y-3">
              <div className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Python Strukturerad</span>
                <span>Komplett resultaträkning från SE-fil</span>
              </div>
              
              {/* Previous Year Column Header */}
              <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground border-b pb-1">
                <span>Beskrivning</span>
                <span className="text-right">{headerData.fiscal_year}</span>
                <span className="text-right">
                  {headerData.fiscal_year - 1}
                  {companyData.incomeStatementYearMinus1 && companyData.incomeStatementYearMinus1.length > 0 ? (
                    <span className="text-xs text-muted-foreground">({companyData.incomeStatementYearMinus1.length} rader)</span>
                  ) : (
                    <span className="text-xs text-red-500">(Ingen data)</span>
                  )}
                </span>
              </div>
            </div>

            {/* Income Statement Rows */}
            {annualReportData?.financial_results?.income_statement ? (
              (() => {
                // Add test row to verify we're running the right code
                                  const testArray = [
                    { id: 'TEST', label: '🧪 TEST RAD - VERSION 2.3 🧪', amount: 999999, level: 0, bold: true },
                  ...annualReportData.financial_results.income_statement
                ];
                
                // Debug: Log first few items to see exact field names
                console.log('DEBUG: First few items in income_statement to check field names:', testArray.slice(0, 3));
                
                // Debug: Check if 3.25 exists in the data
                const item325 = testArray.find(item => item.id === '3.25');
                if (item325) {
                  console.log('DEBUG: Found 3.25 in data:', item325);
                  console.log('DEBUG: 3.25 amount:', item325.amount, 'label:', item325.label);
                } else {
                  console.log('DEBUG: No 3.25 found in data');
                }
                
                // Debug: Check 3.24 (Skatt på årets resultat)
                const item324 = testArray.find(item => item.id === '3.24');
                if (item324) {
                  console.log('DEBUG: Found 3.24 in data:', item324);
                  console.log('DEBUG: 3.24 amount:', item324.amount, 'label:', item324.label);
                } else {
                  console.log('DEBUG: No 3.24 found in data');
                }
                
                // Debug: Check ÅR (Årets resultat)
                const itemAR = testArray.find(item => item.id === 'ÅR');
                if (itemAR) {
                  console.log('DEBUG: Found ÅR in data:', itemAR);
                  console.log('DEBUG: ÅR amount:', itemAR.amount, 'label:', itemAR.label);
                } else {
                  console.log('DEBUG: No ÅR found in data');
                }
                
                // Fix: Set 3.25 (Övriga skatter) to 0 to prevent it from affecting ÅR calculation
                const fixedArray = testArray.map(item => {
                  if (item.id === '3.25') {
                    console.log('DEBUG: Fixing 3.25 from', item.amount, 'to 0');
                    return { ...item, amount: 0 };
                  }
                  return item;
                });
                
                // Debug: Check if 3.25 was fixed
                const fixed325 = fixedArray.find(item => item.id === '3.25');
                if (fixed325) {
                  console.log('DEBUG: 3.25 after fix:', fixed325.amount);
                }
                
                console.log('DEBUG: income_statement with test row and 3.25 fixed', fixedArray);
                
                // Debug: Check if previous year data exists
                console.log('DEBUG: Previous year data available:', {
                  incomeStatementYearMinus1: companyData.incomeStatementYearMinus1?.length || 0,
                  balanceSheetYearMinus1: companyData.balanceSheetYearMinus1?.length || 0,
                  sampleIncomeMinus1: companyData.incomeStatementYearMinus1?.slice(0, 3),
                  sampleBalanceMinus1: companyData.balanceSheetYearMinus1?.slice(0, 3)
                });
                
                // Debug: Check raw seFileData from backend
                console.log('DEBUG: Raw seFileData from backend:', {
                  seFileData: companyData.seFileData,
                  income_statement_year_minus1: companyData.seFileData?.income_statement_year_minus1?.length || 0,
                  balance_sheet_year_minus1: companyData.seFileData?.balance_sheet_year_minus1?.length || 0,
                  sampleBackendIncome: companyData.seFileData?.income_statement_year_minus1?.slice(0, 3),
                  sampleBackendBalance: companyData.seFileData?.balance_sheet_year_minus1?.slice(0, 3)
                });
                
                // Debug: Show all previous year data values
                console.log('DEBUG: All previous year income statement data:', companyData.seFileData?.income_statement_year_minus1);
                console.log('DEBUG: All previous year balance sheet data:', companyData.seFileData?.balance_sheet_year_minus1);
                
                // Debug: Show specific values for key accounts in previous year
                if (companyData.seFileData?.income_statement_year_minus1) {
                  const prevYearIncome = companyData.seFileData.income_statement_year_minus1;
                  console.log('DEBUG: Previous year key income values:', {
                    '3.1': prevYearIncome.find(item => item.id === '3.1')?.amount,
                    'RR': prevYearIncome.find(item => item.id === 'RR')?.amount,
                    'ÅR': prevYearIncome.find(item => item.id === 'ÅR')?.amount,
                    '3.24': prevYearIncome.find(item => item.id === '3.24')?.amount,
                    '3.25': prevYearIncome.find(item => item.id === '3.25')?.amount
                  });
                }
                
                if (companyData.seFileData?.balance_sheet_year_minus1) {
                  const prevYearBalance = companyData.seFileData.balance_sheet_year_minus1;
                  console.log('DEBUG: Previous year key balance values:', {
                    'T': prevYearBalance.find(item => item.id === 'T')?.amount,
                    'S': prevYearBalance.find(item => item.id === 'S')?.amount,
                    'EK': prevYearBalance.find(item => item.id === 'EK')?.amount,
                    'EKS': prevYearBalance.find(item => item.id === 'EKS')?.amount
                  });
                }
                
                return fixedArray.map((item, index) => {
                  // Find corresponding year -1 data
                  const itemYearMinus1 = companyData.incomeStatementYearMinus1?.find(y1 => y1.id === item.id);
                  return (
                    <div 
                      key={index} 
                      className={`grid grid-cols-3 gap-4 ${
                        item.bold ? 'font-semibold border-t pt-1' : ''
                      } ${
                        item.level === 0 ? 'border-b pb-1' : item.level === 1 ? 'ml-4' : ''
                      }`}
                    >
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="text-right font-medium">
                        {item.amount !== null ? `${formatAmount(item.amount)} kr` : ''}
                      </span>
                      <span className="text-right font-medium">
                        {itemYearMinus1 && itemYearMinus1.amount !== null ? `${formatAmount(itemYearMinus1.amount)} kr` : ''}
                      </span>
                    </div>
                  );
                });
              })()
            ) : (
              <div className="text-sm text-muted-foreground">
                <span className="text-xs text-muted-foreground">SE-fil</span>
                <span>Data från uppladdad SE-fil</span>
              </div>
            )}
          </div>
        )}

        {/* Balance Sheet Section */}
        {currentStep >= 0.5 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground border-b pb-2">Balansräkning</h2>
            
            {/* Previous Year Column Header */}
            <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground border-b pb-1">
              <span>Beskrivning</span>
              <span className="text-right">{headerData.fiscal_year}</span>
              <span className="text-right">{headerData.fiscal_year - 1}</span>
            </div>

            {/* Balance Sheet Rows */}
            {annualReportData?.financial_results?.balance_sheet ? (
              annualReportData.financial_results.balance_sheet.map((item, index) => {
                // Find corresponding year -1 data
                const itemYearMinus1 = companyData.balanceSheetYearMinus1?.find(y1 => y1.id === item.id);
                
                return (
                  <div 
                    key={index} 
                    className={`grid grid-cols-3 gap-4 ${
                      item.bold ? 'font-semibold border-t pt-1' : ''
                    } ${
                      item.level === 0 ? 'border-b pb-1' : item.level === 1 ? 'ml-4' : ''
                    }`}
                  >
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="text-right font-medium">
                      {item.amount !== null ? `${formatAmount(item.amount)} kr` : ''}
                    </span>
                    <span className="text-right font-medium">
                      {itemYearMinus1 && itemYearMinus1.amount !== null ? `${formatAmount(itemYearMinus1.amount)} kr` : ''}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-muted-foreground">
                <span className="text-xs text-muted-foreground">SE-fil</span>
                <span>Data från uppladdad SE-fil</span>
              </div>
            )}
          </div>
        )}

        {/* Significant Events Section */}
        {currentStep >= 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground border-b pb-2">Väsentliga händelser</h2>
            <div className="text-sm text-muted-foreground space-y-2">
              {annualReportData?.significant_events ? (
                annualReportData.significant_events.map((event, index) => (
                  <p key={index}>• {event}</p>
                ))
              ) : (
                <p>{companyData.significantEvents || "Inga väsentliga händelser att rapportera."}</p>
              )}
            </div>
          </div>
        )}

        {/* Depreciation Policy */}
        {currentStep >= 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground border-b pb-2">Avskrivningsprinciper</h2>
            <p className="text-sm text-muted-foreground">
              {annualReportData?.depreciation_policy || 
               (companyData.depreciation === "samma" 
                 ? "Samma avskrivningstider som föregående år tillämpas."
                 : "Förändrade avskrivningstider tillämpas detta år."
               )
              }
            </p>
          </div>
        )}

        {/* Employee Information */}
        {currentStep >= 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground border-b pb-2">Personal</h2>
            <p className="text-sm text-muted-foreground">
              {annualReportData?.employees?.description || 
               `Antal anställda under räkenskapsåret: ${annualReportData?.employees?.count || companyData.employees}`
              }
            </p>
          </div>
        )}

        {/* Board Members */}
        {currentStep >= 5 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground border-b pb-2">Styrelse</h2>
            <div className="space-y-2">
              {annualReportData?.board_members ? (
                annualReportData.board_members.map((member, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium">{member.name}</span>
                    <span className="text-muted-foreground ml-2">({member.role})</span>
                  </div>
                ))
              ) : (
                companyData.boardMembers.map((member, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium">{member.name}</span>
                    <span className="text-muted-foreground ml-2">({member.personalNumber})</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 p-6 bg-card border-border">
        <div className="overflow-y-auto max-h-full">
          {getPreviewContent()}
          {/* Extra padding to ensure last row is visible */}
          <div className="h-20"></div>
        </div>
      </Card>
    </div>
  );
}
