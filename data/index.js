import { COLORS, icons, images } from "../constants";

export const friends = [
    {
        id: "1",
        name: "Aarav Kumar",
        phoneNumber: "+91-900-400-0135",
        avatar: images.user1,
    },
    {
        id: "2",
        name: "Priya Sharma",
        phoneNumber: "+91-909-900-0135",
        avatar: images.user2,
    },
    {
        id: "3",
        name: "Ravi Patel",
        phoneNumber: "+91-940-100-1009",
        avatar: images.user3,
    },
    {
        id: "4",
        name: "Ananya Gupta",
        phoneNumber: "+91-970-200-4550",
        avatar: images.user4,
    },
    {
        id: "5",
        name: "Vikram Reddy",
        phoneNumber: "+91-800-200-9800",
        avatar: images.user5,
    },
    {
        id: "6",
        name: "Neha Singh",
        phoneNumber: "+91-770-200-9800",
        avatar: images.user6,
    },
    {
        id: "7",
        name: "Rajesh Mehta",
        phoneNumber: "+91-943-230-9899",
        avatar: images.user7,
    },
    {
        id: "8",
        name: "Sneha Patel",
        phoneNumber: "+91-900-234-9899",
        avatar: images.user8,
    },
    {
        id: "9",
        name: "Manish Verma",
        phoneNumber: "+91-240-234-9899",
        avatar: images.user9
    },
    {
        id: "10",
        name: "Kavita Dubey",
        phoneNumber: "+91-500-234-4555",
        avatar: images.user10
    },
];


export const faqKeywords = [
    {
        id: "1",
        name: "General"
    },
    {
        id: "2",
        name: "Account"
    },
    {
        id: "3",
        name: "Security"
    },
    {
        id: "4",
        name: "Booking"
    },
    {
        id: "5",
        name: "Payment"
    }
];

export const faqs = [
    {
        question: 'How do I schedule a consultation with a doctor?',
        answer: 'To schedule a consultation with a doctor, simply log in to your account, choose the specialty or doctor you need, select a convenient time slot, and confirm your appointment.',
        type: "General"
    },
    {
        question: 'Can I have virtual consultations with doctors through this app?',
        answer: 'Yes, you can have virtual consultations with doctors. Simply select the option for a virtual consultation when scheduling your appointment, and connect with your doctor at the scheduled time.',
        type: "General"
    },
    {
        question: 'What should I do if I need to update my personal information?',
        answer: "To update your personal information, go to your account settings, and you'll find options to edit your profile details such as name, address, and contact information.",
        type: "Account"
    },
    {
        question: 'How can I find doctors specializing in specific medical conditions?',
        answer: 'You can use the app’s search filters to find doctors specializing in specific medical conditions. Filter results by specialties such as cardiology, dermatology, or pediatrics.',
        type: "Booking"
    },
    {
        question: 'Is there a way to make payments for consultations within the app?',
        answer: 'Yes, you can securely make payments for consultations using various payment methods available in the app, including credit/debit cards and digital wallets.',
        type: "Payment"
    },
    {
        question: 'Are my personal details and medical information kept secure?',
        answer: 'Yes, we prioritize the security and confidentiality of your personal details and medical information. Our app complies with strict privacy and data protection standards to ensure your information remains secure.',
        type: "Security"
    },
    {
        question: 'Can I request additional assistance for special medical requirements or preferences?',
        answer: "Yes, you can request additional assistance for special medical requirements or preferences during the booking process. Simply specify your needs, and we'll strive to accommodate them.",
        type: "General"
    },
    {
        question: 'How can I provide feedback or rate my consultation experience?',
        answer: 'After your consultation, you can provide feedback and rate your experience through the app’s rating and review system. Your feedback helps us improve our services for future consultations.',
        type: "General"
    },
    {
        question: 'Is customer support available through this app?',
        answer: 'While we provide consultation services, our app is not for customer support. For assistance, please contact our support team through the designated channels provided in the app.',
        type: "General"
    },
];

export const banners = [
    {
        id: 1,
        discount: '40%',
        discountName: "Today's Special",
        bottomTitle: 'Get a discount on your consultation fee!',
        bottomSubtitle: 'Only valid for today!'
    },
    {
        id: 2,
        discount: '50%',
        discountName: "Weekend Sale",
        bottomTitle: 'Special discount for weekend appointments!',
        bottomSubtitle: 'This weekend only!'
    },
    {
        id: 3,
        discount: '30%',
        discountName: "Limited Time Offer",
        bottomTitle: 'Hurry up! Book your appointment now!',
        bottomSubtitle: 'Valid until slots last!'
    }
];

