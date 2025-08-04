#!/usr/bin/env python3
"""
Script to set up the new database structure
"""

import os
import requests
import json
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_ANON_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

def create_tables():
    """Create the new tables using direct SQL"""
    try:
        print("Creating new database tables...")
        
        # Create RR mapping table
        rr_table_sql = """
        CREATE TABLE IF NOT EXISTS variable_mapping_rr (
          id SERIAL PRIMARY KEY,
          row_id INTEGER NOT NULL,
          row_title TEXT NOT NULL,
          accounts_included_start INTEGER,
          accounts_included_end INTEGER,
          accounts_included TEXT,
          accounts_excluded_start INTEGER,
          accounts_excluded_end INTEGER,
          accounts_excluded TEXT,
          show_amount BOOLEAN NOT NULL DEFAULT FALSE,
          style TEXT NOT NULL,
          variable_name TEXT NOT NULL,
          element_name TEXT,
          is_calculated BOOLEAN NOT NULL DEFAULT FALSE,
          calculation_formula TEXT,
          is_abstract BOOLEAN NOT NULL DEFAULT FALSE,
          data_type TEXT,
          balance_type TEXT,
          show_in_shortened BOOLEAN NOT NULL DEFAULT FALSE,
          period_type TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          UNIQUE(row_id)
        );
        """
        
        # Create BR mapping table
        br_table_sql = """
        CREATE TABLE IF NOT EXISTS variable_mapping_br (
          id SERIAL PRIMARY KEY,
          row_id INTEGER NOT NULL,
          row_title TEXT NOT NULL,
          accounts_included_start INTEGER,
          accounts_included_end INTEGER,
          accounts_included TEXT,
          accounts_excluded_start INTEGER,
          accounts_excluded_end INTEGER,
          accounts_excluded TEXT,
          show_amount BOOLEAN NOT NULL DEFAULT FALSE,
          style TEXT NOT NULL,
          variable_name TEXT NOT NULL,
          element_name TEXT,
          is_calculated BOOLEAN NOT NULL DEFAULT FALSE,
          calculation_formula TEXT,
          is_abstract BOOLEAN NOT NULL DEFAULT FALSE,
          data_type TEXT,
          balance_type TEXT,
          show_in_shortened BOOLEAN NOT NULL DEFAULT FALSE,
          period_type TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          UNIQUE(row_id)
        );
        """
        
        # Create financial data table
        financial_data_sql = """
        CREATE TABLE IF NOT EXISTS financial_data (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          company_id UUID REFERENCES companies(id),
          fiscal_year INTEGER NOT NULL,
          report_type TEXT NOT NULL CHECK (report_type IN ('RR', 'BR')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          UNIQUE(company_id, fiscal_year, report_type)
        );
        """
        
        # Execute SQL statements
        print("Creating variable_mapping_rr table...")
        supabase.rpc('exec_sql', {'sql': rr_table_sql}).execute()
        
        print("Creating variable_mapping_br table...")
        supabase.rpc('exec_sql', {'sql': br_table_sql}).execute()
        
        print("Creating financial_data table...")
        supabase.rpc('exec_sql', {'sql': financial_data_sql}).execute()
        
        print("✅ All tables created successfully!")
        
    except Exception as e:
        print(f"Error creating tables: {e}")
        print("Trying alternative approach...")
        create_tables_alternative()

def create_tables_alternative():
    """Alternative approach using direct HTTP requests"""
    try:
        print("Using alternative approach to create tables...")
        
        # Use the REST API to create tables
        headers = {
            'apikey': os.getenv("SUPABASE_ANON_KEY"),
            'Authorization': f'Bearer {os.getenv("SUPABASE_ANON_KEY")}',
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        }
        
        # This is a simplified approach - in practice, you'd use Supabase CLI
        print("Tables will be created via Supabase dashboard or CLI")
        print("Please run the SQL from supabase/migrations/20250803000000_create_variable_mapping_tables.sql")
        
    except Exception as e:
        print(f"Alternative approach failed: {e}")

def verify_tables():
    """Verify that the new tables were created"""
    try:
        print("\nVerifying new tables...")
        
        # Check RR table
        try:
            rr_result = supabase.table('variable_mapping_rr').select('*').limit(1).execute()
            print("✅ variable_mapping_rr table exists")
        except Exception as e:
            print(f"❌ variable_mapping_rr table not found: {e}")
        
        # Check BR table
        try:
            br_result = supabase.table('variable_mapping_br').select('*').limit(1).execute()
            print("✅ variable_mapping_br table exists")
        except Exception as e:
            print(f"❌ variable_mapping_br table not found: {e}")
        
        # Check financial_data table
        try:
            fd_result = supabase.table('financial_data').select('*').limit(1).execute()
            print("✅ financial_data table exists")
        except Exception as e:
            print(f"❌ financial_data table not found: {e}")
        
    except Exception as e:
        print(f"Error verifying tables: {e}")

if __name__ == "__main__":
    create_tables()
    verify_tables()
