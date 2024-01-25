import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import Navbar from "./Navbar"

const Delivery = () => {

  const { decodedAccessToken } = useContext(AuthContext);

  const navigate = useNavigate();
  const handleLink = (target: string): void => {
      navigate(`/admin/${target}`);
  };

  const [responseData, setResponseData] = useState(null);

  const fetchData = async () => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/backend_delivery.php`, {
            action: 'getDeliveryList',
            aid: decodedAccessToken.id
        });
        setResponseData(response.data.result);
    } catch (error) {
        console.error(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Navbar />

      <div id="content" className="row">
        <div className="col-md-12">

          <h2 className="text-center mb-3">Delivery List</h2>

          <table className="table table-striped">
            <thead><tr>
              <th scope="col" className="col text-center">Booktime</th>
              <th scope="col" className="col text-center">From</th>
              <th scope="col" className="col text-center">PO Number</th>
              <th scope="col" className="col text-center">Item(s)</th>
            </tr></thead>
            {responseData && responseData.length > 0 ? (
              <tbody>
                {responseData.map((item) => (
                  <>
                    <tr key={item.id}>
                      <td>{item.format_booktime} ({item.duration} mins)</td>
                      <td className="text-center">{item.supplier_name}</td>
                      <td className="text-center">{item.po_number}</td>
                      <td className="text-center">{item.item} {item.type_title}</td>
                    </tr>
                    {item.note && (
                      <tr><td colSpan={4}><span className="">Note: {item.note}</span></td></tr>
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

export default Delivery