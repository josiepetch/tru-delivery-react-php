import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Breadcrump from "./Breadcrump"
import { tokenSupplierId } from '../common/authUtils';

const MyBookingDelete = () => {

  const { id } = useParams();
  interface ResponseData {
    po_number: string;
    booktime: Date;
    format_booktime: string;
    type_title: string;
    item: number;
    type: number;
    note: string;
  }
  const [responseData, setResponseData] = useState<ResponseData>({
    po_number: '',
    booktime: new Date(),
    format_booktime: '',
    type_title: '',
    item: 0,
    type: 0,
    note: '',
  });
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const supplierId = tokenSupplierId()

  const navigate = useNavigate();
  const handleLink = (target: string): void => {
      navigate(`/${target}`);
  };

  
  const fetchData = async () => {
      try {
          const response = await axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/frontend_delivery.php`, {
            action: 'getbooking',
            id
          });
          setResponseData(response.data.result);
      } catch (error) {
          console.error(error);
      }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = () => {
    try {
      setIsBtnLoading(true);
      axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/frontend_delivery.php`, {
          action: 'deletebooking',
          sid: supplierId,
          id,
      }).then(function(response){
          if (response.data.status === 200) {
              navigate('/mybooking', { state: { message: `Booking deleted successfully!` } });
          } else {
              console.error('Booking deleted failed');
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

      {responseData ? (
        <>
        <div className='alert alert-danger text-center mb-4'>Do you want to delete this booking?</div>
        <div className="row">
            <div className="col"></div>

            <div className="col-md-6 col-xs-12">
                <div className='input-container'>
                    <input type="text" id="ponumber" name='ponumber' value={responseData.po_number} />
                    <label>PO Number</label>
                </div>

                <div className='input-container'>
                  <input type="text" id="ponumber" name='ponumber' value={responseData.format_booktime} />
                  <label>Date and Time</label>
                </div>

                <div className='input-container'>
                  <input type="text" id="item" name='item' value={`${responseData.item} ${responseData.type_title}`} />
                  <label>Item</label>
                </div>

                <div className='input-container'>
                    <textarea id='note' name='note' value={responseData.note} ></textarea>
                    <label>Note</label>
                </div>

                <div className='input-container'><div className='row'>
                    <div className="col">
                      <button className="btn btn-fullwidth btn-red" disabled={isBtnLoading} onClick={handleSubmit}>
                        {isBtnLoading ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                    <div className="col">
                      <button className="btn btn-fullwidth btn-darkgray" onClick={() => handleLink('mybooking')}>Cancel</button>
                    </div>
                </div></div>
            </div>

            <div className="col"></div>
        </div>
        </>
        ) : (
        <p>Loading...</p>
      )}
    </>
  )
}

export default MyBookingDelete