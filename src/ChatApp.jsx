import React,  { useEffect, useState } from 'react';
import Sidebar from './Components/Sidebar/Sidebar.jsx';
import "./ChatApp.css";
import Chat from './Components/Chat/Chat.jsx';
import Pusher from 'pusher-js';
import axios from './Components/Axios';
import Login from './Components/Login/Login';
import ChatOptions from './Components/ChatOptions/ChatOptions.jsx';
import { jwtDecode } from "jwt-decode";

var currentUsername = "";
var currentName = "";

const ChatApp = () => {

  var [rooms, setRooms] = useState([]);
  var [messages, setmessages] = useState([]);
  var [loggedIn, setLoggedIn] = useState(false);
  var [selectedRoom, setSelectedRoom] = useState("0");
  var [selectedSubscreen, setSelectedSubscreen] = useState(0);

  const selectScreen = () => {

    if(loggedIn)
      {
        return( 
        <div className='chatApp-container'>
          <Sidebar messages={messages} setSelectedRoom={setSelectedRoom} 
                   rooms={rooms} currentUsername={currentUsername} 
                   setSelectedSubscreen={setSelectedSubscreen} setLoggedIn={setLoggedIn}/> 
          { selectedSubscreen === 0 ? 
              <div className='empty-screen'> 
                <h1> Select a chat to start messaging </h1>
              </div> 
            : selectedSubscreen === 1 ? 
              <Chat messages={messages} selectedRoom={selectedRoom} currentUsername={currentUsername} 
                  rooms={rooms} currentName={currentName}/>
            : <ChatOptions selectedSubscreen={selectedSubscreen} setSelectedSubscreen={setSelectedSubscreen}
              currentUsername={currentUsername}/>
          }  
        </div>
        )
      }
    else
      return (
        <div className='chatApp-container'>
          <Login setLoggedIn={setLoggedIn} currentUsername={currentUsername}/>
        </div> 
      )  
  };

  useEffect(() => {

    const token = localStorage.getItem('token');
    if(!token) {
      setLoggedIn(false);
    }else{
      const user = jwtDecode(token);
        if(!user) { 
          localStorage.removeItem('token');
          setLoggedIn(false);
        }
        else {
          setLoggedIn(true);
          currentUsername = user.username;
          currentName = user.name;
        }
    }
    axios.get('/messages/sync')
      .then( (response) => {
        setmessages(response.data);
       })
      .catch( (err) => {
        console.log(err);
      });

      axios.get('/chats/sync')
      .then( (response) => {
        setRooms(response.data)
       })
      .catch( (err) => {
        console.log(err);
      });
  }, [loggedIn]);

  useEffect(() => {
    var pusher = new Pusher('d2fd8ef24054129ba743', {
      cluster: 'sa1'
    });
    const channel = pusher.subscribe('messages');
    channel.bind('inserted', (data) => { 
      
      if (data.users.includes(currentUsername)) {
        axios.get('/messages/get/'+ data.messageid)
        .then( (message) => {
          setmessages([...messages, message.data]);
        })
        .catch( (err) => {
          console.log(err);
        });
      }
    });

    return () => {
      channel.unsubscribe();
      channel.unbind_all();
    }
  },[messages]);

  return (
    <div className='chatApp'>
        {selectScreen()}
    </div>
  )
}

export default ChatApp