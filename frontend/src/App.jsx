import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './Components/Navbar';
import { Footer } from './Components/Footer';
import { Home } from './Pages/Home';
import { Login } from './Pages/Login';
import { Register } from './Pages/Register';
import { Hebergements } from './Pages/Hebergements';
import { Contact } from './Pages/Contact';
import { Galerie } from './Pages/Galerie';
import { HebergementsDetails } from './Pages/HebergementsDetails';
import { Tarifs } from './Pages/Tarifs';
import { MesReservations } from './Pages/MesReservations';
import { Dashboard } from './Pages/adminPages/Dashboard';
import { Profil } from './Pages/Profil';
import { usePageTracking } from './hooks/usePageTracking';


function AppContent() {
    usePageTracking(); // pour suivre les pages avec GA4 analytics
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/hebergements" element={<Hebergements />} />
                <Route path="/hebergements/:id" element={<HebergementsDetails />} />
                <Route path="/galerie" element={<Galerie />} />
                <Route path="/tarifs" element={<Tarifs />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/mes-reservations" element={<MesReservations />} />
                <Route path='/profil' element={<Profil />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
            </Routes>
            <Footer />
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;
