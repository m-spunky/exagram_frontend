import { createContext, useState } from "react";
import axios from "axios";
import './context.css'
export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const delayPara = (index, nextWord) => {
        setTimeout(function () {
            setResultData((prev) => prev + nextWord);
        }, 75 * index);
    };

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
    };

    // const formatResponse = (response) => {
    //     // Split the response into sections
    //     const sections = response.split('**').map(section => section.trim()).filter(Boolean);
    
    //     const formattedSections = sections.map((section, index) => {
    //         let sectionTitle = '';
    //         let sectionContent = section;
    
    //         // Determine the title of each section (Q1: MCQ, Q2: Short Answers, etc.)
    //         if (section.startsWith('Q1: MCQ')) {
    //             sectionTitle = 'Q1: MCQ';
    //         } else if (section.startsWith('Q2: Short Answers')) {
    //             sectionTitle = 'Q2: Short Answers';
    //         } else if (section.startsWith('Q3: Brief Answers')) {
    //             sectionTitle = 'Q3: Brief Answers';
    //         } else if (section.startsWith('Q4: Application-Based Questions')) {
    //             sectionTitle = 'Q4: Application-Based Questions';
    //         }
    
    //         // Split the answer key from the questions
    //         if (section.includes('Answer Key')) {
    //             const [questions, answerKey] = section.split('**Answer Key**');
    //             sectionContent = (
    //                 <>
    //                     <div key={index}>
    //                         <h4>{sectionTitle}</h4>
    //                         <p>{questions.trim()}</p>
    //                     </div>
    //                     <div>
    //                         <h4>Answer Key</h4>
    //                         <p>{answerKey.trim()}</p>
    //                     </div>
    //                 </>
    //             );
    //         } else {
    //             // Add line breaks for sub-questions
    //             sectionContent = section.split('. ').map((subQuestion, i) => (
    //                 <p key={i}>{subQuestion.trim()}.</p>
    //             ));
    //         }
    
    //         return (
    //             <div key={index} className="section">
    //                 <h4>{sectionTitle}</h4>
    //                 {sectionContent}
    //             </div>
    //         );
    //     });
    
    //     return formattedSections;
    // };
    
    
    // const onSent = async (prompt, file = null) => {
    //     setResultData("");
    //     setLoading(true);
    //     setShowResult(true);

    //     try {
    //         const formData = new FormData();
    //         if (prompt) {
    //             formData.append("message", prompt);
    //             setRecentPrompt(prompt);
    //         } else {
    //             formData.append("message", input);
    //             setRecentPrompt(input);
    //             setPrevPrompts((prev) => [...prev, input]);
    //         }
            // if (file) {
            //     formData.append("file", file);
            // }
    //         // Call Flask API
    //         const response = await axios.post("http://localhost:5000/process", formData, {
    //             headers: { "Content-Type": "multipart/form-data" },
    //         });

    //         const apiResponse = response.data.message; // API response from Flask
    //         // const responseArray = apiResponse.split("**");
    //         // let newResponse = "";

    //         // Format response: bold text and line breaks
    //         // for (let i = 0; i < responseArray.length; i++) {
    //         //     if (i === 0 || i % 2 !== 1) {
    //         //         newResponse += responseArray[i];
    //         //     } else {
    //         //         newResponse += "<b>" + responseArray[i] + "</b>";
    //         //     }
    //         // }
    //         // let newResponse2 = newResponse.split("*").join("</br>");
    //         // let newResponseArray = newResponse2.split(" ");

    //         let newResponseArray = apiResponse.split(" ");
    //         for (let i = 0; i < newResponseArray.length; i++) {
    //             const nextWord = newResponseArray[i];
    //             delayPara(i, nextWord + " ");
    //         }
    //         console.log(apiResponse);
    //     } catch (error) {
    //         console.error("Error fetching data from API:", error);
    //         setResultData("Error: Unable to process your request.");
    //     } finally {
    //         setLoading(false);
    //         setInput("");
    //     }
    // // };
    // const onSent = async(prompt, files) => {
    //     setResultData("")
    //     setLoading(true)
    //     setShowResult(true)
    //     let formData = new FormData();
    //     formData.append('message', prompt);
        
    //     // Append all files to the formData
    //     files.forEach(file => {
    //         formData.append('files', file);
    //     });
    
    //     try {
    //         const response = await axios.post("http://localhost:5000/process", formData, {
    //             headers: { "Content-Type": "multipart/form-data" },
    //         });
    //         const apiResponse = response.data.message;
    //         console.log(apiResponse);
    //         // setResultData(apiResponse);


    //         let newResponseArray = apiResponse.split(" ");
    //         for (let i = 0; i < newResponseArray.length; i++) {
    //             const nextWord = newResponseArray[i];
    //             delayPara(i, nextWord + " ");
    //         }
    //     } catch (error) {
    //         console.error("Error Details:", error.response ? error.response.data : error.message);
    //         setResultData("Error: Unable to process your request.");
    //     }
    
    //     setLoading(false);
    //     setInput("");
    // }
    const onSent = async(prompt, files) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);
    
        // Ensure files is an array (in case only one file is selected)
        const fileArray = Array.isArray(files) ? files : [files];
    
        let formData = new FormData();
        formData.append('message', prompt);
    
        // Append all files to the formData
        fileArray.forEach((file) => {
            formData.append('files', file);
        });
    
        try {
            const response = await axios.post("http://localhost:5000/process", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const apiResponse = response.data.message;
            const responseArray = apiResponse.split("**");
            let newResponse = "";


            for (let i = 0; i < responseArray.length; i++) {
                if (i === 0 || i % 2 !== 1) {
                    newResponse += responseArray[i];
                } else {
                    newResponse += "<b>" + responseArray[i] + "</b>";
                }
            }
            let newResponse2 = newResponse.split("*").join("</br>");
            let newResponseArray = newResponse2.split(" ");
            for (let i = 0; i < newResponseArray.length; i++) {
                const nextWord = newResponseArray[i];
                delayPara(i, nextWord + " ");
            }
            console.log(apiResponse);
            // console.log(apiResponse);
            // const formattedResponse = formatResponse(apiResponse);
            // setResultData(formattedResponse);
        } catch (error) {
            console.error("Error Details:", error.response ? error.response.data : error.message);
            setResultData("Error: Unable to process your request.");
        }
    
        setLoading(false);
        setInput("");
    };
        
    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
    };

    return <Context.Provider value={contextValue}>{props.children}</Context.Provider>;
};

export default ContextProvider;
