import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Breadcrump from "./Breadcrump";
// import { tokenSupplierId } from '../common/authUtils';

const MyEnquiryEdit = () => {

    const { id } = useParams();
    const [enquiry, setEnquiry] = useState<string | null>(null);
    const [responseData, setResponseData] = useState<any[]>([]);
    const [isBtnLoading, setIsBtnLoading] = useState(false);
    // const supplierId = tokenSupplierId()

    const navigate = useNavigate();
    const handleLink = (target: string): void => {
        navigate(`/${target}`);
    };

    const handleSubmit = () => {
        try {
            setIsBtnLoading(true);
            axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/frontend_enquiry.php`, {
                action: 'replyenquiry',
                id,
                enquiry,
            }).then(function(response){
                if (response.data.status === 200) {
                    navigate('/myenquiry', { state: { message: `Replied successfully!` } });
                } else {
                    console.error('Replied failed');
                }
            });
        } catch (error) {
            console.error('An error occurred during login:', error);
        }
        setIsBtnLoading(false);
    };

    const fetchData = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/frontend_enquiry.php`, {
                action : 'editmyenquiry',
                id 
            });
            setResponseData(response.data.result);
        } catch (error) {
            console.error('Failed to reply an enquiry');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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
            <Breadcrump />

            <div id="content">
                <div className='row'>
                    <div className='col'></div>
                    <div className="col-md-6">
                        {responseData ? (
                            <>{responseData.map((item) => (
                                <>
                                    <p className='small text-center'>{item.format_booktime}</p>
                                    {item.admin_id !== '0' && // us reply
                                        <div className="d-flex align-items-start flex-column" style={marginBottom1}>
                                            <div className="p-2 bg-darkgray" style={borderRound}>
                                                <p key={item.id} style={margin0}>{item.enquiry}</p>
                                            </div>
                                        </div>
                                    }
                                    {item.admin_id === '0' && // client reply
                                        <div className="d-flex align-items-end flex-column" style={marginBottom1}>
                                            <div className="p-2 bg-blue" style={borderRound}>
                                                <p key={item.id} style={margin0}>{item.enquiry}</p>
                                            </div>
                                        </div>
                                    }
                                </>
                            ))}</>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>
                    <div className='col'></div>
                </div>


                <div className='row pt-4'>
                    <div className='col'></div>
                    <div className="col-md-6 input-container">
                        <textarea id='enquiry' name='enquiry' placeholder='Reply...' onChange={(e) => setEnquiry(e.target.value)}></textarea>
                    </div>
                    <div className='col'></div>
                </div>

                <div className='row'>
                    <div className='col'></div>
                    <div className="col-md-6">
                        <button className="btn btn-blue w-50" disabled={!enquiry || isBtnLoading} onClick={handleSubmit}>
                            {isBtnLoading ? 'Submitting...' : 'Submit'}
                        </button>
                        <button className='btn btn-darkgray w-50' onClick={() => handleLink('myenquiry')}>Cancel</button>
                    </div>
                    <div className='col'></div>
                </div>
            </div>
        </>
    )
}

export default MyEnquiryEdit