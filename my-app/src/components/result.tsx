import './result.css';
import tsinghua from '../images/tsinghua.png'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
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
import { red, orange, yellow, green, grey, blue, brown, cyan, purple } from '@mui/material/colors';

import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';


function Result() {
    const [keyword, setKeyword] = useState('');
    const history = useHistory();
    const keys = window.location.href.split('/');
    const len = keys.length;
    useEffect(() => {
        setKeyword(keys[len - 1].substring(8))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const [color, setColor] = useState('');
    const [size, setSize] = useState('');

    const [copen, setCopen] = useState(false);

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
    };

    const handleChangeSize = (event) => {
        setSize(event.target.value);
        setMinL("")
        setMinW("")
        setMaxL("")
        setMaxW("")
        if(event.target.value === 6)
          handleCClickOpen();
    };

    const [open, setOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState('');

    const selecteFileHandler = (event) => {
      setSelectedFile(event.target.files[0]);
    };

    const [minL, setMinL] = useState('')
    const [minW, setMinW] = useState('')
    const [maxL, setMaxL] = useState('')
    const [maxW, setMaxW] = useState('')

    const [show, setShow] = useState(true)


    return (
        <div className="App1">
            <div className="search">
                <div className='block'>
                  <img 
                    src={tsinghua} 
                    className="App-logo1" 
                    alt="" 
                    onClick={() => {
                      history.push(`/`);
                    }}/>
                  <Paper component="form" elevation={4} sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 600 }}>
                <InputBase 
                    sx={{ ml: 1, flex: 1 }} 
                    defaultValue={decodeURIComponent(keys[len - 1].substring(8))}
                    onChange={(event) => {
                        setKeyword(event.target.value);
                    }}
                />

                <Tooltip title="语音输入">
                    <IconButton
                        sx={{ p: '10px' }}
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
          谷歌为您找到相关结果共{100}个，耗时约{120}毫秒
        </Typography>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120, minHeight:60, marginRight: 6, marginTop: 3}}>
        <InputLabel>图片尺寸</InputLabel>
        <Select
          value={size}
          label="图片尺寸"
          onChange={handleChangeSize}
        >
          <MenuItem value={1}>全部</MenuItem>
          <MenuItem value={2}>小</MenuItem>
          <MenuItem value={3}>中</MenuItem>
          <MenuItem value={4}>大</MenuItem>
          <MenuItem value={5}>特大</MenuItem>
          <MenuItem 
            value={6}
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
          <MenuItem value={1}>
              全部
          </MenuItem>
          <MenuItem value={2}>
              彩色
          </MenuItem>
          <MenuItem value={3}>
              黑白
          </MenuItem>
          <MenuItem value={4}>
            <CircleIcon
              sx={{
                marginRight: 1,
                maxHeight: 20,
                color:red[500]
              }}/>
            红
          </MenuItem>
          <MenuItem value={5}>
            <CircleIcon
              sx={{
                marginRight: 1,
                maxHeight: 20,
                color:orange[500]
              }}/>
            橙
          </MenuItem>
          <MenuItem value={6}>
            <CircleIcon
              sx={{
                marginRight: 1,
                maxHeight: 20,
                color:yellow[500]
              }}/>
            黄
          </MenuItem>
          <MenuItem value={7}>
            <CircleIcon
              sx={{
                marginRight: 1,
                maxHeight: 20,
                color:green[500]
              }}/>
            红
          </MenuItem>
          <MenuItem value={8}>
            <CircleIcon
              sx={{
                marginRight: 1,
                maxHeight: 20,
                color:cyan[500]
              }}/>
            青
          </MenuItem>
          <MenuItem value={9}>
            <CircleIcon
              sx={{
                marginRight: 1,
                maxHeight: 20,
                color:blue[500]
              }}/>
            蓝
          </MenuItem>
          <MenuItem value={10}>
            <CircleIcon
              sx={{
                marginRight: 1,
                maxHeight: 20,
                color:purple[500]
              }}/>
            紫
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
              <Button variant="text" sx={{ m: 1, marginLeft: 0, paddingLeft:0}}>王鸿杰</Button>
            </Stack>
            </FormControl> }

        <div className='photo'>
        <Box sx={{ width: 1600}}>
        <ImageList  cols={6}>
        {itemData.map((item) => (
            <ImageListItem key={item.img}>
                <img
                    src={`${item.img}?w=242&fit=crop&auto=format`}
                    srcSet={`${item.img}?w=242&fit=crop&auto=format&dpr=2 2x`}
                    alt={item.title}
                    loading="lazy"
                />
            <ImageListItemBar
                title={item.title}
                subtitle={item.author}
                actionIcon={
                <IconButton
                    sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                    aria-label={`info about ${item.title}`}
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
                        console.log(value)
                    }
                }
                count={11} 
                defaultPage={6} 
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
          <DialogTitle>自定义图片大小</DialogTitle>
            <DialogContent>
            <Box 
                component="form"
                sx={{'& .MuiTextField-root': { m: 1, width: '25ch' }}}
                noValidate
                autoComplete="off">
            <div>
            <TextField 
              id="outlined-basic" 
              label="最小长度"
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">px</InputAdornment>,
              }}
              onChange={
                (event) => {
                  setMinL(event.target.value);
                }
              }
              />
            <TextField 
              id="outlined-basic" 
              label="最小宽度"
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">px</InputAdornment>,
              }}
              onChange={
                (event) => {
                  setMinW(event.target.value);
                }
              }
              />
            </div>
            <div>
              <TextField 
              id="outlined-basic" 
              label="最大长度"
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">px</InputAdornment>,
              }}
              onChange={
                (event) => {
                  setMaxL(event.target.value);
                }
              }
              />
              <TextField 
              id="outlined-basic" 
              label="最大宽度"
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">px</InputAdornment>,
              }}
              onChange={
                (event) => {
                  setMaxW(event.target.value);
                }
              } 
              />
            </div>
            </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={
                ()=>{
                  setMinL("")
                  setMinW("")
                  setMaxL("")
                  setMaxW("")
                  handleCClose()
                  }}>关闭</Button>
              <Button onClick={
                ()=>{
                  handleCClose()
                }}>确认</Button>
            </DialogActions>
        </Dialog>
    </div>
    );
}


const itemData = [
    {
      img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
      title: 'Breakfast',
      author: '@bkristastucchio',
      rows: 2,
      cols: 2,
      featured: true,
    },
    {
      img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
      title: 'Burger',
      author: '@rollelflex_graphy726',
    },
    {
      img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
      title: 'Camera',
      author: '@helloimnik',
    },
    {
      img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
      title: 'Coffee',
      author: '@nolanissac',
      cols: 2,
    },
    {
      img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
      title: 'Hats',
      author: '@hjrc33',
      cols: 2,
    },
    {
      img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
      title: 'Honey',
      author: '@arwinneil',
      rows: 2,
      cols: 2,
      featured: true,
    },
    {
      img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
      title: 'Basketball',
      author: '@tjdragotta',
    },
    {
      img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
      title: 'Fern',
      author: '@katie_wasserman',
    },
    {
      img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
      title: 'Mushrooms',
      author: '@silverdalex',
      rows: 2,
      cols: 2,
    },
    {
      img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
      title: 'Tomato basil',
      author: '@shelleypauls',
    },
    {
      img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
      title: 'Sea star',
      author: '@peterlaster',
    },
    {
      img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
      title: 'Bike',
      author: '@southside_customs',
      cols: 2,
    },
    {
        img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
        title: 'Breakfast',
        author: '@bkristastucchio',
        rows: 2,
        cols: 2,
        featured: true,
      },
      {
        img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
        title: 'Burger',
        author: '@rollelflex_graphy726',
      },
      {
        img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
        title: 'Camera',
        author: '@helloimnik',
      },
      {
        img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
        title: 'Coffee',
        author: '@nolanissac',
        cols: 2,
      },
      {
        img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
        title: 'Hats',
        author: '@hjrc33',
        cols: 2,
      },
      {
        img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
        title: 'Honey',
        author: '@arwinneil',
        rows: 2,
        cols: 2,
        featured: true,
      },
      {
        img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
        title: 'Basketball',
        author: '@tjdragotta',
      },
      {
        img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
        title: 'Fern',
        author: '@katie_wasserman',
      },
      {
        img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
        title: 'Mushrooms',
        author: '@silverdalex',
        rows: 2,
        cols: 2,
      },
      {
        img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
        title: 'Tomato basil',
        author: '@shelleypauls',
      },
      {
        img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
        title: 'Sea star',
        author: '@peterlaster',
      },
      {
        img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
        title: 'Bike',
        author: '@southside_customs',
        cols: 2,
      },
      {
        img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
        title: 'Breakfast',
        author: '@bkristastucchio',
        rows: 2,
        cols: 2,
        featured: true,
      },
      {
        img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
        title: 'Burger',
        author: '@rollelflex_graphy726',
      },
      {
        img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
        title: 'Camera',
        author: '@helloimnik',
      },
      {
        img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
        title: 'Coffee',
        author: '@nolanissac',
        cols: 2,
      },
      {
        img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
        title: 'Hats',
        author: '@hjrc33',
        cols: 2,
      },
      {
        img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
        title: 'Honey',
        author: '@arwinneil',
        rows: 2,
        cols: 2,
        featured: true,
      },
      {
        img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
        title: 'Basketball',
        author: '@tjdragotta',
      },
      {
        img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
        title: 'Fern',
        author: '@katie_wasserman',
      },
      {
        img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
        title: 'Mushrooms',
        author: '@silverdalex',
        rows: 2,
        cols: 2,
      },
      {
        img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
        title: 'Tomato basil',
        author: '@shelleypauls',
      },
      {
        img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
        title: 'Sea star',
        author: '@peterlaster',
      },
      {
        img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
        title: 'Bike',
        author: '@southside_customs',
        cols: 2,
      },
  ];

export default Result;
