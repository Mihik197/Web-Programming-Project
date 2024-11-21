// pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaImages, FaBook, FaClock, FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import image from '../assets/image.png';
import avatar1 from '../assets/premium_photo-1689530775582-83b8abdb5020.jpeg';
import avatar2 from '../assets/premium_photo-1689551670902-19b441a6afde.jpeg';
import avatar3 from '../assets/images.jpeg';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-sm z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              LifeInPics
            </h1>
            <div className="space-x-4">
              <Link 
                to="/login" 
                className="px-6 py-2 rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-8">
            <h2 className="text-5xl font-bold leading-tight">
              Capture Your Life,<br />
              <span className="text-blue-600">One Day at a Time</span>
            </h2>
            <p className="text-xl text-gray-600">
              Transform your daily memories into a beautiful visual diary. 
              Store photos, write notes, and revisit your precious moments through an 
              intuitive calendar interface.
            </p>
            <div className="space-x-4">
              <Link
                to="/signup"
                className="inline-block px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all"
              >
                Start Your Journey
              </Link>
              <a href="#features" className="inline-block px-8 py-3 text-blue-600 hover:bg-blue-50 rounded-full">
                Learn More
              </a>
            </div>
          </div>
          <div className="lg:w-1/2">
            <img 
              src={image} 
              alt="Calendar Interface Preview"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-white py-20">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-16">Why Choose LifeInPics?</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FaCalendarAlt className="w-8 h-8 text-blue-600" />,
                title: "Calendar View",
                description: "Organize your memories chronologically in an intuitive calendar interface"
              },
              {
                icon: <FaImages className="w-8 h-8 text-blue-600" />,
                title: "Photo Gallery",
                description: "Beautiful gallery view of all your captured moments"
              },
              {
                icon: <FaBook className="w-8 h-8 text-blue-600" />,
                title: "Daily Notes",
                description: "Add context to your photos with personal notes and stories"
              },
              {
                icon: <FaClock className="w-8 h-8 text-blue-600" />,
                title: "Time Machine",
                description: "Easily navigate through your past memories"
              }
            ].map((feature, index) => (
              <div key={index} className="p-6 rounded-xl border hover:shadow-lg transition-all">
                <div className="mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-16">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Upload Photos",
                description: "Add photos to any date in your calendar"
              },
              {
                step: "2",
                title: "Write Notes",
                description: "Document your thoughts and memories"
              },
              {
                step: "3",
                title: "Relive Memories",
                description: "Browse through your personal timeline"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white text-xl font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-16">What Our Users Say</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Photography Enthusiast",
                image: avatar2, // Add placeholder avatars
                quote: "LifeInPics has transformed how I preserve my memories. The calendar view makes it so intuitive!"
              },
              {
                name: "David Chen",
                role: "Travel Blogger",
                image: avatar1,
                quote: "I use it daily to document my travels. The combination of photos and notes is perfect."
              },
              {
                name: "Emily Rodriguez",
                role: "Digital Creator",
                image: avatar3,
                quote: "The best way to keep track of life's precious moments. Simple yet powerful."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-8">Start Capturing Your Memories Today</h3>
          <p className="text-xl mb-8 text-blue-100">Join thousands of users preserving their life stories.</p>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Get Started For Free
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand Column */}
            <div className="space-y-4">
              <h4 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                LifeInPics
              </h4>
              <p className="text-gray-400">Preserve your memories, one day at a time.</p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h5 className="font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2">
                <li><Link to="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2">
                <li><Link to="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            
            {/* Social Media */}
            <div>
              <h5 className="font-semibold mb-4">Connect With Us</h5>
              <div className="flex space-x-4">
                <a href="https://twitter.com" className="text-gray-400 hover:text-white transition-colors">
                  <FaTwitter size={24} />
                </a>
                <a href="https://instagram.com" className="text-gray-400 hover:text-white transition-colors">
                  <FaInstagram size={24} />
                </a>
                <a href="https://facebook.com" className="text-gray-400 hover:text-white transition-colors">
                  <FaFacebook size={24} />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2024 LifeInPics. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;