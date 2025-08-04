#!/usr/bin/env python3
"""
Enkel test-server för att verifiera FastAPI
"""

from fastapi import FastAPI
import uvicorn

app = FastAPI(title="Raketrapport Test", version="1.0.0")

@app.get("/")
async def root():
    return {"message": "Raketrapport API fungerar!"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    print("🚀 Startar enkel test-server...")
    uvicorn.run(app, host="0.0.0.0", port=8000) 