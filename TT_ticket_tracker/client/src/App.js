import './App.css';
import React, { useState, useEffect } from 'react';
import { useHistory, Switch, Route } from 'react-router-dom';
import Layout from './layouts/layout';
import { loginUser, registerUser, verifyUser, removeToken } from './services/auth';
import Login from './screens/Login/Login';
import Register from './screens/Register/Register';
import LandingPage from './screens/LandingPage/LandingPage';
import Tickets from './screens/Tickets/Tickets';
import ChatContainer from "./containers/ChatContainer/ChatContainer";
import TicketDetail from "./screens/TicketDetail/TicketDetail";
import TicketEdit from "./screens/TicketEdit/TicketEdit";





function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const handleVerify = async () => {
      const currentUser = await verifyUser();
      setCurrentUser(currentUser);
    }
    handleVerify();
  }, [])

  const handleLogin = async (formData) => {
    const currentUser = await loginUser(formData);
    setCurrentUser(currentUser);
    history.push('/tickets')
  }

  const handleRegister = async (formData) => {
    const currentUser = await registerUser(formData);
    setCurrentUser(currentUser);
    history.push('/login')
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    removeToken();
    setCurrentUser(null);
    history.push('/')
  }


  return (
    <div className="App">
      <Layout
        currentUser={currentUser}
        handleLogout={handleLogout}
      >
        <Switch>
          <Route path='/login'>
            <Login handleLogin={handleLogin} />
          </Route>
          <Route path='/register'>
            <Register handleRegister={handleRegister} />
          </Route>
          <Route path='/chat'>
            <ChatContainer currentUser={currentUser} />
          </Route>
          <Route path="/ticket/edit/:id">
            <TicketEdit currentUser={currentUser} />
          </Route>
          <Route path="/ticket/:id">
            <TicketDetail currentUser={currentUser} />
          </Route>
          <Route path='/tickets'>
            <Tickets currentUser={currentUser} />
          </Route>
          <Route path='/'>
            <LandingPage />
          </Route>
        </Switch>
      </Layout>
    </div>
  );
}

export default App;
