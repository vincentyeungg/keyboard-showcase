import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
    return currentUser ? <h1>You are signed in</h1> : <h1>You are not signed in</h1>
};

// using getInitialProps, this takes place during SSR
// can also be executed on browser if navigating from one page to another while in the app
LandingPage.getInitialProps = async (context) => {
    console.log('LANDING PAGE');
    // get custom configured axios instance
    const client = buildClient(context);
    const { data } = await client.get('/api/users/currentuser');
    return data;
};

export default LandingPage;