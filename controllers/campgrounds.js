const Campground = require('../models/campground');


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.createCampgrounds = async (req, res, next) => {

    // if (!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully made a new Campground!');
    res.redirect(`/campgrounds/${campground._id}`);

};

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(foundCamp)
    if (!foundCamp) {
        req.flash('error', 'Cannot find that Campground');
        return res.redirect('/campgrounds');
    }

    res.render('campgrounds/show', { foundCamp });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id);
    if (!foundCamp) {
        req.flash('error', 'Cannot find that Campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { foundCamp });
};

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const foundCamp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated the Campground');
    res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the Campground');
    res.redirect('/campgrounds');
};