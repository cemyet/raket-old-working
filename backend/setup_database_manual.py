#!/usr/bin/env python3
"""
Script to set up the database manually and populate tables
"""

import os
import pandas as pd
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_ANON_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

def check_tables():
    """Check if the new tables exist"""
    print("Checking if new tables exist...")
    
    tables_to_check = ['variable_mapping_rr', 'variable_mapping_br', 'financial_data']
    
    for table in tables_to_check:
        try:
            result = supabase.table(table).select('*').limit(1).execute()
            print(f"✅ {table} table exists")
        except Exception as e:
            print(f"❌ {table} table does not exist")
            print(f"   You need to create this table manually in Supabase dashboard")
            print(f"   Use the SQL from: supabase/migrations/20250803000000_create_variable_mapping_tables.sql")
    
    return all([
        check_table_exists('variable_mapping_rr'),
        check_table_exists('variable_mapping_br'),
        check_table_exists('financial_data')
    ])

def check_table_exists(table_name):
    """Check if a specific table exists"""
    try:
        supabase.table(table_name).select('*').limit(1).execute()
        return True
    except:
        return False

def populate_tables():
    """Populate the tables with data from Excel files"""
    if not check_tables():
        print("\n❌ Some tables are missing. Please create them first.")
        print("1. Go to your Supabase dashboard")
        print("2. Go to SQL Editor")
        print("3. Run the SQL from: supabase/migrations/20250803000000_create_variable_mapping_tables.sql")
        print("4. Then run this script again")
        return
    
    print("\n✅ All tables exist! Populating with data...")
    
    # Populate RR mappings
    print("\n=== Populating RR Mappings ===")
    populate_rr_mappings()
    
    # Populate BR mappings
    print("\n=== Populating BR Mappings ===")
    populate_br_mappings()
    
    print("\n✅ Database setup complete!")

def populate_rr_mappings():
    """Populate RR variable mappings from Excel"""
    try:
        print("Loading RR Excel file...")
        df = pd.read_excel('/Users/cem/Desktop/Tabell_RR.xlsx')
        print(f"Found {len(df)} rows in RR file")
        
        for index, row in df.iterrows():
            try:
                data = {
                    'row_id': int(row['ID']) if pd.notna(row['ID']) else None,
                    'row_title': str(row['Radrubrik']) if pd.notna(row['Radrubrik']) else '',
                    'accounts_included_start': int(row['Accounts\nincluded int. start']) if pd.notna(row['Accounts\nincluded int. start']) else None,
                    'accounts_included_end': int(row['Accounts\nincluded int. end']) if pd.notna(row['Accounts\nincluded int. end']) else None,
                    'accounts_included': str(row['Accounts\nincluded']) if pd.notna(row['Accounts\nincluded']) else None,
                    'accounts_excluded_start': int(row['Accounts\nexcluded int. start']) if pd.notna(row['Accounts\nexcluded int. start']) else None,
                    'accounts_excluded_end': int(row['Accounts\nexcluded int. end']) if pd.notna(row['Accounts\nexcluded int. end']) else None,
                    'accounts_excluded': str(row['Accounts\nexcluded']) if pd.notna(row['Accounts\nexcluded']) else None,
                    'show_amount': bool(row['Amount']) if pd.notna(row['Amount']) else False,
                    'style': str(row['Style']) if pd.notna(row['Style']) else 'NORMAL',
                    'variable_name': str(row['Variabelnamn']) if pd.notna(row['Variabelnamn']) else '',
                    'element_name': str(row['Elementnamn']) if pd.notna(row['Elementnamn']) else None,
                    'is_calculated': bool(row['Calculate']) if pd.notna(row['Calculate']) else False,
                    'calculation_formula': str(row['Calculation formula']) if pd.notna(row['Calculation formula']) else None,
                    'is_abstract': bool(row['Abstrakt']) if pd.notna(row['Abstrakt']) else False,
                    'data_type': str(row['Datatyp']) if pd.notna(row['Datatyp']) else None,
                    'balance_type': str(row['Saldo']) if pd.notna(row['Saldo']) else None,
                    'show_in_shortened': bool(row['Forkort\nad']) if pd.notna(row['Forkort\nad']) else False,
                    'period_type': str(row['Periodtyp']) if pd.notna(row['Periodtyp']) else None
                }
                
                if data['row_id'] is None:
                    continue
                
                supabase.table('variable_mapping_rr').upsert(data).execute()
                print(f"✅ Inserted RR row {data['row_id']}: {data['row_title']}")
                
            except Exception as e:
                print(f"❌ Error processing RR row {index}: {e}")
                continue
                
    except Exception as e:
        print(f"❌ Error loading RR file: {e}")

def populate_br_mappings():
    """Populate BR variable mappings from Excel"""
    try:
        print("Loading BR Excel file...")
        df = pd.read_excel('/Users/cem/Desktop/Tabell_BR.xlsx')
        print(f"Found {len(df)} rows in BR file")
        
        for index, row in df.iterrows():
            try:
                data = {
                    'row_id': int(row['ID']) if pd.notna(row['ID']) else None,
                    'row_title': str(row['Radrubrik']) if pd.notna(row['Radrubrik']) else '',
                    'accounts_included_start': int(row['Accounts\nincluded int. start']) if pd.notna(row['Accounts\nincluded int. start']) else None,
                    'accounts_included_end': int(row['Accounts\nincluded int. end']) if pd.notna(row['Accounts\nincluded int. end']) else None,
                    'accounts_included': str(row['Accounts\nincluded']) if pd.notna(row['Accounts\nincluded']) else None,
                    'accounts_excluded_start': int(row['Accounts\nexcluded int. start']) if pd.notna(row['Accounts\nexcluded int. start']) else None,
                    'accounts_excluded_end': int(row['Accounts\nexcluded int. end']) if pd.notna(row['Accounts\nexcluded int. end']) else None,
                    'accounts_excluded': str(row['Accounts\nexcluded']) if pd.notna(row['Accounts\nexcluded']) else None,
                    'show_amount': bool(row['Amount']) if pd.notna(row['Amount']) else False,
                    'style': str(row['Style']) if pd.notna(row['Style']) else 'NORMAL',
                    'variable_name': str(row['Variabelnamn']) if pd.notna(row['Variabelnamn']) else '',
                    'element_name': str(row['Elementnamn']) if pd.notna(row['Elementnamn']) else None,
                    'is_calculated': bool(row['Calculate']) if pd.notna(row['Calculate']) else False,
                    'calculation_formula': str(row['Calculation formula']) if pd.notna(row['Calculation formula']) else None,
                    'is_abstract': bool(row['Abstrakt']) if pd.notna(row['Abstrakt']) else False,
                    'data_type': str(row['Datatyp']) if pd.notna(row['Datatyp']) else None,
                    'balance_type': str(row['Saldo']) if pd.notna(row['Saldo']) else None,
                    'show_in_shortened': bool(row['Forkort\nad']) if pd.notna(row['Forkort\nad']) else False,
                    'period_type': str(row['Periodtyp']) if pd.notna(row['Periodtyp']) else None
                }
                
                if data['row_id'] is None:
                    continue
                
                supabase.table('variable_mapping_br').upsert(data).execute()
                print(f"✅ Inserted BR row {data['row_id']}: {data['row_title']}")
                
            except Exception as e:
                print(f"❌ Error processing BR row {index}: {e}")
                continue
                
    except Exception as e:
        print(f"❌ Error loading BR file: {e}")

if __name__ == "__main__":
    print("🚀 Setting up Raketrapport Database")
    print("=" * 50)
    
    populate_tables()
