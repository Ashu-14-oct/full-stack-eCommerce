import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { Link ,useNavigate } from 'react-router-dom';
import "./login.css";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/products');
    }
  }, [navigate]);

  // Function to handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://18.209.121.58:5000/user/sign-up', formData);
      toast.success(JSON.stringify(response.data.message), {
        icon: <FiCheckCircle size={24} />
      });
      console.log(response.data);
      navigate('/login');
    } catch (error) {
      console.error('Error:', error);
      toast.error(JSON.stringify(error.response.data), {
        icon: <FiAlertCircle size={24} />,
      });
    }
  };
  return (
    <div>
      <ToastContainer />
      <section className="vh-100 gradient-custom">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div className="card bg-dark text-white" style={{ borderRadius: '1rem' }}>
                <div className="card-body p-5 text-center">
                  <div className="mb-md-5 mt-md-4 pb-5">
                    <h2 className="fw-bold mb-2 text-uppercase">Sign up</h2>
                    <p className="text-white-50 mb-5">Please enter your email, name, and password!</p>
                    <form onSubmit={handleSubmit}>
                      <div className="form-outline form-white ">
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="form-control form-control-lg" />
                        <label className="form-label" htmlFor="name">Name</label>
                      </div>
                      <div className="form-outline form-white">
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="form-control form-control-lg" />
                        <label className="form-label" htmlFor="email">Email</label>
                      </div>
                      <div className="form-outline form-white ">
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="form-control form-control-lg" />
                        <label className="form-label" htmlFor="password">Password</label>
                      </div>
                      <button className="btn btn-outline-light btn-lg px-5" type="submit">Sign up</button>
                    </form>
                    <p style={{marginTop: '20px'}}>Already have an account? <Link to="/login">Sign In</Link></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
