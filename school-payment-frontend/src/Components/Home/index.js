// Home.js
import React from 'react';
import Navbar from "../Navbar";
import TransactionAndFiltering from '../TransactionsAndFiltering';

const Home = () => {
    return (
        <div>
            <Navbar />
            <div>
                <TransactionAndFiltering/>
            </div>
        </div>
    )
}

export default Home;
