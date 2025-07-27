import { Phone, Instagram, Star, MessageCircle, Mail, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Contact() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak directly with our team",
      value: "+91 987654321",
      action: "tel:+91987654321",
      color: "text-blue-600",
      bgColor: "from-blue-50 to-cyan-50",
      hoverColor: "hover:from-blue-100 hover:to-cyan-100"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      description: "Quick chat for instant support",
      value: "Message Us",
      action: "https://wa.me/+91987654321",
      color: "text-green-600",
      bgColor: "from-green-50 to-emerald-50",
      hoverColor: "hover:from-green-100 hover:to-emerald-100",
      customIcon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      )
    },
    {
      icon: Instagram,
      title: "Instagram",
      description: "Follow us for updates",
      value: "@halwaai_official",
      action: "https://instagram.com/halwaai_official",
      color: "text-pink-600",
      bgColor: "from-pink-50 to-rose-50",
      hoverColor: "hover:from-pink-100 hover:to-rose-100"
    }
  ];

  const additionalInfo = [
    {
      icon: Mail,
      title: "Email Support",
      value: "support@halwaai.com"
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Bhilwara, Rajasthan"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-amber-50 overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100/20 via-orange-100/10 to-amber-100/20" />

      {/* Floating Decorative Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-pink-300/30 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute top-40 right-20 w-3 h-3 bg-orange-300/40 rounded-full animate-pulse delay-2000"></div>
      <div className="absolute bottom-40 left-20 w-2 h-2 bg-amber-300/50 rounded-full animate-pulse"></div>

      <motion.div
        className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-6xl mx-auto">

          {/* Enhanced Header Section */}
          <motion.div
            className="text-center mb-16 lg:mb-20"
            variants={itemVariants}
          >
            {/* Premium Badge */}
            <motion.div
              className="flex items-center justify-center space-x-2 mb-6"
              variants={itemVariants}
            >
            </motion.div>

            <motion.h2
              className="text-4xl sm:text-5xl lg:text-6xl font-bold font-poorStory mb-6 text-gray-800"
              variants={itemVariants}
            >
              <span className="bg-gradient-to-r from-pink-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                Contact
              </span>{" "}
              Us
            </motion.h2>

            <motion.p
              className="text-lg sm:text-xl lg:text-2xl text-gray-600 font-poppins max-w-3xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              We're here to help! Reach out to us through any of these channels and we'll get back to you as soon as possible.
            </motion.p>

            {/* Decorative Line */}
            <motion.div
              className="w-32 h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto mt-8"
              variants={itemVariants}
            />
          </motion.div>

          {/* Enhanced Contact Methods */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16"
            variants={containerVariants}
          >
            {contactMethods.map((method, index) => (
              <motion.a
                key={index}
                href={method.action}
                target={method.action.startsWith('http') ? '_blank' : undefined}
                rel={method.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="block group"
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`bg-gradient-to-br ${method.bgColor} ${method.hoverColor} p-8 rounded-2xl border border-white/50 shadow-lg group-hover:shadow-2xl transition-all duration-300 text-center relative overflow-hidden`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl"></div>

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                      {method.customIcon ? (
                        <div className={method.color}>{method.customIcon}</div>
                      ) : (
                        <method.icon className={`w-8 h-8 ${method.color}`} />
                      )}
                    </div>

                    {/* Content */}
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors duration-300">
                      {method.title}
                    </h3>
                    <p className="text-sm lg:text-base text-gray-600 mb-4 font-poppins">
                      {method.description}
                    </p>
                    <p className="text-base lg:text-lg font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                      {method.value}
                    </p>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* Additional Information */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-xl border border-white/50"
            variants={itemVariants}
          >
            <motion.h3
              className="text-2xl lg:text-3xl font-bold text-center mb-8 text-gray-800 font-poorStory"
              variants={itemVariants}
            >
              Additional Information
            </motion.h3>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
              variants={containerVariants}
            >
              {additionalInfo.map((info, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-center md:justify-start space-x-4 p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group"
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <info.icon className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="text-center md:text-left">
                    <h4 className="font-semibold text-gray-800 mb-1">{info.title}</h4>
                    <p className="text-gray-600 font-poppins">{info.value}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            className="text-center mt-16"
            variants={itemVariants}
          >
            <motion.div
              className="max-w-2xl mx-auto"
              variants={itemVariants}
            >
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 font-poorStory">
                Ready to Order?
              </h3>
              <p className="text-base lg:text-lg text-gray-600 font-poppins leading-relaxed mb-6">
                Don't hesitate to reach out! Our team is always ready to help you create the perfect thali experience.
              </p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                variants={itemVariants}
              >
                <motion.a
                  href="tel:+91987654321"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group"
                >
                  <div className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-orange-500 hover:to-amber-500 text-white font-bold px-8 py-4 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-pink-400 group-hover:border-orange-400">
                    <Phone className="w-5 h-5 inline mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    Call Now
                  </div>
                </motion.a>

                <motion.a
                  href="https://wa.me/+91987654321"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group"
                >
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-emerald-500 hover:to-green-600 text-white font-bold px-8 py-4 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-green-400 group-hover:border-emerald-400">
                    <MessageCircle className="w-5 h-5 inline mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    WhatsApp
                  </div>
                </motion.a>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Bottom Decorative Element */}
          <motion.div
            className="mt-20 text-center"
            variants={itemVariants}
          >
            <div className="flex items-center justify-center space-x-4">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-pink-300/50"></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-pink-300/50"></div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}