# startup-desc-api
# Startup Descriptions Metrics Performance

This project provides tools and metrics to evaluate the performance of startup descriptions.

## Getting Started

### Prerequisites

Ensure you have the following installed:
- Python 3.x
- pip (Python package installer)
- Docker (for production setup)
- Docker Compose

### Running Locally



Main file: run1.py
To run the project locally, follow these steps:

1. Install the required dependencies:
    ```sh
    pip install -r requirements.txt
    ```
2. Add a .env file:
    OPENAI_API_KEY=''
    API_KEY='12345'
    WEBHOOK_URL=''

3. Start the application:
    ```sh
    docker-compose up --build
    ```

### Setting Up Docker for Production

To set up and run the application in a Docker container, use the following commands:

1. Build the Docker image:
    ```sh
    docker build -t startup-desc-api .
    ```

2. Run the Docker container:
    ```sh
    docker run startup-desc-api
    ```

## Contributing

We welcome contributions! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.

## Development Packages

The following libraries have been installed for development purposes, specifically for hallucination checks:
- `trulens`
- `trulens-apps-langchain`
- `trulens-providers-langchain`
- `trulens-providers-openai`

These packages help in verifying ground truthness, relevance, etc., once the WebSearch RAG Chain is attached.