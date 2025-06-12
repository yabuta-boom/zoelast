import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Privacy: React.FC = () => {
  return (
    <div className="w-full pt-24">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img 
              src="https://res.cloudinary.com/dznucv93w/image/upload/v1747407289/logo1_gsqdy6.png" 
              alt="Zoe Car Dealership Logo" 
              className="h-16 w-auto mx-auto mb-6"
            />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-blue-100">Last updated: May 1, 2025</p>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
                <p className="text-gray-600 leading-relaxed">
                  At Zoe Car Dealership, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with our platform. By using our services, you agree to the collection and use of information in accordance with this policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Name and contact information (email, phone number)</li>
                    <li>Account credentials and authentication data</li>
                    <li>Vehicle preferences and search history</li>
                    <li>Communication history and messages</li>
                    <li>Payment information (when applicable)</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-800">Usage Information</h3>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Device and browser information</li>
                    <li>IP address and location data</li>
                    <li>Website interaction and behavior</li>
                    <li>Cookies and tracking technologies</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <p className="text-gray-600">We use the collected information to:</p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Provide and maintain our services</li>
                    <li>Process your transactions and requests</li>
                    <li>Send you relevant notifications and updates</li>
                    <li>Improve our services and user experience</li>
                    <li>Detect and prevent fraud or abuse</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
                <p className="text-gray-600 leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">Access Rights</h3>
                    <ul className="text-blue-800 space-y-2">
                      <li>View your personal data</li>
                      <li>Request data portability</li>
                      <li>Obtain data copies</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-900 mb-3">Control Rights</h3>
                    <ul className="text-green-800 space-y-2">
                      <li>Update your information</li>
                      <li>Delete your account</li>
                      <li>Opt-out of communications</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-600 mb-4">
                    If you have any questions about this Privacy Policy, please contact us:
                  </p>
                  <ul className="text-gray-600 space-y-2">
                    <li>Email: privacy@zoeauto.com</li>
                    <li>Phone: 0907082821</li>
                    <li>Address: Kirkos</li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;