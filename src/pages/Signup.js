import React from 'react';
import styles from '../styles/login.module.css'
import { useState } from 'react';
import {useToasts} from 'react-toast-notifications';
import {Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';

const Signup = () => {
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [confirmpassword,setConfirmPassword] = useState('');
    const [signingUp,setSigningUp] = useState(false);
    const {addToast} = useToasts();
    const auth = useAuth();
    const navigate = useNavigate();

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSigningUp(true);

        let error = false;
        if (!name || !email || !password || !confirmpassword) {
            addToast('plaese enter both email and password', {
              appearance: 'error',
              autoDismiss: true,
            });
            error = true;
        }
        
        if (password !== confirmpassword) {
            addToast('Make sure password and confirm password matches', {
              appearance: 'error',
              autoDismiss: true,
            });
      
            error = true;
        }

        if(error){
            return setSigningUp(false);
        }

        const response = await auth.signup(name,email,password,confirmpassword);
        if(response.success){
            navigate('/login');
            setSigningUp(false);
            // addToast('User registered successfully,please login now', {
            //     appearance: 'sucess',
            //     autoDismiss: true,
            // });
        }else{
            addToast(response.message, {
                appearance: 'error',
                autoDismiss: true,
            });
        }
        setSigningUp(false);
    }

    if (auth.user) {
        return <Navigate to="/" />;
    }

    return (
        <form className={styles.loginForm} onSubmit={handleFormSubmit}>
            <span className={styles.loginSignupHeader}>Signup</span>
            <div className={styles.field}>
                <input
                    placeholder='Name'
                    type='text'
                    required
                    value={name}
                    onChange={(e)=> setName(e.target.value)}
                />
            </div>
            <div className={styles.field}>
                <input
                    placeholder='Email'
                    type='email'
                    required
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                />
            </div>
            <div className={styles.field}>
                <input
                    placeholder='Password'
                    type='password'
                    required
                    value={password}
                    onChange={(e)=> setPassword(e.target.value)}
                />
            </div>
            <div className={styles.field}>
                <input
                    placeholder='Confirm password'
                    type='password'
                    required
                    value={confirmpassword}
                    onChange={(e)=> setConfirmPassword(e.target.value)}
                />
            </div>
            <div className={styles.field}>
                <button disabled={signingUp}>
                    {signingUp ? 'Signing up...' : 'Signup'}
                </button>
            </div>
        </form>
    );
}

export default Signup;