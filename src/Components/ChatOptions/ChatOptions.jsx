import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatOptions.css';
import axios from '../Axios.js';
import avatar from '../../Assets/profile.png';

const ChatOptions = ({selectedSubscreen, setSelectedSubscreen, currentUsername, rooms, setRooms}) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [picture, setPicture] = useState(avatar);
  const [postImage, setPostImage] = useState('');
  const navigate = useNavigate();


  const handleSubmitChat = (e) => {
    e.preventDefault();

    axios.post('/chats/new', {
      name: name,
      created: new Date().toUTCString(),
      image: JSON.stringify(postImage),
      lastMessageId: "",
      privateChat: false,
      users: [currentUsername],
    }).then((response) => {
      setSelectedSubscreen(0);
      setName("");
      setPicture("");
      setRooms([...rooms, response.data]);
      navigate('/');
    })
    .catch(err => console.log(err))
  };

  const handleSubmitPrivateChat = (e) => {
    e.preventDefault();

    axios.post('/chats/new', {
      name: "privateChat",
      created: new Date().toUTCString(),
      image: "",
      lastMessageId: "",
      privateChat: true,
      users: [currentUsername, username],
    }).then((response) => {
      setSelectedSubscreen(0);
      setRooms([...rooms, response.data]);
      setUsername("");
      navigate('/');
    })
    .catch(err => console.log(err))
    
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      var baseURL = reader.result;
      setPostImage(baseURL);
      setPicture(URL.createObjectURL(event.target.files[0]));
    };
  }

  const getSubscreen = () => {
    if(selectedSubscreen === 2)
    {
      return (
        <div className='chatoptions-container'>
          <h1>Create Chat</h1>
          <form onSubmit={handleSubmitChat}>
            <label htmlFor='file-upload' className='picture'>
              <img src={picture} alt="Profile" />
            </label>
            <input type="file" label="image" name="myFile" id='file-upload' accept=".jpeg, .png, .jpg" onChange={handleImageChange} />
            <label className='input-field'>
              <input type="text" placeholder='Chat Name' value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <br />
            <button className='create-button' type="submit">Create</button>
          </form>
        </div>
      );
    }
    else if(selectedSubscreen === 3)
    {
      return (
        <div className='chatoptions-container'>
          <h1>Create Private Chat</h1>
          <form onSubmit={handleSubmitPrivateChat}>
            <label className='input-field'>
              <input type="text" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>
            <br />
            <button className='create-button' type="submit">Create</button>
          </form>
        </div>
      );
    }
  };

  return ( getSubscreen() );
};

export default ChatOptions;