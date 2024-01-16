import React, { useState, useEffect } from 'react'
import Axios from '../../Axios';
import "./SidebarChat.css"
import { Avatar } from '@mui/material'

const SidebarChat = ({room, setSelectedRoom, messages, highlight, currentUsername, setSelectedSubscreen }) => {

  const [image, setImage] = useState('');

  const getId = () => {
    if (messages === undefined || Array.isArray(messages) === false )
      return "";
      var message = messages.findLast((element) => element.chatid === room._id );
    
      if (message === undefined)
        return "";

      return message.timestamp;
  };

  useEffect(() => {
    if (room.privateChat){
      let username = room.users.findLast(user => user !== currentUsername)
      if (username === undefined)
        return;

      Axios.get(`/user/getimage/${username}`)
      .then((response) => {
        setImage(JSON.parse(response.data.image));
      })
      .catch(() => {
        return;
      });
      return;
    }
    if (room.image === undefined || room.image === "")
      return;

    setImage(JSON.parse(room.image));
  }, [room, currentUsername]);

  const getLastMessage = () => {
    if (messages === undefined || Array.isArray(messages) === false)
      return "";

    var message = messages.findLast((element) => element.chatid === room._id );
    
    if (message === undefined)
      return "";
    
    return ( message.username===currentUsername ? message.message : message.name + ": " + message.message)
  }

  const highlightText = () => {
    var roomName = "";
    if (room.privateChat){
      roomName = room.users.findLast(user => user !== currentUsername);
      if(roomName === undefined)
      {
        roomName = room.name;
      }
    }
    else
      roomName = room.name;

    if (highlight !== undefined) {
      var index = roomName.toLowerCase().indexOf(highlight.toLowerCase());
      if (index !== -1) {
        return (
          <h2>
            {roomName.substring(0, index)}
            <span className="highlight">{roomName.substring(index, index + highlight.length)}</span>
            {roomName.substring(index + highlight.length)}
          </h2>
        );
      }
    }
    return <h2>{roomName}</h2>;
  } 

  const selectRoom = () => {
    setSelectedRoom(room._id);
    setSelectedSubscreen(1);
  }

  return (
    <div className='sidebarChat' id={getId()} onClick={selectRoom}>
        <Avatar src={image}/>
        <div className='sidebarChat-info'>
            {highlightText()}
            <p>{ getLastMessage() } </p>  
        </div>
    </div>
  )
}

export default SidebarChat