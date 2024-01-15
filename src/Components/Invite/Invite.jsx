import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../Axios.js';
import './Invite.css';

const Invite = () => {

    var { roomID } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios.post('/chats/join', {
            id: roomID
          })
          .then(() => { navigate('/')})
          .catch(err => console.log(err));
          
    }, [roomID, navigate]);

  return (
    <div className='invite-container'>
      <div className='chatApp-container'>
        <h1>Joining</h1>
      </div>
    </div>
  )
}

export default Invite