"""
Database-driven parser for SE files
Replaces hardcoded BR_STRUCTURE and RR_STRUCTURE with database queries
"""

import os
from typing import Dict, List, Any, Optional
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_ANON_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

class DatabaseParser:
    """Database-driven parser for financial data"""
    
    def __init__(self):
        self.rr_mappings = None
        self.br_mappings = None
        self._load_mappings()
    
    def _load_mappings(self):
        """Load variable mappings from database"""
        try:
            # Load RR mappings
            rr_response = supabase.table('variable_mapping_rr').select('*').execute()
            self.rr_mappings = rr_response.data
            
            # Load BR mappings
            br_response = supabase.table('variable_mapping_br').select('*').execute()
            self.br_mappings = br_response.data
            
            print(f"Loaded {len(self.rr_mappings)} RR mappings and {len(self.br_mappings)} BR mappings")
            
        except Exception as e:
            print(f"Error loading mappings: {e}")
            self.rr_mappings = []
            self.br_mappings = []
    
    def parse_account_balances(self, se_content: str) -> Dict[str, float]:
        """Parse account balances from SE file content using the correct format"""
        current_accounts = {}
        previous_accounts = {}
        
        # Parse SE file content to extract account balances
        lines = se_content.split('\n')
        
        for line in lines:
            line = line.strip()
            
            # Handle BR accounts: #UB (Uppgjord Balans) - both years
            if line.startswith('#UB '):
                parts = line.split()
                if len(parts) >= 4:
                    try:
                        fiscal_year = int(parts[1])
                        account_id = parts[2]
                        balance = float(parts[3])
                        
                        if fiscal_year == 0:  # Current year
                            current_accounts[account_id] = balance
                        elif fiscal_year == -1:  # Previous year
                            previous_accounts[account_id] = balance
                    except (ValueError, TypeError):
                        continue
                        
            # Handle RR accounts: #RES (Resultat) - both years
            elif line.startswith('#RES '):
                parts = line.split()
                if len(parts) >= 4:
                    try:
                        fiscal_year = int(parts[1])
                        account_id = parts[2]
                        balance = float(parts[3])
                        
                        if fiscal_year == 0:  # Current year
                            current_accounts[account_id] = balance
                        elif fiscal_year == -1:  # Previous year
                            previous_accounts[account_id] = balance
                    except (ValueError, TypeError):
                        continue
                        
            # Handle legacy #VER format (fallback)
            elif line.startswith('#VER'):
                parts = line.split()
                if len(parts) >= 3:
                    account_id = parts[1]
                    try:
                        balance = float(parts[2])
                        current_accounts[account_id] = balance
                    except ValueError:
                        continue
        
        print(f"Parsed {len(current_accounts)} current year accounts, {len(previous_accounts)} previous year accounts")
        if current_accounts:
            print(f"Sample current accounts: {dict(list(current_accounts.items())[:5])}")
        if previous_accounts:
            print(f"Sample previous accounts: {dict(list(previous_accounts.items())[:5])}")
        
        return current_accounts, previous_accounts
    
    def calculate_variable_value(self, mapping: Dict[str, Any], accounts: Dict[str, float]) -> float:
        """Calculate value for a specific variable based on its mapping"""
        total = 0.0
        
        # Get account ranges to include
        start = mapping.get('accounts_included_start')
        end = mapping.get('accounts_included_end')
        
        # Include accounts in range
        if start and end:
            for account_id in range(start, end + 1):
                account_str = str(account_id)
                if account_str in accounts:
                    total += accounts[account_str]
        
        # Include additional specific accounts
        additional_accounts = mapping.get('accounts_included')
        if additional_accounts:
            for account_spec in additional_accounts.split(';'):
                account_spec = account_spec.strip()
                if '-' in account_spec:
                    # Range specification (e.g., "4910-4931")
                    range_start, range_end = map(int, account_spec.split('-'))
                    for account_id in range(range_start, range_end + 1):
                        account_str = str(account_id)
                        if account_str in accounts:
                            total += accounts[account_str]
                else:
                    # Single account
                    if account_spec in accounts:
                        total += accounts[account_spec]
        
        # Exclude accounts in range
        exclude_start = mapping.get('accounts_excluded_start')
        exclude_end = mapping.get('accounts_excluded_end')
        
        if exclude_start and exclude_end:
            for account_id in range(exclude_start, exclude_end + 1):
                account_str = str(account_id)
                if account_str in accounts:
                    total -= accounts[account_str]
        
        # Exclude additional specific accounts
        excluded_accounts = mapping.get('accounts_excluded')
        if excluded_accounts:
            for account_spec in excluded_accounts.split(';'):
                account_spec = account_spec.strip()
                if '-' in account_spec:
                    # Range specification
                    range_start, range_end = map(int, account_spec.split('-'))
                    for account_id in range(range_start, range_end + 1):
                        account_str = str(account_id)
                        if account_str in accounts:
                            total -= accounts[account_str]
                else:
                    # Single account
                    if account_spec in accounts:
                        total -= accounts[account_str]
        
        # Apply sign based on SE file data structure
        # All account balances from 2000-8989 need to be reversed regardless of balance_type
        
        # Check if any accounts in the 2000-8989 range are being used
        should_reverse = False
        
        # Check account range
        start = mapping.get('accounts_included_start')
        end = mapping.get('accounts_included_end')
        if start and end and 2000 <= start <= 8989:
            should_reverse = True
        
        # Check additional specific accounts
        additional_accounts = mapping.get('accounts_included')
        if additional_accounts:
            for account_spec in additional_accounts.split(';'):
                account_spec = account_spec.strip()
                if '-' in account_spec:
                    # Range specification
                    range_start, range_end = map(int, account_spec.split('-'))
                    if 2000 <= range_start <= 8989:
                        should_reverse = True
                        break
                else:
                    # Single account
                    try:
                        account_id = int(account_spec)
                        if 2000 <= account_id <= 8989:
                            should_reverse = True
                            break
                    except ValueError:
                        continue
        
        if should_reverse:
            return -total
        else:
            return total
    
    def calculate_formula_value(self, mapping: Dict[str, Any], accounts: Dict[str, float], existing_results: List[Dict[str, Any]], use_previous_year: bool = False, rr_data: List[Dict[str, Any]] = None) -> float:
        """Calculate value using a formula that references variable names"""
        formula = mapping.get('calculation_formula', '')
        if not formula:
            return 0.0
        

        
        # Parse formula like "NETTOOMSATTNING + OVRIGA_INTEKNINGAR"
        # Use variable names instead of row references
        import re
        
        # Replace variable references with their calculated values
        # Formula format: variable names like SumRorelseintakter, SumRorelsekostnader, etc.
        # Use word boundaries to match complete variable names
        pattern = r'\b([A-Z][a-zA-Z0-9_]*)\b'
        
        def replace_variable(match):
            var_name = match.group(1)
            # Use the new helper method to get calculated values
            value = self._get_calculated_value(var_name, existing_results, use_previous_year, rr_data)

            return str(value)
        
        # Replace all variable references
        formula_with_values = re.sub(pattern, replace_variable, formula)
        
        try:
            # Evaluate the formula
            result = eval(formula_with_values)
            return float(result)
        except Exception as e:
            print(f"Formula evaluation error: {e}")
            return 0.0
    
    def parse_rr_data(self, current_accounts: Dict[str, float], previous_accounts: Dict[str, float] = None) -> List[Dict[str, Any]]:
        """Parse RR (Resultaträkning) data using database mappings"""
        if not self.rr_mappings:
            return []
        
        results = []
        

        
        # First pass: Create all rows with direct calculations
        for mapping in self.rr_mappings:
            if not mapping.get('show_amount'):
                # Header row - no calculation needed
                results.append({
                    'id': mapping['row_id'],
                    'label': mapping['row_title'],
                    'current_amount': None,
                    'previous_amount': None,
                    'level': self._get_level_from_style(mapping['style']),
                    'section': 'RR',
                    'bold': mapping['style'] in ['H0', 'H1', 'H2', 'H4'],
                    'style': mapping['style'],
                    'variable_name': mapping['variable_name'],
                    'is_calculated': mapping['is_calculated'],
                    'calculation_formula': mapping['calculation_formula'],
                    'show_amount': mapping['show_amount'],
                    'block_group': mapping.get('block_group'),
                    'always_show': mapping.get('always_show', False)
                })
            else:
                # Data row - calculate amounts for both years
                if mapping.get('is_calculated'):
                    # For calculated items, set to 0 initially, will be updated in second pass
                    current_amount = 0.0
                    previous_amount = 0.0
                else:
                    # Direct account calculation
                    current_amount = self.calculate_variable_value(mapping, current_accounts)
                    previous_amount = self.calculate_variable_value(mapping, previous_accounts or {})
                

                
                results.append({
                    'id': mapping['row_id'],
                    'label': mapping['row_title'],
                    'current_amount': current_amount,
                    'previous_amount': previous_amount,
                    'level': self._get_level_from_style(mapping['style']),
                    'section': 'RR',
                    'bold': mapping['style'] in ['H0', 'H1', 'H2', 'H4'],
                    'style': mapping['style'],
                    'variable_name': mapping['variable_name'],
                    'is_calculated': mapping['is_calculated'],
                    'calculation_formula': mapping['calculation_formula'],
                    'show_amount': mapping['show_amount'],
                    'block_group': mapping.get('block_group'),
                    'always_show': mapping.get('always_show', False)
                })
        
        # Second pass: Calculate formulas using all available data
        print(f"DEBUG: Available variables in results: {[r.get('variable_name') for r in results if r.get('variable_name')]}")
        
        # Sort calculated mappings by row_id to ensure dependencies are calculated first
        calculated_mappings = [(i, mapping) for i, mapping in enumerate(self.rr_mappings) 
                              if mapping.get('is_calculated')]
        calculated_mappings.sort(key=lambda x: int(x[1]['row_id']))
        
        for i, mapping in calculated_mappings:
                # Special debugging for "Summa eget kapital"
                if "eget kapital" in mapping['row_title'].lower():
                    print(f"DEBUG: === SPECIAL DEBUG FOR EGET KAPITAL ===")
                    print(f"DEBUG: Formula: {mapping.get('calculation_formula')}")
                    print(f"DEBUG: Variable name: {mapping.get('variable_name')}")
                
                current_amount = self.calculate_formula_value(mapping, current_accounts, results, use_previous_year=False)
                previous_amount = self.calculate_formula_value(mapping, previous_accounts or {}, results, use_previous_year=True)
                
                print(f"DEBUG: Formula calculation - {mapping['row_title']}: current={current_amount}, previous={previous_amount}")
                
                # Find and update the correct result by row_id
                for result in results:
                    if result['id'] == mapping['row_id']:
                        result['current_amount'] = current_amount
                        result['previous_amount'] = previous_amount
                        break
        
        # Store calculated values in database for future use
        self.store_calculated_values(results, 'RR')
        
        # Sort results by ID to ensure correct order
        results.sort(key=lambda x: int(x['id']))
        
        return results
    
    def store_calculated_values(self, results: List[Dict[str, Any]], report_type: str):
        """Store calculated values in database for future retrieval"""
        try:
            # Create a dictionary of variable_name -> current_amount for calculated items
            calculated_values = {}
            for item in results:
                if item.get('is_calculated') and item.get('variable_name'):
                    # Include all calculated items, even if current_amount is 0 or -0
                    current_amount = item.get('current_amount')
                    if current_amount is not None:  # This includes 0, -0, and other values
                        calculated_values[item['variable_name']] = current_amount
            
            if calculated_values:
                # Store in a temporary table or update existing records
                # This will be used when formulas reference these variables
                for var_name, value in calculated_values.items():
                    # You might want to store this in a separate table or update existing records
                    # For now, we'll just use it in memory
                    pass
                    
        except Exception as e:
            print(f"Error storing calculated values: {e}")
    
    def _get_calculated_value(self, variable_name: str, results: List[Dict[str, Any]], use_previous_year: bool = False, rr_data: List[Dict[str, Any]] = None) -> float:
        """Get calculated value for a variable from results or RR data"""
        # First check in the current results (BR data)
        for item in results:
            if item.get('variable_name') == variable_name:
                value = item.get('previous_amount' if use_previous_year else 'current_amount', 0)
                return value if value is not None else 0
        
        # If not found in current results, check in RR data
        if rr_data:
            for item in rr_data:
                if item.get('variable_name') == variable_name:
                    value = item.get('previous_amount' if use_previous_year else 'current_amount', 0)
                    return value if value is not None else 0
        
        return 0
    
    def parse_br_data(self, current_accounts: Dict[str, float], previous_accounts: Dict[str, float] = None, rr_data: List[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """Parse BR (Balansräkning) data using database mappings"""
        if not self.br_mappings:
            return []
        
        results = []
        
        # First pass: Create all rows with direct calculations
        for mapping in self.br_mappings:
            if not mapping.get('show_amount'):
                # Header row - no calculation needed
                results.append({
                    'id': mapping['row_id'],
                    'label': mapping['row_title'],
                    'current_amount': None,
                    'previous_amount': None,
                    'level': self._get_level_from_style(mapping['style']),
                    'section': 'BR',
                    'type': self._get_balance_type(mapping),
                    'bold': mapping['style'] in ['H0', 'H1', 'H2', 'H4'],
                    'style': mapping['style'],
                    'variable_name': mapping['variable_name'],
                    'is_calculated': mapping['is_calculated'],
                    'calculation_formula': mapping['calculation_formula'],
                    'show_amount': mapping['show_amount'],
                    'block_group': mapping.get('block_group'),
                    'always_show': mapping.get('always_show', False)
                })
            else:
                # Data row - calculate amounts for both years
                if mapping.get('is_calculated'):
                    # For calculated items, set to 0 initially, will be updated in second pass
                    current_amount = 0.0
                    previous_amount = 0.0
                else:
                    # Direct account calculation
                    current_amount = self.calculate_variable_value(mapping, current_accounts)
                    previous_amount = self.calculate_variable_value(mapping, previous_accounts or {})
                
                results.append({
                    'id': mapping['row_id'],
                    'label': mapping['row_title'],
                    'current_amount': current_amount,
                    'previous_amount': previous_amount,
                    'level': self._get_level_from_style(mapping['style']),
                    'section': 'BR',
                    'type': self._get_balance_type(mapping),
                    'bold': mapping['style'] in ['H0', 'H1', 'H2', 'H4'],
                    'style': mapping['style'],
                    'variable_name': mapping['variable_name'],
                    'is_calculated': mapping['is_calculated'],
                    'calculation_formula': mapping['calculation_formula'],
                    'show_amount': mapping['show_amount'],
                    'block_group': mapping.get('block_group'),
                    'always_show': mapping.get('always_show', False)
                })
        
        # Second pass: Calculate formulas using all available data
        # Sort calculated mappings by row_id to ensure dependencies are calculated first
        calculated_mappings = [(i, mapping) for i, mapping in enumerate(self.br_mappings) 
                              if mapping.get('is_calculated')]
        calculated_mappings.sort(key=lambda x: int(x[1]['row_id']))
        
        for i, mapping in calculated_mappings:
                current_amount = self.calculate_formula_value(mapping, current_accounts, results, use_previous_year=False, rr_data=rr_data)
                previous_amount = self.calculate_formula_value(mapping, previous_accounts or {}, results, use_previous_year=True, rr_data=rr_data)
                
                # Find and update the correct result by row_id
                for result in results:
                    if result['id'] == mapping['row_id']:
                        result['current_amount'] = current_amount
                        result['previous_amount'] = previous_amount
                        break
        
        # Store calculated values in database for future use
        self.store_calculated_values(results, 'BR')
        
        # Sort results by ID to ensure correct order
        results.sort(key=lambda x: int(x['id']))
        

        
        return results
    
    def _get_level_from_style(self, style: str) -> int:
        """Get hierarchy level from style"""
        style_map = {
            'H0': 0,
            'H1': 1,
            'H2': 2,
            'H3': 3,
            'H4': 4,  # Replace S1, S2, S3 with H4
            'NORMAL': 4,
            'S1': 4,  # Map S1 to H4 level
            'S2': 4,  # Map S2 to H4 level
            'S3': 4   # Map S3 to H4 level
        }
        return style_map.get(style, 4)
    
    def _get_balance_type(self, mapping: Dict[str, Any]) -> str:
        """Get balance type (asset/liability/equity) from mapping"""
        balance_type = mapping.get('balance_type', 'DEBIT')
        
        # Simple mapping - you might need to refine this based on your BR structure
        if balance_type == 'DEBIT':
            return 'asset'
        elif balance_type == 'CREDIT':
            # Determine if it's liability or equity based on account ranges
            start = mapping.get('accounts_included_start', 0)
            if start and start >= 2000:  # Equity accounts typically start at 2000+
                return 'equity'
            else:
                return 'liability'
        else:
            return 'asset'  # Default
    
    def ensure_financial_data_columns(self, rr_data: List[Dict[str, Any]], br_data: List[Dict[str, Any]]) -> None:
        """Ensure that the financial_data table has columns for all variables"""
        # Temporarily disabled - exec_sql function doesn't exist in database
        # TODO: Implement proper dynamic column creation when database supports it
        pass

    def store_financial_data(self, company_id: str, fiscal_year: int, 
                           rr_data: List[Dict[str, Any]], br_data: List[Dict[str, Any]]) -> Dict[str, str]:
        """Store parsed financial data in the database"""
        try:
            # Temporarily disabled dynamic column creation
            # self.ensure_financial_data_columns(rr_data, br_data)
            
            # Store RR data
            rr_values = {}
            for item in rr_data:
                if item['current_amount'] is not None and item['variable_name']:
                    rr_values[item['variable_name']] = item['current_amount']
            
            if rr_values:
                supabase.table('financial_data').upsert({
                    'company_id': company_id,
                    'fiscal_year': fiscal_year,
                    'report_type': 'RR',
                    **rr_values
                }).execute()
            
            # Store BR data
            br_values = {}
            for item in br_data:
                if item['current_amount'] is not None and item['variable_name']:
                    br_values[item['variable_name']] = item['current_amount']
            
            if br_values:
                supabase.table('financial_data').upsert({
                    'company_id': company_id,
                    'fiscal_year': fiscal_year,
                    'report_type': 'BR',
                    **br_values
                }).execute()
            
            return {
                'rr_id': f"{company_id}_{fiscal_year}_RR",
                'br_id': f"{company_id}_{fiscal_year}_BR"
            }
            
        except Exception as e:
            print(f"Error storing financial data: {e}")
            return {}
    
    def get_financial_data(self, company_id: str, fiscal_year: int) -> Dict[str, Any]:
        """Retrieve financial data from database"""
        try:
            rr_data = supabase.table('financial_data').select('*').eq('company_id', company_id).eq('fiscal_year', fiscal_year).eq('report_type', 'RR').execute()
            br_data = supabase.table('financial_data').select('*').eq('company_id', company_id).eq('fiscal_year', fiscal_year).eq('report_type', 'BR').execute()
            
            return {
                'rr_data': rr_data.data[0] if rr_data.data else {},
                'br_data': br_data.data[0] if br_data.data else {}
            }
            
        except Exception as e:
            print(f"Error retrieving financial data: {e}")
            return {'rr_data': {}, 'br_data': {}}

    def extract_company_info(self, se_content: str) -> Dict[str, Any]:
        """Extract company information from SE file headers"""
        company_info = {}
        lines = se_content.split('\n')
        
        for line in lines:
            line = line.strip()
            
            if line.startswith('#FNAMN'):
                # Company name: #FNAMN "Company Name"
                parts = line.split('"', 2)
                if len(parts) >= 2:
                    company_info['company_name'] = parts[1]
                    
            elif line.startswith('#ORGNR'):
                # Organization number: #ORGNR 556610-3643
                parts = line.split()
                if len(parts) >= 2:
                    company_info['organization_number'] = parts[1]
                    
            elif line.startswith('#RAR'):
                # Fiscal year: #RAR 0 20240101 20241231
                parts = line.split()
                if len(parts) >= 4 and parts[1] == '0':  # Current year
                    company_info['fiscal_year'] = int(parts[2][:4])  # Extract year from date
                    company_info['start_date'] = parts[2]
                    company_info['end_date'] = parts[3]
        
        print(f"Extracted company info: {company_info}")
        return company_info
    
    def update_calculation_formula(self, row_id: int, formula: str) -> bool:
        """Update calculation formula for a specific row in the database"""
        try:
            # Update the formula in variable_mapping_br table
            response = supabase.table('variable_mapping_br').update({
                'calculation_formula': formula,
                'is_calculated': True
            }).eq('id', row_id).execute()
            
            print(f"Successfully updated formula for row {row_id}: {formula}")
            return True
            
        except Exception as e:
            print(f"Error updating formula for row {row_id}: {e}")
            return False
