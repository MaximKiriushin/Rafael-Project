import React from 'react'
import { useState } from "react"
import Axios from 'axios'
import './chatBot.css';
import logo from './chatbotLogo.png';

function ChatBot() {



  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [status, setStatus] = useState()
  let attackName = "", siteName = "", filePath = "", packgeId = 0



  /**
   * This the center function the checking the user input and sending answer in return
   */
  const sendMessage = () => {
    if(message.toLowerCase().slice(0, 15) === "give info about" && message.toLowerCase().slice(-6) === "attack"){
      giveDBinfo();
    }
    else if (message.toLowerCase().slice(0, 5) === "check" && message.toLowerCase().slice(-4) === "site"){
      virusTotalCheck()
    }else if(message.toLowerCase().slice(0, 8) === "analysis" && message.toLowerCase().slice(-4) === "file"){
      sendAnalysisReq();
    }else if(message.toLowerCase().slice(0, 17) === "get score with id" && message.toLowerCase().slice(-6) === "please"){
      getAnalysisReq();
    }
    else if(message.toLowerCase() === "help"){
      setMessages(oldMessages => [...oldMessages, {message, place: 0}]);
      setMessages(oldMessages => [...oldMessages, {message:  `Hello For info about a attack: "give info about <attack name> attack" | For site inspect: "check <URL> site" | To analysis file use : "analysis <path> file" | To get report on the analysis : "get report with id <id> please | To clear the chat type "clear" | WARNING: You can use the virusTotal scan only 4 time a minute Good luck :)`, place: 5}]);
    }else if(message.toLowerCase() === "clear"){
      setMessages([])
    }else {
      setMessages(oldMessages => [...oldMessages, {message, place: 0}]);
      setMessages(oldMessages => [...oldMessages, {message: "No answer for this one sorry", place: 4}]);
    }
  }


  /**
   * This fucntion is taking the attack name that we want to check and searching it on the db and returning info about that attack
   */
  function giveDBinfo(){
    attackName = message.slice(16,-7)
      Axios.post("http://localhost:3001/getInfoAboutName", {
        attackName: attackName
      }).then(attacks => {
        setMessages(oldMessages => [...oldMessages, {message, place: 0}]);
        if(attacks['data']["0"] !== undefined){
          setMessages(oldMessages => [...oldMessages, {message: attacks['data']["0"], place: 1}]);
        }else{
          setMessages(oldMessages => [...oldMessages, {message: "Cant find this attack name", place: 2}]);
        }
      }).catch(err => {
          console.log(err)

        })
  }


  /**
   * This function is taking the site url and checking it on the virustotal api
   * returningt to the user: how many checks it did and how many positive of them
   */
  function virusTotalCheck(){
    siteName = message.slice(6, -5)
    Axios.post("http://localhost:3001/getVirusTotalInfo", {
      siteName: siteName
      }).then(checkResult => {
        setMessages(oldMessages => [...oldMessages, {message, place: 0}]);
        if(checkResult !== "File doesnt exist"){
          setMessages(oldMessages => [...oldMessages, {message: checkResult['data'], place: 3}]);
        }else{
          setMessages(oldMessages => [...oldMessages, {message: "None info was found", place: 2}]);
        }
      }).catch(err => {
          console.log(err)
        })
  }

  /**
   * This function is taking the file path from the user and searching it on cuckoo sandbox api
   * returning to the user: the task id that he can search it later on
   */
  function sendAnalysisReq(){
    filePath = message.slice(9, -5)
    Axios.post("http://localhost:3001/sendAnalysis", {
      filePath: filePath
      }).then(sendAnalysis => {
        console.log(sendAnalysis)
        setMessages(oldMessages => [...oldMessages, {message, place: 0}]);
        if(sendAnalysis['data'] !== "Error in packge"){
          setMessages(oldMessages => [...oldMessages, {message: sendAnalysis['data']['task_id'], place: 6}]);
        }else{
          setMessages(oldMessages => [...oldMessages, {message: "There was an error, check the file path.", place: 7}]);
        }

      }).catch(err => {
          console.log(err)
        })

  }



  /**
   * This function is getting the task id from the user and searching in on the cuckoo sandbox api
   * returning to the user: the score of the file from 0 to 10
   */
  function getAnalysisReq(){
    packgeId = parseInt(message.slice(18,-7))
    Axios.post("http://localhost:3001/getAnalysis", {
      packgeId: packgeId
      }).then(analysisResult => {
        setMessages(oldMessages => [...oldMessages, {message, place: 0}]);
        if (analysisResult['data'] !== "Cant find this id."){
          setMessages(oldMessages => [...oldMessages, {message: analysisResult['data']['score'], place: 8}]);
        }else{
          setMessages(oldMessages => [...oldMessages, {message: analysisResult['data'], place: 9}]);
        }       
      }).catch(err => {

          console.log(err)

        })

  }


  /**
   * Checking the server status in the begning of the program ONLINE/OFFLINE
   */
  function checkStatus(){
    Axios.get('http://localhost:3001/foo')
    .catch(function (error) {
      if(error.response === undefined){
        setStatus(0);
      }else if(error.response.status === 404){
        setStatus(1); 
      }
    });
}


  /**
   * runing in the begining of the program one time
   */
  React.useEffect(() => {
    checkStatus()
  },[]);





//give info about vnc attack
//check www.google.com site
  return (
    <div className='chatbot'>

      <div className="chatBotBox">

        <div className="upperSide">

          <h3 className="botName"><div className="botNameAndLogo">Billi <img src={logo} className="botLogo"/> </div> 

            <div className={status === 1 ? "Online" : "Offline"}>

            {status === 1 ? <h3>Online</h3> : <h3>Offline</h3>}

            </div>

          </h3>

        </div>

          <div className="messgesSend">

          {messages.map((val, index) => {<p>  {val.message.Name} <br/> {val.message.Description}</p>

            return <div className={val.place === 0 ? "sendFromUser" : "sendFromServer"} key={index}>{val.place === 0 ? <p> :You <br/> {val.message} </p> :  val.place === 2 || val.place === 4 || val.place === 5 || val.place === 7 || val.place === 9 ? <p> Billi: <br/> {val.message} </p> : val.place === 8 ? <p> Billi: <br/> Score: {val.message} /10 </p> : val.place === 6 ? <p> Billi: <br/> Task id: {val.message} <br/> I recommend you to check this id in 8 minuts</p> : val.place === 1 ? <p>  Billi: <br/> Name: {val.message.Name} <br/> Description: {val.message.Description} <br/> AttackId: {val.message.AttackId} <br/> x_mitre_platforms: {val.message.x_mitre_platforms} <br/> x_mitre_detection: {val.message.x_mitre_detection} <br/> phase_name: {val.message.phase_name} </p> : <p>  Billi: <br/> Scan ID = {val.message.scan_id} <br/> Total checks = {val.message.total} <br/> Positives results = {val.message.positives}</p>}</div>

          })}

        </div>

        <div className="sendOptions">

          <input type="text" className="textPadding" placeholder="Message..." onChange={(event) => {setMessage(event.target.value)}}/>

          <button className="buttonClass" onClick={sendMessage}>SEND</button>

        </div>

      </div>

      <div className="help">

          <h2> Type "help" for help</h2>

        </div>

    </div>

  );

}





export default ChatBot;