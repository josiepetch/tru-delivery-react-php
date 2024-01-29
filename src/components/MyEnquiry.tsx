import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Breadcrump from "./Breadcrump";
import { tokenSupplierId } from '../common/authUtils';

const MyEnquiry = () => {

    const [responseData, setResponseData] = useState<any[]>([]);
    const [displayedMessage, setDisplayedMessage] = useState<string | null>(null);
    const supplierId = tokenSupplierId()

    const navigate = useNavigate();
    const handleLink = (target: string): void => {
        navigate(`/${target}`);
    };

    const returnMessage = useLocation();
    const displayMessage = returnMessage.state?.message;

    const fetchData = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/frontend_enquiry.php`, {
                action: 'myenquiry',
                sid: supplierId
            });
            setResponseData(response.data.result);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (displayMessage) {
            setDisplayedMessage(displayMessage);

            // Clear the message after 5 seconds
            const timeoutId = setTimeout(() => {
                setDisplayedMessage(null);
            }, 5000);

            // Cleanup the timeout to prevent memory leaks
            return () => clearTimeout(timeoutId);
        }
    }, [displayMessage]);

    // Reset displayMessage after navigating away from this component
    useEffect(() => {
        const clearMessage = () => {
            setDisplayedMessage(null);
        };

        return () => {
            clearMessage();
        };
    }, [location.pathname]);

    const setSearchTerm = async (search : string) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/frontend_enquiry.php`, {
                action: 'searchTerm',
                sid: supplierId,
                search
            });

            setResponseData(response.data.result);
        } catch (error) {
            console.error(error);
        }
    }

    // inline css
    const marginRight1 = {
        marginRight: '1rem',
    }

    return (
        <>
            <Breadcrump />

            <div id="content">

            <h2 className='text-center mb-4'>Enquiry List</h2>

            {displayedMessage && (
                <div className='alert alert-success text-center'>{displayedMessage}</div>
            )}

            <div className='bg-blue p-3 text-center d-flex'>
                <button className='btn bg-white font-blue fw-bold' onClick={() => handleLink(`newenquiry`)} style={marginRight1}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                    </svg>
                </button>

                <a href='mailto:receiving@toysrus.com.au'>
                    <button className='btn bg-white font-blue fw-bold' style={marginRight1}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-envelope-plus" viewBox="0 0 16 16">
                        <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2zm3.708 6.208L1 11.105V5.383zM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2z"/>
                        <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0m-3.5-2a.5.5 0 0 0-.5.5v1h-1a.5.5 0 0 0 0 1h1v1a.5.5 0 0 0 1 0v-1h1a.5.5 0 0 0 0-1h-1v-1a.5.5 0 0 0-.5-.5"/>
                    </svg>
                    </button>
                </a>

                <div className="input-group">
                    <input type="text" className="form-control" placeholder="Search..."
                        aria-label="search" aria-describedby="basic-addon3"
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary bg-white" type="button">
                            <i className="bi bi-search"></i>
                        </button>
                    </div>
                </div>                
            </div>

            <table className="table table-striped">
                {/* <thead><tr>
                    <th scope="col" className="col-1 col-md-1"></th>
                    <th scope="col" className="col-9 col-md-6">Enquiry</th>
                    <th scope="col" className="col-md-4 d-none d-md-table-cell">Date</th>
                    <th scope="col" className="col-1 col-md-1"></th>
                </tr></thead> */}
                {responseData && responseData.length > 0 ? (
                    <tbody>
                        {responseData.map((item) => (
                            <tr>
                                <td className='text-center'>
                                    
                                    {item.status==1 && 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
                                    </svg>
                                    }

                                    {item.status==2 &&
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-envelope" viewBox="0 0 16 16">
                                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
                                    </svg>
                                    }

                                    {item.status==3 &&
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-archive" viewBox="0 0 16 16">
                                        <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5zm13-3H1v2h14zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
                                    </svg>
                                    }
                                </td>
                                <td><span className='cursor-pointer' key={item.enquiry_id} onClick={() => handleLink(`myenquiry/${item.enquiry_id}`)}>{item.enquiry}</span></td>
                                <td>{item.format_booktime}</td>
                                {/* <td className="d-none d-md-table-cell">{item.format_booktime}</td> */}
                                {/* <td>
                                    <button className='btn-clear' onClick={() => handleLink(`myenquiry/${item.enquiry_id}`)}>
                                        <i className="bi bi-eye"></i>
                                    </button>
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                ) : (
                    <tr><td colSpan={4}>Loading...</td></tr>
                )}
            </table>
            </div>
        </>
    );
};

export default MyEnquiry;
