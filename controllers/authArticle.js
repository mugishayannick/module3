const User = require('../models/user');
const jwt = require("jsonwebtoken");
const user = require('../models/user');

const signToken = (id) => {
    return jwt.sign({ id, role: 'user' }, 'topSecret', {
      expiresIn: '3d',
    });
  };
  

//handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

    // duplicate error code
    if (err.code === 11000) {
        errors.email = 'that email is already registered';
        return errors;
    }

    // validatiom errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        })
    }

    return errors;

}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.signup_post = async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    try {

    const findUser = await User.findOne({ email: req.body.email });
    if (findUser) {
        res.status(500).json({error: true, message: "User exists"});
    }
        const user = await User.create({ firstName, lastName, email, password, confirmPassword }); 
        const token = signToken(user._id);
        const data = {
            token,
            user,
        };
    res.status(201).json(data);

    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });

    }
}

module.exports.login_post = async (req, res) => {
    const {  firstName, lastName, email, password, confirmPassword } = req.body;

    try {
        const user = await user.login(firstName, lastName, email, password, confirmPassword);
        res.status(200).json({ user: user._id})
    } catch (errors) {
        res.status(400).json({ errors });
    }
}    