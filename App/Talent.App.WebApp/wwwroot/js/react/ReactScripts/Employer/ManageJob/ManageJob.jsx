import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment } from 'semantic-ui-react';
import { Button, Card, Image } from 'semantic-ui-react';
export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        /*loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");*/
        //console.log(loader)
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: true,
                showDraft: true,
                showExpired: true,
                showUnexpired: true,
                //selectedFilter: ""
            },
            totalPages: 1,
            activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        //your functions go here
    };
    init() {
        let loaderData = this.state.loaderData;
        /*loaderData.allowedUsers.push("Employer");
        loaderData.allowedUsers.push("Recruiter");*/
        loaderData.isLoading = false;
        this.setState({ loaderData, })
        this.loadData(() =>
            this.setState({ loaderData })
        )
    }
    componentDidMount() {
        this.loadData()
        this.init()
    }
    loadData() {
        var link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');
        var sortByDate = this.state.sortBy.date;
        // your ajax call and other logic goes here
        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            data: {
                activePage: this.state.activePage,
                sortbyDate: sortByDate,
                showActive: this.state.filter.showActive,
                showClosed: this.state.filter.showClosed,
                showDraft: this.state.filter.showDraft,
                showExpired: this.state.filter.showExpired,
                showUnexpired: this.state.filter.showUnexpired,
            },
            dataType: "json",
            success: function (res) {
                var recordsPerPage = 2;
                var totalRecords = res.myJobs.length;
                var totalPages = Math.ceil(totalRecords / recordsPerPage);
                var loadJobs = res.myJobs.sort((a, b) => {
                    var dateA = new Date(a[sortByDate]);
                    var dateB = new Date(b[sortByDate]);
                    return dateB - dateA;
                });
                var newestJob = loadJobs[0];
                var oldestJob = loadJobs[loadJobs.length - 1];
                this.setState({ loadJobs: loadJobs, totalPages: totalPages, newestJob: newestJob, oldestJob: oldestJob });
                console.log(this.state.loadJobs)
            }.bind(this),
            error: function (res) {
                console.log(res.status)
            }
        })
    }
    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }
    render() {
        const { loadJobs, activePage, totalPages } = this.state;
        const recordsPerPage = 2;
        const startIndex = (activePage - 1) * recordsPerPage;
        const endIndex = startIndex + recordsPerPage;
        const displayedJobs = loadJobs.slice(startIndex, endIndex);
        if (loadJobs.length === 0) {
            return (
                <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                    <div className="ui container">
                        <h1>List of Jobs</h1>
                        <Dropdown
                            text='Filter: Choose Filter'
                            icon='filter'
                            floating
                            labeled
                            style={{ marginLeft: "25px" }}
                            className='icon'
                        /* onChange={(e, { value }) => this.setState(prevState => ({
                             filter: {
                                 ...prevState.filter,
                                 selectedFilter: value // update the selected filter
                             }
                         }))}*/
                        >
                            <Dropdown.Menu>
                                <Dropdown.Header content='Select a job title' />
                                {loadJobs.map((job) => (
                                    <Dropdown.Item key={job.id} text={job.title} />
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </BodyWrapper>
            );
        }
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <React.Fragment>
                    <div className="ui container">
                        <h1>List of Jobs</h1>
                        <Dropdown
                            text='Filter: Choose Filter'
                            icon='filter'
                            floating
                            labeled
                            style={{ marginLeft: "25px" }}
                            className='icon'
                        >
                            <Dropdown.Menu>
                                <Dropdown.Header content='Select a job title' />
                                {loadJobs.map((job) => (
                                    <Dropdown.Item key={job.id} text={job.title} />
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown
                            icon='calendar'
                            text='Sort by Date: Newest First'
                            floating
                            labeled
                            style={{ marginLeft: "25px" }}
                            className='icon'
                        >
                            <Dropdown.Menu>
                                <Dropdown.Item
                                    text='Newest First'
                                    onClick={() => {
                                        this.setState({
                                            sortBy: {
                                                date: 'desc'
                                            }
                                        }, this.loadData);
                                    }}
                                />
                                <Dropdown.Item
                                    text='Oldest First'
                                    onClick={() => {
                                        this.setState({
                                            sortBy: {
                                                date: 'asc'
                                            }
                                        }, this.loadData);
                                    }}
                                />
                            </Dropdown.Menu>
                        </Dropdown>
                        <JobSummaryCard jobs={displayedJobs} />
                        <p id="load-more-loading">
                            <img src="/images/rolling.gif" alt="Loading…" />
                        </p>
                        <Pagination
                            activePage={activePage}
                            totalPages={totalPages}
                            onPageChange={(e, { activePage }) => this.setState({ activePage })}
                            style={{ marginLeft: "25px" }}
                        />
                    </div>
                </React.Fragment>
            </BodyWrapper>
        )
    }
}