import json

from langchain.chat_models import ChatLiteLLM
from pydantic import BaseModel

from salesgpt.agents import SalesGPT

GPT_MODEL = "gpt-3.5-turbo-0613"


class SettingsExtended(BaseModel):
    salesperson_name: str
    salesperson_role: str
    company_name: str
    company_business: str
    company_values: str
    conversation_purpose: str
    custom_prompt: str
    conversation_type: str
    use_custom_prompt: bool


class SalesGPTAPI:
    USE_TOOLS = False

    def __init__(
        self, config: SettingsExtended, verbose: bool = False, max_num_turns: int = 10
    ):
        self.config = config
        self.verbose = verbose
        self.max_num_turns = max_num_turns
        self.llm = ChatLiteLLM(temperature=0.2, model_name=GPT_MODEL)

    def do(self, conversation_history: [str], human_input=None):
        sales_agent = SalesGPT.from_llm(
            self.llm, verbose=self.verbose, **self.config)

        #  check turns
        current_turns = len(conversation_history) + 1
        if current_turns >= self.max_num_turns:
            # todo:
            # if self.verbose:
            print("Maximum number of turns reached - ending the conversation.")
            return "<END_OF_>"

        # seed
        sales_agent.seed_agent()
        sales_agent.conversation_history = conversation_history

        if human_input is not None:
            sales_agent.human_step(human_input)
            # sales_agent.determine_conversation_stage()
            # print('=' * 10)
            # print(f"conversation_stage_id:{sales_agent.conversation_stage_id}")

        sales_agent.step()

        # end conversation
        if "<END_OF_CALL>" in sales_agent.conversation_history[-1]:
            sales_agent.conversation_history[-1] = sales_agent.conversation_history[-1].replace(
                "<END_OF_CALL>", "\n\n --- END OF CONVERSATION")

        reply = sales_agent.conversation_history[-1]

        if self.verbose:
            print("=" * 10)
            print(f"{sales_agent.salesperson_name}:{reply}")
        return reply.split(": ")
