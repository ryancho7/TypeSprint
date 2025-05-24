// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Race() {

//     const navigate = useNavigate();

//     const sampleText = "Test run"
//     // const sampleText = "The quick brown fox jumps over the lazy dog, but only after sipping some cold lemonade under the blazing summer sun.";
//     const textArray = sampleText.split(" ");

//     const [ currentInput, setCurrentInput ] = useState("");
//     const [ currentWordIndex, setCurrentWordIndex ] = useState(0);
//     const [ status, setStatus ] = useState("waiting");
//     const [ error, setError ] = useState(false);
//     const [startTime, setStartTime] = useState(null);
//     const [ carPosition, setCarPosition ] = useState(0);

//     const [ messages, setMessages ] = useState([]);
//     const [input, setInput] = useState('');
//     let wsRef = useRef(null);

//     useEffect(() => {
//         const ws = new WebSocket("ws://localhost:3000/chatSocket");
//         wsRef.current = ws;

//         ws.onmessage = (event) => {
//             console.log("Received message:", event.data);
//             const chat = event.data;
//             setMessages((prev) => [...prev, chat]);
//         };

//         return () => {
//             ws.close();
//         };

//     }, []);

//     const sendMessage = () => {
//         if (wsRef.current && wsRef.current.readyState === 1) {
//             wsRef.current.send(input);
//             console.log("Sent message:", input);
//             setInput('');
//         }
//     }


//     const handleInputChange = (e) => {
//         const value = e.target.value;

//         if (status === "waiting") {
//             setStatus("started");
//             setStartTime(Date.now());
//         }

//         // attempted finish
//         if(value.endsWith(" ")) {
//             const currWord = value.trim();
//             if(currWord !== textArray[currentWordIndex]) {
//                 setError(true);
//             } else {
//                 setCarPosition(carPosition+1);
//                 setCurrentWordIndex(currentWordIndex+1);
//                 setCurrentInput("");
//                 setError(false);
//                 // check if race is over
//                 if(currentWordIndex + 1 === textArray.length) {
//                     setStatus("finished");
//                 }
//             }
//         } else {
//             // update curr value
//             setCurrentInput(value);
//         }
        
//     }

//     const calculateWPM = () => {
//         if(status === "finished") {
//             const min = (Date.now() - startTime) / 1000 / 60;
//             return Math.round((textArray.length / min));
//         }
//         return 0;
//     }


//     return (
//         <div>
//             <h1>WebSocket Chat Demo</h1>
//             <input
//                 value={input}
//                 onChange={e => setInput(e.target.value)}
//                 placeholder="Type a message"
//             />
//             <button onClick={sendMessage}>Send</button>
//             <div>
//                 <h3>Chat History</h3>
//                 {messages.map((msg, idx) => <div key={idx}>{msg}</div>)}
//             </div>
//         </div>
//         // <div className="flex flex-col gap-[100px] justify-center items-center bg-[#1E1E1E] min-h-screen w-full">
//         //     <h1 className="text-xl">Race Screen</h1>
//         //     <div className="w-[80%]">
//         //         <p
//         //             className="text-white transition-all duration-1000 bg-slate-500"
//         //             style={{ marginLeft: `${(carPosition / textArray.length) * 100}%` }}
//         //         >
//         //             🏎️
//         //         </p>
//         //     </div>
//         //     <div>
//         //         {textArray.map((word, index) => {
//         //             let className = "px-1";
//         //             if(index === currentWordIndex) {
//         //                 className += " text-white underline";
//         //                 if(error) {
//         //                     className = "underline text-red-500"
//         //                 }
//         //             } else if(index < currentWordIndex) {
//         //                 className += " text-green-400";
//         //             } else {
//         //                 className += " text-gray-500"
//         //             }
//         //             return (
//         //                 <span key={index} className={className}>
//         //                     {word}
//         //                 </span>
//         //             )
//         //         })}
//         //     </div>
//         //     <input
//         //         type="text"
//         //         className="bg-white text-black px-4 py-2 rounded outline-none"
//         //         value={currentInput}
//         //         onChange={handleInputChange}
//         //         disabled={status === "finished"}
//         //         placeholder="Start typing here"
//         //     />
//         //     {status === "finished" && (
//         //         <div>
//         //             <h1 className="text-white">Finished!</h1>
//         //             <p className="text-white">Final WPM: {calculateWPM()}</p>
//         //             <button 
//         //                 className="border px-[213px] py-2 rounded-[40px] text-white transition duration-300 ease-in-out hover:text-[#1E1E1E] hover:bg-white"
//         //                 onClick={() => window.location.reload()}
//         //             >
//         //                 Race Again
//         //             </button>
//         //             <button 
//         //                 className="border px-[213px] py-2 rounded-[40px] text-white transition duration-300 ease-in-out hover:text-[#1E1E1E] hover:bg-white"
//         //                 onClick={() => navigate('/dashboard')}
//         //             >
//         //                 Go to Dashboard
//         //             </button>
//         //         </div>                
//         //     )}
//         // </div>
//     )
// }
  

import React, { useEffect, useRef, useState } from 'react';

export default function Race() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const wsRef = useRef(null);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:3000/chatSocket");
        wsRef.current = ws;

        ws.onopen = () => console.log("✅ WebSocket connected");
        ws.onmessage = (event) => {
            console.log("📩 Received:", event.data);
            setMessages((prev) => [...prev, event.data]);
        };
        ws.onerror = (e) => console.error("WebSocket error:", e);

        return () => {
            ws.close();
        };
    }, []);

    const sendMessage = () => {
        if (wsRef.current && wsRef.current.readyState === 1) {
            console.log("📤 Sending:", input);
            wsRef.current.send(input);
            setInput('');
        } else {
            console.warn("WebSocket not ready");
        }
    };

    return (
        <div>
            <h1>WebSocket Chat Demo</h1>
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={sendMessage}>Send</button>
            <div>
                <h3>Chat History</h3>
                {messages.map((msg, idx) => (
                    <div key={idx}>{msg}</div>
                ))}
            </div>
        </div>
    );
}
