from argparse import MetavarTypeHelpFormatter
from audioop import add
import json
from pydoc import doc
from xmlrpc.server import DocXMLRPCRequestHandler
from bson import ObjectId
from unittest import result
from flask import Flask, render_template, redirect, jsonify, Response
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

# make the default the heat map with like an entry message or something

# a banner or box that says enter address here /  select address from list / click here to view housing costs
# heat map, that last option doesnt do much for the concept of user input. focus on the address entry
# consider autop complete methods for the address or a drop down list that shows all available address from a list.
@ app.route("/")
def index():
    # homepage
    return render_template("index_geojson.html")



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
    
    # query_dictionary[userInput] = query_list
    # print(f'the query_dictionary key is "{userInput}"')
    return jsonify(query_list)

    



# @ app.route("/<userInput>")
# def load_database(userInput):
#     userInput = str(userInput)
#     documents = mongo.db.houses.find()
#     # using list comprehension
#     listToStr = ' '.join([str(elem) for elem in documents])
    
#     print(listToStr) 
#     return jsonify(listToStr)

    
    


# @ app.route("/<userInput>")
# # goal: make a /selection url that retuen a document from DB == the address queried
# # query address will be used to make one marker that will act as center point of map
# def address_query(userInput):
#     address = str(userInput)

#     app.config["MONGO_URI"] = "mongodb://localhost:27017/addresses_midland"
#     mongo = PyMongo(app)
    
#     address_document = mongo.db.houses.find_one(address)
#     data = mongo.db.houses.find()
#     heatmap_marker_list = []
#     query = {}
#     coordinates_list = []
#     for document in data:
#         heatmap_data = {}
#         heatmap_data['county'] = document[address]
#         # heatmap_data['lat'] = document[address]['lat']
#         # heatmap_data['lng'] = document[address]['lng']
#         # heatmap_data['intensity'] = document['address']['dollar_per_sqft'] # will be the $ per sq/ft value
#         heatmap_marker_list.append(heatmap_data)
    
#     for coordinate in address_document:
#         lat = coordinate['lat']
#         lng = coordinate['lng']
#         coordinates_list.append(lat)
#         coordinates_list.append(lng)

#     query['heat_markers'] = heatmap_marker_list
#     query['coordinates'] = coordinates_list
#     return jsonify(query)


if __name__ == "__main__":
    app.run()