export const categories = [
    {
        id: "1",
        name: "Physician",
        icon: icons.friends,
        iconColor: "rgba(36, 107, 253, 1)", // Blue
        backgroundColor: "rgba(36, 107, 253, .12)",
        onPress: "CategoryGeneralist"
    },
    {
        id: "2",
        name: "Dentist",
        icon: icons.tooth,
        iconColor: "rgba(0, 184, 217, 1)", // Cyan
        backgroundColor: "rgba(0, 184, 217, .12)",
        onPress: "CategoryDentist"
    },
    {
        id: "3",
        name: "Eye Specialist",
        icon: icons.eye,
        iconColor: "rgba(126, 87, 194, 1)", // Purple
        backgroundColor: "rgba(126, 87, 194, .12)",
        onPress: "CategoryOphthalmologist"
    },
    {
        id: "4",
        name: "Nutritionist",
        icon: icons.nutrition1,
        iconColor: "rgba(76, 175, 80, 1)", // Green
        backgroundColor: "rgba(76, 175, 80, .12)",
        onPress: "CategoryNutritionist"
    },
    {
        id: "5",
        name: "Neurologist",
        icon: icons.brain,
        iconColor: "rgba(236, 64, 122, 1)", // Pink
        backgroundColor: "rgba(236, 64, 122, .12)",
        onPress: "CategoryNeurologist"
    },
    {
        id: "6",
        name: "Dietitian",
        icon: icons.dietitian,
        iconColor: "rgba(156, 204, 101, 1)", // Light Green
        backgroundColor: "rgba(156, 204, 101, .12)",
        onPress: null
    },
    {
        id: "7", // Corrected duplicate ID
        name: "Ear Nose Throat Specialist",
        icon: icons.ent,
        iconColor: "rgba(255, 167, 38, 1)", // Orange
        backgroundColor: "rgba(255, 167, 38, .12)",
        onPress: null
    },
    {
        id: "8",
        name: "Stomach Specialist", // Corrected typo
        icon: icons.stomatch,
        iconColor: "rgba(161, 136, 127, 1)", // Brown
        backgroundColor: "rgba(161, 136, 127, .12)",
        onPress: null
    },
    {
        id: "9",
        name: "More",
        icon: icons.more3,
        iconColor: "rgba(144, 164, 174, 1)", // Gray
        backgroundColor: "rgba(144, 164, 174, .12)",
        onPress: null
    },
    {
        id: "10",
        name: "Women Health",
        icon: icons.childspeciality,
        iconColor: "rgba(240, 98, 146, 1)", // Light Pink
        backgroundColor: "rgba(240, 98, 146, .12)",
        onPress: null
    },
    {
        id: "11",
        name: "Skin & Hair",
        icon: icons.skin,
        iconColor: "rgba(255, 204, 128, 1)", // Peach
        backgroundColor: "rgba(255, 204, 128, .12)",
        onPress: null
    },
    {
        id: "12",
        name: "Diabetes Specialist",
        icon: icons.sugar,
        iconColor: "rgba(66, 165, 245, 1)", // Light Blue
        backgroundColor: "rgba(66, 165, 245, .12)",
        onPress: null
    },
    {
        id: "13",
        name: "Kidney Specialist", // Corrected typo
        icon: icons.kidney,
        iconColor: "rgba(229, 115, 115, 1)", // Red
        backgroundColor: "rgba(229, 115, 115, .12)",
        onPress: null
    },
    {
        id: "14",
        name: "Child Specialist",
        icon: icons.children,
        iconColor: "rgba(255, 202, 40, 1)", // Yellow
        backgroundColor: "rgba(255, 202, 40, .12)",
        onPress: "CategoryPediatric"
    },
    {
        id: "15",
        name: "Bone Joints",
        icon: icons.joint2,
        iconColor: "rgba(120, 144, 156, 1)", // Blue Gray
        backgroundColor: "rgba(120, 144, 156, .12)",
        onPress: null
    },
    {
        id: "16",
        name: "Lungs Specialist",
        icon: icons.activity,
        iconColor: "rgba(79, 195, 247, 1)", // Sky Blue
        backgroundColor: "rgba(79, 195, 247, .12)",
        onPress: null
    },
    {
        id: "17",
        name: "Brain Specialist",
        icon: icons.brain2,
        iconColor: "rgba(171, 71, 188, 1)", // Magenta
        backgroundColor: "rgba(171, 71, 188, .12)",
        onPress: null
    },
    {
        id: "18",
        name: "Mental Health",
        icon: icons.brain,
        iconColor: "rgba(38, 166, 154, 1)", // Teal
        backgroundColor: "rgba(38, 166, 154, .12)",
        onPress: null
    },
    {
        id: "19",
        name: "Cancer Specialist",
        icon: icons.cancer,
        iconColor: "rgba(149, 117, 205, 1)", // Lavender
        backgroundColor: "rgba(149, 117, 205, .12)",
        onPress: null
    },
    {
        id: "20",
        name: "Liver Specialist",
        icon: icons.liver,
        iconColor: "rgba(198, 40, 40, 1)", // Dark Red
        backgroundColor: "rgba(198, 40, 40, .12)",
        onPress: null
    },
    // ... continues for all other categories with unique colors
    {
        id: "46",
        name: "Cardiologist",
        icon: icons.cardiologist,
        iconColor: "rgba(211, 47, 47, 1)", // Red
        backgroundColor: "rgba(211, 47, 47, .12)",
        onPress: null
    },
    {
        id: "47",
        name: "Dermatologist", // Corrected typo
        icon: icons.dermatology,
        iconColor: "rgba(255, 138, 101, 1)", // Coral
        backgroundColor: "rgba(255, 138, 101, .12)",
        onPress: null
    },
    {
        id: "48",
        name: "Neurologist", // Note: Duplicate name with id: 5
        icon: icons.brain,
        iconColor: "rgba(171, 71, 188, 1)", // Magenta
        backgroundColor: "rgba(171, 71, 188, .12)",
        onPress: null
    },
    {
        id: "49",
        name: "Psychiatrist",
        icon: icons.psychiatrist,
        iconColor: "rgba(0, 121, 107, 1)", // Dark Teal
        backgroundColor: "rgba(0, 121, 107, .12)",
        onPress: null
    },
    {
        id: "50",
        name: "ENT Surgeon",
        icon: icons.ent,
        iconColor: "rgba(255, 143, 0, 1)", // Amber
        backgroundColor: "rgba(255, 143, 0, .12)",
        onPress: "CategoryRadiologist"
    }
];

export const recommendedDoctors = [
    {
        id: "1",
        name: "Dr. Priya Sharma",
        type: "Cardiologist",
        image: images.doctor11,
        distance: "100 m",
        consultationFee: "₹1,500.00",
        rating: 4.8,
        numReviews: "1.2k",
        hospital: "Max Super Speciality Hospital",
        isAvailable: true,
        categoryId: "1"
    },
    {
        id: "2",
        name: "Dr. Priya Patel",
        type: "Dermatologist",
        image: images.doctor22,
        distance: "1.2 km",
        consultationFee: "₹1,000.00",
        rating: 4.9,
        numReviews: "1k",
        hospital: "Fortis Hospital",
        isAvailable: false,
        categoryId: "2"
    },
    {
        id: "3",
        name: "Dr. Anita Kumari",
        type: "Orthopedic Surgeon",
        image: images.doctor33,
        distance: "1.6 km",
        consultationFee: "₹2,000.00",
        rating: 4.5,
        numReviews: "800",
        hospital: "Apollo Hospital",
        isAvailable: true,
        categoryId: "1"
    },
    {
        id: "4",
        name: "Dr. Ananya Verma",
        type: "Pediatrician",
        image: images.doctor4,
        distance: "2.5 km",
        consultationFee: "₹1,000.00",
        rating: 4.7,
        numReviews: "900",
        hospital: "Children's Hospital",
        isAvailable: false,
        categoryId: "1",
    },
    {
        id: "5",
        name: "Dr. Vikram Reddy",
        type: "Gastroenterologist",
        image: images.doctor5,
        distance: "800 m",
        consultationFee: "₹1,500.00",
        rating: 4.6,
        numReviews: "1.1k",
        hospital: "Care Clinic",
        isAvailable: true,
        categoryId: "3",
    },
    {
        id: "6",
        name: "Dr. Mukesh Iyer",
        type: "Neurologist",
        image: images.doctor6,
        distance: "3.0 km",
        consultationFee: "₹8,00.00",
        rating: 4.8,
        numReviews: "1.5k",
        hospital: "Neurology Institute",
        isAvailable: true,
        categoryId: "1",
    },
    {
        id: "7",
        name: "Dr. Rajeev Malhotra",
        type: "Ophthalmologist",
        image: images.doctor7,
        distance: "2.0 km",
        consultationFee: "₹17,000.00",
        rating: 4.7,
        numReviews: "950",
        hospital: "Eye Care Clinic",
        isAvailable: false,
        categoryId: "1",
    },
    {
        id: "8",
        name: "Dr. Sneha Gupta",
        type: "Rheumatologist",
        image: images.doctor8,
        distance: "1.8 km",
        consultationFee: "₹17,500.00",
        rating: 4.9,
        numReviews: "1.4k",
        hospital: "Wellness Clinic",
        isAvailable: false,
        categoryId: "4",
    },
    {
        id: "9",
        name: "Dr. Manoj Sharma",
        type: "Pulmonologist",
        image: images.doctor9,
        distance: "1.4 km",
        consultationFee: "₹18,500.00",
        rating: 4.8,
        numReviews: "1.2k",
        hospital: "Respiratory Care Center",
        isAvailable: true,
        categoryId: "3",
    },
];


