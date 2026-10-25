import sys,json,pathlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT.parent/'.render-tools'/'whisper'))
from faster_whisper import WhisperModel
model=WhisperModel('base',device='cpu',compute_type='int8',download_root=str(ROOT.parent/'.render-tools'/'whisper-models'))
segments,info=model.transcribe(str(ROOT/'assets'/'voiceover.wav'),language='id',beam_size=5,word_timestamps=True,vad_filter=True)
rows=[]
for s in segments:
    row={'start':s.start,'end':s.end,'text':s.text,'words':[{'start':w.start,'end':w.end,'word':w.word} for w in s.words]}
    rows.append(row)
    print(f'{s.start:.2f} - {s.end:.2f}: {s.text}',flush=True)
(ROOT/'review'/'vo-alignment.json').write_text(json.dumps({'duration':info.duration,'segments':rows},ensure_ascii=False,indent=2),encoding='utf-8')
