import destination from '@/assets/images/destination.png'

export const itinerary = [
    {
        day: 1,
        title: "Arrive at Govindghat (1828 m.)",
        description:
            "Arrive at Govindghat and have an overnight stay at the hotel. Govindghat is located in Chamoli district of Uttarakhand, India. Jolly Grant Airport in Dehradun is the nearest airport to Govindghat which is situated at a distance of approximately 292 km. The nearest railway station to Govindghat is Rishikesh on NH 58 at a height of around 5,500 feet. Govindghat is visited by many pilgrims on Chardham Yatra, so it is a major place for the accommodation of the pilgrims. The place offers natural beauty and escapes from chaotic urban life.",
        overnightStay: "Hotel at Govindghat"
    },
    {
        day: 2,
        title: "Trek from Govindghat to Ghangariya (3048 m., 14 km.)",
        description:
            "The distance between these places is about 14 km. which takes around 5 to 6 hours to reach. The uphill trek begins with steep valleys. The steep valleys last for the first 3 km. of the trek and again come towards the last 3 km. If you are not able to cope up with the trek, then you can take a pony or a helicopter. Ponies cost around Rs. 800 to Rs. 2,000. Helicopters are available only during clear weather. The best time to undertake the Valley of Flowers trek is June to September. Palanquins are also available for elderly people at a higher cost. On the way, you come across Pulma and Bhyuandar, both of which were heavily damaged during the 2013 floods but are now rehabilitated.",
        overnightStay: "Hotel at Ghangariya",
        trekDistance: "14 km",
        trekTime: "5-6 hours",
        trekDifficulty: "Moderate"
    },
    {
        day: 3,
        title: "Trek from Ghangariya to Valley of Flowers (10 km.)",
        description:
            "Trek to the Valley of Flowers about 10 km. which takes around 6 to 7 hours. The first 50% of the trek is steep uphill, while the remaining part is more gradual. The landscapes of the valley are breathtaking, with vibrant flowers, mountain ranges, and various species of birds, insects, and butterflies. Streams flow through the valley, adding to its beauty. The valley is flanked by Ratban Parvat on the right and Nar Parvat on the left, with views of Nilgiri Parvat and Ghori Parbat in the distance.",
        overnightStay: "Hotel at Ghangariya",
        trekDistance: "10 km",
        trekTime: "6-7 hours",
        trekDifficulty: "Moderate"
    },
    {
        day: 4,
        title: "Trek from Ghangariya to Kunthkhal Top (3700 m.-4430 m., 9 km.)",
        description:
            "Start the trek from Ghangariya to Kunthkhal Top after breakfast. The trek is about 9 km and the route is moderately easy with few steep sections. From the top, trekkers can enjoy panoramic views of the valley, snow-capped mountains, and cold breezes. The trek passes by rivers, streams, and glaciers, offering a visually rich experience with plenty of flora and fauna. If you’re feeling fit, you can extend the trek to Tipra Khark before heading back to Ghangariya.",
        overnightStay: "Hotel at Ghangariya",
        trekDistance: "9 km",
        trekTime: "Varies",
        trekDifficulty: "Moderate"
    },
    {
        day: 5,
        title: "Early Morning Trek to Govindghat",
        description:
            "After breakfast, head back to Govindghat. The trek is entirely downhill and ponies are available for convenience. Upon reaching Auli, take a vehicle to the Chairlift Point, where you can take the chairlift to tower number 10. Enjoy activities like mountain scooters or visit the artificial lake. Visit the highest peak of Uttarakhand, Nanda Devi, for incredible views. Return to the parking bay by chairlift and drive back to Joshimath for an overnight stay.",
        overnightStay: "Hotel at Joshimath",
        trekDistance: "14 km",
        trekDifficulty: "Easy (downhill)"
    },
    {
        day: 6,
        title: "Check Out",
        description:
            "Your Valley of Flowers trek ends here. After breakfast, check out from the hotel and leave for your onward destination.",
        overnightStay: "None"
    }
];

export const hotels = [
    {
        location: "Rishikesh",
        name: "Sherpa Hotel",
        rating: 4.5,
        starRating: 4,
        roomType: "Standard Room with Balcony",
        description: "Enjoy a peaceful night's sleep in a well-appointed space featuring modern amenities."
    }
];

