import { useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ProgressIndicator } from "./ProgressIndicator";
import { OptionButton } from "./OptionButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { AnnualReportPreview } from "./AnnualReportPreview";
import { FileUpload } from "./FileUpload";
import { useToast } from "@/hooks/use-toast";
import { Plus, Upload, TestTube } from "lucide-react";
import { apiService } from "@/services/api";

interface CompanyData {
  result: number | null;
  results?: string; // For extracted results from SE file
  dividend: string;
  customDividend?: number;
  significantEvents: string;
  hasEvents: boolean;
  depreciation: string;
  employees: number;
  location: string;
  date: string;
  boardMembers: Array<{ name: string; personalNumber: string }>;
  seFileData?: any; // Store processed SE file data
  organizationNumber?: string; // From SE file
  fiscalYear?: number; // From SE file
}

const TOTAL_STEPS = 5;

export function AnnualReportChat() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(-1); // Start at -1 for SE file upload
  const [showInput, setShowInput] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Debug logging
  console.log('AnnualReportChat render - currentStep:', currentStep, 'showFileUpload:', showFileUpload);
  console.log('🔍 AnnualReportPreview will render:', currentStep >= 0);
  const [messages, setMessages] = useState([
    {
      text: "Hej! 👋 Välkommen till RaketRapport! Jag hjälper dig att skapa din årsredovisning på bara 5 minuter.",
      isBot: true,
      emoji: "🚀"
    },
    {
      text: "Ladda upp din .SE fil från bokföringsprogrammet för att automatiskt skapa din årsredovisning:",
      isBot: true,
      emoji: "📁"
    }
  ]);

  const [companyData, setCompanyData] = useState<CompanyData>({
    result: null,
    dividend: "",
    significantEvents: "",
    hasEvents: false,
    depreciation: "samma",
    employees: 2,
    location: "Stockholm",
    date: new Date().toLocaleDateString("sv-SE"),
    boardMembers: [
      { name: "Anna Andersson", personalNumber: "851201-1234" }
    ]
  });

  const addMessage = (text: string, isBot = true, emoji?: string) => {
    setMessages(prev => [...prev, { text, isBot, emoji }]);
  };

  const handleResultInput = () => {
    const result = parseFloat(inputValue);
    if (isNaN(result)) return;
    
    setCompanyData(prev => ({ ...prev, result }));
    addMessage(inputValue + " kr", false);
    
    if (result > 0) {
      addMessage("Stort grattis till vinsten! 🎉 Det är fantastiskt!", true, "🎉");
      setTimeout(() => {
        addMessage("Vill ni göra någon utdelning av vinsten?", true, "💰");
        setCurrentStep(0.5);
      }, 1000);
    } else {
      addMessage("Tack för informationen. Inga utdelningar att hantera då.", true);
      setTimeout(() => {
        setCurrentStep(1);
        addMessage("Har något särskilt hänt i verksamheten under året?", true, "📋");
      }, 1000);
    }
    
    setShowInput(false);
    setInputValue("");
  };

  const handleDividend = (type: string) => {
    setCompanyData(prev => ({ ...prev, dividend: type }));
    addMessage(type === "0" ? "0 kr utdelning" : type, false);
    
    setTimeout(() => {
      setCurrentStep(1);
      addMessage("Perfekt! Nu går vi vidare. Har något särskilt hänt i verksamheten under året?", true, "📋");
    }, 1000);
  };

  const handleEvents = (hasEvents: boolean) => {
    setCompanyData(prev => ({ ...prev, hasEvents }));
    addMessage(hasEvents ? "Ja, det har hänt saker" : "Nej, inget särskilt", false);
    
    if (hasEvents) {
      setTimeout(() => {
        addMessage("Berätta gärna kort vad som hänt! (t.ex. 'ny lokal', 'anställt ny VD')", true, "✏️");
        setShowInput(true);
      }, 1000);
    } else {
      setCompanyData(prev => ({ ...prev, significantEvents: "Inga väsentliga händelser under året har rapporterats." }));
      setTimeout(() => {
        setCurrentStep(2);
        addMessage("Okej! Nu till avskrivningstider. Vill du använda samma som förra året? (Inventarier 5 år, Bilar 10 år)", true, "🔧");
      }, 1000);
    }
  };

  const handleEventsText = () => {
    setCompanyData(prev => ({ ...prev, significantEvents: inputValue }));
    addMessage(inputValue, false);
    
    setTimeout(() => {
      setCurrentStep(2);
      addMessage("Perfekt! Nu till avskrivningstider. Vill du använda samma som förra året?", true, "🔧");
      setShowInput(false);
      setInputValue("");
    }, 1000);
  };

  const handleDepreciation = (keep: boolean) => {
    setCompanyData(prev => ({ ...prev, depreciation: keep ? "samma" : "ändra" }));
    addMessage(keep ? "Ja, samma som förra året" : "Nej, jag vill ändra", false);
    
    setTimeout(() => {
      setCurrentStep(3);
      addMessage("Bra! Hur många har varit anställda i år? Förra året var det 2 personer.", true, "👥");
    }, 1000);
  };

  const adjustEmployees = (change: number) => {
    const newCount = Math.max(0, companyData.employees + change);
    setCompanyData(prev => ({ ...prev, employees: newCount }));
  };

  const confirmEmployees = () => {
    addMessage(`${companyData.employees} anställda`, false);
    
    setTimeout(() => {
      setCurrentStep(4);
      addMessage("Slutligen, stämmer ort, datum och styrelseuppgifter?", true, "📍");
    }, 1000);
  };

  const confirmFinalDetails = () => {
    addMessage("Ja, allt stämmer", false);
    
    setTimeout(() => {
      setCurrentStep(5);
      addMessage("Fantastiskt! 🎉 Alla uppgifter är insamlade. Nu kan vi generera din årsredovisning!", true, "🎯");
    }, 1000);
  };

  const generatePDF = () => {
    addMessage("Generera PDF", false);
    addMessage("Perfekt! Din årsredovisning genereras nu... 📄⚡", true, "⚡");
    // Här skulle vi skicka till backend för PDF-generering
  };

  const testParser = async (file: File) => {
    try {
      addMessage("🧪 Testar ny databas-driven parser...", true, "🔬");
      
      const result = await apiService.testParser(file);
      
      addMessage(`✅ Parser test lyckades!`, true, "✅");
      addMessage(`📊 Hittade ${result.accounts_count} konton`, true, "📊");
      addMessage(`📈 ${result.rr_count} RR-poster, ${result.br_count} BR-poster`, true, "📈");
      
      console.log('Parser test result:', result);
      
    } catch (error) {
      console.error('Parser test failed:', error);
      addMessage(`❌ Parser test misslyckades: ${error instanceof Error ? error.message : 'Okänt fel'}`, true, "❌");
      toast({
        title: "Parser Test Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    }
  };

  const handleFileProcessed = (data: any) => {
    console.log('File processed data:', data);
    
    // Check if we have structured annual report data from Python
    const annualReportData = data.data?.annualReport;
    let extractedResults = null;
    
    if (annualReportData?.financial_results) {
      // Use the net result from Python-generated structured data
      extractedResults = Math.round(annualReportData.financial_results.net_result).toString();
    } else {
      // Fallback to legacy extraction
      let extractedRevenue = '';
      
      if (data.data.accountBalances) {
        const resultAccounts = ['8999', '8910'];
        for (const account of resultAccounts) {
          if (data.data.accountBalances[account]) {
            extractedResults = Math.abs(data.data.accountBalances[account]).toString();
            break;
          }
        }
      }
      
      if (data.data.incomeStatement && data.data.incomeStatement.length > 0 && !extractedResults) {
        const netResultItem = data.data.incomeStatement.find((item: any) => 
          item.description && item.description.toLowerCase().includes('resultat')
        );
        if (netResultItem) {
          extractedResults = Math.abs(netResultItem.amount).toString();
        }
      }
    }
    
    // Store the complete structured data
    setCompanyData(prev => ({ 
      ...prev, 
      seFileData: {
        ...data.data,
        annualReport: annualReportData
      },
      results: extractedResults || prev.results,
      organizationNumber: annualReportData?.header?.organization_number || data.data?.organization_number || prev.organizationNumber,
      fiscalYear: annualReportData?.header?.fiscal_year || data.data?.fiscal_year || prev.fiscalYear,
      location: annualReportData?.header?.location || prev.location,
      date: annualReportData?.header?.date || data.data?.end_date || prev.date
    }));

    setTimeout(() => {
      addMessage("Perfekt! 🎉 Komplett årsredovisning skapad från SE-filen.", true, "✅");
      setTimeout(() => {
        if (extractedResults && annualReportData) {
          addMessage(`Årets resultat: ${extractedResults} kr. Se fullständig rapport till höger!`, true, "💰");
          setTimeout(() => {
            addMessage("Vill ni göra någon utdelning av vinsten?", true, "💰");
            setCurrentStep(0.5);
          }, 1500);
        } else if (extractedResults) {
          addMessage(`Årets resultat: ${extractedResults} kr från bokföringen.`, true, "💰");
          setTimeout(() => {
            addMessage("Vill ni göra någon utdelning av vinsten?", true, "💰");
            setCurrentStep(0.5);
          }, 1000);
        } else {
          addMessage("Jag kunde inte hitta årets resultat automatiskt i filen. Låt mig fråga dig om det.", true, "🤖");
          setTimeout(() => {
            addMessage("Vad blev årets resultat?", true, "💰");
            setCurrentStep(0);
            setShowInput(true);
          }, 1000);
        }
      }, 1000);
    }, 1000);

    setShowFileUpload(false);
  };


  const handleUseFileUpload = () => {
    console.log('handleUseFileUpload called');
    addMessage("Ja, jag har en SE-fil", false);
    setTimeout(() => {
      addMessage("Bra! Ladda upp din .SE fil så analyserar jag den åt dig. 📁", true, "📤");
      console.log('Setting showFileUpload to true');
      setShowFileUpload(true);
    }, 1000);
  };

  const startProcess = () => {
    addMessage("Låt oss börja!", false);
    setTimeout(() => {
      addMessage("Underbart! Första frågan: Vad blev årets resultat?", true, "💰");
      setShowInput(true);
    }, 1000);
  };

  return (
    <div className="h-screen bg-background font-sans">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Chat Panel */}
        <ResizablePanel defaultSize={40} minSize={30}>
          <div className="h-full flex flex-col">
            {/* Clean Header */}
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-base font-medium text-foreground">RaketRapport</h1>
                  <p className="text-xs text-muted-foreground">Årsredovisning på 5 minuter</p>
                </div>
                {currentStep > 0 && (
                  <div className="text-xs text-muted-foreground">
                    {currentStep}/{TOTAL_STEPS}
                  </div>
                )}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-auto">
              <div className="px-6 py-6 space-y-1">
                {messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    message={message.text}
                    isBot={message.isBot}
                    emoji={message.emoji}
                  />
                ))}
              </div>
            </div>

            {/* Clean Input Area */}
            <div className="px-6 py-4">
              {/* Text input area with arrow button */}
              {(showInput && (currentStep < 1 || currentStep === 1)) && (
                <div className="flex items-end gap-3">
                  {currentStep < 1 ? (
                    <Input
                      type="number"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ange belopp i kr..."
                      className="flex-1 border-none bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                    />
                  ) : (
                    <Textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Beskriv kort vad som hänt..."
                      className="flex-1 border-none bg-transparent text-base resize-none min-h-[40px] focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                    />
                  )}
                  <Button
                    onClick={currentStep < 1 ? handleResultInput : handleEventsText}
                    className="w-7 h-7 rounded-full bg-foreground hover:bg-foreground/90 p-0 flex-shrink-0"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-background"
                    >
                      <path
                        d="M12 19V5M5 12L12 5L19 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Button>
                </div>
              )}

              {/* File Upload - Always show first */}
              {currentStep === -1 && (
                <div className="space-y-3">
                  <FileUpload 
                    onFileProcessed={handleFileProcessed} 
                    onTestParser={testParser}
                  />
                </div>
              )}

              {/* Option buttons for non-input steps */}
              {currentStep === 0 && !showInput && (
                <div className="space-y-3">
                  <OptionButton onClick={startProcess}>
                    Låt oss börja!
                  </OptionButton>
                </div>
              )}

              {currentStep === 0.5 && (
                <div className="space-y-3">
                  <OptionButton onClick={() => handleDividend("0")}>
                    0 kr
                  </OptionButton>
                  <OptionButton onClick={() => handleDividend("Hela årets vinst")}>
                    Hela årets vinst
                  </OptionButton>
                  <OptionButton onClick={() => handleDividend("Hela balanserade vinsten")}>
                    Hela balanserade vinsten
                  </OptionButton>
                  <OptionButton onClick={() => handleDividend("Annat belopp")}>
                    Ange annat belopp
                  </OptionButton>
                </div>
              )}

              {currentStep === 1 && !showInput && (
                <div className="space-y-3">
                  <OptionButton onClick={() => handleEvents(true)}>
                    Ja, det har hänt saker
                  </OptionButton>
                  <OptionButton onClick={() => handleEvents(false)}>
                    Nej, inget särskilt
                  </OptionButton>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-3">
                  <OptionButton onClick={() => handleDepreciation(true)}>
                    Ja, samma som förra året
                  </OptionButton>
                  <OptionButton onClick={() => handleDepreciation(false)}>
                    Nej, jag vill ändra
                  </OptionButton>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-6 bg-muted rounded-xl p-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adjustEmployees(-1)}
                      disabled={companyData.employees <= 0}
                    >
                      ➖
                    </Button>
                    <span className="text-2xl font-bold min-w-[3rem] text-center">
                      {companyData.employees}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adjustEmployees(1)}
                    >
                      ➕
                    </Button>
                  </div>
                  <OptionButton onClick={confirmEmployees}>
                    Bekräfta antal anställda
                  </OptionButton>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="bg-muted rounded-xl p-4 space-y-2 text-sm">
                    <div><strong>Ort:</strong> {companyData.location}</div>
                    <div><strong>Datum:</strong> {companyData.date}</div>
                    <div><strong>Styrelse:</strong></div>
                    {companyData.boardMembers.map((member, index) => (
                      <div key={index} className="ml-4">
                        {member.name} ({member.personalNumber})
                      </div>
                    ))}
                  </div>
                  <OptionButton onClick={confirmFinalDetails}>
                    Ja, allt stämmer
                  </OptionButton>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-3">
                  <OptionButton onClick={generatePDF}>
                    Generera PDF - Din årsredovisning är klar!
                  </OptionButton>
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Annual Report Preview Panel */}
        <ResizablePanel defaultSize={60} minSize={40}>
          <div className="h-full">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-base font-medium text-foreground">Förhandsvisning</h2>
              <p className="text-xs text-muted-foreground">Din årsredovisning uppdateras live</p>
            </div>
            <div className="p-6 h-full overflow-auto">
              <AnnualReportPreview companyData={companyData} currentStep={currentStep} />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
