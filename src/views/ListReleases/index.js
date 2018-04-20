import React from 'react';
import { ProgressBar, Button, Modal } from 'react-bootstrap';
import { object } from 'prop-types';
import ReactInterval from 'react-interval';
import { TREEHERDER_URL, TASKCLUSTER_TOOLS_URL, API_URL } from '../../config';

const statusStyles = {
  true: 'success',
  false: 'info',
};

export default class ListReleases extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      loaded: false,
      message: '',
      releases: [],
    };
  }

  async componentDidMount() {
    await this.getReleases();
  }

  getReleases = async () => {
    try {
      const req = await fetch(`${API_URL}/releases`);
      const releases = await req.json();
      let message = '';
      if (releases.length === 0) {
        message = <h3>No pending releases!</h3>;
      }
      this.setState({
        releases,
        message,
        loaded: true,
      });
    } catch (e) {
      const message = <h3>Failed to fetch releases!</h3>;
      this.setState({
        loaded: true,
        message,
        releases: [],
      });
      throw e;
    }
  };

  render() {
    const { releases, loaded, message } = this.state;
    return (
      <div className="container">
        <h3>Releases in progress</h3>
        <div>
          {loaded || <b>loading...</b>}
          {message}
          {releases.length > 0 && releases.map(release => (
            <Release
              release={release}
              key={release.name}
            />))}
          <ReactInterval
            enabled
            timeout={2 * 60 * 1000}
            callback={() => this.getReleases()}
          />
        </div>
      </div>
    );
  }
}

class Release extends React.Component {
  static contextTypes = {
    authController: object.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      submitted: props.submitted,
      errorMsg: null,
    };
  }

  open = () => {
    this.setState({ showModal: true });
  };

  close = () => {
    this.setState({
      showModal: false,
      errorMsg: null,
    });
  };

  abortRelease = async (release) => {
    // TODO: refactor functions using the API
    const url = `${API_URL}/releases/${release.name}`;
    if (!this.context.authController.userSession) {
      this.setState({ errorMsg: 'Login required!' });
      return;
    }
    const { accessToken } = this.context.authController.getUserSession();
    const headers = { Authorization: `Bearer ${accessToken}` };
    try {
      const response = await fetch(url, { method: 'DELETE', headers });
      if (!response.ok) {
        this.setState({ errorMsg: 'Auth failure!' });
        return;
      }
      this.setState({ submitted: true });
      window.location.reload();
    } catch (e) {
      this.setState({ errorMsg: 'Server issues!' });
      throw e;
    }
  };

  renderBody = () => {
    const { submitted, errorMsg } = this.state;
    if (errorMsg) {
      return (
        <div>
          <p>{errorMsg}</p>
        </div>
      );
    }
    if (!submitted) {
      return (
        <div>
          <h4>Are you sure?</h4>
          <p>
            The release will be aborted!
          </p>
          <small>
            TC cancel is not implemented. The release will be just marked as abandoned in the API.
          </small>
        </div>
      );
    }
    return (
      <div>Done.</div>
    );
  };

  render() {
    const { release } = this.props;
    return (
      <div className="row">
        <div className="col">
          <h3>
            <a href={`${TREEHERDER_URL}/#/jobs?repo=${release.project}&revision=${release.revision}`}>
              {release.product} <small>{release.version} build{release.build_number}</small>
            </a>
            <Button
              onClick={this.open}
              bsStyle="danger"
              disabled={!this.context.authController.userSession}
            >
              Abort release
            </Button>
          </h3>
        </div>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Abort a release</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.renderBody()}
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => this.abortRelease(release)}
              bsStyle="danger"
              disabled={!this.context.authController.userSession}
            >
              Kill eet!
            </Button>
            <Button onClick={this.close} bsStyle="primary">Close</Button>
          </Modal.Footer>
        </Modal>
        <div className="col">
          <TaskProgress phases={release.phases} releaseName={release.name} />
        </div>
      </div>
    );
  }
}

const TaskProgress = (props) => {
  const { phases, releaseName } = props;
  const width = 100 / phases.length;
  return (
    <ProgressBar style={{ height: '40px', padding: '3px' }}>
      {phases.map(({ name, submitted, actionTaskId }) => (
        <ProgressBar
          key={name}
          bsStyle={statusStyles[submitted]}
          now={width}
          active={submitted}
          label={<TaskLabel
            name={name}
            submitted={submitted}
            taskGroupUrl={`${TASKCLUSTER_TOOLS_URL}/groups/${actionTaskId}`}
            url={`${API_URL}/releases/${releaseName}/${name}`}
          />}
        />
      ))}
    </ProgressBar>
  );
};

class TaskLabel extends React.PureComponent {
  static contextTypes = {
    authController: object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      submitted: props.submitted,
      errorMsg: null,
    };
  }

  open = () => {
    this.setState({ showModal: true });
  };

  close = () => {
    this.setState({
      showModal: false,
      errorMsg: null,
    });
  };

  doEet = async () => {
    if (!this.context.authController.userSession) {
      this.setState({ errorMsg: 'Login required!' });
      return;
    }
    const { accessToken } = this.context.authController.getUserSession();
    const headers = { Authorization: `Bearer ${accessToken}` };
    try {
      const response = await fetch(this.props.url, { method: 'PUT', headers });
      if (!response.ok) {
        this.setState({ errorMsg: 'Auth failure!' });
        return;
      }
      this.setState({ submitted: true });
    } catch (e) {
      this.setState({ errorMsg: 'Server issues!' });
      throw e;
    }
  };

  // TODO: convert into a function
  renderBody = () => {
    const { submitted, errorMsg } = this.state;
    if (errorMsg) {
      return (
        <div>
          <p>{errorMsg}</p>
        </div>
      );
    }
    if (!submitted) {
      return (
        <div>
          <h4>Are you sure?</h4>
          <p>Action will be scheduled</p>
        </div>
      );
    }
    return (
      <div>
        Action task has been submitted.
      </div>
    );
  };

  render() {
    if (!this.state.submitted) {
      return (
        <div>
          <Button bsStyle="primary" onClick={this.open}>{this.props.name}</Button>
          <Modal show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>Do eet</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {this.renderBody()}
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.doEet} bsStyle="danger" disabled={!this.context.authController.userSession}>Do eet!</Button>
              <Button onClick={this.close} bsStyle="primary">Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      );
    }
    return <div>{this.props.name} - <a href={this.props.taskGroupUrl}>Task Group</a></div>;
  }
}
