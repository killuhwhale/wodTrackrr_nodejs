import firebase from "../../context/firebaseContext"
import "firebase/auth";
import "firebase/database"; 


import React, { Component } from 'react'

import 
{ 	Grid, Paper, Button, Typography, TextField, Select,
	TableRow, TableHead, TableContainer,
	TableBody, Table, Checkbox
} 
from '@material-ui/core';
import {TableCell as TC} from '@material-ui/core';
import { withTheme, withStyles } from '@material-ui/core/styles';

import { setGymClass } from "../../utils/firestore/gymClass"

let fs = firebase.firestore();

const TableCell = withStyles({root:{
	borderBottom: "none"
}})(TC)

class AddGymClass extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: props.user,
      userMD: props.userMD,
      userBoxes: props.userBoxes,
      hasBoxes: props.hasBoxes,
	  title: "",
	  box: {},
	  isPrivate: false
    }
  }
 
  componentDidMount(){
  }


  static getDerivedStateFromProps(props, state){
	if(props.userBoxes.length > 0){
		return{...props,
			 box: props.userBoxes[0]
		}
	}
	return props
  }

  onKeyUp(data){
    if((data.keyCode || data.which) == 13){
      this.createGymClass()
    }
  }

  createGymClass(){
	let title = this.state.title
	let box = this.state.box
	let isPrivate = this.state.isPrivate
	
	console.log("Creating class")
	console.log(title, box, isPrivate)
	if(!title || !box || isPrivate === null)
		return

	setGymClass(title, this.props.user.uid, box.boxID, box.title, isPrivate)
	.then(res => {console.log(res)})
	.catch(err => {console.log(err)})
  }

  handleCheckboxChange(ev){
	  let checked = ev.target.checked
	  console.log(checked)
	  this.setState({isPrivate: checked})
  }

  onTitleChange(ev){
	this.setState({title: ev.target.value})
  }

  onSelectChange(ev){
	this.setState({box: JSON.parse(ev.target.value)})
  }

  render () {
    return (
    	<Grid item xs={12}>
			<Table>
				<TableBody>
					<TableRow>
						<TableCell>
							Gym
						</TableCell>
						<TableCell>
							<Select native
								style={{width: "100%"}}
								onChange={this.onSelectChange.bind(this)}
								inputProps={{
									name: 'Box',
									id: 'addGymClassBox'
								}}>
								{this.state.hasBoxes ?
									this.state.userBoxes.map((box, i) => {
										return (<option key={i} value={JSON.stringify(box)} >
															{box["title"]}
														</option>)
									})
								:
									<option aria-label="None" value="" >No boxes!</option>
								}
							</Select>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Title</TableCell>
						<TableCell>
							<TextField
								id="addGymClassTitle"
								type="text"
								pattern="[\sA-Za-z0-9]{35}"
								onChange={this.onTitleChange.bind(this)}
								inputProps={{
								title: "Letters only, max length 35",
								placeholder: "Name of class"
								}}
								onKeyUp={this.onKeyUp.bind(this) }
								margin="normal"
								color="primary"
								style={{width: "100%"}}
								InputLabelProps={{
								shrink: true,
								}}
							/>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Private</TableCell>
						<TableCell>
						<Checkbox
							checked={this.state.isPrivate}
							onChange={this.handleCheckboxChange.bind(this)}
						/>
						</TableCell>
					</TableRow>
					<TableRow>
							<TableCell align="center" colSpan={2}>
								<Button size="small" variant="outlined" color="primary" 
										onClick={ this.createGymClass.bind(this)} >
									Submit
								</Button>
							</TableCell>
					</TableRow>
				</TableBody>
			</Table>
  		</Grid>
    )
  }
}

export default AddGymClass = withTheme(AddGymClass);