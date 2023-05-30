from random import choice as rc, randint
from models import db, User, Course, Lesson, Comment, Rating, Enrollment, LessonProgress
from faker import Faker
from app import app

fake = Faker()

comments_list = [
    "This is amazing, I love how detailed it is!",
    "Thank you for putting in so much effort, it's really helpful.",
    "I'm extremely impressed with the quality of this content!",
    "Wow, this is exactly what I needed. Thank you!",
    "Incredibly informative, you've done a fantastic job!",
    "I can't thank you enough for sharing this valuable information.",
    "This has exceeded my expectations, great work!",
    "I've learned so much from this, it's truly eye-opening.",
    "Thank you for taking the time to create such a comprehensive guide.",
    "This tutorial is a game-changer, thank you for sharing!",
    "I'm quite disappointed with the lack of depth in this material.",
    "This falls short of my expectations, it's not worth the time.",
    "I'm frustrated by the lack of clarity in your explanation.",
    "This is a complete waste of time, I'm extremely dissatisfied.",
    "I can't believe how poorly structured this content is.",
    "This guide is confusing and misleading, I'm not impressed.",
    "I'm angry that I wasted my time on this subpar material.",
    "I'm furious with the lack of accuracy and attention to detail.",
    "This is a terrible resource, it's completely useless.",
    "I'm infuriated by the incompetence displayed in this content.",
    "Check out this Photo",
    "I took this when I was traveling",
    "This was so much fun",
    "You Know I'm gonna spill that tea",
    "Best day ever!",
    "I only wish that you guys could have seen it!",
    "Just living my best life!",
    "Feeling blessed and grateful today.",
    "Exploring new places and making memories.",
    "Sometimes the best therapy is a long drive and good music.",
    "Life is short, enjoy the little things.",
    "Creating moments that will last a lifetime.",
    "Happiness is a journey, not a destination.",
    "Life's too short to not take risks.",
    "Embracing the chaos and loving every minute of it.",
    "Dream big, work hard, stay focused, and surround yourself with good people.",
    "The only limit is the one you set for yourself.",
    "Always trust the journey, even if you don't understand it.",
    "Life is an adventure, embrace it with open arms.",
    "You are the artist of your own life, don't be afraid to paint outside the lines.",
    "Every day is a new opportunity to grow and learn.",
    "Make every moment count, and never forget to smile.",
    "Be the reason someone smiles today.",
    "Believe in yourself and all that you are.",
    "Chase your dreams and never look back.",
    "Love yourself, embrace your flaws, and never stop being you."
]

course_titles = [
   " Introduction to Machine Learning",
    "Financial Planning and Investment Strategies",
    "Web Development for Beginners",
    "Digital Marketing Fundamentals",
    "Photography Masterclass",
    "Effective Communication Skills",
    "Graphic Design Principles and Techniques",
    "Introduction to Psychology",
    "Personal Finance Management",
    "Creative Writing Workshop",
    "Introduction to Artificial Intelligence",
    "Yoga and Mindfulness Practices",
    "Public Speaking Mastery",
    "Introduction to Data Science",
    "Mobile App Development with React Native",
    "Entrepreneurship and Business Startup",
    "Social Media Marketing Strategies",
    "Introduction to Astrophysics",
    "Music Theory and Composition",
    "Culinary Arts: Cooking Techniques and Recipes",
    "Introduction to Cryptocurrency and Blockchain",
    "Fitness and Strength Training",
    "Effective Time Management Strategies",
    "Introduction to User Experience Design",
    "Painting and Mixed Media Art",
    "Basics of Stock Market Investing",
    "Introduction to Environmental Science",
    "Introduction to Fashion Design",
    "Personal Development and Goal Setting",
    "Introduction to Game Development",
]


