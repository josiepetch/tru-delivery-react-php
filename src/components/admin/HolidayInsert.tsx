import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar"
import { AuthContext } from "../../contexts/AuthContext";

const HolidayInsert = () => {
    const { decodedAccessToken } = useContext(AuthContext);

    const [title, setTitle] = useState(null);
    const [date, setDate] = useState(null);
    const [isBtnLoading, setIsBtnLoading] = useState(false);

    const navigate = useNavigate();
    const handleLink = (target: string): void => {
        navigate(`/admin/${target}`);
    };

    const handleSubmit = () => {
        try {
            setIsBtnLoading(true);
            axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/backend_holiday.php`, {
                action: 'insertHoliday',
                aid: parseInt(decodedAccessToken.id, 10),
                title,
                date,
            }).then(function(response){
                if (response.data.status === 200) {
                    navigate('/admin/holiday', { state: { message: `Insert an new holiday successfully!` } });
                } else {
                    console.error('Insert an new holiday failed');
                }
            });
        } catch (error) {
            console.error('An error occurred during inserting:', error);
        }
        setIsBtnLoading(false);
    }

    return (
        <>
            <Navbar />
            
            <div id="content" className="row">
                <div className="col-md-12">

                    <h2 className="text-center mb-3">Add new holiday</h2>

                    <div className="row">
                        <div className="col-sm-3 col-md-4"></div>
                        <div className="col-sm-6 col-md-4">
                            <div className='input-container'>
                                <input type="text" id="title" name='title' onChange={(e) => setTitle(e.target.value)} />
                                <label>Title</label>
                            </div>

                            <div className='input-container'>
                                <input
                                    id="date"
                                    name="date"
                                    type="date"
                                    onChange={(e) => setDate(e.target.value)}
                                />
                                <label>Date</label>
                            </div>

                            <div className='input-container'><div className='row'>
                                <div className="col">
                                    <button className="btn btn-fullwidth btn-blue" disabled={isBtnLoading} onClick={() => handleSubmit()}>
                                        {isBtnLoading ? 'Submitting...' : 'Submit'}
                                    </button>
                                </div>
                                <div className="col">
                                    <button className="btn btn-fullwidth btn-darkgray" onClick={() => handleLink('holiday')}>Cancel</button>
                                </div>
                            </div></div>
                        </div>
                        <div className="col-sm-3 col-md-4"></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HolidayInsert