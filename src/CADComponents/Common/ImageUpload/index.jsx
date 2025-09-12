import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './index.css';
import defaultImage from '../../../img/uploadImage.png';

const ImageUpload = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="image-upload-container">
            <div className="image-wrapper">
                {selectedImage ? (
                    <img src={selectedImage} alt="Selected" className="image" />
                ) : (
                    <img src={defaultImage} alt="Default" className="image" />
                )}
                <button className="delete-button">
                    <FontAwesomeIcon icon={faTrash} className="icon" />
                </button>
            </div>
            <label htmlFor="file-upload" className="custom-file-upload">
                Custom Upload
            </label>
            <input id="file-upload" type="file" onChange={handleImageChange} className="file-input" />
        </div>
    );
};

export default ImageUpload;
