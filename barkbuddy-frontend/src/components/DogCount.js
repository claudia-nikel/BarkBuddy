import React from 'react';
import { useSelector } from 'react-redux';
import './DogCount.css';

const DogCount = () => {
    const dogCount = useSelector(state => state.dogs.length);  // Assuming dogs is the array of dog objects

    return (
        <div className="dog-count-container">
            <h3>Total Dogs: {dogCount}</h3>
        </div>
    );
};

export default DogCount;