export const doctors = [
    {
        id: "1",
        name: "Dr. Aarav Sharma",
        type: "Cardiologist",
        image: images.doctor11,
        distance: "100 m",
        consultationFee: "₹14,500.00",
        rating: 4.8,
        numReviews: "1.2k",
        hospital: "Max Super Speciality Hospital",
        isAvailable: true,
        categoryId: "1"
    },
    {
        id: "2",
        name: "Dr. Priya Patel",
        type: "Dermatologist",
        image: images.doctor22,
        distance: "1.2 km",
        consultationFee: "₹11,000.00",
        rating: 4.9,
        numReviews: "1k",
        hospital: "Fortis Hospital",
        isAvailable: false,
        categoryId: "2"
    },
    {
        id: "3",
        name: "Dr. Rajesh Kumar",
        type: "Orthopedic Surgeon",
        image: images.doctor33,
        distance: "1.6 km",
        consultationFee: "₹22,000.00",
        rating: 4.5,
        numReviews: "800",
        hospital: "Apollo Hospital",
        isAvailable: true,
        categoryId: "1"
    },
    {
        id: "4",
        name: "Dr. Ananya Verma",
        type: "Pediatrician",
        image: images.doctor4,
        distance: "2.5 km",
        consultationFee: "₹15,000.00",
        rating: 4.7,
        numReviews: "900",
        hospital: "Children's Hospital",
        isAvailable: false,
        categoryId: "1",
    },
    {
        id: "5",
        name: "Dr. Vikram Reddy",
        type: "Gastroenterologist",
        image: images.doctor5,
        distance: "800 m",
        consultationFee: "₹16,500.00",
        rating: 4.6,
        numReviews: "1.1k",
        hospital: "Care Clinic",
        isAvailable: true,
        categoryId: "3",
    },
    {
        id: "6",
        name: "Dr. Neha Iyer",
        type: "Neurologist",
        image: images.doctor6,
        distance: "3.0 km",
        consultationFee: "₹18,000.00",
        rating: 4.8,
        numReviews: "1.5k",
        hospital: "Neurology Institute",
        isAvailable: true,
        categoryId: "1",
    },
    {
        id: "7",
        name: "Dr. Rajeev Malhotra",
        type: "Ophthalmologist",
        image: images.doctor7,
        distance: "2.0 km",
        consultationFee: "₹17,000.00",
        rating: 4.7,
        numReviews: "950",
        hospital: "Eye Care Clinic",
        isAvailable: false,
        categoryId: "1",
    },
    {
        id: "8",
        name: "Dr. Sneha Gupta",
        type: "Rheumatologist",
        image: images.doctor8,
        distance: "1.8 km",
        consultationFee: "₹17,500.00",
        rating: 4.9,
        numReviews: "1.4k",
        hospital: "Wellness Clinic",
        isAvailable: false,
        categoryId: "4",
    },
    {
        id: "9",
        name: "Dr. Manoj Sharma",
        type: "Pulmonologist",
        image: images.doctor9,
        distance: "1.4 km",
        consultationFee: "₹18,500.00",
        rating: 4.8,
        numReviews: "1.2k",
        hospital: "Respiratory Care Center",
        isAvailable: true,
        categoryId: "3",
    },
];


export const allDoctors = [
    {
        id: "1",
        name: "Dr. Aarav Sharma",
        type: "Cardiologist",
        image: images.doctor11,
        distance: "100 m",
        consultationFee: "₹14,500.00",
        rating: 4.8,
        numReviews: "1.2k",
        hospital: "Max Super Speciality Hospital",
        isAvailable: true,
        categoryId: "1"
    },
    {
        id: "2",
        name: "Dr. Priya Patel",
        type: "Dermatologist",
        image: images.doctor22,
        distance: "1.2 km",
        consultationFee: "₹11,000.00",
        rating: 4.9,
        numReviews: "1k",
        hospital: "Fortis Hospital",
        isAvailable: false,
        categoryId: "2"
    },
    {
        id: "3",
        name: "Dr. Rajesh Kumar",
        type: "Orthopedic Surgeon",
        image: images.doctor33,
        distance: "1.6 km",
        consultationFee: "₹22,000.00",
        rating: 4.5,
        numReviews: "800",
        hospital: "Apollo Hospital",
        isAvailable: true,
        categoryId: "1"
    },
    {
        id: "4",
        name: "Dr. Ananya Verma",
        type: "Pediatrician",
        image: images.doctor4,
        distance: "2.5 km",
        consultationFee: "₹15,000.00",
        rating: 4.7,
        numReviews: "900",
        hospital: "Children's Hospital",
        isAvailable: false,
        categoryId: "1",
    },
    {
        id: "5",
        name: "Dr. Vikram Reddy",
        type: "Gastroenterologist",
        image: images.doctor5,
        distance: "800 m",
        consultationFee: "₹16,500.00",
        rating: 4.6,
        numReviews: "1.1k",
        hospital: "Care Clinic",
        isAvailable: true,
        categoryId: "3",
    },
    {
        id: "6",
        name: "Dr. Neha Iyer",
        type: "Neurologist",
        image: images.doctor6,
        distance: "3.0 km",
        consultationFee: "₹18,000.00",
        rating: 4.8,
        numReviews: "1.5k",
        hospital: "Neurology Institute",
        isAvailable: true,
        categoryId: "1",
    },
    {
        id: "7",
        name: "Dr. Rajeev Malhotra",
        type: "Ophthalmologist",
        image: images.doctor7,
        distance: "2.0 km",
        consultationFee: "₹17,000.00",
        rating: 4.7,
        numReviews: "950",
        hospital: "Eye Care Clinic",
        isAvailable: false,
        categoryId: "1",
    },
    {
        id: "8",
        name: "Dr. Sneha Gupta",
        type: "Rheumatologist",
        image: images.doctor8,
        distance: "1.8 km",
        consultationFee: "₹17,500.00",
        rating: 4.9,
        numReviews: "1.4k",
        hospital: "Wellness Clinic",
        isAvailable: false,
        categoryId: "4",
    },
    {
        id: "9",
        name: "Dr. Manoj Sharma",
        type: "Pulmonologist",
        image: images.doctor9,
        distance: "1.4 km",
        consultationFee: "₹18,500.00",
        rating: 4.8,
        numReviews: "1.2k",
        hospital: "Respiratory Care Center",
        isAvailable: true,
        categoryId: "3",
    },
];


