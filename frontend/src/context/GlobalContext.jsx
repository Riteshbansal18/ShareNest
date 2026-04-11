import React, { createContext, useState } from 'react';
import toast from 'react-hot-toast';

export const GlobalContext = createContext();

const initialProperties = [
    {
        id: '1',
        title: 'Sun-drenched Master Suite in Historic Brownstone',
        neighborhood: 'Brooklyn Heights',
        price: 1850,
        roommates: 1,
        roomType: 'Single Room',
        amenities: ['Gigabit WiFi'],
        genderPref: 'Female',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0nPUf_UWw4POIbFj2HDx-JmaSfB7oDnMKaxubpllYYbyHWLQuyQproHCT97YOMzqaHjyRjBoEC_ACBAyoiiD9XX68hifCx3luhwY97yFkrD1i9Iftqx0RLuDOgmw6SMRT5WJFjftM7ZmJWXey52r8j070O_JXH3xLk1fREKwuCp-dyZt2ZbNGRiVe5EhVRbUyftqJ5s4S204qwzMV56ThyLX24hQvq7J8AoS5JCTIzcZALfBcieqJeGnswylmkj9m_Sa9P6LpqUZk',
        verified: true,
        userImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhYGukuOVr5zidLWbv1Z3ZGvfzlE7bs_hbTTW9I45WZ518ucSjksDlpYHAe9SK-T7tnOyDXynPUlI8iFkH2eel7mz5-HqrvuGeozW6kduaPdOrdjt2sfp_0zSFpCmST5n9CHUP0UCDDJ7-oclHcXzUwXrneZwRNtSpjOPsQ3Fk5cbU3VY2YY0SiM3pSjGYDydATNlZHwEtkwUPssLnYuuIJ4Jz1fOsZDHrPoZZL1rNA61eMuBsQ0srLlMRcBFSx17uNZk7KJFMV4NS',
        userName: 'Sarah M.',
        justListed: false
    },
    {
        id: '2',
        title: 'Architectural Loft with Private Terrace & Floor Windows',
        neighborhood: 'Williamsburg',
        price: 2100,
        roommates: 2,
        roomType: 'Shared Space',
        amenities: ['Air Conditioning'],
        genderPref: 'Male',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAP8EeDuFx5tuF-YxOSPuOhY7a6xax0WmdG3gWPtWV4ofTL0lb1M80Q_D6hbG4U28UzQv4z6oymGK5ujKS2x59X1eishiO-BDEpl7xM8OUbw3cM8uodS3_cBj8YJXOQY_2isAEFkw7zRNas_vxnZ9PErEVyPVQsUWn1onMabvZ6zXkT3-WPM2p6nnvc4fFooZb61P4GTVWCeJ0YaT80OLjuHXQeqc-SLs4jbkbILBCQQB6v65jvl80wcCuoyinGscLBYTaUBJi7rkQL',
        verified: false,
        userImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDH9xkoDehyb0pGF0rziE1GE0562JDhQTpDJW5fmmeCZdN5ZsfMct046pBKkLGof15D33hM0q3GChfqM9G67mvvIsrDinthIlW4AMJzEjPjF38hXRMiSt65lQ1Dy9_SGpFLDl4AdQ_oc76sLe3_945rQPspviXX_9aWMVrXPurf3EK6j9HlEzgj1oYv_AtS2CotTb3tUwO1jg03oUEZgiEXGbXamj_NBCa9qJe2W4oEiqLTOQvqa0-eM_hzguqlNo38zlhs9zQkbw_V',
        userName: 'David K.',
        justListed: false
    },
    {
        id: '3',
        title: 'Luxury Penthouse Room with En-suite Marble Bath',
        neighborhood: 'Manhattan Downtown',
        price: 2450,
        roommates: 1,
        roomType: 'Single Room',
        amenities: ['Gigabit WiFi', 'Food Services'],
        genderPref: 'Female',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC72NunSvcIhMXDQH2o6ei9kT_GyBwovdDh63j_VGdudDlPd6MvWW6M3jXydEYRe_3n8h6nJqk0THLHA0hNF1cGA9Vpw2gpHfa36Tvj_WQMwiS3KQ2hnNcDDAEenGjRY_Q5HXuyhH34gK_ZGWwjlcmLuVJyoGEkR9QlJg3Y7Q1oxnbh97XLRy0fL97ucNMJHqU9JfqJvfXvsVJylWXvQtBTtkm1jUzY_Dduv6DvpAJCMeH6I3hB4_T0Ihl-A2kvYNmuysVtkzkt7_Pu',
        verified: false,
        userImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7Xt-PRfcB8ZfJT_JOVFZ5TUoxglSR4Ytb5f1f1yW9ARQkXquclzWsn3PqHkjNlq7gVflVHXJo4SKwdhJ_w4QKb_-nt1usI9xPICZr81cwlZoM9EWhx6zzZDuZ6n4zHNfAB5HnNz1gbDQXgBHqW6Dh19IlYTWl-ZT6mra8YY3ngnWeeGVNicy1F1eBw1omcOS4kN8tz_FyqklEFlv6X8Uim_CiWVvr_mpbBFe2aqVD23qUi12eyWAjnsbQrYXhArRUvr5JexihacTz',
        userName: 'Elena R.',
        justListed: false
    },
    {
        id: '4',
        title: 'Creative Studio Space for Artists - Private Alcove',
        neighborhood: 'Williamsburg',
        price: 1900,
        roommates: 1,
        roomType: 'Shared Space',
        amenities: ['Air Conditioning'],
        genderPref: 'Male',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANIJNHAYHR7eXJYtjgxHg7aksRW3OIGzpAy-FFRjlroMOcT1o7jJQ0ezdmQQmSMnLS_e0ZrQWOiJPPsQnuCmbgYgX5b0f4F_zvhqPx5HDpWMykKlppKe3J9H5AO7IyNZfKcD8NH9HEbTLigghQDEqiooIDojJ2tj9Ny016plu2imGPQ4A59gddSRUPwby3V1qyA5RGuBkBvQj6NpKtLJTnELBbD9f5k4ko1RDKoNHJk7WnEVAveRZ5tBLXzYJvtIVsD8ZK6WAHZF8_',
        verified: false,
        userImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLwg7ylVcRMaQHT_aBDoC-tBzuzRkOqwoFxg4Yz49yeTKYyPeCQ_ciOgsPoVMioxWGzHkvh7klv_FBG2JuyFnsVCByhJm_vou1b2V0LgahvAd7QPZ_PO1M-xmkO5QYMWcOuvFOv5QSDq5qFJQ0FqLslMHz9Dbz20BHwnt7YTBVn8fNR-XLjzjqw2DykcomKfD0hiYMqCpIUn_aKIi66rXo5ZXPzODFzBctecs-SUKsllXbRmk5KGcsvS4sCHBYcb6eJQwk_rJqMK4S',
        userName: 'James T.',
        justListed: true
    }
];

