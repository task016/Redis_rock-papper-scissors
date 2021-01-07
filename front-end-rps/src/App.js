import React, { Component } from 'react';
import Header from './Components/Header/Header';
import './App.css';
import { Container, Row, Col, Form } from 'react-bootstrap';
import Image1 from './Assets/Images/challange.png';
import Image2 from './Assets/Images/create.png';
import Image3 from './Assets/Images/join.png';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import Game from './Components/Game/Game';
import Footer from './Components/Footer/Footer';

class App extends Component {
  state = {
    joined: null,
    created: null,
    type: null,
    namecreate: '',
    passcreate: '',
    confirmpasscreate: '',
    namejoin: '',
    passjoin: '',
    idjoin: -1,
    sessionId: -1,
    response: null,
  };
  onChangeHandler = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({ [name]: value });
  };
  createHandler = () => {
    if (
      this.state.namecreate === '' ||
      this.state.passcreate !== this.state.confirmpasscreate
    ) {
      console.log('Neuspesno kreiranje');
    } else {
      console.log('Uspesno kreiranje');
      let userData = {
        hostName: this.state.namecreate,
        password: this.state.passcreate,
      };
      axios
        .post('http://localhost:8000/sessions/', userData, {
          headers: { 'Access-Control-Allow-Origin': '*' },
        })
        .then((response) => {
          console.log(response);
          this.setState({
            created: 1,
            res: response,
            sessionId: response.data.sessionId,
            type: 'host',
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  joinHandler = () => {
    if (
      this.state.namejoin === '' ||
      this.state.passjoin === '' ||
      this.state.idjoin < 0
    ) {
      console.log('Polje je prazno');
    } else {
      console.log('Uspesno joinovanje');
      let userData = {
        clientName: this.state.namejoin,
        password: this.state.passjoin,
      };
      axios
        .post(
          'http://localhost:8000/sessions/' + this.state.idjoin + '/',
          userData,
          {
            headers: { 'Access-Control-Allow-Origin': '*' },
          }
        )
        .then((response) => {
          console.log(response);
          this.setState({ joined: 1, type: 'client' });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  render() {
    let pom = null;
    if (this.state.created != null) {
      pom = (
        <Game
          sessionId={this.state.sessionId}
          type={this.state.type}
          name={this.state.namecreate}
        ></Game>
      );
    } else if (this.state.joined != null) {
      pom = (
        <Game
          sessionId={this.state.idjoin}
          type={this.state.type}
          name={this.state.namejoin}
        ></Game>
      );
    } else {
      pom = (
        <div>
          <Header></Header>
          <section className='section-features'>
            <Container>
              <Row className='mr-auto ml-auto'>
                <Col>
                  <h2 className='text-center mb-5'>How to play?</h2>
                  <p className='text-center'>
                    Rock beat Scissors. <br /> <br />
                    Scissors beat Paper. <br /> <br />
                    Paper beat Rock. <br /> <br />
                    Simple as that! <br /> <br />
                  </p>
                </Col>
              </Row>
            </Container>
          </section>
          <section className='section-features'>
            <Container>
              <h2 className='text-center mb-5'>What we offer?</h2>
              <Row className='mr-auto ml-auto mt-5'>
                <Col className='text-center'>
                  <img
                    src={Image1}
                    width='40'
                    height='40'
                    className='rounded d-inline-block align-top mb-5'
                    alt='logo'
                  />
                  <p>Challange your friend!</p>
                </Col>
                <Col className='text-center'>
                  <img
                    src={Image2}
                    width='40'
                    height='40'
                    className='rounded d-inline-block align-top mb-5'
                    alt='logo'
                  />
                  <p>Create your own game!</p>
                </Col>
                <Col className='text-center'>
                  <img
                    src={Image3}
                    width='40'
                    height='40'
                    className='rounded d-inline-block align-top mb-5'
                    alt='logo'
                  />
                  <p>Join your friends game!</p>
                </Col>
              </Row>
            </Container>
          </section>
          <section id='sectioncreate'>
            <Container>
              <h2 className='text-center mb-5'>Create your own game!</h2>
              <Row className='mr-auto ml-auto'>
                <Form className='mr-auto ml-auto'>
                  <Form.Group as={Row} controlId='formHorizontalEmail'>
                    <Form.Label column sm={4}>
                      Name
                    </Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        type='text'
                        name='namecreate'
                        onChange={this.onChangeHandler}
                        placeholder='Your Name'
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId='formHorizontalPassword'>
                    <Form.Label column sm={4}>
                      Password
                    </Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        type='password'
                        name='passcreate'
                        onChange={this.onChangeHandler}
                        placeholder='Password'
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    controlId='formHorizontalConfirmPassword'
                  >
                    <Form.Label column sm={4}>
                      Confirm Pass
                    </Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        type='password'
                        name='confirmpasscreate'
                        onChange={this.onChangeHandler}
                        placeholder='Confirm Password'
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group
                    className='justify-content-center mt-2'
                    as={Row}
                    controlId='formHorizontal'
                  >
                    <Button onClick={this.createHandler}>Create</Button>
                  </Form.Group>
                </Form>
              </Row>
            </Container>
          </section>
          <section id='sectionjoin'>
            <Container>
              <h2 className='text-center mb-5'>Join the game!</h2>
              <Row className='mr-auto ml-auto'>
                <Form className='mr-auto ml-auto'>
                  <Form.Group as={Row} controlId='idfield'>
                    <Form.Label column sm={4}>
                      ID
                    </Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        type='number'
                        name='idjoin'
                        onChange={this.onChangeHandler}
                        placeholder='ID'
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} controlId='form'>
                    <Form.Label column sm={4}>
                      Name
                    </Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        type='text'
                        name='namejoin'
                        onChange={this.onChangeHandler}
                        placeholder='Your Name'
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId='form1'>
                    <Form.Label column sm={4}>
                      Password
                    </Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        type='password'
                        name='passjoin'
                        onChange={this.onChangeHandler}
                        placeholder='Password'
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group
                    className='justify-content-center mt-2'
                    as={Row}
                    controlId='form2'
                  >
                    <Button onClick={this.joinHandler}>Join</Button>
                  </Form.Group>
                </Form>
              </Row>
            </Container>
          </section>
          <Footer />
        </div>
      );
    }
    return <div>{pom}</div>;
  }
}

export default App;
