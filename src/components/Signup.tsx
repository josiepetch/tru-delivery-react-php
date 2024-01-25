import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
    const navigate = useNavigate();
    const handleLink = (target: string): void => {
        navigate(`/${target}`);
    };

    if (localStorage.getItem('token')) {
        handleLink('mybooking');
    }

    const [isBtnLoading, setIsBtnLoading] = useState(false);
    const [company, setCompany] = useState('');
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [errors, setErrors] = useState({
        company: '',
        contact: '',
        email: '',
        phone: '',
    });

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            company: '',
            contact: '',
            email: '',
            phone: '',
        };

        // Basic validation for empty fields
        if (!company.trim()) {
            isValid = false;
            newErrors.company = 'Company is required';
        }

        if (!contact.trim()) {
            isValid = false;
            newErrors.contact = 'Contact is required';
        }

        if (!email.trim()) {
            isValid = false;
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            isValid = false;
            newErrors.email = 'Invalid email format';
        }

        if (phone != '' && !/^\d{10}$/.test(phone)) {
            isValid = false;
            newErrors.phone = 'Invalid phone number format';
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            try {
                setIsBtnLoading(true);
                axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/frontend.php`, {
                    action: 'signup',
                    company,
                    contact,
                    email,
                    phone,
                }).then(function(response){
                    if (response.data.status === 200) {
                        navigate('/login');
                    } else {
                        console.error('Signup failed');
                    }
                });
            } catch (error) {
                console.error('An error occurred during login:', error);
            }
        }
        setIsBtnLoading(false);
    };

    return (
        <div className="row pt-5">
            <h2 className="text-center pb-3">Signup</h2>

            <div className="col"></div>

            <div className="col-md-6 col-xs-12">
                <div className="input-container">
                    <input type="text" id="company" name="company" onChange={(e) => setCompany(e.target.value)} />
                    <label htmlFor="company">Company *</label>
                    <div className="error font-red">{errors.company}</div>
                </div>

                <div className="input-container">
                    <input type="text" id="contact" name="contact" onChange={(e) => setContact(e.target.value)} />
                    <label htmlFor="contact">Contact *</label>
                    <div className="error font-red">{errors.contact}</div>
                </div>

                <div className="input-container">
                    <input type="email" id="email" name="email" onChange={(e) => setEmail(e.target.value)} />
                    <label htmlFor="email">Email *</label>
                    <div className="error font-red">{errors.email}</div>
                </div>

                <div className="input-container">
                    <input type="text" id="phone" name="phone" onChange={(e) => setPhone(e.target.value)} placeholder='Optional' />
                    <label htmlFor="phone">Phone</label>
                    <div className="error font-red">{errors.phone}</div>
                </div>

                <p><i>* Mandatory field</i></p>

                <div className='input-container'><div className='row'>
                    <div className="col">
                        <button type="button" className="btn btn-fullwidth btn-blue" disabled={isBtnLoading} onClick={handleSubmit}>
                            {isBtnLoading ? 'Signing up...' : 'Signup'}
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

export default Signup