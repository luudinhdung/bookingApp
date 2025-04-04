import Header from "../Header/Header";
import { Link, useParams, Navigate } from "react-router-dom";
import styles from './AccountPage.module.scss';
import classNames from "classnames/bind";
import { useState, useContext } from "react";
import { UserContext } from "../User/User";
import axios from "axios";
import BookingPage from "./BookingPage";
import ManagePage from "./ManagePage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCalendarAlt, faCog, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

function AccountPage() {
    const { user, setUser } = useContext(UserContext);
    const [redirect, setRedirect] = useState(false);
    let { slug } = useParams();
    
    if (slug === undefined) {
        slug = 'profile';
    }

    async function handleLogout() {
        try {
            await axios.post('http://localhost:6060/logout');
            setUser(null);
            setRedirect(true);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />;
    }

    return (
        <div className={cx('account-page')}>
            <Header />
            
            <div className={cx('account-container')}>
                <div className={cx('account-sidebar')}>
                    <div className={cx('user-profile')}>
                        {user && (
                            <>
                                <div className={cx('avatar')}>
                                    {user.avatar ? (
                                        <img src={`http://localhost:6060/${user.avatar}`} alt="User avatar" />
                                    ) : (
                                        <FontAwesomeIcon icon={faUser} />
                                    )}
                                </div>
                                <h3 className={cx('user-name')}>{user.name}</h3>
                                <p className={cx('user-email')}>{user.email}</p>
                            </>
                        )}
                    </div>

                    <nav className={cx('account-nav')}>
                        <Link 
                            to={'/account'} 
                            className={cx('nav-link', { active: slug === 'profile' })}
                        >
                            <FontAwesomeIcon icon={faUser} className={cx('nav-icon')} />
                            My Profile
                        </Link>
                        
                        {user?.role === 'admin' ? (
                            <Link 
                                to={'/account/manage'} 
                                className={cx('nav-link', { active: slug === 'manage' })}
                            >
                                <FontAwesomeIcon icon={faCog} className={cx('nav-icon')} />
                                Manage Listings
                            </Link>
                        ) : (
                            <Link 
                                to={'/account/booking'} 
                                className={cx('nav-link', { active: slug === 'booking' })}
                            >
                                <FontAwesomeIcon icon={faCalendarAlt} className={cx('nav-icon')} />
                                My Bookings
                            </Link>
                        )}
                        
                        <button 
                            onClick={handleLogout} 
                            className={cx('logout-button')}
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} className={cx('nav-icon')} />
                            Logout
                        </button>
                    </nav>
                </div>

                <div className={cx('account-content')}>
                    {slug === 'profile' && (
                        <div className={cx('profile-section')}>
                            <h2 className={cx('section-title')}>Profile Information</h2>
                            <div className={cx('profile-details')}>
                                {user ? (
                                    <>
                                        <div className={cx('detail-item')}>
                                            <span className={cx('detail-label')}>Name:</span>
                                            <span className={cx('detail-value')}>{user.name}</span>
                                        </div>
                                        <div className={cx('detail-item')}>
                                            <span className={cx('detail-label')}>Email:</span>
                                            <span className={cx('detail-value')}>{user.email}</span>
                                        </div>
                                        <div className={cx('detail-item')}>
                                            <span className={cx('detail-label')}>Account Type:</span>
                                            <span className={cx('detail-value')}>
                                                {user.role === 'admin' ? 'Administrator' : 'Standard User'}
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <p className={cx('not-logged-in')}>You are not logged in</p>
                                )}
                            </div>
                        </div>
                    )}

                    {slug === 'booking' && (
                        <div className={cx('booking-section')}>
                            <BookingPage />
                        </div>
                    )}

                    {slug === 'manage' && (
                        <div className={cx('manage-section')}>
                            <ManagePage />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AccountPage;