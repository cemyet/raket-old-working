#!/usr/bin/env python3
"""
Skript för att sätta upp Supabase-databasen för Raketrapport
"""

import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

def setup_supabase():
    """Sätter upp Supabase-tabeller"""
    
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_ANON_KEY")
    access_token = os.getenv("SUPABASE_ACCESS_TOKEN")
    
    if not all([supabase_url, supabase_key, access_token]):
        print("❌ Supabase credentials saknas i .env-filen")
        print("Skapa .env-fil med:")
        print("SUPABASE_URL=https://your-project-ref.supabase.co")
        print("SUPABASE_ANON_KEY=your_anon_key")
        print("SUPABASE_ACCESS_TOKEN=sbp_95f94172d09075b1059c57bee56d2d1ca18b8e06")
        return False
    
    try:
        # Skapa client
        supabase: Client = create_client(supabase_url, supabase_key)
        
        # Sätt access token
        supabase.auth.set_session(access_token, None)
        
        print("🔗 Ansluter till Supabase...")
        
        # Skapa reports-tabell
        reports_sql = """
        CREATE TABLE IF NOT EXISTS reports (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id TEXT NOT NULL,
            report_id TEXT NOT NULL UNIQUE,
            company_name TEXT NOT NULL,
            fiscal_year INTEGER NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            pdf_path TEXT,
            report_data JSONB
        );
        
        -- Skapa index för snabbare sökningar
        CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
        CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);
        """
        
        # Skapa user_preferences-tabell
        preferences_sql = """
        CREATE TABLE IF NOT EXISTS user_preferences (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id TEXT UNIQUE NOT NULL,
            preferences JSONB DEFAULT '{}',
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Skapa index
        CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
        """
        
        # Skapa file_uploads-tabell för .SE-filer
        uploads_sql = """
        CREATE TABLE IF NOT EXISTS file_uploads (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id TEXT NOT NULL,
            file_name TEXT NOT NULL,
            file_path TEXT NOT NULL,
            file_size INTEGER,
            uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            processed BOOLEAN DEFAULT FALSE
        );
        
        -- Skapa index
        CREATE INDEX IF NOT EXISTS idx_file_uploads_user_id ON file_uploads(user_id);
        CREATE INDEX IF NOT EXISTS idx_file_uploads_uploaded_at ON file_uploads(uploaded_at);
        """
        
        print("📊 Skapar tabeller...")
        
        # Kör SQL-kommandon
        for sql in [reports_sql, preferences_sql, uploads_sql]:
            try:
                # Notera: Supabase Python client har begränsad SQL-stöd
                # I praktiken skulle du köra dessa kommandon i Supabase SQL Editor
                print("✅ SQL-kommandon redo att köras i Supabase SQL Editor")
                print("Kopiera och kör följande i Supabase Dashboard > SQL Editor:")
                print("-" * 50)
                print(sql)
                print("-" * 50)
                
            except Exception as e:
                print(f"⚠️  Varning vid SQL-körning: {e}")
        
        # Testa anslutning genom att hämta data
        try:
            result = supabase.table("reports").select("count", count="exact").execute()
            print(f"✅ Anslutning till Supabase fungerar! Antal rapporter: {result.count}")
        except Exception as e:
            print(f"⚠️  Tabeller kanske inte finns än: {e}")
            print("Kör SQL-kommandona ovan i Supabase SQL Editor först")
        
        return True
        
    except Exception as e:
        print(f"❌ Fel vid Supabase-setup: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Raketrapport Supabase Setup")
    print("=" * 40)
    
    success = setup_supabase()
    
    if success:
        print("\n✅ Supabase-setup slutförd!")
        print("\n📝 Nästa steg:")
        print("1. Gå till Supabase Dashboard > SQL Editor")
        print("2. Kör SQL-kommandona som visades ovan")
        print("3. Starta FastAPI-servern: python main.py")
    else:
        print("\n❌ Setup misslyckades. Kontrollera .env-filen.") 