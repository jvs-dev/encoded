import React from 'react'
import './worksCarroussel.css'

const postLinks = ['https://i.pinimg.com/236x/89/09/87/8909876526e95f73ff72f9acf85e5fdb.jpg',
    'https://i.pinimg.com/236x/98/de/09/98de09178a1b51f950bf727c984e84de.jpg',
    'https://i.pinimg.com/236x/fe/2c/91/fe2c91b4a9c79d3c86c801b395a134e8.jpg',]

const WorksCarroussel = () => {
    return (
        <div className='worksCarroussel'>
            {postLinks.map((link, index) => <img className='WorksCarroussel__postImg' key={index} src={link} />)}
        </div>
    )
}

export default WorksCarroussel
