import axios from "axios";
import { useEffect, useState, useContext, useRef } from "react";
import { Navigate, useParams } from "react-router-dom";
import Header from "../Header/Header";
import format from "date-fns/format";
import classNames from "classnames/bind";
import styles from './DeatilPage.module.scss';
import Comment from "./Comment";
import { UserContext } from '../User/User';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faUser, faPhone, faHome, faMapMarkerAlt, faStar ,faWifi,faParking ,faKitchenSet ,faSnowflake,faFire ,faTag ,faShieldVirus ,faFireExtinguisher  } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function DetailPage() {
    const { id } = useParams();
    const user = useContext(UserContext);
    const [data, setData] = useState({});
    const [name, setName] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [phone, setPhone] = useState('');
    const [max, setMax] = useState(1);
    const [notice, setNotice] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [activeImage, setActiveImage] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:6060/detail')
            .then(res => {
                const placeData = res.data.find(item => item._id === id);
                setData(placeData);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        if (max > data.maxGuests) {
            setNotice(true);
        } else {
            setNotice(false);
        }
    }, [max, data.maxGuests]);

    async function handelSubmit(e) {
        e.preventDefault();
        if (user.user) {
            const { data } = await axios.post('http://localhost:6060/booking', {
                id: id,
                userId: user.user._id,
                checkIn: format(new Date(checkIn), 'MM/dd/yyyy'),
                checkOut: format(new Date(checkOut), 'MM/dd/yyyy'),
                numberOfPeople: max
            });
            alert("Booking successful!");
        } else {
            setRedirect(true);
        }
    }

    if (redirect) {
        return <Navigate to={'/login'} />;
    }

    if (loading) {
        return (
            <div className={cx('loading-container')}>
                <div className={cx('loading-spinner')}></div>
                <p>Loading property details...</p>
            </div>
        );
    }

    return (
        <div className={cx('detail-page')}>
            <Header />
            
            <div className={cx('property-header')}>
                <h1 className={cx('property-title')}>{data.title}</h1>
                <div className={cx('property-meta')}>
                    <span className={cx('property-rating')}>
                        <FontAwesomeIcon icon={faStar} className={cx('star-icon')} />
                        {data.rating || 'New'}
                    </span>
                    <span className={cx('property-location')}>
                        <FontAwesomeIcon icon={faMapMarkerAlt} className={cx('location-icon')} />
                        {data.address}
                    </span>
                </div>
            </div>

            <div className={cx('gallery-container')}>
                <div className={cx('main-image')}>
                    {data.addedPhotos && data.addedPhotos.length > 0 && (
                        <img 
                            src={`http://localhost:6060/${data.addedPhotos[activeImage]}`} 
                            alt={`Property ${activeImage + 1}`}
                            className={cx('active-image')}
                        />
                    )}
                </div>
                <div className={cx('thumbnail-container')}>
                    {data.addedPhotos && data.addedPhotos.map((photo, index) => (
                        <div 
                            key={index} 
                            className={cx('thumbnail', { active: index === activeImage })}
                            onClick={() => setActiveImage(index)}
                        >
                            <img 
                                src={`http://localhost:6060/${photo}`} 
                                alt={`Thumbnail ${index + 1}`}
                                className={cx('thumbnail-image')}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className={cx('property-details')}>
            <div className={cx('details-content')}>
    <div className={cx('property-description')}>
        <h2 className={cx('section-title')}>About this place</h2>
        <p className={cx('description-text')}>{data.desc}</p>
    </div>

    <div className={cx('amenities-section')}>
        <h2 className={cx('section-title')}>Amenities</h2>
        <div className={cx('amenities-grid')}>
            <div className={cx('amenity-item')}>
                <FontAwesomeIcon icon={faHome} className={cx('amenity-icon')} />
                <span>Entire home</span>
            </div>
            <div className={cx('amenity-item')}>
                <FontAwesomeIcon icon={faUser} className={cx('amenity-icon')} />
                <span>Max guests: {data.maxGuests}</span>
            </div>
            <div className={cx('amenity-item')}>
                <FontAwesomeIcon icon={faWifi} className={cx('amenity-icon')} />
                <span>High-speed WiFi</span>
            </div>
            <div className={cx('amenity-item')}>
                <FontAwesomeIcon icon={faParking} className={cx('amenity-icon')} />
                <span>Free parking</span>
            </div>
            <div className={cx('amenity-item')}>
                <FontAwesomeIcon icon={faKitchenSet} className={cx('amenity-icon')} />
                <span>Fully equipped kitchen</span>
            </div>
            <div className={cx('amenity-item')}>
                <FontAwesomeIcon icon={faSnowflake} className={cx('amenity-icon')} />
                <span>Air conditioning</span>
            </div>
        </div>
    </div>

    {/* Thêm các tiện ích mới */}
    <div className={cx('highlight-section')}>
        <h2 className={cx('section-title')}>Highlights</h2>
        <div className={cx('highlight-badges')}>
            <span className={cx('badge', 'superhost')}>
                <FontAwesomeIcon icon={faStar} /> Superhost
            </span>
            <span className={cx('badge', 'popular')}>
                <FontAwesomeIcon icon={faFire} /> Popular
            </span>
            <span className={cx('badge', 'deal')}>
                <FontAwesomeIcon icon={faTag} /> Special Deal
            </span>
        </div>
    </div>

    <div className={cx('safety-section')}>
        <h2 className={cx('section-title')}>Safety & Hygiene</h2>
        <div className={cx('safety-grid')}>
            <div className={cx('safety-item')}>
                <FontAwesomeIcon icon={faShieldVirus} className={cx('safety-icon')} />
                <div>
                    <h4>COVID-19 Safety</h4>
                    <p>Enhanced cleaning protocol</p>
                </div>
            </div>
            <div className={cx('safety-item')}>
                <FontAwesomeIcon icon={faFireExtinguisher} className={cx('safety-icon')} />
                <div>
                    <h4>Safety Equipment</h4>
                    <p>Smoke detector and fire extinguisher</p>
                </div>
            </div>
        </div>
    </div>
</div>

                <div className={cx('booking-form-container')}>
                    <form onSubmit={handelSubmit} className={cx('booking-form')}>
                        <div className={cx('price-section')}>
                            <h3 className={cx('price')}>${data.price}</h3>
                            <span className={cx('price-period')}>per night</span>
                        </div>

                        <div className={cx('date-picker')}>
                            <div className={cx('input-group')}>
                                <label className={cx('input-label')}>
                                    <FontAwesomeIcon icon={faCalendarAlt} className={cx('input-icon')} />
                                    Check-in
                                </label>
                                <input 
                                    type="date" 
                                    value={checkIn}
                                    onChange={e => setCheckIn(e.target.value)}
                                    className={cx('date-input')}
                                    required
                                />
                            </div>

                            <div className={cx('input-group')}>
                                <label className={cx('input-label')}>
                                    <FontAwesomeIcon icon={faCalendarAlt} className={cx('input-icon')} />
                                    Check-out
                                </label>
                                <input 
                                    type="date" 
                                    value={checkOut}
                                    onChange={e => setCheckOut(e.target.value)}
                                    className={cx('date-input')}
                                    required
                                />
                            </div>
                        </div>

                        <div className={cx('input-group')}>
                            <label className={cx('input-label')}>
                                <FontAwesomeIcon icon={faUser} className={cx('input-icon')} />
                                Full Name
                            </label>
                            <input 
                                type="text" 
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className={cx('text-input')}
                                required
                            />
                        </div>

                        <div className={cx('input-group')}>
                            <label className={cx('input-label')}>
                                <FontAwesomeIcon icon={faPhone} className={cx('input-icon')} />
                                Phone Number
                            </label>
                            <input 
                                type="tel" 
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                className={cx('text-input')}
                                required
                            />
                        </div>

                        <div className={cx('input-group')}>
                            <label className={cx('input-label')}>
                                <FontAwesomeIcon icon={faUser} className={cx('input-icon')} />
                                Number of Guests
                            </label>
                            <input 
                                type="number" 
                                min="1"
                                max={data.maxGuests + 5}
                                value={max}
                                onChange={e => setMax(e.target.value)}
                                className={cx('text-input')}
                                required
                            />
                            {notice && (
                                <div className={cx('notice-message')}>
                                    You're exceeding by {max - data.maxGuests} guests (additional 10% fee per person)
                                </div>
                            )}
                        </div>

                        <button type="submit" className={cx('book-button')}>
                            Book Now
                        </button>
                    </form>
                </div>
            </div>

            <Comment select={id} />
        </div>
    );
}

export default DetailPage;