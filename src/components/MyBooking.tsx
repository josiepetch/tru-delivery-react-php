import { Fragment, useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Breadcrump from './Breadcrump';
import { tokenSupplierId } from '../common/authUtils';

const MyBooking = () => {

    const [responseData, setResponseData] = useState<any[]>([]);
    const [expandedItemId, setExpandedItemId] = useState<number | null>(null);
    const [displayedMessage, setDisplayedMessage] = useState<string | null>(null);
    const supplierId = tokenSupplierId()

    const navigate = useNavigate();
    const handleLink = (target: string): void => {
        navigate(`/${target}`);
    };

    const returnMessage = useLocation();
    const displayMessage = returnMessage.state?.message;

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

    const handleClick = (id: null) => {
        setExpandedItemId((prevId) => (prevId === id ? null : id));
    };

    const fetchData = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/frontend_delivery.php`, {
                action: 'mybooking',
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

    return (
        <>
            <Breadcrump />
            
            <div id="content">

            <h2 className='text-center mb-4'>My Booking List</h2>

            {displayedMessage && (
                <div className='alert alert-success text-center'>{displayedMessage}</div>
            )}

            <div className='row'>
                <div className='col-xs-12 col-md-3'>
                    <button type="button" className='btn btn-blue btn-fullwidth'
                        onClick={() => handleLink('mybooking/insert')}>Book A Slot</button>
                </div>
                <div className='col-xs-12 col-md-3'></div>
                <div className='col-xs-12 col-md-3'></div>
                <div className='col-xs-12 col-md-3'></div>
            </div>
            
            <table className="table table-striped">
                <thead><tr>
                    <th>Booktime</th>
                    <th>PO Number</th>
                    <th>NO. Item(s)</th>
                    <th></th>
                </tr></thead>
                {responseData ? (
                    <><tbody>
                        {responseData.map((item) => (
                            <Fragment key={item.id}>
                                <tr>
                                    <td>{item.format_booktime}</td>
                                    <td>{item.po_number}</td>
                                    <td>{item.item} {item.type_title}</td>
                                    <td>
                                        <button className='btn-clear' onClick={() => handleClick(item.id)}>
                                            {expandedItemId === item.id ? (
                                                <i className="bi bi-eye-slash"></i>
                                            ) : (
                                                <i className="bi bi-eye"></i>
                                            )}
                                        </button>
                                        <button className='btn-clear' onClick={() => handleLink(`mybooking/edit/${item.id}`)}><i className="bi bi-pencil"></i></button>
                                        <button className='btn-clear' onClick={() => handleLink(`mybooking/delete/${item.id}`)}><i className="bi bi-trash"></i></button>
                                    </td>
                                </tr>
                            
                                {expandedItemId === item.id && (
                                    <tr>
                                        <td colSpan={4}>
                                            <hr />
                                            <p>Duration: {item.duration} mins</p>
                                            <p>Note: {item.note}</p>
                                            <hr />
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        ))}
                    </tbody></>
                    ) : (
                        <tr><td colSpan={4}>Loading...</td></tr>
                )}
            </table>
            </div>
        </>
    )
}

export default MyBooking