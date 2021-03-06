import './result.css';
import tsinghua from '../images/tsinghua.png'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import Tooltip from '@mui/material/Tooltip';
import Pagination from '@mui/material/Pagination';
import cookies from 'react-cookies';

import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import InfoIcon from '@mui/icons-material/Info';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CircleIcon from '@mui/icons-material/Circle';
import { red, orange, yellow, green, grey, blue, brown, cyan, purple, pink } from '@mui/material/colors';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import { Search } from '../communication/communication';
import Autocomplete from '@mui/material/Autocomplete';

import { Predict, Upload } from '../communication/communication';

import { createSpeechlySpeechRecognition } from '@speechly/speech-recognition-polyfill';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const appId = 'c94b5e3c-1314-4718-8927-c6e8de71ca59';
const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

function Result() {
    const [keyword, setKeyword] = useState('');
    const history = useHistory();
    let keys = window.location.href.split('/');
    const len = keys.length;
    const [color, setColor] = useState(0);
    const [size, setSize] = useState(0);
    const [copen, setCopen] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState('');
    const [minW, setMinW] = useState(0)
    const [minH, setMinH] = useState(0)
    const [maxW, setMaxW] = useState(10000)
    const [maxH, setMaxH] = useState(10000)
    const [show, setShow] = useState(false)
    const [itemData, setItemData] = useState([])
    const [count, setCount] = useState(0)
    const [pages, setPages] = useState(0)
    const [time, setTime] = useState(0.0)
    const [currentPage, setCurrentPage] = useState(1)
    const [correction, setCorrection] = useState("")
    const [wordList, setWordList] = useState([])
    const [aopen, setAopen] = useState(false);
    const [image, setImage] = useState('')

    useEffect(() => {
      setKeyword(keys[len - 1].substring(8))
      if(keys[len - 1].substring(8) === '') {
        console.log("empty")
        console.log(cookies.load('id'))
        setImage(cookies.load('id'))
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const selecteFileHandler = (event) => {
      setSelectedFile(event.target.files[0]);
    };

    const handleAClickOpen = () => {
      setAopen(true);
      startListening();
    };
  
    const handleAClose = () => {
      setAopen(false);
    };

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const handleCClickOpen = () => {
      setMinW(0)
      setMinH(0)
      setMaxW(10000)
      setMaxH(10000)
      setCopen(true);
    };
  
    const handleCClose = () => {
      setCopen(false);
    };

    const handleChangeColor = (event) => {
      setColor(event.target.value);
      search(keys[len - 1].substring(8), image, minW, minH, maxW, maxH, event.target.value, currentPage, size)
    };

    const handleChangeSize = (event) => {
      setSize(event.target.value);
      setMinW(0)
      setMinH(0)
      setMaxW(10000)
      setMaxH(10000)
      if(event.target.value === 0 || event.target.value === 1 || event.target.value === 2 || event.target.value === 3) {
        search(keys[len - 1].substring(8), image, minW, minH, maxW, maxH, color, currentPage, event.target.value)
      }
      else if(event.target.value === 5)
        handleCClickOpen();
    };

    const predict = (key) => {
      const message = {
        input : key,
      }
      Predict(message)
      .then(
          (list) => {
            setWordList(list)
          }
      )
      .catch(
          (responce) => {}
      )
    }

    const {
      transcript,
      listening,
      resetTranscript,
    } = useSpeechRecognition();
    const startListening = () => SpeechRecognition.startListening({ continuous: true });

    const search = (key, i, min_width, min_height, max_width, max_height, color, page, size) => {
      const message = {
        key : key,
        image : i,
        min_width : min_width,
        min_height : min_height,
        max_width : max_width,
        max_height : max_height,
        color : color,
        page : page,
        size : size,
      }
      Search(message)
      .then(
          (responce) => {
              setItemData(responce.data)
              if(responce.correction !== '') {
                setShow(true)
                setCorrection(responce.correction)
              }
              else
                setShow(false)
              setCount(responce.count)
              setPages(responce.pages)
              setTime(responce.time)
          }
      )
      .catch(
          (responce) => {}
      )
    }


    useEffect(() => {
      if(keys[len - 1].substring(8) !== "")
        search(keys[len - 1].substring(8), "", minW, minH, maxW, maxH, 0, 1, 0)
      else
        search(keys[len - 1].substring(8), cookies.load('id'), minW, minH, maxW, maxH, 0, 1, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const uploadHandler = () => {
      const formData = new FormData();
      formData.append('image', selectedFile);
      Upload(formData)
      .then(
        (id) => {
          console.log(id)
          cookies.save('id', id, {
            expires: new Date(
                new Date().getTime() + 3600 * 4000
            )
          });
          history.push(`/keyword=`)
          setSelectedFile(null)
          setCurrentPage(1)
          search(keyword, id, minW, minH, maxW, maxH, color, 1, size)
          keys = window.location.href.split('/');
        }
      )
      .catch(
        (responce) => {}
      )
    }

    return (
        <div className="App1">
            <div className="search">
                <div className='block'>
                  <img src={tsinghua} className="App-logo1" alt="" 
                    onClick={() => {
                      history.push(`/`);
                    }}/>
                  <Paper component="form" elevation={0} sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 600 }}>
                <Autocomplete
                  freeSolo
                  id="free-solo-2-demo"
                  disableClearable
                  sx={{ ml: 1, flex: 1}}
                  options={wordList.map((option) => option.word)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="???Sansi?????????"
                      InputProps={{
                        ...params.InputProps,
                        type: 'search',
                      }}
                    />
                  )}
                  onInputChange={(event, newInputValue) => {
                    setKeyword(newInputValue);
                    predict(newInputValue);
                  }}
                  defaultValue={decodeURIComponent(keys[len - 1].substring(8))}
                  />
                <Tooltip title="????????????">
                    <IconButton
                        sx={{ p: '10px' }}
                        onClick={() => {
                          resetTranscript()
                          handleAClickOpen()
                        }}
                    >
                        <KeyboardVoiceIcon />
                    </IconButton>
                </Tooltip>

                <Tooltip title="????????????">
                    <IconButton
                        onClick={handleClickOpen}
                        sx={{ p: '10px' }} 
                    >
                        <CameraAltIcon />
                    </IconButton>
                </Tooltip>

                <Tooltip title="??????">
                    <IconButton 
                        sx={{ p: '10px' }}
                        onClick={() => {
                          if(keyword !== "") {
                            history.push(`/keyword=${keyword}`);
                            setCurrentPage(1)
                            search(keyword, image, minW, minH, maxW, maxH, color, 1, size)
                            keys = window.location.href.split('/');
                          }
                    }}
                >
                        <SearchIcon/> 
                    </IconButton>
                </Tooltip>
                  </Paper>
                </div>
            </div>
          <div>
            <Divider variant='middle'></Divider>
      <FormControl>
        {time !== 0.0 &&
        <Typography 
            variant="subtitle1" 
            gutterBottom component="div" 
            sx={{ m: 5, marginLeft: 20, marginRight: 15, color:grey[600]}}   
        >
          Sansi???????????????????????????{count}???????????????{time}???
        </Typography>}
        {time === 0.0 &&
        <Typography 
            variant="subtitle1" 
            gutterBottom component="div" 
            sx={{ m: 5, marginLeft: 20, marginRight: 15, color:grey[600]}}   
        >
          ?????????, ?????????...
        </Typography>}
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120, minHeight:60, marginRight: 6, marginTop: 3}}>
        <InputLabel>????????????</InputLabel>
        <Select
          value={size}
          label="????????????"
          onChange={handleChangeSize}
        >
          <MenuItem value={0}>??????</MenuItem>
          <MenuItem value={1}>???</MenuItem>
          <MenuItem value={2}>???</MenuItem>
          <MenuItem value={3}>???</MenuItem>
          <MenuItem 
            value={5}
            onClick={
              ()=>{
                if(copen === false)
                  handleCClickOpen()
              }
            }>?????????</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120, minHeight:60, marginTop: 3}}>
        <InputLabel>????????????</InputLabel>
        <Select
          value={color}
          label="????????????"
          onChange={handleChangeColor}
        >
          <MenuItem value={0}>
              ??????
          </MenuItem>
          <MenuItem value={1}>
              ??????
          </MenuItem>
          <MenuItem value={2}>
              ??????
          </MenuItem>
          <MenuItem value={3}>
            <CircleIcon
              sx={{
                marginRight: 1,
                maxHeight: 20,
                color:red[500]
              }}/>
            ???
          </MenuItem>
          <MenuItem value={4}>
            <CircleIcon
              sx={{
                marginRight: 1,
                maxHeight: 20,
                color:orange[500]
              }}/>
            ???
          </MenuItem>
          <MenuItem value={5}>
            <CircleIcon
              sx={{
                marginRight: 1,
                maxHeight: 20,
                color:yellow[500]
              }}/>
            ???
          </MenuItem>
          <MenuItem value={6}>
            <CircleIcon
              sx={{
                marginRight: 1,
                maxHeight: 20,
                color:green[500]
              }}/>
            ???
          </MenuItem>
          <MenuItem value={7}>
            <CircleIcon
              sx={{
                marginRight: 1,
                maxHeight: 20,
                color:cyan[500]
              }}/>
            ???
          </MenuItem>
          <MenuItem value={8}>
            <CircleIcon
              sx={{
                marginRight: 1,
                maxHeight: 20,
                color:blue[500]
              }}/>
            ???
          </MenuItem>
          <MenuItem value={9}>
            <CircleIcon
              sx={{
                marginRight: 1,
                maxHeight: 20,
                color:purple[500]
              }}/>
            ???
          </MenuItem>
          <MenuItem value={10}>
            <CircleIcon
              sx={{
                marginRight: 1,
                maxHeight: 20,
                color:pink[500]
              }}/>
            ???
          </MenuItem>
          <MenuItem value={11}>
            <CircleIcon
              sx={{
                marginRight: 1,
                maxHeight: 20,
                color:brown[500]
              }}/>
            ???
          </MenuItem>
          <MenuItem value={12}>
            <CircleIcon
              sx={{
                marginRight: 1,
                maxHeight: 20,
                color:grey[500]
              }}/>
            ???
          </MenuItem>
        </Select>
      </FormControl>
        </div>
      
      {show &&  <FormControl>
            <Stack spacing={2} direction="row" sx={{display: 'flex', alignItems: 'center'}}>
              <Typography variant="body1" gutterBottom component="div" sx={{ m: 1, marginRight: 0}}>
                ????????????????????????
              </Typography>
              <Button 
                variant="text" 
                sx={{ m: 1, marginLeft: 0, paddingLeft:0}}
                onClick={
                  ()=>{
                    history.push(`/keyword=${correction}`);
                    setCurrentPage(1)
                    search(correction, image, minW, minH, maxW, maxH, color, 1, size)
                    window.location.reload()
                  }
                }
                >{correction.toString().toLowerCase()}</Button>
            </Stack>
            </FormControl> }

        <div className='photo'>
        <Box sx={{ width: 1600}}>
        <ImageList cols={6}>
        {itemData.map((item) => (
            <ImageListItem
              sx = {{
              }}>
                <img
                    src={`${item.img}`}
                    srcSet={`${item.img}`}
                    alt={item.label}
                />
            <ImageListItemBar
                title={item.label}
                subtitle={item.width + " * " + item.height}
                actionIcon={
                <IconButton
                    sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                    aria-label={`info about ${item.label}`}
                    onClick={
                      ()=>{
                        window.open(item.img);
                      }}
                >
                    <InfoIcon />
                    </IconButton>
                }
            />
            </ImageListItem>
        ))}
        </ImageList>
        </Box>
        </div>

        <div className='page'>
            <Pagination
                onChange={
                    (event, value) => {
                      setCurrentPage(value)
                      search(keys[len - 1].substring(8), image, minW, minH, maxW, maxH, color, value, size)
                    }
                }
                count={pages} 
                defaultPage={1} 
                boundaryCount={1}
                showFirstButton 
                showLastButton/>
        </div>

        <Dialog open={open} onClose={handleClose}>
        <DialogTitle>????????????</DialogTitle>
        <DialogContent>
        <input style={{display:'block', alignItems: 'center'}} type="file" accept="image/*" onChange={selecteFileHandler}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={
            () => {
            handleClose()
            setSelectedFile(null)
            }}>
              ??????</Button>
          <Button onClick={
            () => {
              handleClose()
              if(selectedFile !== null)
                uploadHandler()
          }}
          >??????</Button>
        </DialogActions>
      </Dialog>

        <Dialog open={copen} onClose={handleCClose}>
          <DialogTitle>???????????????????????????</DialogTitle>
            <DialogContent>
            <Box 
                component="form"
                sx={{'& .MuiTextField-root': { m: 1, width: '25ch' }}}
                noValidate
                autoComplete="off">
            <div>
            <TextField 
              id="outlined-basic" 
              label="????????????"
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">px</InputAdornment>,
              }}
              onChange={
                (event) => {
                  setMinW(parseInt(event.target.value));
                }
              }
              />
            <TextField 
              id="outlined-basic" 
              label="????????????"
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">px</InputAdornment>,
              }}
              onChange={
                (event) => {
                  setMinH(parseInt(event.target.value));
                }
              }
              />
            </div>
            <div>
              <TextField 
              id="outlined-basic" 
              label="????????????"
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">px</InputAdornment>,
              }}
              onChange={
                (event) => {
                  setMaxW(parseInt(event.target.value));
                }
              }
              />
              <TextField 
              id="outlined-basic" 
              label="????????????"
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">px</InputAdornment>,
              }}
              onChange={
                (event) => {
                  setMaxH(parseInt(event.target.value));
                }
              } 
              />
            </div>
            </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={
                ()=>{
                  setMinW(0)
                  setMinH(0)
                  setMaxW(10000)
                  setMaxH(10000)
                  handleCClose()
                  }}>??????</Button>
              <Button onClick={
                ()=>{
                  search(keys[len - 1].substring(8), image, minW, minH, maxW, maxH, color, currentPage, size)
                  handleCClose()
                }}>??????</Button>
            </DialogActions>
        </Dialog>

        <Dialog open={aopen} onClose={handleAClose}>
        <DialogTitle>????????????</DialogTitle>
        <DialogContent>
        <div>
          <p>{transcript.toLowerCase()}</p>
        </div>
        <Stack spacing={2} direction="row">
        <Button sx = {{display: 'flex', alignItems: 'center'}} variant="contained" onClick={resetTranscript}>????????????</Button>
        </Stack>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              resetTranscript()
              handleAClose()
              SpeechRecognition.stopListening()
            }}
          >
            ??????
          </Button>
          <Button onClick={() => {
              if(transcript.toLowerCase() !== "") {
                history.push(`/keyword=${transcript.toLowerCase()}`);
                setCurrentPage(1)
                search(transcript.toLowerCase(), "", minW, minH, maxW, maxH, color, 1, size)
                keys = window.location.href.split('/');
                window.location.reload()
              }
              resetTranscript()
              handleAClose()
              SpeechRecognition.stopListening()
            }}>??????</Button>
        </DialogActions>
      </Dialog>
    </div>
    );
}

export default Result;
