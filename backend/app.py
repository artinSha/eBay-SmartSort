from dotenv import load_dotenv, find_dotenv
import os
from pymongo import MongoClient
from flask import Flask, request
from werkzeug.security import check_password_hash, generate_password_hash
from flask_cors import CORS
from ebay_api import get_items, get_item_by_id
import secrets
from datetime import datetime, timedelta, timezone


app = Flask(__name__)
CORS(app, supports_credentials=True)

load_dotenv(find_dotenv())

connection_uri = os.environ.get("MONGODB_URI")

client = MongoClient(connection_uri)

#Find the proper database and the collection I want (users)
Database = client["Database1"]
users_collection = Database["users"]

#Storage of sessions, in memory
session_dict = {
    # 'sessionId': {
    #         'expiryDate': '<date>',
    #         'email': '<email>'
    #     }
       
} 

@app.route("/login", methods = ["POST"])
def login():
    data = request.get_json()
    email = data["email"]
    password = data["password"]
    
    #This is checked on the frontend, but check it here too
    if email == '' or password == '':
        return {"error": "One or more fields are missing"}, 400

    user = users_collection.find_one({"email": email})

    #Make sure user exists
    if not user:
        return {"error": "User not found"}, 401
    
    if not check_password_hash(user["password"], password):
        return {"error": "Incorrect password"}, 400

    #Using python's 'secrets' module
    sessionId = secrets.token_urlsafe()

    expiryDate = datetime.now(timezone.utc) + timedelta(minutes = 30)

    session_dict[sessionId] = {"expiryDate": expiryDate, "email": email}

    return {'message': 'User authentication successful', 'sessionId': sessionId}, 200


@app.route("/signup", methods = ["POST"])
def signup():
    data = request.get_json()
    email = data["email"]
    password = data["password"]

    #This is checked on the frontend, but check it here too
    if email == '' or password == '':
        return {"error": "One or more fields are missing"}, 400

    #Make sure user doesn't already exist
    if users_collection.find_one({"email": email}):
        return {"error": "Email already exists"}, 400

    password_hash = generate_password_hash(password)

    user = {
        "email": email,
        "password": password_hash,
        "savedItems": []
    }

    users_collection.insert_one(user)
    return {"message": "User created"}, 200


@app.route("/fetchlist", methods = ["POST"])
def fetch_list():
    data = request.get_json()
    query = data["query"]
    limit = data["limit"]

    x = get_items(query, limit)

    items = x.json()["itemSummaries"]

    return items, x.status_code




@app.route("/validatesession", methods = ["POST"])
def validate_session():
    data = request.get_json()
    sessionId = data["sessionId"]

    if sessionId not in session_dict:
        return {"error": "No such session"}, 400
    
    if datetime.now(timezone.utc) > session_dict[sessionId]['expiryDate']:
        return {"error": "Session timed out"}, 400
    
    return {"message": "Session valid"}, 200


@app.route("/getemail", methods = ["POST"])
def get_email():
    data = request.get_json()
    sessionId = data["sessionId"]

    if sessionId not in session_dict:
        return {"error": "No such session"}, 400

    email = session_dict[sessionId]['email']
    return {"email": email}, 200


@app.route("/getsaveditems", methods=["POST"])
def get_saved_items():
    data = request.get_json()
    email = data["email"]

    user = users_collection.find_one({"email": email})    

    if not user:
        return {"error": "User not found"}, 401

    userItemIds = user["savedItems"]

    userSavedItemsList = []
    for id in userItemIds:
        item = get_item_by_id(id)
        tempDict = item["image"]
        del tempDict["height"]
        del tempDict["width"]
        userSavedItemsList.append(item)

    return {"userItems": userSavedItemsList}, 200


@app.route("/saveitem", methods = ["POST"])
def save_item():
    data = request.get_json()
    email = data["email"]
    item_id = data["id"]

    users_collection.update_one(
        {"email": email},
        {"$addToSet": {"savedItems": item_id}}  # Ensures no duplicates
    )

    return {"message": "Item added to saved items"}, 200

@app.route("/deleteitem", methods = ['POST'])
def delete_item():
    data = request.get_json()
    email = data["email"]
    item_id = data["id"]

    users_collection.update_one(
        {"email": email},
        {"$pull": {"savedItems": item_id}} #MongoDB method for removing from an array
    )

    return {"message": "Item removed from saved items"}, 200

if __name__ == "__main__":
    app.run(debug = True)
