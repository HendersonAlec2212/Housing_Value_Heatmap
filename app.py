# from argparse import MetavarTypeHelpFormatter
# from audioop import add
# import json
# from pydoc import doc
# from xmlrpc.server import DocXMLRPCRequestHandler
# from bson import ObjectId
# from unittest import result
from flask import Flask, render_template, jsonify
from flask_pymongo import PyMongo

#################################################
# Database Setup
#################################################

app = Flask(__name__)

# set up mongo connection

app.config["MONGO_URI"] = "mongodb://localhost:27017/address_midland"
mongo = PyMongo(app)

#################################################
# Flask Routes
#################################################

@ app.route("/")
def index():
    # homepage
    return render_template("index.html")



@ app.route("/<userInput>")
def load_database(userInput):
    query_dictionary = {}
    userInput = str(userInput)
    documents = mongo.db.houses.find()
    # using list comprehension
    query_list = []
    for doc in documents:
        marker_dictionary = {}
        marker_dictionary['lat'] = doc['lat']
        marker_dictionary['lng']=doc['lng']
        marker_dictionary['intensity']=doc['count']
        query_list.append(marker_dictionary)
    
    # the return to front-end needs to a list of dictionaries
    # or maybe (havent tested this) a dictionary with two lists. 
    # # list 1) the solo marker matching the address query
    # # list 2) all of the address lat/lng/$_per_sqFT to make the heatmap
    return jsonify(query_list)


if __name__ == "__main__":
    app.run()