const initialRoommates = [
    {
        id: '1',
        name: 'Elena Vance, 28',
        city: 'New York',
        location: 'Brooklyn, New York',
        budget: 1800,
        gender: 'Female',
        tags: ['Non-smoker', 'Pet friendly', 'Early bird'],
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBIIn1KwVwpULUJNeR1I0MdqXhILZ7L_r5Fk3CiXVHYV4D4aW5J63ygbmVv_M88PW3nnklqtdmSt8dtEerQvvKaAxbZYya2Cb3Rqq1sWsdahUPgBJoPoPLwXEbxwnUF57rmuEJdM89QYem0JCGnu9JdVxeTfll4NgxFs2aDr8NHeMMKE98gocTgZwRjL0gk2o9Wt49g6lYI62Qo8y3zjcRzzwC628J5eWNIGfpHk3T477De7DhXRYPYweaEQBKsIZKcKW8u2UGUKoy',
        verified: true
    },
    {
        id: '2',
        name: 'Marcus Chen, 31',
        city: 'Austin',
        location: 'Austin, Texas',
        budget: 1250,
        gender: 'Male',
        tags: ['Work from home', 'Clean freak', 'Vegan'],
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVNvsM_Y2a_uO-dVA9WlJqYXlT3swEkRWdhUob-9qgPew1Nlm-1wrUArSFV6QjbKN-uBlHPUyA6ybpSe9jAm7xEcNK2fh0bT-Z3HoC0c2GgJ9cK7Vb-59PUqomPwjt962bhnROTRzAZKyyEZKbF4Nz-s4ZG-Fqb4UPB8G1Lg5_hjNEs-uEhX-rGN345B9t0Am9MBus0ma5JRjkdx2NG3iEXpoEnsxTB2m3Pppjtg70lgALoWDcexMtjy2hugaEIR1sKh-gfRA8cXfA',
        verified: false
    },
    {
        id: '3',
        name: 'Sarah Jenkins, 24',
        city: 'San Francisco',
        location: 'San Francisco, CA',
        budget: 2400,
        gender: 'Female',
        tags: ['Night owl', 'Musician', 'Artist'],
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtV2hc5Sc91mQ8-G4YccJ7_X01HMClsj3z4ammHjQjxBUeZTr24Di5wr_naNJXZgcnUGzCt6ZjJz4BA8DQbtgap0Zm9DNui81lqph6B7DtIND-QQo-92pYZzu4gL5Z4uW173WA9CHWl2juM5E4KR3wATcQ5n4gGW1SFUs4aMwk_9kFPuJsiZS2L1Kko7AgF4bULuoxpzp1-9jb-Ml6EDRsztBkCTBSfILdHn4EPvigO3NYrxJCB-nDATZEjpa8fHAF60JBLC8xMswo',
        verified: false
    },
    {
        id: '4',
        name: 'Jordan Smith, 26',
        city: 'Austin',
        location: 'Austin, Texas',
        budget: 1500,
        gender: 'Non-binary',
        tags: ['Pet friendly', 'Active', 'Coffee lover'],
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwJShbjOnnNKHqMg1cdTPOcK8fANJX0LfJCcRc0P3YMS3-IuriSwRcB4t1RgD7wTUKVZEXexIopkYeN04KAgHYYGa2aOkT0Ue6rZGrAfl9SjlrAn6bEIH_0E9jd5del6my2ApOMWtdt7P6DKKZc-tWTJgejkd9WqKjYxCtXsbAK5DQ11fw8IdUlD0z07eBBweQHAf8CZFRE7iNblhU4mWAe5f9TDetMpTgblWlUg4dRW1fpxq0YrbDyGYSWeMJGggXQaoWZuKyWNfa',
        verified: true
    },
    {
        id: '5',
        name: 'David Miller, 35',
        city: 'New York',
        location: 'Manhattan, NY',
        budget: 2800,
        gender: 'Male',
        tags: ['Quiet', 'Minimalist', 'Commuter'],
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXPa1YzV2wpBvnLQ9uTAr7fFxtZZkp0ryABUI0i7F5Nzr6MgEtUIUXNJYJxojDd4OPIowFLAVdq1a2EbkYGgccr8Fz5R2GyK46Jez_VH2xpABzDESOdeoBLjud3ugeCQSzJiqNIT5MGttk5XwKd-P7q9KF3Tbsx3XbgmLUH4pT3Umift-t76v5x9qmNj9Wh8WIa1-dPcXcQCSqcmRiCKEiV2D_63sgxPXiFQAW9ui_73qJgmka8BPQD4alzRTOxLNAqXDd8ybZRqYQ',
        verified: false
    },
    {
        id: '6',
        name: 'Amina K., 23',
        city: 'New York',
        location: 'Brooklyn, NY',
        budget: 1100,
        gender: 'Female',
        tags: ['Student', 'Sociable', 'Gamer'],
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhX2O00K6NcQb969gQXBgELvVp4yJzQLa3nwMzX8CpE-tSldhUSL8XrlBPksKa54_D_8K71e1q_uVasmw6LqM-bXvYDpnpzwYqQKb6CIjDMko6Ps6JExaUhFpg5qeNtJAkdiY7JSVuDZ4Hw1H3mo8f11KDW-hf-DRvpZy5scJ7F-v4rxHogpf6cftbNyrNmORtoT-1FDnx0HAVTgtohL5XfXnyEIjnDGxTEDUiXbOJjETSXm7MmB5GGcLyKBHcYm-cXXUHOtF4J1V_',
        verified: false
    }
];