export const myFavouriteDoctors = [
    {
        id: "1",
        name: "Dr. Aarav Sharma",
        type: "Cardiologist",
        image: images.doctor11,
        distance: "100 m",
        consultationFee: "₹14,500.00",
        rating: 4.8,
        numReviews: "1.2k",
        hospital: "Max Super Speciality Hospital",
        isAvailable: true,
        categoryId: "1"
    },
    {
        id: "2",
        name: "Dr. Priya Patel",
        type: "Dermatologist",
        image: images.doctor22,
        distance: "1.2 km",
        consultationFee: "₹11,000.00",
        rating: 4.9,
        numReviews: "1k",
        hospital: "Fortis Hospital",
        isAvailable: false,
        categoryId: "2"
    },
    {
        id: "3",
        name: "Dr. Rajesh Kumar",
        type: "Orthopedic Surgeon",
        image: images.doctor33,
        distance: "1.6 km",
        consultationFee: "₹22,000.00",
        rating: 4.5,
        numReviews: "800",
        hospital: "Apollo Hospital",
        isAvailable: true,
        categoryId: "1"
    },
    {
        id: "4",
        name: "Dr. Ananya Verma",
        type: "Pediatrician",
        image: images.doctor4,
        distance: "2.5 km",
        consultationFee: "₹15,000.00",
        rating: 4.7,
        numReviews: "900",
        hospital: "Children's Hospital",
        isAvailable: false,
        categoryId: "1",
    },
    {
        id: "5",
        name: "Dr. Vikram Reddy",
        type: "Gastroenterologist",
        image: images.doctor5,
        distance: "800 m",
        consultationFee: "₹16,500.00",
        rating: 4.6,
        numReviews: "1.1k",
        hospital: "Care Clinic",
        isAvailable: true,
        categoryId: "3",
    },
    {
        id: "6",
        name: "Dr. Neha Iyer",
        type: "Neurologist",
        image: images.doctor6,
        distance: "3.0 km",
        consultationFee: "₹18,000.00",
        rating: 4.8,
        numReviews: "1.5k",
        hospital: "Neurology Institute",
        isAvailable: true,
        categoryId: "1",
    },
    {
        id: "7",
        name: "Dr. Rajeev Malhotra",
        type: "Ophthalmologist",
        image: images.doctor7,
        distance: "2.0 km",
        consultationFee: "₹17,000.00",
        rating: 4.7,
        numReviews: "950",
        hospital: "Eye Care Clinic",
        isAvailable: false,
        categoryId: "1",
    },
    {
        id: "8",
        name: "Dr. Sneha Gupta",
        type: "Rheumatologist",
        image: images.doctor8,
        distance: "1.8 km",
        consultationFee: "₹17,500.00",
        rating: 4.9,
        numReviews: "1.4k",
        hospital: "Wellness Clinic",
        isAvailable: false,
        categoryId: "4",
    },
    {
        id: "9",
        name: "Dr. Manoj Sharma",
        type: "Pulmonologist",
        image: images.doctor9,
        distance: "1.4 km",
        consultationFee: "₹18,500.00",
        rating: 4.8,
        numReviews: "1.2k",
        hospital: "Respiratory Care Center",
        isAvailable: true,
        categoryId: "3",
    },
];


export const notifications = [
    {
        id: "1",
        icon: icons.chat,
        title: "Dr. Smith sent you a message",
        description: "Tap to see the message",
        date: "2024-01-16T04:52:06.501Z"
    },
    {
        id: "2",
        icon: icons.appointment,
        title: "Appointment Confirmed!",
        description: "Your appointment with Dr. Brown on Jan 25, 2024, is confirmed. See you soon!",
        date: "2024-01-23T04:52:06.501Z"
    },
    {
        id: "3",
        icon: icons.update,
        title: "New Health Services Available!",
        description: "Check out the new health services now available in our app.",
        date: "2024-01-23T08:52:06.501Z"
    },
    {
        id: "4",
        icon: icons.discount,
        title: "Get 20% Discount on Your Next Appointment!",
        description: "Book now and get a 20% discount on your next appointment.",
        date: "2024-01-28T08:52:06.501Z"
    },
    {
        id: "5",
        icon: icons.services,
        title: "New Specialists Available!",
        description: "We have added new specialists to our team. Book an appointment now!",
        date: "2024-01-29T08:52:06.501Z"
    },
    {
        id: "6",
        icon: icons.payment,
        title: "Payment Method Successfully Linked!",
        description: "Your credit card has been successfully linked to your account.",
        date: "2024-01-23T04:52:06.501Z"
    },
    {
        id: "7",
        icon: icons.chat,
        title: "Dr. Johnson sent you a message",
        description: "Tap to see the message",
        date: "2024-01-16T04:52:06.501Z"
    },
    {
        id: "8",
        icon: icons.chat,
        title: "Dr. Lee sent you a message",
        description: "Tap to see the message",
        date: "2024-01-16T04:52:06.501Z"
    },
    {
        id: "9",
        icon: icons.chat,
        title: "Dr. Wilson sent you a message",
        description: "Tap to see the message",
        date: "2024-01-16T04:52:06.501Z"
    },
    {
        id: "10",
        icon: icons.setup,
        title: "Account Setup Successfully",
        description: "Your account has been successfully created!",
        date: "2024-01-28T04:52:06.501Z"
    },
    {
        id: "11",
        icon: icons.discount,
        title: "Get 50% Discount on Your First Appointment!",
        description: "Book your first appointment now and get a 50% discount.",
        date: "2024-01-28T08:52:06.501Z"
    },
    {
        id: "12",
        icon: icons.chat,
        title: "Dr. Martinez sent you a message",
        description: "Tap to see the message",
        date: "2024-01-31T04:52:06.501Z"
    },
];

export const ratings = [
    {
        id: "1",
        title: "All"
    },
    {
        id: "6",
        title: "5"
    },
    {
        id: "5",
        title: "4"
    },
    {
        id: "4",
        title: "3"
    },
    {
        id: "3",
        title: "2"
    },
    {
        id: "2",
        title: "1"
    }
];

export const doctorReviews = [
    {
        id: "1",
        avatar: images.user1,
        name: "Aarav Singh",
        description: "Dr. Jenny exceeded my expectations! The clinic was outstanding and the staff was exceptionally helpful. Highly recommended! 😍",
        rating: 4.8,
        avgRating: 5,
        date: "2024-01-23T04:52:06.501Z",
        numLikes: 948
    },
    {
        id: "2",
        avatar: images.user2,
        name: "Rhea Kapoor",
        description: "Visiting Dr. Jenny was an unforgettable experience. The ambiance was perfect and I thoroughly appreciated the care I received.",
        rating: 4.7,
        avgRating: 5,
        date: "2024-01-23T04:52:06.501Z",
        numLikes: 120
    },
    {
        id: "3",
        avatar: images.user3,
        name: "Sophia Reddy",
        description: "Absolutely amazing doctor! The consultation and facilities were top-notch. I'll definitely be returning!",
        rating: 4.7,
        avgRating: 5,
        date: "2024-01-29T04:52:06.501Z",
        numLikes: 89
    },
    {
        id: "4",
        avatar: images.user4,
        name: "Arjun Deshmukh",
        description: "I thoroughly enjoyed my visit to Dr. Jenny. Everything was well-coordinated, and the care was outstanding.",
        rating: 4,
        avgRating: 4,
        date: "2024-01-29T04:52:06.501Z",
        numLikes: 384
    },
    {
        id: "5",
        avatar: images.user5,
        name: "Ishita Sharma",
        description: "Seeing Dr. Jenny was a delightful experience. The clinic was fantastic, and the atmosphere was comforting. Highly recommend!",
        rating: 4.3,
        avgRating: 4,
        date: "2024-01-29T04:52:06.501Z",
        numLikes: 738
    },
    {
        id: "6",
        avatar: images.user6,
        name: "Raghav Mehta",
        description: "Kudos to Dr. Jenny and the team! The arrangements were impeccable, and I had a fantastic consultation.",
        rating: 4.8,
        avgRating: 5,
        date: "2024-01-29T04:52:06.501Z",
        numLikes: 12
    },
    {
        id: "7",
        avatar: images.user7,
        name: "Isabella Yadav",
        description: "My visit to Dr. Jenny was absolutely phenomenal! I was impressed by the thoroughness and the overall care. Can't wait for the next appointment!",
        rating: 4.9,
        avgRating: 5,
        date: "2024-01-29T04:52:06.501Z",
        numLikes: 450
    }
];


