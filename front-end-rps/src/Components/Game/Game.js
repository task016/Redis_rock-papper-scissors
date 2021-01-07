import React, { Component } from 'react';
import axios from 'axios';
import { Col, Container, Row, Button } from 'react-bootstrap';
import './Game.css';
import io from 'socket.io-client';
import Image from '../../Assets/Images/rock.png';
import Image2 from '../../Assets/Images/paper.png';
import Image3 from '../../Assets/Images/scissors.png';

const socket = io.connect('http://localhost:8000/', {
  headers: { 'Access-Control-Allow-Origin': '*' },
});

class Game extends Component {
  state = {
    Id: -1,
    res: null,
    nextMove: '',
    name: '',
  };
  componentDidMount() {
    this.setState({
      Id: this.props.sessionId,
      type: this.props.type,
      name: this.props.name,
    });

    if (this.props.type === 'host') {
      socket.on(`clientjoined:${this.props.sessionId}`, () => {
        axios
          .get('http://localhost:8000/sessions/' + this.props.sessionId + '/', {
            headers: { 'Access-Control-Allow-Origin': '*' },
          })
          .then((response) => {
            console.log(response);
            this.setState({ res: response.data });
          })
          .catch((error) => {
            console.log(error);
          });
      });
    } else {
      axios
        .get('http://localhost:8000/sessions/' + this.props.sessionId + '/', {
          headers: { 'Access-Control-Allow-Origin': '*' },
        })
        .then((response) => {
          console.log(response);
          this.setState({ res: response.data });
        })
        .catch((error) => {
          console.log(error);
        });
    }
    socket.on(`movePlayed:${this.props.sessionId}`, () => {
      axios
        .get('http://localhost:8000/sessions/' + this.props.sessionId + '/', {
          headers: { 'Access-Control-Allow-Origin': '*' },
        })
        .then((response) => {
          console.log(response);
          this.setState({ res: response.data });
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }
  componentWillUnmount() {
    if (this.state.name === 'host') {
      socket.off(`clientjoined:${this.props.sessionId}`, null);
    }
    socket.off(`movePlayed:${this.props.sessionId}`, null);
    axios
      .delete('http://localhost:8000/sessions/' + this.state.Id + '/', {
        headers: { 'Access-Control-Allow-Origin': '*' },
      })
      .then((r) => {
        console.log(r);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  rockHandler = () => {
    this.setState({ nextMove: 'rock' });
  };
  paperHandler = () => {
    this.setState({ nextMove: 'paper' });
  };
  scissorsHandler = () => {
    this.setState({ nextMove: 'scissors' });
  };
  submitHandler = () => {
    if (this.state.nextMove === '') {
      console.log('Nije odabran potez');
    } else {
      let userData = {
        playerName: this.state.name,
        password: this.state.res.password,
        move: this.state.nextMove,
      };
      axios
        .post(
          'http://localhost:8000/sessions/' + this.props.sessionId + '/play/',
          userData,
          {
            headers: { 'Access-Control-Allow-Origin': '*' },
          }
        )
        .then((response) => {
          console.log(response);
          this.setState({ nextMove: '' });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  closeHandler = () => {
    window.location.reload();
  };
  render() {
    const imgstyle = {
      cursor: 'pointer',
    };
    let pom = (
      <div>
        <h1 className='text-center'>SessionID:{this.props.sessionId}</h1>
      </div>
    );
    if (this.state.res != null) {
      pom = (
        <div>
          <Container>
            <h1 className='text-center mb-5 mt-3'>Session: {this.state.Id}</h1>
            <Row className='border border-dark score'>
              <Col>
                <h4>
                  <b>
                    {this.state.res['host-name']} :{' '}
                    {this.state.res['host-points']}
                  </b>
                </h4>
              </Col>
              <Col>
                <h4 className='text-center'>
                  <b>VS</b>
                </h4>
              </Col>
              <Col>
                <h4 className='text-right'>
                  <b>
                    {this.state.res['client-name']} :{' '}
                    {this.state.res['client-points']}
                  </b>
                </h4>
              </Col>
            </Row>
            <h2 className='text-center mt-5 mb-5'>Choose your weapon!</h2>
            <Row className='mb-5'>
              <Col>
                <img
                  src={Image}
                  width='100'
                  height='100'
                  className='ml-auto mr-auto d-block'
                  style={imgstyle}
                  alt='rock'
                  onClick={this.rockHandler}
                />
              </Col>
              <Col>
                <img
                  src={Image2}
                  width='100'
                  height='100'
                  className='ml-auto mr-auto d-block'
                  style={imgstyle}
                  alt='paper'
                  onClick={this.paperHandler}
                />
              </Col>
              <Col>
                <img
                  src={Image3}
                  width='100'
                  height='100'
                  className='ml-auto mr-auto d-block'
                  style={imgstyle}
                  alt='scissors'
                  onClick={this.scissorsHandler}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Button className='w-100 mb-1' onClick={this.submitHandler}>
                  Submit
                </Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <Button
                  variant='danger'
                  className='w-100 mb-5'
                  onClick={this.closeHandler}
                >
                  Close Session
                </Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <h4>
                  <b>History:</b>
                </h4>
                <p>{this.state.res.history}</p>
              </Col>
            </Row>
          </Container>
        </div>
      );
    }
    return <div>{pom}</div>;
  }
}

export default Game;
