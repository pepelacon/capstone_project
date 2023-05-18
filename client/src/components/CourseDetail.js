import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from '../UserContext'




export const CourseDetail = () => {
    const { userId } = useContext(UserContext) 
    const [ courseInfo, setCourseInfo ] = useState({})

    let { id: courseId } = useParams()

    const navigate = useNavigate()
    useEffect(() => {
        const fetchData = async () => {
          try {
            const courseResponse = await fetch(`/course/${courseId}`);
            const courseData = await courseResponse.json();
            setCourseInfo (courseData);
      
          } catch (error) {
            console.error(error);
          }
        };
      
        fetchData();
      }, [courseId]);
 
    console.log(courseInfo);


        
        return (
            <section id="features">
      {/* Flex container */}
      <div className="container justify-center flex flex-col px-4 mx-auto mt-10 space-y-12 md:space-y-0 md:flex-row">
        {/* <!-- What's Different --> */}
        <div className="flex flex-col space-y-12 md:w-3/8">
          <h4 class="max-w-md text-2xl font-bold text-center md:text-left">
            {courseInfo.title}
          </h4>
          <h5 className="max-w-sm text-center text-darkGrayishBlue md:text-left mt-0">
            <p className="max-w-sm text-center font-bold text-darkGrayishBlue md:text-left">
                Description:
            </p>
            {courseInfo.description}
          </h5>
        </div>

        {/* <!-- Numbered List --> */}
        <div class="flex flex-col space-y-4 md:w-1/2">
          {/* <!-- List Item 1 --> */}
          <div
            class="flex flex-col space-y-3 md:space-y-0 md:space-x-6 md:flex-row"
          >
            {/* <!-- Heading --> */}
            <div class="rounded-l-full bg-brightRedSupLight md:bg-transparent">
              <div class="flex items-center space-x-2">
                <div
                  class="px-4 py-2 text-white rounded-full md:py-1 bg-brightRed"
                >
                  01
                </div>
                <h3 class="text-base font-bold md:mb-4 md:hidden">
                  Track company-wide progress
                </h3>
              </div>
            </div>

            <div>
              <h3 class="hidden mb-4 text-lg font-bold md:block">
                Track company-wide progress
              </h3>
              <p class="text-darkGrayishBlue">
                See how your day-to-day tasks fit into the wider vision. Go from
              tracking progress at the milestone level all the way down to the
                smallest of details. Never lose sight of the bigger picture
                again.
              </p>
            </div>
          </div>

          {/* <!-- List Item 2 --> */}
          <div
            class="flex flex-col space-y-3 md:space-y-0 md:space-x-6 md:flex-row"
          >
            {/* <!-- Heading --> */}
            <div class="rounded-l-full bg-brightRedSupLight md:bg-transparent">
              <div class="flex items-center space-x-2">
                <div
                  class="px-4 py-2 text-white rounded-full md:py-1 bg-brightRed"
                >
                  02
                </div>
                <h3 class="text-base font-bold md:mb-4 md:hidden">
                  Advanced built-in reports
                </h3>
              </div>
            </div>

            <div>
              <h3 class="hidden mb-4 text-lg font-bold md:block">
                Advanced built-in reports
              </h3>
              <p class="text-darkGrayishBlue">
                Set internal delivery estimates and track progress toward
                company goals. Our customisable dashboard helps you build out
                the reports you need to keep key stakeholders informed.
              </p>
            </div>
          </div>

          {/* <!-- List Item 3 --> */}
          <div
            class="flex flex-col space-y-3 md:space-y-0 md:space-x-6 md:flex-row"
          >
            {/* <!-- Heading --> */}
            <div class="rounded-l-full bg-brightRedSupLight md:bg-transparent">
              <div class="flex items-center space-x-2">
                <div
                  class="px-4 py-2 text-white rounded-full md:py-1 bg-brightRed"
                >
                  03
                </div>
                <h3 class="text-base font-bold md:mb-4 md:hidden">
                  Everything you need in one place
                </h3>
              </div>
            </div>

            <div>
              <h3 class="hidden mb-4 text-lg font-bold md:block">
                Everything you need in one place
              </h3>
              <p class="text-darkGrayishBlue">
                Stop jumping from one service to another to communicate, store
                files, track tasks and share documents. Manage offers an
                all-in-one team productivity solution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
        

    
           
    )
}