cover_course_pic = [
    'https://user-avatar-capstone.s3.amazonaws.com/cover+for+courses/17.jpeg',
    'https://user-avatar-capstone.s3.amazonaws.com/cover+for+courses/18.jpeg',
    'https://user-avatar-capstone.s3.amazonaws.com/cover+for+courses/19.jpeg',
    'https://user-avatar-capstone.s3.amazonaws.com/cover+for+courses/2.jpeg',
    'https://user-avatar-capstone.s3.amazonaws.com/cover+for+courses/20.jpeg',
    'https://user-avatar-capstone.s3.amazonaws.com/cover+for+courses/21.jpeg',
    'https://user-avatar-capstone.s3.amazonaws.com/cover+for+courses/22.jpeg',
    'https://user-avatar-capstone.s3.amazonaws.com/cover+for+courses/23.jpeg',
    'https://user-avatar-capstone.s3.amazonaws.com/cover+for+courses/24.jpeg',
    'https://user-avatar-capstone.s3.amazonaws.com/cover+for+courses/25.jpeg',
    'https://user-avatar-capstone.s3.amazonaws.com/cover+for+courses/26.jpeg',
    'https://user-avatar-capstone.s3.amazonaws.com/cover+for+courses/3.jpeg',
    'https://user-avatar-capstone.s3.amazonaws.com/cover+for+courses/4.jpeg',
    'https://user-avatar-capstone.s3.amazonaws.com/cover+for+courses/16.jpeg',
    'https://user-avatar-capstone.s3.amazonaws.com/cover+for+courses/15.jpeg',
    'https://user-avatar-capstone.s3.amazonaws.com/cover+for+courses/14.jpeg',
    'https://user-avatar-capstone.s3.amazonaws.com/cover+for+courses/13.jpeg',
    "https://user-avatar-capstone.s3.amazonaws.com/cover+for+courses/12.jpeg",
    'https://user-avatar-capstone.s3.amazonaws.com/cover+for+courses/11.jpeg',
    'https://user-avatar-capstone.s3.amazonaws.com/cover+for+courses/10.jpeg',
    'https://user-avatar-capstone.s3.amazonaws.com/cover+for+courses/1.jpeg',
    'https://user-avatar-capstone.s3.amazonaws.com/cover+for+courses/52a75726350efbd658039924c5609745.jpg',
    'https://user-avatar-capstone.s3.amazonaws.com/cover+for+courses/6.jpeg',
    'https://user-avatar-capstone.s3.amazonaws.com/cover+for+courses/7.jpeg',
    'https://user-avatar-capstone.s3.amazonaws.com/cover+for+courses/8.jpeg',
    'https://user-avatar-capstone.s3.amazonaws.com/cover+for+courses/8393f627dc7cadfa21c3b5e038c3fd1e.jpg',
    "https://user-avatar-capstone.s3.amazonaws.com/cover+for+courses/9.jpeg",
    "https://user-avatar-capstone.s3.amazonaws.com/cover+for+courses/95ee12a5384bf74f5e9b986edce601b8.jpg",
    "https://user-avatar-capstone.s3.amazonaws.com/cover+for+courses/a3176586ad6d7ede01d6fea4d1a5a34c.jpg",
    "https://user-avatar-capstone.s3.amazonaws.com/cover+for+courses/b3d7e719b20a02abd01c9578f60253ed.jpg",
    "https://user-avatar-capstone.s3.amazonaws.com/cover+for+courses/c749b29f3e277d9d4d1a3763d387e89d.jpg",
    "https://user-avatar-capstone.s3.amazonaws.com/cover+for+courses/d27550fa3b30a17f6826a235234100a8.jpg",
    "https://user-avatar-capstone.s3.amazonaws.com/cover+for+courses/dc97941f65cdaaaba8cf47e9a7bc3e0e.jpg",
    "https://user-avatar-capstone.s3.amazonaws.com/cover+for+courses/f3733dfebb78026dcf5f852aff74e85f.jpg",
    "https://user-avatar-capstone.s3.amazonaws.com/cover+for+courses/e5a870a74a114de9d87bbede215f237e.jpg"
]

