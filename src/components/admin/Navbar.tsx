import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../contexts/AuthContext";

const Navbar = () => {

    const currentPath = location.pathname;
    const navigate = useNavigate();
    const handleLink = (target: string): void => {
        navigate(`/admin/${target}`);
    }

    const { decodedAccessToken } = useContext(AuthContext);
    console.log(decodedAccessToken)

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        handleLink('login');
    };

    useEffect(() => {
        if (!localStorage.getItem('access_token') || (`decodedAccessToken.expired`) >= (`now`)) {
            handleLogout()
        }
    }, []);

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
                    <div className={`${currentPath.includes('/admin/admin') ? 'active' : ''}`}
                        onClick={()=>handleLink('admin')}
                    >
                        <a className="nav-link">Adminstrator</a>
                    </div>
                    <div className={`${currentPath === '/admin/delivery' ? 'active' : ''}`}
                        onClick={()=>handleLink('delivery')}
                    >
                        <a className="nav-link">Delivery List</a>
                    </div>
                    <div className={`${currentPath === '/admin/enquiry' || currentPath.includes('/enquiry/') ? 'active' : ''}`}
                        onClick={()=>handleLink('enquiry')}
                    >
                        <a className="nav-link">Enquiry List</a>
                    </div>
                    <div className={`${currentPath === '/admin/holiday' || currentPath.includes('/holiday/') ? 'active' : ''}`}
                        onClick={()=>handleLink('holiday')}
                    >
                        <a className="nav-link">Holiday</a>
                    </div>
                    <div className={`${currentPath === '/admin/supplier' || currentPath.includes('/supplier/') ? 'active' : ''}`}
                        onClick={()=>handleLink('supplier')}
                    >
                        <a className="nav-link">Supplier</a>
                    </div>
                    <div>            
                        <button className='btn btn-red w-100 mb-3 mb-md-0' onClick={()=>handleLogout()}>
                            Logout
                        </button>
                    </div>
                </div>    
            </div>
        </>
    )
}

export default Navbar