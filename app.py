# from argparse import MetavarTypeHelpFormatter
# from audioop import add
# import json
# from pydoc import doc
# from xmlrpc.server import DocXMLRPCRequestHandler
# from bson import ObjectId
# from unittest import result
from selectors import EpollSelector
from flask import Flask, render_template, jsonify
from flask_pymongo import PyMongo

#################################################
# Database Setup
#################################################

app = Flask(__name__)

# set up mongo connection

app.config["MONGO_URI"] = "mongodb://localhost:27017/midland_property_info"
mongo = PyMongo(app)

#################################################
# Flask Routes
#################################################

@ app.route("/")
def index():
    # homepage
    return render_template("index.html")

# {
#     "_id": {
#         "$oid": "61e60f8d68822cfcae1f4fb3"
#     },
#     "owner": "PORTER STEPHEN RAY",
#     "address_1": "5401 S COUNTY RD 1140MIDLAND, TX 79706",
#     "address_2": "COUNTY RD 01140 5401 S",
#     "city": "MIDLAND",
#     "state": "TEXAS",
#     "full_address": "COUNTY RD 01140   5401   S MIDLAND, TEXAS",
#     "2021_building_value": 55950,
#     "2021_land_value": 58920,
#     "2021_total_value": 114870,
#     "land_acre": 4.91,
#     "land_sqft": 213880,
#     "est_tax": 1613.89,
#     "total_sqft": 1032,
#     "$_per_building_sqft": 54.2,
#     "$_per_total_value_sqft": 111.3,
#     "lat": 32.0031271,
#     "lng": -102.0656771
# }

@ app.route("/<userInput>")
def load_database(userInput):
    userInput = str(userInput)
    documents = mongo.db.properties.find()
    
    
    query_list = []
    for doc in documents:
        marker_dictionary = {}
        marker_dictionary['lat'] = doc['lat']
        marker_dictionary['lng']=doc['lng']
        marker_dictionary['intensity']=doc['$_per_building_sqft']
        marker_dictionary['address_2']= doc['address_2']

    # for q_doc in document_query:
    #     marker_dictionary['query_lat'] = q_doc['lat']
    #     marker_dictionary['query_lng'] = q_doc['lng']


        query_list.append(marker_dictionary)
    
    # the return to front-end needs to be a list of dictionaries

    # or maybe (havent tested this) a dictionary with two lists. 
    # # list 1) the solo marker matching the address query
    # # list 2) all of the address lat/lng/$_per_sqFT to make the heatmap
    return jsonify(query_list)


if __name__ == "__main__":
    app.debug = True
    app.run()
