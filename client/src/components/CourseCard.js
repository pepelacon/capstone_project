



export default function CourseCard (course) {
const { id, title, category, description, picture } = course

    return (
        <div id='profile-page'>       
            <div >
                <h4 className="text-title">Course: {title} </h4>
                <img className="card-img" src={picture} alt={title}/>
            </div>
            <div className="card-info">
                <div className='title'>

                </div>
                <div className='text'>
                    
                  <p className="text-body">Description: {description}</p>
                  
                </div>
            </div>
        </div>
    )

}