const Job = require('../models/Job');
const User = require('../models/User');

// Post a Job
exports.createJob = async (req, res) => {
    try {
        const newJob = new Job({
            ...req.body,
            postedBy: req.user.userId
        });
        const job = await newJob.save();
        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get All Jobs (with Filters)
exports.getJobs = async (req, res) => {
    try {
        const { jobType, location, category, search } = req.query;
        const query = {};

        if (jobType) query.jobType = jobType;
        if (category) query.category = category;
        if (location) query.location = { $regex: location, $options: 'i' };
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } }
            ];
        }

        const jobs = await Job.find(query)
            .populate('postedBy', 'name profilePhoto')
            .sort({ createdAt: -1 });

        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Single Job
exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('postedBy', 'name email profilePhoto');
        if (!job) return res.status(404).json({ message: 'Job not found' });

        // Increment views
        job.views += 1;
        await job.save();

        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
