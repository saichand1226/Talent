import React from 'react';
import Cookies from 'js-cookie';
import { Card, Button, Image, Label, Icon } from 'semantic-ui-react';
import moment from 'moment';
export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.selectJob = this.selectJob.bind(this);
        /*this.state = {
            job: this.props.loadJobs,
        };*/
    }
    selectJob(id) {
        var cookies = Cookies.get('talentAuthToken');
        // url: 'http://localhost:51689/listing/listing/closeJob'
    }
    render() {
        return (
            <div className="ui container">
                <Card.Group>
                    {this.props.jobs.map(job => (
                        <Card key={job.id}
                            style={{ width: "360px", height: "300px" }}>
                            <Card.Content>
                                <Label color='black' ribbon='right'>
                                    <Icon name="user" />
                                </Label>
                                <Card.Header style={{ marginBottom: "30px" }}>
                                    {job.title}
                                </Card.Header>
                                <Card.Meta>{job.location.city}, {job.location.country}</Card.Meta>
                                <Card.Description>
                                    <strong>{job.summary}</strong>
                                </Card.Description>
                            </Card.Content>
                            <Card.Content extra>
                                <div className='ui four buttons'
                                    style={{ width: "350px", height: "40px" }} >
                                    <div style={{ marginRight: "20px" }}>
                                        <Button color='red' floated="left">
                                            Expired
                                        </Button>
                                    </div>
                                    <div >
                                        <Button basic color='red'  >
                                            Close
                                        </Button>
                                        <Button basic color='red'  >
                                            Edit
                                        </Button>
                                        <Button basic color='red'  >
                                            Copy
                                        </Button>
                                    </div>
                                </div>
                            </Card.Content>
                        </Card>
                    ))}
                </Card.Group>
            </div>
        )
    }
}