import { Routes, Route, BrowserRouter as Router, BrowserRouter } from 'react-router-dom';import LandingPage from './LandingPage';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ProfilePage from './Profile';
import PrivateComponent from './components/PrivateComponent';
import ForgotPass from './FogotPass';
import ResponsiveAppBar from './Navbar';
import AdminLoginForm from './AdminComponent/AdminLogin';
import AddSubject from './AdminComponent/AddSubject';
import AddAdmin from './AdminComponent/AddAdmin';
import Dashboard from './Pages/DashBoard';
import Compare from './Pages/Compare';
import './App.css'

const App = () => {
  return (
  <div className='app' style={{"width":"100vw","minHeight":"48vw", "margin":"0rem"}}>
  <BrowserRouter>
    <ResponsiveAppBar/>
    <Routes>
    <Route element={<PrivateComponent />}>
        <Route path="/profile" element={<ProfilePage />}></Route>
        <Route path="/admin/addadmin" element={<AddAdmin />}></Route>
        <Route path="/admin/addsubject" element={<AddSubject />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/compare" element={<Compare />}></Route>
    </Route>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/forgotpass" element={<ForgotPass />} />
      <Route path="/admin/login" element={<AdminLoginForm/>} />
    </Routes>
  </BrowserRouter>
  </div>
  );
};

export default App;