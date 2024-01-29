import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar"
import { tokenAdminId } from "../../common/authUtils";

const Holiday = () => {

    const [editModes, setEditModes] = useState<any[]>([]);
    const [newTitle, setNewTitle] = useState<any | null>(null);
    const [newDate, setNewDate] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const handleLink = (target: string): void => {
        navigate(`/admin/${target}`);
    };

    const returnMessage = useLocation();
    const displayMessage = returnMessage.state?.message;
    const [displayedMessage, setDisplayedMessage] = useState('');
    useEffect(() => {
        if (displayMessage) {
            setDisplayedMessage(displayMessage);

            // Clear the message after 5 seconds
            setTimeout(() => {
                setDisplayedMessage('');
            }, 5000);

            returnMessage.state = { ...returnMessage.state, message: null };
        }
    }, []);

    const [responseData, setResponseData] = useState<any[]>([]);
    const adminId = tokenAdminId()

    const fetchData = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/backend_holiday.php`, {
                action: 'getHolidayList',
                aid: adminId
            });
            setResponseData(response.data.result);
        } catch (error) {
            console.error(error);
        }
    }

    const handleToggleEdit = (id: number, title : string | null, date : Date | null) => {
      if (title) {
        setNewTitle(title);
        setNewDate(date);
      }
      setEditModes((prevEditModes) => ({
        ...prevEditModes,
        [id]: !prevEditModes[id],
      }));
    };

    const setSearchTerm = async (search : string) => {
      try {
          const response = await axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/backend_holiday.php`, {
              action: 'getHolidayList',
              search
          });

          setResponseData(response.data.result);
      } catch (error) {
          console.error(error);
      }
    }

    const handleDelete = async (id : number, title : string) => {
        try {
            await axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/backend_holiday.php`, {
                action: 'deleteHoliday',
                aid: adminId,
                id,
                title
            });
            
            fetchData();
        } catch (error) {
            console.error(error);
        }
    }

    const handleSubmit = (id : number, title : string, date : Date) => {
      try {
        setLoading(true);

        axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/backend_holiday.php`, {
          action: 'editHolidayTitle',
          aid: adminId,
          id,
          title,
          date,
        }).then(function(response){
          setLoading(false);
          if (response.data.status === 200) {
              // navigate('/admin/holiday', { state: { message: `Update an holiday title successfully!` } });
              handleToggleEdit(id, null, null)
              fetchData();
          } else {
              console.error('Update an holiday title failed');
          }
        });
      } catch (error) {
        setLoading(false);
        console.error('An error occurred during updating:', error);
      }
    }

    useEffect(() => {
      fetchData();
    }, []);
    
    return (
        <>
            {displayedMessage && (
                <div className='alert alert-success text-center'>{displayedMessage}</div>
            )}

            <Navbar />

            <div id="content" className="row">
                <div className="col-md-12">

                    <h2 className="text-center mb-3">Holiday List</h2>

                    <div className="row">
                        <div className="col-xs-12 col-md-3 col-ml-2 mb-3 mb-md-0">
                            <button className='btn btn-blue w-100' onClick={()=>handleLink('holiday/insert')}>Add Holiday</button>
                        </div>
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
                            <th scope="col" className="col">Date</th>
                            <th scope="col" className="col text-center">Title</th>
                            <th scope="col" className="col"></th>
                        </tr></thead>
                        {responseData && responseData.length > 0 ? (
                            <tbody>
                                {responseData.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                          {editModes[item.id] ? (
                                            <div className='input-container'>
                                              <input
                                                id={`date_${item.id}`}
                                                name="date"
                                                type="date"
                                                value={newDate !== null ? newDate : item.date}
                                                onChange={(e) => setNewDate(e.target.value)}
                                              />
                                            </div>
                                          ) : (
                                            item.format_date
                                          )}
                                        </td>
                                        <td className="text-center">
                                          {editModes[item.id] ? (
                                            <div className='input-container'>
                                              <input
                                                id={`title_${item.id}`}
                                                name="title"
                                                value={newTitle !== null ? newTitle : item.title}
                                                onChange={(e) => setNewTitle(e.target.value)}
                                              />
                                            </div>
                                          ) : (
                                            item.title
                                          )}
                                        </td>
                                        <td>
                                          {editModes[item.id] ? (
                                            <>
                                            <button className='btn-clear' title="Save" onClick={() => handleSubmit(item.id, newTitle, newDate)} disabled={loading}>
                                                <i className="bi bi-floppy"></i>
                                            </button>
                                            <button className='btn-clear' title="Cancel" onClick={() => handleToggleEdit(item.id, null, null)}>
                                              <i className="bi bi-x-lg"></i>
                                            </button>
                                            </>
                                          ) : (
                                            <>
                                              <button className='btn-clear' title="Edit" onClick={() => handleToggleEdit(item.id, item.title, item.date)}>
                                                  <i className="bi bi-pencil"></i>
                                              </button>
                                            
                                              <button className='btn-clear' title="Delete" onClick={() => handleDelete(item.id, item.title)}>
                                                  <i className="bi bi-trash"></i>
                                              </button>
                                            </>
                                          )}
                                        </td>
                                    </tr>
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

export default Holiday
