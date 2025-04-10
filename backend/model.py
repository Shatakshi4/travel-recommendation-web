# import sqlite3
# import pandas as pd
# import os
# import requests

# def create_users_table():
#     conn = sqlite3.connect('travel.db')
#     conn.execute('''
#         CREATE TABLE IF NOT EXISTS users (
#             id INTEGER PRIMARY KEY AUTOINCREMENT,
#             username TEXT UNIQUE NOT NULL,
#             password TEXT NOT NULL
#         );
#     ''')
#     conn.commit()
#     conn.close()
#     print("✅ 'users' table created or already exists.")

# def create_favorites_table():
#     conn = sqlite3.connect('travel.db')
#     conn.execute('''
#         CREATE TABLE IF NOT EXISTS favorites (
#             id INTEGER PRIMARY KEY AUTOINCREMENT,
#             username TEXT,
#             place_name TEXT,
#             state TEXT,
#             UNIQUE(username, place_name)
#         );
#     ''')
#     conn.commit()
#     conn.close()
#     print("✅ 'favorites' table created or already exists.")

# def get_image_url(place_name):
#     try:
#         url = "https://en.wikipedia.org/w/api.php"
#         params = {
#             'action': 'query',
#             'titles': place_name,
#             'prop': 'pageimages',
#             'format': 'json',
#             'pithumbsize': 500
#         }
#         response = requests.get(url, params=params)
#         data = response.json()
#         pages = data['query']['pages']
#         for page_id in pages:
#             page = pages[page_id]
#             if 'thumbnail' in page:
#                 return page['thumbnail']['source']
#     except Exception as e:
#         print(f"Error fetching image for {place_name}: {e}")
#     return None

# def load_csv_to_sqlite():
#     conn = sqlite3.connect('travel.db')
#     df = pd.read_csv('data/cleaned_TRP1.csv')

#     def classify(text):
#         text = str(text).lower()
#         if any(word in text for word in ['temple', 'church']): return 'Religious'
#         if any(word in text for word in ['fort', 'palace']): return 'Historical'
#         if any(word in text for word in ['waterfall', 'hill', 'mountain']): return 'Nature'
#         if any(word in text for word in ['beach', 'coast']): return 'Beach'
#         if any(word in text for word in ['zoo', 'garden']): return 'Recreational'
#         return 'Other'

#     df['Type'] = df.apply(lambda row: classify(f"{row['Place_desc']} {row['Place']}"), axis=1)

#     # 📸 Auto-fetch image for each place
#     print("🔍 Fetching images for each place...")
#     image_urls = []
#     for place in df['Place']:
#         image_url = get_image_url(place)
#         image_urls.append(image_url if image_url else '')  # fallback empty string

#     df['image'] = image_urls
#     df.to_sql('places', conn, if_exists='replace', index=False)
#     conn.close()
#     print("✅ CSV data with images loaded into 'places' table.")

# if not os.path.exists('data/cleaned_TRP1.csv'):
#     print("❌ CSV file not found at 'data/cleaned_TRP1.csv'")
# else:
#     print("✅ CSV file found. Proceeding to load.")

# if __name__ == '__main__':
#     create_users_table()
#     load_csv_to_sqlite()
#     create_favorites_table()

#     conn = sqlite3.connect('travel.db')
#     cursor = conn.cursor()
#     cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
#     print("📦 Tables in travel.db:", cursor.fetchall())
#     conn.close()

import sqlite3
import pandas as pd
import os
import requests

# 🌍 Wikipedia API - First Attempt to Fetch Images
def get_wikipedia_image(place_name):
    """Fetch an image from Wikipedia API."""
    try:
        url = "https://en.wikipedia.org/w/api.php"
        params = {
            'action': 'query',
            'titles': place_name,
            'prop': 'pageimages',
            'format': 'json',
            'pithumbsize': 500
        }
        response = requests.get(url, params=params, timeout=10)
        data = response.json()

        pages = data.get('query', {}).get('pages', {})
        for page_id, page in pages.items():
            if 'thumbnail' in page:
                return page['thumbnail']['source']
    except requests.exceptions.Timeout:
        print(f"⏳ Timeout fetching Wikipedia image for {place_name}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Wikipedia error for {place_name}: {e}")

    return None  # If no Wikipedia image found

# 🔎 Google Custom Search API - Fallback if Wikipedia Fails
GOOGLE_API_KEY = "AIzaSyCpTIfrOsSRi-6Dr2CyQ0O38-T7MWUu4bQ"
CX = "066c86080468640db"

def get_google_image(place_name):
    """Fetch an image using Google Custom Search API (if Wikipedia fails)."""
    search_url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "q": f"{place_name} tourist place",  # More relevant search
        "cx": CX,  
        "key": GOOGLE_API_KEY,  
        "searchType": "image",  
        "num": 1  
    }
    try:
        response = requests.get(search_url, params=params, timeout=10)
        data = response.json()
        if "items" in data:
            return data["items"][0]["link"]  
    except requests.exceptions.Timeout:
        print(f"⏳ Timeout fetching Google image for {place_name}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Google API error for {place_name}: {e}")

    return None  # If no Google image found

# 🔄 Load CSV Data into SQLite
def load_csv_to_sqlite():
    if not os.path.exists('data/cleaned_TRP1.csv'):
        print("❌ CSV file not found at 'data/cleaned_TRP1.csv'")
        return

    print("✅ CSV file found. Proceeding to load.")
    conn = sqlite3.connect('travel.db')

    try:
        df = pd.read_csv('data/cleaned_TRP1.csv')

        # 📌 Classify places into categories
        def classify(text):
            text = str(text).lower()
            if any(word in text for word in ['temple', 'church']): return 'Religious'
            if any(word in text for word in ['fort', 'palace']): return 'Historical'
            if any(word in text for word in ['waterfall', 'hill', 'mountain']): return 'Nature'
            if any(word in text for word in ['beach', 'coast']): return 'Beach'
            if any(word in text for word in ['zoo', 'garden']): return 'Recreational'
            return 'Other'

        df['Type'] = df.apply(lambda row: classify(f"{row['Place_desc']} {row['Place']}"), axis=1)

        # 📸 Fetch images
        print("🔍 Fetching images for each place...")
        image_urls = []
        for i, place in enumerate(df['Place']):
            print(f"Fetching ({i+1}/{len(df)}): {place}")  # Progress tracking
            image_url = get_wikipedia_image(place)  # Try Wikipedia first
            if not image_url:  
                image_url = get_google_image(place)  # Fallback to Google API
            if not image_url:
                image_url = "https://via.placeholder.com/500?text=No+Image"  # Default fallback image
            image_urls.append(image_url)

        df['image'] = image_urls

        # 🚀 Save data to SQLite
        df.to_sql('places', conn, if_exists='replace', index=False)
        print("✅ CSV data with images loaded into 'places' table.")
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

# 🚀 Run the script
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

