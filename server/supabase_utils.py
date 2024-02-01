import os
from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv())  # read local .env file


def user_login(supabase, token):
    # set the right key to enable RSL - security
    postgrest_client = supabase.postgrest
    postgrest_client.auth(token)


def user_logout(supabase, key):
    # after running queries - exceute this
    postgrest_client = supabase.postgrest
    postgrest_client.auth(key)


def is_not_empty(supabase):
    data = supabase.table("documents").select("id").execute()
    return len(data.data) > 0


def get_metadata(list_of_texts):
    contents = [par['content'] for par in list_of_texts]
    metadata = [{'page': par['page'], 'title': par['title']}
                for par in list_of_texts]
    return contents, metadata
