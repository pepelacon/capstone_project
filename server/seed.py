from random import choice as rc, randint
from models import User, Course, Comment, Lesson, Enrollment, Rating
from faker import Faker
from app import app, db

fake = Faker()

profile_pic = [
'https://the-tea.s3.us-east-2.amazonaws.com/profile1.jpg',
'https://the-tea.s3.us-east-2.amazonaws.com/profile10.jpg',
'https://the-tea.s3.us-east-2.amazonaws.com/profile11.jpg',
'https://the-tea.s3.us-east-2.amazonaws.com/profile12.jpg',
'https://the-tea.s3.us-east-2.amazonaws.com/profile13.jpg',
'https://the-tea.s3.us-east-2.amazonaws.com/profile14.jpg',
'https://the-tea.s3.us-east-2.amazonaws.com/profile15.jpg',
'https://the-tea.s3.us-east-2.amazonaws.com/profile16.jpg',
'https://the-tea.s3.us-east-2.amazonaws.com/profile18.jpg',
'https://the-tea.s3.us-east-2.amazonaws.com/profile17.jpg',
'https://the-tea.s3.us-east-2.amazonaws.com/profile19.jpeg',
'https://the-tea.s3.us-east-2.amazonaws.com/profile2.jpg',
'https://the-tea.s3.us-east-2.amazonaws.com/profile20.jpg',
'https://the-tea.s3.us-east-2.amazonaws.com/profile21.jpg',
'https://the-tea.s3.us-east-2.amazonaws.com/profile22.jpg',
'https://the-tea.s3.us-east-2.amazonaws.com/profile23.jpg',
'https://the-tea.s3.us-east-2.amazonaws.com/profile24.jpg',
'https://the-tea.s3.us-east-2.amazonaws.com/profile25.jpg',
'https://the-tea.s3.us-east-2.amazonaws.com/profile26.jpg',
'https://the-tea.s3.us-east-2.amazonaws.com/profile27.jpg',
'https://the-tea.s3.us-east-2.amazonaws.com/profile29.jpg',
'https://the-tea.s3.us-east-2.amazonaws.com/profile28.jpg',
'https://the-tea.s3.us-east-2.amazonaws.com/profile3.webp',
'https://the-tea.s3.us-east-2.amazonaws.com/profile3.jpg',
'https://the-tea.s3.us-east-2.amazonaws.com/profile31.jpg',
'https://the-tea.s3.us-east-2.amazonaws.com/profile4.jpg',
'https://the-tea.s3.us-east-2.amazonaws.com/profile5.jpg',
'https://the-tea.s3.us-east-2.amazonaws.com/profile6.jpg',
'https://the-tea.s3.us-east-2.amazonaws.com/profile7.jpg',
'https://the-tea.s3.us-east-2.amazonaws.com/profile8.jpg',
'https://the-tea.s3.us-east-2.amazonaws.com/profile9.jpg'
]

course_title = [
    'Mastering the Art of Communication: A Comprehensive Guide to Effective Speaking',
    'The Productivity Blueprint: Strategies and Techniques for Peak Performance',
    'The Entrepreneurs Toolkit: Building and Growing a Successful Business',
    'Creative Writing Unleashed: Ignite Your Imagination and Pen Your Masterpiece',
    'The Science of Happiness: Unlocking Joy and Fulfillment in Everyday Life',
    'Digital Marketing Mastery: Strategies and Tactics for Online Success',
    'Financial Fitness 101: A Practical Guide to Managing Your Money',
    'The Power of Mindfulness: Cultivating Presence and Inner Peace',
    'The Art of Negotiation: Strategies for Successful Deal Making',
    'Photography Essentials: Capturing Moments with Skill and Style',
    'The Secrets of Effective Leadership: Inspire, Influence, and Lead with Confidence',
    'Coding Fundamentals: Unlocking the World of Programming',
    'Graphic Design Wizardry: Creating Stunning Visuals with Impact',
    'Personal Branding Bootcamp: Crafting Your Unique Identity for Success'
]

lesson_title = [
    'Foundations of [Course Topic]',
    'Key Concepts and Terminology',
    'Practical Applications and Case Studies',
    'Advanced Techniques and Strategies',
    'Industry Trends and Innovations',
    'Hands-on Projects and Exercises',
    'Best Practices and Tips for Success',
    'Troubleshooting and Problem Solving',
    'Ethical Considerations in [Course Topic]',
    'Final Project and Recap'
]


with app.app_context():

    print('Deleting All Objects...')


    Comment.query.delete()
    Rating.query.delete()
    Lesson.query.delete()
    Enrollment.query.delete()
    Course.query.delete()
    User.query.delete()
    
    db.session.commit()

    users = []
    courses = []
    lessons = []
    
    print('Creating User objects...')

    for i in range(5):
        user = User(
            email = fake.email(),
            name = fake.name(),
            avatar = rc(profile_pic),
            nickname = fake.name()
        )

        users.append(user)

    db.session.add_all(users)
    db.session.commit() 
    print('Complete Users.')

    print("Having Each User make 3 course")
    for user in users:
        for i in range(2):
            course = Course(
                instructor_id = user.id,
                title = rc(course_title),
                description = fake.text()
            )
            courses.append(course)

    db.session.add_all(courses)
    db.session.commit() 
    print('Complete courses.')

    print("Having Each course make 3 lessons")
    for course in courses:
        for i in range(3):
            lesson = Lesson(
                course_id = course.id,
                title = rc(lesson_title),
                description = fake.text(),
                done = False
            )
            lessons.append(lesson)

    db.session.add_all(lessons)
    db.session.commit() 
    print('Complete lessons.')

    enrollments = []

    for user in users:
        for i in range(3):
            enrollment = Enrollment(
                user_id = user.id,
                course = rc(courses)
            )
            enrollments.append(enrollment)

    db.session.add_all(enrollments)
    db.session.commit() 
    print('Complete enrollments.')

    ratings = []
    users_list = list(users)
    for course in courses:
        for user in course.enrolled_users:
            if user:
    
                rating = Rating(
                    user_id = user.id,
                    course_id = course.id,
                    rate = randint(1, 5)
                )
                ratings.append(rating)

    db.session.add_all(ratings)
    db.session.commit() 
    print('Complete ratings.')

    comments = []
    users_list = list(users)
    for course in courses:
        for user in course.enrolled_users:
            if user:
    
                comment = Comment(
                    user_id = user.id,
                    course_id = course.id,
                    content = fake.text()
                )
                comments.append(comment)

    db.session.add_all(comments)
    db.session.commit() 

    print('Complete comments.')