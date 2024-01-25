import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Forget = () => {
    const navigate = useNavigate();
    const handleLink = (target: string): void => {
        navigate(`/${target}`);
    };

    if (localStorage.getItem('token')) {
        handleLink('mybooking');
      }

    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({
        email: '',
    });
    const [isBtnLoading, setIsBtnLoading] = useState(false);

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            email: '',
        };

        // Basic validation for empty fields
        if (!email.trim()) {
            isValid = false;
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            isValid = false;
            newErrors.email = 'Invalid email format';
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            try {
                setIsBtnLoading(true);
                axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/frontend.php`, {
                    action: 'forget',
                    email,
                }).then(function(response){
                    if (response.data.status === 200) {
                        navigate('/login');
                    } else {
                        console.error('Reset password failed');
                    }
                });
            } catch (error) {
                console.error('An error occurred during reset password:', error);
            }
        }
        setIsBtnLoading(false);
    };

    return (
        <div className="row pt-5">
            <h2 className="text-center pb-3">Reset Password</h2>

            <div className="col"></div>

            <div className="col-md-6 col-xs-12">

                <div className="input-container">
                    <input type="email" id="email" name="email" onChange={(e) => setEmail(e.target.value)} />
                    <label htmlFor="email">Email *</label>
                    <div className="error font-red">{errors.email}</div>
                </div>

                <p><i>* Mandatory field</i></p>

                <div className='input-container'><div className='row'>
                    <div className="col">
                        <button type="button" className="btn btn-fullwidth btn-blue" disabled={isBtnLoading} onClick={handleSubmit}>
                            {isBtnLoading ? 'Reseting...' : 'Reset'}
                        </button>
                    </div>
                    <div className="col">
                        <button className="btn btn-fullwidth btn-darkgray" onClick={() => handleLink('login')}>Cancel</button>
                    </div>

                </div></div>
            </div>

            <div className="col"></div>
        </div>
    )
}

export default Forget