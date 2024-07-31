import React from 'react'

import { MdCatchingPokemon } from "react-icons/md";
import { SiPokemon } from "react-icons/si";

const Header = () => {
  return (
    <div className='header'>
      <div>
        <MdCatchingPokemon className='logo'/>
      </div>
      <div>
       <p className='title'>POKEDEX</p>
      </div>
      <div>
        <MdCatchingPokemon className='logo'/>
      </div>
    </div>
  )
}

export default Header
