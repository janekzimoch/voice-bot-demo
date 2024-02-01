## Installation

### Locally

#### Server

- enter server directory `cd kate-sales-associate/server`
- Install Python if you don't have it yet (https://www.python.org/downloads/)
- create python environment `python -m venv ./venv` and activate it `source ./venv/bin/activate`
- install python dependencies `pip install -r requirements.txt`
- install package salesgpt `pip install salesgpt` (this installes other neccesary dependencies - it might be possible to just add uvicorn to requirements.txt - TBD)
- create `.env` file with following environment variables (I will move them to Vercel later):

```
OPENAI_API_KEY=...
ELEVEN_LABS_API_KEY=...
ELEVEN_LABS_VOICE_ID=...
```

- run backend server `python run_api.py` -

#### Client

- ensure you have node.js installed
- enter client directory `cd kate-sales-associate/client`
- `npm install`
- `npm run dev`

#### Deployed

TBD

## Tech stack

- FE - Next.js
- BE - FastAPI
- DB - .json file stored locally in kate-sales-associate/server
