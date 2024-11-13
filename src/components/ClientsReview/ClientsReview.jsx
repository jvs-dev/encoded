import React from 'react'
import './ClientsReview.css'
const clients = [
    'https://i.pinimg.com/236x/b2/8a/54/b28a54f138a38869765515f0e710db4d.jpg',
    'https://i.pinimg.com/236x/e3/d0/46/e3d046f3af976ca1be2b316920b317fa.jpg',
    'https://i.pinimg.com/236x/d5/9a/29/d59a29c3039db812370e9b8206a20b59.jpg',
    'https://i.pinimg.com/236x/dc/5f/a5/dc5fa5fb5beb76d747c79de9377d5154.jpg',
    'https://i.pinimg.com/236x/51/3d/be/513dbe1301892505f6d48ebe759237f7.jpg'
]

const ClientsReview = () => {
    return (
        <div className='clientReviewDiv'>
            <div className='clientReviewDiv__div--1'>
                {clients.map((link, index) => <img key={index} className='clientReview__img' src={link} />)}
            </div>
            <div className='clientReviewDiv__div--2'>
                <ion-icon name="star"></ion-icon>
                <ion-icon name="star"></ion-icon>
                <ion-icon name="star"></ion-icon>
                <ion-icon name="star"></ion-icon>
                <ion-icon name="star"></ion-icon>
            </div>
            <p className='clientReviewDiv__p'>Excelente </p>
        </div>
    )
}

export default ClientsReview
