const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors, places } = require('./seeHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected!!");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        let random1000 = Math.floor(Math.random() * 1000);
        let price = Math.floor(Math.random() * 20) + 1;
        const camp = new Campground({
            author: '67c556627d94c773e43dac0c',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex esse veritatis magnam perferendis, illo illum a numquam dignissimos maiores cumque rem architecto provident ullam distinctio. Optio reprehenderit esse repellendus placeat',
            price,
            geometry: {
                type: "Point",
                coordinates: [cities[random1000].longitude, cities[random1000].latitude,]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dqzc1iv32/image/upload/w_200/v1748524787/YelpCamp/s4jdgwlimeqhqv2ibikw.png',
                    filename: 'YelpCamp/yckvffd3veyjxzhmix0v',

                },
                {
                    url: 'https://res-console.cloudinary.com/dqzc1iv32/thumbnails/v1/image/upload/v1746947693/WWVscENhbXAvYm5hY3poNnp4azhsOXdtb2MwaHA=/drilldown',
                    filename: 'YelpCamp/sz5kg6xhojffbycadb3t',

                },
                {
                    url: 'https://res-console.cloudinary.com/dqzc1iv32/thumbnails/v1/image/upload/v1746947693/WWVscENhbXAvYm5hY3poNnp4azhsOXdtb2MwaHA=/drilldown',
                    filename: 'YelpCamp/pr0uegxcjuen9i7hdshs',

                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})