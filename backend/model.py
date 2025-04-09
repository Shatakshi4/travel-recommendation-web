import sqlite3
import pandas as pd
import os

def create_users_table():
    """Creates the users table if it doesn't exist."""
    conn = sqlite3.connect('travel.db')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        );
    ''')
    conn.commit()
    conn.close()
    print("✅ 'users' table created or already exists.")

def create_favorites_table():
    conn = sqlite3.connect('travel.db')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS favorites (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            place_name TEXT,
            state TEXT,
            UNIQUE(username, place_name)
        );
    ''')
    conn.commit()
    conn.close()
    print("✅ 'favorites' table created or already exists.")


def load_csv_to_sqlite():
    """Loads the cleaned_TRP1.csv file into the SQLite database as 'places' table."""
    conn = sqlite3.connect('travel.db')
    df = pd.read_csv('data/cleaned_TRP1.csv')

    # Add 'Type' column again using same logic
    def classify(text):
        text = str(text).lower()
        if any(word in text for word in ['temple', 'church']): return 'Religious'
        if any(word in text for word in ['fort', 'palace']): return 'Historical'
        if any(word in text for word in ['waterfall', 'hill', 'mountain']): return 'Nature'
        if any(word in text for word in ['beach', 'coast']): return 'Beach'
        if any(word in text for word in ['zoo', 'garden']): return 'Recreational'
        return 'Other'

    df['Type'] = df.apply(lambda row: classify(f"{row['Place_desc']} {row['Place']}"), axis=1)
    df.to_sql('places', conn, if_exists='replace', index=False)
    conn.close()
    print("✅ CSV data loaded into 'places' table.")

if not os.path.exists('data/cleaned_TRP1.csv'):
    print("❌ CSV file not found at 'data/cleaned_TRP1.csv'")
else:
    print("✅ CSV file found. Proceeding to load.")


if __name__ == '__main__':
    create_users_table()  # Run this function to ensure the users table is created
    load_csv_to_sqlite()
    create_favorites_table() 
    conn = sqlite3.connect('travel.db')
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    print("📦 Tables in travel.db:", cursor.fetchall())
    conn.close()
 # Load CSV data into the places table
