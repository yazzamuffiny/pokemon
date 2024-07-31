import {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import { PokeContext } from '../context/PokeContext'
import { useNavigate } from 'react-router-dom'
import { ThreeDots } from 'react-loader-spinner'

//icons import
import { BsFillDpadFill } from "react-icons/bs";
import { BsX } from "react-icons/bs";
import { TiTick } from "react-icons/ti";

const typeColors = {
  normal: '#9FA19F',
  fire: '#E62829',
  water: '#2980EF',
  grass: '#3FA129',
  electric: '#FAC000',
  ice: '#3DCEF3',
  fighting: '#FF8000',
  poison: '#9141CB',
  ground: '#915121',
  flying: '#81B9EF',
  psychic: '#EF4179',
  bug: '#91A119',
  rock: '#AFA981',
  ghost: '#704170',
  dragon: '#5060E1',
  dark: '#624D4E',
  steel: '#60A1B8',
  fairy: '#EF70EF',
};

const Homepage = () => {
  // set up the context
  const {setSelectedPokemon} = useContext(PokeContext)
  // set a loading state
  const [loading, setLoading] = useState(true)
  // set state for search
  const [searchTerm, setSearchTerm] = useState('')
  // set state for Types
  const [type, setType] = useState('')
  // set up a filtered state
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  // set up pokemon state for returned pokemon
  const [pokedex, setPokedex] = useState([])
  // initialize Navigate
  const navigate = useNavigate()

  // Fetch Pokemon Function
  const fetchPokemon = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=151`)
      const pokemonData = response.data.results
      console.log(pokemonData);
      
      // Get the detailed data by using the pokemon.url
      const detailedPokemonData = await Promise.all(
        pokemonData.map(async (pokemon) => {
          const pokemonResponse = await axios.get(pokemon.url)
          const type = pokemonResponse.data.types.map((typeData) => typeData.type.name)
          const ability = pokemonResponse.data.abilities.map((abilityData) => abilityData.ability.name)
          const id = pokemonResponse.data.id
          return {
            id: id,
            name: pokemon.name,
            imageURL: pokemonResponse.data.sprites.other['official-artwork'].front_default,
            ability: ability,
            types: type,
            height: pokemonResponse.data.height,
            weight: pokemonResponse.data.weight
          }
        })
      )

      // add onSelect to each pokemon
      // onSelect set the context equal to that selected Pokemon
      const pokemons = detailedPokemonData.map((pokemon) => {
        return {
          ...pokemon,
          onSelect: () => setSelectedPokemon(pokemon)
        }
      })
      setLoading(false)
      // take the pokemons from above and add to state variable (pokedex) so i can filter
      setPokedex(pokemons)
      // filtering - initial filter sate with all the pokedex data
      setFilteredPokemon(pokemons)

    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  // Initial Render API Call
  useEffect(() => {
    fetchPokemon()
  }, []) // run once

  // Search or filter changes
  useEffect(() => {
    const filteredData = pokedex.filter((pokemon) => {
      const nameMatch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      const typeMatch = !type || pokemon.types.includes(type.toLowerCase())
      return nameMatch && typeMatch
    })

    setFilteredPokemon(filteredData)
  }, [searchTerm, type])

  return (
    <div className='pokedex'>
        <div className='screen'>
            <div className='pokemon-display-grid'>
                {loading ? (
                <ThreeDots color='red' height={400} width={400}/>
                ) : pokedex.length === 0 ? (<p>No Pokemon Found</p>) : (
                filteredPokemon.map((item, index) => (
                    <div
                    key={index}
                    className='pokemon-card'
                    style={{borderColor: typeColors[item.types[0].toLowerCase()]}}
                    onClick={() => {
                        item.onSelect()
                        navigate('/pokemon/')
                    }}
                    >
                        <div className="pokemon-info">
                            <div className="inner"
                              style={{borderLeftColor: typeColors[item.types[0].toLowerCase()], borderRightColor: typeColors[item.types[0].toLowerCase()]}}
                            >
                            <p>{item.name.toUpperCase()}</p>
                            </div>
                        </div>
                        <img src={item.imageURL} alt={item.name}/>
                        <div className="pokemon-info">
                            <div className="inner"
                              style={{borderLeftColor: typeColors[item.types[0].toLowerCase()], borderRightColor: typeColors[item.types[0].toLowerCase()]}}
                            >
                            <p>{item.types.join(", ").toUpperCase()}</p>
                            </div>
                        </div>
                    </div>
                ))
                )}
            </div>
            
        </div>
        <div className="bottom-panel">
            <div className="panel-top">
            <div className='search-container'>
                <label htmlFor='search'>Search:</label>
                <input
                type='text'
                name='search'
                id='search'
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                />
            </div>

            <div className='type-container'>
                <label htmlFor='type'>Type:</label>
                <select
                name='type'
                id='type'
                value={type}
                onChange={(event) => setType(event.target.value)}
                >
                <option value=''>Choose Type...</option>
                <option value='normal'>normal</option>
                <option value='fire'>fire</option>
                <option value='water'>water</option>
                <option value='grass'>grass</option>
                <option value='electric'>electric</option>
                <option value='ice'>ice</option>
                <option value='fighting'>fighting</option>
                <option value='poison'>poison</option>
                <option value='ground'>ground</option>
                <option value='flying'>flying</option>
                <option value='psychic'>psychic</option>
                <option value='bug'>bug</option>
                <option value='rock'>rock</option>
                <option value='ghost'>ghost</option>
                <option value='dragon'>dragon</option>
                <option value='dark'>dark</option>
                <option value='steel'>steel</option>
                <option value='fairy'>fairy</option>
                </select>
            </div>
            </div>
            <div className="panel-main">
                <div className="dpad">
                    <BsFillDpadFill className='dpad-icon'/>
                </div>
                <div className="panel-screen">
                    text of some kind?
                </div>
                <div className="buttons">
                    <BsX className='x-icon'/>
                    <TiTick className='tick-icon'/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Homepage