export const hoursData = [
    {
        id: "1",
        hour: "09:00 AM"
    },
    {
        id: "2",
        hour: "10:00 AM"
    },
    {
        id: "3",
        hour: "11:00 AM"
    },
    {
        id: "4",
        hour: "12:00 PM"
    },
    {
        id: "5",
        hour: "02:00 PM"
    },
    {
        id: "6",
        hour: "03:00 PM"
    },
    {
        id: "7",
        hour: "04:00 PM"
    },
    {
        id: "8",
        hour: "05:00 PM"
    },
    {
        id: "9",
        hour: "06:00 PM"
    },
    {
        id: "10",
        hour: "07:00 PM"
    },
    {
        id: "11",
        hour: "08:00 PM"
    },
    {
        id: "12",
        hour: "09:00 PM"
    },

];

export const upcomingAppointments = [
    {
        id: 6,
        status: "Scheduled",
        date: "20 Feb, 1:00 PM",
        appointmentType: 'Orthopedic Consultation',
        doctor: "Dr. Aarav Sharma",
        image: images.doctor6,
        fee: 199.99,
        address: "567 Cedar St, Countryside Orthopedics",
        hasRemindMe: true,
        rating: 4.9,
        package: "Messaging"
    },
    {
        id: 7,
        status: "Scheduled",
        date: "21 Feb, 10:30 AM",
        appointmentType: 'Psychiatry Session',
        doctor: "Dr. Priya Verma",
        image: images.doctor7,
        fee: 79.99,
        address: "890 Oakwood Dr, Riverside Wellness Center",
        hasRemindMe: true,
        rating: 4.9,
        package: "Voice Call"
    },
    {
        id: 8,
        status: "Scheduled",
        date: "22 Feb, 4:00 PM",
        appointmentType: 'Nutrition Consultation',
        doctor: "Dr. Rajesh Patel",
        image: images.doctor8,
        fee: 59.99,
        address: "123 Pinecone Ln, Lakeside Health Clinic",
        hasRemindMe: true,
        rating: 4.9,
        package: "Messaging"
    },
    {
        id: 9,
        status: "Scheduled",
        date: "23 Feb, 12:00 PM",
        appointmentType: 'Optometry Exam',
        doctor: "Dr. Meera Joshi",
        image: images.doctor9,
        fee: 299.99,
        address: "456 Redwood Rd, Mountainview Eye Center",
        hasRemindMe: true,
        rating: 4.6,
        package: "Video Call"
    },
    {
        id: 1,
        status: "Scheduled",
        date: "15 Feb, 10:00 AM",
        appointmentType: 'General Checkup',
        doctor: "Dr. Ramesh Gupta",
        image: images.doctor1,
        fee: 89.99,
        address: "123 Main St, Cityville Medical Center",
        hasRemindMe: true,
        rating: 4.9,
        package: "Voice Call"
    },
    {
        id: 2,
        status: "Scheduled",
        date: "16 Feb, 2:00 PM",
        appointmentType: 'Dermatology Consultation',
        doctor: "Dr. Anjali Desai",
        image: images.doctor2,
        fee: 49.99,
        address: "456 Oak St, Townsville Clinic",
        hasRemindMe: true,
        rating: 4.7,
        package: "Video Call"
    },
    {
        id: 3,
        status: "Scheduled",
        date: "17 Feb, 9:00 AM",
        appointmentType: 'Dental Cleaning',
        doctor: "Dr. Neha Reddy",
        image: images.doctor3,
        fee: 69.99,
        address: "789 Pine St, Villagetown Dental",
        hasRemindMe: true,
        rating: 4.8,
        package: "Messaging"
    },
    {
        id: 4,
        status: "Scheduled",
        date: "18 Feb, 3:00 PM",
        appointmentType: 'Cardiology Checkup',
        doctor: "Dr. Mohan Kumar",
        image: images.doctor4,
        fee: 149.99,
        address: "910 Elm St, Hamlet Heart Center",
        hasRemindMe: true,
        rating: 4.7,
        package: "Video Call"
    },
    {
        id: 5,
        status: "Scheduled",
        date: "19 Feb, 11:00 AM",
        appointmentType: 'Pediatric Consultation',
        doctor: "Dr. Aarti Mehta",
        image: images.doctor5,
        fee: 99.99,
        address: "321 Maple St, Suburbia Pediatric Clinic",
        hasRemindMe: true,
        rating: 4.9,
        package: "Voice Call"
    }
];


export const completedAppointments = [
    {
        id: 1,
        status: "Completed",
        date: "12 Feb, 11:30 AM",
        appointmentType: 'Dermatology Consultation',
        doctor: "Dr. Jane Doe",
        image: images.doctor5,
        fee: 129.99,
        address: "789 Pine St, Villagetown Clinic",
        hasRemindMe: false,
        rating: 4.9,
        package: "Messaging"
    },
    {
        id: 8,
        status: "Completed",
        date: "21 Feb, 3:30 PM",
        appointmentType: 'Psychiatry Session',
        doctor: "Dr. Patricia Davis",
        image: images.doctor6,
        fee: 299.99,
        address: "789 Elmwood Ave, Lakeshore Wellness Center",
        hasRemindMe: false,
        rating: 4.7,
        package: "Video Call"
    },
    {
        id: 3,
        status: "Completed",
        date: "16 Feb, 1:30 PM",
        appointmentType: 'Cardiology Checkup',
        doctor: "Dr. Michael Brown",
        image: images.doctor6,
        fee: 349.99,
        address: "321 Maple St, Suburbia Heart Clinic",
        hasRemindMe: false,
        rating: 4.7,
        package: "Video Call"
    },
    {
        id: 4,
        status: "Completed",
        date: "17 Feb, 12:00 PM",
        appointmentType: 'Nutrition Consultation',
        doctor: "Dr. Kevin Wilson",
        image: images.doctor7,
        fee: 499.99,
        address: "567 Cedar St, Countryside Health Center",
        hasRemindMe: false,
        rating: 4.9,
        package: "Voice Call"
    },
    {
        id: 5,
        status: "Completed",
        date: "18 Feb, 2:30 PM",
        appointmentType: 'Optometry Exam',
        doctor: "Dr. Linda Martinez",
        image: images.doctor3,
        fee: 79.99,
        address: "890 Oakwood Dr, Riverside Eye Clinic",
        hasRemindMe: false,
        rating: 4.6,
        package: "Messaging"
    },
    {
        id: 6,
        status: "Completed",
        date: "19 Feb, 11:30 AM",
        appointmentType: 'Orthopedic Consultation',
        doctor: "Dr. William Johnson",
        image: images.doctor4,
        fee: 129.99,
        address: "123 Pinecone Ln, Lakeside Orthopedics",
        hasRemindMe: false,
        rating: 4.9,
        package: "Messaging"
    },
    {
        id: 7,
        status: "Completed",
        date: "20 Feb, 10:00 AM",
        appointmentType: 'General Checkup',
        doctor: "Dr. John Smith",
        image: images.doctor5,
        fee: 39.99,
        address: "456 Redwood Rd, Mountainview Medical Center",
        hasRemindMe: false,
        rating: 4.9,
        package: "Voice Call"
    },
    {
        id: 9,
        status: "Completed",
        date: "22 Feb, 2:00 PM",
        appointmentType: 'Dental Cleaning',
        doctor: "Dr. Emily White",
        image: images.doctor7,
        fee: 159.99,
        address: "910 Birch St, Brookside Dental",
        hasRemindMe: false,
        rating: 4.8,
        package: "Voice Call"
    },
    {
        id: 2,
        status: "Completed",
        date: "14 Feb, 3:00 PM",
        appointmentType: 'Pediatric Consultation',
        doctor: "Dr. Sarah Green",
        image: images.doctor3,
        fee: 199.99,
        address: "910 Elm St, Hamlet Pediatric Center",
        hasRemindMe: false,
        rating: 4.6,
        package: "Video Call"
    },
];

