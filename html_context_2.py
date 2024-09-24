import logging
import sys

logging.basicConfig(stream=sys.stdout, level=logging.INFO)
logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))

from llama_index.core import SummaryIndex
from llama_index.readers.web import SimpleWebPageReader
from IPython.display import Markdown, display
import os


from dotenv import load_dotenv

load_dotenv()

os.environ['OPENAI_API_KEY'] = os.environ.get('OPENAI_API_KEY')

def get_context(website_url):
    documents = SimpleWebPageReader(html_to_text=True).load_data([website_url])
    index = SummaryIndex.from_documents(documents)
    query_engine = index.as_query_engine()
    return query_engine


if __name__ == "__main__":
    context = get_context("https://www.greenwaveagri.com")
    display(Markdown(context.query("What is the company's mission?")))
    display(Markdown(context.query("What is the company's revenue?")))
    display(Markdown(context.query("What is the company's target market?")))
    display(Markdown(context.query("What is the company's unique value proposition?")))
    display(Markdown(context.query("What is the company's go-to-market strategy?")))
    display(Markdown(context.query("What is the company's revenue trend?")))
    