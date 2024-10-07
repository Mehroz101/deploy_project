import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSpace } from "../../services/spaceService";
import "../styles/ViewSpace.css";

const ViewSpace = () => {
  const [space, setSpace] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([]);
  const { spaceId } = useParams();
  const REACT_APP_API_URL = import.meta.env.REACT_APP_API_URL;

  const getSpaceData = async () => {
    const spaceData = await getSpace(spaceId);
    const spaceInfo = spaceData.data.space;
    setSpace(spaceInfo);
    setImages(spaceInfo.images || []);
    setCurrentImageIndex(0);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  useEffect(() => {
    getSpaceData();
  }, [spaceId]);

  return (
    <div className="view-space-container">
      {/* Image Carousel */}
      <div className="image-carousel">
        <button className="carousel-btn prev-btn" onClick={handlePreviousImage}>
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <img
          src={`${REACT_APP_API_URL}/${images[currentImageIndex]}`}
          alt={space.title}
          className="carousel-image"
        />
        <button className="carousel-btn next-btn" onClick={handleNextImage}>
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>

      {/* Listing Details */}
      <div className="listing-details">
        <div className="details-left">
          <h2 className="space-title">{space.title}</h2>
          <p className="space-address">
            <i className="fa-solid fa-location-dot"></i> {space.address}
          </p>
          <div className="rating-section">
            <div className="rating">
              <span className="rating-score">4.5</span>
              <i className="fa-solid fa-star"></i>
              <span className="total-reviews">(123 reviews)</span>
            </div>
            <div className="total-booking">100+ bookings</div>
          </div>

          <div className="description-section">
            <h3>Short Description</h3>
            <p>{space.short_description}</p>
            <h3>Full Description</h3>
            <p>{space.description}</p>
          </div>

          {/* Google Map Location */}
          <div className="location-section">
            <h3>Location</h3>
            <iframe
              width="100%"
              height="250"
              frameBorder="0"
              src={`https://www.google.com/maps?q=${space.latitude},${space.longitude}&z=15&output=embed`}
            ></iframe>
          </div>

          {/* Reviews Section */}
          <div className="reviews-section">
            <h3>Reviews</h3>
            <div className="review-list">
              <div className="review-item">
                <h4>John Doe</h4>
                <div className="review-meta">
                  <i className="fa-solid fa-star"></i>
                  <span>5.0</span>
                  <span>2 days ago</span>
                </div>
                <p>"Great place, very clean and convenient!"</p>
              </div>
              {/* Add more review items here */}
            </div>
          </div>
        </div>

        {/* Features and Pricing */}
        <div className="details-right">
          <div className="features-section">
            <h4>Features</h4>
            <div className="feature-list">
              {space.features?.map((feature, index) => (
                <span key={index} className="feature-item">
                  {feature}
                </span>
              ))}
            </div>
          </div>

          <div className="pricing-section">
            <h4>Pricing</h4>
            <div className="pricing-item">
              <span>Per Day:</span>
              <span>${space.per_day}</span>
            </div>
            <div className="pricing-item">
              <span>Per Hour:</span>
              <span>${space.per_hour}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSpace;