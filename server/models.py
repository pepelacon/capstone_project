from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy import func


db = SQLAlchemy()

class User(db.Model):

    __tablename__ = 'users'

    serialize_rules = ('-created_at', '-updated_at', '-comments', '-enrollments',)


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
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'nickname': self.nickname,
            'avatar': self.avatar
        }
   

class Course(db.Model):

    __tablename__ = 'courses'

    serialize_rules = ('-created_at', '-updated_at', '-instructor', '-enrollments', '-lessons', '-comments',)


    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String, nullable=False)
    picture = db.Column(db.String, nullable=True, default='https://the-tea.s3.us-east-2.amazonaws.com/user_icon.png')
    description = db.Column(db.String, nullable=False)
    instructor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    instructor = db.relationship('User', back_populates='courses', cascade="all, delete, delete-orphan", single_parent=True)

    lessons = db.relationship('Lesson', back_populates='course', cascade="all, delete, delete-orphan")

    # *********** if course would be deleted, what happening with user

    enrollments = db.relationship('Enrollment', back_populates='course', cascade="all, delete, delete-orphan")
    enrolled_users = association_proxy('enrollments', 'user')
    comments = db.relationship('Comment', back_populates='course',cascade="all, delete, delete-orphan")
    ratings = db.relationship('Rating', back_populates='course',cascade="all, delete, delete-orphan")

    def calculate_average_rating(self):
        average = db.session.query(func.avg(Rating.rate)).filter(Rating.course_id == self.id).scalar()
        return average or 0
    
    def to_dict(self):
        average_rating = self.calculate_average_rating()
        avr = round(average_rating, 2)
        return {
            'id': self.id,
            'instructor_id': self.instructor_id,
            'title': self.title,
            'description': self.description,
            'picture': self.picture,
            'average_rating': avr,
        }

class Lesson(db.Model):

    __tablename__ = 'lessons'

    serialize_rules = ('-created_at', '-updated_at', '-course',)

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

    serialize_rules = ('-created_at', '-updated_at', '-course', '-user',)


    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)

    user = db.relationship('User', back_populates='enrollments', lazy=True)
    course = db.relationship('Course',  back_populates='enrollments', lazy=True)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

class Comment(db.Model, SerializerMixin):

    __tablename__ = 'comments'

    serialize_rules = ('-created_at', '-user', '-course', '-user',)
    
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    
    user = db.relationship('User', back_populates='comments')
    course = db.relationship('Course', back_populates='comments')

class Rating(db.Model, SerializerMixin):

    __tablename__ = 'ratings'

    serialize_rules = ('-created_at', '-updated_at', '-user', '-course',)
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'))
    rate = db.Column(db.Integer)
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