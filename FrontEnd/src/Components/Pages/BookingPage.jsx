import axios from "axios";
import { useEffect, useContext, useState } from "react";
import { UserContext } from "../User/User";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faArrowRight, 
  faSpinner,
  faCalendarDays,
  faUserGroup,
  faDollarSign,
  faHouse
} from "@fortawesome/free-solid-svg-icons";
import { differenceInCalendarDays, format } from "date-fns";
import styles from './BookingPage.module.scss';
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function BookingPage() {
    const user = useContext(UserContext);
    const [bookings, setBookings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user.user) {
            setLoading(true);
            axios.get('http://localhost:6060/booking')
                .then(res => {
                    if (user.user) {
                        const data = res.data.filter(item => item.userBooking === user.user._id);
                        setBookings(data);
                    }
                })
                .catch(error => {
                    console.error("Error fetching bookings:", error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [user]);

    const calculateTotalPrice = (booking, days) => {
        const basePrice = days * booking.place.price;
        return booking.difference > 0 
            ? basePrice + (booking.difference * booking.place.price / 10)
            : basePrice;
    };

    return (
        <div className={cx('booking-page')}>
            <h1 className={cx('page-title')}>Your Bookings</h1>
            
            {loading ? (
                <div className={cx('loading-container')}>
                    <FontAwesomeIcon icon={faSpinner} className={cx('loading-icon')} />
                    <p>Loading your bookings...</p>
                </div>
            ) : bookings && bookings.length > 0 ? (
                <div className={cx('bookings-container')}>
                    {bookings.map((booking, index) => {
                        const days = differenceInCalendarDays(
                            new Date(booking.checkOut), 
                            new Date(booking.checkIn)
                        );
                        const totalPrice = calculateTotalPrice(booking, days);

                        return (
                            <div key={index} className={cx('booking-card')}>
                                <div className={cx('booking-image')}>
                                    <img 
                                        src={`http://localhost:6060/${booking.place.addedPhotos[0]}`} 
                                        alt={booking.place.title} 
                                    />
                                </div>
                                
                                <div className={cx('booking-details')}>
                                    <h3 className={cx('property-title')}>
                                        <FontAwesomeIcon icon={faHouse} className={cx('detail-icon')} />
                                        {booking.place.title}
                                    </h3>
                                    
                                    <div className={cx('date-range')}>
                                        <FontAwesomeIcon icon={faCalendarDays} className={cx('detail-icon')} />
                                        <span>{format(new Date(booking.checkIn), 'MMM dd, yyyy')}</span>
                                        <FontAwesomeIcon icon={faArrowRight} className={cx('arrow-icon')} />
                                        <span>{format(new Date(booking.checkOut), 'MMM dd, yyyy')}</span>
                                        <span className={cx('nights')}>({days} nights)</span>
                                    </div>
                                    
                                    <div className={cx('guest-info')}>
                                        <FontAwesomeIcon icon={faUserGroup} className={cx('detail-icon')} />
                                        <span>Max {booking.place.maxGuests} guests</span>
                                    </div>
                                    
                                    <div className={cx('price-section')}>
                                        <FontAwesomeIcon icon={faDollarSign} className={cx('detail-icon')} />
                                        <span className={cx('total-price')}>Total: ${totalPrice.toFixed(2)}</span>
                                        <span className={cx('price-breakdown')}>
                                            (${booking.place.price}/night × {days} nights)
                                        </span>
                                        {booking.difference > 0 && (
                                            <span className={cx('extra-charge')}>
                                                + ${(booking.difference * booking.place.price / 10).toFixed(2)} extra guests charge
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className={cx('no-bookings')}>
                    <h2>No bookings found</h2>
                    <p>You haven't made any bookings yet. Start exploring properties now!</p>
                    <button className={cx('explore-button')}>Explore Properties</button>
                </div>
            )}
        </div>
    );
}

export default BookingPage;