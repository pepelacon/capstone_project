import React from "react";
import ItemsContainer from "./ItemsContainer";
import {SiInstagram, SiLinkedin, SiGithub } from "react-icons/si";



const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="flex justify-center">

        <ItemsContainer />
      </div>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10
      text-center pt-2 text-gray-400 text-sm pb-8"
      >
        <span>© 2023 . All rights reserved.</span>
        <span>Terms · Privacy Policy</span>
        <span
          
          className="p-2 cursor-pointer inline-flex items-center justify-center gap-4
        rounded-full mx-1.5 text-xl "
        >
            <a href="https://www.instagram.com/daniel_pryakhin/?igshid=MzNlNGNkZWQ4Mg%3D%3D">
                <SiInstagram />
            </a>
            <a href="https://www.linkedin.com/in/daniel-pryakhin/">
                <SiLinkedin />
            </a>
            <a href="https://github.com/pepelacon">
                <SiGithub />
            </a>
        </span>

      </div>
    </footer>
  );
};

export default Footer;