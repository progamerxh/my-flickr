import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import SearchForm from './SearchForm'
import Explore from './Explore'
import TagSearch from './TagSearch'
import { Link, Route, Switch } from 'react-router-dom'
import '../App.css';
import Photodetail from './Photodetail';

class App extends Component {
    state = {
        searchquery: '',
    }
    child = React.createRef();

    handleSearchquery = (query) => {
        this.setState({ searchquery: query });
    }

    render() {
        return (
            <div>
                <div className="fluid-subnav-shim">
                    <div className="fluid-subnav" >
                        <div className="subnav-content fluid-centered">
                            <ul className="links" >
                                <li className="link explore">
                                    <Link to='/explore'>Explore</Link>
                                </li>
                                <li className="link search" >
                                    <SearchForm onSearchQuery={this.handleSearchquery} />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <Switch>
                    <Route exact path='/' component={Explore} />
                    <Route exact path='/explore' component={Explore}  />
                    <Route path='/photos/:id' component={Photodetail} />
                    <Route path='/search=:searchquery' component={TagSearch} />
                </Switch>
            </div >
        );
    }
}

export default App;
