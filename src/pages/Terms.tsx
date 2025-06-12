import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Terms: React.FC = () => {
  return (
    <div className="w-full pt-24">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-16">
        <div className="container mx-auto responsive-section text-center">
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
            <h1 className="responsive-title mb-4">Terms of Service</h1>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6">
                  <p className="text-yellow-800">
                    By accessing or using Zoe Car Dealership's services, you agree to be bound by these Terms of Service and our Privacy Policy. Please read them carefully before using our services.
                  </p>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  These Terms of Service ("Terms") govern your access to and use of Zoe Car Dealership's website, services, and applications (the "Services"). If you do not agree with any part of these terms, you may not use our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">User Accounts</h2>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800">Account Creation</h3>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>You must provide accurate and complete information when creating an account</li>
                    <li>You are responsible for maintaining the security of your account credentials</li>
                    <li>You must be at least 18 years old to create an account</li>
                    <li>You may not create multiple accounts or transfer your account to others</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Vehicle Information</h2>
                <div className="bg-blue-50 rounded-lg p-6 space-y-4">
                  <p className="text-gray-700">Our commitment to accuracy:</p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Vehicle information is provided to the best of our knowledge</li>
                    <li>Prices are subject to change without notice</li>
                    <li>Images are representative but may not reflect exact vehicle condition</li>
                    <li>Final vehicle details must be confirmed at the dealership</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Prohibited Activities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-red-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-red-900 mb-3">You may not:</h3>
                    <ul className="text-red-800 space-y-2">
                      <li>Use the services illegally</li>
                      <li>Impersonate others</li>
                      <li>Distribute malware</li>
                      <li>Scrape or harvest data</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-900 mb-3">You should:</h3>
                    <ul className="text-green-800 space-y-2">
                      <li>Respect other users</li>
                      <li>Provide accurate information</li>
                      <li>Report violations</li>
                      <li>Follow local laws</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
                <p className="text-gray-600 leading-relaxed">
                  All content, features, and functionality of our services, including but not limited to text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, are the exclusive property of Zoe Car Dealership or its licensors and are protected by international copyright, trademark, and other intellectual property laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-600 mb-4">
                    To the maximum extent permitted by law, Zoe Car Dealership shall not be liable for:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Any indirect, incidental, or consequential damages</li>
                    <li>Loss of profits or revenue</li>
                    <li>Loss of data or system damage</li>
                    <li>Service interruptions or failures</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
                <p className="text-gray-600 leading-relaxed">
                  We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new Terms on this page and updating the "Last updated" date. Your continued use of the Services after such modifications constitutes your acceptance of the new Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-600 mb-4">
                    For questions about these Terms of Service, please contact us:
                  </p>
                  <ul className="text-gray-600 space-y-2">
                    <li>Email: legal@zoeauto.com</li>
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

export default Terms;