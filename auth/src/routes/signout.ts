import express from 'express';

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
    // in this request, we have to clear out everything in the cookie session so that a user cannot be verified as logged in
    // from documentation of cookie-session library, set req.session -> null
    req.session = null;

    res.send({});
});

export { router as signoutRouter };