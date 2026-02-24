import React from 'react'
import Hero from "../components/Hero.jsx";
import NewArrivals from "../components/NewArrivals.jsx";
import BestSellers from "../components/BestSellers.jsx";
import NewsletterBox from "../components/NewsletterBox.jsx";



const Home = () => {
  return (
    <div>
      <Hero />
      <NewArrivals />
      <BestSellers />
      <NewsletterBox />
    </div>

  )
}

export default Home