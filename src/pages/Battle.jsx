import { useLocation , useNavigate} from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useState, useEffect } from 'react';
import "../Battle.css"

export default function Battle() {
  const location = useLocation();
  const navigate = useNavigate();
  const { team1, team2 } = location.state || { team1: [], team2: [] };
  const [index1, setIndex1] = useState(0);
  const [index2, setIndex2] = useState(0);
  const [pokemon1, setPokemon1] = useState(team1[0]); 
  const [pokemon2, setPokemon2] = useState(team2[0]);
  const [hp1, setHp1] = useState(100);
  const [hp2, setHp2] = useState(100);
  const [count, setCount] = useState(0);

  const attack1 = async (pokemon, moveUrl) => {
    const res = await getMovePower(moveUrl);
    let damage = res - Math.floor(pokemon.defense / 10);
    if(damage<0){damage=0;}
    setHp2(prev => Math.max(prev - damage, 0));
    setCount(1);
  };

  const attack2 = async (pokemon, moveUrl) => {
    const res = await getMovePower(moveUrl);
    let damage = res - Math.floor(pokemon.defense / 10);
    if(damage<0){damage=0;}
    setHp1(prev => Math.max(prev - damage, 0));
    setCount(0);
  };

  useEffect(() => {
    if (hp1 === 0 && index1 < team1.length - 1) {
      const nextIndex = index1 + 1;
      setIndex1(nextIndex);
      setPokemon1(team1[nextIndex]);
      setHp1(100);
    }
  }, [hp1, index1, team1]);

  useEffect(() => {
    if (hp2 === 0 && index2 < team2.length - 1) {
      const nextIndex = index2 + 1;
      setIndex2(nextIndex);
      setPokemon2(team2[nextIndex]);
      setHp2(100);
    }
  }, [hp2, index2, team2]);

  const battleEnded = (pokemon1 === team1[2] && hp1 === 0) || (pokemon2 === team2[2] && hp2 === 0);

  useEffect(() => {
    if (battleEnded) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [battleEnded, navigate]);

  const getMovePower = async (moveUrl) => {
    try {
      const res = await axios.get(moveUrl);
      const moveData = res.data;
      return moveData.power ?? 0;
    } catch (err) {
      return 0;
    }
  };

  return (
    <>
      {(index1 < team1.length && index2 < team2.length && hp1 !== 0 && hp2 !== 0) &&
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            padding: '20px',
            gap: '40px',
          }}
        >
          <div style={{ textAlign: 'center', flex: 1, marginLeft: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <img src="https://fontmeme.com/permalink/250521/df3127a99d94b9bcd891686b2607e3a6.png" alt="pokemon-font" border="0" style={{ height: '100px', width: '200px' }} />
            <img src={pokemon1.image2} alt={pokemon1.name} style={{height:'250px',marginTop:'100px'}}/>
            <Card
              key={pokemon1.name}
              style={{ textAlign: 'center', height: '140px', width: '200px'}} sx={{ maxWidth: 345 }}>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div" style={{ textTransform: 'uppercase', fontFamily: "'Pokemon Solid', sans-serif" }}>
                    {pokemon1.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }} style={{ textTransform: 'uppercase', fontFamily: "'Pokemon Solid', sans-serif" }}>
                    HP: {hp1}
                    <br />
                    Defense: {pokemon1.defense}
                  </Typography>
                  <div style={{ width: '100%', backgroundColor: '#ddd', height: '20px', borderRadius: '10px', marginBottom: '10px',marginTop:'10px' }}>
                  <div style={{
                    width: `${hp1}%`,
                    backgroundColor: 'green',
                    height: '100%',
                    borderRadius: '10px',
                    transition: 'width 0.5s ease-in-out'
                  }} />
                </div>
                </CardContent>
              </CardActionArea>
            </Card>
            {(count % 2 === 0) &&
              <div>
                Choose an attack!
                <br />
                {pokemon1.moves.slice(0, 4).map((move, idx) => (
                  <Button
                    key={idx}
                    onClick={() => attack1(pokemon2, move.move.url)}
                    style={{ border: '2px solid black', margin: '5px' }}
                    variant="contained"
                  >
                    {move.move.name}
                  </Button>
                ))}
              </div>
            }
          </div>
          <div style={{ marginTop: '260px' }}>
            <h1 style={{ color: 'red' }}>V/S</h1>
          </div>
          <div style={{ textAlign: 'center', flex: 1, marginRight: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <img src="https://fontmeme.com/permalink/250521/7850ffa96c7785053ea17fe4d47193a6.png" alt="pokemon-font" border="0" style={{ height: '100px', width: '200px' }} />
            <img src={pokemon2.image} alt={pokemon2.name} style={{height:'250px',marginTop:'10px'}}/>
            <Card
              key={pokemon2.name}
              style={{ textAlign: 'center', height: '150px', width: '200px'}} sx={{ maxWidth: 345 }}>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div" style={{ textTransform: 'uppercase', fontFamily: "'Pokemon Solid', sans-serif" }}>
                    {pokemon2.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }} style={{ textTransform: 'uppercase', fontFamily: "'Pokemon Solid', sans-serif" }}>
                    HP: {hp2}
                    <br />
                    Defense: {pokemon2.defense}
                  </Typography>
                  <div style={{ width: '100%', backgroundColor: '#ddd', height: '20px', borderRadius: '10px', marginBottom: '10px',marginTop:'10px' }}>
                    <div style={{
                      width: `${hp2}%`,
                      backgroundColor: 'green',
                      height: '100%',
                      borderRadius: '10px',
                      transition: 'width 0.5s ease-in-out'
                    }} />
                  </div>
                </CardContent>
              </CardActionArea>
            </Card>
            {(count % 2 !== 0) &&
              <div>
                Choose an attack!
                <br />
                {pokemon2.moves.slice(0, 4).map((move, idx) => (
                  <Button
                    key={idx}
                    onClick={() => attack2(pokemon1, move.move.url)}
                    style={{ border: '2px solid black', margin: '5px' }}
                    variant="contained"
                  >
                    {move.move.name}
                  </Button>
                ))}
              </div>
            }
          </div>
        </div>
      }
      {(index1 === team1.length - 1 && hp1 === 0) &&
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', gap: '40px', flexDirection: 'column' }}>
          <img src="https://fontmeme.com/permalink/250521/8aaf1411f71a9e642314c6e8e5cff622.png" alt="pokemon-font" border="0" style={{ height: '100px' }} />
          <div>
            {team2.map((p, i) => (
              <img key={i} src={p.image} alt={`pokemon${i}`} style={{ height: '250px', margin: '10px' }} />
            ))}
          </div>
        </div>
      }
      {(index2 === team2.length - 1 && hp2 === 0) &&
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', gap: '40px', flexDirection: 'column' }}>
          <img src="https://fontmeme.com/permalink/250521/000cc63ff1cc4f25bff614b9fbb6ab2f.png" alt="pokemon-font" border="0" style={{ height: '100px' }} />
          <div>
            {team1.map((p, i) => (
              <img key={i} src={p.image} alt={`pokemon${i}`} style={{ height: '250px', margin: '10px' }} />
            ))}
          </div>
        </div>
      }
    </>
  );
}
