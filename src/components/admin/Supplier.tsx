import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar"
import { AuthContext } from "../../contexts/AuthContext";

const Supplier = () => {

    const { decodedAccessToken } = useContext(AuthContext);

    const navigate = useNavigate();
    const handleLink = (target: string): void => {
        navigate(`/admin/${target}`);
    };

    const [expandedItemId, setExpandedItemId] = useState('');
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

    const [password, setPassword] = useState('');
    const [length, setLength] = useState(12);
    const [responseData, setResponseData] = useState(null);

    const fetchData = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/backend_supplier.php`, {
                action: 'getSupplierList',
                aid: parseInt(decodedAccessToken.id, 10)
            });
            setResponseData(response.data.result);
        } catch (error) {
            console.error(error);
        }
    }

    const handleClick = (id: null) => {
      setExpandedItemId((prevId) => (prevId === id ? null : id));
    };

    const setSearchTerm = async (search : string) => {
      try {
          const response = await axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/backend_supplier.php`, {
              action: 'getSupplierList',
              search
          });

          setResponseData(response.data.result);
      } catch (error) {
          console.error(error);
      }
    }

    const handleDelete = async (id : number, email : string) => {
        try {
            await axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/backend_supplier.php`, {
                action: 'deletSupplier',
                aid: parseInt(decodedAccessToken.id, 10),
                id,
                email
            });
            
            fetchData();
        } catch (error) {
            console.error(error);
        }
    }

  const handleIncrease = (index : number) => {
    setLength(length+index)
  }
  const handleDecrease = (index : number) => {
      setLength(length-index)
  }

  const handleResetPassword = (id : number, length : number) => {
      try {
          axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/backend_supplier.php`, {
              action: 'supplierResetPassword',
              aid: parseInt(decodedAccessToken.id, 10),
              id,
              length
          }).then(function(response){
              if (response.data.status === 200) {
                  navigate('/admin/supplier', { state: { message: `Password reset successfully!` } });
              } else {
                  console.error('Password reset failed');
              }
          });
      } catch (error) {
          console.error('An error occurred during reseting:', error);
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

                    <h2 className="text-center mb-3">Supplier List</h2>

                    <div className="row">
                        <div className="col-xs-12 col-md-3 col-ml-2 mb-3 mb-md-0">
                            <button className='btn btn-blue w-100' onClick={()=>handleLink('supplier/insert')}>Add Supplier</button>
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
                            <th scope="col" className="col">Supplier</th>
                            <th scope="col" className="col text-center">Contact</th>
                            <th scope="col" className="col text-center">Active</th>
                            <th scope="col" className="col"></th>
                        </tr></thead>
                        {responseData && responseData.length > 0 ? (
                            <tbody>
                                {responseData.map((item) => (
                                  <>
                                    <tr key={item.id}>
                                        <td>
                                          {item.name}
                                        </td>
                                        <td className="text-center">
                                          {item.contact}
                                        </td>
                                        <td className="text-center">
                                          {item.isactive==1 ? (
                                            <i className="bi bi-check"></i>
                                          ) : (
                                            null
                                          )}
                                        </td>
                                        <td>
                                          <button className='btn-clear' title="View" onClick={() => handleClick(item.id)} >
                                            {expandedItemId === item.id ? (
                                              <i className="bi bi-eye-slash"></i>
                                            ) : (
                                              <i className="bi bi-eye"></i>
                                            )}
                                          </button>
                                        
                                          <button className='btn-clear' title="Delete" onClick={() => handleDelete(item.id, item.email)}>
                                            <i className="bi bi-trash"></i>
                                          </button>
                                        </td>
                                    </tr>
                                    {expandedItemId === item.id && (
                                      <tr>
                                        <td colSpan={4}>
                                          <div className="row mb-3">
                                            <div className="col-md-6">
                                              <b>Email:</b> {item.email}
                                              <br/>
                                              <b>Phone:</b> {item.phone}
                                            </div>
                                            <div className="col-md-6">
                                              <p><b>Reset Password</b></p>
                                              <div className="input-group">
                                                <div className="input-group-prepend">
                                                  <span className="input-group-text" id="basic-addon2">Length</span>
                                                </div>
                                                <input type="text" className="form-control"
                                                  placeholder="12" id="length" name="length"
                                                  aria-label="length" aria-describedby="basic-addon2"
                                                  value={length}
                                                />
                                                <div className="input-group-append">
                                                  <button className="btn btn-outline-secondary" type="button" onClick={()=>handleDecrease(1)}>-</button>
                                                  <button className="btn btn-outline-secondary" type="button" onClick={()=>handleIncrease(1)}>+</button>
                                                  <button type="button" id="ramdonPassword" name="ramdonPassword"
                                                    className="btn bg-blue"
                                                    onClick={()=>handleResetPassword(item.id, length)}
                                                  >
                                                    <i className="bi bi-arrow-clockwise"></i>&nbsp;Generate
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    )}
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

export default Supplier
