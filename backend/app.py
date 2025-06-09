from flask import Flask, request, jsonify, send_from_directory
import pandas as pd
import sqlite3
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
from flask_cors import CORS
import os
import uuid
from datetime import datetime
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)

app.config['JWT_SECRET_KEY'] = 'your-secret-key'
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# --- UPDATED: Use the new CSV file with budget category ---
CSV_PATH = "data/cleaned_TRP1_with_budget.csv"
DB_PATH = "travel.db"

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'jfif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

vectorizer = None
tfidf_matrix = None
df_places_global = None


def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def infer_type(place_name):
    place_name = place_name.lower()
    hill_keywords = ['manali', 'leh', 'darjeeling', 'nainital', 'ooty', 'mussoorie', 'shimla', 'mountains', 'trekking', 'snow', 'himalayan', 'hill station', 'hills', 'valley', 'peak', 'altitude', 'cold', 'scenic', 'nature', 'landscape', 'viewpoint', 'resort', 'skiing', 'paragliding', 'adventure']
    beach_keywords = ['goa', 'pondicherry', 'kanyakumari', 'kovalam', 'alibaug', 'coast', 'sea', 'sand', 'ocean', 'beach', 'shores', 'water', 'sun', 'relax', 'swimming', 'watersports', 'islands', 'coastal']
    heritage_keywords = ['hampi', 'udaipur', 'jaipur', 'mysore', 'agra', 'delhi', 'khajuraho', 'fort', 'palace', 'historical', 'ancient', 'monument', 'heritage', 'ruins', 'architecture', 'old city', 'temple', 'museum', 'culture', 'history', 'royal', 'dynasty', 'archaeological']
    religious_keywords = ['varanasi', 'rameshwaram', 'tirupati', 'shirdi', 'ayodhya', 'temple', 'pilgrimage', 'spiritual', 'holy', 'religious', 'shrine', 'mosque', 'church', 'gurudwara', 'ashram', 'sacred', 'devotion', 'faith']
    adventure_keywords = ['rishikesh', 'auli', 'spiti', 'gulmarg', 'rafting', 'skiing', 'paragliding', 'bungee', 'adventure', 'trek', 'hiking', 'camping', 'wildlife', 'safari', 'jungle', 'forest', 'thrill', 'sports', 'outdoor']
    city_keywords = ['mumbai', 'delhi', 'chennai', 'kolkata', 'bangalore', 'hyderabad', 'pune', 'ahmedabad', 'chandigarh', 'urban', 'metropolitan', 'shopping', 'business', 'nightlife', 'modern', 'bustling', 'city life', 'foodie', 'entertainment']

    if any(word in place_name for word in hill_keywords):
        return 'Hill Station'
    elif any(word in place_name for word in beach_keywords):
        return 'Beach'
    elif any(word in place_name for word in heritage_keywords):
        return 'Heritage'
    elif any(word in place_name for word in religious_keywords):
        return 'Religious'
    elif any(word in place_name for word in adventure_keywords):
        return 'Adventure'
    elif any(word in place_name for word in city_keywords):
        return 'City'
    else:
        return 'Other'

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def initialize_database():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS places (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            Place TEXT,
            State TEXT,
            City TEXT,
            place_desc TEXT,
            Ratings REAL,
            Type TEXT,
            Image TEXT,
            single_image TEXT,
            average_rating REAL DEFAULT 0.0,
            -- --- NEW: Add Budget_Category column ---
            Budget_Category TEXT
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            username TEXT UNIQUE,
            password TEXT,
            email TEXT,
            is_premium BOOLEAN DEFAULT FALSE
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS favorites (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            username TEXT,
            place_name TEXT,
            state TEXT,
            UNIQUE (username, place_name, state)
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            place_name TEXT NOT NULL,
            user_username TEXT NOT NULL,
            rating INTEGER NOT NULL,
            review_text TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_username) REFERENCES users(username),
            UNIQUE (user_username, place_name)
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS review_photos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            review_id INTEGER NOT NULL,
            photo_url TEXT NOT NULL,
            uploaded_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_activity (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_username TEXT NOT NULL,
            place_id INTEGER,
            activity_type TEXT NOT NULL,
            timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
            search_query TEXT,
            rating_feedback INTEGER,
            FOREIGN KEY (user_username) REFERENCES users(username),
            FOREIGN KEY (place_id) REFERENCES places(id)
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_preferences (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_username TEXT NOT NULL UNIQUE,
            preferred_travel_style TEXT,
            preferred_budget TEXT,
            preferred_types TEXT,
            FOREIGN KEY (user_username) REFERENCES users(username)
        )
    """)


    cursor.execute("SELECT COUNT(*) FROM places")
    count = cursor.fetchone()[0]

    if count == 0:
        print(f"⏳ Populating 'places' table from {CSV_PATH}...")
        # --- IMPORTANT: Ensure the CSV_PATH points to the CSV with the new Budget_Category column ---
        df_csv = pd.read_csv(CSV_PATH)
        df_csv['Type'] = df_csv['Place_desc'].apply(infer_type) # Re-infer type just in case, or ensure it's in CSV
        df_csv['average_rating'] = df_csv['Ratings']
        
        # --- Ensure 'Budget_Category' column exists in the DataFrame loaded from CSV ---
        if 'Budget_Category' not in df_csv.columns:
            print("ERROR: 'Budget_Category' column not found in the CSV. Please run 'add_budget_column.py' first and ensure the CSV is updated.")
            return # Exit or handle error

        for _, row in df_csv.iterrows():
            cursor.execute("""
                INSERT INTO places (Place, State, City, place_desc, Ratings, Type, Image, single_image, average_rating, Budget_Category)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    row['Place'], row['State'], row['City'],
                    row['Place_desc'],
                    row['Ratings'], row['Type'], row['image'], row['single_image'], row['Ratings'],
                    row['Budget_Category'] # --- NEW: Insert Budget_Category ---
                ))
        conn.commit()
        print("✅ 'places' table populated.")
    else:
        print("✅ 'places' table already populated.")

    conn.close()

    global df_places_global, vectorizer, tfidf_matrix
    conn_ml = get_db_connection()
    df_places_global = pd.read_sql_query("SELECT * FROM places", conn_ml)
    conn_ml.close()

    if df_places_global.empty:
        print("WARNING: df_places_global is empty. ML recommendations might not work.")
        return

    df_places_global['place_desc'] = df_places_global['place_desc'].fillna('')
    df_places_global['Type'] = df_places_global['Type'].fillna('')
    df_places_global['Place'] = df_places_global['Place'].fillna('')
    df_places_global['City'] = df_places_global['City'].fillna('')
    df_places_global['State'] = df_places_global['State'].fillna('')
    df_places_global['Budget_Category'] = df_places_global['Budget_Category'].fillna('Medium') # Default if empty

    df_places_global['combined_features'] = df_places_global['Place'] + ' ' + \
                                            df_places_global['City'] + ' ' + \
                                            df_places_global['State'] + ' ' + \
                                            df_places_global['Type'] + ' ' + \
                                            df_places_global['place_desc'] + ' ' + \
                                            df_places_global['Budget_Category'] # --- NEW: Add Budget_Category to combined_features ---

    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(df_places_global['combined_features'])
    print(f"✅ TF-IDF model initialized globally. Matrix shape: {tfidf_matrix.shape}")
    print("Columns in dataset:", df_places_global.columns.tolist())
    print("Columns with repr:", [repr(col) for col in df_places_global.columns])