export const cancelledAppointments = [
    {
        id: 3,
        status: "Cancelled",
        date: "15 Feb, 11:30 AM",
        appointmentType: 'Psychiatry Session',
        doctor: "Dr. Patricia Davis",
        image: images.doctor4,
        fee: 149.99,
        address: "789 Elmwood Ave, Lakeshore Wellness Center",
        hasRemindMe: false,
        rating: 4.8,
        package: "Voice Call"
    },
    {
        id: 4,
        status: "Cancelled",
        date: "16 Feb, 3:30 PM",
        appointmentType: 'Nutrition Consultation',
        doctor: "Dr. Kevin Wilson",
        image: images.doctor5,
        fee: 69.99,
        address: "123 Main St, Cityville Health Clinic",
        hasRemindMe: false,
        rating: 4.5,
        package: "Video Call"
    },
    {
        id: 5,
        status: "Cancelled",
        date: "17 Feb, 1:00 PM",
        appointmentType: 'Orthopedic Consultation',
        doctor: "Dr. William Johnson",
        image: images.doctor7,
        fee: 199.99,
        address: "456 Oak St, Townsville Orthopedics",
        hasRemindMe: false,
        rating: 4.9,
        package: "Messaging"
    },
    {
        id: 6,
        status: "Cancelled",
        date: "18 Feb, 10:00 AM",
        appointmentType: 'Dermatology Consultation',
        doctor: "Dr. Jane Doe",
        image: images.doctor8,
        fee: 79.99,
        address: "789 Pine St, Villagetown Clinic",
        hasRemindMe: false,
        rating: 4.9,
        package: "Video Call"
    },
    {
        id: 7,
        status: "Cancelled",
        date: "19 Feb, 2:30 PM",
        appointmentType: 'Pediatric Consultation',
        doctor: "Dr. Sarah Green",
        image: images.doctor9,
        fee: 59.99,
        address: "910 Elm St, Hamlet Pediatric Center",
        hasRemindMe: false,
        rating: 4.9,
        package: "Messaging"
    },
    {
        id: 8,
        status: "Cancelled",
        date: "20 Feb, 12:00 PM",
        appointmentType: 'Cardiology Checkup',
        doctor: "Dr. Michael Brown",
        image: images.doctor5,
        fee: 299.99,
        address: "321 Maple St, Suburbia Heart Clinic",
        hasRemindMe: false,
        rating: 4.9,
        package: "Video Call"
    },
    {
        id: 9,
        status: "Cancelled",
        date: "21 Feb, 9:30 AM",
        appointmentType: 'Dental Cleaning',
        doctor: "Dr. Emily White",
        image: images.doctor7,
        fee: 99.99,
        address: "567 Cedar St, Countryside Dental",
        hasRemindMe: false,
        rating: 4.9,
        package: "Voice Call"
    },
    {
        id: 1,
        status: "Cancelled",
        date: "13 Feb, 9:00 AM",
        appointmentType: 'Optometry Exam',
        doctor: "Dr. Linda Martinez",
        image: images.doctor1,
        fee: 79.99,
        address: "321 Maple St, Suburbia Eye Clinic",
        hasRemindMe: false,
        rating: 4.9,
        package: "Messaging"
    },
    {
        id: 2,
        status: "Cancelled",
        date: "14 Feb, 2:00 PM",
        appointmentType: 'General Checkup',
        doctor: "Dr. John Smith",
        image: images.doctor3,
        fee: 99.99,
        address: "567 Cedar St, Countryside Medical Center",
        hasRemindMe: false,
        rating: 4.7,
        package: "Messaging"
    }
];


export const messagesData = [
    {
        id: "1",
        fullName: "Dr. John Smith",
        isOnline: false,
        userImg: images.doctor1,
        lastSeen: "2023-11-16T04:52:06.501Z",
        lastMessage: 'Your appointment is confirmed for 10:00 AM tomorrow.',
        messageInQueue: 2,
        lastMessageTime: "12:25 PM",
        isOnline: true,
    },
    {
        id: "2",
        fullName: "Dr. Anuska Sharma",
        isOnline: false,
        userImg: images.doctor2,
        lastSeen: "2023-11-18T04:52:06.501Z",
        lastMessage: 'Please remember to fast for 12 hours before your blood test.',
        messageInQueue: 0,
        lastMessageTime: "12:15 PM",
        isOnline: false
    },
    {
        id: "3",
        fullName: "Dr. Virat Kohli",
        isOnline: false,
        userImg: images.doctor3,
        lastSeen: "2023-11-20T04:52:06.501Z",
        lastMessage: 'We have rescheduled your appointment to next Monday.',
        messageInQueue: 0,
        lastMessageTime: "09:12 PM",
        isOnline: true
    },
    {
        id: "4",
        fullName: "Dr. Shikhar Dhawan",
        isOnline: false,
        userImg: images.doctor4,
        lastSeen: "2023-11-18T04:52:06.501Z",
        lastMessage: 'Your lab results are ready. Please check your patient portal.',
        messageInQueue: 0,
        lastMessageTime: "04:12 PM",
        isOnline: true
    },
    {
        id: "5",
        fullName: "Dr. Shakib Hasan",
        isOnline: false,
        userImg: images.doctor5,
        lastSeen: "2023-11-21T04:52:06.501Z",
        lastMessage: 'Thank you for visiting our clinic.',
        messageInQueue: 2,
        lastMessageTime: "10:30 AM",
        isOnline: true
    },
    {
        id: "6",
        fullName: "Dr. Jackson Lee",
        isOnline: false,
        userImg: images.doctor6,
        lastSeen: "2023-11-20T04:52:06.501Z",
        lastMessage: 'Would you like to reschedule your missed appointment?',
        messageInQueue: 3,
        lastMessageTime: "10:05 PM",
        isOnline: false
    },
    {
        id: "7",
        fullName: "Dr. Tom Jerry",
        isOnline: false,
        userImg: images.doctor7,
        lastSeen: "2023-11-20T04:52:06.501Z",
        lastMessage: 'Please confirm your appointment for tomorrow.',
        messageInQueue: 2,
        lastMessageTime: "11:05 PM",
        isOnline: true
    },
    {
        id: "8",
        fullName: "Dr. Lucky Luke",
        isOnline: false,
        userImg: images.doctor8,
        lastSeen: "2023-11-20T04:52:06.501Z",
        lastMessage: 'Can you provide your previous medical records?',
        messageInQueue: 2,
        lastMessageTime: "09:11 PM",
        isOnline: true
    },
    {
        id: "9",
        fullName: "Dr. Nate Jack",
        isOnline: false,
        userImg: images.doctor9,
        lastSeen: "2023-11-20T04:52:06.501Z",
        lastMessage: 'What symptoms are you experiencing?',
        messageInQueue: 0,
        lastMessageTime: "06:43 PM",
        isOnline: true
    }
];


