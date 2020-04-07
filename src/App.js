import React, { useEffect, useState } from 'react';
import axios from 'axios'
import './App.css';

const objectToParams =(obj) =>{
  const values = Object.entries(obj).map(([key,value])=> `${key}=${value}`)
  return '?' + values.join('&')
}

function App() {

  const [memes,setMemes] = useState([])
  const [show,setShow] = useState(false)
  const [current,setCurrent] = useState({})
  const [modalImg,setModalImg] = useState()
  const [form,setForm] = useState({
    text0:'',
    text1:''
  })

  useEffect(()=>{
    async function fetchData(){
      const response = await axios.get('https://api.imgflip.com/get_memes')
      setMemes(response.data.data.memes)
      setCurrent(response.data.data.memes[2])
    }
    fetchData()
  },[])


  const submitHandler = async() =>{
    try{
      const options = {template_id:current.id,username:'denba2013',password:'denba9090',...form,font:'Sans-serif'}
      const response = await fetch(`https://api.imgflip.com/caption_image${objectToParams(options)}`)
      const data = await response.json()
      setCurrent({id:current.id,url:data.data.url})
    }catch(e){}
  }

  const changeHandler =(event) =>{
    setForm({...form,
      [event.target.name]:event.target.value
    })
  }

  const changeMemHandler = event =>{
   setModalImg(memes[event.target.value])
  }
  const saveHandler = () =>{
    setCurrent(modalImg)
    setShow(false)
  }

  return (
    <div className="App">
      {show ? <div className="modal">
          <div className="modal-title">Change Mem</div>
          <div className="modal-data">
            <div className="mem-list">
              <select name="mem" id="mem" onChange={changeMemHandler}>
                {memes.map((mem,index) =>{
                  return <option key={mem.id} value={index}>{mem.name}</option>
                })}
              </select>
            </div>
            <div className="mem-img">
              {modalImg ? <img src={modalImg.url} alt='img' width='150px' height='150px'/> : null}
            </div>
          </div>
          <div className="modal-bottom">
            <button onClick={saveHandler}>Save</button>
            <button onClick={()=> setShow(false)}>Close</button>
          </div>
      </div>: null}
        <div className="meme-img">
          {memes.length ? <img src={current.url} alt='mem' width='550px' height='550px'></img> : null}

          <button onClick={() => setShow(true)}>Change Mem</button>
        </div>
        <div className="meme-create">
          <div className="input-field">
              <label htmlFor='text0'>Top Text</label>
              <input type='text' name='text0' id='text0' value={form.text0} onChange={changeHandler}/>
          </div>
          <div className="input-field">
            <label htmlFor='text1'>Bottom Text</label>
            <input type='text' name='text1' id='text1' value={form.text1} onChange={changeHandler}/>
          </div>
          <button onClick={submitHandler} className='submit-button'>Submit</button>
        </div>
    </div>
  );
}

export default App;
