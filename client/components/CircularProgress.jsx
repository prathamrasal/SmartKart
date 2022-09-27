import { useEffect, useState } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function Confirmed({children}) {
  const [percentage, setPercentage] = useState(0);
  const [text, setText] = useState("💳");
  const [completed,setCompleted] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setPercentage(100), 100);
    const t2 = setTimeout(() =>{
        setText("✅");
        setCompleted(true);
    }, 600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="w-full justify-center flex-col h-full items-center" style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ height: "20rem", width: "20rem" }}>
        <CircularProgressbar
          value={percentage}
          text={text}
          styles={buildStyles({
            pathColor: "#2874F0"
          })}
        />
      </div>
      {completed&&<div className="mt-10">
        {children}
      </div>}
    </div>
  );
}
