import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from './components/Header'
import Footer from './components/Footer'
import Login from './components/Login'
import Signup from "./components/Signup";
import Forget from "./components/Forget";
import MyBookingInsert from "./components/MyBookingInsert";
import MyBooking from "./components/MyBooking";
import MyBookingEdit from "./components/MyBookingEdit";
import MyBookingDelete from "./components/MyBookingDelete";
import MyEnquiry from "./components/MyEnquiry";
import MyEnquiryEdit from "./components/MyEnquiryEdit";
import MyEnquiryInsert from "./components/MyEnquiryInsert";

import { getAndDecodeToken } from './common/authUtils';
import { getAndDecodeAccessToken } from './common/authUtils';
import { AuthContext } from "./contexts/AuthContext";


import AdminLogin from "./components/admin/Login"
import Dashboard from "./components/admin/Dashboard";
import Admin from "./components/admin/Admin";
import AdminInsert from "./components/admin/AdminInsert";
// import AdminEdit from "./components/admin/AdminEdit";
import Delivery from "./components/admin/Delivery";
import Enquiry from "./components/admin/Enquiry";
import EnquiryEdit from "./components/admin/EnquiryEdit";
import Holiday from "./components/admin/Holiday";
import HolidayInsert from "./components/admin/HolidayInsert";
import Supplier from "./components/admin/Supplier";
import SupplierInsert from "./components/admin/SupplierInsert";

function App() {

  const [decodedToken, setDecodedToken] = useState<object | null>(null);
  const [decodedAccessToken, setDecodedAccessToken] = useState<object | null>(null);

  useEffect(() => {
    const localDecodedToken = getAndDecodeToken();
    if (localDecodedToken) {
      setDecodedToken(localDecodedToken)
    }
  }, []);
  useEffect(() => {
    const localDecodedAccessToken = getAndDecodeAccessToken();
    if (localDecodedAccessToken) {
      setDecodedAccessToken(localDecodedAccessToken)
    }
  }, []);


  return (
    <>
      <Header />

      <div className="container">
        {/* frontend */}
        <AuthContext.Provider value={{decodedToken}}>
          <Router>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forget" element={<Forget />} />
              <Route path="/mybooking" element={<MyBooking />} />
              <Route path="/mybooking/insert" element={<MyBookingInsert />} />
              <Route path="/mybooking/edit/:id" element={<MyBookingEdit />} />
              <Route path="/mybooking/delete/:id" element={<MyBookingDelete />} />
              <Route path="/myenquiry" element={<MyEnquiry />} />
              <Route path="/myenquiry/:id" element={<MyEnquiryEdit />} />
              <Route path="/newenquiry" element={<MyEnquiryInsert />} />
              </Routes>
          </Router>
        </AuthContext.Provider>

        {/* backend */}
        <AuthContext.Provider value={{decodedAccessToken}}>
          <Router>
            <Routes>
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/admin" element={<Admin />} />
              <Route path="/admin/admin/insert" element={<AdminInsert />} />
              {/* <Route path="/admin/admin/:id" element={<AdminEdit />} /> */}
              <Route path="/admin/delivery" element={<Delivery />} />
              <Route path="/admin/enquiry" element={<Enquiry />} />
              <Route path="/admin/enquiry/:id" element={<EnquiryEdit/ >} />
              <Route path="/admin/holiday" element={<Holiday />} />
              <Route path="/admin/holiday/insert" element={<HolidayInsert />} />
              <Route path="/admin/supplier" element={<Supplier />} />
              <Route path="/admin/supplier/insert" element={<SupplierInsert />} />
            </Routes>
          </Router>
        </AuthContext.Provider>
      </div>

      <Footer />
    </>
  )
}

export default App
