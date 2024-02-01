This is a quick MVP that combines high latency vocie generation from ElevenLabs with LLM reasoning capabilities and a simple vanila RAG system.
I put together this demo in 24 hours to demonstrate potentail of latest AI advancements to automate call centers / voice customer support / voice sales.

## Installation

#### Server

- enter server directory `cd voice-bot-demo/server`
- Install Python if you don't have it yet (https://www.python.org/downloads/)
- create python environment `python -m venv ./venv` and activate it `source ./venv/bin/activate`
- install python dependencies `pip install -r requirements.txt`
- install package salesgpt `pip install salesgpt` (this installes other neccesary dependencies - it might be possible to just add uvicorn to requirements.txt - TBD)
- create `.env` file with following environment variables:

```
OPENAI_API_KEY=...
ELEVEN_LABS_API_KEY=...
ELEVEN_LABS_VOICE_ID=...
```

- run backend server `python run_api.py` -

#### Client

- ensure you have node.js installed
- enter client directory `cd voice-bot-demo/client`
- `npm install`
- `npm run dev`

#### Deployed

TBD

## Tech stack

- FE - Next.js
- BE - FastAPI
- DB - .json file stored locally in kate-sales-associate/server
