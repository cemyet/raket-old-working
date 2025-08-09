import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      current_amount: number | null;
      previous_amount: number | null;
      level: number;
      section: string;
      bold?: boolean;
      style?: string;
      block_group?: string;
    }>;
    br_data?: Array<{
      id: string;
      label: string;
      current_amount: number | null;
      previous_amount: number | null;
      level: number;
      section: string;
      type: 'asset' | 'liability' | 'equity';
      bold?: boolean;
      style?: string;
      block_group?: string;
    }>;
    ink2_data?: Array<{
      row_id: number;
      row_title: string;
      amount: number;
      variable_name: string;
      show_tag: boolean;
      accounts_included: string;
      account_details?: Array<{
        account_id: string;
        account_text: string;
        balance: number;
      }>;
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

// Database-driven always_show logic - no more hardcoded arrays

export function AnnualReportPreview({ companyData, currentStep }: AnnualReportPreviewProps) {
  const [showAllRR, setShowAllRR] = useState(false);
  const [showAllBR, setShowAllBR] = useState(false);
  
  // Get new database-driven parser data
  const seFileData = companyData.seFileData;
  const rrData = seFileData?.rr_data || [];
  const brData = seFileData?.br_data || [];
  const ink2Data = seFileData?.ink2_data || [];
  const companyInfo = seFileData?.company_info || {};
  
  // Debug logging

  

  
  // No fallback needed - database-driven parser provides all data

  // Helper function to get styling classes and style based on style
  const getStyleClasses = (style?: string) => {
    const baseClasses = 'grid gap-4';
    let additionalClasses = '';
    
    // Handle bold styling for header styles only
    if (style === 'H0' || style === 'H1' || style === 'H2' || style === 'H3' || style === 'S1' || style === 'S2' || style === 'S3') {
      additionalClasses += ' font-semibold';
    }
    
    // Handle specific styling for S2 and S3 (thin grey lines above and below)
    if (style === 'S2' || style === 'S3') {
      additionalClasses += ' border-t border-b border-gray-200 pt-1 pb-1';
    }
    
    return {
      className: `${baseClasses}${additionalClasses}`,
      style: { gridTemplateColumns: '4fr 0.5fr 1fr 1fr' }
    };
  };

  // Helper function to format amount (show 0 kr instead of -0 kr)
  const formatAmountDisplay = (amount: number | null): string => {
    if (amount === null || amount === undefined) {
      return '';
    }
    if (amount === 0 || amount === -0) {
      return '0 kr';
    }
    return `${formatAmount(amount)} kr`;
  };

  // Helper function to check if a block should be shown
  const shouldShowBlock = (data: any[], startIndex: number, endIndex: number, alwaysShowItems: string[], showAll: boolean): boolean => {
    if (showAll) return true;
    
    // Check if any item in the block has non-zero amounts or is in always show list
    for (let i = startIndex; i <= endIndex && i < data.length; i++) {
      const item = data[i];
      const hasNonZeroAmount = (item.current_amount !== null && item.current_amount !== 0 && item.current_amount !== -0) ||
                              (item.previous_amount !== null && item.previous_amount !== 0 && item.previous_amount !== -0);
      const isAlwaysShow = alwaysShowItems.includes(item.label);
      
      if (hasNonZeroAmount || isAlwaysShow) {
        return true;
      }
    }
    return false;
  };

  // Helper function to check if a block group has any content
  const blockGroupHasContent = (data: any[], blockGroup: string): boolean => {
    if (!blockGroup) return true; // Show items without block_group
    
    const blockItems = data.filter(item => item.block_group === blockGroup);
    
    for (const item of blockItems) {
      const isHeading = item.style && ['H0', 'H1', 'H2', 'H3', 'S1', 'S2', 'S3'].includes(item.style);
      if (isHeading) continue; // Skip headings when checking block content
      
      const hasNonZeroAmount = (item.current_amount !== null && item.current_amount !== 0 && item.current_amount !== -0) ||
                              (item.previous_amount !== null && item.previous_amount !== 0 && item.previous_amount !== -0);
      const isAlwaysShow = item.always_show === true; // Use database field
      
      if (hasNonZeroAmount || isAlwaysShow) {
        return true;
      }
    }
    return false;
  };

  // Helper function to check if a row should be shown
  const shouldShowRow = (item: any, showAll: boolean, data: any[]): boolean => {
    if (showAll) return true;
    
    // Check if this is a heading
    const isHeading = item.style && ['H0', 'H1', 'H2', 'H3'].includes(item.style);
    
    if (isHeading) {
      // For headings, check if their block group has content
      if (item.block_group) {
        return blockGroupHasContent(data, item.block_group);
      }
      // NEW: Even headings without block_group must follow always_show rule
      return item.always_show === true;
    }
    
    // NEW LOGIC: If amount is 0 for both years, hide unless always_show = true
    const hasNonZeroAmount = (item.current_amount !== null && item.current_amount !== 0 && item.current_amount !== -0) ||
                            (item.previous_amount !== null && item.previous_amount !== 0 && item.previous_amount !== -0);
    const isAlwaysShow = item.always_show === true; // Use database field
    
    // Show if: (has non-zero amount) OR (always_show = true)
    return hasNonZeroAmount || isAlwaysShow;
  };

  // Helper function to get note value for specific rows
  const getNoteValue = (label: string): string => {
    if (label === 'Personalkostnader') {
      return '2';
    }
    return '';
  };

  const getPreviewContent = () => {
    // Show empty state only if we have no data and are at step 0
    if (currentStep === 0 && !rrData.length && !brData.length) {
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

    // Show preview content if we have data, regardless of currentStep
    if (!rrData.length && !brData.length) {
      return (
        <div className="text-center py-20">
          <div className="text-muted-foreground mb-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-muted flex items-center justify-center">
              ⏳
            </div>
            <h3 className="text-lg font-medium mb-2">Laddar data...</h3>
            <p className="text-sm">Bearbetar SE-fil data</p>
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
          <h1 className="text-2xl font-bold text-foreground">Årsredovisning</h1>
          <h2 className="text-xl font-semibold text-foreground mt-2">{headerData.company_name}</h2>
          <p className="text-sm text-muted-foreground">
            Organisationsnummer: {headerData.organization_number || 'Ej tillgängligt'}
          </p>
          <p className="text-sm text-muted-foreground">
            Räkenskapsår: {headerData.fiscal_year}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {headerData.location}, {headerData.date}
          </p>
        </div>

        {/* Financial Results Section */}
        {(
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Resultaträkning</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Visa alla rader</span>
                <Switch
                  checked={showAllRR}
                  onCheckedChange={setShowAllRR}
                  className={`${showAllRR ? 'bg-green-500' : 'bg-gray-300'}`}
                />
              </div>
            </div>
            
            {/* Column Headers */}
            <div className="grid gap-4 text-sm text-muted-foreground border-b pb-1 font-semibold" style={{gridTemplateColumns: '4fr 0.5fr 1fr 1fr'}}>
              <span></span>
              <span className="text-right">Not</span>
              <span className="text-right">{headerData.fiscal_year}</span>
              <span className="text-right">{headerData.fiscal_year - 1}</span>
            </div>

            {/* Income Statement Rows */}
            {rrData.length > 0 ? (
              rrData.map((item, index) => {
                if (!shouldShowRow(item, showAllRR, rrData)) {
                  return null;
                }
                
                return (
                  <div 
                    key={index} 
                    className={`${getStyleClasses(item.style).className} ${
                      item.level === 0 ? 'border-b pb-1' : ''
                    }`}
                    style={getStyleClasses(item.style).style}
                  >
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="text-right font-medium">
                      {getNoteValue(item.label)}
                    </span>
                    <span className="text-right font-medium">
                      {formatAmountDisplay(item.current_amount)}
                    </span>
                    <span className="text-right font-medium">
                      {formatAmountDisplay(item.previous_amount)}
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
        {(
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Balansräkning</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Visa alla rader</span>
                <Switch
                  checked={showAllBR}
                  onCheckedChange={setShowAllBR}
                  className={`${showAllBR ? 'bg-green-500' : 'bg-gray-300'}`}
                />
              </div>
            </div>
            
            {/* Column Headers */}
            <div className="grid gap-4 text-sm text-muted-foreground border-b pb-1 font-semibold" style={{gridTemplateColumns: '4fr 0.5fr 1fr 1fr'}}>
              <span></span>
              <span className="text-right">Not</span>
              <span className="text-right">{headerData.fiscal_year}</span>
              <span className="text-right">{headerData.fiscal_year - 1}</span>
            </div>

            {/* Balance Sheet Rows */}
            {brData.length > 0 ? (
              brData.map((item, index) => {
                if (!shouldShowRow(item, showAllBR, brData)) {
                  return null;
                }
                
                return (
                  <div 
                    key={index} 
                    className={`${getStyleClasses(item.style).className} ${
                      item.level === 0 ? 'border-b pb-1' : ''
                    }`}
                    style={getStyleClasses(item.style).style}
                  >
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="text-right font-medium">
                      {getNoteValue(item.label)}
                    </span>
                    <span className="text-right font-medium">
                      {formatAmountDisplay(item.current_amount)}
                    </span>
                    <span className="text-right font-medium">
                      {formatAmountDisplay(item.previous_amount)}
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

        {/* Tax Calculation Section */}
        {currentStep >= 1 && seFileData?.ink2_data && seFileData.ink2_data.length > 0 && (
          <div className="space-y-4 bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">🏛️ Skatteberäkning</h2>
              <span className="text-sm text-muted-foreground">{seFileData.ink2_data.length} poster</span>
            </div>
            
            {/* Column Headers */}
            <div className="grid gap-4 text-sm text-muted-foreground border-b pb-1 font-semibold" style={{gridTemplateColumns: '3fr 1fr'}}>
              <span>Post</span>
              <span className="text-right">Belopp</span>
            </div>

            {/* Tax Calculation Rows */}
            {seFileData.ink2_data.map((item, index) => (
              <div 
                key={index} 
                className="grid gap-4 text-sm py-1 border-b border-yellow-100 last:border-b-0"
                style={{gridTemplateColumns: '3fr 1fr'}}
              >
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{item.row_title}</span>
                  {item.show_tag && item.account_details && item.account_details.length > 0 && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Badge variant="secondary" className="ml-2 cursor-pointer hover:bg-gray-200">
                          SHOW
                        </Badge>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Detaljer för {item.row_title}</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left py-2">Konto</th>
                                  <th className="text-left py-2">Kontotext</th>
                                  <th className="text-right py-2">{seFileData?.company_info?.fiscal_year || 'Belopp'}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {item.account_details.map((detail, detailIndex) => (
                                  <tr key={detailIndex} className="border-b">
                                    <td className="py-2">{detail.account_id}</td>
                                    <td className="py-2">{detail.account_text}</td>
                                    <td className="text-right py-2">
                                      {new Intl.NumberFormat('sv-SE', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                      }).format(detail.balance)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                <span className="text-right font-medium">
                  {item.amount ? new Intl.NumberFormat('sv-SE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }).format(item.amount) : '0,00'}
                </span>
              </div>
            ))}
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
