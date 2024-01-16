import React, { useState, useEffect }  from 'react'
import "./Chat.css"
import SendIcon from '@mui/icons-material/Send';
import { Avatar, IconButton } from '@mui/material';
import { MoreVert, SearchOutlined, AttachFile, InsertEmoticon, Mic } from '@mui/icons-material';
import axios from '../Axios';
import EmojiPicker from 'emoji-picker-react';
import { Dropdown, MenuButton, Menu, MenuItem } from '@mui/base';
import Axios from '../Axios';

const Chat = ({messages, setmessages, selectedRoom, currentUsername, rooms, currentName}) => {

  const [showEmojis, setShowEmojis] = useState(false);
  const [input, setInput] =  useState('');
  const [image, setImage] = useState('');
  const [privateChat, setPrivateChat] = useState(false);

  useEffect(() => { 
    document.getElementById("anchor").scrollIntoView({ behavior: "smooth" });
  },[selectedRoom]);

  useEffect(() => {
    var room = rooms.find(room => room._id === selectedRoom)
    setPrivateChat(room.privateChat);
    
    if (room.privateChat) 
    {
      let username = room.users.findLast(user => user !== currentUsername)
      if (username === undefined)
      {
        setImage('');
        return;
      }
      Axios.get(`/user/getimage/${username}`)
      .then((response) => {
        setImage(JSON.parse(response.data.image));
      })
      .catch(() => {
        setImage('');
        return;
      });
      return;
    }

    if (room.image === undefined || room.image === ""){
      setImage('');
      return;
    }
      
    setImage(JSON.parse(room.image));
  }, [rooms, selectedRoom, currentUsername]);
  
  var lastMessage = "";

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}${process.env.PUBLIC_URL}/#/join/${rooms.find(room => room._id === selectedRoom)._id}`);
  }

  const getRoomName = () => { 
    if (selectedRoom === "0" || rooms === undefined)
      return;
    var room = rooms.find(room => room._id === selectedRoom);
    if (room.privateChat)
      {
        var roomName = room.users.findLast(user => user !== currentUsername);
        if(roomName === undefined)
        {
          roomName = room.name;
        }
        return roomName;
      }
    return  rooms.find(room => room._id === selectedRoom).name;
  };

  const selectButton = () => {
    if (input === "" )
      return ( 
        <IconButton >
          <Mic className='MicButton'/>
        </IconButton> )
    else
      return (
        <IconButton  onClick={sendMessage}>
          <SendIcon />
        </IconButton>) 
  }

  const callback = function (mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList") {
        document.getElementById("anchor").scrollIntoView({ behavior: "smooth" });
      }
    }
  };
  
  useEffect(() => {

    const targetNode = document.getElementsByClassName("chat-body")[0];

    const config = { childList: true  };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

  }, []);

  const sendMessage = (e) => {
    e.preventDefault();

    axios.post('/messages/new', {
      message: input,
      name: currentName,
      timestamp: new Date().toUTCString(),
      username: currentUsername,
      chatid: selectedRoom
    })
    .then((response) => {
      setmessages([...messages, response.data]);
    }).catch(err => console.log(err));

    setInput("");
  }

    return (
      <div className={`chat ${selectedRoom ? "" : "noRoom" }`}>
        <div className='chat-header'>
          <Avatar src={image}/>
          
          <div className="chat-headerInfo">
            <h3>{getRoomName()}</h3>
            <p></p>
          </div>

          <div className="chat-headerRight">
            <IconButton>
              <SearchOutlined/>
            </IconButton>
            <IconButton>
              <AttachFile/>
            </IconButton>
            <Dropdown>
            <MenuButton slots={{ root: IconButton }}>
              <MoreVert/>
            </MenuButton>
            <Menu className='menu-items'>
              <MenuItem onClick={copyLink}>Copy Link</MenuItem>
            </Menu>
          </Dropdown>
          </div>    
        </div>

        <div className="chat-body">
          { 
            messages !== undefined ? messages.map((message) => 
            {
              if(message.chatid !== selectedRoom){
                return <p/>;
              }
              
              if(lastMessage.username === message.username || message.username === currentUsername || privateChat){
                lastMessage = message;
                return(
                  <p id={message.timestamp + message.username} className={`chat-message short ${message.username === currentUsername ? "sent": ""}`}> 
                      {message.message}
                    <span className='chat-time'>
                      {message.timestamp}
                    </span>
                  </p>
                )
              }
              else{
                lastMessage = message;
                return(
                  <p id={message.timestamp + message.username} className={`chat-message`}> 
                    <span className='chat-name'>
                        {message.name}
                      </span>
                      {message.message}
                    <span className='chat-time'>
                      {message.timestamp}
                    </span>
                  </p>
                )
              }
            }) : <p/>
          }
          <div id='anchor'></div>
        </div>
        {
            showEmojis ? 
              <EmojiPicker
                searchDisabled="true"
                previewConfig={{ showPreview: false }}
                emojiStyle="google"
                onEmojiClick={(e) => setInput((input) => input + e.emoji)}
                height="200px"
                width="100%"
              />
            : <></>
          }

        <div className="chat-footer">
          <IconButton onClick={() => setShowEmojis(!showEmojis)}>
            <InsertEmoticon/>
          </IconButton>
          <form>
            <input value={input} onChange={e => {
              setInput(e.target.value);
            }
            } placeholder="Type a message" type="text"/>
            <button onClick={sendMessage} type="submit">Send message</button>
          </form>
          { selectButton() }
        </div>

      </div>
    );
}

export default Chat