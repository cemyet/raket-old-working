#!/usr/bin/env python3
"""
Enkel test-fil för att verifiera att FastAPI-servern fungerar
"""

import uvicorn

if __name__ == "__main__":
    print("🚀 Startar Raketrapport FastAPI Server...")
    print("📍 Server kommer att köras på: http://localhost:8000")
    print("📚 API dokumentation: http://localhost:8000/docs")
    print("=" * 50)
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    ) 