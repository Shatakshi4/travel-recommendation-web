from flask import Flask, request, jsonify
import pandas as pd
import sqlite3
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
# from your_database_module import get_user_recommendations, get_user_favorites
import os

app = Flask(__name__)
CORS(app)

app.config['JWT_SECRET_KEY'] = 'your-secret-key'
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

CSV_PATH = "data/cleaned_TRP1.csv"
DB_PATH = "travel.db"

# Load CSV
data = pd.read_csv(CSV_PATH)

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def infer_type(description):
    desc = description.lower()
    if 'beach' in desc:
        return 'Beach'
    elif 'hill' in desc or 'mountain' in desc:
        return 'Hill Station'
    elif 'temple' in desc or 'fort' in desc or 'heritage' in desc:
        return 'Historical Site'
    elif 'forest' in desc or 'wildlife' in desc:
        return 'Nature/Wildlife'
    elif 'lake' in desc or 'river' in desc:
        return 'Waterbody'
    else:
        return 'Other'

def initialize_database():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Create tables
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS places (
            Place TEXT,
            State TEXT,
            City TEXT,
            place_desc TEXT,
            Ratings REAL,
            Type TEXT
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            username TEXT PRIMARY KEY,
            password TEXT
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS favorites (
            username TEXT,
            place_name TEXT,
            state TEXT,
            PRIMARY KEY (username, place_name, state),
            FOREIGN KEY (username) REFERENCES users(username)
        )
    """)

    # Check if places table is empty
    cursor.execute("SELECT COUNT(*) FROM places")
    count = cursor.fetchone()[0]

    if count == 0:
        print("⏳ Populating 'places' table from CSV...")
        data['Type'] = data['place_desc'].apply(infer_type)

        for _, row in data.iterrows():
            cursor.execute("""
                INSERT INTO places (Place, State, City, place_desc, Ratings, Type)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (
                row['Place'], row['State'], row['City'],
                row['place_desc'], row['Ratings'], row['Type']
            ))
        conn.commit()
        print("✅ 'places' table populated.")
    else:
        print("✅ 'places' table already populated.")

    conn.close()


# Function to get recommended places for a user
# def get_recommended_places(user):
#     conn = get_db_connection()
#     cursor = conn.execute("""
#         SELECT p.Place, p.place_desc, p.Ratings, p.Type
#         FROM places p
#         JOIN favorites f ON p.Place = f.place_name
#         WHERE f.username = ?
#     """, (user,))
#     recommended_places = [dict(row) for row in cursor.fetchall()]
#     conn.close()
#     return recommended_places

# Function to get user's favorite places
# def get_favorite_places(user):
#     conn = get_db_connection()
#     cursor = conn.execute("""
#         SELECT p.Place, p.place_desc, p.Ratings, p.Type
#         FROM places p
#         JOIN favorites f ON p.Place = f.place_name
#         WHERE f.username = ?
#     """, (user,))
#     favorite_places = [dict(row) for row in cursor.fetchall()]
#     conn.close()
#     return favorite_places


@app.route('/')
def home():
    return "Hello, Flask is running!"

# @app.route('/user-profile', methods=['GET'])
# @jwt_required()
# def get_user_profile():
#     current_user = get_jwt_identity()  # Get username from the JWT token
#     # Assuming user data is stored in a database or user object
#     conn = get_db_connection()
#     user = conn.execute("SELECT username FROM users WHERE username = ?", (current_user,)).fetchone()
#     conn.close()

#     if user:
#         return jsonify({
#             'name': user['username'],  # You can add more details like email if stored
#             'email': f"{user['username']}@example.com"  # Placeholder email or fetch from DB
#         }), 200
#     else:
#         return jsonify({"msg": "User not found"}), 404


# @app.route('/dashboard', methods=['GET'])
# @jwt_required()
# def get_dashboard_data():
#     current_user = get_jwt_identity()
    
#     # Fetch recommended places for the user
#     recommended_places = get_recommended_places(current_user)

#     # Fetch user's favorite places
#     favorite_places = get_favorite_places(current_user)

#     return jsonify({
#         'recommended': recommended_places,
#         'favorites': favorite_places
#     }), 200

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    state = data.get("state", "").lower()
    city = data.get("city", "").lower()
    type_ = data.get("type", "").lower()

    query = "SELECT * FROM places WHERE 1=1"
    params = []

    if state:
        query += " AND lower(State) LIKE ?"
        params.append(f"%{state}%")
    if city:
        query += " AND lower(City) = ?"
        params.append(city)
    if type_:
        query += " AND lower(Type) = ?"
        params.append(type_)

    query += " LIMIT 10"

    conn = get_db_connection()
    cursor = conn.execute(query, params)
    results = [dict(row) for row in cursor.fetchall()]
    conn.close()

    return jsonify(results)


@app.route('/inferred-types', methods=['GET'])
def get_inferred_types():
    state = request.args.get('state', '').lower()
    city = request.args.get('city', '').lower()

    query = "SELECT place_desc FROM places WHERE lower(State) = ?"
    params = [state]

    if city:
        query += " AND lower(City) = ?"
        params.append(city)

    conn = get_db_connection()
    cursor = conn.execute(query, params)
    descriptions = [row['place_desc'] for row in cursor.fetchall()]
    conn.close()

    inferred_types = {infer_type(desc) for desc in descriptions}
    return jsonify(sorted(list(inferred_types)))


@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data['username']
    password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    conn = get_db_connection()
    try:
        conn.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
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
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token)

    return jsonify({"msg": "Invalid credentials"}), 401


@app.route('/favorite', methods=['POST'])
@jwt_required()
def add_favorite():
    username = get_jwt_identity()
    data = request.json
    place_name = data.get('place_name')
    state = data.get('state')

    conn = get_db_connection()
    try:
        conn.execute('INSERT OR IGNORE INTO favorites (username, place_name, state) VALUES (?, ?, ?)',
                     (username, place_name, state))
        conn.commit()
        return jsonify({"msg": "Favorite added"})
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


if __name__ == '__main__':
    initialize_database()
    app.run(debug=True)
