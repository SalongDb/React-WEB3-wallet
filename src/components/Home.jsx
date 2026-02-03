import Dashboard from './Dashboard';
import './Home.css'
import Navbar from './Navbar';

function Home() {

    return <div className="Home">
        <div>
            <Navbar />
        </div>
        <div className="dashboard">
            <Dashboard />
        </div>
    </div>
}

export default Home;