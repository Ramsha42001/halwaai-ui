import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Shield, Sparkles, Star, Gift, HandHeart, Globe } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    label: "10,000+",
    description: "Thalis served monthly",
    icon: Gift,
    color: "from-green-500 to-emerald-600",
    bgColor: "from-green-50 to-emerald-50"
  },
  {
    label: "50+",
    description: "NGOs covered",
    icon: Users,
    color: "from-blue-500 to-cyan-600",
    bgColor: "from-blue-50 to-cyan-50"
  },
  {
    label: "100%",
    description: "Packed with hygiene",
    icon: Shield,
    color: "from-purple-500 to-violet-600",
    bgColor: "from-purple-50 to-violet-50"
  },
];

const impactFeatures = [
  {
    icon: Heart,
    title: "Community Impact",
    description: "Making a difference in local communities through nutritious meals"
  },
  {
    icon: HandHeart,
    title: "Social Responsibility",
    description: "Our commitment to giving back and supporting those in need"
  },
  {
    icon: Globe,
    title: "Sustainable Mission",
    description: "Creating lasting change through consistent meal programs"
  }
];

export default function CustomizeThali() {
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

  return (
    <div className="min-h-screen text-white overflow-hidden relative">
      {/* Background Pattern */}

      {/* Floating Hearts Animation */}
      <div className="absolute top-20 left-10 w-4 h-4 text-pink-300 animate-pulse delay-1000">
        <Heart className="w-4 h-4 fill-current" />
      </div>
      <div className="absolute top-40 right-20 w-3 h-3 text-pink-200 animate-pulse delay-2000">
        <Heart className="w-3 h-3 fill-current" />
      </div>
      <div className="absolute bottom-40 left-20 w-2 h-2 text-pink-400 animate-pulse">
        <Heart className="w-2 h-2 fill-current" />
      </div>

      <motion.div
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Enhanced Header Section */}
        <motion.div
          className="text-center mb-16 lg:mb-20"
          variants={itemVariants}
        >
          {/* Mission Badge */}
          <motion.div
            className="flex items-center justify-center space-x-2 mb-6"
            variants={itemVariants}
          >
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-7xl font-bold font-poorStory mb-8 leading-tight"
            variants={itemVariants}
          >
            <span className="bg-gradient-to-r from-yellow-200 via-white to-pink-200 bg-clip-text text-transparent">
              Feeding Hope:
            </span>
            <br />
            <span className="text-white">
              Our Free Thali Program
            </span>
          </motion.h1>

          <motion.h2
            className="text-xl sm:text-2xl lg:text-2xl font-medium mb-8 font-poppins text-center max-w-5xl mx-auto leading-relaxed text-yellow-100"
            variants={itemVariants}
          >
            We believe that no one should go hungry. Through our Free Thali Program, we provide nutritious meals to those in need,{" "}
            <span className="text-yellow-300 font-semibold">spreading love and hope one plate at a time.</span>
          </motion.h2>

          {/* Decorative Line */}
          <motion.div
            className="w-32 h-1 bg-gradient-to-r from-transparent via-yellow-300 to-transparent mx-auto"
            variants={itemVariants}
          />
        </motion.div>

        {/* Enhanced Stats Cards Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16 lg:mb-20"
          variants={containerVariants}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="group"
            >
              <Card className={`bg-gradient-to-br ${stat.bgColor} border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden relative`}>
                <CardContent className="p-8 text-center relative z-10">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>

                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Stats */}
                  <h3 className="text-4xl lg:text-5xl font-bold mb-3 text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                    {stat.label}
                  </h3>
                  <p className="text-lg lg:text-xl font-semibold text-gray-700 font-poppins leading-relaxed">
                    {stat.description}
                  </p>

                  {/* Hover Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg`}></div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Impact Features Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16 lg:mb-20"
          variants={containerVariants}
        >
          {impactFeatures.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="group"
            >
              <div className="bg-white/10 backdrop-blur-sm p-6 lg:p-8 rounded-2xl border border-white/20 hover:border-white/30 transition-all duration-300 text-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-white/80 font-poppins leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Image Section */}
        <motion.div
          className="flex flex-col justify-center items-center space-y-8"
          variants={itemVariants}
        >

          <motion.div
            className="relative w-full max-w-5xl group"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
          >
            {/* Decorative Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-orange-400/10 to-red-400/20 rounded-3xl blur-3xl transform group-hover:scale-110 transition-transform duration-700"></div>

            {/* Main Image Container */}
            <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-4 lg:p-6 border border-white/20 shadow-2xl">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/ngo.png"
                  alt="Free Thali Program - Community meals and social impact"
                  width={1200}
                  height={800}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />

                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Image Caption */}
              <div className="text-center mt-6">
                <p className="text-white/90 font-poppins text-base lg:text-lg leading-relaxed">
                  Bringing communities together through the universal language of food and compassion
                </p>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400/70 rounded-full animate-bounce delay-300">
              <Heart className="w-4 h-4 text-white m-2" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-6 h-6 bg-pink-400/60 rounded-full animate-pulse delay-700">
              <Sparkles className="w-3 h-3 text-white m-1.5" />
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            className="text-center mt-12"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-block"
            >
            </motion.div>

            <p className="text-white/80 font-poppins mt-4 text-sm">
              Together, we can make a difference in our community
            </p>
          </motion.div>
        </motion.div>

        {/* Bottom Decorative Element */}
        <motion.div
          className="mt-20 text-center"
          variants={itemVariants}
        >
          <div className="flex items-center justify-center space-x-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-yellow-300/50"></div>
            <Heart className="w-4 h-4 text-yellow-300 fill-current animate-pulse" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-yellow-300/50"></div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}