export const voiceCallData = [
    {
        id: "3",
        name: "Dr. Aarav Sharma",
        image: images.doctor4,
        type: "Voice Call",
        date: "Dec 07, 2024",
        time: "14:30 PM"
    },
    {
        id: "4",
        name: "Dr. Priya Patel",
        image: images.doctor5,
        type: "Voice Call",
        date: "Dec 08, 2024",
        time: "16:00 PM"
    },
    {
        id: "5",
        name: "Dr. Ananya Gupta",
        image: images.doctor7,
        type: "Voice Call",
        date: "Dec 09, 2024",
        time: "11:00 AM"
    },
    {
        id: "6",
        name: "Dr. Rajesh Reddy",
        image: images.doctor8,
        type: "Voice Call",
        date: "Dec 10, 2024",
        time: "09:00 AM"
    },
    {
        id: "7",
        name: "Dr. Neha Verma",
        image: images.doctor8,
        type: "Voice Call",
        date: "Dec 11, 2024",
        time: "13:00 PM"
    },
    {
        id: "8",
        name: "Dr. Arjun Kumar",
        image: images.doctor9,
        type: "Voice Call",
        date: "Dec 12, 2024",
        time: "15:30 PM"
    },
    {
        id: "9",
        name: "Dr. Radhika Mehta",
        image: images.doctor1,
        type: "Voice Call",
        date: "Dec 13, 2024",
        time: "17:00 PM"
    },
    {
        id: "1",
        name: "Dr. Sanya Kapoor",
        image: images.doctor1,
        type: "Voice Call",
        date: "Dec 05, 2024",
        time: "19:00 PM"
    },
    {
        id: "2",
        name: "Dr. Vikram Singh",
        image: images.doctor3,
        type: "Voice Call",
        date: "Dec 06, 2024",
        time: "10:00 AM"
    },
];


export const videoCallData = [
    {
        id: "7",
        name: "Dr. Neha Verma",
        image: images.doctor8,
        type: "Video Call",
        date: "Dec 11, 2024",
        time: "13:00 PM"
    },
    {
        id: "8",
        name: "Dr. Arjun Kumar",
        image: images.doctor9,
        type: "Video Call",
        date: "Dec 12, 2024",
        time: "15:30 PM"
    },
    {
        id: "3",
        name: "Dr. Ananya Gupta",
        image: images.doctor4,
        type: "Video Call",
        date: "Dec 07, 2024",
        time: "14:30 PM"
    },
    {
        id: "4",
        name: "Dr. Priya Patel",
        image: images.doctor5,
        type: "Video Call",
        date: "Dec 08, 2024",
        time: "16:00 PM"
    },
    {
        id: "5",
        name: "Dr. Radhika Mehta",
        image: images.doctor6,
        type: "Video Call",
        date: "Dec 09, 2024",
        time: "11:00 AM"
    },
    {
        id: "6",
        name: "Dr. Rajesh Reddy",
        image: images.doctor7,
        type: "Video Call",
        date: "Dec 10, 2024",
        time: "09:00 AM"
    },
    {
        id: "9",
        name: "Dr. Sanya Kapoor",
        image: images.doctor3,
        type: "Video Call",
        date: "Dec 13, 2024",
        time: "17:00 PM"
    },
    {
        id: "1",
        name: "Dr. Vikram Singh",
        image: images.doctor1,
        type: "Video Call",
        date: "Dec 05, 2024",
        time: "19:00 PM"
    },
    {
        id: "2",
        name: "Dr. Aarav Sharma",
        image: images.doctor3,
        type: "Video Call",
        date: "Dec 06, 2024",
        time: "10:00 AM"
    },
];



export const news = [
    {
        id: "1",
        title: "Adding Salt to Your Food May Increase Risk of Pre...",
        image: images.news1,
        category: "Food",
        date: "Dec 22, 2024",
        categoryId: "1"
    },
    {
        id: "2",
        title: "COVID-24 Was a Top Cause of Death in 2024 and 2025, Even For Younger People",
        image: images.news2,
        category: "Health",
        date: "Dec 22, 2024",
        categoryId: "2"
    },
    {
        id: "3",
        title: "Study Finds Being 'Hangry' is a Real Thing",
        image: images.news3,
        category: "Health",
        date: "Dec 23, 2024",
        categoryId: "1"
    },
    {
        id: "4",
        title: "Why Childhood Obesity Rates Are Rising and What We Can Do",
        image: images.news4,
        category: "Lifestyle",
        date: "Dec 23, 2024",
        categoryId: "3"
    },
    {
        id: "5",
        title: "How to Make a Healthy Breakfast",
        image: images.news5,
        category: "Food",
        date: "Dec 23, 2024",
        categoryId: "1"
    },
    {
        id: "6",
        title: "Depression Treatment: How Genetic Testing Can Help Find the Right Medication",
        image: images.news6,
        category: "Medical",
        date: "Dec 23, 2024",
        categoryId: "2"
    },
    {
        id: "7",
        title: "Drinking Alone as a Teen May Foreshadow Future Alcohol Problems",
        image: images.news7,
        category: "Health",
        date: "Dec 23, 2024",
        categoryId: "1"
    },
    {
        id: "8",
        title: "Reconnecting with Old Friends May Boost Your Mental Health — and Theirs",
        image: images.news8,
        category: "Lifestyle",
        date: "Dec 23, 2024",
        categoryId: "3"
    },
    {
        id: "8",
        title: "Researchers Report Fewer Relapses in Multiple Sclerosis with Off-Label Drug",
        image: images.news9,
        category: "Health",
        date: "Dec 23, 2024",
        categoryId: "4"
    }
];

