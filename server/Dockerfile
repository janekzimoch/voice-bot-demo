FROM python:3.10

WORKDIR /

COPY ./ /

RUN pip3 install -r requirements.txt

RUN pip3 install salesgpt

EXPOSE 4001

CMD ["uvicorn", "run_api:app", "--host", "0.0.0.0", "--port", "4001"]

# docker build -t server .
# docker run -d --name server -p 4001:4001 server
# locally: uvicorn server:app --host 0.0.0.0 --port 5433