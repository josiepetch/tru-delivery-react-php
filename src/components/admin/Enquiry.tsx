import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar"
import { tokenAdminId } from '../../common/authUtils';

const Enquiry = () => {

  const navigate = useNavigate();
  const handleLink = (target: string): void => {
      navigate(`/admin/${target}`);
  };

  const [responseData, setResponseData] = useState<any[]>([]);
  const adminId = tokenAdminId()

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/backend_enquiry.php`, {
          action: 'getEnquiryList',
          aid: adminId
      });
      setResponseData(response.data.result);
    } catch (error) {
      console.error(error);
    }
  }

  const setFindStatus = async (search : string) => {
    try {
      if (search == '0') {
        fetchData()
      } else {
        const response = await axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/backend_enquiry.php`, {
            action: 'searchStatusEnquiry',
            search
        });

        setResponseData(response.data.result);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const setSearchTerm = async (search : string) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/backend_enquiry.php`, {
          action: 'searchEnquiry',
          search
      });

      setResponseData(response.data.result);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Navbar />

      <div id="content" className="row">
        <div className="col-md-12">

          <h2 className="text-center mb-3">Enquiry List</h2>

          <div className="row">
            <div className="col-xs-6 col-md-1 col-ml-2 mb-3 mb-md-0 pt-1">
              Status
            </div>
            <div className="col-xs-6 col-md-3 col-ml-2 mb-3 mb-md-0"><div className='input-container'>
              <select id='findStatus' name='findStatus' onChange={(e) => setFindStatus(e.target.value)}>
                  <option value="0">All</option>
                  <option value="1">New</option>
                  <option value="2">Replied</option>
                  <option value="3">Close Ticket</option>
              </select>
            </div></div>

            <div className="col">
              <div className="input-group">
                <input type="text" className="form-control" placeholder="Search"
                  aria-label="search" aria-describedby="basic-addon3"
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
              <th scope="col" className="col text-center"></th>
              <th scope="col" className="col text-center">From</th>
              <th scope="col" className="col text-center">Enquiry</th>
              <th scope="col" className="col text-center">Date</th>
            </tr></thead>
            {responseData && responseData.length > 0 ? (
              <tbody>
                {responseData.map((item) => (
                  <>
                    <tr>
                      <td className="text-center">
                      {item.status==1 &&
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-envelope" viewBox="0 0 16 16">
                          <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
                      </svg>
                      }

                      {item.status==2 && 
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                          <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
                      </svg>
                      }

                      {item.status==3 &&
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-archive" viewBox="0 0 16 16">
                          <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5zm13-3H1v2h14zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
                      </svg>
                      }
                      </td>
                      <td className="text-center">{item.supplier_name}</td>
                      <td className="text-center" onClick={() => handleLink(`enquiry/${item.enquiry_id}`)}>
                        <span className="cursor-pointer">{item.enquiry}</span>
                      </td>
                      <td className="text-center">{item.enquiry_date}</td>
                    </tr>
                  </>
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

export default Enquiry