@app.route('/')
def home():
    return "Hello, Flask is running!"

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/api/places/<place_name>', methods=['GET'])
@jwt_required(optional=True)
def get_place_details_by_name(place_name):
    conn = get_db_connection()
    place_row = conn.execute("SELECT * FROM places WHERE Place = ?", (place_name,)).fetchone()
    conn.close()

    if place_row:
        place_data = dict(place_row)
        current_identity = get_jwt_identity()
        if current_identity:
            _log_activity_internal(current_identity, place_data['id'], 'view')
        return jsonify(place_data), 200
    else:
        return jsonify({"message": "Place not found"}), 404

@app.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    username = get_jwt_identity()
    conn = get_db_connection()

    user_row = conn.execute("SELECT email FROM users WHERE username = ?", (username,)).fetchone()
    email = user_row['email'] if user_row else None

    user_data = {
        "name": username.title(),
        "email": email,
    }

    activity_cursor = conn.execute("""
        SELECT
            ua.activity_type,
            p.Place,
            p.City,
            p.State,
            ua.timestamp,
            ua.search_query,
            ua.rating_feedback
        FROM user_activity ua
        LEFT JOIN places p ON ua.place_id = p.id
        WHERE ua.user_username = ?
        ORDER BY ua.timestamp DESC
        LIMIT 10
    """, (username,))
    user_data["recent_activity"] = [dict(row) for row in activity_cursor.fetchall()]

    preferences_cursor = conn.execute("SELECT * FROM user_preferences WHERE user_username = ?", (username,))
    preferences_row = preferences_cursor.fetchone()
    user_data["preferences"] = dict(preferences_row) if preferences_row else {}

    favorites_cursor = conn.execute("SELECT place_name FROM favorites WHERE username = ?", (username,))
    user_data["favorites"] = [row['place_name'] for row in favorites_cursor.fetchall()]
    
    conn.close()

    return jsonify(user_data)