export const GlobalProvider = ({ children }) => {
    const [properties, setProperties] = useState(initialProperties);
    const [roommates, setRoommates] = useState(initialRoommates);
    // store arrays of IDs
    const [favoriteProperties, setFavoriteProperties] = useState(['1', '2']);
    const [favoriteRoommates, setFavoriteRoommates] = useState([]);

    const toggleFavoriteProperty = (id) => {
        if (favoriteProperties.includes(id)) {
            setFavoriteProperties(prev => prev.filter(pId => pId !== id));
            toast.success('Removed from favorites!', { icon: '💔' });
        } else {
            setFavoriteProperties(prev => [...prev, id]);
            toast.success('Saved to favorites!', { icon: '❤️' });
        }
    };

    const toggleFavoriteRoommate = (id) => {
        if (favoriteRoommates.includes(id)) {
            setFavoriteRoommates(prev => prev.filter(rId => rId !== id));
            toast.success('Removed from favorites!', { icon: '💔' });
        } else {
            setFavoriteRoommates(prev => [...prev, id]);
            toast.success('Saved to favorites!', { icon: '❤️' });
        }
    };

    const addProperty = (newProperty) => {
        const id = (properties.length + 1).toString();
        setProperties([{ ...newProperty, id }, ...properties]);
    };

    return (
        <GlobalContext.Provider value={{
            properties,
            roommates,
            favoriteProperties,
            favoriteRoommates,
            toggleFavoriteProperty,
            toggleFavoriteRoommate,
            addProperty
        }}>
            {children}
        </GlobalContext.Provider>
    );
};
