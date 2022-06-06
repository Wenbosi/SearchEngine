import './mainSearch.css';
import tsinghua from '../images/tsinghua.png'
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
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
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import cookies from 'react-cookies';

import { createSpeechlySpeechRecognition } from '@speechly/speech-recognition-polyfill';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

import { Predict, Upload } from '../communication/communication';

const appId = 'c94b5e3c-1314-4718-8927-c6e8de71ca59';
const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

function MainSearch() {
    const history = useHistory();
    const [keyword, setKeyword] = useState('');
    const [open, setOpen] = useState(false);
    const [aopen, setAopen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [wordList, setWordList] = useState([])

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const handleAClickOpen = () => {
      setAopen(true);
      startListening();
    };
  
    const handleAClose = () => {
      setAopen(false);
    };

    const selecteFileHandler = (event) => {
      setSelectedFile(event.target.files[0]);
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

    return (
        <div className="App">
          
      <header className="App-header">
        <img src={tsinghua} className="App-logo" alt="" />
        <Paper component="form" elevation={0} sx={{  display: 'flex', alignItems: 'center', width: 700 }}>
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
            console.log(newInputValue)
            setKeyword(newInputValue);
            predict(newInputValue);
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
          <Button onClick={
            () => {
            handleClose()
            setSelectedFile(null)
            }}>
              关闭</Button>
          <Button onClick={
            () => {
              handleClose()
              if(selectedFile !== null)
                uploadHandler()
          }}
          >确认</Button>
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
              if(transcript.toLowerCase() !== "")
                history.push(`/keyword=${transcript.toLowerCase()}`);
              resetTranscript()
              handleAClose()
              SpeechRecognition.stopListening()
            }}>确认</Button>
        </DialogActions>
      </Dialog>

    </div>
    );
}

export default MainSearch;
