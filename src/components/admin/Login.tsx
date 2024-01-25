import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isBtnLoading, setIsBtnLoading] = useState(false);

    const navigate = useNavigate();

    const handleLink = (target: string): void => {
        navigate(`/admin/${target}`);
    };

    const handleLogin = async () => {
        try {
            setIsBtnLoading(true);
            const response = await axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/backend.php`, {
                action: 'login',
                username,
                password,
            });

            if (response.data.status === 200) {
                console.log('Login complete.');
                localStorage.setItem('access_token', response.data.token);
                handleLink('delivery');
            } else {
                console.error('Login failed');
            }
        } catch (error) {
            console.error('An error occurred during login:', error);
        }

        // setUsername('');
        // setPassword('');
    };

    useEffect(() => {
        if (localStorage.getItem('access_token')) {
            handleLink('dashboard');
        }
    }, []);

    return (
        <div className="row pt-5">

        <h2 className='text-center mb-4'>Admin Delivery Booking</h2>

        <div className="col"></div>

        <div className="col-md-6 col-xs-12">
            <div className="mb-3">
                <label htmlFor="username" className="form-label">
                Username
                </label>
                <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                aria-describedby="usernameHelp"
                onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">
                Password
                </label>
                <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <button className="btn btn-fullwidth bg-blue" disabled={isBtnLoading} onClick={() => handleLogin()}>
                {isBtnLoading ? 'Logging in...' : 'Login'}
            </button>
        </div>

        <div className="col"></div>
        </div>
    );

}

export default Login;