import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar"
import { AuthContext } from "../../contexts/AuthContext";

const AdminInsert = () => {

    const { decodedAccessToken } = useContext(AuthContext);

    const navigate = useNavigate();
    const handleLink = (target: string): void => {
        navigate(`/admin/${target}`);
    };

    useEffect(() => {
        if (!decodedAccessToken) {
            handleLink('login')
        }
    });

    const [username, setUsername] = useState('');
    const [length, setLength] = useState(12);
    const [isValidUsername, setIsValidUsername] = useState(true);

    const handleIncrease = (index : number) => {
        setLength(length+index)
    }
    const handleDecrease = (index : number) => {
        setLength(length-index)
    }

    const handleUsernameChange = (e) => {
        const newUsername = e.target.value;
        setUsername(newUsername);
    
        // Check if the name does not contain number and special characters
        const nameRegex = /^[A-Za-z\s]+$/;
        setIsValidUsername(nameRegex.test(newUsername));
    };

    const handleSubmit = () => {
        try {
            axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/backend_admin.php`, {
                action: 'insertAdmin',
                aid: parseInt(decodedAccessToken.id, 10),
                username,
                length
            }).then(function(response){
                if (response.data.status === 200) {
                    navigate('/admin/admin', { state: { message: `Insert an new admin successfully!` } });
                } else {
                    console.error('Insert an new admin failed');
                }
            });
        } catch (error) {
            console.error('An error occurred during inserting:', error);
        }
    }
    
    return (
        <>
            <Navbar />

            <div id="content" className="row">
                <div className="col-md-12">

                    <h2 className="text-center mb-3">Add new user</h2>

                    <div className="row">
                        <div className="col"></div>
                        <div className="col-md-9">

                            <div className="input-group mb-3">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroup-username">Username</span>
                                    </div>
                                    <input type="text" className="form-control" placeholder="John"
                                        id="username" name="username" value={username}
                                        aria-label="Username" aria-describedby="inputGroup-username"
                                        onChange={handleUsernameChange}
                                    />
                                </div>
                                {!isValidUsername &&
                                    <span className="text-danger"><i>Username contain number or special characters!</i></span>
                                }
                            
                            </div>

                            <div className="rounded box-gray-border mb-4">
                                    <div className="row mt-3 mb-3">
                                        <div className="col"></div>
                                        <div className="col-md-9">
                                                <div className="input-group">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text" id="basic-addon2">Password Length</span>
                                                    </div>
                                                    <input type="text" className="form-control"
                                                        placeholder="12"
                                                        aria-label="length" aria-describedby="basic-addon2"
                                                        value={length}
                                                    />
                                                    <div className="input-group-append">
                                                        <button className="btn btn-outline-secondary" type="button"
                                                        onClick={()=>handleDecrease(1)}>-</button>
                                                        <button className="btn btn-outline-secondary" type="button"
                                                        onClick={()=>handleIncrease(1)}>+</button>
                                                    </div>
                                                </div>
                                            
                                        </div>
                                        <div className="col"></div>
                                    </div>
                                </div>            
                                
                                <div className="row">
                                    <div className="col-md-6">
                                        <button className="btn btn-blue w-100" type="submit" disabled={!username} onClick={handleSubmit}>Submit</button>
                                    </div>
                                    <div className="col-md-6">
                                        <button className="btn btn-darkgray w-100" type="button" onClick={()=>handleLink('admin')}>Cancel</button>
                                    </div>
                                </div>
                        </div>
                        <div className="col"></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminInsert