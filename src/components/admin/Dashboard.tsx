import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar"
import { tokenAdminId } from "../../common/authUtils";
import axios from "axios";

const Dashboard = () => {

  // const navigate = useNavigate();
  // const handleLink = (target: string): void => {
  //   navigate(`/admin/${target}`);
  // };

  // const [responseData, setResponseData] = useState(null);
  const adminId = tokenAdminId()

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/backend_dashboard.php`, {
        action: 'getDashboardList',
        aid: adminId
      });
      console.log(response.data.result)
      // setResponseData(response.data.result);
    } catch (error) {
      console.error(error);
    }
  }
  
  return (
    <>
      <Navbar />

      <div id="content" className="row">
        <div className="col"></div>
        <div className="col-md-6">

          <h2 className="text-center mb-3">Dashboard</h2>

          <div className="row text-center">
          {/* {responseData ? (
            <>
              {responseData.cnt_delivery && (
                <div className="col">
                  <i className="bi bi-truck"></i>&nbsp;{responseData.cnt_delivery}&nbsp;Booking
                </div>
              )}
              {responseData.cnt_enquiry && (
                <div className="col">
                  <i class="bi bi-envelope"></i>&nbsp;{responseData.cnt_enquiry}&nbsp;Enquiry
                </div>
              )}
            </>
          ) : ( */}
            <p>Loading...</p>
          {/* )} */}
          </div>
        </div>
        <div className="col"></div>
      </div>
    </>
  )
}

export default Dashboard