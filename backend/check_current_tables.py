#!/usr/bin/env python3
"""
Script to check current database tables and clean up if needed
"""

import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_ANON_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

def check_current_tables():
    """Check what tables currently exist in the database"""
    try:
        # Try to query existing tables
        print("Checking current database tables...")
        
        # Check if old tables exist
        try:
            companies_result = supabase.table('companies').select('*').limit(1).execute()
            print("✅ companies table exists")
        except Exception as e:
            print("❌ companies table does not exist")
        
        try:
            accounting_reports_result = supabase.table('accounting_reports').select('*').limit(1).execute()
            print("✅ accounting_reports table exists")
        except Exception as e:
            print("❌ accounting_reports table does not exist")
        
        try:
            variable_mapping_rr_result = supabase.table('variable_mapping_rr').select('*').limit(1).execute()
            print("✅ variable_mapping_rr table exists")
        except Exception as e:
            print("❌ variable_mapping_rr table does not exist")
        
        try:
            variable_mapping_br_result = supabase.table('variable_mapping_br').select('*').limit(1).execute()
            print("✅ variable_mapping_br table exists")
        except Exception as e:
            print("❌ variable_mapping_br table does not exist")
        
        try:
            financial_data_result = supabase.table('financial_data').select('*').limit(1).execute()
            print("✅ financial_data table exists")
        except Exception as e:
            print("❌ financial_data table does not exist")
        
        print("\nDatabase check complete!")
        
    except Exception as e:
        print(f"Error checking database: {e}")

if __name__ == "__main__":
    check_current_tables()
