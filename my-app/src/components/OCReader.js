import { Suspense, useState } from "react";
import { createWorker } from "tesseract.js"
import { Link } from 'react-router-dom';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { IconButton } from '@mui/material'
import axios from "axios";
import { auth, db } from '../firebase';
import './OCReader.css';

// OCR Statuses
const STATUSES = {
    IDLE: "",
    FAILED: "Failed to perform OCR",
    PENDING: "Processing...",
    SUCCEEDED: "Completed",
}

function OcrReader({ onReadOcrData, onRemoveClicked }) {
    const [selectedImage, setSelectedImage] = useState(null)
    const [ocrState, setOcrState] = useState(STATUSES.IDLE)
    const [data, setData] = useState(null);
    const worker = createWorker();
    const [name, setName] = useState("");


    const readImageText = async () => {
        const formData = new FormData();
        console.log(selectedImage);
        formData.append("image", selectedImage);
        formData.append("client_id", "Test" );
        const val = axios.post('https://ocr.asprise.com/api/v1/receipt', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }, function (error, response, body) {
            if (error) {
                console.error(error);
            } else {
                console.log(body);
            }
        }).then((response) => {
            console.log(response.data);
            setData(response.data)
        }, (error) => {
            console.log(error);
        });
        await worker.load()
        // Set the language to recognize
        await worker.loadLanguage("eng")
        await worker.initialize("eng")
        const { data: { text } } = await worker.recognize(selectedImage)
        await worker.terminate()

        onReadOcrData(text)
        setOcrState(STATUSES.SUCCEEDED)

    }

    const handleRemoveClicked = () => {
        setSelectedImage(null)
        onRemoveClicked()
        setOcrState(STATUSES.IDLE)
    }
    async function handleUpload(data) {
        let file_name = data.file_name;
        let itemsarray = data.receipts[0].items;
        let items = [];
        for (const element of itemsarray) {
        let item_name = element.description;
        let price = element.amount;
        let qty = 1;
        if (element.qty) {
            qty = element.qty;
        }
        let item = {"item_name": item_name, "price": price, "qty": qty};
        items.push(item);
        }
        let location = data.receipts[0].merchant_name;
        let subtotal = data.receipts[0].subtotal;
        let tax = data.receipts[0].tax;
        let tip = 0;
        // will need user input for this
        if (data.receipts[0].tip) {
            tip = data.receipts[0].tip;
        }
        db.collection("receipts").add({
        date_time: data.receipts[0].date,
        file_name: file_name,
        items: items,
        location: location,
        subtotal: subtotal,
        tax: tax,
        tip: tip,
        users: {}
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            db.collection('receipts').doc(docRef.id).update({
            'uid': `${docRef.id}`
            
            });
            setName(docRef.id);

        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });

    }
    return (
        <div>
            <div className="content">
                <h1>
                    Split.io
                </h1>
            </div>
            {selectedImage && (
                <div style={{ display: 'flex', justifyContent: 'center', }}>
                    <img className='img' style={{ width: '40vh', height: '70vh' }} src={URL.createObjectURL(selectedImage)} alt="scanned file" />
                </div>
            )}
            <div style={{position: 'inherit',top: '50%',left: '40%'}}>
                {selectedImage ?
                    <div style={{alignItems: 'center', justifyContent: 'center'}}>
                        <button className='button-55' onClick={readImageText}>Process the image with OCR</button>
                        <button
                            className='button-55' 
                            disabled={ocrState === STATUSES.PENDING}
                            onClick={handleRemoveClicked}
                        >
                            Use another image
                        </button>
                        <Link to='/OCRInfo' state={{ from: data }}>
                            <button className='button-55' >Continue</button>
                        </Link>
                    </div>
                    :
                    // <>
                    //     <p>Upload an image to process</p>
                    // <input
                    //     type="file"
                    //     name="ocr-image"
                    //     onChange={(event) => {
                    //         setSelectedImage(event.target.files[0])
                    //     }}
                    // />
                    <>
                        {/* <Button variant="contained" component="label" color="primary">
                            <PhotoCameraIcon>
                                <input
                                accept="image/*"
                                // className={classes.input}
                                // style={{ display: 'none' }}
                                // id="raised-button-file"
                                hidden
                                type="file"
                                />
                            </PhotoCameraIcon>
                        </Button> */}
                        <input accept="image/*" id="icon-button-file" type="file" hidden onChange={(event) => {
                            setSelectedImage(event.target.files[0])
                        }} />
                        <label htmlFor="icon-button-file">
                            <IconButton style={{ display: 'flex', justifyContent: 'center', }} color="primary" component="span">
                                <PhotoCameraIcon sx={{ fontSize: "100px" }}/>
                            </IconButton>
                        </label>
                        <h3>
                            Take/Select Photo of your Receipt!
                        </h3>

                    </>


                }
            </div>
            <div className="status">
                {ocrState}
            </div>
            <br />
        </div>
    )
}



export default OcrReader;