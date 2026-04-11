import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import FindHomes from './pages/FindHomes';
import CreatePost from './pages/CreatePost';
import Login from './pages/Login';
import PropertyDetails from './pages/PropertyDetails';
import RoommateListing from './pages/RoommateListing';
import UserDashboard from './pages/UserDashboard';
import ViewRoommate from './pages/ViewRommate';
import SignUp from './pages/SignUp';
import Messages from './pages/Messages';
import NotFound from './pages/NotFound';

import { GlobalProvider } from './context/GlobalContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <GlobalProvider>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/find-homes" element={<FindHomes />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/property-details" element={<PropertyDetails />} />
          <Route path="/property-details/:id" element={<PropertyDetails />} />
          <Route path="/roommate-listing" element={<RoommateListing />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/view-roommate" element={<ViewRoommate />} />
          <Route path="/view-roommate/:id" element={<ViewRoommate />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </GlobalProvider>
  );
}

export default App;
