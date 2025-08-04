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
    rr_data?: Array<{
      id: string;
      label: string;
      amount: number | null;
      level: number;
      bold: boolean;
    }>;
    br_data?: Array<{
      id: string;
      label: string;
      amount: number | null;
      level: number;
      bold: boolean;
    }>;
         company_info?: {
       organization_number?: string;
       fiscal_year?: number;
       company_name?: string;
       location?: string;
       date?: string;
     };
     significant_events?: string[];
     depreciation_policy?: string;
     employees?: {
       count: number;
       description: string;
     };
     board_members?: Array<{
       name: string;
       role: string;
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
  // Get new database-driven parser data
  const seFileData = companyData.seFileData;
  const rrData = seFileData?.rr_data || [];
  const brData = seFileData?.br_data || [];
  const companyInfo = seFileData?.company_info || {};
  
  // Fallback to calculated metrics for legacy data
  const seMetrics = !rrData.length && seFileData ? extractKeyMetrics(seFileData) : null;
  const rrResults = !rrData.length && seFileData ? calculateRRSums(seFileData) : [];

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
    const headerData = companyInfo || {
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
            {rrData.length > 0 ? (
              rrData.map((item, index) => {
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
              })
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
            {brData.length > 0 ? (
              brData.map((item, index) => {
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
              {seFileData?.significant_events ? (
                seFileData.significant_events.map((event, index) => (
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
              {seFileData?.depreciation_policy || 
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
              {seFileData?.employees?.description || 
               `Antal anställda under räkenskapsåret: ${seFileData?.employees?.count || companyData.employees}`
              }
            </p>
          </div>
        )}

        {/* Board Members */}
        {currentStep >= 5 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground border-b pb-2">Styrelse</h2>
            <div className="space-y-2">
              {seFileData?.board_members ? (
                seFileData.board_members.map((member, index) => (
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
