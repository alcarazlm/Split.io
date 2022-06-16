import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { Route, Routes } from "react-router-dom";
import ReceiptCam from './components/ReceiptCam';
import IntroPage from './components/IntroPage.jsx';
import PaymentPage from './components/paymentPage.jsx';
import DndPage from './components/DndPage';
import MockReceipt from './components/mockReceipt';
import Login from "../src/components/login";
import Register from  "../src/components/register"
import SelectList from './components/selectList';
import UserDetail from './components/userDetail/userDetail';
import ReceiptObject from './components/receipts/receipt';
import OCR from './components/testjson';
import OcrReader from './components/OCReader';

 
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<BrowserRouter>
  <Routes>
    <Route path="/" element={<IntroPage />} />
    <Route path="/camera/done" element={<OcrReader />} />
    <Route path="/login" element={<Login/>}/>
    <Route path="/camera" element={<ReceiptCam />} />
    <Route path='/select' element={<DndPage />} />
    <Route path='/users/:userId' element={<UserDetail/>}/>
    <Route path='/receipt/:receiptId' element={<ReceiptObject/>}/>
    <Route path='/pay' element={<PaymentPage />} />
    <Route path='/OCR' element={<MockReceipt />} />
    <Route path='/OCRInfo' element={<OCR/>} />
    <Route path='/register' element={<Register/>} />
    <Route path='/select1' element={<SelectList/>}/>
  </Routes>
 
</BrowserRouter>
);
 
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
 
