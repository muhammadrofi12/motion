"""Mix campaign music with deterministic synthesized paper and stamp sounds."""
from pathlib import Path
import wave, math, random
from array import array

root=Path(__file__).resolve().parents[1]
source=root.parent/'promosi-ocs-edu-segera-hadir/assets/teaser-music.wav'
with wave.open(str(source),'rb') as w:
    assert w.getsampwidth()==2 and w.getnchannels()==2
    rate=w.getframerate()
    original=array('h',w.readframes(w.getnframes()))
frames=rate*18
mix=[original[i]/32768*.63 for i in range(frames*2)]
rng=random.Random(231021)

def add(start,duration,level,kind,pan=0):
    low=0.0
    for j in range(int(duration*rate)):
        t=j/rate
        n=rng.uniform(-1,1)
        previous=low
        low+=.19*(n-low)
        band=low-previous*.65
        if kind=='paper':
            env=math.sin(math.pi*t/duration)**1.5
            signal=band*env*(.52+.48*math.sin(2*math.pi*43*t)**2)
        else:
            signal=math.sin(2*math.pi*(95*t-48*t*t))*math.exp(-t*30)*.7+band*math.exp(-t*85)
        i=int(start*rate)+j
        if i>=frames: break
        mix[2*i]+=signal*level*(1-pan*.35)
        mix[2*i+1]+=signal*level*(1+pan*.35)

for at,duration,level,pan in [(0.25,.6,.22,-.5),(3.05,.75,.30,0),(4.05,.48,.22,-.4),(4.6,.5,.18,.5),(5.25,.42,.19,-.2),(7.65,.85,.28,0),(8.9,.25,.23,-.6),(9.35,.25,.23,.6),(14.65,.7,.14,.25),(17.0,.75,.26,0)]:
    add(at,duration,level,'paper',pan)
add(11.55,.26,.65,'stamp')
peak=max(abs(x) for x in mix)
gain=min(1,.91/peak)
out=array('h')
for i,x in enumerate(mix):
    t=i/(rate*2)
    fade=min(1,t/.15,max(0,(18-t)/.4))
    out.append(int(max(-1,min(1,x*gain*fade))*32767))
with wave.open(str(root/'assets/paper-print-music.wav'),'wb') as w:
    w.setnchannels(2);w.setsampwidth(2);w.setframerate(rate);w.writeframes(out.tobytes())
print(f'18s stereo mix ready; peak {peak*gain:.3f}; stamp at 11.55s')
