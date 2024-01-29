import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Breadcrump from "./Breadcrump"
import { tokenSupplierId } from '../common/authUtils';

const MyEnquiryInsert = () => {

    const navigate = useNavigate();
    const handleLink = (target: string): void => {
        navigate(`/${target}`);
    };

    const [enquiry, setEnquiry] = useState<string>('');
    const [isBtnLoading, setIsBtnLoading] = useState(false);
    const supplierId = tokenSupplierId()

    const handleSubmit = () => {
        try {
            setIsBtnLoading(true);
            axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/frontend_enquiry.php`, {
                action: 'newenquiry',
                sid: supplierId,
                enquiry,
            }).then(function(response){
                if (response.data.status === 200) {
                    navigate('/myenquiry', { state: { message: `New enquiry successfully submitted!` } });
                } else {
                    console.error('Failed to submit a new enquiry');
                }
            });
        } catch (error) {
            console.error('An error occurred during login:', error);
        }
        setIsBtnLoading(false);
    };
    
    return (
    <>
        <Breadcrump />
        
        <div id="content">
            <h2 className="text-center">New Enquiry</h2>

            <div className="row pt-3">
                <div className="col"></div>
                <div className="col-md-6">
                    <p>Please note that our maximum pallet size is 1.2 x 1.2 x 1.4 meters;<br />oversized pallets may be rejected.</p>
                    <p>Enquiries, please contact us through the form below</p>

                    <div className="input-container">
                        <textarea id='enquiry' name='enquiry' onChange={(e) => setEnquiry(e.target.value)}></textarea>
                    </div>

                    <button className="btn btn-blue w-50" disabled={isBtnLoading} onClick={handleSubmit}>
                        {isBtnLoading ? 'Submitting...' : 'Submit'}
                    </button>
                    <button className='btn btn-darkgray w-50' onClick={() => handleLink('myenquiry')}>Cancel</button>
                </div>
                <div className="col"></div>
            </div>
        </div>
    </>
    )
}

export default MyEnquiryInsert