import sqlite3
import pandas as pd
import os
import requests

def create_users_table():
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

def get_image_url(place_name):
    try:
        url = "https://en.wikipedia.org/w/api.php"
        params = {
            'action': 'query',
            'titles': place_name,
            'prop': 'pageimages',
            'format': 'json',
            'pithumbsize': 500
        }
        response = requests.get(url, params=params)
        data = response.json()
        pages = data['query']['pages']
        for page_id in pages:
            page = pages[page_id]
            if 'thumbnail' in page:
                return page['thumbnail']['source']
    except Exception as e:
        print(f"Error fetching image for {place_name}: {e}")
    return None

def load_csv_to_sqlite():
    conn = sqlite3.connect('travel.db')
    df = pd.read_csv('data/cleaned_TRP1.csv')

    def classify(text):
        text = str(text).lower()
        if any(word in text for word in ['temple', 'church']): return 'Religious'
        if any(word in text for word in ['fort', 'palace']): return 'Historical'
        if any(word in text for word in ['waterfall', 'hill', 'mountain']): return 'Nature'
        if any(word in text for word in ['beach', 'coast']): return 'Beach'
        if any(word in text for word in ['zoo', 'garden']): return 'Recreational'
        return 'Other'

    df['Type'] = df.apply(lambda row: classify(f"{row['Place_desc']} {row['Place']}"), axis=1)

    # 📸 Auto-fetch image for each place
    print("🔍 Fetching images for each place...")
    image_urls = []
    for place in df['Place']:
        image_url = get_image_url(place)
        image_urls.append(image_url if image_url else '')  # fallback empty string

    df['image'] = image_urls
    df.to_sql('places', conn, if_exists='replace', index=False)
    conn.close()
    print("✅ CSV data with images loaded into 'places' table.")

if not os.path.exists('data/cleaned_TRP1.csv'):
    print("❌ CSV file not found at 'data/cleaned_TRP1.csv'")
else:
    print("✅ CSV file found. Proceeding to load.")

if __name__ == '__main__':
    create_users_table()
    load_csv_to_sqlite()
    create_favorites_table()

    conn = sqlite3.connect('travel.db')
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    print("📦 Tables in travel.db:", cursor.fetchall())
    conn.close()
