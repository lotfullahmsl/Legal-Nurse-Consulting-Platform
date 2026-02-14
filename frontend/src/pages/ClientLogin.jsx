// Client Login - Reuses the same Login component with client branding
import Login from './Login';

const ClientLogin = () => {
    return <Login isClientPortal={true} />;
};

export default ClientLogin;
