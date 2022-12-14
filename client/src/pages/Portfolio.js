import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../utilities/userContext';
import PortfolioRow from '../components/PortfolioRow';
import { Button } from 'react-bootstrap';

const Portfolio = () => {

  const navigate = useNavigate();
  const [data, setData] = useContext(UserContext);
  const [add, setAdd] = useState(true);
  const [name, setName] = useState('');

  const url = 'http://127.0.0.1:5000/logout';

  const handleLogout = async () => {
    await axios.get(url, {
      withCredentials: true
    });
    navigate('/');
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    await axios.post('http://127.0.0.1:5000/portfolio', {
      portfolio: name
    }, {
      withCredentials: true
    });
    await fetch();
    toggleAdd();
  }

  const addPortfolioElement = () => {
    return <form onSubmit={handleAdd}>
      <input type='text' value={name} onChange={(e) => setName(e.target.value)}></input>
      <button type='submit'>Submit</button>
    </form>
  }

  const fetch = async () => {
    const res = await axios.get('http://127.0.0.1:5000/portfolio', { withCredentials: true });
    if (res.status === 200) {
      setData({
        user: res.data.user,
        portfolios: res.data.portfolios,
        investments: res.data.netWorth,
        obj: res.data.obj,
      });
    }
  }

  const toggleAdd = () => setAdd(!add);

  useEffect(() => {
    fetch();
  }, []);

  // const x=()=>{
  //   const y= document.getElementById("topLevelPortfolioDiv").parentElement
  //   y.classList.remove("auth-inner")
  // }


  return (
    <div id="topLevelPortfolioDiv">
      <p>Portfolio</p>
      <h2 style={{textAlign: "center"}}> Current Net Worth is ${Math.round(data.investments)}</h2>
      <table>
        <tbody>
          {data.portfolios && data.portfolios.map((portfolio) => {
            return (
              <PortfolioRow
                key={portfolio._id}
                name={portfolio.name}
                id={portfolio._id}
                worth={data.obj.find(item=>item.name===portfolio.name).value}
              />
            )
          })}
        </tbody>
      </table>
      {add ?
        <Button variant="primary" onClick={toggleAdd}>Add</Button>
        : addPortfolioElement()}
      <Button variant="danger" onClick={handleLogout}>Log Out</Button>
    </div>
  )
}

export default Portfolio