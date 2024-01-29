import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar"
import { tokenAdminId } from "../../common/authUtils";

const SupplierInsert = () => {

    const navigate = useNavigate();
    const handleLink = (target: string): void => {
        navigate(`/admin/${target}`);
    };

    const [supplier, setSupplier] = useState('');
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [length, setLength] = useState(12);
    const [isValidSupplier, setIsValidSupplier] = useState(true);
    const [isValidContact, setIsValidContact] = useState(true);
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [emailError, setEmailError] = useState(false);
    const [isBtnLoading, setIsBtnLoading] = useState(false);
    const adminId = tokenAdminId()

    const handleIncrease = (index : number) => {
        setLength(length+index)
    }
    const handleDecrease = (index : number) => {
        setLength(length-index)
    }

    const handleSupplierChange = (e : any) => {
        const newSupplier = e.target.value;
        setSupplier(newSupplier);
    
        // Check if the name does not contain special characters
        const nameRegex = /^[A-Za-z0-9.,\s]+$/;
        setIsValidSupplier(nameRegex.test(newSupplier));
    };

    const handleContactChange = (e : any) => {
        const newContact = e.target.value;
        setContact(newContact);
    
        // Check if the name does not contain numbers or special characters
        const nameRegex = /^[A-Za-z\s]+$/;
        setIsValidContact(nameRegex.test(newContact));
    };

    const handleEmailChange = (e : any) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
    
        // Check email format using a regular expression
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsValidEmail(emailRegex.test(newEmail));
    };

    // to check duplicate email
    const containsEmailWord = (text : string) => {
        const lowercaseText = text.toLowerCase();
      
        return lowercaseText.includes('email');
    };

    const handleSubmit = () => {
        try {
            setIsBtnLoading(true);
            axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/api/backend_supplier.php`, {
                action: 'insertSupplier',
                aid: adminId,
                supplier,
                contact,
                email,
                phone,
                length
            }).then(function(response){
                if (response.data.status === 200) {
                    navigate('/admin/supplier', { state: { message: `Insert an new supplier successfully!` } });
                } else {
                    if (containsEmailWord(response.data.message)) {
                        setEmailError(true)
                    }
                }
            });
        } catch (error) {
            console.error('An error occurred during inserting:', error);
        }
        setIsBtnLoading(false);
    }
    
    return (
        <>
            <Navbar />

            <div id="content" className="row">
                <div className="col-md-12">

                    <h2 className="text-center mb-3">Add new supplier</h2>

                    <div className="row">
                        <div className="col"></div>
                        <div className="col-md-9">

                            <div className="input-group mb-3">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroup-supplier">Supplier</span>
                                    </div>
                                    <input type="text" className="form-control" placeholder="... Toys R Us"
                                        id="supplier" name="supplier" value={supplier}
                                        aria-label="supplier" aria-describedby="inputGroup-supplier"
                                        onChange={handleSupplierChange}
                                    />
                                </div>
                                {!isValidSupplier &&
                                    <span className="text-danger"><i>Supplier name contain special characters!</i></span>
                                }
                            </div>

                            <div className="input-group mb-3">
                                <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-contact">Contact</span>
                                </div>
                                <input type="text" className="form-control" placeholder="... John Delivery"
                                    id="contact" name="contact" value={contact}
                                    aria-label="contact" aria-describedby="inputGroup-contact"
                                    onChange={handleContactChange}
                                />
                                </div>
                                {!isValidContact &&
                                    <span className="text-danger"><i>Contact name contain special characters or number!</i></span>
                                }
                            </div>

                            <div className="mb-3">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroup-email">Email</span>
                                    </div>
                                    <input type="email" className={`form-control ${emailError ? 'is-invalid' : '' }`} placeholder="... john@toysrus.com.au"
                                        id="email" name="email" value={email}
                                        aria-label="email" aria-describedby="inputGroup-email"
                                        onChange={handleEmailChange}
                                    />
                                </div>
                                {emailError &&
                                    <span className="text-danger"><i>Email already exists</i></span>
                                }
                                {!isValidEmail &&
                                    <span className="text-danger"><i>Wrong email format</i></span>
                                }
                            </div>

                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-phone">Phone</span>
                                </div>
                                <input type="text" className="form-control" placeholder="Optional"
                                    id="phone" name="phone" value={phone}
                                    aria-label="phone" aria-describedby="inputGroup-phone"
                                    onChange={(e)=>{setPhone(e.target.value)}}
                                />
                            </div>

                            <p><b>Manage Password</b></p>

                            <div className="rounded box-gray-border mb-4">
                                    <div className="row mt-3 mb-3">
                                        <div className="col"></div>
                                        <div className="col-md-9">
                                                <div className="input-group">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text" id="basic-addon2">Length</span>
                                                    </div>
                                                    <input type="text" className="form-control"
                                                        id="length" name="length"
                                                        placeholder="12"
                                                        aria-label="length" aria-describedby="basic-addon2"
                                                        value={length}
                                                    />
                                                    <div className="input-group-append">
                                                        <button className="btn btn-outline-secondary" type="button"
                                                        onClick={()=>handleDecrease(1)}>-</button>
                                                        <button className="btn btn-outline-secondary" type="button"
                                                        onClick={()=>handleIncrease(1)}>+</button>
                                                    </div>
                                                </div>
                                            
                                        </div>
                                        <div className="col"></div>
                                    </div>
                                </div>            
                                
                                <div className="row">
                                    <div className="col-md-6">
                                        <button className="btn btn-fullwidth btn-blue" disabled={!supplier||!contact||isValidEmail||isBtnLoading} onClick={() => handleSubmit()}>
                                            Submit
                                        </button>
                                    </div>
                                    <div className="col-md-6">
                                        <button className="btn btn-darkgray w-100" type="button" onClick={()=>handleLink('supplier')}>Cancel</button>
                                    </div>
                                </div>
                        </div>
                        <div className="col"></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SupplierInsert