@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    state_filter = data.get("state", "").lower()
    city_filter = data.get("city", "").lower()
    type_filter = data.get("type", "").lower()

    print(f"\n--- Recommendation Request (Basic Filter) ---")
    print(f"Filters received: State='{state_filter}', City='{city_filter}', Type='{type_filter}'")

    conn = get_db_connection()
    df_places = pd.read_sql_query("SELECT * FROM places", conn)
    conn.close()

    if df_places.empty:
        print("WARNING: No places found in the database. Check database initialization.")
        return jsonify([]), 200

    if 'id' not in df_places.columns or df_places['id'].dtype != 'int64':
        print(f"Casting 'id' column from {df_places['id'].dtype} to int64.")
        df_places['id'] = df_places['id'].astype(int)

    df_places['place_desc'] = df_places['place_desc'].fillna('')
    df_places['Type'] = df_places['Type'].fillna('')
    df_places['Place'] = df_places['Place'].fillna('')
    df_places['City'] = df_places['City'].fillna('')
    df_places['State'] = df_places['State'].fillna('')
    df_places['Budget_Category'] = df_places['Budget_Category'].fillna('Medium') # Ensure this is handled for basic

    recommended_place_ids = set()
    N_RECOMMENDATIONS = 20

    current_df = df_places.copy()
    
    if state_filter:
        current_df = current_df[current_df['State'].str.lower() == state_filter]
    if city_filter:
        current_df = current_df[current_df['City'].str.lower() == city_filter]
    if type_filter:
        current_df = current_df[current_df['Type'].str.lower() == type_filter]
    
    print(f"Initial strict filter matches for basic recommend: {len(current_df)} places.")
    
    if not current_df.empty:
        final_results_list = current_df.sort_values(by='average_rating', ascending=False).head(N_RECOMMENDATIONS).to_dict(orient='records')
        print(f"Final number of basic recommendations to return: {len(final_results_list)}")
        return jsonify(final_results_list), 200
    else:
        print("No matches for basic filters. Returning empty.")
        return jsonify([]), 200


