import React from 'react';

const footer = () => (
    <footer className="footer-light">
        <div className="container">
            <div className="flex flex-column">
                <div className="social-icons flex justify-content-center" data-aos='fade-up' data-aos-delay='300' data-aos-duration="800">
                    <a href="https://twitter.com/100Daysventures" target="_blank" rel="noreferrer"><i className="fa-brands fa-twitter"></i></a>
                    <a href="https://medium.com/@100daysventures.com" target="_blank" rel="noreferrer"><i class="fa-brands fa-medium"></i></a>
                    <a href="https://discord.gg/100daysventures" target="_blank" rel="noreferrer"><i className="fa-brands fa-discord"></i></a>
                </div>
                <div className='align-self-center' data-aos='fade-up' data-aos-delay='300' data-aos-duration="800">
                    <img alt="" className="f-logo mx-auto mt-2" src="./img/logo.gif" width="150px" />
                    <div className='mt-5'>
                        <span className='text-white'>&copy; Copyright 2022</span>
                    </div>
                </div>
            </div>
        </div>
    </footer>
);
export default footer;