import React, { useEffect, useState } from "react";
import "../styles/ViewRequest.css";
import { useParams } from "react-router-dom";
import {
  getReservationReview,
  getReservationdata,
} from "../../services/reservationService";
import ReservationListingDetail from "./ReservationListingDetail";
import { reviewDateCalculator } from "./Functions";
import { useParkingOwner } from "../../context/ReservationContext";

const ViewRequest = () => {
  const [data, setData] = useState([]);
  const [space, setSpace] = useState([]);
  const [duration, setDuration] = useState(""); // State for storing duration
  const [totalPrice, setTotalPrice] = useState(0); // State for total price
  const [review, setReview] = useState([]);

  const { reservationId } = useParams();
  const { reservation } = useParkingOwner();

  const getReservationDetail = async () => {
    try {
      setTimeout(async () => {
        const response = await getReservationdata(reservationId);
        // //console.log(response.spaceId);
        setSpace(response.spaceId);
        // //console.log("Updated space state:", response.spaceId);
        const formatTimeTo12Hour = (time) => {
          let [hours, minutes] = time.split(":").map(Number);
          const ampm = hours >= 12 ? "PM" : "AM";
          hours = hours % 12 || 12;
          return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
        };
        // Convert arrival and leave times
        const formattedArrivalTime = formatTimeTo12Hour(response.arrivalTime);
        const formattedLeaveTime = formatTimeTo12Hour(response.leaveTime);

        // Create Date objects for arrival and leave
        const arrivalDateTime = new Date(
          `${response.arrivalDate}T${response.arrivalTime}`
        );
        const leaveDateTime = new Date(
          `${response.leaveDate}T${response.leaveTime}`
        );

        // Calculate the difference in milliseconds
        const diffInMs = leaveDateTime - arrivalDateTime;
        // Convert milliseconds to hours
        const diffInHours = diffInMs / (1000 * 60 * 60);

        // Set the duration in state
        const fullHours = Math.floor(diffInHours);
        const remainingMinutes = Math.floor((diffInHours % 1) * 60);

        setDuration(`${fullHours} hours ${remainingMinutes} minutes`);

        // Price calculation logic
        const perHourPrice = response.spaceId.per_hour;
        const perDayPrice = response.spaceId.per_day;

        let calculatedPrice = 0;
        if (diffInHours >= 24) {
          // If reservation is for a full day or more
          const days = Math.floor(diffInHours / 24);
          const remainingHours = diffInHours % 24;
          calculatedPrice = days * perDayPrice + remainingHours * perHourPrice;
        } else {
          // If reservation is less than a full day
          calculatedPrice = diffInHours * perHourPrice;
        }

        // Set the total price in state
        setTotalPrice(calculatedPrice.toFixed(2));

        setData({
          ...response,
          arrivalTime: formattedArrivalTime,
          leaveTime: formattedLeaveTime,
        });
      }, 500); // Simulate a delay
      // //console.log(space);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (reservationId) {
      const count = reservation
        ?.filter((reservation) => reservation.state === "completed")
        .filter(
          (reservation) => reservation.spaceId?._id === space?._id
        ).length;

      getReservationDetail();
    }
  }, [reservationId, reservation]);

  const getreservationreview = async () => {
    try {
      const response = await getReservationReview(reservationId);

      setReview(response);
    } catch (error) {
      //console.log(error.message);
    }
  };
  useEffect(() => {
    if (space) {
      getreservationreview();
    }
  }, [space]);
  return (
    <>
      <div className="view_request">
        <ReservationListingDetail spaceDetail={space} data={data} />
        <div className="request_status">
          <h3>Request Status</h3>
          <span className={`status ${data.state}`}>{data.state}</span>
        </div>
        {review && (
          <>
            <div className="review-item">
              <div className="review-meta">
                <span>
                  {review?.rating}
                  <i className="fa-solid fa-star"></i>
                </span>
                <span>{reviewDateCalculator(review)}</span>
              </div>
              <p>"{review?.reviewMsg}"</p>
            </div>
          </>
        )}

        <div className="reservation_detail_container">
          <h3>Booking Detail</h3>
          <div className="reservation_detail">
            <div className="detail_item arrival_time">
              <i className="fa-solid fa-right-to-bracket"></i>
              <div>
                <h4>Arrival Time</h4>
                <span>
                  {data.arrivalDate} {data.arrivalTime}
                </span>
              </div>
            </div>
            <div className="detail_item leave_time">
              <i className="fa-solid fa-right-from-bracket"></i>
              <div>
                <h4>Leave Time</h4>
                <span>
                  {data.leaveDate} {data.leaveTime}
                </span>
              </div>
            </div>
            <div className="detail_item duration">
              <i className="fa-solid fa-clock"></i>
              <div>
                <h4>Duration</h4>
                <span>{duration}</span> {/* Display the calculated duration */}
              </div>
            </div>
          </div>
        </div>
        <div className="customer_detail_container">
          <h3>Customer Detail</h3>
          <div className="customer_detail">
            <div className="detail_item customer_name">
              <i className="fa-solid fa-user"></i>
              <div>
                <h4>Name</h4>
                <span>{data.name}</span>
              </div>
            </div>
            <div className="detail_item customer_email">
              <i className="fa-solid fa-envelope"></i>
              <div>
                <h4>Email</h4>
                <span>{data.email}</span>
              </div>
            </div>
            <div className="detail_item customer_phone">
              <i className="fa-solid fa-phone"></i>
              <div>
                <h4>Phone Number</h4>
                <span>{data.phoneNo}</span>
              </div>
            </div>
            <div className="detail_item vehicel_number">
              <i className="fa-solid fa-car"></i>
              <div>
                <h4>Vehicel Number</h4>
                <span>{data.vehicleNo}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="payment_earning_container">
          <h3>Payment and Earning</h3>
          <div className="payment_earning_detail">
            <div className="detail_item total_earning">
              <i className="fa-solid fa-wallet"></i>
              <div>
                <h4>Total Earning</h4>
                <span>Rs. {totalPrice}</span>
              </div>
            </div>
            <div className="detail_item payment_method">
              <i className="fa-solid fa-credit-card"></i>
              <div>
                <h4>Payment Method</h4>
                <span>Credit Card</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewRequest;
