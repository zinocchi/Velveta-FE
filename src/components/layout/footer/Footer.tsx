import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">
              Velveta Coffee
            </h3>
            <p className="text-gray-400 text-sm md:text-base">
              Creating special moments with every cup of coffee since 2015.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">
              Contact Us
            </h3>
            <ul className="space-y-1 md:space-y-2 text-gray-400 text-sm md:text-base">
              <li className="flex items-start">
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 mr-2 mt-1 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>Jl. Sudirman No. 123, Jakarta Pusat</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>(021) 1234-5678</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>Velveta.Coffee@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">
              Follow Us
            </h3>
            <div className="flex space-x-3 md:space-x-4">
              {/* Facebook */}
              <a
                href="https://facebook.com/velvetacoffee"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300 hover:scale-110 transform"
                aria-label="Facebook">
                <FaFacebook className="w-5 h-5 md:w-6 md:h-6" />
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/velvetacoffee"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300 hover:scale-110 transform"
                aria-label="Instagram">
                <FaInstagram className="w-5 h-5 md:w-6 md:h-6" />
              </a>

              {/* Twitter/X */}
              <a
                href="https://twitter.com/velvetacoffee"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300 hover:scale-110 transform"
                aria-label="Twitter">
                <FaTwitter className="w-5 h-5 md:w-6 md:h-6" />
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/velvetacoffee"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300 hover:scale-110 transform"
                aria-label="YouTube">
                <FaYoutube className="w-5 h-5 md:w-6 md:h-6" />
              </a>

              {/* TikTok */}
              <a
                href="https://tiktok.com/@velvetacoffee"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300 hover:scale-110 transform"
                aria-label="TikTok">
                <FaTiktok className="w-5 h-5 md:w-6 md:h-6" />
              </a>
            </div>

            {/* <div className="mt-4 md:mt-6">
              <h4 className="text-sm font-semibold text-gray-300 mb-2">
                Open Daily
              </h4>
              <p className="text-xs md:text-sm text-gray-400">
                Mon - Fri: 7:00 AM - 10:00 PM
              </p>
              <p className="text-xs md:text-sm text-gray-400">
                Sat - Sun: 8:00 AM - 11:00 PM
              </p>
            </div> */}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-gray-400 text-sm md:text-base">
          <p>© {currentYear} Velveta Coffee. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
