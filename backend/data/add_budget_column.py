import pandas as pd
import os

# Define the path to your original CSV file
INPUT_CSV_PATH = "cleaned_TRP1.csv"
# Define the path for the new CSV file with the added budget column
OUTPUT_CSV_PATH = "cleaned_TRP1_with_budget.csv"

def infer_budget_category(place_desc, place_name):
    """
    Infers a budget category (Low, Medium, High) based on keywords in description or place name.
    This is a heuristic and should be manually reviewed for accuracy.
    """
    desc = str(place_desc).lower() if place_desc else ""
    name = str(place_name).lower() if place_name else ""

    # High budget keywords
    high_keywords = ['luxury', 'resort', 'boutique', 'exclusive', 'premium', 'high-end', 'expensive', 'upscale']
    if any(keyword in desc or keyword in name for keyword in high_keywords):
        return 'High'

    # Low budget keywords
    low_keywords = ['budget', 'hostel', 'cheap', 'affordable', 'backpacker', 'dorm', 'guesthouse', 'homestay']
    if any(keyword in desc or keyword in name for keyword in low_keywords):
        return 'Low'

    # Medium budget keywords (default if no strong indicators)
    return 'Medium'

def add_budget_column_to_csv(input_csv_path, output_csv_path):
    """
    Loads a CSV, adds a 'Budget_Category' column, and saves to a new CSV.
    """
    if not os.path.exists(input_csv_path):
        print(f"Error: Input CSV file not found at {input_csv_path}")
        return

    try:
        df = pd.read_csv(input_csv_path)
        print(f"Successfully loaded {input_csv_path}. Original shape: {df.shape}")
    except Exception as e:
        print(f"Error loading CSV: {e}")
        return

    # Apply the inference function to create the new column
    # Ensure 'Place_desc' and 'Place' columns exist before trying to access them
    if 'Place_desc' not in df.columns:
        print("Warning: 'Place_desc' column not found. Budget inference might be less accurate.")
        df['Place_desc'] = '' # Add an empty column to prevent errors
    if 'Place' not in df.columns:
        print("Warning: 'Place' column not found. Budget inference might be less accurate.")
        df['Place'] = '' # Add an empty column to prevent errors

    df['Budget_Category'] = df.apply(lambda row: infer_budget_category(row.get('Place_desc'), row.get('Place')), axis=1)

    # Save the modified DataFrame to a new CSV file
    try:
        df.to_csv(output_csv_path, index=False)
        print(f"Successfully added 'Budget_Category' column and saved to {output_csv_path}. New shape: {df.shape}")
        print("\n--- IMPORTANT ---")
        print("Please open the new CSV file (e.g., 'cleaned_TRP1_with_budget.csv') in a spreadsheet editor (like Excel or Google Sheets).")
        print("Manually review and adjust the 'Budget_Category' column for accuracy, as the automated inference is a heuristic.")
        print("Once reviewed, ensure you save the file again before proceeding with the next step.")
    except Exception as e:
        print(f"Error saving CSV: {e}")

if __name__ == "__main__":
    add_budget_column_to_csv(INPUT_CSV_PATH, OUTPUT_CSV_PATH)

