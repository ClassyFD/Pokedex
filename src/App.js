import React, { Component } from 'react';
import getPokemonInfo from './Components/Info/service';
import axios from 'axios';
import './App.css';
class App extends Component {
  constructor(props){
    super(props);
      this.state={
        pokemonToDisplay:[],
        currentPokemonShown:[],
        screenIsOn: false,
        hiddenImage:true,
        isShiny:false,
        isExpanded: false,
        scrolled:0,
        urlNumber:0,
        url: 'http://pokeapi.co/api/v2/pokemon/?offset=',
        fullUrl:'http://pokeapi.co/api/v2/pokemon/?limit=810',
        pokemonSearched:'',
      }
  }

  // initial loading of all pokemon
  // set '?limit=#' to the number of pokemon you want to display
  // set '?offset=#' to the last pokemon of the generation you want to skip
  // Gen 1 pokemon: 1 - 151
  // Gen 2 pokemon 152 - 251
  // Gen 3 pokemon 252 - 386
  // Gen 4 pokemon 387 - 493
  // Gen 5 pokemon 494 - 649
  // Gen 6 pokemon 650 - 721
  // All other pokemon 721 - 810
  componentDidMount(){
    axios.get(this.state.url + this.state.urlNumber)
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

      getPokemonInfo(url).then((response) => {this.state.hiddenImage===true? 
        this.setState({hiddenImage:false}): null
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
        currentPokemonShown: response,
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
      spriteExpand.add('expand_animation') + 
      spriteExpand.remove('hide_animation') + 
      this.setState({isExpanded:true}): 
      spriteExpand.remove('expand_animation') + 
      spriteExpand.add('hide_animation') + 
      this.setState({isExpanded: false}) 
  }

  //scrolling the mini screen to the right!
  scrollRight(){
    this.state.scrolled === 3135?
    axios.get(this.state.url + this.state.urlNumber).then((response)=> {
      this.setState({
        pokemonToDisplay: response.data.results,
        scrolled: 165
      })
    }):
    this.state.scrolled <= 3135?
    this.setState({
      scrolled: this.state.scrolled + 165,
      urlNumber:  this.state.urlNumber + 1
    }) : null
  }

  // scrolling the mini screen to the left!
  scrollLeft(){
    this.state.pokemonToDisplay[0].name === 'bulbasaur' && this.state.scrolled===0? null : 
    this.state.scrolled === 0?
    axios.get(this.state.url + (this.state.urlNumber - 19)).then((response)=>{
      this.setState({
        pokemonToDisplay: response.data.results,
        scrolled: 2970
      })
    }) : 
    this.state.scrolled >= 0?
    this.setState({
      scrolled: this.state.scrolled - 165,
      urlNumber:  this.state.urlNumber - 1
    }) : null 
  }

  textChanged(event){
    this.setState({
      searchForm: event.target.value
    })
  }

  searchPokemon(event){
    var name = this.state.searchForm
    event.preventDefault();
    axios.get(this.state.fullUrl).then((response)=>{
      console.log(response.data.results.forEach((e)=>{
        name.toLowerCase() === e.name? this.setState({
          pokemonSearched: e
        }): null
      }));
        
    })
  }

  clearEntry(){
    this.setState({
      searchForm: '',
      searchPokemon: '',
      pokemonSearched: ''
    })
  }
  //rendering everything!
  render() {

    var keys = {};
    window.addEventListener("keydown",
    function(e){
      keys[e.keyCode] = true;
      switch(e.keyCode){
        case 37: case 39: case 38:  case 40: // Arrow keys
        case 32: e.preventDefault(); break; // Space
        default: break; // do not block other keys
      }
    },
    false);
    window.addEventListener('keyup',
      function(e){
        keys[e.keyCode] = false;
      },
    false);

    var pokemonReceived =( 
    <section className='search_section' hidden={this.state.screenIsOn? false : this.state.pokemonSearched? false: true}>
       <div className='name_searched'>{this.state.pokemonSearched.name}</div> 
       <button className="button_show_searched" onClick={(e)=>this.getPokemon(this.state.pokemonSearched.url)}> Show! </button>
       <button className="clear_button" onClick={(e)=>this.clearEntry()}>Clear!</button>   
    </section>);

    var initial = this.state.pokemonToDisplay.map((key)=>{
      return(
        <div className={this.state.screenIsOn === false? 'end': 'start'}>
          <section style={{position:'relative',left: '-' + this.state.scrolled + 'px'}}>
            <div className='name'>{key.name}</div>
            <button className="button_show" onClick={(e)=>this.getPokemon(key.url)}> Show! </button>
          </section>
        </div>
      )
    })
      /*       notes for stats      */
      /* [0] : name                 */
      /* [1] : height               */
      /* [2] : weight               */
      /* [3] : first type           */
      /* [4] : second type          */
      /* [5] : front_default_sprite */
      /* [6] : front_shiny_sprite   */
      /* [7] : back__default_sprite */
      /* [8] : back__shiny_sprite   */
    var current = ( 
      <section>
        <div className="stats">
          <div>Name: {this.state.screenIsOn? this.state.currentPokemonShown[0] : null}</div>
          <div>Height: {this.state.screenIsOn? this.state.currentPokemonShown[1] : null}</div>
          <div>Weight: {this.state.screenIsOn? this.state.currentPokemonShown[2] : null}</div>
          <div>Type: {this.state.screenIsOn && this.state.hiddenImage === false?  
            this.state.currentPokemonShown[3] + this.state.currentPokemonShown[4] : null}
          </div>
        </div>
        <div className='sprite'>
          <img className="sprite_front" alt='This pokemon does not have a sprite available!' hidden={this.state.screenIsOn && this.state.isExpanded? 
          this.state.hiddenImage : true} src={this.state.currentPokemonShown[5]}/> 
          <img className="sprite_front_shiny" alt='This pokemon does not have a shiny sprite available!' hidden={this.state.screenIsOn && this.state.isExpanded? 
          this.state.hiddenImage : true} src={this.state.currentPokemonShown[6]}/> 
          <img className="sprite_back" alt='This pokemon does not have a sprite available!' hidden={this.state.screenIsOn && this.state.isExpanded? 
          this.state.hiddenImage : true} src={this.state.currentPokemonShown[7]}/> 
          <img className="sprite_back_shiny" alt='This pokemon does not have a shiny sprite available!' hidden={this.state.screenIsOn && this.state.isExpanded? 
          this.state.hiddenImage : true} src={this.state.currentPokemonShown[8]}/> 
          <img className="sprite_size" alt='Sprite should be here!' hidden={this.state.screenIsOn && !this.state.isExpanded? this.state.hiddenImage : true} src={this.state.isShiny? 
          this.state.currentPokemonShown[6] : this.state.currentPokemonShown[5]}/>
        </div>
      </section>
    )
    //putting everything in place!
    return (
      <section className="container">
        <div>
          <div className='pic'>
            <button className="expand" onClick={(e)=>this.expandPokemon(this.state.currentId)}>
              {!this.state.isExpanded? 'Show Sprites!':'Hide Sprites!'}
            </button>
            <button className="shinify" onClick={(e)=> this.shinify()}>shinify!</button>
            <div style={{opacity:this.state.isShiny? 1 : .3 }} className='shinyStatus'>SHINY</div>
            <div style={{opacity:this.state.isShiny? .3 : 1 }} className='defaultStatus'>DEFAULT</div>
            {current} 
          </div>
        </div>
        <div className='search_pic'>
          <form onSubmit={(e)=>this.searchPokemon(e)}>
            <input maxLength='17' className='search_form' onChange={(e)=>this.textChanged(e)}/>
          </form> 
          <div>
            {pokemonReceived}
          </div>  
        </div>
        <div className='smaller_pic'>
          <div className="left_arrow" onClick={(e)=>this.scrollLeft()}></div>
          <div className="right_arrow" onClick={(e)=>this.scrollRight()}></div>
          <button className='button_display' onClick={(e)=> this.displayPokemon(e.target.value)}> </button>
          <div className="scroll">
            {initial}
          </div>
        </div>
      </section>
    );
  }
}

export default App;