export const inclusions = [
    {
        type: "Accommodation",
        description: "Shared rooms in hotels or guest houses."
    },
    {
        type: "Transfers",
        description: "Pick-up and drop-off at the airport or train station."
    },
    {
        type: "Transportation",
        description: "Vehicle for sightseeing and trekking."
    },
    {
        type: "Meals",
        description: "Breakfast and dinner daily."
    },
    {
        type: "Guide",
        description: "Professional trekking guide for the Valley of Flowers."
    },
    {
        type: "Permits",
        description: "Necessary permits for the national park."
    },
    {
        type: "First aid",
        description: "Basic first aid kit."
    }
];

export const exclusions = [
    {
        type: "Airfare or train tickets",
        description: "Travel to and from India."
    },
    {
        type: "Personal expenses",
        description: "Laundry, phone calls, etc."
    },
    {
        type: "Optional activities",
        description: "Helicopter rides, pony rides, etc."
    },
    {
        type: "Meals",
        description: "Lunches, snacks, drinks."
    },
    {
        type: "Tips",
        description: "Tips for guides, drivers, and staff."
    },
    {
        type: "Insurance",
        description: "Travel insurance."
    },
    {
        type: "Unforeseen expenses",
        description: "Costs due to natural disasters, roadblocks, etc."
    }
];

export const faqs = [
    {
        question: "Is this trip all-inclusive?",
        answer: "Our trips vary in styles! While some hosts may provide all-inclusive packages with meals and activities, many trips concentrate on accommodation only. This gives you the freedom to discover local cuisine and activities that align with your budget and interests. Make sure to review the specific details of each trip listing to understand what is included."
    }
];

export const bookingPolicy = {
    cancellationPolicies: [
        {
            type: "Full refund",
            description: "If the cancellation is made more than 30 days before the trip departure date.",
        },
        {
            type: "Partial refund",
            description: "If the cancellation is made between 15 and 30 days before departure.",
        },
        {
            type: "No refund",
            description: "If the cancellation is made within 15 days of departure, or if the trip has already started.",
        },
    ],
    actOfGodDescription: "The tour operator may cancel the trip due to unforeseen circumstances beyond their control, such as natural disasters or extreme weather.",
    personalReasonsDescription: "If you cancel the trip due to personal reasons (e.g., illness, family emergencies), the cancellation fees may apply according to the cancellation policy.",
};


export const transportation = [
    {
        route: "To Rishikesh",
        vehicleType: "Volvo",
        capacity: 24,
        pickUpLocation: "Kashmere Gate",
        pickUpTime: "9:00 PM",
        seatType: "Semi sleeper"
    }
];


export const placeholderImages = [
    {
        img: destination,
    },
    {
        img: destination,
    },
    {
        img: destination,
    },
    {
        img: destination,
    },
    {
        img: destination,
    },
    {
        img: destination,
    },
    {
        img: destination,
    },
    {
        img: destination,
    },
]

export const reviews = [
    {
        name: "Arjun S",
        date: "24th September 2024",
        rating: 5, // Add a rating value if applicable
        comment: "The tour was amazing and Way To India did a good job till the end."
    },
    {
        name: "Arjun S",
        date: "24th September 2024",
        rating: 5, // Add a rating value if applicable
        comment: "The tour was amazing and Way To India did a good job till the end."
    },
    {
        name: "Arjun S",
        date: "24th September 2024",
        rating: 5, // Add a rating value if applicable
        comment: "The tour was amazing and Way To India did a good job till the end."
    },
    {
        name: "Arjun S",
        date: "24th September 2024",
        rating: 5, // Add a rating value if applicable
        comment: "The tour was amazing and Way To India did a good job till the end."
    }
];

export const overviewData = {
    destination: "Valley of Flowers",
    category: "Trekking Tours in India",
    rating: 4.5,
    details: [
        { icon: "Clock", title: "Duration", value: "5 Nights/6 Days" },
        { icon: "MapPin", title: "Starting From", value: "Govindghat" },
        { icon: "Heart", title: "Best Time", value: "Govindghat" },  // Possible error: Value should be different from the Starting From.
        { icon: "HandPeace", title: "Ideal For", value: "Friends/Couples" },
        { icon: "Clock", title: "Cities Covering", value: "1" }
    ],
    description: "Escape to the misty hills of Coorg, a romantic paradise. Explore lush coffee plantations, trek through verdant forests, and relax by serene waterfalls. Indulge in local cuisine and enjoy cozy evenings together. Create unforgettable memories in this idyllic honeymoon destination. Explore lush coffee plantations, trek through verdant forests, and relax by serene waterfalls. Indulge in local cuisine and enjoy cozy evenings together. Create unforgettable memories in this idyllic honeymoon destination."
}


export const breadcrumbs = [
    { href: "/", text: "Home" },
    { href: "/", text: "Tours" },
];