import { useState } from "react";

export default function Race() {

    const sampleText = "The quick brown fox jumps over the lazy dog, but only after sipping some cold lemonade under the blazing summer sun.";
    const textArray = sampleText.split(" ");

    const [ currentInput, setCurrentInput ] = useState("");
    const [ currentWordIndex, setCurrentWordIndex ] = useState(0);
    const [ status, setStatus ] = useState("waiting");
    const [ error, setError ] = useState(false);
    const [startTime, setStartTime] = useState(null);


    const handleInputChange = (e) => {
        const value = e.target.value;

        if (status === "waiting") {
            setStatus("started");
            setStartTime(Date.now());
        }

        // attempted finish
        if(value.endsWith(" ")) {
            const currWord = value.trim();
            if(currWord !== textArray[currentWordIndex]) {
                setError(true);
            } else {
                setCurrentWordIndex(currentWordIndex+1);
                setCurrentInput("");
                setError(false);
                // check if race is over
                if(currentWordIndex + 1 === textArray.length) {
                    setStatus("finished");
                }
            }
        } else {
            // update curr value
            setCurrentInput(value);
        }
        
    }

    const calculateWPM = () => {
        if(status === "finished") {
            const min = (Date.now() - startTime) / 1000 / 60;
            return Math.round((textArray.length / min));
        }
        return 0;
    }


    return (
        <div className="flex flex-col gap-[200px] justify-center items-center bg-[#1E1E1E] min-h-screen">
            <h1 className="text-xl">Race Screen</h1>
            <div>
                {textArray.map((word, index) => {
                    let className = "px-1";
                    if(index === currentWordIndex) {
                        className += " text-white underline";
                        if(error) {
                            className += " text-red-500"
                        }
                    } else if(index < currentWordIndex) {
                        className += " text-green-400";
                    } else {
                        className += " text-gray-500"
                    }
                    return (
                        <span key={index} className={className}>
                            {word}
                        </span>
                    )
                })}
            </div>
            <input
                type="text"
                className="bg-white text-black px-4 py-2 rounded outline-none"
                value={currentInput}
                onChange={handleInputChange}
                disabled={status === "finished"}
                placeholder="Start typing here"
            />
            {status === "finished" && (
                <p className="text-white">Final WPM: {calculateWPM()}</p>
            )}
        </div>
    )
}
  