@app.route('/api/advanced_recommendations', methods=['POST'])
@jwt_required()
def advanced_recommendations():
    global df_places_global, vectorizer, tfidf_matrix

    username = get_jwt_identity()
    claims = get_jwt()
    is_premium = claims.get('is_premium', False)

    if not is_premium:
        return jsonify({"error": "Access Denied: Premium feature. Please upgrade your account."}), 403

    if df_places_global is None or vectorizer is None or tfidf_matrix is None:
        print("ERROR: ML model components not initialized. Call initialize_database() first.")
        initialize_database() 
        if df_places_global is None or vectorizer is None or tfidf_matrix is None:
            return jsonify({"error": "ML model not ready. Please restart server."}), 500

    data = request.json
    mode = data.get('mode')
    N_RECOMMENDATIONS = 20 

    recommended_places_list = []

    if mode == 'similar_to_place':
        place_id = data.get('place_id') 
        if place_id is not None:
            place_id = int(place_id) 

        print(f"Advanced Recommendation: Mode='similar_to_place', Place ID='{place_id}'")

        if place_id is None:
            return jsonify({"error": "Place ID is required for 'similar_to_place' mode."}), 400

        place_row = df_places_global[df_places_global['id'] == place_id]
        if place_row.empty:
            return jsonify({"error": "Selected place not found."}), 404
        
        idx_in_tfidf_matrix = place_row.index[0] 

        sim_scores = list(enumerate(cosine_similarity(tfidf_matrix[idx_in_tfidf_matrix:idx_in_tfidf_matrix+1], tfidf_matrix)[0]))
        
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        top_similar_indices = [i for i, score in sim_scores[1:N_RECOMMENDATIONS + 1]] 

        for i in top_similar_indices:
            place_data = df_places_global.iloc[i].to_dict()
            recommended_places_list.append(place_data)
            _log_activity_internal(username, place_data['id'], 'recommendation_shown')

        print(f"Found {len(recommended_places_list)} similar places.")

    elif mode == 'discover_by_preference':
        user_preference_text = data.get('preference_text', '').lower()
        print(f"Advanced Recommendation: Mode='discover_by_preference', Preference='{user_preference_text}'")

        if not user_preference_text:
            return jsonify({"error": "Preference text is required for 'discover_by_preference' mode."}), 400

        conn = get_db_connection()
        user_prefs = conn.execute("SELECT * FROM user_preferences WHERE user_username = ?", (username,)).fetchone()
        conn.close()
        
        enhanced_preference_text = user_preference_text
        current_df_for_ml = df_places_global.copy() # Start with full dataset for ML

        # --- NEW: Filter by preferred budget if set ---
        if user_prefs and user_prefs['preferred_budget']:
            preferred_budget = user_prefs['preferred_budget'].lower()
            if preferred_budget == 'low':
                # Include 'Low' and 'Medium' places for 'Low' preference
                current_df_for_ml = current_df_for_ml[current_df_for_ml['Budget_Category'].str.lower().isin(['low', 'medium'])]
                enhanced_preference_text += " low budget affordable "
            elif preferred_budget == 'medium':
                # Include 'Low', 'Medium', 'High' for 'Medium' preference (broader)
                current_df_for_ml = current_df_for_ml[current_df_for_ml['Budget_Category'].str.lower().isin(['low', 'medium', 'high'])]
                enhanced_preference_text += " mid-range budget "
            elif preferred_budget == 'high':
                # Include 'Medium' and 'High' places for 'High' preference
                current_df_for_ml = current_df_for_ml[current_df_for_ml['Budget_Category'].str.lower().isin(['medium', 'high'])]
                enhanced_preference_text += " high-end luxury expensive "
            print(f"Applied budget filter: {preferred_budget}. Remaining places for ML: {len(current_df_for_ml)}")
            
            # If no places match the budget filter, return empty
            if current_df_for_ml.empty:
                print("No places match the selected budget filter.")
                return jsonify([]), 200


        if user_prefs:
            if user_prefs['preferred_travel_style']:
                enhanced_preference_text += " " + user_prefs['preferred_travel_style']
            if user_prefs['preferred_types']:
                enhanced_preference_text += " " + user_prefs['preferred_types'].replace(',', ' ')

        print(f"Enhanced preference text (with user prefs): {enhanced_preference_text}")

        # Re-vectorize only the filtered DataFrame for cosine similarity
        # This ensures similarity is calculated only among relevant budget places
        if current_df_for_ml.empty: # Double-check after adding more text, though unlikely to be empty if above check passed
             return jsonify([]), 200

        # Ensure 'combined_features' is up-to-date for the filtered DataFrame
        current_df_for_ml['combined_features'] = current_df_for_ml['Place'] + ' ' + \
                                                current_df_for_ml['City'] + ' ' + \
                                                current_df_for_ml['State'] + ' ' + \
                                                current_df_for_ml['Type'] + ' ' + \
                                                current_df_for_ml['place_desc'] + ' ' + \
                                                current_df_for_ml['Budget_Category']

        # Fit transform only if vectorizer hasn't seen these features, or transform
        # For consistency, we'll transform using the globally fitted vectorizer
        # This means the vocabulary is fixed, which is generally good for consistent similarity scores
        filtered_tfidf_matrix = vectorizer.transform(current_df_for_ml['combined_features'])
        user_tfidf = vectorizer.transform([enhanced_preference_text])

        cosine_similarities = cosine_similarity(user_tfidf, filtered_tfidf_matrix)[0]

        sim_scores = list(enumerate(cosine_similarities))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        
        top_indices_in_filtered_df = [i for i, score in sim_scores[:N_RECOMMENDATIONS]]

        # Map back to original df_places_global indices to get the actual place data
        # Use .iloc to get rows by position in the *filtered* DataFrame
        for i in top_indices_in_filtered_df:
            place_data = current_df_for_ml.iloc[i].to_dict()
            recommended_places_list.append(place_data)
            _log_activity_internal(username, place_data['id'], 'recommendation_shown')
        
        print(f"Found {len(recommended_places_list)} places matching preference.")

    else:
        return jsonify({"error": "Invalid recommendation mode."}), 400

    recommended_places_list.sort(key=lambda x: (x['average_rating'] if x['average_rating'] is not None else 0.0, x.get('Place', '')), reverse=True)

    return jsonify(recommended_places_list), 200


