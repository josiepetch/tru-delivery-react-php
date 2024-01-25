import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar"
import { AuthContext } from "../../contexts/AuthContext";

const EnquiryEdit = () => {

    const { decodedAccessToken } = useContext(AuthContext);

    const navigate = useNavigate();
    const handleLink = (target: string): void => {
        navigate(`/admin/${target}`);
    };

    const { id } = useParams();
    const [enquiry, setEnquiry] = useState('');
    const [responseData, setResponseData] = useState(null);
    const [isBtnLoading, setIsBtnLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsBtnLoading(true);
                const response = await axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/backend_enquiry.php`, {
                    action: 'getEnquiryDetail',
                    id,
                    aid: parseInt(decodedAccessToken.id, 10)
                });
                console.log(response.data.result)
                setResponseData(response.data.result);
            } catch (error) {
                console.error(error);
            }
            setIsBtnLoading(false);
        };

        fetchData();
    }, []);

    const handleSubmit = () => {
        try {
            setIsBtnLoading(true);
            axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/backend_enquiry.php`, {
                action: 'updateEnquiryDetail',
                aid: parseInt(decodedAccessToken.id, 10),
                id,
                enquiry
            }).then(function(response){
                if (response.data.status === 200) {
                    navigate('/admin/enquiry', { state: { message: `Message replied successfully!` } });
                } else {
                    console.error('Message replied failed');
                }
            });
        } catch (error) {
            console.error('An error occurred during replying detail:', error);
        }
        setIsBtnLoading(false);
    };

    // inline css
    const borderRound = {
        // border: '1px solid var(--blue)',
        borderRadius: '2rem',
    }
    const margin0 = {
        margin: 0
    }
    const marginBottom1 = {
        marginBottom: '1rem'
    }
    
    return (
        <>
            <Navbar />
            
            <h2 className="text-center mb-3">Reply Enquiry</h2>

            <div id="content" className="row">
                <div className='col'></div>
                <div className="col-md-6">
                    {responseData ? (
                        <>
                            {responseData.map((item) => (
                                <>
                                    <p className='small text-center'>{item.format_booktime}</p>
                                    {item.admin_id !== '0' && // us reply
                                        <div className="d-flex align-items-end flex-column" style={marginBottom1}>
                                            <div className="p-2 bg-blue" style={borderRound}>
                                                <p style={margin0}>{item.enquiry}</p>
                                            </div>
                                        </div>
                                    }
                                    {item.admin_id === '0' && // client reply
                                        <div className="d-flex align-items-start flex-column" style={marginBottom1}>
                                            <div className="p-2 bg-darkgray" style={borderRound}>
                                                <p style={margin0}>{item.enquiry}</p>
                                            </div>
                                        </div>
                                    }
                                </>
                            ))}
                            <div className='input-container mt-3'>
                                <textarea id="enquiry" name="enquiry" placeholder="Reply message" onChange={(e) => setEnquiry(e.target.value)}></textarea>
                            </div>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                    
                    <div className='input-container'><div className="row">
                        <div className="col-md-6">
                            <button className="btn btn-fullwidth btn-blue" disabled={!isBtnLoading} onClick={() => handleSubmit()}>
                                {isBtnLoading ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                        <div className="col-md-6">
                            <button className="btn btn-fullwidth btn-darkgray" onClick={() => handleLink('enquiry')}>Cancel</button>
                        </div>
                    </div></div>
                </div>
                <div className='col'></div>
            </div>
        </>
    )
}

export default EnquiryEdit