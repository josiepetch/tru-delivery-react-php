import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar"
import { AuthContext } from "../../contexts/AuthContext";
import { copyToClipboard, generateRandomPassword } from "../../common/password"

const AdminEdit = () => {

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

    const { id } = useParams();
    const [password, setPassword] = useState('');
    const [length, setLength] = useState(12);
    const [responseData, setResponseData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/backend_admin.php`, {
                    action: 'getAdminDetail',
                    id,
                    aid: parseInt(decodedAccessToken.id, 10)
                });
                console.log(response.data.result)
                setResponseData(response.data.result);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const handleIncrease = (index : number) => {
        setLength(length+index)
    }
    const handleDecrease = (index : number) => {
        setLength(length-index)
    }

    const handleSubmit = () => {
        try {
            axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/backend_admin.php`, {
                action: 'updateAdmin',
                aid: parseInt(decodedAccessToken.id, 10),
                id,
                password
            }).then(function(response){
                if (response.data.status === 200) {
                    navigate('/admin/admin', { state: { message: `Admin detail updated successfully!` } });
                } else {
                    console.error('Admin detail update failed');
                }
            });
        } catch (error) {
            console.error('An error occurred during updating detail:', error);
        }
    };
    
    return (
        <>
            <Navbar />
            
            <div id="content" className="row">
                <div className="col-md-12">

                    {responseData ? (
                        <>
                        <h2 className="text-center  mb-3">Edit Profile: {responseData.username}</h2>
                        <div className="row">
                            <div className="col"></div>
                            <div className="col-md-9">
                                <div className="row">
                                    <div className="col-md-12"><div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="basic-addon1">Password</span>
                                        </div>
                                        <input type="text" className="form-control" placeholder="...Update new password?"
                                            id="password" name="password" value={password}
                                            aria-label="password" aria-describedby="basic-addon1"
                                            onChange={(e)=>{setPassword(e.target.value)}}
                                        />
                                    </div></div>
                                </div>

                                <div className="rounded box-gray-border mb-4">
                                    <div className="row mt-3 mb-3">
                                        <div className="col"></div>
                                        <div className="col-md-9">
                                                <div className="input-group">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text" id="basic-addon2">Length</span>
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
                                <div className="row mt-3 mb-3">
                                    <div className="col-md-6">
                                        <button type="button" id="ramdonPassword" name="ramdonPassword"
                                        className="btn btn-fullwidth bg-blue"
                                        onClick={()=>setPassword(generateRandomPassword(length))}>
                                            <i className="bi bi-arrow-clockwise"></i>&nbsp;
                                            Generate
                                        </button>
                                    </div>
                                    <div className="col-md-6">
                                        <button type="button" id="copyToClipboard" name="copyToClipboard"
                                        className="btn btn-fullwidth bg-blue"
                                        disabled={!password}
                                        onClick={()=>copyToClipboard(password)}>
                                            <i className="bi bi-clipboard-check"></i>&nbsp;
                                            Copy To Clipboard
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="row">
                                    <div className="col-md-6">
                                        <button className="btn btn-blue w-100" type="submit" disabled={!password} onClick={handleSubmit}>Update</button>
                                    </div>
                                    <div className="col-md-6">
                                        <button className="btn btn-darkgray w-100" type="button" onClick={()=>handleLink('admin')}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col"></div>
                        </div></>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>
        </>
    )
}

export default AdminEdit