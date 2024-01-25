import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isBtnLoading, setIsBtnLoading] = useState(false);

  const navigate = useNavigate();
  const handleLink = (target: string): void => {
    navigate(`/${target}`);
  };

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
        email: '',
        password: '',
    };

    // Basic validation for empty fields
    if (!email.trim()) {
        isValid = false;
        newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        isValid = false;
        newErrors.email = 'Invalid email format';
    }

    if (!password.trim()) {
      isValid = false;
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (validateForm()) {
      try {
        setIsBtnLoading(true);
        const response = await axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/frontend.php`, {
          action: 'login', email, password });
    
        if (response.data.status === 200) {
          localStorage.setItem("token", response.data.token);
          handleLink('mybooking');
        } else {
          console.error('Login failed: Invalid email or password');
          setErrorMessage('Invalid email or password')
        }
      } catch (error) {
        console.error('An error occurred during login:', error);
      }
    }

    setIsBtnLoading(false);
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
        handleLink('mybooking');
    }
  }, []);

  return (
    <div className="row pt-5">

      <h2 className='text-center mb-4'>Delivery Booking</h2>

      <div className="col"></div>

      <div className="col-md-6 col-xs-12">
          {errorMessage&&
            <div className='alert alert-danger text-center mb-4'>{errorMessage}</div>
          }

          <div className="input-container">
              <input type="email" id="email" name="email" onChange={(e) => setEmail(e.target.value)} />
              <label htmlFor="email">Email *</label>
              <div className="error font-red">{errors.email}</div>
          </div>

          <div className="input-container">
              <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)} />
              <label htmlFor="password">Password *</label>
              <div className="error font-red">{errors.password}</div>
          </div>

          <p><i>* Mandatory field</i></p>

          <button type="button" className="btn btn-fullwidth bg-link-blue" onClick={() => handleLink('forget')}>
            Forget?
          </button>
          <button type="button" className="btn btn-fullwidth bg-blue" disabled={isBtnLoading} onClick={() => handleLogin()}>
            {isBtnLoading ? 'Logging in...' : 'Login'}
          </button>
          <div className="separator">
            <hr className="separator-left" />
            <span>OR</span>
            <hr className="separator-right" />
          </div>
          <button type="button" className="btn btn-fullwidth bg-blue" onClick={() => handleLink('signup')}>
            Signup
          </button>
      </div>

      <div className="col"></div>
    </div>
  );
};

export default Login;
