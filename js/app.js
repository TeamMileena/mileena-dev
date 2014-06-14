html, body {
    margin: 0;
    padding: 0;
    color: #fff;
}
svg text{
    display:block;
    fill: #fff;
    font-family: calibri;
    font-weight: bold;
    text-anchor: middle;
}
/* Welcome screen */
#welcome-screen #title1 { font-size: 1400% }
#welcome-screen #title2 { font-size: 500%; fill: #0af }
#welcome-screen #btn-play { font-size: 500%; }
#welcome-screen #btn-play:hover{ cursor: pointer; fill:#444;}

/* Game over screen */
#game-over{
    display: none;
}
#game-over #game-over-title {
    font-size: 1400%;
    fill: #f00;
}
#game-over #btn-play-again{
    font-size: 500%;
}
#game-over #btn-play-again:hover{ cursor: pointer; fill:#444;}

/* Instructions */
#instructions {
    position: absolute;
    width: 500px;
    left:0;
    right:0;
    bottom: 1%;
    text-align: center;
    color: #0af;
    margin: auto;
 }
/* Score */
#score{
    display: none;
    position: absolute;
    top: 10%;
    left: 85%;
}
 #lives{
    display: none;
    position: absolute;
    top: 10%;
    left: 80%;
}
/* Canvas */
canvas {
    display: none;
    margin: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}
