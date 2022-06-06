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

import { Predict } from '../communication/communication';

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

    useEffect(() => {
      setKeyword(keys[len - 1].substring(8))
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
      setCopen(true);
    };
  
    const handleCClose = () => {
      setCopen(false);
    };

    const handleChangeColor = (event) => {
      setColor(event.target.value);
      search(keys[len - 1].substring(8), "", minW, minH, maxW, maxH, event.target.value, currentPage, size)
    };

    const handleChangeSize = (event) => {
      setSize(event.target.value);
      setMinW(0)
      setMinH(0)
      setMaxW(10000)
      setMaxH(10000)
      if(event.target.value === 0 || event.target.value === 1 || event.target.value === 2 || event.target.value === 3) {
        search(keys[len - 1].substring(8), "", minW, minH, maxW, maxH, color, currentPage, event.target.value)
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

    const search = (key, path, min_width, min_height, max_width, max_height, color, page, size) => {
      const message = {
        key : key,
        path : path,
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
        search(keys[len - 1].substring(8), "", minW, minH, maxW, maxH, 0, 1, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);


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
                      label="在Sansi上搜索"
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
                <Tooltip title="语音输入">
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

                <Tooltip title="以图搜图">
                    <IconButton
                        onClick={handleClickOpen}
                        sx={{ p: '10px' }} 
                    >
                        <CameraAltIcon />
                    </IconButton>
                </Tooltip>

                <Tooltip title="搜索">
                    <IconButton 
                        sx={{ p: '10px' }}
                        onClick={() => {
                          if(keyword !== "") {
                            history.push(`/keyword=${keyword}`);
                            setCurrentPage(1)
                            search(keyword, "", minW, minH, maxW, maxH, color, 1, size)
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
        <Typography 
            variant="subtitle1" 
            gutterBottom component="div" 
            sx={{ m: 5, marginLeft: 20, marginRight: 15, color:grey[600]}}   
        >
          Sansi为您找到相关结果共{count}个，耗时约{time}毫秒
        </Typography>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120, minHeight:60, marginRight: 6, marginTop: 3}}>
        <InputLabel>图片尺寸</InputLabel>
        <Select
          value={size}
          label="图片尺寸"
          onChange={handleChangeSize}
        >
          <MenuItem value={0}>全部</MenuItem>
          <MenuItem value={1}>小</MenuItem>
          <MenuItem value={2}>中</MenuItem>
          <MenuItem value={3}>大</MenuItem>
          <MenuItem 
            value={5}
            onClick={
              ()=>{
                if(copen === false)
                  setCopen(true)
              }
            }>自定义</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120, minHeight:60, marginTop: 3}}>
        <InputLabel>图片颜色</InputLabel>
        <Select
          value={color}
          label="图片颜色"
          onChange={handleChangeColor}
        >
          <MenuItem value={0}>
              全部
          </MenuItem>
          <MenuItem value={1}>
              彩色
          </MenuItem>
          <MenuItem value={2}>
              黑白
          </MenuItem>
          <MenuItem value={3}>
            <CircleIcon
              sx={{
                marginRight: 1,
                maxHeight: 20,
                color:red[500]
              }}/>
            红
          </MenuItem>
          <MenuItem value={4}>
            <CircleIcon
              sx={{
                marginRight: 1,
                maxHeight: 20,
                color:orange[500]
              }}/>
            橙
          </MenuItem>
          <MenuItem value={5}>
            <CircleIcon
              sx={{
                marginRight: 1,
                maxHeight: 20,
                color:yellow[500]
              }}/>
            黄
          </MenuItem>
          <MenuItem value={6}>
            <CircleIcon
              sx={{
                marginRight: 1,
                maxHeight: 20,
                color:green[500]
              }}/>
            绿
          </MenuItem>
          <MenuItem value={7}>
            <CircleIcon
              sx={{
                marginRight: 1,
                maxHeight: 20,
                color:cyan[500]
              }}/>
            青
          </MenuItem>
          <MenuItem value={8}>
            <CircleIcon
              sx={{
                marginRight: 1,
                maxHeight: 20,
                color:blue[500]
              }}/>
            蓝
          </MenuItem>
          <MenuItem value={9}>
            <CircleIcon
              sx={{
                marginRight: 1,
                maxHeight: 20,
                color:purple[500]
              }}/>
            紫
          </MenuItem>
          <MenuItem value={10}>
            <CircleIcon
              sx={{
                marginRight: 1,
                maxHeight: 20,
                color:pink[500]
              }}/>
            粉
          </MenuItem>
          <MenuItem value={11}>
            <CircleIcon
              sx={{
                marginRight: 1,
                maxHeight: 20,
                color:brown[500]
              }}/>
            棕
          </MenuItem>
          <MenuItem value={12}>
            <CircleIcon
              sx={{
                marginRight: 1,
                maxHeight: 20,
                color:grey[500]
              }}/>
            灰
          </MenuItem>
        </Select>
      </FormControl>
        </div>
      
      {show &&  <FormControl>
            <Stack spacing={2} direction="row" sx={{display: 'flex', alignItems: 'center'}}>
              <Typography variant="body1" gutterBottom component="div" sx={{ m: 1, marginRight: 0}}>
                您要找的是不是：
              </Typography>
              <Button 
                variant="text" 
                sx={{ m: 1, marginLeft: 0, paddingLeft:0}}
                onClick={
                  ()=>{
                    history.push(`/keyword=${correction}`);
                    setCurrentPage(1)
                    search(correction, "", minW, minH, maxW, maxH, color, 1, size)
                    window.location.reload()
                  }
                }
                >{correction}</Button>
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
                      search(keys[len - 1].substring(8), "", minW, minH, maxW, maxH, "000000000000", value, size)
                    }
                }
                count={pages} 
                defaultPage={1} 
                boundaryCount={1}
                showFirstButton 
                showLastButton/>
        </div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>以图搜图</DialogTitle>
            <DialogContent>
              <input style={{display:'block', alignItems: 'center'}} type="file" accept="image/*" onChange={selecteFileHandler}/>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>关闭</Button>
              <Button onClick={handleClose}>确认</Button>
            </DialogActions>
        </Dialog>

        <Dialog open={copen} onClose={handleCClose}>
          <DialogTitle>自定义图片尺寸筛选</DialogTitle>
            <DialogContent>
            <Box 
                component="form"
                sx={{'& .MuiTextField-root': { m: 1, width: '25ch' }}}
                noValidate
                autoComplete="off">
            <div>
            <TextField 
              id="outlined-basic" 
              label="最小宽度"
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
              label="最小高度"
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
              label="最大宽度"
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
              label="最大高度"
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
                  }}>关闭</Button>
              <Button onClick={
                ()=>{
                  search(keys[len - 1].substring(8), "", minW, minH, maxW, maxH, color, currentPage, size)
                  handleCClose()
                }}>确认</Button>
            </DialogActions>
        </Dialog>

        <Dialog open={aopen} onClose={handleAClose}>
        <DialogTitle>语音输入</DialogTitle>
        <DialogContent>
        <div>
          <p>{transcript.toLowerCase()}</p>
        </div>
        <Stack spacing={2} direction="row">
        <Button sx = {{display: 'flex', alignItems: 'center'}} variant="contained" onClick={resetTranscript}>重新输入</Button>
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
            关闭
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
            }}>确认</Button>
        </DialogActions>
      </Dialog>
    </div>
    );
}

export default Result;
