import React, { useState, useEffect } from "react";
import { Container, VStack, Text, Box, Button, Input } from "@chakra-ui/react";
import { FaPlay, FaPause } from "react-icons/fa";
import ReactPlayer from "react-player";
import { parse } from "subtitle";

const Index = () => {
  const [audioUrl, setAudioUrl] = useState("");
  const [subtitles, setSubtitles] = useState([]);
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [playing, setPlaying] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [srtFile, setSrtFile] = useState(null);

  useEffect(() => {
    if (audioFile) {
      const url = URL.createObjectURL(audioFile);
      setAudioUrl(url);
    }
  }, [audioFile]);

  useEffect(() => {
    if (srtFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const parsedSubtitles = parse(e.target.result);
        setSubtitles(parsedSubtitles);
      };
      reader.readAsText(srtFile);
    }
  }, [srtFile]);

  const handleProgress = ({ playedSeconds }) => {
    const current = subtitles.find((subtitle) => playedSeconds >= subtitle.start / 1000 && playedSeconds <= subtitle.end / 1000);
    if (current) {
      setCurrentSubtitle(current.text);
    } else {
      setCurrentSubtitle("");
    }
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4} width="100%">
        <Input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files[0])} />
        <Input type="file" accept=".srt" onChange={(e) => setSrtFile(e.target.files[0])} />
        {audioUrl && (
          <Box width="100%">
            <ReactPlayer url={audioUrl} playing={playing} onProgress={handleProgress} controls width="100%" height="50px" />
            <Button onClick={() => setPlaying(!playing)} leftIcon={playing ? <FaPause /> : <FaPlay />}>
              {playing ? "Pause" : "Play"}
            </Button>
          </Box>
        )}
        <Box borderWidth="1px" borderRadius="lg" padding="4" width="100%" textAlign="center">
          <Text fontSize="xl">{currentSubtitle}</Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default Index;
