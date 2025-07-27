import Link from 'next/link'
import { Github, Linkedin, Star, Heart, MapPin, Phone, Mail, ChefHat } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Footer() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const linkVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const quickLinks = [
    { href: "/", label: "Home", icon: ChefHat },
    { href: "#", label: "About Us", icon: Heart },
    { href: "https://wa.me/8279243897", label: "Contact Us", icon: Phone },
    { href: "#", label: "Our Menu", icon: Star }
  ];

  const socialLinks = [
    {
      href: "#",
      icon: Github,
      label: "GitHub",
      color: "hover:text-gray-300"
    },
    {
      href: "#",
      icon: Linkedin,
      label: "LinkedIn",
      color: "hover:text-blue-400"
    },
    {
      href: "#",
      label: "Instagram",
      color: "hover:text-pink-400",
      customIcon: (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6"
          fill="currentColor"
        >
          <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
        </svg>
      )
    }
  ];

  const contactInfo = [
    { icon: Phone, label: "+91 8279243897" },
    { icon: Mail, label: "support@halwaai.com" },
    { icon: MapPin, label: "Bhilwara, Rajasthan" }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-orange-900/5 to-red-900/10" />

      {/* Floating Decorative Elements */}
      <div className="absolute top-20 left-10 w-3 h-3 bg-amber-400/20 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute top-40 right-20 w-2 h-2 bg-orange-400/30 rounded-full animate-pulse delay-2000"></div>
      <div className="absolute bottom-40 left-20 w-4 h-4 bg-yellow-400/20 rounded-full animate-pulse"></div>

      <motion.div
        className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 pb-[120px] sm:pb-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">

          {/* Header Section */}
          <motion.div
            className="text-center mb-16"
            variants={itemVariants}
          >
            <motion.div
              className="flex items-center justify-center space-x-2 mb-4"
              variants={itemVariants}
            >
            </motion.div>

            <motion.h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold font-poorStory mb-4"
              variants={itemVariants}
            >
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Halwaai
              </span>
            </motion.h2>

            <motion.p
              className="text-lg text-gray-300 font-poppins max-w-2xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Crafting authentic thali experiences with love and tradition, bringing the taste of home to your doorstep.
            </motion.p>

            {/* Decorative Line */}
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-6"
              variants={itemVariants}
            />
          </motion.div>

          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-16">

            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h3 className="text-xl lg:text-2xl font-bold mb-6 text-white font-poorStory">
                Quick Links
              </h3>
              <nav className="space-y-4">
                {quickLinks.map((link, index) => (
                  <motion.div
                    key={index}
                    variants={linkVariants}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={link.href}
                      className="flex items-center space-x-3 text-gray-300 hover:text-amber-400 transition-colors duration-300 group"
                    >
                      <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-amber-400/20 transition-colors duration-300">
                        <link.icon className="w-4 h-4" />
                      </div>
                      <span className="font-poppins">{link.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>

            {/* Contact Information */}
            <motion.div variants={itemVariants}>
              <h3 className="text-xl lg:text-2xl font-bold mb-6 text-white font-poorStory">
                Contact Info
              </h3>
              <div className="space-y-4">
                {contactInfo.map((contact, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3 text-gray-300"
                    variants={linkVariants}
                  >
                    <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                      <contact.icon className="w-4 h-4 text-amber-400" />
                    </div>
                    <span className="font-poppins">{contact.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* About the Developer */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <h3 className="text-xl lg:text-2xl font-bold mb-6 text-white font-poorStory">
                About the Developer
              </h3>
              <p className="text-gray-300 mb-6 font-poppins leading-relaxed">
                Crafted with passion by our talented development team. We specialize in
                creating delightful digital experiences that bring value to our users and
                help businesses connect with their customers through beautiful, functional design.
              </p>

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400 font-poppins mr-2">Follow us:</span>
                {socialLinks.map((social, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={social.href}
                      className={`w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 hover:bg-gray-700 group`}
                    >
                      {social.customIcon ? (
                        social.customIcon
                      ) : (
                        <social.icon className="w-5 h-5" />
                      )}
                      <span className="sr-only">{social.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Newsletter Section */}
          {/* <motion.div
            className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-2xl p-8 lg:p-12 mb-12 border border-gray-700"
            variants={itemVariants}
          >
            <div className="text-center">
              <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-white font-poorStory">
                Stay Updated
              </h3>
              <p className="text-gray-300 mb-6 font-poppins max-w-2xl mx-auto">
                Subscribe to our newsletter for exclusive offers, new menu items, and special events.
              </p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
                variants={itemVariants}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors duration-300"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-600 text-black font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Subscribe
                </motion.button>
              </motion.div>
            </div>
          </motion.div> */}

          {/* Bottom Section */}
          <motion.div
            className="pt-8 border-t border-gray-800"
            variants={itemVariants}
          >
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <motion.div
                className="text-center md:text-left"
                variants={itemVariants}
              >
                <p className="text-gray-400 font-poppins">
                  © 2024 Halwaai. All rights reserved
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Made with <Heart className="w-4 h-4 inline text-red-400 fill-current" /> for food lovers
                </p>
              </motion.div>

              <motion.div
                className="flex items-center space-x-6 text-sm text-gray-400"
                variants={itemVariants}
              >
                <Link href="#" className="hover:text-amber-400 transition-colors duration-300">
                  Privacy Policy
                </Link>
                <Link href="#" className="hover:text-amber-400 transition-colors duration-300">
                  Terms of Service
                </Link>
                <Link href="#" className="hover:text-amber-400 transition-colors duration-300">
                  Refund Policy
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Decorative Bottom Element */}
          <motion.div
            className="mt-12 text-center"
            variants={itemVariants}
          >
            <div className="flex items-center justify-center space-x-4">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-400/50"></div>
              <ChefHat className="w-5 h-5 text-amber-400 animate-pulse" />
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-400/50"></div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </footer>
  )
}