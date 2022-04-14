import React from 'react'
import { useState } from "react"
import Axios from 'axios'
import logo from './searchLogo.png';
import './AttackSearchEngine.css';

function AttackSearchEngine() {
    const [attackList, setAttackList] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
   
    /*
    This useEffect is runing first in the begining of the program
    his functionality is to get all the data from the database into attackList useState
    */
    React.useEffect(() => {
    Axios.get("http://localhost:3001/getAttacksNames").then((response) => {
      setAttackList(response['data'])
    }).catch(err => {
      console.log(err)
    }) 
  
  },[]);
  return (
    <div className="App"> 
      <div className="content">
        <h1>Attack Search Engine</h1>
       <div className="searchBox">
         <input type="text" className="textPadding" placeholder="Search for filter..." onChange={(event) => {setSearchTerm(event.target.value)}}/>
         <img src={logo} className="botLogo"/>
         </div>
        <div className="attackNamesBox">
          {attackList.filter((val) => { //when the user typing something in the textbox the program immediately filters the sreach engine
            if(searchTerm === ""){
              return val
            }else if(val.Description.toLowerCase().includes(searchTerm.toLowerCase())) {
              return val
            }
          }).map((nameOfFile, index) => ( //showing the user all the attacks by there name but the filter is bu the description
            <div className="attacks" key={index}>{nameOfFile.Name}</div>
          ))}
        </div>
      </div>
    </div>
  );
}


export default AttackSearchEngine
