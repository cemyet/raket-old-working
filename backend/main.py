from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, List
import os
import tempfile
import shutil
from datetime import datetime
import json

# Importera våra moduler
from services.report_generator import ReportGenerator
from services.supabase_service import SupabaseService
from services.database_parser import DatabaseParser
from models.schemas import ReportRequest, ReportResponse, CompanyData

app = FastAPI(
    title="Raketrapport API",
    description="API för att generera årsredovisningar enligt K2",
    version="1.0.0"
)

# CORS middleware för React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:8080",
        "https://raketrapport.se",
        "https://www.raketrapport.se",
        "https://raket-arsredovisning.vercel.app",
        "https://raketrapport-production.up.railway.app"  # Railway backend URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initiera services
report_generator = ReportGenerator()
supabase_service = SupabaseService()

@app.get("/")
async def root():
    return {"message": "Raketrapport API är igång! 🚀"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/upload-se-file", response_model=dict)
async def upload_se_file(file: UploadFile = File(...)):
    """
    Laddar upp en .SE-fil och extraherar grundläggande information
    """
    if not file.filename.lower().endswith('.se'):
        raise HTTPException(status_code=400, detail="Endast .SE-filer accepteras")
    
    try:
        # Skapa temporär fil
        with tempfile.NamedTemporaryFile(delete=False, suffix='.se') as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_path = temp_file.name
        
        # Read SE file content with encoding detection
        encodings = ['iso-8859-1', 'windows-1252', 'utf-8', 'cp1252']
        se_content = None
        
        for encoding in encodings:
            try:
                with open(temp_path, 'r', encoding=encoding) as f:
                    se_content = f.read()
                break
            except UnicodeDecodeError:
                continue
        
        if se_content is None:
            raise HTTPException(status_code=500, detail="Kunde inte läsa SE-filen med någon av de försökta kodningarna")
        
        # Use the new database-driven parser
        parser = DatabaseParser()
        current_accounts, previous_accounts = parser.parse_account_balances(se_content)
        company_info = parser.extract_company_info(se_content)
        rr_data = parser.parse_rr_data(current_accounts, previous_accounts)
        br_data = parser.parse_br_data(current_accounts, previous_accounts)
        
        # Rensa upp temporär fil
        os.unlink(temp_path)
        
        return {
            "success": True,
            "data": {
                "company_info": company_info,
                "current_accounts_count": len(current_accounts),
                "previous_accounts_count": len(previous_accounts),
                "current_accounts_sample": dict(list(current_accounts.items())[:10]),
                "previous_accounts_sample": dict(list(previous_accounts.items())[:10]),
                "rr_data": rr_data,
                "br_data": br_data,
                "rr_count": len(rr_data),
                "br_count": len(br_data)
            },
            "message": "SE-fil laddad framgångsrikt"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fel vid laddning av fil: {str(e)}")

@app.post("/generate-report", response_model=ReportResponse)
async def generate_report(
    request: ReportRequest,
    background_tasks: BackgroundTasks
):
    """
    Genererar årsredovisning baserat på .SE-fil och användarinput
    """
    try:
        # Generera rapport
        report_data = await report_generator.generate_full_report(request)
        
        # Spara till Supabase (i bakgrunden)
        background_tasks.add_task(
            supabase_service.save_report,
            request.user_id,
            report_data
        )
        
        return ReportResponse(
            success=True,
            report_id=report_data["report_id"],
            download_url=f"/download-report/{report_data['report_id']}",
            message="Rapport genererad framgångsrikt!"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fel vid generering av rapport: {str(e)}")

@app.get("/download-report/{report_id}")
async def download_report(report_id: str):
    """
    Laddar ner genererad PDF-rapport
    """
    try:
        file_path = report_generator.get_report_path(report_id)
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="Rapport hittades inte")
        
        return FileResponse(
            path=file_path,
            filename=f"arsredovisning_{report_id}.pdf",
            media_type="application/pdf"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fel vid nedladdning: {str(e)}")

@app.get("/user-reports/{user_id}")
async def get_user_reports(user_id: str):
    """
    Hämtar användarens tidigare rapporter
    """
    try:
        reports = await supabase_service.get_user_reports(user_id)
        return {"reports": reports}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fel vid hämtning av rapporter: {str(e)}")

@app.get("/company-info/{org_number}")
async def get_company_info(org_number: str):
    """
    Hämtar företagsinformation från Allabolag.se
    """
    try:
        company_info = await report_generator.scrape_company_info(org_number)
        return company_info
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fel vid hämtning av företagsinfo: {str(e)}")

@app.post("/test-parser", response_model=dict)
async def test_parser(file: UploadFile = File(...)):
    """
    Test endpoint for the new database-driven parser
    """
    print(f"Received file: {file.filename}, size: {file.size if hasattr(file, 'size') else 'unknown'}")
    
    if not file.filename.lower().endswith('.se'):
        raise HTTPException(status_code=400, detail=f"Endast .SE-filer accepteras. Fick: {file.filename}")
    
    try:
        # Skapa temporär fil
        with tempfile.NamedTemporaryFile(delete=False, suffix='.se') as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_path = temp_file.name
        
        print(f"Created temp file: {temp_path}")
        
        # Read SE file content - try different encodings
        se_content = None
        encodings_to_try = ['iso-8859-1', 'windows-1252', 'utf-8', 'cp1252']
        
        for encoding in encodings_to_try:
            try:
                with open(temp_path, 'r', encoding=encoding) as f:
                    se_content = f.read()
                print(f"Successfully read file with {encoding} encoding")
                break
            except UnicodeDecodeError as e:
                print(f"Failed to read with {encoding} encoding: {e}")
                continue
        
        if se_content is None:
            raise Exception("Could not read file with any supported encoding")
        
        print(f"Read {len(se_content)} characters from file")
        
        # Initialize parser
        parser = DatabaseParser()
        
        # Parse data
        current_accounts, previous_accounts = parser.parse_account_balances(se_content)
        company_info = parser.extract_company_info(se_content)
        rr_data = parser.parse_rr_data(current_accounts, previous_accounts)
        br_data = parser.parse_br_data(current_accounts, previous_accounts)
        
        print(f"Parsed {len(current_accounts)} current year accounts, {len(previous_accounts)} previous year accounts")
        print(f"Generated {len(rr_data)} RR items, {len(br_data)} BR items")
        
        # Rensa upp temporär fil
        os.unlink(temp_path)
        
        return {
            "success": True,
            "company_info": company_info,
            "current_accounts_count": len(current_accounts),
            "previous_accounts_count": len(previous_accounts),
            "current_accounts_sample": dict(list(current_accounts.items())[:10]),  # First 10 current accounts
            "previous_accounts_sample": dict(list(previous_accounts.items())[:10]),  # First 10 previous accounts
            "rr_count": len(rr_data),
            "rr_sample": rr_data[:5],  # First 5 RR items
            "br_count": len(br_data),
            "br_sample": br_data[:5],  # First 5 BR items
            "message": "Parser test completed successfully"
        }
        
    except Exception as e:
        print(f"Error in test_parser: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Fel vid parser test: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    import os
    
    # Get port from environment variable (Railway sets this)
    port = int(os.environ.get("PORT", 8000))
    
    uvicorn.run(app, host="0.0.0.0", port=port) 