@app.route('/api/search', methods=['GET'])
@jwt_required(optional=True)
def search_places():
    query = request.args.get('q', '').strip()
    state = request.args.get('state', '').strip()
    city = request.args.get('city', '').strip()
    type_ = request.args.get('type', '').strip()
    min_rating = request.args.get('min_rating', type=float)

    print(f"\n--- Search Request ---")
    print(f"Query parameters: q='{query}', state='{state}', city='{city}', type='{type_}', min_rating='{min_rating}'")

    conn = get_db_connection()
    
    base_query = "SELECT * FROM places WHERE 1=1"
    params = []

    if query:
        base_query += """
            AND (
                LOWER(Place) LIKE ? OR
                LOWER(City) LIKE ? OR
                LOWER(State) LIKE ? OR
                LOWER(place_desc) LIKE ? OR
                LOWER(Type) LIKE ?
            )
        """
        search_term = f"%{query.lower()}%"
        params.extend([search_term] * 5)
        print(f"Added query condition: {search_term}")

    if state:
        base_query += " AND LOWER(State) LIKE ?"
        params.append(f"%{state.lower()}%")
        print(f"Added state condition: {state.lower()}")
    
    if city:
        base_query += " AND LOWER(City) LIKE ?"
        params.append(f"%{city.lower()}%")
        print(f"Added city condition: {city.lower()}")
    
    if type_:
        base_query += " AND LOWER(Type) LIKE ?"
        params.append(f"%{type_.lower()}%")
        print(f"Added type condition: {type_.lower()}")

    if min_rating is not None:
        base_query += " AND average_rating >= ?"
        params.append(min_rating)
        print(f"Added min_rating condition: {min_rating}")

    base_query += " ORDER BY average_rating DESC, Place ASC"

    print(f"Final SQL Query: {base_query}")
    print(f"Query Parameters: {params}")

    cursor = conn.execute(base_query, params)
    results = [dict(row) for row in cursor.fetchall()]
    conn.close()

    print(f"Number of search results found: {len(results)}")
    
    current_identity = get_jwt_identity()
    if current_identity:
        _log_activity_internal(current_identity, None, 'search', search_query=query)

    return jsonify(results), 200


