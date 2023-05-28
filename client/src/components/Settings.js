import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { useDropzone } from 'react-dropzone';


function Settings({setShowSettings}) {
  const { userId, setUserId } = useContext(UserContext);
  const [file, setFile] = useState(null);
  const [nickname, setNickname] = useState(userId.nickname);
  const navigate = useNavigate();

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
        setShowSettings((prev) => (!prev))
      } else {
        console.log('Error occurred during image upload:', response.status);
      }
    } catch (error) {
      console.error('Error occurred during image upload:', error);
    }
    setFile(null);
  };

  const handleNickNameChange = (event) => {
    setNickname(event.target.value);
  };

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="upload-container mb-6 flex flex-col justify-center items-center">
      <hr className="" />
      <div className="flex flex-col justify-center items-center">
        <div
          {...getRootProps()}
          className={`w-full px-3 py-2 border mb-2 flex justify-center rounded focus:outline-none focus:border-blue-500 ${
            file ? 'border-blue-300' : 'border-red-500'
          } ${isDragActive ? 'border-blue-500' : ''}`}
        >
          <input {...getInputProps()} />
          {file ? (
            <img
              src={URL.createObjectURL(file)}
              alt="Dropped Image"
              style={{ maxWidth: '100%', maxHeight: '200px' }}
            />
          ) : isDragActive ? (
            <p>Drop the file here...</p>
          ) : (
            <p>Drag and drop an image here, or click to select an image</p>
          )}
        </div>
      </div>
      <div className="flex flex-col justify-center items-center">
        <h4>Nickname:</h4>
        <input
          className="border-2 border-black"
          type="text"
          value={nickname}
          onChange={handleNickNameChange}
        />
        <button onClick={handleSubmit}>Update</button>
      </div>
    </div>
  );
}

export default Settings;