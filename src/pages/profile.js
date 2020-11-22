import firebase from "../context/firebaseContext"
import "firebase/auth";
import "firebase/database"; 


import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom';

import { Grid, Paper, Button, Typography, Collapse } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import Login from "../comps/login"
import OwnerBox from "../comps/ownerBox"


import UsernamePanel from "../comps/usernamePanel"
import history from "../history"



import postData from "../utils/api"
import "../styles.css"



var db = firebase.database();


export class PageContent extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD
    }
    console.log(props)
  }

  componentWillReceiveProps(newProps){
    this.setState({...newProps})
  }
  
  sendVerificationEmail(){
    this.state.user.sendEmailVerification()
    .then( () => {
        this.setState({emailAlertOpen: true})
    })
    .catch( err => {console.log(err)})
  }

  render(){
    return (
      <Grid container align="center">
      <Grid item xs={12}>
        <Collapse in={this.state.emailAlertOpen}>
          <Alert onClose={() => {this.setState({emailAlertOpen: false})}}>
            Email sent!
          </Alert>
        </Collapse>
      </Grid>
      <Grid item xs={12}>
          <Paper elevation={2} >
          </Paper>
          {
          !this.state.user.emailVerified
          ?
          
            <Paper elevation={2}>
              <Button variant="outline" onClick={this.sendVerificationEmail.bind(this)} >
               <Typography  variant="h5" component="h3">
                  Send Verification Email
                </Typography>
              </Button>
            </Paper>
          :
            <React.Fragment></React.Fragment>
          }


          <Paper elevation={2}>
            <OwnerBox user={this.state.user}
              userMD={this.state.userMD}
            />
          </Paper>
      </Grid>




      <Grid item xs={12}>
        <Grid item xs={12} className="compBorderOutline">
          <Paper elevation={2}>
            <Button variant="outlined" color="secondary"
                      onClick={this.props.onLogout}>
                  <Typography variant="h6" component="h6">
                    Logout
                  </Typography>
            </Button>
          </Paper>
          
        </Grid>
      </Grid>
    </Grid>

    )
  }
}



export default class ProfilePage extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD
    }  
  }

 
  handleLogout(){
    firebase.auth().signOut().then(() => {
      alert('Signed Out');
      this.setState({user: null})
    }, (error) => {
      console.error('Sign Out Error', error )
    });
  }

  /*
    login.js has the form and does the login, calls this with the user obj
  */
  handleLogIn(user){
      this.setState({user: user} )
  }

  componentWillReceiveProps(newProps){
    this.setState({...newProps})
  }


  render () {
    
    return (
    	<Grid item xs={12} id="profilepage">
        {
          this.state.user !== null
          ? <PageContent 
                onLogout={this.handleLogout.bind(this)} 
                user= {this.state.user}
                userMD={this.state.userMD}
            />
          : <Login 
            onLogin={this.handleLogIn.bind(this)} />
        }
  		</Grid>
    );
  }
}

