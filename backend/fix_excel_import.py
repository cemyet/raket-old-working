#!/usr/bin/env python3
"""
Fixed script to import Excel data with proper column name handling
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

def populate_rr_mappings():
    """Populate RR variable mappings from Excel"""
    try:
        print("Loading RR Excel file...")
        df = pd.read_excel('/Users/cem/Desktop/Tabell_RR.xlsx')
        print(f"Found {len(df)} rows in RR file")
        
        # Print column names to debug
        print("Column names:", df.columns.tolist())
        
        for index, row in df.iterrows():
            try:
                # Handle column names with newlines
                forkort_ad_col = None
                for col in df.columns:
                    if 'Forkort' in col:
                        forkort_ad_col = col
                        break
                
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
                    'show_in_shortened': bool(row[forkort_ad_col]) if forkort_ad_col and pd.notna(row[forkort_ad_col]) else False,
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
        
        # Print column names to debug
        print("Column names:", df.columns.tolist())
        
        for index, row in df.iterrows():
            try:
                # Handle column names with newlines
                forkort_ad_col = None
                for col in df.columns:
                    if 'Forkort' in col:
                        forkort_ad_col = col
                        break
                
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
                    'show_in_shortened': bool(row[forkort_ad_col]) if forkort_ad_col and pd.notna(row[forkort_ad_col]) else False,
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
    print("🚀 Fixing Excel Import")
    print("=" * 50)
    
    print("\n=== Populating RR Mappings ===")
    populate_rr_mappings()
    
    print("\n=== Populating BR Mappings ===")
    populate_br_mappings()
    
    print("\n✅ Import complete!")
