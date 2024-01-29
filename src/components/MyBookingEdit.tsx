import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Breadcrump from './Breadcrump';
import { formatDate } from "../common/dateTime"
import { tokenSupplierId } from '../common/authUtils';

const MyBookingEdit = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const handleLink = (target: string): void => {
        navigate(`/${target}`);
    };

    interface ResponseData {
        po_number: string;
        booktime: Date;
        item: number;
        type: number;
        note: string;
    }
    const [responseData, setResponseData] = useState<ResponseData>({
        po_number: '',
        booktime: new Date(),
        item: 0,
        type: 0,
        note: '',
    });
    const [isBtnLoading, setIsBtnLoading] = useState(false);
    const supplierId = tokenSupplierId()

    const fetchData = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/frontend_delivery.php`, {
                action: 'getbooking',
                id
            });
            setResponseData(response.data.result);
            console.log(response.data)
        } catch (error) {
            console.error(error);
        }
    };

    interface Holiday {
        date: Date;
    }
    const [holidays, setHolidays] = useState<any[]>([]);
    
    const fetchHoliday = async () => {
        try {
            const response = await fetch('/holiday.json');
            const jsonData: Holiday[] = await response.json();

            const holidayDates = jsonData.map(holiday => holiday.date);

            setHolidays(holidayDates);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchHoliday();
    }, []);

    const currentDate = new Date();
    const minDate = new Date(currentDate);
    minDate.setDate(currentDate.getDate() + 1); // Set the minimum date to tomorrow
    // Set minimum time to 9:00 AM
    const minTime = new Date(currentDate);
    minTime.setHours(9, 0, 0, 0);
    // Set maximum time to 4:00 PM
    const maxTime = new Date(currentDate);
    maxTime.setHours(16, 0, 0, 0);

    const isDayOff = (date : any) => {
        
        const day = date.getDay();
        if (day === 0 || day === 6) { // It's a weekend
            return false;
        }

        // Check if the selected date is a holiday
        const formattedDate = formatDate(date);
        return !holidays.includes(formattedDate);

    };

    const handleInputChange = (e:any, field:string) => {
        setResponseData((prevData) => ({
            ...prevData,
            [field]: e.target.value,
        }));
    };
    const handleDataChange = (e:any, field:string) => {
        setResponseData((prevData) => ({
            ...prevData,
            [field]: e,
        }));
    };
    const handleDateChange = (date:Date|null, field:string) => {
        setResponseData((prevData) => ({
            ...prevData,
            [field]: date,
        }));
    };
    const handleSubmit = () => {
        try {
            setIsBtnLoading(true);
            axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/frontend_delivery.php`, {
                action: 'updatebooking',
                sid: supplierId,
                id,
                po_number: responseData.po_number,
                booktime: responseData.booktime,
                item: responseData.item,
                type: responseData.type,
                note: responseData.note,
            }).then(function(response){
                if (response.data.status === 200) {
                    navigate('/mybooking', { state: { message: `Booking updated successfully!` } });
                } else {
                    console.error('Booking update failed');
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

            <h2 className='text-center mb-4'>Edit Booking</h2>

            {responseData ? (
                <div className="row">
                    <div className="col"></div>

                    <div className="col-md-6 col-xs-12">
                        <div className='input-container'>
                            <input type="text" id="ponumber" name='ponumber'
                            value={responseData.po_number}
                            onChange={(e) => handleInputChange(e, 'po_number')} />
                            <label>PO Number</label>
                        </div>

                        <div className='input-container'>
                            <DatePicker
                                id="datetime"
                                name='datetime'
                                showTimeSelect
                                selected={new Date(responseData.booktime)}
                                onChange={(e) => handleDateChange(e, 'booktime')}
                                minDate={minDate}
                                minTime={minTime}
                                maxTime={maxTime}
                                filterDate={isDayOff}
                                dateFormat="d MMMM yyyy h:mm"
                            />
                            <label>Date and Time</label>
                        </div>

                        <div className='input-container'><div className='row'>
                            <div className="col">
                                <input type="number" id="item" name='item'
                                value={responseData.item}
                                onChange={(e) => handleInputChange(e, 'item')} />
                                <label>Item</label>
                            </div>
                            <div className="col">
                            <select id='type' name='type' value={responseData.type}
                            onChange={(e) => handleDataChange(e.target.value, 'type')} >
                                <option value="1">Palet</option>
                                <option value="2">Carlton</option>
                            </select>
                            </div>
                        </div></div>

                        <div className='input-container'>
                            <textarea id='note' name='note'value={responseData.note}
                            onChange={(e) => handleDataChange(e.target.value, 'note')}></textarea>
                            <label>Note</label>
                        </div>

                        <div className='input-container'><div className='row'>
                            <div className="col">
                                <button type="button" className="btn btn-fullwidth btn-blue" disabled={isBtnLoading} onClick={handleSubmit}>
                                    {isBtnLoading ? 'Updating in...' : 'Update'}
                                </button>
                            </div>
                            <div className="col">
                                <button className="btn btn-fullwidth btn-darkgray" onClick={() => handleLink('mybooking')}>Cancel</button>
                            </div>
                        </div></div>
                    </div>

                    <div className="col"></div>
                </div>
                ) : (
                <p>Loading...</p>
            )}
        </>
    )
}

export default MyBookingEdit