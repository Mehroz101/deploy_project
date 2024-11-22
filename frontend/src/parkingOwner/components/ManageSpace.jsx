import React, { useEffect, useState } from "react";
import "../styles/ManageSpace.css";
import { Link } from "react-router-dom";
import SpaceRow from "./SpaceRow";
import { getSpace, handleDelete } from "../../services/spaceService";
// import { getReservation } from "../../services/reservationService";
import { useParkingOwner } from "../../context/ReservationContext";

const ManageSpace = () => {
  // const [spaces, setSpaces] = useState([]); // Original data from backend
  const [filteredData, setFilteredData] = useState([]); // Filtered data for search
  const [activeFilter, setActiveFilter] = useState("all"); // State to keep track of active filter
  const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering
  // const [reservations, setReservations] = useState([]); // Reservations data
  const { reservation, space, setSpace } = useParkingOwner();
  // Fetch data from backend
  const spaceRequest = () => {
    // try {
    // const [reservationsResponse, spacesResponse] = await Promise.all([
    //   getReservation(),
    //   getSpace(),
    // ]);
    // const spacesArray = spacesResponse.data.data;
    // setSpaces(spacesArray); // Save the fetched spaces data
    setFilteredData(space); // Initialize filteredData with all spaces
    // const reservationcount = reservation.map(
    //   (reservation) => reservation
    // );
    // setReservations(reservationcount); // Save the reservations data
    // console.log("reservations");
    // console.log(reservationcount);
    // } catch (error) {
    //   console.error("Error fetching data:", error);
    // }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);

    const lowerCasedTerm = value.toLowerCase();

    const filtered = space.filter((space) => {
      const searchValue = space.title.toLowerCase();
      return searchValue.includes(lowerCasedTerm);
    });

    setFilteredData(filtered);
  };

  // Filter based on status
  const updateListView = (state) => {
    setActiveFilter(state);
    if (state === "all") {
      setFilteredData(
        space.filter((space) =>
          space.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ); // Reset filtered data to show all
    } else {
      const status = state;
      setFilteredData(
        space.filter(
          (space) =>
            space.state === status &&
            space.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ); // Filter by status
    }
  };

  const handleDeleteSpace = async (spaceId) => {
    await handleDelete(spaceId); // Call delete function
    spaceRequest(); // Refresh space data after deletion
  };

  const handleToggleStatus = async (spaceId, newState) => {
    setSpace((prevSpaces) =>
      prevSpaces.map((space) =>
        space._id === spaceId ? { ...space, state: newState } : space
      )
    );
  };

  useEffect(() => {
    spaceRequest(); // Initial data fetch
  }, []);

  useEffect(() => {
    // Update filtered data based on search term and active filter
    if (activeFilter === "all") {
      setFilteredData(
        space.filter((space) =>
          space.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredData(
        space.filter(
          (space) =>
            space.state === activeFilter &&
            space.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [space, activeFilter, searchTerm]);

  return (
    <>
      <div className="manage_space_container">
        <h2>Manage Space</h2>
        <div className="create_space">
          <Link to="create-space">
            <button>List New Space</button>
          </Link>
        </div>
        <div className="space_numbers space_numbers_hide">
          <div className="total_space">
            <p>Total listing</p>
            <h2>{space.length}</h2>
          </div>
          <div className="active_space">
            <p>Active listing</p>
            <h2>{space.filter((space) => space.state === "active").length}</h2>
          </div>
          <div className="deactived_space">
            <p>Deactivated listing</p>
            <h2>
              {space.filter((space) => space.state === "deactivated").length}
            </h2>
          </div>
        </div>
        {/* Filter Navbar */}
        <div className="filter_navbar">
          <ul>
            <li className={`${activeFilter === "all" ? "active" : ""}`}>
              <Link onClick={() => updateListView("all")}>All</Link>
            </li>
            <li className={`${activeFilter === "active" ? "active" : ""}`}>
              <Link onClick={() => updateListView("active")}>Active</Link>
            </li>
            <li className={`${activeFilter === "deactivated" ? "active" : ""}`}>
              <Link onClick={() => updateListView("deactivated")}>
                Deactivated
              </Link>
            </li>
          </ul>
        </div>

        {/* Search Box */}
        <div className="search_filter">
          <div className="search_box">
            <div className="search_input">
              <input
                type="text"
                placeholder="Search by title"
                value={searchTerm}
                onChange={handleSearchChange} // Update search term
              />
            </div>
          </div>
        </div>

        {/* Manage Spaces List */}
        <div className="manage_space_list">
          <table className="highlight responsive_table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Image</th>
                <th>Title</th>
                <th>Reservation Id</th>
                <th>Total Booking</th>
                <th>Pending</th>
                <th>Confirmed</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData?.length > 0 ? (
                filteredData
                  ?.slice()
                  .reverse()
                  .map((item, index) => {
                    // Find the corresponding reservation for the current item
                    const reservationForSpace = reservation?.find(
                      (slot) => slot.spaceId === item.spaceId
                    );
                    return (
                      <>
                        <SpaceRow
                          key={index}
                          spaceInfo={item}
                          spaceIndex={index}
                          handleToggleStatus={handleToggleStatus}
                          handleDeleteSpace={handleDeleteSpace}
                          reservations={reservation}
                        />
                      </>
                    );
                  })
              ) : (
                <tr>
                  <td colSpan="8">No results found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ManageSpace;
