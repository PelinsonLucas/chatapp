import React, {useState, useEffect} from 'react'
import "./Sidebar.css"
import { DonutLarge, MoreVert, Message, SearchOutlined } from '@mui/icons-material';
import { Avatar, IconButton } from '@mui/material';
import SidebarChat from './SidebarChat/SidebarChat';
import { Dropdown, MenuButton, Menu, MenuItem } from '@mui/base';
import axios from '../Axios.js';

const Sidebar = ({messages, setSelectedRoom, rooms, currentUsername, setSelectedSubscreen, setLoggedIn}) => {

  var [search, setSearch] = useState();
  var [image, setImage] = useState("");

  useEffect(() => {

    axios.get(`/user/getimage/${currentUsername}`)
    .then((response) => {
      setImage(JSON.parse(response.data.image));
    })
    .catch(() => {
      setImage("");
      return;
    });

  }, [currentUsername]);

  useEffect(() => {
    var chats = document.querySelectorAll(".sidebarChat"); 
    var chatsArray = Array.from(chats); 
    let sorted = chatsArray.sort((a, b) => {
      var aId = new Date(a.getAttribute('id'));
      var bId = new Date(b.getAttribute('id'));
      return (aId > bId) ? -1 : (aId < bId) ? 1 : 0;
    }); 
    sorted.forEach(e => document.querySelector(".sidebar-chats").appendChild(e)); 
  });

  const changeProfilePicture = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      var baseURL = reader.result;
      axios.post("/user/setimage", {
        image: JSON.stringify(baseURL),
      })
      .then(() => {
        setImage(baseURL);
      })
      .catch(() => {
        return;
      }
      )
    };
  };

  const newChat = () => {
    setSelectedSubscreen(2);
    setSelectedRoom(0);
  };

  const newPrivateChat = () => {
    setSelectedSubscreen(3);
    setSelectedRoom(0);
  };

  const disconnect = () => {
    axios.clearToken();
    setSelectedSubscreen(0);
    setSelectedRoom(0);
    setLoggedIn(false);
  };
  
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-headerAvatar">
          <IconButton component="label" htmlFor="profileimg-upload">
            <input type="file" label="image" name="myFile" id='profileimg-upload' accept=".jpeg, .png, .jpg" onChange={changeProfilePicture} />
            <Avatar src={image}/>
          </IconButton>
        </div>
        <div className="sidebar-headerRight">
          <IconButton>
            <DonutLarge/>
          </IconButton>
          <Dropdown>
            <MenuButton slots={{ root: IconButton }}>
              <Message/>
            </MenuButton>
            <Menu className='sidebar-menu-items'>
              <MenuItem onClick={newChat}>New Chat</MenuItem>
              <MenuItem onClick={newPrivateChat}>New Private Chat</MenuItem>
            </Menu>
          </Dropdown>
          <Dropdown>
            <MenuButton slots={{ root: IconButton }}>
              <MoreVert/>
            </MenuButton>
            <Menu className='sidebar-menu-items'>
              <MenuItem onClick={disconnect}>Disconnect</MenuItem>
            </Menu>
          </Dropdown>
        </div>
      </div>
      <div className="sidebar-search">
        <div className='sidebar-searchContainer'>
          <SearchOutlined/>
          <input type="text" value={search} onChange={e => {
              setSearch(e.target.value)}} 
              placeholder='Search chat'
          />
        </div>
      </div>
      <div className="sidebar-chats">
        { rooms !== undefined ? 
          rooms.map((room, id) => {
          if ( search !== undefined && !rooms[id].name.includes(search))
            return <p/>; 
          return (<SidebarChat key={room.created+room.name} room={room} setSelectedRoom={setSelectedRoom} 
                  messages={messages} highlight={search} currentUsername={currentUsername} 
                  setSelectedSubscreen={setSelectedSubscreen}/>);
        }) : <p/> }  
      </div>
    </div>
  );
}

export default Sidebar