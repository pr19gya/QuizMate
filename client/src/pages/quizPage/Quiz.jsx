import  { useContext, useEffect, useState } from 'react'
import { CustomContext } from '../../context/customQuizContext'
import {baseUrl} from "../../baseUrl.jsx"
import { AuthContext } from '../../context/authContext.jsx'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Lottie from 'lottie-react'
import Submit from '../../animations/Submit.json'
import { Link } from 'react-router-dom'

const Quiz = () => {
    
  const {accessToken,refreshToken}=useContext(AuthContext);
  const {questionInfo,setQuestionInfo,resultList,setResultList,result,setResult,
    chosenCategory,totalMarks}=useContext(CustomContext);
  // const start=0;
  const end=questionInfo.length-1;
  const [selectedOption, setSelectedOption] = useState(null);
  const [current,setCurrent]=useState(0);
  const [rightAns,setRightAns]=useState("");
  const [response, setResponse] = useState({
    responseList: [],
    totalQuestion: `${questionInfo.length}`,
    category: `${chosenCategory}`,
    maximumMarks:`${totalMarks}`
  });
  const navigate = useNavigate();
  console.log(questionInfo);
  
  
  
  function changeHandler(event){
    setRightAns(event.target.value);
    console.log(rightAns);
  }
  useEffect(()=>{
    console.log(rightAns);
  },[rightAns])

  const handleNextClick = () => {
    setCurrent(current + 1);
    // setRightAns("");/
    setSelectedOption(null);
  };

  
  const handlePreviousClick = () => {
    setCurrent(current - 1);
    setSelectedOption(null);
  };
  
  const handleSubmitNext = () => {
    
    var newObj = {
      id: questionInfo[current].id,
      rightOption: rightAns
    };
    const existingEntryIndex = response.responseList.findIndex(entry => entry.id === newObj.id);
    if (existingEntryIndex !== -1) {
      response.responseList[existingEntryIndex].rightOption = newObj.rightOption;
    } else {
      setResponse(prevState => ({
        ...prevState,
        responseList: [...prevState.responseList, newObj]
      }));
      
    }
    

    console.log(response);
    setRightAns("");
    if(current<end)
    {
      //setCurrent(current+1);
    }
    setCurrent(current+1);
  };

  const getResultHandler =() =>{
    let resultUrl=`${baseUrl}/user/response`;
    
    // console.log(userCredential);
    

    console.log(`Bearer ${accessToken}`);
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: resultUrl,
      headers: { 
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json', 
        'X-API-Key': '{{token}}'
      },
      data : response
    };
    //console.log(accessToken);

    axios.request(config)
        .then((response) => {
          // console.log(response);
          if (response.status === 200) {
            setResultList(response.data.responseList)
            setResult(response.data.result);
            // console.log("done");
            navigate("/quizResult");

            //Reset all custom context data
            setQuestionInfo([]);
          }
          else {
            try{
              // console.log(userCredential);
              refreshToken();
              getResultHandler();
            }catch(error)
            {
              console.log(error);
            }
            
          }

        })
        .catch((error) => {
            console.log(error);
        });
        
        
  }
  useEffect(()=>{
     console.log(response);
  },[response,rightAns]);
  useEffect(()=>{
     console.log(resultList);
     console.log(result);
  },[resultList,result])
  useEffect(()=>{
    // console.log(accessToken);
  },[accessToken])
  return (
    <>
    {(current<=end)?
    <div className='bg-[#2A1B3D]  flex-col flex items-center justify-center h-screen  '>
      <div className='question text-3xl text-white font-abc pb-2 flex items-center justify-center border-2  border-purple-600 h-[10rem] w-[50rem] text-center rounded-lg mt-[3rem] mb-[1rem] '>
        {questionInfo[current].question}
      </div>

      <div className='options'>
      <label
                
                className={`option1 text-center text-white text-xl font-abc pb-0 border border-1 h-[4.5rem] w-[35rem] mb-[1rem] rounded-lg flex items-center justify-center ${
                  selectedOption === 1 ? 'bg-green-500' : 'bg-[#2A1B3D]  hover:bg-green-800'
                }`}
              >
                 <input
                  type='radio'
                  onChange={changeHandler}
                  name='option'
                  value={1}
                  checked={selectedOption === 1} // Check the radio button if it's the selected option
                  style={{ display: 'none' }} // Hide the actual radio button
                />
                {questionInfo[current].options1}
        {/* <div className='option1 option1 text-center text-white text-xl font-abc pb-0 border border-1 h-[4.5rem] w-[35rem] mb-[1rem] rounded-lg flex items-center justify-center' >
          <input 
          type="radio"
          onClick={changeHandler}
          //onChange={changeHandler}
          name="option"
          value={1}
          id='option1' />
          <label htmlFor="option1">{questionInfo[current].options1}</label>
        </div> */}
        </label>

        <label
                
                className={`option2 text-center text-white text-xl font-abc pb-0 border border-1 h-[4.5rem] w-[35rem] mb-[1rem] rounded-lg flex items-center justify-center ${
                  selectedOption === 2 ? 'bg-green-500' : 'bg-[#2A1B3D] hover:bg-green-800'
                }`}
              >
                 <input
                  type='radio'
                  onChange={changeHandler}
                  name='option'
                  value={2}
                  checked={selectedOption === 2} // Check the radio button if it's the selected option
                  style={{ display: 'none' }} // Hide the actual radio button
                />
                {questionInfo[current].options2}
                </label>


                <label
                
                className={`option3 text-center text-white text-xl font-abc pb-0 border border-1 h-[4.5rem] w-[35rem] mb-[1rem] rounded-lg flex items-center justify-center ${
                  selectedOption === 3 ? 'bg-green-500' : 'bg-[#2A1B3D] hover:bg-green-800'
                }`}
              >
                 <input
                  type='radio'
                  onChange={changeHandler}
                  name='option'
                  value={3}
                  checked={selectedOption === 3} // Check the radio button if it's the selected option
                  style={{ display: 'none' }} // Hide the actual radio button
                />
                {questionInfo[current].options3}
                </label>

                <label
                
                className={`option4 text-center text-white text-xl font-abc pb-0 border border-1 h-[4.5rem] w-[35rem] mb-[1rem] rounded-lg flex items-center justify-center ${
                  selectedOption === 4 ? 'bg-green-500' : 'bg-[#2A1B3D] hover:bg-green-800'
                }`}
              >
                 <input
                  type='radio'
                  onChange={changeHandler}
                  name='option'
                  value={4}
                  checked={selectedOption === 4} // Check the radio button if it's the selected option
                  style={{ display: 'none' }} // Hide the actual radio button
                />
                {questionInfo[current].options4}
                </label>
        
        {/* <div className='option2  text-center text-white text-xl font-abc pb-0 border border-1 h-[4.5rem] w-[35rem] mb-[1rem] rounded-lg flex items-center justify-center'>
            <input
            type="radio"
            onClick={changeHandler}
            name="option"
            value={2}
            id="option2"/>
            <label htmlFor="option2">{questionInfo[current].options2}</label>
        </div> */}

        {/* <div className='option3  text-center text-white text-xl font-abc pb-0 border border-1 h-[4.5rem] w-[35rem] mb-[1rem] rounded-lg flex items-center justify-center'>
            <input
            type="radio"
            onClick={changeHandler}
            name="option"
            value={3}
            id="option3"/>
            <label htmlFor="option3">{questionInfo[current].options3}</label>
        </div> */}

        {/* <div className='option4  text-center text-white text-xl font-abc pb-0 border border-1 h-[4.5rem] w-[35rem] mb-[1rem] rounded-lg flex items-center justify-center'>
            <input
            type="radio"
            onClick={changeHandler}
            name="option"
            value={4}
            id="option4"/>
            <label htmlFor="option4">{questionInfo[current].options4}</label>
        </div> */}

      </div>
      <br />
      <div className='flex space-x-[45rem]'>
        {(current>0)?
        <div className='ml-[0rem] flex'>
        <div className="py-[0.5rem] pl-[0rem] pb-1">
                    <button className="relative  inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-xl font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800" onClick={handlePreviousClick}>
                    <span className="relative px-5 py-2 transition-all ease-in duration-75 bg-white dark:bg-[#2A1B3D] rounded-md group-hover:bg-opacity-0">
                    Previous
                    </span>

                    </button>
                    
        </div>
        
        </div>:""}
        {(current<(end))?<div className='ml-[0rem] flex'>
                    <div className="py-[0.5rem] pl-[0rem] pb-1">
                                <button className="relative  inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-xl font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800" onClick={handleNextClick}>
                                <span className="relative px-5 py-2 transition-all ease-in duration-75 bg-white dark:bg-[#2A1B3D] rounded-md group-hover:bg-opacity-0">
                                Next
                                </span>

                                </button>
                                
                    </div>
                    
                    </div>
        :""}
      </div>
      <br />
      {/* <div>
        <button onClick={handleSubmitNext}>Submit and Next</button>
        
      </div> */}
      <div className='ml-[0rem] flex'>
                    <div className="">
                                <button className="relative  inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-xl font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800" onClick={handleSubmitNext}>
                                <span className="relative px-5 py-2 transition-all ease-in duration-75 bg-white dark:bg-[#2A1B3D] rounded-md group-hover:bg-opacity-0">
                                Submit and Next
                                </span>

                                </button>
                                
                    </div>
                    
                    </div>
    </div>
    :
    <div className="bg-[#2A1B3D] h-screen">
      
      <div className='h-screen bg-[#2A1B3D]'>
    <div className='  flex  justify-center'>
        <div className='h-[30rem] w-[35rem] '>
        <Lottie animationData={Submit}/>
        </div>
    
    </div>
    <div className='flex mt-[2rem] justify-center'><Link to="/"> 
        <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-xl font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800" onClick={getResultHandler}>
                <span className="relative px-7 py-3 transition-all ease-in duration-75 bg-white dark:bg-[#2A1B3D] rounded-md group-hover:bg-opacity-0">
                Submit the Quiz
                </span>
        </button></Link> 
    </div>
      </div>
      {/* <div className='ml-[0rem] flex'>
                    <div className="">
                                <button className="relative  inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-xl font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800" onClick={getResultHandler}>
                                <span className="relative px-5 py-2 transition-all ease-in duration-75 bg-white dark:bg-[#2A1B3D] rounded-md group-hover:bg-opacity-0">
                                Submit the Quiz
                                </span>

                                </button>
                                
                    </div>
                    
                    </div> */}
    {/* <button onClick={getResultHandler}>Submit the quiz</button>  */}
    </div>}
    
    </>
  )
}

export default Quiz
