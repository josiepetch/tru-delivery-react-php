import React, { CSSProperties, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar"
import { tokenAdminId } from "../../common/authUtils";

const Admin = () => {

    const navigate = useNavigate();
    const handleLink = (target: string): void => {
        navigate(`/admin/${target}`);
    };

    const returnMessage = useLocation();
    const displayMessage = returnMessage.state?.message;
    const [displayedMessage, setDisplayedMessage] = useState('');
    useEffect(() => {
        if (displayMessage) {
            setDisplayedMessage(displayMessage);

            // Clear the message after 5 seconds
            setTimeout(() => {
                setDisplayedMessage('');
            }, 5000);

            returnMessage.state = { ...returnMessage.state, message: null };
        }
    }, []);

    const [expandedItemId, setExpandedItemId] = useState<number | null>(null);
    const [length, setLength] = useState(12);
    const [successResetMap, setSuccessResetMap] = useState<any[]>([]);
    const [failResetMap, setFailResetMap] = useState<any[]>([]);
    const [responseData, setResponseData] = useState<any[]>([]);
    const adminId = tokenAdminId()

    const fetchData = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/backend_admin.php`, {
                action: 'getAdminList',
                aid: adminId
            });
            setResponseData(response.data.result);
        } catch (error) {
            console.error(error);
        }
    }

    const handleClick = (id: number | null) => {
        setExpandedItemId((prevId : number | null) => (prevId === id ? null : id));
    };

    const handleIncrease = (index : number) => {
        setLength(length+index)
    }
    const handleDecrease = (index : number) => {
        setLength(length-index)
    }

    const handleResetPassword = (id : number, length : number) => {
        try {
            axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/backend_admin.php`, {
                action: 'updateAdmin',
                aid: adminId,
                id,
                length
            }).then(function(response){
                if (response.data.status === 200) {
                    setSuccessResetMap((prevMap) => ({
                        ...prevMap,
                        [id]: true, // Mark the specific item as successfully updated
                    }));
                } else {
                    setFailResetMap((prevMap) => ({
                        ...prevMap,
                        [id]: true, // Mark the specific item as fail updated
                    }));
                }
            });
        } catch (error) {
            console.error('An error occurred during reseting:', error);
        }
    }

    const handleActiveDeactive = async (id : number, newStatus : number) => {
        try {
            await axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/backend_admin.php`, {
                action: 'setActiveDeactive',
                aid: adminId,
                id,
                newStatus
            });
            
            fetchData();
        } catch (error) {
            console.error(error);
        }
    }

    const handleDeleteAdmin = async (id : number, username : string) => {
        try {
            await axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/backend_admin.php`, {
                action: 'deleteAdmin',
                aid: adminId,
                id,
                username
            });
            
            fetchData();
        } catch (error) {
            console.error(error);
        }
    }

    const setSearchTerm = async (username : string) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/backend_admin.php`, {
                action: 'searchAdmin',
                username
            });

            setResponseData(response.data.result);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    // inline css
    const textTitle: CSSProperties = {
        textAlign: 'right',
        fontWeight: 'bold',
        paddingTop: '5px'

    }
    
    return (
        <>
            {displayedMessage && (
                <div className='alert alert-success text-center'>{displayedMessage}</div>
            )}

            <Navbar />

            <div id="content" className="row">
                <div className="col-md-12">

                    <h2 className="text-center mb-3">Adminstrator</h2>

                    <div className="row">
                        <div className="col-xs-12 col-md-3 col-ml-2 mb-3 mb-md-0">
                            <button className='btn btn-blue w-100' onClick={()=>handleLink('admin/insert')}>Add User</button>
                        </div>
                        <div className="col">
                            <div className="input-group">
                                <input type="text" className="form-control" placeholder="Username"
                                    aria-label="username" aria-describedby="basic-addon3"
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                                <div className="input-group-append">
                                    <button className="btn btn-outline-secondary" type="button">
                                        <i className="bi bi-search"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <table className="table table-striped">
                        <thead><tr>
                            <th scope="col" className="col-7 col-md-5 col-sm-4">Username</th>
                            <th scope="col" className="col-2 col-md-3 col-sm-4 text-center">Active</th>
                            <th scope="col" className="col-3 col-md-4 col-sm-4"></th>
                        </tr></thead>
                        {responseData && responseData.length > 0 ? (
                            <tbody>
                                {responseData.map((item) => (
                                    <React.Fragment key={item.id}>
                                    <tr>
                                        <td>{item.username}</td>
                                        <td className="text-center">{item.status==1 ? <i className="bi bi-check"></i> : ''}</td>
                                        <td>
                                            <button className='btn-clear' title="Edit" onClick={() => handleClick(item.id)} >
                                                {expandedItemId === item.id ? (
                                                    <i className="bi bi-eye-slash"></i>
                                                ) : (
                                                    <i className="bi bi-pencil"></i>
                                                )}
                                            </button>
                                            {expandedItemId !== item.id && (<>
                                                {item.status==1 ? (
                                                    <button className='btn-clear' title="Deactive" onClick={() => handleActiveDeactive(item.id, 0)}>
                                                        <i className="bi bi-x-circle"></i>
                                                    </button>
                                                ) : (
                                                    <button className='btn-clear' title="Active" onClick={() => handleActiveDeactive(item.id, 1)}>
                                                        <i className="bi bi-check-circle"></i>
                                                    </button>
                                                )}
                                                <button className='btn-clear' title="Delete" onClick={() => handleDeleteAdmin(item.id, item.username)}>
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </>)}
                                        </td>
                                    </tr>
                                    {expandedItemId === item.id && (
                                        <tr>
                                            <td colSpan={3}>
                                            <div className="row mt-3 mb-2">
                                                <div className="col-md-3">
                                                    <p style={textTitle}>Reset Password</p>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="input-group">
                                                        <div className="input-group-prepend">
                                                            <span className="input-group-text" id="basic-addon2">Length</span>
                                                        </div>
                                                        <input type="text" className="form-control"
                                                            placeholder="12" id="length" name="length"
                                                            aria-label="length" aria-describedby="basic-addon2"
                                                            value={length}
                                                        />
                                                        <div className="input-group-append">
                                                            <button className="btn btn-outline-secondary" type="button" onClick={()=>handleDecrease(1)}>-</button>
                                                            <button className="btn btn-outline-secondary" type="button" onClick={()=>handleIncrease(1)}>+</button>
                                                        </div>
                                                    </div>
                                                    {successResetMap[item.id] && 
                                                        <span className="text-success"><i>Successful updated!</i></span>
                                                    }
                                                    {failResetMap[item.id] && 
                                                        <span className="text-danger"><i>Fail updated!</i></span>
                                                    }
                                                </div>
                                                <div className="col-md-3">
                                                    <button type="button" id="ramdonPassword" name="ramdonPassword"
                                                        className="btn bg-blue"
                                                        onClick={()=>handleResetPassword(item.id, length)}
                                                    >
                                                        <i className="bi bi-arrow-clockwise"></i>&nbsp;Generate
                                                    </button>
                                                </div>
                                            </div>
                                            </td>
                                        </tr>
                                    )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        ) : (
                            <tr><td colSpan={4}>Loading...</td></tr>
                        )}
                    </table>

                </div>
            </div>
        </>
    )
}

export default Admin
