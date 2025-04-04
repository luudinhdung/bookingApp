import axios from "axios";
import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from './AccountPage.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp, faTrash, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link, useParams, useNavigate } from "react-router-dom";
import Header from "../Header/Header";

const cx = classNames.bind(styles);

function EditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [place, setPlace] = useState();
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [desc, setDesc] = useState('');
    const [extraInfo, setExtraInfo] = useState('');
    const [price, setPrice] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [redirect, setRedirect] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    function SectionHeader({ title, description }) {
        return (
            <div className={cx('section-header')}>
                <h2 className={cx('section-title')}>{title}</h2>
                <p className={cx('section-description')}>{description}</p>
            </div>
        );
    }

    async function upload(e) {
        const files = e.target.files;
        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
            data.append('photos', files[i]);
        }
        
        setIsLoading(true);
        try {
            const res = await axios.post('http://localhost:6060/upload', data);
            setAddedPhotos(prev => [...prev, ...res.data]);
        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function addNewPlace(e) {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.put('http://localhost:6060/places', {
                id, title, address, addedPhotos, desc, maxGuests, price
            });
            navigate('/');
        } catch (error) {
            console.error("Update failed:", error);
        } finally {
            setIsLoading(false);
        }
    }

    function removeImg(value) {
        setAddedPhotos(prev => prev.filter(item => item !== value));
    }

    useEffect(() => {
        const fetchPlaceData = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get(`http://localhost:6060/places/${id}`);
                const { data } = res;
                setTitle(data.title);
                setAddress(data.address);
                setPrice(data.price);
                setAddedPhotos(data.addedPhotos);
                setDesc(data.desc);
                setMaxGuests(data.maxGuests);
            } catch (error) {
                console.error("Failed to fetch place data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlaceData();
    }, [id]);

    if (redirect) {
        return <Navigate to={'/login'} />;
    }

    return (
        <div className={cx('edit-page')}>
            <Header />
            
            <div className={cx('page-header')}>
                <Link to={'/'} className={cx('back-button')}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Back to my listings
                </Link>
                <h1 className={cx('page-title')}>Edit Listing</h1>
            </div>

            <form onSubmit={addNewPlace} className={cx('edit-form')}>
                <div className={cx('form-section')}>
                    <SectionHeader 
                        title="Title" 
                        description="Give your place a catchy title" 
                    />
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className={cx('form-input')}
                        placeholder="Beautiful apartment in city center"
                        required
                    />
                </div>

                <div className={cx('form-section')}>
                    <SectionHeader 
                        title="Address" 
                        description="Where is your place located?" 
                    />
                    <input
                        type="text"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        className={cx('form-input')}
                        placeholder="123 Main St, City, Country"
                        required
                    />
                </div>

                <div className={cx('form-section')}>
                    <SectionHeader 
                        title="Photos" 
                        description="Show guests what your place looks like" 
                    />
                    <div className={cx('photo-gallery')}>
                        {addedPhotos.map((value, index) => (
                            <div key={index} className={cx('photo-item')}>
                                <img 
                                    className={cx('photo-image')} 
                                    src={`http://localhost:6060/${value}`} 
                                    alt={`Place ${index + 1}`} 
                                />
                                <button 
                                    type="button" 
                                    onClick={() => removeImg(value)} 
                                    className={cx('delete-button')}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <label className={cx('upload-button')}>
                        <input 
                            multiple 
                            onChange={upload} 
                            type="file" 
                            className={cx('file-input')} 
                            accept="image/*"
                        />
                        <FontAwesomeIcon icon={faCloudArrowUp} />
                        Upload Photos
                    </label>
                </div>

                <div className={cx('form-row')}>
                    <div className={cx('form-section', 'half-width')}>
                        <SectionHeader 
                            title="Description" 
                            description="Describe your place to guests" 
                        />
                        <textarea
                            value={desc}
                            onChange={e => setDesc(e.target.value)}
                            className={cx('form-textarea')}
                            rows="5"
                            required
                        />
                    </div>

                    <div className={cx('form-section', 'half-width')}>
                        <SectionHeader 
                            title="Price" 
                            description="Set your nightly rate" 
                        />
                        <div className={cx('price-input-container')}>
                            <span className={cx('currency-symbol')}>$</span>
                            <input
                                type="number"
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                                className={cx('form-input', 'price-input')}
                                min="1"
                                required
                            />
                            <span className={cx('price-period')}>per night</span>
                        </div>
                    </div>
                </div>

                <div className={cx('form-section')}>
                    <SectionHeader 
                        title="Maximum Guests" 
                        description="How many guests can your place accommodate?" 
                    />
                    <input
                        type="number"
                        value={maxGuests}
                        onChange={e => setMaxGuests(e.target.value)}
                        className={cx('form-input')}
                        min="1"
                        required
                    />
                </div>

                <div className={cx('form-actions')}>
                    <button 
                        type="submit" 
                        className={cx('save-button')}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditPage;