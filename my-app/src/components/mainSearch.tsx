import './mainSearch.css';
import tsinghua from '../images/tsinghua.png'
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import Tooltip from '@mui/material/Tooltip';

import { useHistory } from 'react-router-dom';
import { useState } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';

import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function MainSearch() {
    const history = useHistory();
    const [keyword, setKeyword] = useState('');

    const [open, setOpen] = useState(false);
    const [aopen, setAopen] = useState(false);
    const [selectedFile, setSelectedFile] = useState('');

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const handleAClickOpen = () => {
      setAopen(true);
    };
  
    const handleAClose = () => {
      setAopen(false);
    };

    const selecteFileHandler = (event) => {
      setSelectedFile(event.target.files[0]);
    };

    
    const {
      transcript,
      listening,
      resetTranscript,
      browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    
    return (
        <div className="App">
          
      <header className="App-header">
        <img src={tsinghua} className="App-logo" alt="" />
        <Paper component="form" elevation={4} sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 600 }}>
          <InputBase 
            sx={{ ml: 1, flex: 1 }} 
            placeholder="在Google上搜索"
            onChange={(event) => {
              setKeyword(event.target.value);
            }}
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
              sx={{ p: '10px' }}
              onClick={handleClickOpen}
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
                  // Test('test1', 'test56')
                }
              }}
            >

              <SearchIcon/>
            
            </IconButton>
          </Tooltip>
        </Paper>
      </header>

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

      <Dialog open={aopen} onClose={handleAClose}>
        <DialogTitle>语音输入</DialogTitle>
        <DialogContent>
        <div>
          <p>Microphone: {listening ? 'on' : 'off'}</p>
            <button onClick={SpeechRecognition.startListening}>Start</button>
            <button onClick={SpeechRecognition.stopListening}>Stop</button>
            <button onClick={resetTranscript}>Reset</button>
            <p>{transcript}</p>
        </div>
        </DialogContent>
        <DialogActions>
          <Button 
          onClick={() => {
              resetTranscript()
              handleAClose()
            }}
            >
              关闭</Button>
          <Button onClick={handleAClose}>确认</Button>
        </DialogActions>
      </Dialog>

    </div>
    );
}

export default MainSearch;
