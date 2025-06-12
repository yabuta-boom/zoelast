import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'am';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation dictionary
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.inventory': 'Inventory',
    'nav.spareParts': 'Spare Parts',
    'nav.services': 'Services',
    'nav.tradeIn': 'Trade-In',
    'nav.sendUsYourCar': 'Send Us Your Car',
    'nav.about': 'About Us',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.profile': 'Profile',
    'nav.savedVehicles': 'Saved Vehicles',
    'nav.messages': 'Messages',
    'nav.logout': 'Logout',
    'nav.adminDashboard': 'Admin Dashboard',

    // Login & Register
    'login.password': 'Password',
    'login.rememberMe': 'Remember me',
    'login.loggingIn': 'Logging in...',
    'login.error': 'Invalid email or password',
    'login.noAccount': "Don't have an account?",
    'register.firstName': 'First Name',
    'register.lastName': 'Last Name',
    'register.creating': 'Creating account...',
    'register.success': 'Account created successfully! You can now log in.',
    'register.error': 'Failed to create account. Please try again.',
    'register.hasAccount': 'Already have an account?',

    // Home Page
    'home.hero.title': 'Drive Your Dreams',
    'home.hero.subtitle': 'Skip the stress and start driving — explore verified cars, get expert support, and shop from the comfort of your screen with our smooth, all-in-one showroom.',
    'home.hero.browseCars': 'Browse Cars',
    'home.hero.ourServices': 'Our Services',
    'home.featured.title': 'Featured Vehicles',
    'home.whyChoose.title': 'Why Choose Zoe',
    'home.whyChoose.quality.title': 'Quality Assured',
    'home.whyChoose.quality.desc': 'Every vehicle thoroughly inspected',
    'home.whyChoose.delivery.title': 'Fast Delivery',
    'home.whyChoose.delivery.desc': 'Quick and efficient delivery service',
    'home.whyChoose.financing.title': 'Easy Financing',
    'home.whyChoose.financing.desc': 'Flexible payment options available',
    'home.whyChoose.support.title': '24/7 Support',
    'home.whyChoose.support.desc': 'Always here when you need us',
    'home.cta.title': 'Ready to Find Your Dream Car?',
    'home.cta.subtitle': 'Join thousands of satisfied customers who found their perfect vehicle with Zoe.',
    'home.cta.button': 'Get Started Today',

    // Inventory Page
    'inventory.title': 'Explore Your Dream Cars',
    'inventory.subtitle': 'Discover the perfect vehicle tailored to your lifestyle and preferences.',
    'inventory.filters.model': 'Model',
    'inventory.filters.year': 'Year',
    'inventory.filters.minPrice': 'Min Price',
    'inventory.filters.maxPrice': 'Max Price',
    'inventory.filters.condition': 'Condition',
    'inventory.filters.allModels': 'All Models',
    'inventory.filters.allYears': 'All Years',
    'inventory.filters.allConditions': 'All Conditions',
    'inventory.filters.new': 'New',
    'inventory.filters.used': 'Used',
    'inventory.filters.reset': 'Reset Filters',
    'inventory.pagination.previous': 'Previous',
    'inventory.pagination.next': 'Next',

    // Vehicle Card & Details
    'vehicle.save': 'Save',
    'vehicle.saved': 'Saved',
    'vehicle.chat': 'Chat',
    'vehicle.viewDetails': 'View Details',
    'vehicle.interested': "I'm Interested",
    'vehicle.mileage': 'Mileage',
    'vehicle.transmission': 'Transmission',
    'vehicle.engine': 'Engine',
    'vehicle.fuel': 'Fuel',
    'vehicle.sold': 'SOLD',
    'vehicle.year': 'Year',
    'vehicle.make': 'Make',
    'vehicle.model': 'Model',
    'vehicle.bodyType': 'Body Type',
    'vehicle.exterior': 'Exterior',
    'vehicle.interior': 'Interior',
    'vehicle.driveType': 'Drive Type',
    'vehicle.fuelType': 'Fuel Type',
    'vehicle.vin': 'VIN',
    'vehicle.stockNumber': 'Stock Number',
    'vehicle.doors': 'Doors',
    'vehicle.passengers': 'Passengers',
    'vehicle.condition': 'Condition',
    'vehicle.fuelEconomy': 'Fuel Economy',
    'vehicle.scheduleTestDrive': 'Schedule Test Drive',
    'vehicle.sendForTradeIn': 'Send Your Car for Trade-In',

    // About Page
    'about.title': 'About Zoe',
    'about.subtitle': 'Revolutionizing the automotive industry with cutting-edge technology and exceptional customer service.',
    'about.mission.title': 'Our Mission',
    'about.mission.desc': 'To provide an unparalleled car buying experience through innovative technology, transparency, and exceptional customer service. We\'re committed to making vehicle transactions simple, secure, and enjoyable.',
    'about.vision.title': 'Our Vision',
    'about.vision.desc': 'To become the global leader in digital automotive retail, setting new standards for how people buy and sell vehicles. We envision a future where every transaction is seamless, transparent, and trustworthy.',
    'about.stats.customers': 'Happy Customers',
    'about.stats.cars': 'Cars Sold',
    'about.stats.staff': 'Expert Staff',
    'about.stats.experience': 'Years Experience',
    'about.values.title': 'Our Values',
    'about.values.innovation': 'Innovation',
    'about.values.innovation.desc': 'Pushing boundaries in automotive retail',
    'about.values.trust': 'Trust',
    'about.values.trust.desc': 'Building lasting relationships',
    'about.values.transparency': 'Transparency',
    'about.values.transparency.desc': 'Clear communication always',
    'about.values.excellence': 'Excellence',
    'about.values.excellence.desc': 'Delivering the best experience',

    // Services Page
    'services.title': 'Our Services',
    'services.subtitle': 'Comprehensive automotive services tailored to your needs.',
    'services.inspection.title': 'Vehicle Inspection',
    'services.inspection.desc': 'Comprehensive multi-point inspection by certified technicians',
    'services.financing.title': 'Financing Options',
    'services.financing.desc': 'Flexible financing solutions tailored to your needs',
    'services.insurance.title': 'Insurance Services',
    'services.insurance.desc': 'Comprehensive coverage options for your vehicle',
    'services.maintenance.title': 'Maintenance',
    'services.maintenance.desc': 'Regular maintenance and service packages',
    'services.process.title': 'Our Service Process',
    'services.process.book.title': 'Book Appointment',
    'services.process.book.desc': 'Schedule your service online or by phone',
    'services.process.inspection.title': 'Vehicle Inspection',
    'services.process.inspection.desc': 'Thorough inspection by our experts',
    'services.process.execution.title': 'Service Execution',
    'services.process.execution.desc': 'Professional service delivery',
    'services.process.quality.title': 'Quality Check',
    'services.process.quality.desc': 'Final inspection and delivery',
    'services.cta.title': 'Ready to Get Started?',
    'services.cta.subtitle': 'Book your service appointment today and experience our premium care',
    'services.cta.button': 'Schedule Service',

    // Contact Page
    'contact.title': 'Contact Us',
    'contact.subtitle': 'We\'re here to help. Reach out to us with any questions or concerns.',
    'contact.form.title': 'Send us a Message',
    'contact.form.loginRequired': 'Please log in or create an account to send us a message.',
    'contact.form.name': 'Name',
    'contact.form.email': 'Email',
    'contact.form.phone': 'Phone',
    'contact.form.message': 'Message',
    'contact.form.send': 'Send Message',
    'contact.form.sending': 'Sending...',
    'contact.form.success': 'Your message has been sent successfully! Redirecting to chat...',
    'contact.form.error': 'There was an error sending your message. Please try again.',
    'contact.info.title': 'Contact Information',
    'contact.hours.title': 'Business Hours',
    'contact.hours.weekdays': 'Monday - Friday',
    'contact.hours.saturday': 'Saturday',
    'contact.hours.sunday': 'Sunday',
    'contact.hours.closed': 'Closed',

    // Trade-In Page
    'tradeIn.title': 'Trade In Your Vehicle',
    'tradeIn.subtitle': 'Get the best value for your current vehicle and upgrade to your dream car.',
    'tradeIn.filters.minValue': 'Min Trade Value',
    'tradeIn.filters.maxValue': 'Max Trade Value',
    'tradeIn.noVehicles.title': 'No Trade-In Vehicles Available',
    'tradeIn.noVehicles.desc': 'Please check back later or adjust your filters.',

    // Send Us Your Car Page
    'sendCar.title': 'Send Us Your Car',
    'sendCar.tradeInTitle': 'Trade In Your Car',
    'sendCar.subtitle': 'Submit your car details, and we\'ll review it for potential listing on our platform.',
    'sendCar.tradeInSubtitle': 'Submit your car details for trade-in evaluation and get the best value for your vehicle.',

    // Spare Parts Page
    'spareParts.title': 'Spare Parts Catalog',
    'spareParts.subtitle': 'Find genuine spare parts for your vehicle with our extensive collection.',
    'spareParts.filters.category': 'Category',
    'spareParts.filters.brand': 'Brand',
    'spareParts.filters.allCategories': 'All Categories',
    'spareParts.filters.allBrands': 'All Brands',
    'spareParts.categories.engine': 'Engine Parts',
    'spareParts.categories.brakes': 'Brake System',
    'spareParts.categories.suspension': 'Suspension',
    'spareParts.categories.electrical': 'Electrical',
    'spareParts.categories.body': 'Body Parts',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.tryAgain': 'Try Again',
    'common.close': 'Close',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.learnMore': 'Learn More',
    'common.readMore': 'Read More',
    'common.backToHome': 'Back to Home',
    'common.price': 'Price',
    'common.year': 'Year',
    'common.condition': 'Condition',
    'common.new': 'New',
    'common.used': 'Used',
    'common.register': 'Register',

    // Footer
    'footer.quickLinks': 'Quick Links',
    'footer.ourServices': 'Our Services',
    'footer.newVehicles': 'New Vehicles',
    'footer.preOwnedVehicles': 'Pre-Owned Vehicles',
    'footer.financingOptions': 'Financing Options',
    'footer.vehicleTradeIn': 'Vehicle Trade-In',
    'footer.contactUs': 'Contact Us',
    'footer.allRightsReserved': 'All rights reserved',
    'footer.privacyPolicy': 'Privacy Policy',
    'footer.termsOfService': 'Terms of Service',

    // Language Toggle
    'language.toggle': 'Language',
    'language.english': 'English',
    'language.amharic': 'አማርኛ',
  },
  am: {
    // Navigation
    'nav.home': 'መነሻ',
    'nav.inventory': 'መኪናዎች',
    'nav.spareParts': 'መለዋወጫዎች',
    'nav.services': 'አገልግሎቶች',
    'nav.tradeIn': 'መኪና መለዋወጥ',
    'nav.sendUsYourCar': 'መኪናዎን ይላኩልን',
    'nav.about': 'ስለ እኛ',
    'nav.contact': 'አግኙን',
    'nav.login': 'ግባ',
    'nav.profile': 'መገለጫ',
    'nav.savedVehicles': 'የተቀመጡ መኪናዎች',
    'nav.messages': 'መልዕክቶች',
    'nav.logout': 'ውጣ',
    'nav.adminDashboard': 'Admin Dashboard',

    // Login & Register
    'login.password': 'የይለፍ ቃል',
    'login.rememberMe': 'አስታውሰኝ',
    'login.loggingIn': 'በመግባት ላይ...',
    'login.error': 'የተሳሳተ ኢሜይል ወይም የይለፍ ቃል',
    'login.noAccount': 'መለያ የለዎትም?',
    'register.firstName': 'የመጀመሪያ ስም',
    'register.lastName': 'የአባት ስም',
    'register.creating': 'መለያ በመፍጠር ላይ...',
    'register.success': 'መለያ በተሳካ ሁኔታ ተፈጥሯል! አሁን መግባት ይችላሉ።',
    'register.error': 'መለያ መፍጠር አልተሳካም። እባክዎ እንደገና ይሞክሩ።',
    'register.hasAccount': 'መለያ አለዎት?',

    // Home Page
    'home.hero.title': 'ህልምዎን ይንዱ',
    'home.hero.subtitle': 'ጭንቀትን ትተው መንዳት ይጀምሩ — የተረጋገጡ መኪናዎችን ያስሱ፣ የባለሙያ ድጋፍ ያግኙ እና ከቤትዎ ሆነው በእኛ ሙሉ አገልግሎት ሱቅ ይግዙ።',
    'home.hero.browseCars': 'መኪናዎችን ይመልከቱ',
    'home.hero.ourServices': 'አገልግሎቶቻችን',
    'home.featured.title': 'ተመራጭ መኪናዎች',
    'home.whyChoose.title': 'ለምን Zoe ይምረጡ',
    'home.whyChoose.quality.title': 'የተረጋገጠ ጥራት',
    'home.whyChoose.quality.desc': 'እያንዳንዱ መኪና በደንብ የተመረመረ',
    'home.whyChoose.delivery.title': 'ፈጣን አቅርቦት',
    'home.whyChoose.delivery.desc': 'ፈጣን እና ውጤታማ የማድረስ አገልግሎት',
    'home.whyChoose.financing.title': 'ቀላል ፋይናንስ',
    'home.whyChoose.financing.desc': 'ተለዋዋጭ የክፍያ አማራጮች',
    'home.whyChoose.support.title': '24/7 ድጋፍ',
    'home.whyChoose.support.desc': 'ሁልጊዜ እዚህ ነን',
    'home.cta.title': 'የህልም መኪናዎን ለማግኘት ዝግጁ ነዎት?',
    'home.cta.subtitle': 'ከ Zoe ጋር ፍጹም መኪናቸውን ካገኙ በሺዎች የሚቆጠሩ ደስተኛ ደንበኞች ጋር ይቀላቀሉ።',
    'home.cta.button': 'ዛሬ ይጀምሩ',

    // Inventory Page
    'inventory.title': 'የህልም መኪናዎችዎን ያስሱ',
    'inventory.subtitle': 'ለአኗኗር ዘይቤዎ እና ምርጫዎ የተስማማ ፍጹም መኪና ያግኙ።',
    'inventory.filters.model': 'ሞዴል',
    'inventory.filters.year': 'ዓመት',
    'inventory.filters.minPrice': 'ዝቅተኛ ዋጋ',
    'inventory.filters.maxPrice': 'ከፍተኛ ዋጋ',
    'inventory.filters.condition': 'ሁኔታ',
    'inventory.filters.allModels': 'ሁሉም ሞዴሎች',
    'inventory.filters.allYears': 'ሁሉም ዓመታት',
    'inventory.filters.allConditions': 'ሁሉም ሁኔታዎች',
    'inventory.filters.new': 'አዲስ',
    'inventory.filters.used': 'ተጠቅሞበት',
    'inventory.filters.reset': 'ማጣሪያዎችን ዳግም አስጀምር',
    'inventory.pagination.previous': 'ቀዳሚ',
    'inventory.pagination.next': 'ቀጣይ',

    // Vehicle Card & Details
    'vehicle.save': 'አስቀምጥ',
    'vehicle.saved': 'ተቀምጧል',
    'vehicle.chat': 'ውይይት',
    'vehicle.viewDetails': 'ዝርዝር ይመልከቱ',
    'vehicle.interested': 'ፍላጎት አለኝ',
    'vehicle.mileage': 'የተጓዘ ርቀት',
    'vehicle.transmission': 'ማስተላለፊያ',
    'vehicle.engine': 'ሞተር',
    'vehicle.fuel': 'ነዳጅ',
    'vehicle.sold': 'ተሽጧል',
    'vehicle.year': 'ዓመት',
    'vehicle.make': 'ሰሪ',
    'vehicle.model': 'ሞዴል',
    'vehicle.bodyType': 'የሰውነት አይነት',
    'vehicle.exterior': 'ውጫዊ',
    'vehicle.interior': 'ውስጣዊ',
    'vehicle.driveType': 'የመንዳት አይነት',
    'vehicle.fuelType': 'የነዳጅ አይነት',
    'vehicle.vin': 'VIN',
    'vehicle.stockNumber': 'የስቶክ ቁጥር',
    'vehicle.doors': 'በሮች',
    'vehicle.passengers': 'ተሳፋሪዎች',
    'vehicle.condition': 'ሁኔታ',
    'vehicle.fuelEconomy': 'የነዳጅ ኢኮኖሚ',
    'vehicle.scheduleTestDrive': 'የሙከራ መንዳት ያስይዙ',
    'vehicle.sendForTradeIn': 'መኪናዎን ለመለዋወጥ ይላኩ',

    // About Page
    'about.title': 'ስለ Zoe',
    'about.subtitle': 'በዘመናዊ ቴክኖሎጂ እና ልዩ የደንበኛ አገልግሎት የመኪና ኢንዱስትሪን መለወጥ።',
    'about.mission.title': 'ተልእኮአችን',
    'about.mission.desc': 'በዘመናዊ ቴክኖሎጂ፣ ግልጽነት እና ልዩ የደንበኛ አገልግሎት የማይመሳሰል የመኪና መግዛት ልምድ ማቅረብ። የመኪና ግብይቶችን ቀላል፣ ደህንነቱ የተጠበቀ እና አስደሳች ለማድረግ ቆርጠናል።',
    'about.vision.title': 'ራዕያችን',
    'about.vision.desc': 'በዲጂታል የመኪና ችርቻሮ ዓለም አቀፍ መሪ መሆን፣ ሰዎች መኪናዎችን እንዴት እንደሚገዙ እና እንደሚሸጡ አዲስ ደረጃዎችን ማስቀመጥ። እያንዳንዱ ግብይት ቀላል፣ ግልጽ እና አስተማማኝ የሆነበት ወደፊት እናስባለን።',
    'about.stats.customers': 'ደስተኛ ደንበኞች',
    'about.stats.cars': 'የተሸጡ መኪናዎች',
    'about.stats.staff': 'ባለሙያ ሰራተኞች',
    'about.stats.experience': 'ዓመታት ልምድ',
    'about.values.title': 'እሴቶቻችን',
    'about.values.innovation': 'ፈጠራ',
    'about.values.innovation.desc': 'በመኪና ችርቻሮ ውስጥ ድንበሮችን መግፋት',
    'about.values.trust': 'እምነት',
    'about.values.trust.desc': 'ዘላቂ ግንኙነቶችን መገንባት',
    'about.values.transparency': 'ግልጽነት',
    'about.values.transparency.desc': 'ሁልጊዜ ግልጽ ግንኙነት',
    'about.values.excellence': 'ምርጥነት',
    'about.values.excellence.desc': 'ምርጥ ልምድ ማቅረብ',

    // Services Page
    'services.title': 'አገልግሎቶቻችን',
    'services.subtitle': 'ለፍላጎትዎ የተስማሙ ሁሉንም አቀፍ የመኪና አገልግሎቶች።',
    'services.inspection.title': 'የመኪና ምርመራ',
    'services.inspection.desc': 'በተመሰከሩ ቴክኒሻኖች ሁሉንም አቀፍ ምርመራ',
    'services.financing.title': 'የፋይናንስ አማራጮች',
    'services.financing.desc': 'ለፍላጎትዎ የተስማሙ ተለዋዋጭ የፋይናንስ መፍትሄዎች',
    'services.insurance.title': 'የኢንሹራንስ አገልግሎቶች',
    'services.insurance.desc': 'ለመኪናዎ ሁሉንም አቀፍ የሽፋን አማራጮች',
    'services.maintenance.title': 'ጥገና',
    'services.maintenance.desc': 'መደበኛ ጥገና እና የአገልግሎት ፓኬጆች',
    'services.process.title': 'የአገልግሎት ሂደታችን',
    'services.process.book.title': 'ቀጠሮ ይያዙ',
    'services.process.book.desc': 'በመስመር ላይ ወይም በስልክ አገልግሎትዎን ያስይዙ',
    'services.process.inspection.title': 'የመኪና ምርመራ',
    'services.process.inspection.desc': 'በባለሙያዎቻችን ጥልቅ ምርመራ',
    'services.process.execution.title': 'የአገልግሎት አፈጻጸም',
    'services.process.execution.desc': 'ሙያዊ የአገልግሎት አቅርቦት',
    'services.process.quality.title': 'የጥራት ምርመራ',
    'services.process.quality.desc': 'የመጨረሻ ምርመራ እና አቅርቦት',
    'services.cta.title': 'ለመጀመር ዝግጁ ነዎት?',
    'services.cta.subtitle': 'ዛሬ የአገልግሎት ቀጠሮዎን ያስይዙ እና የእኛን ልዩ እንክብካቤ ይለማመዱ',
    'services.cta.button': 'አገልግሎት ያስይዙ',

    // Contact Page
    'contact.title': 'አግኙን',
    'contact.subtitle': 'እርዳታ ለመስጠት እዚህ ነን። ማንኛውም ጥያቄ ወይም ስጋት ካለዎት ያግኙን።',
    'contact.form.title': 'መልዕክት ይላኩልን',
    'contact.form.loginRequired': 'መልዕክት ለመላክ እባክዎ ይግቡ ወይም መለያ ይፍጠሩ።',
    'contact.form.name': 'ስም',
    'contact.form.email': 'ኢሜይል',
    'contact.form.phone': 'ስልክ',
    'contact.form.message': 'መልዕክት',
    'contact.form.send': 'መልዕክት ላክ',
    'contact.form.sending': 'በመላክ ላይ...',
    'contact.form.success': 'መልዕክትዎ በተሳካ ሁኔታ ተልኳል! ወደ ውይይት በማዛወር ላይ...',
    'contact.form.error': 'መልዕክትዎን በመላክ ላይ ስህተት ተፈጥሯል። እባክዎ እንደገና ይሞክሩ።',
    'contact.info.title': 'የመገናኛ መረጃ',
    'contact.hours.title': 'የስራ ሰዓቶች',
    'contact.hours.weekdays': 'ሰኞ - አርብ',
    'contact.hours.saturday': 'ቅዳሜ',
    'contact.hours.sunday': 'እሁድ',
    'contact.hours.closed': 'ዝግ',

    // Trade-In Page
    'tradeIn.title': 'መኪናዎን ይለዋወጡ',
    'tradeIn.subtitle': 'ለአሁኑ መኪናዎ ምርጥ ዋጋ ያግኙ እና ወደ ህልም መኪናዎ ያሻሽሉ።',
    'tradeIn.filters.minValue': 'ዝቅተኛ የመለዋወጥ ዋጋ',
    'tradeIn.filters.maxValue': 'ከፍተኛ የመለዋወጥ ዋጋ',
    'tradeIn.noVehicles.title': 'የመለዋወጥ መኪናዎች የሉም',
    'tradeIn.noVehicles.desc': 'እባክዎ በኋላ ይመለሱ ወይም ማጣሪያዎችዎን ያስተካክሉ።',

    // Send Us Your Car Page
    'sendCar.title': 'መኪናዎን ይላኩልን',
    'sendCar.tradeInTitle': 'መኪናዎን ይለዋወጡ',
    'sendCar.subtitle': 'የመኪናዎን ዝርዝር ይላኩ፣ እና በመድረካችን ላይ ለመዘርዘር እንገመግማለን።',
    'sendCar.tradeInSubtitle': 'ለመለዋወጥ ግምገማ የመኪናዎን ዝርዝር ይላኩ እና ለመኪናዎ ምርጥ ዋጋ ያግኙ።',

    // Spare Parts Page
    'spareParts.title': 'የመለዋወጫ ካታሎግ',
    'spareParts.subtitle': 'በሰፊ ስብስባችን ለመኪናዎ ዋናውን መለዋወጫዎች ያግኙ።',
    'spareParts.filters.category': 'ምድብ',
    'spareParts.filters.brand': 'ብራንድ',
    'spareParts.filters.allCategories': 'ሁሉም ምድቦች',
    'spareParts.filters.allBrands': 'ሁሉም ብራንዶች',
    'spareParts.categories.engine': 'የሞተር ክፍሎች',
    'spareParts.categories.brakes': 'የብሬክ ሲስተም',
    'spareParts.categories.suspension': 'ሰስፔንሽን',
    'spareParts.categories.electrical': 'ኤሌክትሪካል',
    'spareParts.categories.body': 'የሰውነት ክፍሎች',

    // Common
    'common.loading': 'በመጫን ላይ...',
    'common.error': 'ስህተት',
    'common.tryAgain': 'እንደገና ሞክር',
    'common.close': 'ዝጋ',
    'common.cancel': 'ሰርዝ',
    'common.save': 'አስቀምጥ',
    'common.edit': 'አርም',
    'common.delete': 'ሰርዝ',
    'common.view': 'ይመልከቱ',
    'common.learnMore': 'ተጨማሪ ይወቁ',
    'common.readMore': 'ተጨማሪ ያንብቡ',
    'common.backToHome': 'ወደ መነሻ ተመለስ',
    'common.price': 'ዋጋ',
    'common.year': 'ዓመት',
    'common.condition': 'ሁኔታ',
    'common.new': 'አዲስ',
    'common.used': 'ተጠቅሞበት',
    'common.register': 'ተመዝገብ',

    // Footer
    'footer.quickLinks': 'ፈጣን አገናኞች',
    'footer.ourServices': 'አገልግሎቶቻችን',
    'footer.newVehicles': 'አዲስ መኪናዎች',
    'footer.preOwnedVehicles': 'ቀድሞ የተያዙ መኪናዎች',
    'footer.financingOptions': 'የፋይናንስ አማራጮች',
    'footer.vehicleTradeIn': 'የመኪና መለዋወጥ',
    'footer.contactUs': 'አግኙን',
    'footer.allRightsReserved': 'ሁሉም መብቶች የተጠበቁ ናቸው',
    'footer.privacyPolicy': 'የግላዊነት ፖሊሲ',
    'footer.termsOfService': 'የአገልግሎት ውሎች',

    // Language Toggle
    'language.toggle': 'ቋንቋ',
    'language.english': 'English',
    'language.amharic': 'አማርኛ',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};