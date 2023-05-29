import os
from flask import Flask, request, make_response, jsonify, render_template
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api, Resource
from sqlalchemy.orm import joinedload
from flask import json
from sqlalchemy import delete, exists, and_
import boto3

from models import db, Course, User, Enrollment, Lesson, LessonProgress, Comment, Rating, Message


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
        data = request.form
        picture = request.files.get("picture")
        try:
            s3 = boto3.resource('s3', aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'))
            bucket = s3.Bucket('user-avatar-capstone')
            file_url = f"https://{bucket.name}.s3.amazonaws.com/{picture.filename}" 
            bucket.put_object(Key=picture.filename, Body=picture)

            
            new_course = Course(
                title=data['title'],
                picture=file_url,
                description=data['description'],
                category=data['category'],
                instructor_id=data['instructor_id']
            )
            db.session.add(new_course)
            db.session.commit()

            response_dict = new_course.to_dict()

            response = make_response(
                response_dict,
                201,
            )
            return response
        except Exception as ex:
            return make_response({"errors": [ex.__str__()]}, 422)

api.add_resource(Courses, '/course')

class CoursesBest(Resource):
    def get(self):
        best_courses = Course.get_best_courses_in_each_category()
        best_courses_dict = [course.to_dict() for course in best_courses]
        return make_response(best_courses_dict, 200)
api.add_resource(CoursesBest, '/course/best')

class NewestCourses(Resource):
    def get(self):
        newest_courses = Course.get_newest_courses()
        newest_courses_dict = [course.to_dict() for course in newest_courses]
        return make_response(newest_courses_dict, 200)
api.add_resource(NewestCourses, '/course/newest')

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

    def delete(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return make_response({"message" : "User not found"})
        db.session.delete(user)
        db.session.commit() 

        return make_response({"mesage" : "User was deleted"})   
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

class DeleteLesson(Resource):
    def delete(self, id):
        lesson = Lesson.query.filter_by(id=id).first()
        if not lesson:
            return make_response({"message": "Lesson not found"}, 404)
        db.session.delete(lesson)
        db.session.commit()
            
api.add_resource(DeleteLesson, '/lesson/<int:id>')


class CourseEdit(Resource):
    def get(self, id):
        course = Course.query.filter_by(id=id).first()
        if not course:
            return make_response({"message": "Course not found"})
        return make_response(course.to_dict(), 200)   
    
    def patch(self, id):
        course = Course.query.filter_by(id=id).first()
        if not course:
            return make_response({"message": "Course not found"}, 404)

        try:
            data = request.get_json()
            print(data)
            picture = request.files.get("picture")

            if "description" in data:
                course.description = data["description"]
            if "title" in data:
                course.title = data["title"]
            picture = request.files.get("picture")
            if picture:
                s3 = boto3.resource('s3', aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                                    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'))
                bucket = s3.Bucket('user-avatar-capstone')
                file_url = f"https://{bucket.name}.s3.amazonaws.com/{picture.filename}" 
                bucket.put_object(Key=picture.filename, Body=picture)
                course.picture = file_url


            db.session.commit()

            response_dict = course.to_dict()

            response = make_response(
                response_dict,
                200,
            )
            return response
        except Exception as ex:
            return make_response({"errors": [ex.__str__()]}, 422)
    
    def delete(self, id):
        course = Course.query.filter_by(id=id).first() 
        if not course:
            return make_response({"message": "Course not found"}, 404)
        db.session.delete(course)
        db.session.commit() 
        
        return make_response({"message": "Course deleted successfully"})      
api.add_resource(CourseEdit, '/edit/<int:id>')

class CourseById(Resource):
    def get(self, id):
        course = Course.query.filter_by(id=id).first()
        if not course:
            return make_response({"message": "Course not found"})
        return make_response(course.to_dict(), 200)                             
api.add_resource(CourseById, '/course/<int:id>')



# $ i am working on

class Ratings(Resource):
    def post(self):
        data = request.get_json()
        course_id  = data['course_id']
        user_id = data['user_id']
        ratings = data['rating']

        try:
            new_rating = Rating(
                user_id=user_id,
                course_id=course_id,
                rate=ratings
            )
           
            db.session.add(new_rating)
            db.session.commit()
            
            response = make_response(
                {"errors": ["user leave comment"]},
                201,
            )
            return response  
        except Exception as ex:
            return make_response({"errors": [ex.__str__()]}, 422)                       
api.add_resource(Ratings, '/ratings')

class RatingById(Resource):
    def get(self, user_id, course_id):
        existing_rating = Rating.query.filter_by(user_id=user_id, course_id=course_id).first()

        if existing_rating:
            return make_response([1], 200)
        return make_response({"message":"rating for this course does not exist"}, 200)
api.add_resource(RatingById, '/ratings/<int:user_id>/<int:course_id>')

class CommentsById(Resource):
    def get(self, user_id, course_id):
        existing_comment = Comment.query.filter_by(user_id=user_id, course_id=course_id).first()

        if existing_comment:
            return make_response([1], 200)
        return make_response({"message":"comment for this course does not exist"}, 200)
api.add_resource(CommentsById, '/comments/<int:user_id>/<int:course_id>')


class Comments(Resource):
    def post(self):
        data = request.get_json()
        course_id  = data['course_id']
        user_id = data['user_id']
        comment = data['content']

        try:
            new_comment = Comment(
                user_id=user_id,
                course_id=course_id,
                content=comment
            )
           
            db.session.add(new_comment)
            db.session.commit()
            
            response = make_response(
                {"errors": ["user leave comment"]},
                201,
            )
            return response  
        except Exception as ex:
            return make_response({"errors": [ex.__str__()]}, 422)                       
api.add_resource(Comments, '/comments')

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


class AllInstructorCourses(Resource):
    def get(self, id):
        courses = Course.query.filter_by(instructor_id=id).all()
        all_courses = []
        for course in courses:
            course_dict = course.to_dict()
            all_courses.append(course_dict)
        return make_response(all_courses, 200)
api.add_resource(AllInstructorCourses, '/my_courses/<int:id>')

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


class Messages(Resource):
    def get(self, id):
        lesson = Lesson.query.filter_by(id=id).first()

        if not lesson:
            return make_response({"message": "Lesson not found"}, 404)

        messages = lesson.messages

        message_data = []
        for message in messages:
            message_data.append(message.to_dict())

        return make_response(message_data, 200)
    
    def post(self, id):
        data = request.get_json()
        lesson = Lesson.query.filter_by(id=id).first()

        if not lesson:
            return make_response({"message": "Lesson not found"}, 404)
        
        try:
            new_message = Message(
                sender_id=data['sender_id'],
                lesson_id=id,
                content=data['content']
            )
            db.session.add(new_message)
            db.session.commit()
            
            return make_response(new_message.to_dict(), 201)
        except Exception as ex:
            return make_response({"errors": [ex.__str__()]}, 422)
api.add_resource(Messages, '/lesson/<int:id>/messages')


if __name__ == '__main__':
    app.run(port=5555, debug=True)
