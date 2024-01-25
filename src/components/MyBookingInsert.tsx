import { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Breadcrump from './Breadcrump';
import { AuthContext } from "../contexts/AuthContext";
import { formatDate } from "../common/dateTime"

const MyBookingInsert = () => {
    const { decodedToken } = useContext(AuthContext);

    const currentPath = location.pathname;
    const navigate = useNavigate();
    const handleLink = (target: string): void => {
        navigate(`/${target}`);
    };

    const [holidays, setHolidays] = useState([]);
    
    const fetchData = async () => {
        try {
            const response = await fetch('../../public/holiday.json');
            const jsonData = await response.json();

            const holidayDates = jsonData.map(holiday => holiday.date);

            setHolidays(holidayDates);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const [isBtnLoading, setIsBtnLoading] = useState(false);
    const [ponumber, setPonumber] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [item, setItem] = useState(null);
    const [typenum, setTypenum] = useState(null);
    const [note, setNote] = useState(null);
    const currentDate = new Date();
    const minDate = new Date();
    minDate.setDate(currentDate.getDate() + 1); // Set the minimum date to tomorrow

    const isDayOff = (date) => {
        
        const day = date.getDay();
        if (day === 0 || day === 6) { // It's a weekend
            return false;
        }

        // Check if the selected date is a holiday
        const formattedDate = formatDate(date);
        return !holidays.includes(formattedDate);

    };

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
    };

    const handleSubmit = () => {
        if (selectedDate) {
            console.log('Booking confirmed for:', selectedDate);
            try {
                setIsBtnLoading(true);
                axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/frontend_delivery.php`, {
                    action: 'insertbooking',
                    sid: parseInt(decodedToken.id, 10),
                    ponumber,
                    selectedDate,
                    item,
                    typenum,
                    note
                }).then(function(response){
                    console.log(response);
                    if (response.data.status === 200) {
                        navigate('/mybooking');
                    } else {
                        console.error('Booking failed');
                    }
                });
            } catch (error) {
                console.error('An error occurred during login:', error);
            }
        } else {
            console.log('Please select a date and time');
        }
        setIsBtnLoading(false);
    };

  return (
    <div>
        <Breadcrump />

        <div id="content">

        <h2 className='text-center mb-4'>Book A Slot</h2>

        <div className="row">
            <div className="col"></div>

            <div className="col-md-6">
                <div className='input-container'>
                    <input type="text" id="ponumber" name='ponumber' onChange={(e) => setPonumber(e.target.value)} />
                    <label>PO Number</label>
                </div>

                <div className='input-container'>
                    <DatePicker
                        id="datetime"
                        name='datetime'
                        selected={selectedDate}
                        onChange={handleDateSelect}
                        showTimeSelect
                        minDate={minDate}
                        minTime={new Date().setHours(9, 0)}
                        maxTime={new Date().setHours(16, 0)}
                        filterDate={isDayOff}
                        dateFormat="d MMMM yyyy h:mm"
                    />
                    <label>Date and Time</label>
                </div>

                <div className='input-container'><div className='row'>
                    <div className="col">
                        <input type="number" id="item" name="item" onChange={(e) => setItem(e.target.value)} />
                        <label>Item</label>
                    </div>
                    <div className="col">
                        <select id='typenum' name='typenum' onChange={(e) => setTypenum(e.target.value)}>
                            <option value="1">Palet</option>
                            <option value="2">Carlton</option>
                        </select>
                    </div>
                </div></div>

                <div className='input-container'>
                    <textarea id='note' name='note' onChange={(e) => setNote(e.target.value)}></textarea>
                    <label>Note</label>
                </div>

                <div className='input-container'><div className='row'>
                    <div className="col">
                        <button className="btn btn-fullwidth btn-blue" disabled={isBtnLoading} onClick={handleSubmit}>
                            {isBtnLoading ? 'Booking...' : 'Book Now'}
                        </button>
                    </div>
                    <div className="col">
                        <button className="btn btn-fullwidth btn-darkgray" onClick={() => handleLink('mybooking')}>Cancel</button>
                    </div>
                </div></div>
            </div>

            <div className="col"></div>
        </div>
        </div>
    </div>
  );
};

export default MyBookingInsert;