export const newsCategories = [
    {
        id: "0",
        name: "All",
    },
    {
        id: "1",
        name: "Health",
    },
    {
        id: "2",
        name: "LifeStyle",
    },
    {
        id: "3",
        name: "Relationship",
    },
    {
        id: "4",
        name: "Medical",
    },
    {
        id: "5",
        name: "Pharmacy",
    },
    {
        id: "6",
        name: "Surgery",
    },
    {
        id: "7",
        name: "Pediatrics",
    }
];

export const recommendedNews = [
    {
        id: "0",
        title: "Adding Salt to Your Food May Increase Risk of Pre...",
        image: images.news1,
        category: "Food",
        date: "Dec 22, 2024",
        categoryId: "1"
    },
    {
        id: "1",
        title: "COVID-24 Was a Top Cause of Death in 2024 and 2025,",
        image: images.news2,
        category: "Health",
        date: "Dec 22, 2024",
        categoryId: "2"
    },
    {
        id: "2",
        title: "Study Finds Being 'Hangry' is a Real Thing",
        image: images.news3,
        category: "Health",
        date: "Dec 23, 2024",
        categoryId: "1"
    },
    {
        id: "3",
        title: "Why Childhood Obesity Rates Are Rising and What We Can Do",
        image: images.news4,
        category: "Lifestyle",
        date: "Dec 23, 2024",
        categoryId: "3"
    },
    {
        id: "4",
        title: "How to Make a Healthy Breakfast",
        image: images.news5,
        category: "Food",
        date: "Dec 23, 2024",
        categoryId: "1"
    },
    {
        id: "5",
        title: "How Genetic Testing Can Help Find the Right Medication",
        image: images.news6,
        category: "Medical",
        date: "Dec 23, 2024",
        categoryId: "2"
    },
    {
        id: "6",
        title: "Drinking Alone as a Teen May Foreshadow Future Alcohol Problems",
        image: images.news7,
        category: "Health",
        date: "Dec 23, 2024",
        categoryId: "1"
    },
    {
        id: "7",
        title: "Reconnecting with Old Friends May Boost Your Mental Health",
        image: images.news8,
        category: "Lifestyle",
        date: "Dec 23, 2024",
        categoryId: "3"
    },
    {
        id: "8",
        title: "Researchers Report Fewer Relapses in Multiple Sclerosis",
        image: images.news9,
        category: "Health",
        date: "Dec 23, 2024",
        categoryId: "4"
    }
];

export const trendingNews = [
    {
        id: "0",
        title: "Adding Salt to Your Food May Increase Risk of Pre...",
        image: images.news1,
        category: "Food",
        date: "Dec 22, 2024",
        categoryId: "1"
    },
    {
        id: "1",
        title: "COVID-24 Was a Top Cause of Death in 2024 and 2025,",
        image: images.news2,
        category: "Health",
        date: "Dec 22, 2024",
        categoryId: "2"
    },
    {
        id: "2",
        title: "Study Finds Being 'Hangry' is a Real Thing",
        image: images.news3,
        category: "Health",
        date: "Dec 23, 2024",
        categoryId: "1"
    },
    {
        id: "3",
        title: "Why Childhood Obesity Rates Are Rising and What We Can Do",
        image: images.news4,
        category: "Lifestyle",
        date: "Dec 23, 2024",
        categoryId: "3"
    },
    {
        id: "4",
        title: "How to Make a Healthy Breakfast",
        image: images.news5,
        category: "Food",
        date: "Dec 23, 2024",
        categoryId: "1"
    },
    {
        id: "5",
        title: "How Genetic Testing Can Help Find the Right Medication",
        image: images.news6,
        category: "Medical",
        date: "Dec 23, 2024",
        categoryId: "2"
    },
    {
        id: "6",
        title: "Drinking Alone as a Teen May Foreshadow Future Alcohol Problems",
        image: images.news7,
        category: "Health",
        date: "Dec 23, 2024",
        categoryId: "1"
    },
    {
        id: "7",
        title: "Reconnecting with Old Friends May Boost Your Mental Health",
        image: images.news8,
        category: "Lifestyle",
        date: "Dec 23, 2024",
        categoryId: "3"
    },
    {
        id: "8",
        title: "Researchers Report Fewer Relapses in Multiple Sclerosis",
        image: images.news9,
        category: "Health",
        date: "Dec 23, 2024",
        categoryId: "4"
    }
];

export const myBookmarkedArticles = [
    {
        id: "0",
        title: "Adding Salt to Your Food May Increase Risk of Pre...",
        image: images.news1,
        category: "Food",
        date: "Dec 22, 2024",
        categoryId: "1"
    },
    {
        id: "1",
        title: "COVID-24 Was a Top Cause of Death in 2024 and 2025,",
        image: images.news2,
        category: "Health",
        date: "Dec 22, 2024",
        categoryId: "2"
    },
    {
        id: "2",
        title: "Study Finds Being 'Hangry' is a Real Thing",
        image: images.news3,
        category: "Health",
        date: "Dec 23, 2024",
        categoryId: "1"
    },
    {
        id: "3",
        title: "Why Childhood Obesity Rates Are Rising and What We Can Do",
        image: images.news4,
        category: "Lifestyle",
        date: "Dec 23, 2024",
        categoryId: "3"
    },
    {
        id: "4",
        title: "How to Make a Healthy Breakfast",
        image: images.news5,
        category: "Food",
        date: "Dec 23, 2024",
        categoryId: "1"
    },
    {
        id: "5",
        title: "How Genetic Testing Can Help Find the Right Medication",
        image: images.news6,
        category: "Medical",
        date: "Dec 23, 2024",
        categoryId: "2"
    },
    {
        id: "6",
        title: "Drinking Alone as a Teen May Foreshadow Future Alcohol Problems",
        image: images.news7,
        category: "Health",
        date: "Dec 23, 2024",
        categoryId: "1"
    },
    {
        id: "7",
        title: "Reconnecting with Old Friends May Boost Your Mental Health",
        image: images.news8,
        category: "Lifestyle",
        date: "Dec 23, 2024",
        categoryId: "3"
    },
    {
        id: "8",
        title: "Researchers Report Fewer Relapses in Multiple Sclerosis",
        image: images.news9,
        category: "Health",
        date: "Dec 23, 2024",
        categoryId: "4"
    }
];

export const userAddresses = [
    {
        id: "1",
        name: "Home",
        address: "364 Stillwater Ave, Attleboro, MA 02703",
    },
    {
        id: "2",
        name: "Office",
        address: "73 Virginia Rd, Cuyahoga Falls, OH 44221",
    },
    {
        id: "3",
        name: "Mall Plaza",
        address: "123 Main St, San Francisco, CA 94107",
    },
    {
        id: "4",
        name: "Garden Park",
        address: "600 Bloom St, Portland, OR 97201",
    },
    {
        id: "5",
        name: "Grand City Park",
        address: "26 State St Daphne, AL 36526"
    },
    {
        id: "6",
        name: "Town Square",
        address: "20 Applegate St. Hoboken, NJ 07030"
    },
    {
        id: "7",
        name: "Bank",
        address: "917 W Pine Street Easton, PA 0423"
    }
];
