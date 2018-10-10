import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class SearchForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            pathname: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }
    
    handleSubmit(event) {
        event.preventDefault();
        this.props.onSearchQuery(this.state.value);
        this.props.history.push(`/search=` + this.state.value)
    }

    componentDidUpdate() {
        var pathname = this.props.history.location.pathname;
        var token = pathname.split("=");
        if (this.state.pathname != pathname)
            this.setState({ value: token[1], pathname })
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <svg id="searchicon" className="icon" >
                    <path fill="#000000" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                </svg>
                <input type="text" value={this.state.value} onChange={this.handleChange} className="search" placeholder="Tags" aria-label="Search" />
            </form>
        )
    }
}

export default withRouter(SearchForm)