import React from 'react';
import { BrowserRouter, Navigate ,Route , Routes} from 'react-router-dom';
import Login from './Pages/LoginForm';
import SignUp from './Pages/SignupForm';
import EmailVerification from './Pages/EmailVerification';
import MainDashboard from './Pages/DashBoard';
import ForgotPasswordModal from './Pages/ForgotPassword';
import CreateNewPassword from './Pages/RevivePassword';


const App =() =>{
  return (
      <BrowserRouter>
      <Routes>
          <Route path ="/" element = {<Login/>} />
          <Route path ="/signup" element = {<SignUp/>} />
          <Route path ="/signup-with-email" element = {<EmailVerification/>} />
          <Route path = "/dashboard" element = {<MainDashboard/>}/>
          <Route path = "/forgot-password" element = {<ForgotPasswordModal/>} />
          <Route path = "/reset-password/:token" element = {<CreateNewPassword/>} />

          <Route path = "*" element = {<Navigate to = "/" />}/>
      </Routes>
      </BrowserRouter>
  )
}

export default App;

