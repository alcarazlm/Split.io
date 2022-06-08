import { useState } from "react"
import OcrReader from "./OCReader"


function MockReceipt() {
    
  const [ocrData, setOcrData] = useState("");

  // Receive OCR data as a prop from the child component
  const onReadOcrData = (ocrData) => {
    setOcrData(ocrData)
  }
console.log("Data", ocrData);
console.log(typeof(ocrData));
  // Prop detects that the change image button was clicked
  const onRemoveClicked = () => {
    setOcrData("")
  }



  return (
    <div className="App">
      <header>Welcome to the OCR app!</header>
      <OcrReader 
        onReadOcrData={onReadOcrData}
        onRemoveClicked={onRemoveClicked}
      />
    </div>
  )
}

export default MockReceipt;