import React from 'react';
import { useSelector } from 'react-redux';
import './DogCount.css';

const DogCount = () => {
    // Fetch the count of dogs from the Redux state
    const dogCount = useSelector(state => state.dogs.count);  // Assuming "count" is the property holding the dog count

    return (
        <div className="dog-count-container">
            <h3>Total Dogs: {dogCount}</h3>
        </div>
    );
};

export default DogCount;

