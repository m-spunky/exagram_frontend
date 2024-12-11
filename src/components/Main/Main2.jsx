import React, { useContext, useState } from "react";
import './Main.css';
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";
import axios from "axios";

const Main = () => {
    const { onSent, recentPrompt, showResult, loading, resultData, setInput, input } = useContext(Context);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSend = async () => {
        if (!input && !selectedFile) return;
        const formData = new FormData();
        formData.append("message", input);
        if (selectedFile) {
            formData.append("file", selectedFile);
        }

        try {
            const response = await axios.post("http://localhost:5000/process", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setInput(""); // Clear input field
            setSelectedFile(null); // Clear file input
            onSent(response.data.message); // Update the app state with the response
        } catch (error) {
            console.error("Error sending data to the Flask API:", error);
        }
    };

    return (
        <div className="main">
            <div className="nav">
                <p>Gemini</p>
                <img src={assets.user_icon} alt="user icon" />
            </div>
            <div className="main-container">
                {!showResult ? (
                    <>
                        <div className="greet">
                            <p>
                                <span>Hello, vedant</span>
                            </p>
                            <p>How can I help you today?</p>
                        </div>
                        <div className="cards">
                        <div className="card">
                        <p>suggest beautiful places to see on </p>
                        <img src={assets.compass_icon} alt=""/>
                    </div>
                    <div className="card">
                        <p>briefly summarize this concept:urband planning  </p>
                        <img src={assets.bulb_icon} alt=""/>
                    </div>
                    <div className="card">
                        <p>brainstorm  team bonding activities for our work</p>
                        <img src={assets.message_icon} alt=""/>
                    </div>
                    <div className="card">
                        <p>Improve the readability of the following code</p>
                        <img src={assets.code_icon} alt=""/>
                    </div>
                        </div>
                    </>
                ) : (
                    <div className="result">
                        <div className="result-title">
                            <img src={assets.user_icon} alt="" />
                            <p>{recentPrompt}</p>
                        </div>
                        <div className="result-data">
                            <img src={assets.gemini_icon} alt="" />
                            {loading ? (
                                <div className="loader">
                                    <hr />
                                    <hr />
                                    <hr />
                                </div>
                            ) : (
                                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
                            )}
                        </div>
                    </div>
                )}
                <div className="main-bottom">
                    <div className="search-box">
                        <input
                            onChange={(e) => setInput(e.target.value)}
                            value={input}
                            type="text"
                            placeholder="Enter prompt here"
                        />
                        <input type="file" onChange={handleFileChange} />
                        <div>
                            <img src={assets.gallery_icon} alt="" />
                            <img src={assets.mic_icon} alt="" />
                            {input || selectedFile ? (
                                <img onClick={handleSend} src={assets.send_icon} alt="" />
                            ) : null}
                        </div>
                    </div>
                    <p className="bottom-info">
                        Gemini may display inaccurate info, including people so double-check its response.
                    </p>
                </div>
            </div>
        </div>
    );
};
export default Main;
