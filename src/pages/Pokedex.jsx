import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Button from '@mui/material/Button';
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import "../Battle.css"

export default function Pokedex() {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [team1, setTeam1] = useState([]);
  const [team2, setTeam2] = useState([]);
  const navigate = useNavigate();
  const handleBattle = () => {
    console.log('Navigating to battle page...');
    navigate('/battle', {
      state: {
        team1,
        team2,
      },
    });
  };

  const handleAdd = async (team, setTeam, input, setInput) => {
    if (!input || team.length >= 3) return;

    try {
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${input.toLowerCase()}`);
      const data = res.data;
      console.log(data);
      const newPokemon = {
        name: data.name,
        image: data.sprites.front_default,
        image2:data.sprites.back_default,
        abilities: data.abilities,
        defense: data.stats.find(stat => stat.stat.name === "defense").base_stat,
        moves : data.moves,
      };

      setTeam([...team, newPokemon]);
      setInput('');
    } catch (err) {
      alert('Pokémon not found!');
    }
  };

  return (  
  <>
  <div style={{ textAlign: 'center', flex: 1 }}>
    <img src="https://fontmeme.com/permalink/250520/fd5a7fbba7a9bcd4829a7f5acbfb2ae4.png" alt="pokemon-font" border="0"/>
  </div>
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: '20px',
      gap: '40px',
    }}
  >
    {/* TEAM 1 */}
    <div style={{ textAlign: 'center', flex: 1 , marginLeft:'100px'}}>
      <h1 style={{ fontFamily: "'Pokemon Solid', sans-serif" }}>TEAM 1</h1>
      {team1.length < 3 && (
        <div>
          <TextField
          style={{border: '2px solid black'}}
            type="text"
            variant="outlined" 
            placeholder="Enter Pokémon name"
            value={input1}
            onChange={(e) => setInput1(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' && handleAdd(team1, setTeam1, input1, setInput1)
            }
          />
          <br /><br />
          <Button style={{border: '2px solid black'}} variant="contained" endIcon={<SearchIcon/>} onClick={() => handleAdd(team1, setTeam1, input1, setInput1)}>
            Choose
          </Button>
          <br /><br />
        </div>
      )}
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'flex-start' }}>
        {team1.map((p, i) => (
          <div> 
            <img src={p.image} alt={p.name} style={{height:'200px',marginTop:'10px'}}/>
            <Card 
            key={p.name}
            style= {{textAlign: 'center',height:'100px',width:'200px'}} sx={{ maxWidth: 345 }}>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div" style={{textTransform: 'uppercase',fontFamily: "'Pokemon Solid', sans-serif"}}>
                    {p.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }} style={{textTransform: 'uppercase',fontFamily: "'Pokemon Solid', sans-serif"}}>
                    Defense : {p.defense}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
            </div>
        ))}
      </div>
    </div>

    {/* TEAM 2 */}
    <div style={{ textAlign: 'center', flex: 1 ,marginRight:'100px'}}>
      <h1 style={{ fontFamily: "'Pokemon Solid', sans-serif" }}>TEAM 2</h1>
      {team2.length < 3 && (
        <div>
          <TextField
            type="text"
            style={{border: '2px solid black'}}
            placeholder="Enter Pokémon name"
            value={input2}
            onChange={(e) => setInput2(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' && handleAdd(team2, setTeam2, input2, setInput2)
            }
          />
          <br /><br />
          <Button style={{border: '2px solid black'}} variant="contained" endIcon={<SearchIcon/>} onClick={() => handleAdd(team2, setTeam2, input2, setInput2)}>
            Choose
          </Button>
          <br /><br />
        </div>
      )}
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'flex-end'}}>
        {team2.map((p, i) => (
          <div>
          <img src={p.image} alt={p.name} style={{height:'200px',marginTop:'10px'}}/>
          <Card 
           key={p.name}
          style= {{textAlign: 'center',height:'100px',width:'200px'}} sx={{ maxWidth: 345 }}>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div" style={{textTransform: 'uppercase',fontFamily: "'Pokemon Solid', sans-serif" }}>
                    {p.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }} style={{textTransform: 'uppercase',fontFamily: "'Pokemon Solid', sans-serif"}}>
                    Defense : {p.defense}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </div>
        ))}
      </div>
    </div>
    <br />
  </div>
  {(team2.length===3 && team1.length===3 ) && <div style={{ display: 'flex', justifyContent: 'center',marginTop: '20px'}}>
     <Button variant="outlined" color="error" 
     style={{height:'100px', width: '400px', fontSize:'50px',fontFamily: "'Pokemon Solid', sans-serif"}} 
     startIcon={<CatchingPokemonIcon style={{ fontSize: '60px' }}/>}
     onClick= {handleBattle} 
     >BATTLE</Button>
  </div>
  }
  </>
);

}
