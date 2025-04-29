import sqlite3
import pandas as pd
import os

# 🧠 Type inference from description
def infer_type(text):
    text = str(text).lower()
    if any(word in text for word in ['temple', 'church']): return 'Religious'
    if any(word in text for word in ['fort', 'palace']): return 'Historical'
    if any(word in text for word in ['waterfall', 'hill', 'mountain']): return 'Nature'
    if any(word in text for word in ['beach', 'coast']): return 'Beach'
    if any(word in text for word in ['zoo', 'garden']): return 'Recreational'
    return 'Other'

# 🔄 Load CSV Data into SQLite (using existing image links)
def load_csv_to_sqlite():
    if not os.path.exists('data/cleaned_TRP1.csv'):
        print("❌ CSV file not found at 'data/cleaned_TRP1.csv'")
        return

    print("✅ CSV file found. Proceeding to load.")
    conn = sqlite3.connect('travel.db')

    try:
        df = pd.read_csv('data/cleaned_TRP1.csv')

        # 🔠 Add 'Type' column based on inference
        df['Type'] = df['Place'].apply(infer_type)

        # ✅ Ensure 'image' column is used from CSV directly (already provided)
        if 'image' not in df.columns:
            print("❌ 'image' column is missing in your CSV. Please check.")
            return

        # 🚀 Save data to SQLite
        df.to_sql('places', conn, if_exists='replace', index=False)
        print("✅ CSV data with existing images loaded into 'places' table.")
    except Exception as e:
        print(f"❌ Error loading CSV to SQLite: {e}")
    finally:
        conn.close()

# 🛠️ Create Users Table
def create_users_table():
    conn = sqlite3.connect('travel.db')
    try:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            );
        ''')
        conn.commit()
        print("✅ 'users' table created or already exists.")
    except Exception as e:
        print(f"❌ Error creating users table: {e}")
    finally:
        conn.close()

# 🛠️ Create Favorites Table
def create_favorites_table():
    conn = sqlite3.connect('travel.db')
    try:
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
        print("✅ 'favorites' table created or already exists.")
    except Exception as e:
        print(f"❌ Error creating favorites table: {e}")
    finally:
        conn.close()

# 🚀 Main runner
if __name__ == '__main__':
    create_users_table()
    create_favorites_table()
    load_csv_to_sqlite()

    conn = sqlite3.connect('travel.db')
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        print("📦 Tables in travel.db:", cursor.fetchall())
    finally:
        conn.close()
