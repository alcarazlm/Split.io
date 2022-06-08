import Axios from 'axios'
import React,{useState,useEffect} from 'react';

function Data() {
  const fetchComments=async()=>{
    const response=await Axios('https://ocr.asprise.com/api/v1/receipt');
    console.log(response.data);    
  }
}
export default Data;