import axios from 'axios';

//Getting the info for a specific pokemon
export default function getPokemonInfo(url) {
 return axios.get(url).then((response)=> {
     var weight = response.data.weight.toString().split(''); 
     weight.splice(weight.length-1, 0, '.')
     var height = response.data.height.toString().split(''); 
     height.splice(height.length-1, 0, '.')
      return [
        response.data.name, 
        height.join('')+' meters',  
        weight.join('')+'kg', 
        response.data.types[0].type.name, 
        ((response.data.types[1])? ', '+ response.data.types[1].type.name: ''),
        response.data.sprites.front_default,
        response.data.sprites.front_shiny,
        response.data.sprites.back_default,
        response.data.sprites.back_shiny,
      ]
    }
  )
}