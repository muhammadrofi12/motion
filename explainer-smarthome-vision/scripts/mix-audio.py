"""Keep the supplied VO timing; add an original quiet music bed and UI effects."""
import wave,json
from pathlib import Path
import numpy as np
from scipy.ndimage import uniform_filter1d
ROOT=Path(__file__).resolve().parents[1]
with wave.open(str(ROOT/'assets'/'voiceover.wav'),'rb') as w:
    sr=w.getframerate();channels=w.getnchannels();voice=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').astype(np.float64)/32768
voice=voice.reshape(-1,channels).mean(axis=1);n=len(voice);t=np.arange(n)/sr
envelope=np.sqrt(uniform_filter1d(voice*voice,size=int(sr*.18))+1e-10)
duck=1-.7*np.clip(envelope/.07,0,1)
bed=np.zeros(n);bpm=87;beat=60/bpm
# Warm, unobtrusive major-seventh progression; no third-party music samples.
chords=[(146.832,184.997,220,277.183),(130.813,164.814,195.998,246.942),(110,138.591,164.814,207.652),(123.471,155.563,184.997,233.082)]
for start in np.arange(0,len(voice)/sr,beat*8):
    notes=chords[int(start/(beat*8))%4];a=int(start*sr);count=min(n-a,int((beat*8+.7)*sr));x=np.arange(count)/sr
    env=np.minimum(x/.35,1)*np.clip((beat*8+.7-x)/.9,0,1)
    for f in notes:bed[a:a+count]+=.0058*env*(np.sin(2*np.pi*f*x)+.17*np.sin(2*np.pi*f*2*x))
for i,start in enumerate(np.arange(.15,len(voice)/sr,beat)):
    a=int(start*sr);count=min(n-a,int(.13*sr));x=np.arange(count)/sr
    bed[a:a+count]+=.012*np.exp(-x*36)*np.sin(2*np.pi*(90*x-95*x*x))
    if i%2==1:bed[a:a+count]+=.004*np.exp(-x*65)*np.sin(2*np.pi*6200*x)
sfx=np.zeros((n,2));rng=np.random.default_rng(20261024)
def chime(start,frequency=900,duration=.22,level=.025,pan=0):
    a=int(start*sr);count=min(n-a,int(duration*sr));x=np.arange(count)/sr
    v=level*np.sin(2*np.pi*frequency*x)*np.exp(-x*17)*np.minimum(x/.006,1)
    sfx[a:a+count,0]+=v*(1-pan*.5);sfx[a:a+count,1]+=v*(1+pan*.5)
def whoosh(start,duration=.5,level=.012):
    a=int(start*sr);count=min(n-a,int(duration*sr));x=np.arange(count)/sr
    noise=uniform_filter1d(rng.normal(0,1,count),size=7);v=level*noise*np.sin(np.pi*x/duration)**2
    sfx[a:a+count]+=v[:,None]
for k,v in enumerate([1.8,2.5,3.2,15.4,24.45,37.5,46.6,51,54.45,58.2,65.1,67.5,70.3,76.8]):chime(v,[660,880,1100][k%3],pan=(-.3 if k%2 else .3))
for v in [7.1,10.4,14.9,24,37.05,46.1,72.2]:whoosh(v)
fade=np.minimum(t/.2,1)*np.clip((n/sr-t)/.28,0,1)
music=bed*duck*fade
mix=voice[:,None]*np.ones((1,2))+music[:,None]+sfx
peak=float(abs(mix).max());gain=min(1,.96/peak);mix*=gain
with wave.open(str(ROOT/'assets'/'soundtrack.wav'),'wb') as w:
    w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes((mix*32767).astype('<i2').tobytes())
report={'duration':n/sr,'sampleRate':sr,'sourceChannels':channels,'outputChannels':2,'peakBeforeGain':peak,'gain':gain,'peakAfterGain':float(abs(mix).max()),'voiceTimeStretch':False,'music':'Original synthesized bed, speech ducked','effects':'Original procedural chimes and whooshes'}
(ROOT/'review'/'audio-report.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))
