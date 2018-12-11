import React, { Component } from 'react';
import Input from './Input';

class Input extends Component {
  state = { 
    state = {
      newstitle = ""
    }
   }
   handleChange = e => {
     this.setState({newstitle : e.target.value})
   }

   handleSubmit = e =>{
     e.preventDefault()
     this.props.onSubmit(this.state.newstitle);
     this.setState({newstitle: ''})
   }

  render() { 
    return ( 
      <form onSubmit={this.handleSubmit} className="input-field">
        <input type="text" className="title-input" onChange={this.handleChange}/>
        <input type="submit" className="title-submit">Enter</input>
      </form>
     )
  }
}
 
export default Input;