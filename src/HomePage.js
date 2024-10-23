import React from 'react';
import './HomePage.css';

const HomePage = () => {
    return (
        <div>
            <nav className="container-fluid">
                <ul>
                    <li><strong>My Web</strong></li>
                </ul>
                <ul>
                    <li><a href="/draw">Home</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Services</a></li>
                    <li><a href="#" role="button">Contact</a></li>
                </ul>
            </nav>

            <main className="container">
                <div className="grid">
                    <section>
                        <hgroup>
                            <h2>Welcome to My Modern Website</h2>
                            <h3>Experience the simplicity and elegance</h3>
                        </hgroup>
                        <p>This website is designed with modern web trends in mind. Clean layouts, minimalist design, and user-friendly navigation ensure the best experience for visitors.</p>

                        <h3>Responsive Design</h3>
                        <p>The page is fully responsive, making it look great on any device, whether it's a mobile phone, tablet, or desktop.</p>

                        <h3>Fast and Efficient</h3>
                        <p>With optimized code and a clean design, this website ensures quick loading times and smooth browsing.</p>
                    </section>
                </div>
            </main>

            <section aria-label="Subscribe example">
                <div className="container">
                    <article>
                        <hgroup>
                            <h2>Stay Updated!</h2>
                            <h3>Subscribe to our newsletter for the latest updates.</h3>
                        </hgroup>
                        <form className="grid">
                            <input
                                type="text"
                                id="firstname"
                                name="firstname"
                                placeholder="First Name"
                                aria-label="First Name"
                                required
                            />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Email Address"
                                aria-label="Email Address"
                                required
                            />
                            <button type="submit" onClick={(e) => e.preventDefault()}>
                                Subscribe
                            </button>
                        </form>
                    </article>
                </div>
            </section>

            <footer className="container">
                <small><a href="#">Privacy Policy</a> • <a href="#">Terms of Service</a></small>
            </footer>
        </div>
    );
};

export default HomePage;
