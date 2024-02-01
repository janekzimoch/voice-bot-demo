import os
from typing import List
import json
import requests

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Depends, Request

import supabase_utils as utils
from auth_utils import (access_token, get_user_id)

from supabase import (create_client, Client)
from supabase.lib.client_options import ClientOptions
from salesgpt.salesgptapi import SalesGPTAPI


load_dotenv()

app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Which HTTP methods to allow
    allow_headers=["*"],  # Which HTTP headers to allow
)

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
schema: str = os.environ.get("SUPABASE_SCHEMA")
supabase: Client = create_client(
    url, key, options=ClientOptions(schema=schema))


JSON_AGENT_PROFILE_FILE = "./examples/example_agent_setup.json"
GPT_MODEL = "gpt-3.5-turbo-0613"


class MessageList(BaseModel):
    conversation_history: List[str]
    human_say: str


class Settings(BaseModel):
    salesperson_name: str
    salesperson_role: str
    company_name: str
    company_business: str
    company_values: str
    conversation_purpose: str
    custom_prompt: str


class Message(BaseModel):
    msg: str


class VoiceSettings(BaseModel):
    similarity_boost: float
    stability: float


class ElevenLabsRequest(BaseModel):
    text: str
    voice_settings: VoiceSettings


@app.get("/")
async def say_hello():
    return {"message": "Hello World"}


@app.post("/chat")
async def chat_with_sales_agent(req: MessageList, token: str = Depends(access_token)):
    try:
        print('LOGS, token: ', token)
        print('req: ', req)
        utils.user_login(supabase, token)
        settings = supabase.table("settings").select("*").execute().data[0]
        print('LOGS, token: ', token)
        sales_api = SalesGPTAPI(
            config=settings, verbose=True, max_num_turns=200
        )
        print('LOGS, sales_api object succesful')
        name, reply = sales_api.do(req.conversation_history, req.human_say)
        print(f'LOGS, name: {name}, reply: {reply}')
        res = {"name": name, "say": reply, "end": False}
        return res
    except Exception as err:
        print(err)
        return {"name": name, "say": "Thanks, for the call, Bye.", "end": True}
    finally:
        utils.user_logout(supabase, key)


@app.get("/settings")
async def get_settings(token: str = Depends(access_token)):
    utils.user_login(supabase, token)
    settings = supabase.table("settings").select("*").execute().data[0]
    utils.user_logout(supabase, key)
    return settings, settings['id']


@app.post("/settings/{id}")
async def set_settings(req: Settings, id: int, token: str = Depends(access_token)):
    try:
        utils.user_login(supabase, token)
        # we append two more properties which are not exposed in the UI
        settings = req.__dict__
        settings["conversation_type"] = "call"
        settings["use_custom_prompt"] = True
        data = supabase.table("settings").update(
            settings).eq('id', id).execute()
        return {'success'}
    except Exception as err:
        print(err)
    finally:
        utils.user_logout(supabase, key)


@app.post("/voice")
async def generate_voice(req: ElevenLabsRequest):
    voice_id = "21m00Tcm4TlvDq8ikWAM"
    model_id = "eleven_monolingual_v1"
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/stream?optimize_streaming_latency=2"
    payload = {
        "model_id": model_id,
        "text": req.text,
        "voice_settings": {
            "similarity_boost": req.voice_settings.similarity_boost,
            "stability": req.voice_settings.stability,
        }
    }
    headers = {"Content-Type": "application/json",
               "Accept": "audio/mpeg",
               "xi-api-key": os.environ["ELEVEN_LABS_API_KEY"]
               }
    try:
        response = requests.post(
            url, json=payload, headers=headers)  # , stream=True)
    except requests.exceptions.HTTPError as err:
        raise SystemExit(err)
    return StreamingResponse(response.iter_content(4096), media_type='audio/mpeg')


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
