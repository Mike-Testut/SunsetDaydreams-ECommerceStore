import React from 'react'
import Hero from "../components/Hero.jsx";
import NewArrivals from "../components/NewArrivals.jsx";
import BestSellers from "../components/BestSellers.jsx";



const Home = () => {
  return (
    <div>
      <Hero />
      <NewArrivals />
      <BestSellers />
    </div>

  )
}

export default Home