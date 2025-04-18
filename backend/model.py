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

# Pixabay API - Third Attempt
PIXABAY_API_KEY = "49704917-a3885010338bf51c41d84e64a"

def get_pixabay_image(place_name):
    """Fetch an image from Pixabay API if Google and Wikipedia fail."""
    try:
        url = "https://pixabay.com/api/"
        params = {
            "key": PIXABAY_API_KEY,
            "q": f"{place_name} tourist destination",
            "image_type": "photo",
            "per_page": 1
        }
        response = requests.get(url, params=params, timeout=10)
        data = response.json()
        if "hits" in data and data["hits"]:
            return data["hits"][0]["webformatURL"]
    except requests.exceptions.RequestException as e:
        print(f"❌ Pixabay API error for {place_name}: {e}")

    return None  # If no Pixabay image found

# Pexels API - Fourth Attempt
PEXELS_API_KEY = "xXRDiv0StcQmwYPPLysI3BU8HidGat9Ow1x2oLQvhnqYVn2aPJTdrrVs"

def get_pexels_image(place_name):
    """Fetch an image from Pexels API if other sources fail."""
    try:
        url = f"https://api.pexels.com/v1/search?query={place_name}&per_page=1"
        headers = {"Authorization": PEXELS_API_KEY}
        response = requests.get(url, headers=headers, timeout=10)
        data = response.json()
        if "photos" in data and data["photos"]:
            return data["photos"][0]["src"]["medium"]
    except requests.exceptions.RequestException as e:
        print(f"❌ Pexels API error for {place_name}: {e}")

    return None  # If no Pexels image found

# 📸 Unsplash API - Backup if Wikipedia & Google Fail
UNSPLASH_ACCESS_KEY = "_61ZeXp8VSIW-wDrswOJCiPA0832IbPTO733jAOx4x4"

def get_unsplash_image(place_name):
    """Fetch an image from Unsplash if other sources fail."""
    try:
        url = "https://api.unsplash.com/search/photos"
        params = {
            "query": f"{place_name} travel destination",
            "client_id": UNSPLASH_ACCESS_KEY,
            "per_page": 1
        }
        response = requests.get(url, params=params, timeout=10)
        data = response.json()
        if "results" in data and data["results"]:
            return data["results"][0]["urls"]["regular"]
    except requests.exceptions.RequestException as e:
        print(f"❌ Unsplash API error for {place_name}: {e}")

    return None  # If no Unsplash image found

# Update Missing Images Only
def update_missing_images():
    conn = sqlite3.connect('travel.db')
    cursor = conn.cursor()
    
    cursor.execute("SELECT Place FROM places WHERE image IS NULL OR image = ''")
    missing_places = [row[0] for row in cursor.fetchall()]
    
    print(f"Found {len(missing_places)} places missing images. Fetching now...")
    
    for place in missing_places:
        print(f"Fetching image for: {place}")
        image_url = get_wikipedia_image(place) or get_google_image(place) or get_pixabay_image(place) or get_pexels_image(place) or get_unsplash_image(place) or "https://via.placeholder.com/500?text=No+Image"
        cursor.execute("UPDATE places SET image = ? WHERE Place = ?", (image_url, place))
    
    conn.commit()
    conn.close()
    print("✅ Image fetching and database update completed!")

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

        # df['Type'] = df.apply(lambda row: classify(f"{row['Place_desc']} {row['Place']}"), axis=1)
        # Add a new column by applying the function
            df['Type'] = df['Place'].apply(infer_type)


               # 📸 Fetch images
        print("🔍 Fetching images for each place...")
        image_urls = []
        for i, place in enumerate(df['Place']):
            print(f"Fetching ({i+1}/{len(df)}): {place}")  # Progress tracking
            image_url = get_wikipedia_image(place)  # Try Wikipedia first
            if not image_url:  
                image_url = get_google_image(place)  # Fallback to Google API
            if not image_url:
                image_url = get_pexels_image(place)  # Try Pexels
            if not image_url:
                image_url = get_pixabay_image(place)  # Try Pixabay
            if not image_url:
                image_url = get_unsplash_image(place)  # Unsplash as the last API option
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
    update_missing_images()

    conn = sqlite3.connect('travel.db')
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        print("📦 Tables in travel.db:", cursor.fetchall())
    finally:
        conn.close()


