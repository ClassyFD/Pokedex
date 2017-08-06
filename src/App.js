import React, { Component } from 'react';
import getPokemonInfo from './Components/Info/service';
import './App.css';
import axios from 'axios';
// import List from './Components/ListOfPokemon/List'
class App extends Component {

  constructor(props){
    super(props);
    this.state={

      pokemonToDisplay:[],
      screenIsOn: false,
      currentPokemon:[],
      hiddenImage:true,
      isShiny:false,
      isExpanded: false,
    }
    this.componentDidMount = this.componentDidMount.bind(this);
    this.getPokemon = this.getPokemon.bind(this);
}

// initial loading of all pokemon
// set '?limit=#' to the number of pokemon you want
// set '?offset=#' to the number of pokemon you want to skip
componentDidMount() {
  let apiLink='http://pokeapi.co/api/v2/pokemon/?limit=200'
  axios.get(apiLink)
  .then((response)=> {
    this.setState({
      pokemonToDisplay: response.data.results
    })
  })       
}

// to turn the screen of the mini device on or off
displayPokemon(){
  !this.state.screenIsOn? 
    this.setState({
      screenIsOn: true
    }): 
    this.setState({
    screenIsOn:false
  });
}

// click the show button in the mini device for the pokemon to be displayed in the pokedex.
// also, animations!
getPokemon(url){
  const imageLoading = document.getElementsByClassName('sprite_size')[0].classList
        imageLoading.add('hidden')
        imageLoading.remove('display')
  const default_front = document.getElementsByClassName('sprite_front')[0].classList
        default_front.add('hide_stationary') 
        default_front.remove('show_stationary')

  const default_back = document.getElementsByClassName('sprite_back')[0].classList
        default_back.add('hide_back') 
        default_back.remove('show_back')

  const shiny_front = document.getElementsByClassName('sprite_front_shiny')[0].classList
        shiny_front.add('hide_front') 
        shiny_front.remove('show_front')

  const shiny_back = document.getElementsByClassName('sprite_back_shiny')[0].classList
        shiny_back.add('hide_back_down') 
        shiny_back.remove('show_back_down')

  getPokemonInfo(url).then((response) => {
    this.state.hiddenImage===true? this.setState({
        hiddenImage:false
    }): null
        default_front.remove('hide_stationary');
        default_front.add('show_stationary');
        shiny_front.remove('hide_front');
        shiny_front.add('show_front');
        default_back.remove('hide_back');
        default_back.add('show_back');
        shiny_back.remove('hide_back_down');
        shiny_back.add('show_back_down');

        imageLoading.remove('hidden')
        imageLoading.add('display')
    this.setState({
      currentPokemon: response,
    })
  })
}

//to switch the pokemon to shiny or default!
shinify() {
  this.state.isShiny? 
  this.setState({isShiny:false}): this.setState({isShiny:true})
}

//to show a bigger version of the screen!
expandPokemon(){
  const spriteExpand = document.getElementsByClassName('sprite')[0].classList
  !this.state.isExpanded?  
    spriteExpand.add('expand_animation'): 
    spriteExpand.remove('expand_animation')
  !this.state.isExpanded? 
    spriteExpand.remove('hide_animation'): 
    spriteExpand.add('hide_animation')
  !this.state.isExpanded? 
    this.setState({isExpanded:true}): 
    this.setState({isExpanded: false})
}

render() {
  const show = 'Show Sprites!'
  const hide = 'Hide Sprites!'
    var initial = this.state.pokemonToDisplay.map((key)=>{
      return(
        <div className={this.state.screenIsOn === false? 'end': 'start'}>
      <section>
      <div className='name'>{key.name}</div>
      <button className="button_show" onClick={(e)=>this.getPokemon(key.url)}> Show! </button>
      </section>
      </div>
        )
    })
      var current =
        ( 
          <section>
            {/*       notes for stats      */}
            {/* [0] : name                 */}
            {/* [1] : height               */}
            {/* [2] : weight               */}
            {/* [3] : first type           */}
            {/* [4] : second type          */}
            {/* [5] : front_default_sprite */}
            {/* [6] : front_shiny_sprite   */}
            {/* [7] : back__default_sprite */}
            {/* [8] : back__shiny_sprite   */}

          <div className="stats">
            <div>Name: {this.state.screenIsOn? this.state.currentPokemon[0] : null}</div>
            <div>Height: {this.state.screenIsOn? this.state.currentPokemon[1] : null}</div>
            <div>Weight: {this.state.screenIsOn? this.state.currentPokemon[2] : null}</div>
            <div>Type: {this.state.screenIsOn && this.state.hiddenImage === false?  
              this.state.currentPokemon[3] + this.state.currentPokemon[4] : null}</div>
          </div>
          <div className='sprite'>
            <img className="sprite_front" alt='Sprite should be here!' hidden={this.state.screenIsOn && this.state.isExpanded? 
            this.state.hiddenImage : true} src={this.state.currentPokemon[5]}/> 
            <img className="sprite_front_shiny" alt='this Pokemon is not shiny!' hidden={this.state.screenIsOn && this.state.isExpanded? 
            this.state.hiddenImage : true} src={this.state.currentPokemon[6]}/> 
            <img className="sprite_back" alt='this Pokemon is not shiny!' hidden={this.state.screenIsOn && this.state.isExpanded? 
            this.state.hiddenImage : true} src={this.state.currentPokemon[7]}/> 
            <img className="sprite_back_shiny" alt='this Pokemon is not shiny!' hidden={this.state.screenIsOn && this.state.isExpanded? 
            this.state.hiddenImage : true} src={this.state.currentPokemon[8]}/> 
            <img className="sprite_size" alt='Sprite should be here!' hidden={this.state.screenIsOn && !this.state.isExpanded? this.state.hiddenImage : true} src={this.state.isShiny? 
            this.state.currentPokemon[6] : this.state.currentPokemon[5]}/>
            </div>
          </section>
        )
    return (
      <section className="container">
        <div className="pics">
          <div className='pic'>
            <button className="expand" onClick={(e)=> this.expandPokemon(this.state.currentId)}>
              {!this.state.isExpanded? show:hide}</button>
            <button className="shinify" onClick={(e)=> this.shinify()}>shinify!</button>
            <div style={{opacity:this.state.isShiny? 1 : .3 }} className='shinyStatus'>SHINY</div>
            <div style={{opacity:this.state.isShiny? .3 : 1 }} className='defaultStatus'>DEFAULT</div>
              {current} 
          </div>
        </div>
        <div className='smaller_pic'>
            <button className='button_display' onClick={(e)=> this.displayPokemon(e.target.value)}> </button>
            <div className="scroll">
            {initial}
            </div>
          </div>
        {/* <List/> */}
     </section>
    );
  }
}

export default App;
