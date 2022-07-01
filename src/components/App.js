import {Home,Login,Signup,Setting,UserProfile} from '../pages'
import Navbar from "./Navbar";
import {BrowserRouter,Navigate,Route,Routes} from 'react-router-dom';
import { useAuth } from '../hooks';
import Loader from './Loader';

const Notfound404 = () => {
  return <h1>404</h1>
}


const Private2 = (Component) => {
  const auth = useAuth();
  return auth.user ? Component=<UserProfile /> : <Navigate to="/login" />
}

const Private = (Component) => {
  const auth = useAuth();
  return auth.user ? Component=<Setting /> : <Navigate to="/login" />
}

function App() {
  const auth = useAuth();

  if(auth.loading){
    return <Loader />
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route  path="/" element = {<Home/>} />

          <Route  path="/login" element = {<Login />} />

          <Route  path="/register" element = {<Signup />} />

          <Route path="/settings" element={<Private Component={Setting} />} />

          <Route path="/user/:userId" element={<Private2 Component={ UserProfile } />} />

          <Route path="*" element={<Notfound404 />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
