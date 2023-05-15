from flask import Flask, request, make_response, jsonify, render_template
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask import json

from models import db


app = Flask(
    __name__,
    static_url_path='',
    static_folder='../client/build',
    template_folder='../client/build'
    )

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://dbproject_vbgz_user:O5SqAoFGVLqmjagflvowWdtMaqzwAqIe@dpg-chdrl867avj22bgpac30-a.ohio-postgres.render.com/dbproject_vbgz'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False


# db.create_all()
db.init_app(app)
migrate = Migrate(app, db)

CORS(app)
api = Api(app)

@app.route('/')
def index():
    return {"user": ["user1", "user2", "user3"]}

if __name__ == '__main__':
    app.run(port=5555, debug=True)
