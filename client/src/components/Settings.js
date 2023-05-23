import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext'



function Settings() {
    const { userId, setUserId} = useContext(UserContext) 
    const [file, setFile] = useState(null);
    const [nickname, setNickname] = useState(userId.nickname);
    const [profilePic, setProfilePic] = useState(userId.avatar);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
      
        const formData = new FormData();
        if (file === null) {
          formData.append('fileExists', 'false');
        } else {
          formData.append('fileExists', 'true');
          formData.append('avatar', file);
        }
        formData.append('nickname', nickname);
      
        try {
          const response = await fetch(`/user/${userId.id}`, {
            method: 'PATCH',
            body: formData,
          });
          if (response.ok) {
            const data = await response.json();
            setUserId(data);
          } else {
            console.log('Error occurred during image upload:', response.status);
          }
        } catch (error) {
          console.error('Error occurred during image upload:', error);
        }
      
        setFile(null);
      };

    const handleNickNameChange = (event) => {
        setNickname(event.target.value)
    }

    return (
        <div className="upload-container">  
        <h4 className='pi' >Change Profile Image</h4>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        {file && (
            <div>
                <img className='preview-image' src={file ? URL.createObjectURL(file) : profilePic} alt="Selected file" />
            </div>
        )}
        <h4>Nickname:</h4>
        <input onChange={handleNickNameChange} type="text" value={nickname} />
            <button onClick={handleSubmit}>Update</button>
        </div>
    );
    }
    export default Settings;