import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Breadcrump = () => {

    const currentPath = location.pathname;
    const navigate = useNavigate();
    const handleLink = (target: string): void => {
        navigate(`/${target}`);
    };

    const { decodedToken } = useContext(AuthContext);
    console.log(decodedToken.expired)

    const handleLogout = (): void => {
        localStorage.removeItem("token");
        navigate('/login');
    };

    if (!localStorage.getItem('token') ||  (`decodedToken.expired`) >= (`now`)) {
        handleLogout()
    }    

    // mobile menu
    const [isMenuVisible, setMenuVisibility] = useState(false);
    const toggleMenuBar = () => {
        setMenuVisibility(!isMenuVisible);
    }

    return (
    <>
        <div id='menu' onClick={()=>toggleMenuBar()}>

            <div id="menu-mobile-title" className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                </svg>
                <span>MENU</span>
            </div>

            <div className={`menu-list ${isMenuVisible ? 'visible' : 'hidden'}`}>

                <div className={`${currentPath === '/mybooking' || currentPath === '/bookslot' ? 'active' : ''}`}
                    onClick={() => handleLink('mybooking')}
                >
                    <a className="nav-link">My booking</a>
                </div>
                <div className={`${currentPath === '/myenquiry' || currentPath.includes('/myenquiry/') || currentPath === '/newenquiry' ? 'active' : ''}`}
                    onClick={() => handleLink('myenquiry')}
                >
                    <a className="nav-link">My enquiry</a>
                </div>
                <div>
                    <button type="button" className="btn btn-fullwidth btn-red"
                    onClick={() => handleLogout()}>Logout</button>
                </div>
            </div>
        </div>
    </>
    )
}

export default Breadcrump