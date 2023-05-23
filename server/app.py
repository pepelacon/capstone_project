import os
from flask import Flask, request, make_response, jsonify, render_template
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api, Resource
from sqlalchemy.orm import joinedload
from flask import json
import boto3

from models import db, Course, User, Enrollment, Lesson, LessonProgress


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
    
    def patch(self, id):
        user = User.query.filter_by(id=id).first()

        if not user:
            return make_response({"message": "User not found"}, 404)
       
        nickname = request.form.get('nickname')
        avatar = request.files.get('avatar')

        if avatar: 
            s3 = boto3.resource('s3', aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'))
            bucket = s3.Bucket('user-avatar-capstone')
            file_url = f"https://{bucket.name}.s3.amazonaws.com/{avatar.filename}" 
            bucket.put_object(Key=avatar.filename, Body=avatar)
            user.avatar = file_url

        if nickname:
            user.nickname = nickname
        db.session.commit()

        return make_response(user.to_dict(), 200)   
api.add_resource(UserById, '/user/<int:id>')

class CreateLesson(Resource):    
    def post(self):
        data = request.form
        
        video = request.files['video']
        
        if video: 
            s3 = boto3.resource('s3', aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'))
            bucket = s3.Bucket('daniel-storage-video')
            file_url = f"https://{bucket.name}.s3.amazonaws.com/{video.filename}" 
            bucket.upload_fileobj(Key=video.filename, Fileobj=video)
            
        new_lesson = Lesson(
            title=data['title'],
            description=data['description'],
            course_id=data['course_id'],
            video= file_url
        )
        db.session.add(new_lesson)
        db.session.commit()

        return make_response(new_lesson.to_dict(), 200)   
api.add_resource(CreateLesson, '/create_lesson')

class CourseById(Resource):
    def get(self, id):
        course = Course.query.filter_by(id=id).first()
        print(course.title)
        if not course:
            return make_response({"message": "Course not found"})
        return make_response(course.to_dict(), 200)                             
api.add_resource(CourseById, '/course/<int:id>')

class Enrollments(Resource):
    def post(self):
        data = request.get_json()
        
        course_id  = data['course_id']
        user_id = data['user_id']

        existing_enrollment = Enrollment.query.filter_by(user_id=user_id, course_id=course_id).first()

        if existing_enrollment:
            return make_response({"errors": ["User is already have this course"]}, 422)
        try:
            new_enrollment = Enrollment(
                user_id=user_id,
                course_id=course_id
            )
            # lessons = Lesson.query.filter_by(course_id=course_id).options(joinedload('course')).all()

            # for lesson in lessons:
            #     lesson_progress = LessonProgress(
            #         lesson=lesson,
            #         is_passed=False  
            #     )
            #     new_enrollment.lesson_progress.append(lesson_progress)

            db.session.add(new_enrollment)
            db.session.commit()
            response_dict = new_enrollment.to_dict()
            response = make_response(
                response_dict,
                201,
            )
            return response  
        except Exception as ex:
            return make_response({"errors": [ex.__str__()]}, 422)
        
api.add_resource(Enrollments, '/enrollments')

class AllUserCourses(Resource):
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        all_learning = []
        for enrollment in user.enrollments:
            course = enrollment.course.to_dict()
            course['lesson_progress'] = [progress.to_dict() for progress in enrollment.lesson_progress]
            all_learning.append(course)
        return make_response(all_learning, 200)
api.add_resource(AllUserCourses, '/my_learning/<int:id>')

class LessonProgression(Resource):
    def get(self, userId, id):
        enrollment = Enrollment.query.filter_by(user_id=userId, course_id=id).first()
        if enrollment:
            lesson_progress = enrollment.lesson_progress
            progress_data = [progress.to_dict() for progress in lesson_progress]
            return make_response(progress_data, 200)
        else:
            return make_response({"message": "Enrollment not found"}, 404)

    def post(self, userId, id):
        data = request.get_json()
        enrollment_id = data["enrollment_id"]
        lessons = Lesson.query.filter_by(course_id=id).all()
        print(enrollment_id)
        for lesson in lessons:
            lesson_progress = LessonProgress(
                enrollment_id=enrollment_id,
                lesson_id=lesson.id,
                is_passed=False
            )
            db.session.add(lesson_progress)
        
            db.session.commit()
        return make_response({"message": "Lesson progress added successfully"}, 200)
    
    def patch(self, userId, id):
        data = request.get_json()
        lesson_id = data["lesson_id"]
        is_passed = data["is_passed"]

        enrollment = Enrollment.query.filter_by(user_id=userId, course_id=id).first()
        if enrollment:
            lesson_progress = LessonProgress.query.filter_by(
                enrollment_id=enrollment.id,
                lesson_id=lesson_id
            ).first()

            if lesson_progress:
                lesson_progress.is_passed = is_passed
                db.session.commit()

                return make_response({"message": "Lesson progress updated successfully"}, 200)
            else:
                return make_response({"message": "Lesson progress not found"}, 404)
        else:
            return make_response({"message": "Enrollment not found"}, 404)
api.add_resource(LessonProgression, '/lesson_progression/<int:userId>/<int:id>')


if __name__ == '__main__':
    app.run(port=5555, debug=True)
