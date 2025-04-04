import { useEffect, useState, useContext } from "react";
import Header from "../Header/Header";
import axios from "axios";
import { Navigate, Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from './HomePage.module.scss';
import { UserContext } from "../User/User";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faPlus, faStar, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

function HomePage() {
    const user = useContext(UserContext);
    const [data, setData] = useState([]);
    const [places, setPlaces] = useState([]);
    const [redirect, setRedirect] = useState(false);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    let role;

    async function handel() {
        await axios.get('http://localhost:6060/test')
            .then(res => {
                setData(res.data);
            });
    }

    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:6060/place')
            .then(res => {
                const { data } = res;
                setPlaces(data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (data.length > 0) {
            if (data[0].pass) {
                alert(data[0].mess);
                setRedirect(true);
            } else {
                alert(data[0].mess);
            }
        }
    }, [data]);

    if (user.user) {
        role = user.user.role;
    }

    if (redirect) {
        return <Navigate to={'/test'} />;
    }

    const filteredPlaces = filter === "all" 
        ? places 
        : places.filter(place => place.type === filter);

    return (
        <div className={cx('home-page')}>
            <Header setPlaces={setPlaces} />

            <div className={cx('hero-section')}>
                <h1 className={cx('hero-title')}>Discover amazing places to stay</h1>
                <p className={cx('hero-subtitle')}>Find and book unique accommodations around the world</p>
            </div>

            <div className={cx('action-bar')}>
                <div className={cx('filter-section')}>
                    <select 
                        className={cx('filter-select')} 
                        onChange={(e) => setFilter(e.target.value)}
                        value={filter}
                    >
                        <option value="all">All Types</option>
                        <option value="apartment">Apartments</option>
                        <option value="house">Houses</option>
                        <option value="hotel">Hotels</option>
                        <option value="villa">Villas</option>
                    </select>
                </div>

                {role === 'admin' && (
                    <button onClick={() => handel()} className={cx('add-button')}>
                        <FontAwesomeIcon icon={faPlus} className={cx('plus-icon')} />
                        Add New Place
                    </button>
                )}
            </div>

            {loading ? (
                <div className={cx('loading-container')}>
                    <FontAwesomeIcon icon={faSpinner} className={cx('loading-icon')} spin />
                    <p>Loading amazing places...</p>
                </div>
            ) : (
                <div className={cx('places-grid')}>
                    {filteredPlaces.length > 0 ? (
                        filteredPlaces.map((place, index) => (
                            <Link 
                                key={index} 
                                to={role === 'admin' ? `/edit/${place._id}` : `/detail/${place._id}`}
                                className={cx('place-link')}
                            >
                                <div className={cx('place-card')}>
                                    <div className={cx('image-container')}>
                                        <img 
                                            className={cx('place-image')} 
                                            src={`http://localhost:6060/${place.addedPhotos[0]}`} 
                                            alt={place.title} 
                                        />
                                        <div className={cx('price-tag')}>${place.price}<span>/night</span></div>
                                    </div>
                                    <div className={cx('place-details')}>
                                        <h3 className={cx('place-title')}>{place.title}</h3>
                                        <div className={cx('place-address')}>
                                            <FontAwesomeIcon icon={faMapMarkerAlt} className={cx('address-icon')} />
                                            {place.address}
                                        </div>
                                        <div className={cx('place-rating')}>
                                            <FontAwesomeIcon icon={faStar} className={cx('star-icon')} />
                                            {place.rating || 'New'}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className={cx('no-results')}>
                            <h3>No places found</h3>
                            <p>Try adjusting your search or filter to find what you're looking for.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default HomePage;