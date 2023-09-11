import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { query, collection, getDocs, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, logout } from '../Data/firebase';
import { Alert } from '@mui/material';
import AlertModal from '../Components/AlertModal';
import Loading from '../Components/Loading';

export default function SiteProfile( { mobileView } ) {

    const navigate = useNavigate();

    const [user, loading, error] = useAuthState(auth);
    const [name, setName] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [infoLoading, setInfoLoading] = useState(true);

    const fetchUserName = async () => {
        try {
            const q = query(collection(db, 'users'), where('uid', '==', user?.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();
            setName(data.name);
            setInfoLoading(false);
        } catch (err) {
            console.error(err);
            alert('An error occured while fetching user data');
        }
    };

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate('/login');
        if (name === '') {
            setInfoLoading(true);
            fetchUserName();
        }
    }, [user, loading]);
  
    return (
        <div className='profile'>
            {error ? <Alert severity='error'>An error occurred!</Alert> : <></>}
            {!infoLoading ? <p>{name}</p> : <Loading/>}
            <AlertModal title={'Logout'} 
                description={'Are you sure you want to logout?'} 
                handleClick={logout}/>
        </div>
    );
};