@app.route('/inferred-types', methods=['GET'])
def get_inferred_types():
    state = request.args.get('state', '').lower()
    city = request.args.get('city', '').lower()

    conn = get_db_connection()
    descriptions = []

    if state and state != 'all':
        query = "SELECT Place_desc FROM places WHERE lower(State) = ?"
        params = [state]
        if city:
            query += " AND lower(City) = ?"
            params.append(city)
        cursor = conn.execute(query, params)
        descriptions = [row['Place_desc'] for row in cursor.fetchall()]
    else:
        cursor = conn.execute("SELECT Place_desc FROM places")
        descriptions = [row['Place_desc'] for row in cursor.fetchall()]
    
    conn.close()

    inferred_types = {infer_type(desc) for desc in descriptions}
    return jsonify(sorted(list(inferred_types)))

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data['username']
    password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    email = data.get('email')

    conn = get_db_connection()
    try:
        conn.execute("INSERT INTO users (username, password, email, is_premium) VALUES (?, ?, ?, FALSE)", 
                     (username, password, email))
        conn.commit()
    except sqlite3.IntegrityError:
        return jsonify({"msg": "Username already exists"}), 400
    finally:
        conn.close()

    return jsonify({"msg": "User registered successfully"}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']

    conn = get_db_connection()
    user = conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
    conn.close()

    if user and bcrypt.check_password_hash(user['password'], password):
        access_token = create_access_token(identity=username, additional_claims={"is_premium": bool(user['is_premium'])})
        return jsonify(access_token=access_token)

    return jsonify({"msg": "Invalid credentials"}), 401

@app.route('/api/upgrade_premium', methods=['POST'])
@jwt_required()
def upgrade_premium():
    username = get_jwt_identity()
    conn = get_db_connection()
    try:
        conn.execute("UPDATE users SET is_premium = TRUE WHERE username = ?", (username,))
        conn.commit()
        user = conn.execute("SELECT is_premium FROM users WHERE username = ?", (username,)).fetchone()
        new_access_token = create_access_token(identity=username, additional_claims={"is_premium": bool(user['is_premium'])})
        return jsonify({"msg": "Account upgraded to premium!", "access_token": new_access_token}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": f"Failed to upgrade account: {str(e)}"}), 500
    finally:
        conn.close()


@app.route('/favorite', methods=['POST'])
@jwt_required()
def add_favorite():
    username = get_jwt_identity()
    data = request.json
    place_name = data.get('place_name')
    state = data.get('state')

    conn = get_db_connection()
    try:
        # Check if already in favorites
        cursor = conn.execute(
            'SELECT 1 FROM favorites WHERE username = ? AND place_name = ? AND state = ?',
            (username, place_name, state)
        )
        exists = cursor.fetchone()

        if exists:
            return jsonify({"msg": "Already added", "already_added": True}), 200

        # If not exists, insert it
        conn.execute(
            'INSERT INTO favorites (username, place_name, state) VALUES (?, ?, ?)',
            (username, place_name, state)
        )
        conn.commit()
        return jsonify({"msg": "Favorite added", "already_added": False}), 200

    finally:
        conn.close()


@app.route('/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    username = get_jwt_identity()
    conn = get_db_connection()
    cursor = conn.execute('SELECT place_name, state FROM favorites WHERE username = ?', (username,))
    results = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(results)

@app.route('/favorites', methods=['DELETE'])
@jwt_required()
def delete_favorite():
    username = get_jwt_identity()
    data = request.get_json()
    place_name = data.get('place_name')
    state = data.get('state')

    if not place_name or not state:
        return jsonify({"msg": "Place name and state are required"}), 400

    conn = get_db_connection()
    conn.execute(
        'DELETE FROM favorites WHERE username = ? AND place_name = ? AND state = ?',
        (username, place_name, state)
    )
    conn.commit()
    conn.close()

    return jsonify({"msg": "Favorite removed"}), 200

@app.route('/places', methods=['GET'])
def get_places():
    conn = get_db_connection()
    cursor = conn.execute('SELECT * FROM places')
    results = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(results)


@app.route('/states', methods=['GET'])
def get_states():
    conn = get_db_connection()
    cursor = conn.execute("SELECT DISTINCT State FROM places")
    states = sorted([row['State'] for row in cursor.fetchall()])
    conn.close()
    return jsonify(states)


@app.route('/cities', methods=['GET'])
def get_cities():
    selected_state = request.args.get('state')
    if not selected_state:
        return jsonify([])

    conn = get_db_connection()
    cursor = conn.execute("SELECT DISTINCT City FROM places WHERE lower(State) = ?", (selected_state.lower(),))
    cities = [row['City'] for row in cursor.fetchall()]
    conn.close()

    return jsonify(sorted(cities))

@app.route('/api/acknowledgement', methods=['GET'])
def get_acknowledgement():
    data = {
        "title": "Respect for Cultural Heritage",
        "message": "We honour the diverse cultures, traditions, and spiritual heritage of India. From the sacred peaks of the Himalayas to the coastal temples of the South, we recognize the guardianship of our rich history, nature, and communities across every region of this vibrant land.",
        "link": "#"
    }
    return jsonify(data)


@app.route('/reviews', methods=['POST'])
@jwt_required()
def add_review():
    username = get_jwt_identity()
    
    place_name = request.form.get('place_name')
    rating = request.form.get('rating', type=int)
    review_text = request.form.get('review_text')
    files = request.files.getlist('photos')

    if not place_name or not rating:
        return jsonify({'msg': 'Place name and rating are required'}), 400
    if not (1 <= rating <= 5):
        return jsonify({'msg': 'Rating must be an integer between 1 and 5'}), 400

    conn = get_db_connection()
    try:
        cursor = conn.execute(
            'SELECT id FROM reviews WHERE user_username = ? AND place_name = ?',
            (username, place_name)
        )
        existing_review = cursor.fetchone()

        if existing_review:
            review_id = existing_review['id']
            conn.execute(
                'UPDATE reviews SET rating = ?, review_text = ?, created_at = CURRENT_TIMESTAMP WHERE id = ?',
                (rating, review_text, review_id)
            )
            conn.execute('DELETE FROM review_photos WHERE review_id = ?', (review_id,))
        else:
            cursor = conn.execute(
                'INSERT INTO reviews (user_username, place_name, rating, review_text) VALUES (?, ?, ?, ?)',
                (username, place_name, rating, review_text)
            )
            review_id = cursor.lastrowid

        uploaded_photo_urls = []
        for file in files:
            if file and allowed_file(file.filename):
                filename = str(uuid.uuid4()) + '.' + file.filename.rsplit('.', 1)[1].lower()
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                photo_url = f'/uploads/{filename}'
                
                conn.execute(
                    'INSERT INTO review_photos (review_id, photo_url) VALUES (?, ?)',
                    (review_id, photo_url)
                )
                uploaded_photo_urls.append(photo_url)
            else:
                print(f"Skipping invalid file: {file.filename if file else 'None'}")

        conn.commit()

        avg_cursor = conn.execute(
            'SELECT AVG(rating) FROM reviews WHERE place_name = ?',
            (place_name,)
        )
        new_average_rating = avg_cursor.fetchone()[0]
        if new_average_rating is not None:
            new_average_rating = round(new_average_rating, 1)
        else:
            new_average_rating = 0.0

        conn.execute(
            'UPDATE places SET average_rating = ? WHERE Place = ?',
            (new_average_rating, place_name)
        )
        conn.commit()

        return jsonify({
            'msg': 'Review added/updated successfully',
            'review_id': review_id,
            'uploaded_photos': uploaded_photo_urls,
            'new_average_rating': new_average_rating
        }), 200

    except sqlite3.IntegrityError as e:
        conn.rollback()
        return jsonify({'msg': 'Database error: ' + str(e)}), 500
    except Exception as e:
        conn.rollback()
        print(f"Error adding review: {e}")
        return jsonify({'msg': 'Failed to add review', 'error': str(e)}), 500
    finally:
        conn.close()


@app.route('/reviews', methods=['GET'])
def get_reviews():
    place_name = request.args.get('place_name')

    if not place_name:
        return jsonify({'msg': 'Place name is required'}), 400

    conn = get_db_connection()
    cursor = conn.execute(
        """
        SELECT
            r.id,
            r.user_username,
            r.rating,
            r.review_text,
            r.created_at,
            GROUP_CONCAT(rp.photo_url) AS photo_urls
        FROM reviews r
        LEFT JOIN review_photos rp ON r.id = rp.review_id
        WHERE r.place_name = ?
        GROUP BY r.id
        ORDER BY r.created_at DESC
        """,
        (place_name,)
    )
    
    results = []
    for row in cursor.fetchall():
        review_data = dict(row)
        review_data['photos'] = review_data['photo_urls'].split(',') if review_data['photo_urls'] else []
        del review_data['photo_urls']

        review_data['username'] = review_data['user_username']
        del review_data['user_username']
        
        results.append(review_data)
    
    conn.close()

    return jsonify(results), 200

def _log_activity_internal(username, place_id, activity_type, search_query=None, rating_feedback=None):
    conn = get_db_connection()
    try:
        conn.execute(
            """
            INSERT INTO user_activity (user_username, place_id, activity_type, search_query, rating_feedback)
            VALUES (?, ?, ?, ?, ?)
            """,
            (username, place_id, activity_type, search_query, rating_feedback)
        )
        conn.commit()
        print(f"Logged activity: User '{username}', Type: '{activity_type}', Place ID: {place_id}, Query: '{search_query}', Feedback: {rating_feedback}")
    except Exception as e:
        print(f"Error logging activity for user {username}: {e}")
    finally:
        conn.close()

@app.route('/api/log_activity', methods=['POST'])
@jwt_required()
def log_activity_route():
    username = get_jwt_identity()
    data = request.json
    place_id = data.get('place_id')
    activity_type = data.get('activity_type')
    search_query = data.get('search_query')
    rating_feedback = data.get('rating_feedback')

    _log_activity_internal(username, place_id, activity_type, search_query, rating_feedback)
    return jsonify({"msg": "Activity logged successfully"}), 200


@app.route('/api/user_preferences', methods=['GET'])
@jwt_required()
def get_user_preferences():
    username = get_jwt_identity()
    conn = get_db_connection()
    prefs = conn.execute("SELECT * FROM user_preferences WHERE user_username = ?", (username,)).fetchone()
    conn.close()
    if prefs:
        return jsonify(dict(prefs)), 200
    return jsonify({}), 200

@app.route('/recommend/random', methods=['GET'])
def recommend_random():
    conn = get_db_connection()
    cursor = conn.execute("SELECT * FROM places ORDER BY RANDOM() LIMIT 20")
    rows = cursor.fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])


@app.route('/api/user_preferences', methods=['POST'])
@jwt_required()
def set_user_preferences():
    username = get_jwt_identity()
    data = request.json
    preferred_travel_style = data.get('preferred_travel_style')
    preferred_budget = data.get('preferred_budget')
    preferred_types = data.get('preferred_types')

    conn = get_db_connection()
    try:
        conn.execute("""
            INSERT INTO user_preferences (user_username, preferred_travel_style, preferred_budget, preferred_types)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(user_username) DO UPDATE SET
                preferred_travel_style = EXCLUDED.preferred_travel_style,
                preferred_budget = EXCLUDED.preferred_budget,
                preferred_types = EXCLUDED.preferred_types
            """,
            (username, preferred_travel_style, preferred_budget, preferred_types)
        )
        conn.commit()
        return jsonify({"msg": "Preferences updated successfully!"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": f"Failed to update preferences: {str(e)}"}), 500
    finally:
        conn.close()


if __name__ == '__main__':
    initialize_database()
    app.run(debug=True)