courses_content_list = [
    'Introduction to Web Development: Dive into the world of web development and learn the fundamental concepts of HTML, CSS, and JavaScript. Build your own websites and gain practical skills to kick-start your career in this ever-growing field.',
    'Financial Planning and Investment Strategies: Understand the principles of financial planning and learn effective investment strategies to secure your financial future. Explore topics such as budgeting, savings, investments, and retirement planning through real-life case studies and practical exercises.',
    'Graphic Design for Beginners: Unleash your creativity and learn the basics of graphic design. From creating eye-catching visuals to mastering design software, this course will equip you with the essential skills to design captivating logos, posters, and social media graphics.',
    'Introduction to Data Science: Explore the world of data science and learn how to analyze and interpret large datasets. Discover the power of Python programming, data visualization, and machine learning algorithms to extract valuable insights and make data-driven decisions.',
    'Public Speaking Mastery: Overcome stage fright and enhance your public speaking skills with this comprehensive course. Learn effective techniques to deliver impactful speeches, engage your audience, and build confidence in various public speaking scenarios.',
    'Digital Marketing Fundamentals: Gain a solid understanding of digital marketing strategies and tactics. Explore topics such as social media marketing, search engine optimization (SEO), email marketing, and content creation to drive online success for businesses.',
    'Introduction to Psychology: Delve into the fascinating world of human behavior and the mind. Explore various psychological theories, understand cognitive processes, and gain insights into how individuals think, perceive, and interact with the world around them.',
    'Culinary Arts and Gastronomy: Embark on a culinary journey and master the art of cooking. From classic techniques to modern gastronomy, this course covers a wide range of culinary skills, including knife skills, flavor pairing, and the preparation of diverse cuisines.',
    'Introduction to Artificial Intelligence: Explore the foundations of artificial intelligence and machine learning. Discover how AI is transforming industries and learn about algorithms, neural networks, and data analysis techniques used to develop intelligent systems.',
    'Fitness and Nutrition Essentials: Achieve a healthy lifestyle by understanding the principles of fitness and nutrition. Learn about effective workout routines, proper nutrition, and lifestyle choices that promote physical well-being and long-term health.',
    'Creative Writing Workshop: Ignite your creativity and refine your writing skills. Explore various genres, develop compelling characters, and learn techniques to craft captivating stories, poems, and essays that resonate with readers.',
    'Introduction to Astronomy: Embark on a celestial journey and explore the wonders of the universe. Learn about planets, stars, galaxies, and astronomical phenomena, and discover the latest discoveries and advancements in the field of astronomy.',
    'Entrepreneurship and Business Startup: Learn how to transform your innovative ideas into successful business ventures. Gain insights into business planning, marketing strategies, financial management, and effective leadership to launch and grow your own startup.',
    'Introduction to Foreign Languages: Discover the beauty of different languages and cultures. Learn essential vocabulary, grammar rules, and conversational skills to communicate effectively in languages such as Spanish, French, Mandarin, or German.',
    'Introduction to Film Production: Unleash your creativity in the world of filmmaking. Learn the basics of scriptwriting, cinematography, editing, and production techniques to create your own short films and bring your storytelling visions to life.',
    'Introduction to Game Development: Dive into the world of game development and learn the basics of game design, programming, and interactive storytelling. Create your own games and explore the processes behind game mechanics, level design, and player engagement.',
    'Environmental Conservation and Sustainability: Understand the importance of environmental conservation and explore sustainable practices to protect our planet. Learn about climate change, renewable energy, waste management, and sustainable living choices for a greener future.',
    'Introduction to Music Theory: Unlock the secrets of music with this comprehensive course on music theory. Learn about notes, scales, chords, and musical composition, and develop a deeper understanding of how music is structured and created.',
    'Introduction to Psychology: Delve into the fascinating world of human behavior and the mind. Explore various psychological theories, understand cognitive processes, and gain insights into how individuals think, perceive, and interact with the world around them.',
    'Introduction to Interior Design: Discover the principles of interior design and learn how to create functional and aesthetically pleasing spaces. Explore color theory, furniture arrangement, lighting techniques, and materials selection to design stunning interiors.'
]

video_content = [
    'https://daniel-storage-video.s3.us-east-2.amazonaws.com/video+courses/1.mov',
    'https://daniel-storage-video.s3.us-east-2.amazonaws.com/video+courses/10.mov',
    'https://daniel-storage-video.s3.us-east-2.amazonaws.com/video+courses/2.mov',
    'https://daniel-storage-video.s3.us-east-2.amazonaws.com/video+courses/3.mov',
    'https://daniel-storage-video.s3.us-east-2.amazonaws.com/video+courses/4.mov',
    'https://daniel-storage-video.s3.us-east-2.amazonaws.com/video+courses/5.mov',
    'https://daniel-storage-video.s3.us-east-2.amazonaws.com/video+courses/6.mov',
    'https://daniel-storage-video.s3.us-east-2.amazonaws.com/video+courses/7.mov',
    'https://daniel-storage-video.s3.us-east-2.amazonaws.com/video+courses/8.mov',
    'https://daniel-storage-video.s3.us-east-2.amazonaws.com/video+courses/9.mov',
    'https://daniel-storage-video.s3.us-east-2.amazonaws.com/video+courses/11.mp4',
    'https://daniel-storage-video.s3.us-east-2.amazonaws.com/video+courses/12.mp4',
    'https://daniel-storage-video.s3.us-east-2.amazonaws.com/video+courses/13.mp4',
    'https://daniel-storage-video.s3.us-east-2.amazonaws.com/video+courses/14.mp4',
    'https://daniel-storage-video.s3.us-east-2.amazonaws.com/video+courses/15.mp4',
    'https://daniel-storage-video.s3.us-east-2.amazonaws.com/video+courses/16.mp4',
    'https://daniel-storage-video.s3.us-east-2.amazonaws.com/video+courses/17.mp4'
]


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

