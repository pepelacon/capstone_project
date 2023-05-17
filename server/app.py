from flask import Flask, request, make_response, jsonify, render_template
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask import json

from models import db, Course, User


app = Flask(
    __name__,
    static_url_path='',
    static_folder='../client/build',
    template_folder='../client/build'
    )

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:9865458@localhost/capsone_project'

# postgresql://user:9865458@localhost/capstone

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

db.init_app(app)
migrate = Migrate(app, db)

CORS(app)
api = Api(app)



class Courses(Resource):
    def get(self):
        all_course = [course.to_dict() for course in Course.query.order_by(Course.created_at.desc()).all()]
        return make_response(all_course, 200)
    
    def post(self):
        data = request.get_json()
        try:
            new_course = Course(
                title=data['title'],
                picture=data['picture'],
                description=data['description'],
                category=data['category'],
                instructor_id=data['instructor_id']
            )
        except Exception as ex:
            return make_response({"errors": [ex.__str__()]}, 422)

        db.session.add(new_course)
        db.session.commit()

        response_dict = new_course.to_dict()

        response = make_response(
            response_dict,
            201,
        )
        return response

api.add_resource(Courses, '/course')


class Users(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(email=data['email']).first()
        if not user:
            try:
                new_user = User(
                    name = data['name'],
                    email = data['email'],
                    nickname = data['nickname'],
                    avatar = data['avatar']
                )
            except Exception as ex:
                return make_response({"errors": [ex.__str__()]}, 422)
            db.session.add(new_user)
            db.session.commit()

            response_dict = new_user.to_dict()

            response = make_response(
                response_dict,
                201,
            )
            return response
        else:
            return make_response(user.to_dict(), 200)
        
api.add_resource(Users, '/profile')

class UserById(Resource):
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return make_response({"message" : "User not found"})
        return make_response(user.to_dict(), 200)
    
api.add_resource(UserById, '/user/:id')


if __name__ == '__main__':
    app.run(port=5555, debug=True)
