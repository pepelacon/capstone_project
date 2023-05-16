from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy


db = SQLAlchemy()

class User(db.Model):

    __tablename__ = 'users'

    serialize_rules = ('-created_at', '-updated_at', '-comments', '-enrollments')


    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    nickname = db.Column(db.String(100))
    avatar = db.Column(db.String, default='server/public/empty_avatar.png')

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    comments = db.relationship('Comment', 
                               back_populates='user',
                               cascade="all, delete, delete-orphan"
                               )
    
    courses = db.relationship('Course', 
                              back_populates='instructor',
                              cascade="all, delete, delete-orphan"
                              )
    
    enrollments = db.relationship('Enrollment', 
                                  back_populates='user',
                                  cascade="all, delete, delete-orphan"
                                  )
    
    ratings = db.relationship('Rating', 
                              back_populates='user',
                              cascade="all, delete, delete-orphan"
                              )
    
   

class Course(db.Model):

    __tablename__ = 'courses'

    serialize_rules = ('-created_at', '-updated_at', '-instructor', '-enrollments', '-lessons', '-comments')


    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    instructor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    instructor = db.relationship('User', 
                                 back_populates='courses', 
                                 )
    
    lessons = db.relationship('Lesson', 
                                back_populates='course', 
                                cascade="all, delete, delete-orphan"
                                )
    

    # *********** if course would be deleted, what happening with user

    enrollments = db.relationship('Enrollment', 
                                  back_populates='course',
                                #   cascade="all, delete, delete-orphan"
                                  )
    
    comments = db.relationship('Comment', 
                               back_populates='course',
                               cascade="all, delete, delete-orphan"
                               )
    
    ratings = db.relationship('Rating', 
                              back_populates='course',
                              cascade="all, delete, delete-orphan"
                              )
    


class Lesson(db.Model):

    __tablename__ = 'lessons'

    serialize_rules = ('-created_at', '-updated_at', '-course')

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String, nullable=False)

    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    course = db.relationship('Course', back_populates='lessons')
    done = db.Column(db.Boolean, default=False)
    

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    

class Enrollment(db.Model):

    __tablename__ = 'enrollments'

    serialize_rules = ('-created_at', '-updated_at', '-course', '-user')


    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)

    user = db.relationship('User', back_populates='enrollments', lazy=True)
    course = db.relationship('Course',  back_populates='enrollments', lazy=True)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

class Comment(db.Model, SerializerMixin):

    __tablename__ = 'comments'

    serialize_rules = ('-created_at', '-user', '-course')
    
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    
    user = db.relationship('User', back_populates='comments')
    course = db.relationship('Course', back_populates='comments')

class Rating(db.Model, SerializerMixin):

    __tablename__ = 'ratings'

    serialize_rules = ('-created_at', '-updated_at', '-user', '-course')
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    
    user = db.relationship('User', back_populates='ratings')
    course = db.relationship('Course', back_populates='ratings')

# class Conversation(db.Model):
    
#     __tablename__ = 'conversations'

#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
#     user = db.relationship('User', backref=db.backref('conversations', lazy=True))
#     lesson_id = db.Column(db.Integer, db.ForeignKey('lessons.id'), nullable=False)
#     content = db.Column(db.Text, nullable=False)