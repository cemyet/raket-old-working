#!/usr/bin/env python3

import os
import sys
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from services.database_parser import DatabaseParser
from supabase import create_client, Client

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Initialize Supabase client
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_ANON_KEY")
supabase: Client = create_client(url, key)

def test_real_accounts():
    """Test with real account data to see what row 382 should calculate to"""
    
    # Initialize parser
    parser = DatabaseParser()
    
    print("🔍 Testing row 382 calculation with real account data...")
    
    # Create sample account data that would include the variables needed for row 382
    # Based on the formula: SumBundetEgetKapital + SumFrittEgetKapital
    
    # SumBundetEgetKapital = Aktiekapital+EjRegistreratAktiekapital+OverkursfondBunden+Uppskrivningsfond+Reservfond
    # SumFrittEgetKapital = OverkursfondFri+BalanseratResultat+AretsResultat
    
    sample_accounts = {
        # SumBundetEgetKapital components
        '2010': 500000,  # Aktiekapital
        '2011': 0,       # EjRegistreratAktiekapital  
        '2012': 0,       # OverkursfondBunden
        '2013': 0,       # Uppskrivningsfond
        '2014': 0,       # Reservfond
        
        # SumFrittEgetKapital components
        '2015': 0,       # OverkursfondFri
        '2016': 456989,  # BalanseratResultat
        '2017': 0,       # AretsResultat
    }
    
    print(f"📊 Sample account data: {sample_accounts}")
    
    try:
        # Parse BR data
        br_results = parser.parse_br_data(sample_accounts)
        
        # Look for row 382
        row_382 = None
        for item in br_results:
            if item['id'] == '382':
                row_382 = item
                break
        
        if row_382:
            print(f"✅ Row 382 found:")
            print(f"   - Label: {row_382['label']}")
            print(f"   - Current amount: {row_382['current_amount']}")
            print(f"   - Previous amount: {row_382['previous_amount']}")
            print(f"   - Is calculated: {row_382['is_calculated']}")
            print(f"   - Formula: {row_382['calculation_formula']}")
            
            # Expected: 500000 + 456989 = 956989
            expected = 500000 + 456989
            print(f"   - Expected amount: {expected}")
            print(f"   - Calculation correct: {row_382['current_amount'] == expected}")
        else:
            print("❌ Row 382 NOT found in parser output")
            
        # Show the intermediate calculations
        print("\n🔍 Intermediate calculations:")
        for item in br_results:
            if item['id'] in ['376', '381']:  # SumBundetEgetKapital and SumFrittEgetKapital
                print(f"   Row {item['id']}: {item['label']} = {item['current_amount']}")
                
    except Exception as e:
        print(f"❌ Error in parser: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_real_accounts() 