import React, { useEffect, useState } from "react";
import Breakpoint, { BreakpointProvider, setDefaultBreakpoints } from "react-socks";
import { Link } from '@reach/router';

setDefaultBreakpoints([
    { xs: 0 },
    { l: 1199 },
    { xl: 1200 }
]);

const NavLink = props => (
    <Link
        {...props}
        className={props.isCurrent ? 'active' : 'non-active'}
    />
);



const Header = function () {

    const [openMenu, setOpenMenu] = React.useState(false);
    
    const closeMenu = () => {
        setOpenMenu(false);
    };

    const [showmenu, btn_icon] = useState(false);

    useEffect(() => {
        // const header = document.getElementById("myHeader");
        // const totop = document.getElementById("scroll-to-top");
        // const sticky = header.offsetTop;
        // const scrollCallBack = window.addEventListener("scroll", () => {
        //     btn_icon(false);
        //     if (window.pageYOffset > sticky) {
        //         header.classList.add("sticky");
        //         totop.classList.add("show");

        //     } else {
        //         header.classList.remove("sticky");
        //         totop.classList.remove("show");
        //     } if (window.pageYOffset > sticky) {
        //         closeMenu();
        //     }
        // });
        // return () => {
        //     window.removeEventListener("scroll", scrollCallBack);
        // };
    }, []);
    return (
        <header id="myHeader" className='navbar white'>
            <div className='container'>
                <div className='row w-100-nav d-flex'>
                    <div className='logo px-0'>
                        <div className='navbar-title navbar-item'>
                            <NavLink to="/">
                                <img
                                    src="/img/logo.png"
                                    className="img-fluid d-block"
                                    alt="#"
                                />
                            </NavLink>
                        </div>
                    </div>
                    <BreakpointProvider>
                        <Breakpoint l down>
                            {showmenu &&
                                <div className='menu'>
                                    <div className='navbar-item'>
                                        <NavLink to="/activity" onClick={() => btn_icon(!showmenu)}>
                                            DOCUMENT
                                        </NavLink>
                                    </div>
                                    <div className='navbar-item'>
                                        <NavLink to="/activity" onClick={() => btn_icon(!showmenu)}>
                                            PROMOTION
                                        </NavLink>
                                    </div>
                                    <div className='navbar-item'>
                                        <NavLink to="/activity" onClick={() => btn_icon(!showmenu)}>
                                            ASTRO BANK
                                        </NavLink>
                                    </div>
                                    <div className='navbar-item'>
                                        <NavLink to="/activity" onClick={() => btn_icon(!showmenu)}>
                                            SMART BOND
                                        </NavLink>
                                    </div>
                                </div>
                            }
                        </Breakpoint>

                        <Breakpoint xl>
                            <div className='menu'>
                                <div className='navbar-item'>
                                    <NavLink to="/activity">
                                        DOCUMENT
                                        <span className='lines'></span>
                                    </NavLink>
                                </div>
                                <div className='navbar-item'>
                                    <NavLink to="/activity">
                                        PROMOTION
                                        <span className='lines'></span>
                                    </NavLink>
                                </div>
                                <div className='navbar-item'>
                                    <NavLink to="/activity">
                                        ASTRO BANK
                                        <span className='lines'></span>
                                    </NavLink>
                                </div>
                                <div className='navbar-item'>
                                    <NavLink to="/activity">
                                        SMART BOND
                                        <span className='lines'></span>
                                    </NavLink>
                                </div>
                            </div>
                        </Breakpoint>
                    </BreakpointProvider>

                    <div className='mainside'>
                        <div className='connect-wal'>
                            <NavLink to="/dashboard" >Open App</NavLink>
                        </div>
                    </div>

                </div>

                <button className="nav-icon" onClick={() => btn_icon(!showmenu)}>
                    <div className="menu-line white"></div>
                    <div className="menu-line1 white"></div>
                    <div className="menu-line2 white"></div>
                </button>

            </div>
        </header>
    );
}
export default Header;