category = [
    "Development",
    "Business",
    "Finance",
    "Design",
    "IT&Software",
    "Marketing",
    "Health & fitness",
    "Music",
    "Lifestyle"
]

lesson_titles = [
    'Introduction to the Course',
    'Understanding the Basics',
    'Advanced Techniques and Strategies',
    'Practical Applications and Case Studies',
    'Step-by-Step Tutorials',
    'Exploring Real-World Examples',
    'Troubleshooting and Problem-solving',
    'Best Practices and Tips',
    'Hands-on Exercises and Assignments',
    "Final Project and Assessment",
    'Mastering Key Concepts'
    'Deep Dive into Advanced Topics',
    'Case Studies: Success Stories and Lessons Learned',
    'Exploring Cutting-Edge Technologies',
    'Practical Examples and Demonstrations',
    'Group Projects and Collaborative Learning',
    'Interactive Quizzes and Assessments',
    'Industry Insights and Trends',
    'Guest Speakers and Expert Interviews',
    'Final Exam and Certification'
]


with app.app_context():

    print('Deleting All Objects...')
    LessonProgress.query.delete()
    Enrollment.query.delete()
    Rating.query.delete()
    Comment.query.delete()
    Lesson.query.delete()
    Course.query.delete()
    User.query.delete()
    
    db.session.commit()


    print('Creating User objects...')


    users = []
    courses = []

    for i in range(100):
        user = User(
            email=fake.email(),
            name=fake.name(),
            nickname=fake.name(),
            avatar=rc(profile_pic)
        )
    
        users.append(user)
    print('Adding User objects to transaction...')
    db.session.add_all(users)
    print('Committing transaction...') 
    db.session.commit() 
    print('Complete.')

    print('Making 20 courses')

    for i in range(100):
        course = Course(
            title=rc(course_titles),
            category=rc(category),
            picture=rc(cover_course_pic),
            description=rc(courses_content_list),
            instructor_id=rc(users).id
        )
    
        courses.append(course)

    print('Adding courses objects to transaction...')
    db.session.add_all(courses)
    print('Committing transaction...') 
    db.session.commit() 
    print('Complete.')



    print('Making Each User follow 3 courses for each user')
    enrollments = []
    for user in users:
        for i in range(randint(1, 3)):
            enrollment = Enrollment(
                user_id = user.id,
                course_id = rc(courses).id
            )
            enrollments.append(enrollment)

    print('Adding Enrollments objects to transaction...')
    db.session.add_all(enrollments)
    print('Committing transaction...') 
    db.session.commit() 
    print('Complete.')


    print("Creating randomly assigned comments")
    comments = []
    for course in courses:        
        for i in range(randint(3, 6)):
            comment = Comment(
                user_id=rc(users).id, 
                course_id=course.id,
                content = rc(comments_list)
            )
            comments.append(comment)

    print('Adding Comment objects to transaction...')
    db.session.add_all(comments)
    print('Committing transaction...') 
    db.session.commit() 
    print('Complete.')


    print("Creating ratings for each course")
    ratings = []
    for course in courses:
        for i in range(5):
            rating = Rating(
                user_id=rc(users).id, 
                course_id=course.id,
                rate = randint(1, 5)
            )
            ratings.append(rating)

    print('Adding ratings objects to transaction...')
    db.session.add_all(ratings)
    print('Committing transaction...') 
    db.session.commit() 
    print('Complete.')
  
    print("Creating lessons for each course")
    lessons = []
    for course in courses:
        for i in range(randint(3, 7)):
            lesson = Lesson(
                course_id=course.id,
                title = rc(lesson_titles),
                video = rc(video_content),
                description = fake.sentence(nb_words=50)
            ) 
            lessons.append(lesson)
    print('Adding lessons objects to transaction...')
    db.session.add_all(lessons)
    print('Committing transaction...') 
    db.session.commit() 
    print('Complete.')






  



